import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  BarChart2,
  Lock,
  CheckCircle,
  Star,
  ArrowRight,
  HelpCircle,
  Zap,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/access";
import type { Deck, Flashcard, QuizQuestion, Review } from "@/types";
import { formatCents, getCategoryGradient, getCategoryIcon, getDifficultyColor } from "@/lib/utils";
import DeckPurchaseButton from "@/components/decks/DeckPurchaseButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: deck } = await supabase
    .from("decks")
    .select("title, description")
    .eq("slug", slug)
    .single();

  return {
    title: deck?.title ?? "Deck",
    description: deck?.description ?? "",
  };
}

export default async function DeckDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const [deckResult, authResult] = await Promise.all([
    supabase
      .from("decks")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single(),
    supabase.auth.getUser(),
  ]);

  if (deckResult.error || !deckResult.data) notFound();

  const deck: Deck = deckResult.data;
  const user = authResult.data.user;

  const [flashcardsResult, questionsResult, reviewsResult, relatedResult] =
    await Promise.all([
      supabase
        .from("flashcards")
        .select("*")
        .eq("deck_id", deck.id)
        .order("order_index"),
      supabase
        .from("quiz_questions")
        .select("*")
        .eq("deck_id", deck.id)
        .order("order_index"),
      supabase
        .from("reviews")
        .select("*, user:users(full_name, avatar_url)")
        .eq("deck_id", deck.id)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("decks")
        .select("*")
        .eq("category", deck.category)
        .eq("is_published", true)
        .neq("id", deck.id)
        .limit(3),
    ]);

  const flashcards: Flashcard[] = flashcardsResult.data ?? [];
  const questions: QuizQuestion[] = questionsResult.data ?? [];
  const reviews: Review[] = reviewsResult.data ?? [];
  const related: Deck[] = relatedResult.data ?? [];

  const { isSubscribed, purchasedDeckIds } = await getUserAccess(user?.id ?? null);
  const hasAccess = !deck.is_premium || isSubscribed || purchasedDeckIds.includes(deck.id);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const PREVIEW_CARD_COUNT = 5;
  const PREVIEW_QUIZ_COUNT = 3;
  const visibleCards = hasAccess ? flashcards : flashcards.slice(0, PREVIEW_CARD_COUNT);
  const visibleQuestions = hasAccess ? questions : questions.slice(0, PREVIEW_QUIZ_COUNT);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={deck.is_premium ? "premium" : "free"}>
                {deck.is_premium ? "Premium" : "Free"}
              </Badge>
              <span className="text-slate-400 text-sm capitalize">{deck.category.replace(/-/g, " ")}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${getDifficultyColor(deck.difficulty)}`}>
                {deck.difficulty}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{deck.title}</h1>
            <p className="text-slate-300 text-lg max-w-2xl mb-6">{deck.description}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {flashcards.length} flashcards
              </span>
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                {questions.length} quiz questions
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                ~{deck.estimated_minutes} min study time
              </span>
              {avgRating && (
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {avgRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Study mode preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Flashcard Preview
                </h2>
                <span className="text-sm text-gray-400">
                  {hasAccess ? flashcards.length : `${Math.min(PREVIEW_CARD_COUNT, flashcards.length)} of ${flashcards.length}`} cards
                </span>
              </div>

              <div className="space-y-3">
                {visibleCards.slice(0, 4).map((card, i) => (
                  <FlashcardPreview key={card.id} card={card} index={i} />
                ))}
              </div>

              {!hasAccess && flashcards.length > PREVIEW_CARD_COUNT && (
                <LockedContent count={flashcards.length - PREVIEW_CARD_COUNT} type="flashcards" />
              )}

              {hasAccess && (
                <div className="mt-5 flex gap-3">
                  <Link href={`/decks/${deck.slug}/study`} className="flex-1">
                    <Button className="w-full gap-2">
                      <BookOpen className="w-4 h-4" />
                      Start Studying
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Quiz preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Quiz Preview
                </h2>
                <span className="text-sm text-gray-400">
                  {hasAccess ? questions.length : `${Math.min(PREVIEW_QUIZ_COUNT, questions.length)} of ${questions.length}`} questions
                </span>
              </div>

              {visibleQuestions.slice(0, 2).map((q, i) => (
                <QuizPreviewCard key={q.id} question={q} index={i} />
              ))}

              {!hasAccess && questions.length > PREVIEW_QUIZ_COUNT && (
                <LockedContent count={questions.length - PREVIEW_QUIZ_COUNT} type="quiz questions" />
              )}

              {hasAccess && (
                <Link href={`/decks/${deck.slug}/quiz`} className="mt-5 block">
                  <Button variant="outline" className="w-full gap-2">
                    <Zap className="w-4 h-4" />
                    Take the Quiz
                  </Button>
                </Link>
              )}
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Student Reviews</h2>
                  {avgRating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm">({reviews.length})</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {review.user?.full_name?.[0] ?? "U"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {review.user?.full_name ?? "Student"}
                          </p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.body && (
                        <p className="text-sm text-gray-600">{review.body}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase / Access Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sticky top-24">
              <div
                className={`h-24 rounded-xl bg-gradient-to-br ${getCategoryGradient(deck.category)} flex items-center justify-center mb-5`}
              >
                <span className="text-5xl">{getCategoryIcon(deck.category)}</span>
              </div>

              {hasAccess ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2.5">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {isSubscribed ? "Included in your Pro plan" : "You own this deck"}
                    </span>
                  </div>
                  <Link href={`/decks/${deck.slug}/study`}>
                    <Button className="w-full gap-2">
                      <BookOpen className="w-4 h-4" />
                      Study Now
                    </Button>
                  </Link>
                  <Link href={`/decks/${deck.slug}/quiz`}>
                    <Button variant="outline" className="w-full gap-2">
                      <Zap className="w-4 h-4" />
                      Take Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {deck.is_premium ? (
                    <>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-extrabold text-gray-900 mb-1">
                          {formatCents(deck.price_cents)}
                        </div>
                        <p className="text-sm text-gray-500">One-time purchase</p>
                      </div>
                      <DeckPurchaseButton deck={deck} user={user} />
                      <div className="relative flex items-center gap-3 my-4">
                        <div className="flex-1 border-t border-gray-100" />
                        <span className="text-xs text-gray-400">or</span>
                        <div className="flex-1 border-t border-gray-100" />
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-bold text-indigo-900">Get all decks with Pro</span>
                        </div>
                        <p className="text-xs text-indigo-700 mb-3">
                          Access every premium deck for $14.99/month
                        </p>
                        <Link href="/pricing">
                          <Button variant="premium" size="sm" className="w-full gap-1.5">
                            Unlock Pro <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <Link href="/signup">
                      <Button className="w-full gap-2">
                        Create Free Account
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* What's included */}
              <div className="mt-5 pt-5 border-t border-gray-50 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  What&apos;s included
                </p>
                {[
                  { icon: BookOpen, text: `${flashcards.length} flashcards` },
                  { icon: HelpCircle, text: `${questions.length} quiz questions` },
                  { icon: Clock, text: `~${deck.estimated_minutes} min study time` },
                  { icon: BarChart2, text: "Progress tracking" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-gray-600">
                    <item.icon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Related decks */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <h3 className="font-bold text-gray-900 mb-4">Related Decks</h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link key={r.id} href={`/decks/${r.slug}`}>
                      <div className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors group">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getCategoryGradient(r.category)} flex items-center justify-center text-xl flex-shrink-0`}
                        >
                          {getCategoryIcon(r.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {r.title}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">{r.difficulty}</p>
                        </div>
                        <Badge variant={r.is_premium ? "premium" : "free"} className="text-xs flex-shrink-0">
                          {r.is_premium ? "Pro" : "Free"}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlashcardPreview({ card, index }: { card: Flashcard; index: number }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors">
      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 mb-1">{card.front}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{card.back}</p>
      </div>
    </div>
  );
}

function QuizPreviewCard({ question, index }: { question: QuizQuestion; index: number }) {
  return (
    <div className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
      <p className="text-sm font-semibold text-gray-900 mb-3">
        <span className="text-indigo-500 mr-2">Q{index + 1}.</span>
        {question.question}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {["a", "b", "c", "d"].map((opt) => (
          <div
            key={opt}
            className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600"
          >
            <span className="font-bold uppercase text-gray-400 mr-1.5">{opt})</span>
            {question[`option_${opt}` as keyof QuizQuestion] as string}
          </div>
        ))}
      </div>
    </div>
  );
}

function LockedContent({ count, type }: { count: number; type: string }) {
  return (
    <div className="mt-4 relative overflow-hidden rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-white/50" />
      <div className="relative flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Lock className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm mb-1">
            {count} more {type} locked
          </p>
          <p className="text-xs text-gray-500">
            Purchase this deck or subscribe to Pro to unlock all content.
          </p>
        </div>
      </div>
    </div>
  );
}
