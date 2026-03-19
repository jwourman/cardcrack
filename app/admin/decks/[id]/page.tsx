import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import DeckForm from "@/components/admin/DeckForm";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Edit Deck | Admin" };

export default async function EditDeckPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServiceClient();

  const [deckResult, flashcardsResult, questionsResult] = await Promise.all([
    supabase.from("decks").select("*").eq("id", id).single(),
    supabase.from("flashcards").select("*").eq("deck_id", id).order("order_index"),
    supabase.from("quiz_questions").select("*").eq("deck_id", id).order("order_index"),
  ]);

  if (deckResult.error || !deckResult.data) notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Edit Deck</h1>
      <p className="text-gray-500 text-sm mb-8">Update deck content, flashcards, and quiz questions.</p>
      <DeckForm
        deck={deckResult.data}
        flashcards={flashcardsResult.data ?? []}
        quizQuestions={questionsResult.data ?? []}
      />
    </div>
  );
}
