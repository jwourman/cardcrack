/**
 * CardCrack seed script
 * Usage: npx ts-node --project tsconfig.seed.json scripts/seed.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file not found.");
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key) process.env[key] = val;
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN!;

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace("https://", "").split(".")[0];

function postJson(hostname: string, path: string, body: object, token: string): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = https.request(
      {
        hostname,
        port: 443,
        path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(bodyStr),
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, data }));
      }
    );
    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

async function main() {
  console.log("🌱 CardCrack Seeder");
  console.log("==================");
  console.log(`📡 Project: ${projectRef}`);
  console.log("");

  if (!SUPABASE_ACCESS_TOKEN) {
    console.error("❌ Missing SUPABASE_ACCESS_TOKEN in .env");
    console.error("   Get one at: https://supabase.com/dashboard/account/tokens");
    process.exit(1);
  }

  const seedPath = path.join(process.cwd(), "supabase", "seed.sql");
  if (!fs.existsSync(seedPath)) {
    console.error("❌ supabase/seed.sql not found");
    process.exit(1);
  }

  const sql = fs.readFileSync(seedPath, "utf-8");
  console.log(`📋 Running seed.sql (${(sql.length / 1024).toFixed(1)}KB)...`);

  const result = await postJson(
    "api.supabase.com",
    `/v1/projects/${projectRef}/database/query`,
    { query: sql },
    SUPABASE_ACCESS_TOKEN
  );

  if (result.status >= 200 && result.status < 300) {
    console.log("✅ Seed completed successfully!");
  } else {
    console.error(`❌ Seed failed (HTTP ${result.status}):`);
    console.error(result.data);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
