import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: March 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">
        {[
          {
            title: "1. Acceptance of Terms",
            body: "By accessing or using CardCrack, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.",
          },
          {
            title: "2. Use of Service",
            body: "CardCrack provides premium flashcard decks, quizzes, and study tools for educational purposes. You agree to use the service only for lawful purposes and not to redistribute, copy, or resell any content.",
          },
          {
            title: "3. Account Responsibilities",
            body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access.",
          },
          {
            title: "4. Payments and Subscriptions",
            body: "Premium subscriptions are billed monthly or annually. All payments are processed by Stripe. You may cancel at any time; access continues until the end of the billing period.",
          },
          {
            title: "5. Intellectual Property",
            body: "All content on CardCrack — including flashcards, quiz questions, and study materials — is the intellectual property of CardCrack or its licensors. Unauthorized reproduction is prohibited.",
          },
          {
            title: "6. Limitation of Liability",
            body: "CardCrack is provided 'as is' without warranties of any kind. We are not liable for any educational outcomes, exam results, or damages arising from use of the platform.",
          },
          {
            title: "7. Modifications",
            body: "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.",
          },
          {
            title: "8. Contact",
            body: "Questions about these terms? Contact us at legal@cardcrack.io",
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
