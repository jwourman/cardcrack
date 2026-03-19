export const SITE_NAME = "CardCrack";
export const SITE_DESCRIPTION =
  "Premium flashcards, quizzes, and study packs built to help students master tough subjects faster.";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const CATEGORIES = [
  { value: "accounting", label: "Accounting" },
  { value: "finance", label: "Finance" },
  { value: "economics", label: "Economics" },
  { value: "marketing", label: "Marketing" },
  { value: "statistics", label: "Statistics" },
  { value: "personal-finance", label: "Personal Finance" },
  { value: "banking", label: "Banking" },
  { value: "excel", label: "Excel & Data" },
  { value: "business", label: "Business" },
];

export const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const FREE_CARD_PREVIEW_COUNT = 5;
export const FREE_QUIZ_PREVIEW_COUNT = 3;

export const PLANS = {
  FREE: "free",
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export const PLAN_PRICES = {
  MONTHLY: 1499, // $14.99
  YEARLY: 9900,  // $99.00 ($8.25/mo)
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/decks", label: "Browse Decks" },
  { href: "/pricing", label: "Pricing" },
];

export const FOOTER_LINKS = {
  product: [
    { href: "/decks", label: "Browse Decks" },
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  company: [
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/refund", label: "Refund Policy" },
  ],
};
