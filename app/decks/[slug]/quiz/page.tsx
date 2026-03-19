import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canAccessDeck } from "@/lib/access";
import type { Deck, QuizQuestion } from "@/types";
import QuizMode from "@/components/quiz/QuizMode";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function QuizPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/decks/${slug}/quiz`);

  const { data: deck } = await supabase
    .from("decks")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!deck) notFound();

  const hasAccess = await canAccessDeck(user.id, deck as Deck);
  if (!hasAccess) redirect(`/decks/${slug}?locked=true`);

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("deck_id", deck.id)
    .order("order_index");

  return (
    <QuizMode
      deck={deck as Deck}
      questions={(questions ?? []) as QuizQuestion[]}
      userId={user.id}
    />
  );
}
