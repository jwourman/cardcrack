import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canAccessDeck } from "@/lib/access";
import type { Deck, Flashcard } from "@/types";
import StudyMode from "@/components/study/StudyMode";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StudyPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/decks/${slug}/study`);

  const { data: deck } = await supabase
    .from("decks")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!deck) notFound();

  const hasAccess = await canAccessDeck(user.id, deck as Deck);
  if (!hasAccess) redirect(`/decks/${slug}?locked=true`);

  const { data: flashcards } = await supabase
    .from("flashcards")
    .select("*")
    .eq("deck_id", deck.id)
    .order("order_index");

  return (
    <StudyMode
      deck={deck as Deck}
      flashcards={(flashcards ?? []) as Flashcard[]}
      userId={user.id}
    />
  );
}
