"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const features = {
  free: [
    "3 free study decks",
    "Limited quiz attempts (5/day)",
    "Basic progress tracking",
    "Email support",
  ],
  monthly: [
    "All 10+ premium decks",
    "Unlimited quiz attempts",
    "Full progress analytics",
    "New decks added regularly",
    "Quiz history & review",
    "Priority support",
    "Cancel anytime",
  ],
  yearly: [
    "Everything in Pro Monthly",
    "Save $80.88 per year",
    "2 months free vs monthly",
    "Early access to new content",
    "All future decks included",
    "Priority support",
    "Cancel anytime",
  ],
};

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, mode: "subscription" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast({
        title: "Checkout failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "",
      desc: "Get started at no cost. Access curated starter decks.",
      features: features.free,
      cta: "Get Started Free",
      highlighted: false,
      action: () => router.push("/signup"),
    },
    {
      id: "monthly",
      name: "Pro Monthly",
      price: "$14.99",
      period: "/month",
      desc: "Full access. Study anything. Cancel anytime.",
      features: features.monthly,
      cta: "Get Pro Monthly",
      highlighted: true,
      badge: "Most Popular",
      action: () => handleSubscribe("monthly"),
    },
    {
      id: "yearly",
      name: "Pro Yearly",
      price: "$99",
      period: "/year",
      desc: "Best value — equivalent to $8.25/month.",
      features: features.yearly,
      cta: "Get Pro Yearly",
      highlighted: false,
      badge: "Best Value",
      action: () => handleSubscribe("yearly"),
    },
  ];

  const comparisonRows = [
    { feature: "Free starter decks", free: true, monthly: true, yearly: true },
    { feature: "Premium decks (10+)", free: false, monthly: true, yearly: true },
    { feature: "Quiz mode", free: "Limited", monthly: "Unlimited", yearly: "Unlimited" },
    { feature: "Progress tracking", free: "Basic", monthly: "Full", yearly: "Full" },
    { feature: "Quiz attempt history", free: false, monthly: true, yearly: true },
    { feature: "New decks access", free: false, monthly: true, yearly: true },
    { feature: "Early access", free: false, monthly: false, yearly: true },
    { feature: "Priority support", free: false, monthly: true, yearly: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 bg-indigo-900 text-indigo-300 border-indigo-700">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Choose how serious you are about passing.
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Start free or go Pro. No lock-ins, no hidden fees, no BS.
          </p>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? "bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-glow-lg scale-105 border border-indigo-500"
                  : "bg-white border border-gray-100 shadow-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                    plan.highlighted ? "bg-white text-indigo-700" : "bg-indigo-600 text-white"
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-lg mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                  {plan.desc}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlighted ? "bg-white/20" : "bg-emerald-100"
                    }`}>
                      <Check className={`w-3 h-3 ${plan.highlighted ? "text-white" : "text-emerald-600"}`} />
                    </div>
                    <span className={plan.highlighted ? "text-indigo-100" : "text-gray-700"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={plan.action}
                disabled={loadingPlan === plan.id}
                variant={plan.highlighted ? "white" : "default"}
                size="lg"
                className="w-full gap-2"
              >
                {loadingPlan === plan.id ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {plan.id === "free" ? null : <Zap className="w-4 h-4" />}
                    {plan.cta}
                    {plan.id === "free" && <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Feature comparison */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Full Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-1/2">Feature</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-700">Free</th>
                  <th className="text-center p-4 text-sm font-semibold text-indigo-600 bg-indigo-50">Pro</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-700">Pro Yearly</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-gray-50/50" : ""}>
                    <td className="p-4 text-sm text-gray-700">{row.feature}</td>
                    {(["free", "monthly", "yearly"] as const).map((plan) => (
                      <td key={plan} className={`p-4 text-center ${plan === "monthly" ? "bg-indigo-50/30" : ""}`}>
                        {typeof row[plan] === "boolean" ? (
                          row[plan] ? (
                            <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span className="text-sm font-medium text-gray-600">{row[plan] as string}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Billing FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel anytime from your dashboard or billing portal. You'll keep access until the end of your billing period.",
              },
              {
                q: "What payment methods are accepted?",
                a: "All major credit/debit cards via Stripe. Secure and PCI-compliant.",
              },
              {
                q: "Is there a refund policy?",
                a: "Yes — 7-day refund policy for new subscribers. See our Refund Policy page for full details.",
              },
              {
                q: "Can I switch between plans?",
                a: "Yes. Upgrade or downgrade at any time. Proration is handled automatically.",
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <h3 className="font-bold text-gray-900 mb-1.5">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
