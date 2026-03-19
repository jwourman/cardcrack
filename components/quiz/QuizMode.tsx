"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Clock,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Deck, QuizQuestion } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { getPercentage } from "@/lib/utils";

interface QuizModeProps {
  deck: Deck;
  questions: QuizQuestion[];
  userId: string;
}

type AnswerState = "unanswered" | "correct" | "incorrect";

export default function QuizMode({ deck, questions, userId }: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [scores, setScores] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [incorrectIndices, setIncorrectIndices] = useState<number[]>([]);

  const supabase = createClient();

  useEffect(() => {
    if (quizComplete) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, quizComplete]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex) / totalQuestions) * 100;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleAnswer = (option: string) => {
    if (answerState !== "unanswered") return;

    setSelectedAnswer(option);
    const isCorrect = option === currentQuestion.correct_answer;
    setAnswerState(isCorrect ? "correct" : "incorrect");
    setShowExplanation(true);

    const newScores = [...scores, isCorrect];
    setScores(newScores);
    if (!isCorrect) {
      setIncorrectIndices((prev) => [...prev, currentIndex]);
    }
  };

  const handleNext = async () => {
    if (currentIndex === totalQuestions - 1) {
      const finalScore = scores.filter(Boolean).length;
      await supabase.from("quiz_attempts").insert({
        user_id: userId,
        deck_id: deck.id,
        score: finalScore,
        total_questions: totalQuestions,
        completed_at: new Date().toISOString(),
      });
      setQuizComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setAnswerState("unanswered");
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswerState("unanswered");
    setScores([]);
    setQuizComplete(false);
    setShowExplanation(false);
    setIncorrectIndices([]);
    setReviewMode(false);
  };

  const handleReviewIncorrect = () => {
    setReviewMode(true);
    setCurrentIndex(incorrectIndices[0] ?? 0);
    setSelectedAnswer(null);
    setAnswerState("unanswered");
    setScores([]);
    setQuizComplete(false);
    setShowExplanation(false);
  };

  // Results screen
  if (quizComplete) {
    const correct = scores.filter(Boolean).length;
    const pct = getPercentage(correct, totalQuestions);
    const grade =
      pct >= 90 ? { label: "Excellent!", color: "text-emerald-600", emoji: "🏆" } :
      pct >= 75 ? { label: "Great Job!", color: "text-indigo-600", emoji: "⭐" } :
      pct >= 60 ? { label: "Decent!", color: "text-amber-600", emoji: "📈" } :
                 { label: "Keep Studying!", color: "text-rose-600", emoji: "💪" };

    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 max-w-lg w-full text-center">
          <div className="text-5xl mb-4">{grade.emoji}</div>
          <h2 className={`text-2xl font-extrabold mb-1 ${grade.color}`}>{grade.label}</h2>
          <p className="text-gray-500 mb-6">Quiz complete for {deck.title}</p>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke={pct >= 75 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-gray-900">{pct}%</span>
              <span className="text-xs text-gray-500">{correct}/{totalQuestions}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xl font-bold text-gray-900">{totalQuestions}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="text-xl font-bold text-emerald-600">{correct}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="bg-rose-50 rounded-xl p-3">
              <div className="text-xl font-bold text-rose-600">{totalQuestions - correct}</div>
              <div className="text-xs text-gray-500">Incorrect</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRestart} className="flex-1 gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake
            </Button>
            {incorrectIndices.length > 0 && (
              <Button onClick={handleReviewIncorrect} className="flex-1 gap-2">
                <BookOpen className="w-4 h-4" />
                Review {incorrectIndices.length} wrong
              </Button>
            )}
          </div>
          <div className="mt-3 flex gap-3">
            <Link href={`/decks/${deck.slug}/study`} className="flex-1">
              <Button variant="ghost" className="w-full gap-2">
                <BookOpen className="w-4 h-4" />
                Study Flashcards
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="ghost" className="w-full">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const optionLabels = ["a", "b", "c", "d"] as const;
  const optionColors = (opt: string) => {
    if (answerState === "unanswered") {
      return selectedAnswer === opt
        ? "border-indigo-400 bg-indigo-50"
        : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50";
    }
    if (opt === currentQuestion.correct_answer) return "border-emerald-400 bg-emerald-50";
    if (opt === selectedAnswer && opt !== currentQuestion.correct_answer) return "border-rose-400 bg-rose-50";
    return "border-gray-100 bg-gray-50 opacity-60";
  };

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
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {formatTime(elapsedSeconds)}
            </div>
            <Badge variant="free" className="hidden sm:inline-flex">
              {scores.filter(Boolean).length}/{currentIndex} correct
            </Badge>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sm:p-8 mb-6">
          <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-3">
            Question {currentIndex + 1}
          </p>
          <p className="text-xl font-bold text-gray-900 leading-snug mb-8">
            {currentQuestion.question}
          </p>

          <div className="space-y-3">
            {optionLabels.map((opt) => {
              const optionText = currentQuestion[`option_${opt}` as keyof QuizQuestion] as string;
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={answerState !== "unanswered"}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${optionColors(opt)}`}
                >
                  <span className="w-6 h-6 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 uppercase">
                    {opt}
                  </span>
                  <span className="text-sm text-gray-800 font-medium">{optionText}</span>
                  {answerState !== "unanswered" && opt === currentQuestion.correct_answer && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 ml-auto flex-shrink-0" />
                  )}
                  {answerState !== "unanswered" && opt === selectedAnswer && opt !== currentQuestion.correct_answer && (
                    <XCircle className="w-5 h-5 text-rose-500 ml-auto flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {showExplanation && (
          <div
            className={`rounded-2xl border p-5 mb-6 ${
              answerState === "correct"
                ? "bg-emerald-50 border-emerald-200"
                : "bg-rose-50 border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {answerState === "correct" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-500" />
              )}
              <span className={`font-bold text-sm ${answerState === "correct" ? "text-emerald-800" : "text-rose-800"}`}>
                {answerState === "correct" ? "Correct!" : "Not quite"}
              </span>
            </div>
            {currentQuestion.explanation && (
              <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
            )}
          </div>
        )}

        {answerState !== "unanswered" && (
          <Button onClick={handleNext} className="w-full gap-2" size="lg">
            {currentIndex === totalQuestions - 1 ? (
              <>
                <Trophy className="w-4 h-4" />
                See Results
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
