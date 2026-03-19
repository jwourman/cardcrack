import DeckForm from "@/components/admin/DeckForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Deck | Admin" };

export default function NewDeckPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Create New Deck</h1>
      <p className="text-gray-500 text-sm mb-8">Fill in the deck details, add flashcards and quiz questions.</p>
      <DeckForm />
    </div>
  );
}
