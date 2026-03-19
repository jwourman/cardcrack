"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Deck, Flashcard, QuizQuestion } from "@/types";
import Link from "next/link";

interface DeckFormProps {
  deck?: Deck;
  flashcards?: Flashcard[];
  quizQuestions?: QuizQuestion[];
}

interface CardDraft {
  id?: string;
  front: string;
  back: string;
}

interface QuizDraft {
  id?: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "a" | "b" | "c" | "d";
  explanation: string;
}

const CATEGORIES = [
  { value: "accounting", label: "Accounting" },
  { value: "finance", label: "Finance" },
  { value: "economics", label: "Economics" },
  { value: "marketing", label: "Marketing" },
  { value: "statistics", label: "Statistics" },
  { value: "personal-finance", label: "Personal Finance" },
  { value: "banking", label: "Banking" },
  { value: "excel", label: "Excel & Data" },
  { value: "business", label: "Business" },
];

export default function DeckForm({ deck, flashcards = [], quizQuestions = [] }: DeckFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [title, setTitle] = useState(deck?.title ?? "");
  const [slug, setSlug] = useState(deck?.slug ?? "");
  const [description, setDescription] = useState(deck?.description ?? "");
  const [category, setCategory] = useState(deck?.category ?? "accounting");
  const [difficulty, setDifficulty] = useState(deck?.difficulty ?? "beginner");
  const [estimatedMinutes, setEstimatedMinutes] = useState(deck?.estimated_minutes?.toString() ?? "30");
  const [isPremium, setIsPremium] = useState(deck?.is_premium ?? false);
  const [isPublished, setIsPublished] = useState(deck?.is_published ?? false);
  const [priceCents, setPriceCents] = useState(deck?.price_cents ? (deck.price_cents / 100).toString() : "9.99");
  const [cards, setCards] = useState<CardDraft[]>(
    flashcards.length > 0
      ? flashcards.map((f) => ({ id: f.id, front: f.front, back: f.back }))
      : [{ front: "", back: "" }]
  );
  const [quizzes, setQuizzes] = useState<QuizDraft[]>(
    quizQuestions.length > 0
      ? quizQuestions.map((q) => ({
          id: q.id,
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer,
          explanation: q.explanation ?? "",
        }))
      : [{
          question: "", option_a: "", option_b: "", option_c: "", option_d: "",
          correct_answer: "a" as const, explanation: "",
        }]
  );
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "cards" | "quiz">("details");

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!deck) setSlug(slugify(v));
  };

  const addCard = () => setCards((c) => [...c, { front: "", back: "" }]);
  const removeCard = (i: number) => setCards((c) => c.filter((_, idx) => idx !== i));
  const updateCard = (i: number, field: keyof CardDraft, value: string) => {
    setCards((c) => c.map((card, idx) => (idx === i ? { ...card, [field]: value } : card)));
  };

  const addQuiz = () =>
    setQuizzes((q) => [
      ...q,
      { question: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "a" as const, explanation: "" },
    ]);
  const removeQuiz = (i: number) => setQuizzes((q) => q.filter((_, idx) => idx !== i));
  const updateQuiz = (i: number, field: keyof QuizDraft, value: string) => {
    setQuizzes((q) => q.map((quiz, idx) => (idx === i ? { ...quiz, [field]: value } : quiz)));
  };

  const handleSave = async () => {
    if (!title || !slug || !category) {
      toast({ title: "Missing fields", description: "Fill in title, slug, and category.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const deckData = {
        title,
        slug,
        description,
        category,
        difficulty,
        estimated_minutes: parseInt(estimatedMinutes) || 30,
        is_premium: isPremium,
        is_published: isPublished,
        price_cents: isPremium ? Math.round(parseFloat(priceCents) * 100) : 0,
        updated_at: new Date().toISOString(),
      };

      let deckId = deck?.id;

      if (deck) {
        const { error } = await supabase.from("decks").update(deckData).eq("id", deck.id);
        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("decks")
          .insert({ ...deckData, created_by: user!.id })
          .select("id")
          .single();
        if (error) throw error;
        deckId = data.id;
      }

      // Save flashcards
      if (deckId) {
        // Delete existing and re-insert
        await supabase.from("flashcards").delete().eq("deck_id", deckId);
        const cardInserts = cards
          .filter((c) => c.front.trim() && c.back.trim())
          .map((c, i) => ({ deck_id: deckId, front: c.front, back: c.back, order_index: i }));
        if (cardInserts.length > 0) {
          const { error } = await supabase.from("flashcards").insert(cardInserts);
          if (error) throw error;
        }

        // Save quiz questions
        await supabase.from("quiz_questions").delete().eq("deck_id", deckId);
        const quizInserts = quizzes
          .filter((q) => q.question.trim())
          .map((q, i) => ({
            deck_id: deckId,
            question: q.question,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            order_index: i,
          }));
        if (quizInserts.length > 0) {
          const { error } = await supabase.from("quiz_questions").insert(quizInserts);
          if (error) throw error;
        }
      }

      toast({ title: "Saved!", description: "Deck saved successfully.", variant: "success" });
      router.push("/admin/decks");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save deck.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "details", label: "Details" },
    { id: "cards", label: `Flashcards (${cards.length})` },
    { id: "quiz", label: `Quiz (${quizzes.length})` },
  ] as const;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/decks">
          <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 ml-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Deck"}
        </Button>
      </div>

      {activeTab === "details" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Financial Accounting Basics" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="financial-accounting-basics" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="A comprehensive overview of..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as "beginner" | "intermediate" | "advanced")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Estimated Minutes</Label>
              <Input type="number" value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(e.target.value)} min="1" />
            </div>
          </div>

          {/* Premium / Published toggles */}
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsPremium(!isPremium)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${isPremium ? "bg-indigo-600" : "bg-gray-200"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isPremium ? "translate-x-5" : "translate-x-1"}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Premium</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsPublished(!isPublished)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${isPublished ? "bg-emerald-600" : "bg-gray-200"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isPublished ? "translate-x-5" : "translate-x-1"}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
          </div>

          {isPremium && (
            <div className="space-y-1.5">
              <Label>Price (USD)</Label>
              <Input
                type="number"
                value={priceCents}
                onChange={(e) => setPriceCents(e.target.value)}
                step="0.01"
                min="0"
                placeholder="9.99"
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "cards" && (
        <div className="space-y-4">
          {cards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-500">Card {i + 1}</span>
                {cards.length > 1 && (
                  <button onClick={() => removeCard(i)} className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Front (Question)</Label>
                  <Textarea
                    value={card.front}
                    onChange={(e) => updateCard(i, "front", e.target.value)}
                    rows={3}
                    placeholder="What is..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Back (Answer)</Label>
                  <Textarea
                    value={card.back}
                    onChange={(e) => updateCard(i, "back", e.target.value)}
                    rows={3}
                    placeholder="The answer is..."
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addCard} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Flashcard
          </Button>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="space-y-4">
          {quizzes.map((quiz, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-500">Question {i + 1}</span>
                {quizzes.length > 1 && (
                  <button onClick={() => removeQuiz(i)} className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Question</Label>
                  <Textarea
                    value={quiz.question}
                    onChange={(e) => updateQuiz(i, "question", e.target.value)}
                    rows={2}
                    placeholder="What is the accounting equation?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(["a", "b", "c", "d"] as const).map((opt) => (
                    <div key={opt} className="space-y-1.5">
                      <Label>Option {opt.toUpperCase()}</Label>
                      <Input
                        value={quiz[`option_${opt}` as keyof QuizDraft] as string}
                        onChange={(e) => updateQuiz(i, `option_${opt}` as keyof QuizDraft, e.target.value)}
                        placeholder={`Option ${opt.toUpperCase()}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Correct Answer</Label>
                    <Select
                      value={quiz.correct_answer}
                      onValueChange={(v) => updateQuiz(i, "correct_answer", v)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["a", "b", "c", "d"].map((o) => (
                          <SelectItem key={o} value={o}>Option {o.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Explanation (optional)</Label>
                    <Input
                      value={quiz.explanation}
                      onChange={(e) => updateQuiz(i, "explanation", e.target.value)}
                      placeholder="Because..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addQuiz} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Quiz Question
          </Button>
        </div>
      )}
    </div>
  );
}
