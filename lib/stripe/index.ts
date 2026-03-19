import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

// Named export for convenience in API routes
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  },
});

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  deckId,
  successUrl,
  cancelUrl,
  mode,
  stripeCustomerId,
}: {
  userId: string;
  email: string;
  priceId: string;
  deckId?: string;
  successUrl: string;
  cancelUrl: string;
  mode: "subscription" | "payment";
  stripeCustomerId?: string | null;
}) {
  const client = getStripe();
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      ...(deckId ? { deckId } : {}),
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  };

  if (stripeCustomerId) {
    sessionParams.customer = stripeCustomerId;
  } else {
    sessionParams.customer_email = email;
  }

  if (mode === "subscription") {
    sessionParams.subscription_data = {
      metadata: { userId },
    };
  }

  return client.checkout.sessions.create(sessionParams);
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  return getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  const client = getStripe();
  const existing = await client.customers.search({
    query: `metadata['userId']:'${userId}'`,
    limit: 1,
  });

  if (existing.data.length > 0) {
    return existing.data[0].id;
  }

  const customer = await client.customers.create({
    email,
    metadata: { userId },
  });

  return customer.id;
}
