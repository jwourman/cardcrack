import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout Cancelled" };

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Checkout Cancelled</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          No problem — you weren't charged. Your cart is saved and you can come back anytime.
        </p>
        <div className="flex gap-3">
          <Link href="/pricing" className="flex-1">
            <Button className="w-full gap-2">
              View Pricing
            </Button>
          </Link>
          <Link href="/decks" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Browse Decks
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
