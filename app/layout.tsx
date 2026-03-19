import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@/types";

export const metadata: Metadata = {
  title: {
    default: "CardCrack — Premium Study Flashcards & Quizzes",
    template: "%s | CardCrack",
  },
  description:
    "Premium flashcards, quizzes, and study packs built to help students master accounting, finance, economics, and more. Study less randomly. Remember more.",
  keywords: [
    "flashcards",
    "accounting flashcards",
    "finance study cards",
    "economics quiz prep",
    "college study decks",
    "exam review flashcards",
    "study app",
    "active recall",
  ],
  authors: [{ name: "CardCrack" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "CardCrack",
    title: "CardCrack — Premium Study Flashcards & Quizzes",
    description:
      "Premium flashcards, quizzes, and study packs built to help students master tough subjects faster.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CardCrack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CardCrack — Premium Study Flashcards & Quizzes",
    description: "Study less randomly. Remember more.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();
      user = data ?? null;
    }
  } catch {
    // Supabase not configured yet
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
