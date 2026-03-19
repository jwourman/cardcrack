import Link from "next/link";
import { BookOpen, Clock, HelpCircle, Star, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Deck } from "@/types";
import { formatCents, getCategoryGradient, getCategoryIcon, getDifficultyColor, truncate } from "@/lib/utils";

interface DeckGridProps {
  decks: Deck[];
}

export default function DeckGrid({ decks }: DeckGridProps) {
  if (decks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="font-bold text-gray-900 mb-2">No decks found</h3>
        <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
        <Link
          href="/decks"
          className="inline-block mt-4 text-indigo-600 text-sm font-medium hover:underline"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </div>
  );
}

function DeckCard({ deck }: { deck: Deck }) {
  return (
    <Link href={`/decks/${deck.slug}`}>
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div
          className={`h-32 bg-gradient-to-br ${getCategoryGradient(deck.category)} flex items-center justify-center relative flex-shrink-0`}
        >
          <span className="text-5xl">{getCategoryIcon(deck.category)}</span>
          {deck.is_premium && (
            <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-lg p-1.5">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={deck.is_premium ? "premium" : "free"} className="text-xs">
              {deck.is_premium ? "Premium" : "Free"}
            </Badge>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${getDifficultyColor(deck.difficulty)}`}>
              {deck.difficulty}
            </span>
          </div>

          <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1 leading-snug">
            {deck.title}
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">
            {truncate(deck.description, 100)}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {deck.flashcard_count ?? 0} cards
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {deck.quiz_question_count ?? 0} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {deck.estimated_minutes}m
            </span>
          </div>

          {/* Price */}
          {deck.is_premium && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">One-time purchase</span>
              <span className="font-bold text-indigo-600 text-sm">
                {formatCents(deck.price_cents)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
