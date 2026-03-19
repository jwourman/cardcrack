"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Deck } from "@/types";
import type { User } from "@supabase/supabase-js";

interface DeckPurchaseButtonProps {
  deck: Deck;
  user: User | null;
}

export default function DeckPurchaseButton({ deck, user }: DeckPurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePurchase = async () => {
    if (!user) {
      router.push(`/login?redirect=/decks/${deck.slug}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId: deck.id, mode: "payment" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast({
        title: "Checkout failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePurchase} disabled={loading} className="w-full gap-2" size="lg">
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          {user ? "Buy This Deck" : "Sign In to Purchase"}
        </>
      )}
    </Button>
  );
}
