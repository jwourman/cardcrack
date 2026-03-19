import Link from "next/link";
import { CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Successful" };

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Your purchase is confirmed. You now have full access to your content. Head to your dashboard to start studying.
        </p>
        <div className="flex gap-3">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full gap-2">
              <BookOpen className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/decks" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              Browse More
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
