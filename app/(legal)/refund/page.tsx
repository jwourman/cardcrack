import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Refund Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: March 2025</p>

      <div className="space-y-8">
        {[
          {
            title: "Subscriptions",
            body: "New subscribers may request a full refund within 7 days of their first charge. After 7 days, subscriptions are non-refundable but you may cancel anytime to prevent future charges. Your access continues until the end of the current billing period.",
          },
          {
            title: "One-Time Deck Purchases",
            body: "One-time deck purchases are eligible for a full refund within 48 hours of purchase, provided you have not accessed more than 10% of the deck content.",
          },
          {
            title: "How to Request a Refund",
            body: "Email us at support@cardcrack.io with your order details and reason for the refund. We process refunds within 5-7 business days.",
          },
          {
            title: "Disputes",
            body: "If you believe a charge is incorrect, please contact us before filing a dispute with your bank. We are happy to resolve billing issues directly.",
          },
        ].map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
