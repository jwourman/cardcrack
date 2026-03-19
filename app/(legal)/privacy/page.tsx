import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: March 2025</p>

      <div className="space-y-8">
        {[
          {
            title: "Information We Collect",
            body: "We collect information you provide directly (name, email, payment info), usage data (study sessions, quiz scores, deck interactions), and technical data (IP address, browser type).",
          },
          {
            title: "How We Use Your Information",
            body: "We use your data to provide the service, personalize your study experience, process payments, send service emails, and improve the platform.",
          },
          {
            title: "Data Storage",
            body: "Your data is stored securely using Supabase (PostgreSQL). Payment information is handled exclusively by Stripe and is never stored on our servers.",
          },
          {
            title: "Data Sharing",
            body: "We do not sell your personal data. We share data only with service providers necessary to operate the platform (Stripe for payments, Supabase for database).",
          },
          {
            title: "Cookies",
            body: "We use session cookies for authentication and minimal analytics cookies. You can disable cookies in your browser settings.",
          },
          {
            title: "Your Rights",
            body: "You have the right to access, update, or delete your personal data at any time. Contact us at privacy@cardcrack.io to exercise these rights.",
          },
          {
            title: "Contact",
            body: "Questions about your privacy? Email us at privacy@cardcrack.io.",
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
