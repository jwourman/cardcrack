import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Zap,
  Trophy,
  Clock,
  TrendingUp,
  ArrowRight,
  Crown,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/access";
import { getCategoryGradient, getCategoryIcon, formatDate } from "@/lib/utils";
import BillingPortalButton from "@/components/dashboard/BillingPortalButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { isSubscribed, purchasedDeckIds } = await getUserAccess(user.id);

  // Get subscription details
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .maybeSingle();

  // Get purchased decks
  const purchasedDecks = purchasedDeckIds.length > 0
    ? (await supabase
        .from("decks")
        .select("*")
        .in("id", purchasedDeckIds)
        .eq("is_published", true)
      ).data ?? []
    : [];

  // Get free decks
  const { data: freeDecks } = await supabase
    .from("decks")
    .select("*")
    .eq("is_premium", false)
    .eq("is_published", true);

  // Get recent study sessions
  const { data: studySessions } = await supabase
    .from("study_sessions")
    .select("*, deck:decks(title, slug, category)")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(5);

  // Get quiz attempts
  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("*, deck:decks(title, slug, category)")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(5);

  // Stats
  const totalCardsStudied = studySessions?.reduce((sum, s) => sum + (s.cards_reviewed ?? 0), 0) ?? 0;
  const avgQuizScore =
    quizAttempts && quizAttempts.length > 0
      ? Math.round(
          (quizAttempts.reduce((sum, q) => sum + (q.score / q.total_questions) * 100, 0) /
            quizAttempts.length)
        )
      : null;

  const accessibleDecks = isSubscribed
    ? [...(freeDecks ?? []), ...(purchasedDecks ?? [])]
    : [...(freeDecks ?? []), ...purchasedDecks];

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-gray-500 text-sm">
                {isSubscribed ? (
                  <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                    <Crown className="w-4 h-4" />
                    Pro Member
                  </span>
                ) : (
                  "Free plan — limited access"
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isSubscribed && (
                <Link href="/pricing">
                  <Button variant="premium" size="sm" className="gap-2">
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
              {isSubscribed && profile?.stripe_customer_id && (
                <BillingPortalButton />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Cards Studied",
              value: totalCardsStudied.toLocaleString(),
              icon: BookOpen,
              color: "text-indigo-600 bg-indigo-50",
            },
            {
              label: "Sessions",
              value: (studySessions?.length ?? 0).toString(),
              icon: Clock,
              color: "text-purple-600 bg-purple-50",
            },
            {
              label: "Avg Quiz Score",
              value: avgQuizScore ? `${avgQuizScore}%` : "—",
              icon: Trophy,
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Decks Accessible",
              value: isSubscribed ? "All" : accessibleDecks.length.toString(),
              icon: TrendingUp,
              color: "text-emerald-600 bg-emerald-50",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subscription status */}
            {isSubscribed && subscription ? (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-5 h-5 text-yellow-300" />
                      <span className="font-bold text-lg">Pro Plan Active</span>
                    </div>
                    <p className="text-indigo-200 text-sm">
                      Renews {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/20">
                    {subscription.status}
                  </Badge>
                </div>
                <p className="text-sm text-indigo-100 mb-4">
                  You have full access to all premium decks and unlimited quizzes.
                </p>
                {profile?.stripe_customer_id && (
                  <BillingPortalButton variant="white" />
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Unlock Premium Access</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Get all premium decks, unlimited quizzes, and full progress tracking for $14.99/month.
                </p>
                <Link href="/pricing">
                  <Button variant="premium" size="sm" className="gap-2">
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* My Decks */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">My Decks</h2>
                <Link href="/decks">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500">
                    Browse All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {accessibleDecks.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No decks yet.</p>
                  <Link href="/decks" className="text-indigo-600 text-sm font-medium hover:underline">
                    Browse decks
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {accessibleDecks.slice(0, 5).map((deck) => (
                    <div key={deck.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryGradient(deck.category)} flex items-center justify-center text-xl flex-shrink-0`}
                      >
                        {getCategoryIcon(deck.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {deck.title}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{deck.difficulty}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/decks/${deck.slug}/study`}>
                          <Button size="sm" variant="ghost" className="text-xs gap-1 text-gray-500">
                            <BookOpen className="w-3.5 h-3.5" />
                            Study
                          </Button>
                        </Link>
                        <Link href={`/decks/${deck.slug}/quiz`}>
                          <Button size="sm" variant="ghost" className="text-xs gap-1 text-gray-500">
                            <Zap className="w-3.5 h-3.5" />
                            Quiz
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Quiz Attempts */}
            {quizAttempts && quizAttempts.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Recent Quiz Scores</h2>
                <div className="space-y-4">
                  {quizAttempts.map((attempt) => {
                    const pct = Math.round((attempt.score / attempt.total_questions) * 100);
                    return (
                      <div key={attempt.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {(attempt as any).deck?.title ?? "Unknown Deck"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {attempt.score}/{attempt.total_questions} correct
                            </p>
                          </div>
                          <span className={`text-sm font-bold ${pct >= 75 ? "text-emerald-600" : pct >= 60 ? "text-amber-500" : "text-rose-500"}`}>
                            {pct}%
                          </span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent activity */}
            {studySessions && studySessions.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <h3 className="font-bold text-gray-900 mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  {studySessions.map((session) => {
                    const pct = session.cards_reviewed > 0
                      ? Math.round((session.known_count / session.cards_reviewed) * 100)
                      : 0;
                    return (
                      <div key={session.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getCategoryGradient((session as any).deck?.category ?? "default")} flex items-center justify-center text-sm flex-shrink-0`}
                        >
                          {getCategoryIcon((session as any).deck?.category ?? "default")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 line-clamp-1">
                            {(session as any).deck?.title ?? "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {session.cards_reviewed} cards · {pct}% known
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/decks" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                    <BookOpen className="w-4 h-4" />
                    Browse All Decks
                  </Button>
                </Link>
                <Link href="/pricing" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                    <Crown className="w-4 h-4" />
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
