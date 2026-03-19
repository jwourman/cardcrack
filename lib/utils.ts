import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "…";
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "beginner":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "intermediate":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "advanced":
      return "text-rose-600 bg-rose-50 border-rose-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    accounting: "from-blue-600 to-blue-800",
    finance: "from-green-600 to-emerald-800",
    economics: "from-purple-600 to-violet-800",
    marketing: "from-orange-500 to-rose-600",
    statistics: "from-cyan-600 to-blue-700",
    "personal-finance": "from-teal-600 to-green-700",
    banking: "from-indigo-600 to-blue-800",
    excel: "from-green-500 to-teal-700",
    business: "from-slate-600 to-gray-800",
    default: "from-indigo-600 to-purple-700",
  };
  return (
    gradients[category.toLowerCase().replace(/\s+/g, "-")] ??
    gradients.default
  );
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    accounting: "📊",
    finance: "💹",
    economics: "🌐",
    marketing: "📣",
    statistics: "📈",
    "personal-finance": "💰",
    banking: "🏦",
    excel: "📋",
    business: "💼",
  };
  return icons[category.toLowerCase().replace(/\s+/g, "-")] ?? "📚";
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
