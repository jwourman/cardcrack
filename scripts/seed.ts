/**
 * CardCrack seed script
 * Usage: npm run seed
 *
 * Requires: .env with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * Requires: schema.sql already applied to your Supabase project
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// Load env from .env
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file not found. Copy .env.example to .env first.");
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length > 0) {
      process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

async function executeSql(sql: string): Promise<void> {
  const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const isHttps = url.protocol === "https:";
    const lib = isHttps ? https : http;

    const req = lib.request(
      {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          apikey: SERVICE_KEY!,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log("🌱 CardCrack Seeder");
  console.log("==================");
  console.log(`📡 Supabase: ${SUPABASE_URL}`);
  console.log("");
  console.log("ℹ️  This seeder uses the SQL file at supabase/seed.sql");
  console.log("ℹ️  To run it, use the Supabase SQL editor or supabase CLI:");
  console.log("");
  console.log("  Option 1: Supabase Dashboard SQL Editor");
  console.log("  → Copy contents of supabase/seed.sql and run in SQL editor");
  console.log("");
  console.log("  Option 2: Supabase CLI");
  console.log("  → supabase db seed");
  console.log("");
  console.log("  Option 3: psql direct connection");
  console.log("  → psql YOUR_DB_URL < supabase/seed.sql");
  console.log("");

  const seedPath = path.join(process.cwd(), "supabase", "seed.sql");
  if (fs.existsSync(seedPath)) {
    const content = fs.readFileSync(seedPath, "utf-8");
    console.log(`✅ seed.sql found (${(content.length / 1024).toFixed(1)}KB)`);
    console.log("📋 Copy and run it in your Supabase SQL editor.");
  } else {
    console.error("❌ supabase/seed.sql not found");
  }
}

main();
