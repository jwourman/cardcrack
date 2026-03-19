import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronDown,
  Zap,
  Trophy,
  Star,
  Check,
  BarChart2,
  Layers,
  Clock,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import type { Deck } from "@/types";
import { formatCents, getCategoryGradient, getCategoryIcon } from "@/lib/utils";

async function getFeaturedDecks(): Promise<Deck[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("decks")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const decks = await getFeaturedDecks();

  const stats = [
    { value: "10,000+", label: "Active Students" },
    { value: "500+", label: "Premium Cards" },
    { value: "4.9★", label: "Average Rating" },
    { value: "85%", label: "Pass Rate Improvement" },
  ];

  const features = [
    {
      icon: Brain,
      title: "Active Recall Engine",
      description:
        "Flashcard study mode built for real retention — not just reading. Mark what you know, review what you don't.",
      color: "from-indigo-500 to-blue-600",
    },
    {
      icon: BarChart2,
      title: "Progress Tracking",
      description:
        "See exactly where you stand. Track study streaks, quiz scores, and card mastery over time.",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Layers,
      title: "Curated Decks",
      description:
        "Every deck is built by subject-matter experts. No crowdsourced noise — just clean, accurate content.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Zap,
      title: "Quiz Mode",
      description:
        "Multiple choice quizzes with instant feedback and explanations. Built to simulate real exam pressure.",
      color: "from-amber-500 to-orange-600",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose Your Subject",
      description:
        "Browse decks in accounting, finance, economics, and more. Filter by difficulty and topic.",
    },
    {
      step: "02",
      title: "Study the Flashcards",
      description:
        "Flip cards, mark what you know, and let the system focus your attention on problem areas.",
    },
    {
      step: "03",
      title: "Test Yourself with Quizzes",
      description:
        "Challenge your knowledge with timed multiple-choice quizzes. Get instant explanations.",
    },
    {
      step: "04",
      title: "Track Your Progress",
      description:
        "See your improvement over time. Know exactly when you're ready for exam day.",
    },
  ];

  const testimonials = [
    {
      name: "Marcus T.",
      role: "Accounting Major, University of Texas",
      avatar: "M",
      color: "from-blue-500 to-indigo-600",
      rating: 5,
      text: "I was struggling with Financial Accounting until I found CardCrack. The explanations on each card are actually clear, and the quizzes helped me catch blind spots before my final.",
    },
    {
      name: "Priya S.",
      role: "CPA Exam Candidate",
      avatar: "P",
      color: "from-purple-500 to-pink-500",
      rating: 5,
      text: "Worth every penny. The Corporate Finance deck alone saved me probably 20 hours of trying to organize my notes. I passed FAR on my first attempt.",
    },
    {
      name: "Jordan K.",
      role: "Finance Junior, NYU Stern",
      avatar: "J",
      color: "from-emerald-500 to-teal-500",
      rating: 5,
      text: "CardCrack is different from Quizlet because someone actually cared when writing the content. I can tell these aren't just random student-made cards.",
    },
    {
      name: "Aisha M.",
      role: "Econ Major, UCLA",
      avatar: "A",
      color: "from-amber-500 to-orange-500",
      rating: 5,
      text: "I use the Micro and Macro decks together as a bundle. The quiz mode is perfect for drilling concepts the week before exams. Highly recommend.",
    },
    {
      name: "Devon L.",
      role: "Business Admin Student",
      avatar: "D",
      color: "from-rose-500 to-pink-600",
      rating: 5,
      text: "I subscribed to Pro because the free decks convinced me the content was legit. The dashboard that tracks what you know vs don't know is actually useful.",
    },
    {
      name: "Alex W.",
      role: "MBA Student, Wharton",
      avatar: "A",
      color: "from-cyan-500 to-blue-500",
      rating: 5,
      text: "Even at this level, CardCrack's advanced decks have stuff I hadn't drilled. The Excel for Finance deck is extremely practical.",
    },
  ];

  const faqs = [
    {
      q: "What's the difference between free and premium?",
      a: "Free users get access to select starter decks and limited study sessions. Premium unlocks all decks, unlimited quizzes, advanced progress tracking, and priority access to new content.",
    },
    {
      q: "Can I buy just one deck instead of subscribing?",
      a: "Yes. Every premium deck has a one-time purchase option. Subscribe for the best value, or buy individual decks if you only need one subject.",
    },
    {
      q: "How is CardCrack different from Quizlet or Anki?",
      a: "CardCrack focuses exclusively on college-level business and exam subjects, with professionally curated content. No crowdsourced, low-quality decks. Every card and quiz question is built to actually help you pass.",
    },
    {
      q: "Can I cancel my subscription?",
      a: "Yes, anytime. You keep access until the end of your billing period. No questions asked.",
    },
    {
      q: "Is the content updated regularly?",
      a: "Yes. Decks are reviewed and updated to stay current with textbook editions and exam formats. Premium subscribers automatically get updated content.",
    },
    {
      q: "Is there a student discount?",
      a: "The yearly plan is already our best value — about $8.25/month. We're also piloting group discounts for study groups and institutions.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 pt-24 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              Trusted by 10,000+ students
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] mb-6">
              Study less randomly.
              <br />
              <span className="gradient-text">Remember more.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Premium flashcards, quizzes, and study packs built to help students
              master accounting, finance, economics, and business subjects faster.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/signup">
                <Button size="xl" variant="premium" className="w-full sm:w-auto gap-2 shadow-glow-lg">
                  Start Free Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/decks">
                <Button size="xl" variant="white" className="w-full sm:w-auto">
                  Browse Decks
                </Button>
              </Link>
            </div>

            {/* Hero card mockup */}
            <div className="relative max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Financial Accounting Basics</div>
                    <div className="text-sm font-medium text-slate-200">Card 12 of 30</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-6 text-center mb-4 min-h-[100px] flex items-center justify-center">
                  <p className="text-lg font-semibold text-white">
                    What is the accounting equation?
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 bg-red-500/20 border border-red-400/30 rounded-xl py-2.5 text-center text-sm text-red-300 font-medium cursor-pointer hover:bg-red-500/30 transition-colors">
                    Review Again
                  </div>
                  <div className="flex-1 bg-emerald-500/20 border border-emerald-400/30 rounded-xl py-2.5 text-center text-sm text-emerald-300 font-medium cursor-pointer hover:bg-emerald-500/30 transition-colors">
                    I Know This ✓
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl px-3 py-2 shadow-card-hover flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-gray-900">7 day streak!</span>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-3 py-2 shadow-card-hover flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-gray-900">82% mastered</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center pb-8">
          <ChevronDown className="w-6 h-6 text-slate-500 animate-bounce" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Decks */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="new" className="mb-3">Most Popular</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Top Study Decks
              </h2>
              <p className="text-gray-500 mt-2 max-w-xl">
                Curated decks used by thousands of students for exams, certifications, and coursework.
              </p>
            </div>
            <Link href="/decks">
              <Button variant="outline">
                View All Decks <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.length > 0 ? (
              decks.map((deck) => (
                <Link key={deck.id} href={`/decks/${deck.slug}`}>
                  <div className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
                    <div
                      className={`h-32 bg-gradient-to-br ${getCategoryGradient(deck.category)} flex items-center justify-center`}
                    >
                      <span className="text-5xl">{getCategoryIcon(deck.category)}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={deck.is_premium ? "premium" : "free"} className="text-xs">
                          {deck.is_premium ? "Premium" : "Free"}
                        </Badge>
                        <span className="text-xs text-gray-400 capitalize">{deck.category}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
                        {deck.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{deck.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {deck.flashcard_count ?? 0} cards
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {deck.estimated_minutes} min
                        </span>
                        {deck.is_premium && (
                          <span className="font-semibold text-indigo-600">
                            {formatCents(deck.price_cents)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              /* Skeleton fallback */
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
                    <div className="h-5 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="new" className="mb-3">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              How CardCrack Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Designed to get you from confused to confident in the fewest steps possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%-1rem)] w-8 border-t-2 border-dashed border-indigo-200 z-10" />
                )}
                <div className="flex flex-col items-start">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-4 text-white font-extrabold text-lg shadow-glow">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-3 bg-indigo-900 text-indigo-300 border-indigo-700">What You Get</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Built for Real Studying
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Not just flashcards. A complete system for active recall, retention, and exam confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-glow`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="popular" className="mb-3">Student Reviews</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Used by Students Who Pass
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Real reviews from students who used CardCrack to study and improve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="new" className="mb-3">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Choose how serious you are about passing.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Start free or go Pro. No lock-ins, no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                desc: "Get started with select free decks.",
                features: ["3 free study decks", "Limited quiz attempts", "Basic progress tracking"],
                cta: "Start Free",
                href: "/signup",
                highlighted: false,
              },
              {
                name: "Pro Monthly",
                price: "$14.99",
                period: "/month",
                desc: "Full access to everything, cancel anytime.",
                features: [
                  "All premium decks",
                  "Unlimited quizzes",
                  "Full progress tracking",
                  "New decks as they launch",
                  "Priority support",
                ],
                cta: "Get Pro",
                href: "/pricing",
                highlighted: true,
              },
              {
                name: "Pro Yearly",
                price: "$99",
                period: "/year",
                desc: "Best value — save 45% vs monthly.",
                features: [
                  "Everything in Pro Monthly",
                  "Biggest savings",
                  "2 months free",
                ],
                cta: "Get Yearly",
                href: "/pricing",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-indigo-600 to-indigo-700 border-indigo-500 text-white shadow-glow-lg scale-105"
                    : "bg-white border-gray-100 shadow-card"
                }`}
              >
                {plan.highlighted && (
                  <div className="text-center mb-3">
                    <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3
                  className={`font-bold text-lg mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mb-5 ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                  {plan.desc}
                </p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-indigo-200" : "text-emerald-500"}`}
                      />
                      <span className={plan.highlighted ? "text-indigo-100" : "text-gray-700"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    variant={plan.highlighted ? "white" : "outline"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-3 mb-6">
            {["📊", "💹", "🌐", "📋"].map((emoji, i) => (
              <div key={i} className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
                {emoji}
              </div>
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Ready to stop winging it?
          </h2>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto mb-8">
            Join thousands of students using CardCrack to study smarter and walk into exams with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="xl" variant="white" className="w-full sm:w-auto gap-2">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="xl" className="w-full sm:w-auto bg-white/10 border border-white/20 text-white hover:bg-white/20">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="text-indigo-300 text-sm mt-6">
            No credit card required for free plan. Cancel premium anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
