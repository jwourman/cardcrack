import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import { formatCents, getCategoryIcon } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Decks | Admin" };

export default async function AdminDecksPage() {
  const supabase = await createServiceClient();
  const { data: decks } = await supabase
    .from("decks")
    .select(`
      *,
      flashcard_count:flashcards(count),
      quiz_question_count:quiz_questions(count)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Decks</h1>
          <p className="text-gray-500 text-sm">{decks?.length ?? 0} total decks</p>
        </div>
        <Link href="/admin/decks/new">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Deck
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Deck</th>
                <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Category</th>
                <th className="text-center p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Cards</th>
                <th className="text-center p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Type</th>
                <th className="text-center p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Price</th>
                <th className="text-center p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                <th className="text-right p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(decks ?? []).map((deck) => {
                const cardCount = Array.isArray(deck.flashcard_count)
                  ? (deck.flashcard_count[0]?.count ?? 0)
                  : 0;
                const quizCount = Array.isArray(deck.quiz_question_count)
                  ? (deck.quiz_question_count[0]?.count ?? 0)
                  : 0;

                return (
                  <tr key={deck.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(deck.category)}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{deck.title}</p>
                          <p className="text-xs text-gray-400">{deck.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 capitalize">{deck.category}</td>
                    <td className="p-4 text-center">
                      <div className="text-gray-700">
                        <span className="font-medium">{cardCount}</span>
                        <span className="text-gray-400"> / </span>
                        <span>{quizCount}q</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        deck.is_premium ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {deck.is_premium ? "Premium" : "Free"}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-600">
                      {deck.is_premium ? formatCents(deck.price_cents) : "—"}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        deck.is_published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {deck.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/decks/${deck.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/decks/${deck.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
