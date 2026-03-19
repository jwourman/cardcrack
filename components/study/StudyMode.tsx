"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Shuffle,
  CheckCircle,
  XCircle,
  BookOpen,
  Trophy,
  Clock,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Deck, Flashcard } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface StudyModeProps {
  deck: Deck;
  flashcards: Flashcard[];
  userId: string;
}

type CardStatus = "unseen" | "known" | "review";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function StudyMode({ deck, flashcards, userId }: StudyModeProps) {
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({});
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (sessionComplete) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === "ArrowRight" && isFlipped) {
        markCard("known");
      } else if (e.key === "ArrowLeft" && isFlipped) {
        markCard("review");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFlipped, sessionComplete]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;
  const knownCount = Object.values(statuses).filter((s) => s === "known").length;
  const reviewCount = Object.values(statuses).filter((s) => s === "review").length;
  const progress = ((currentIndex) / totalCards) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const markCard = async (status: "known" | "review") => {
    setStatuses((prev) => ({ ...prev, [currentCard.id]: status }));

    if (currentIndex === totalCards - 1) {
      // Session complete — save to DB
      await supabase.from("study_sessions").insert({
        user_id: userId,
        deck_id: deck.id,
        started_at: new Date(startTime).toISOString(),
        completed_at: new Date().toISOString(),
        cards_reviewed: totalCards,
        known_count: knownCount + (status === "known" ? 1 : 0),
        review_count: reviewCount + (status === "review" ? 1 : 0),
      });
      setSessionComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    setCards(shuffleArray(cards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatuses({});
    setIsShuffled(true);
  };

  const handleRestart = () => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatuses({});
    setSessionComplete(false);
    setIsShuffled(false);
  };

  const handleRestartReview = () => {
    const reviewCards = cards.filter((c) => statuses[c.id] === "review");
    if (reviewCards.length > 0) {
      setCards(reviewCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setStatuses({});
      setSessionComplete(false);
    }
  };

  if (sessionComplete) {
    const finalKnown = Object.values(statuses).filter((s) => s === "known").length;
    const finalReview = Object.values(statuses).filter((s) => s === "review").length;
    const pct = Math.round((finalKnown / totalCards) * 100);

    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Trophy className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Session Complete!</h2>
          <p className="text-gray-500 mb-6">Great work on {deck.title}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-gray-900">{totalCards}</div>
              <div className="text-xs text-gray-500">Cards Studied</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-emerald-600">{finalKnown}</div>
              <div className="text-xs text-gray-500">Known</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-amber-600">{finalReview}</div>
              <div className="text-xs text-gray-500">Review Again</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Mastery</span>
              <span className="font-bold text-indigo-600">{pct}%</span>
            </div>
            <Progress value={pct} className="h-3" />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRestart} className="flex-1 gap-2">
              <RotateCcw className="w-4 h-4" />
              Restart All
            </Button>
            {finalReview > 0 && (
              <Button onClick={handleRestartReview} className="flex-1 gap-2">
                <BookOpen className="w-4 h-4" />
                Review {finalReview}
              </Button>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <Link href={`/decks/${deck.slug}/quiz`} className="flex-1">
              <Button variant="premium" className="w-full gap-2">
                Take the Quiz
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="ghost" className="w-full gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Link href={`/decks/${deck.slug}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{deck.title}</span>
            </Button>
          </Link>

          <div className="flex-1 max-w-sm">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-xs text-gray-400 mt-1">
              {currentIndex + 1} / {totalCards}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(elapsedSeconds)}
            </span>
            <button
              onClick={handleShuffle}
              className={`p-2 rounded-lg hover:bg-gray-50 transition-colors ${isShuffled ? "text-indigo-600" : "text-gray-400"}`}
              title="Shuffle cards"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Status counts */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <CheckCircle className="w-4 h-4" />
            {knownCount} known
          </span>
          <span className="flex items-center gap-1.5 text-amber-500 font-medium">
            <XCircle className="w-4 h-4" />
            {reviewCount} review
          </span>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-xl cursor-pointer"
          onClick={() => setIsFlipped((f) => !f)}
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative h-64 sm:h-72"
            style={{
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-white rounded-2xl border-2 border-gray-100 shadow-card-hover flex flex-col items-center justify-center p-8 text-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold mb-4">
                {currentIndex + 1}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {currentCard.front}
              </p>
              <p className="text-xs text-gray-400 mt-4">Click or press Space to reveal</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-card-hover flex flex-col items-center justify-center p-8 text-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                {currentCard.back}
              </p>
            </div>
          </div>
        </div>

        {/* Hint */}
        {!isFlipped && (
          <p className="text-xs text-gray-400 mt-4">
            Keyboard: Space to flip • → Known • ← Review
          </p>
        )}

        {/* Action buttons */}
        {isFlipped && (
          <div className="flex gap-4 mt-8 w-full max-w-xl">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-amber-200 text-amber-600 hover:bg-amber-50 gap-2"
              onClick={() => markCard("review")}
            >
              <XCircle className="w-5 h-5" />
              Review Again
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
              onClick={() => markCard("known")}
            >
              <CheckCircle className="w-5 h-5" />
              I Know This
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-6">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => { setCurrentIndex((i) => i - 1); setIsFlipped(false); }}
            className="gap-1 text-gray-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Prev
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setCurrentIndex((i) => Math.min(i + 1, totalCards - 1)); setIsFlipped(false); }}
            className="gap-1 text-gray-400"
          >
            Skip
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
