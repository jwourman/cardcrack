import { createClient } from "@/lib/supabase/server";

export async function getUserAccess(userId: string | null) {
  if (!userId) return { isSubscribed: false, purchasedDeckIds: [] };

  const supabase = await createClient();

  const [subResult, purchaseResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .maybeSingle(),
    supabase
      .from("purchases")
      .select("deck_id")
      .eq("user_id", userId)
      .eq("status", "completed"),
  ]);

  return {
    isSubscribed: !!subResult.data,
    purchasedDeckIds: (purchaseResult.data ?? []).map((p) => p.deck_id),
  };
}

export async function canAccessDeck(
  userId: string | null,
  deck: { is_premium: boolean; id: string }
): Promise<boolean> {
  if (!deck.is_premium) return true;
  if (!userId) return false;

  const { isSubscribed, purchasedDeckIds } = await getUserAccess(userId);
  return isSubscribed || purchasedDeckIds.includes(deck.id);
}
