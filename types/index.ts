export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  stripe_customer_id: string | null;
  created_at: string;
}

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Deck {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  estimated_minutes: number;
  thumbnail_url: string | null;
  is_premium: boolean;
  is_published: boolean;
  price_cents: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  flashcard_count?: number;
  quiz_question_count?: number;
  avg_rating?: number;
  review_count?: number;
}

export interface Flashcard {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  order_index: number;
}

export interface QuizQuestion {
  id: string;
  deck_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "a" | "b" | "c" | "d";
  explanation: string | null;
  order_index: number;
}

export interface Purchase {
  id: string;
  user_id: string;
  deck_id: string;
  stripe_payment_intent_id: string | null;
  amount_cents: number;
  status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  deck_id: string;
  started_at: string;
  completed_at: string | null;
  cards_reviewed: number;
  known_count: number;
  review_count: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  deck_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  deck_id: string;
  rating: number;
  body: string | null;
  created_at: string;
  user?: { full_name: string | null; avatar_url: string | null };
}

export interface SavedDeck {
  id: string;
  user_id: string;
  deck_id: string;
  created_at: string;
}

export type PlanType = "free" | "monthly" | "yearly";

export interface PricingPlan {
  id: PlanType;
  name: string;
  price: number | null;
  period: string | null;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  stripePriceId: string | null;
}

export interface DeckWithAccess extends Deck {
  hasAccess: boolean;
  isPurchased: boolean;
  isSubscribed: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalDecks: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalPurchases: number;
  recentSignups: number;
}
