import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Deck } from "@/types";
import DeckGrid from "@/components/decks/DeckGrid";
import DeckFilters from "@/components/decks/DeckFilters";
import { BookOpen, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Study Decks",
  description:
    "Browse premium flashcard decks for accounting, finance, economics, and more. Filter by subject, difficulty, and price.",
};

interface SearchParams {
  category?: string;
  difficulty?: string;
  q?: string;
  sort?: string;
  type?: string;
}

async function getDecks(searchParams: SearchParams): Promise<Deck[]> {
  const supabase = await createClient();
  let query = supabase
    .from("decks")
    .select(
      `
      *,
      flashcard_count:flashcards(count),
      quiz_question_count:quiz_questions(count)
    `
    )
    .eq("is_published", true);

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }
  if (searchParams.difficulty) {
    query = query.eq("difficulty", searchParams.difficulty);
  }
  if (searchParams.q) {
    query = query.ilike("title", `%${searchParams.q}%`);
  }
  if (searchParams.type === "free") {
    query = query.eq("is_premium", false);
  } else if (searchParams.type === "premium") {
    query = query.eq("is_premium", true);
  }

  const sortBy = searchParams.sort ?? "newest";
  if (sortBy === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "price-low") {
    query = query.order("price_cents", { ascending: true });
  } else if (sortBy === "price-high") {
    query = query.order("price_cents", { ascending: false });
  }

  const { data } = await query;

  return (data ?? []).map((d) => ({
    ...d,
    flashcard_count: Array.isArray(d.flashcard_count)
      ? (d.flashcard_count[0]?.count ?? 0)
      : 0,
    quiz_question_count: Array.isArray(d.quiz_question_count)
      ? (d.quiz_question_count[0]?.count ?? 0)
      : 0,
  }));
}

export default async function BrowseDecksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const decks = await getDecks(params);

  const categories = [
    { value: "accounting", label: "Accounting", icon: "📊" },
    { value: "finance", label: "Finance", icon: "💹" },
    { value: "economics", label: "Economics", icon: "🌐" },
    { value: "marketing", label: "Marketing", icon: "📣" },
    { value: "statistics", label: "Statistics", icon: "📈" },
    { value: "personal-finance", label: "Personal Finance", icon: "💰" },
    { value: "banking", label: "Banking", icon: "🏦" },
    { value: "excel", label: "Excel & Data", icon: "📋" },
    { value: "business", label: "Business", icon: "💼" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            {decks.length} decks available
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Browse Study Decks
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Premium flashcard decks built for students who need to actually understand the material.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <a
              href="/decks"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                !params.category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat.value}
                href={`/decks?category=${cat.value}`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  params.category === cat.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <DeckFilters params={params} />
          </aside>

          {/* Deck grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                {decks.length === 0
                  ? "No decks found"
                  : `Showing ${decks.length} deck${decks.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <Suspense fallback={<DeckGridSkeleton />}>
              <DeckGrid decks={decks} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeckGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gray-200 animate-pulse" />
          <div className="p-5 space-y-2">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
            <div className="h-5 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
