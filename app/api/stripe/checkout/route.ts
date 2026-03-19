export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession, getOrCreateStripeCustomer } from "@/lib/stripe";
import { PLAN_PRICES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, deckId, mode } = await request.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id, full_name")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      customerId = await getOrCreateStripeCustomer(user.id, user.email!);
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    if (mode === "subscription") {
      const priceId =
        plan === "monthly"
          ? process.env.STRIPE_MONTHLY_PRICE_ID!
          : process.env.STRIPE_YEARLY_PRICE_ID!;

      if (!priceId) {
        return NextResponse.json(
          { error: "Stripe price ID not configured" },
          { status: 500 }
        );
      }

      const session = await createCheckoutSession({
        userId: user.id,
        email: user.email!,
        priceId,
        successUrl: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${appUrl}/pricing`,
        mode: "subscription",
        stripeCustomerId: customerId,
      });

      return NextResponse.json({ url: session.url });
    }

    if (mode === "payment" && deckId) {
      // One-time purchase
      const { data: deck } = await supabase
        .from("decks")
        .select("id, price_cents, title")
        .eq("id", deckId)
        .single();

      if (!deck) {
        return NextResponse.json({ error: "Deck not found" }, { status: 404 });
      }

      // Create a Stripe price on the fly for one-time payment
      const { getStripe } = await import("@/lib/stripe");
      const price = await getStripe().prices.create({
        unit_amount: deck.price_cents,
        currency: "usd",
        product_data: { name: deck.title },
      });

      const session = await createCheckoutSession({
        userId: user.id,
        email: user.email!,
        priceId: price.id,
        deckId: deck.id,
        successUrl: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${appUrl}/decks`,
        mode: "payment",
        stripeCustomerId: customerId,
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
