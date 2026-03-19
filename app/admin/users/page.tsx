import { createServiceClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users | Admin" };

export default async function AdminUsersPage() {
  const supabase = await createServiceClient();

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("user_id, status")
    .in("status", ["active", "trialing"]);

  const activeSubUserIds = new Set((subscriptions ?? []).map((s) => s.user_id));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Users</h1>
      <p className="text-gray-500 text-sm mb-8">{users?.length ?? 0} registered users</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase">User</th>
                <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase">Role</th>
                <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase">Subscription</th>
                <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((user) => (
                <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.full_name?.[0] ?? user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name ?? "—"}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin" ? "bg-indigo-50 text-indigo-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {activeSubUserIds.has(user.id) ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        Pro
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Free</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-gray-400">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
