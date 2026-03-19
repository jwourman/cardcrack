import { createServiceClient } from "@/lib/supabase/server";
import { formatCents, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders | Admin" };

export default async function AdminOrdersPage() {
  const supabase = await createServiceClient();

  const [purchasesResult, subscriptionsResult] = await Promise.all([
    supabase
      .from("purchases")
      .select("*, user:users(email, full_name), deck:decks(title)")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("subscriptions")
      .select("*, user:users(email, full_name)")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const purchases = purchasesResult.data ?? [];
  const subscriptions = subscriptionsResult.data ?? [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Orders & Subscriptions</h1>

      {/* Subscriptions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-5">Active Subscriptions ({subscriptions.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-50">
              <tr>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase">User</th>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase">Status</th>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase">Renews</th>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase">Created</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <div>
                      <p className="font-medium text-gray-900">{(sub as any).user?.full_name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{(sub as any).user?.email}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === "active" ? "bg-emerald-50 text-emerald-700" :
                      sub.status === "past_due" ? "bg-amber-50 text-amber-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600 text-xs">{formatDate(sub.current_period_end)}</td>
                  <td className="py-3 text-gray-400 text-xs">{formatDate(sub.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchases */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h2 className="font-bold text-gray-900 mb-5">Deck Purchases ({purchases.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-50">
              <tr>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase">User</th>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase">Deck</th>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase">Amount</th>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase">Status</th>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <div>
                      <p className="font-medium text-gray-900">{(p as any).user?.full_name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{(p as any).user?.email}</p>
                    </div>
                  </td>
                  <td className="py-3 text-gray-700">{(p as any).deck?.title ?? "—"}</td>
                  <td className="py-3 font-medium text-gray-900">{formatCents(p.amount_cents)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                      p.status === "failed" ? "bg-red-50 text-red-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
