import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import {
  Users,
  BookOpen,
  DollarSign,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = await createServiceClient();

  const [usersResult, decksResult, purchasesResult, subscriptionsResult] =
    await Promise.all([
      supabase.from("users").select("id, created_at").order("created_at", { ascending: false }),
      supabase.from("decks").select("id, title, is_published, is_premium, price_cents, created_at"),
      supabase.from("purchases").select("amount_cents, status, created_at"),
      supabase.from("subscriptions").select("status, created_at"),
    ]);

  const users = usersResult.data ?? [];
  const decks = decksResult.data ?? [];
  const purchases = purchasesResult.data ?? [];
  const subscriptions = subscriptionsResult.data ?? [];

  const totalRevenue = purchases
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount_cents, 0);

  const activeSubscriptions = subscriptions.filter((s) =>
    ["active", "trialing"].includes(s.status)
  ).length;

  // Recent signups (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSignups = users.filter(
    (u) => new Date(u.created_at) > sevenDaysAgo
  ).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length.toLocaleString(),
      sub: `+${recentSignups} this week`,
      icon: Users,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Total Decks",
      value: decks.length.toString(),
      sub: `${decks.filter((d) => d.is_published).length} published`,
      icon: BookOpen,
      color: "from-purple-500 to-violet-600",
    },
    {
      label: "Total Revenue",
      value: formatCents(totalRevenue),
      sub: `${purchases.filter((p) => p.status === "completed").length} purchases`,
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Active Subscriptions",
      value: activeSubscriptions.toString(),
      sub: `${subscriptions.length} total`,
      icon: CreditCard,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Platform overview and management</p>
        </div>
        <Link href="/admin/decks/new">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Deck
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent decks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Recent Decks</h2>
          <Link href="/admin/decks">
            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-left">
                <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Title</th>
                <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Type</th>
                <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Price</th>
                <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody>
              {decks.slice(0, 10).map((deck) => (
                <tr key={deck.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-medium text-gray-900">{deck.title}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      deck.is_premium ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {deck.is_premium ? "Premium" : "Free"}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {deck.is_premium ? formatCents(deck.price_cents) : "—"}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      deck.is_published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {deck.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3">
                    <Link href={`/admin/decks/${deck.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
