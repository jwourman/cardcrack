"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BillingPortalButtonProps {
  variant?: "default" | "white" | "outline";
}

export default function BillingPortalButton({ variant = "outline" }: BillingPortalButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      window.location.href = data.url;
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not open billing portal.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePortal}
      disabled={loading}
      variant={variant as any}
      size="sm"
      className="gap-2"
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <ExternalLink className="w-4 h-4" />
      )}
      Manage Billing
    </Button>
  );
}
