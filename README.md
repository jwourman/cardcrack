# CardCrack

> **Premium flashcards, quizzes, and study packs for students who mean business.**

CardCrack is a production-ready full-stack study platform built with Next.js 14, Supabase, and Stripe. Students can browse, purchase, and study premium flashcard decks and quizzes across accounting, finance, economics, and more.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design system |
| UI Components | Radix UI primitives + custom shadcn-style |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| Payments | Stripe (Subscriptions + One-time purchases) |
| Deployment | Vercel |

---

## Features

- **Landing page** with hero, testimonials, pricing preview, FAQ
- **Browse decks** with category filters, difficulty, price, search
- **Deck detail pages** with preview cards, locked premium content
- **Flashcard study mode** with flip animation, keyboard shortcuts, progress tracking
- **Quiz mode** with multiple choice, scoring, explanations, retake
- **User dashboard** with subscription status, study history, quiz scores
- **Pricing page** with Free / Pro Monthly / Pro Yearly plans
- **Stripe checkout** for subscriptions and one-time deck purchases
- **Stripe webhook** handling for entitlement updates
- **Customer billing portal** for subscription management
- **Admin dashboard** with analytics, deck management, user/order overview
- **Admin deck editor** with flashcard and quiz question management
- **Role-based access control** (user, admin)
- **Premium content gating** (subscription OR individual purchase)
- **10 fully seeded decks** with 20–25 flashcards and 10–12 quiz questions each
- **Supabase Row Level Security** policies
- **Legal pages** (Terms, Privacy, Refund Policy, Contact)
- **SEO metadata** on all pages
- **Mobile-responsive** design throughout

---

## Seeded Content (10 Decks)

| # | Title | Category | Type |
|---|-------|----------|------|
| 1 | Financial Accounting Basics | Accounting | Free |
| 2 | Intro to Microeconomics | Economics | Free |
| 3 | Personal Finance Core Concepts | Personal Finance | Free |
| 4 | Managerial Accounting Essentials | Accounting | Premium $12.99 |
| 5 | Corporate Finance Fundamentals | Finance | Premium $14.99 |
| 6 | Macroeconomics Exam Review | Economics | Premium $12.99 |
| 7 | Business Statistics Basics | Statistics | Premium $12.99 |
| 8 | Principles of Marketing | Marketing | Premium $9.99 |
| 9 | Excel for Finance | Excel | Premium $12.99 |
| 10 | Banking and Risk Basics | Banking | Premium $12.99 |

---

## Setup Guide

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Stripe](https://stripe.com) account (test mode)
- [Vercel](https://vercel.com) account (for deployment)

---

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/cardcrack.git
cd cardcrack
npm install
```

---

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your real values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 3. Set up Supabase database

**Step 1: Create your Supabase project** at [supabase.com](https://supabase.com)

**Step 2: Run the schema**

1. Go to your Supabase project → SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and run it — this creates all tables, indexes, and RLS policies

**Step 3: Set up authentication**

1. Go to Supabase → Authentication → Settings
2. Set Site URL to `http://localhost:3000`
3. Add `http://localhost:3000/auth/callback` to Redirect URLs
4. For production, add your Vercel URL

**Step 4: Seed sample data**

1. First, create an admin user by signing up through the app
2. Update that user's role in Supabase: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com';`
3. Copy `supabase/seed.sql` into the SQL Editor and run it

The seed script will automatically use the first admin user as the deck creator.

---

### 4. Set up Stripe

**Step 1: Create products and prices**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Products
2. Create **"CardCrack Pro Monthly"**:
   - Price: $14.99/month (recurring)
   - Copy the Price ID → set as `STRIPE_MONTHLY_PRICE_ID`
3. Create **"CardCrack Pro Yearly"**:
   - Price: $99/year (recurring)
   - Copy the Price ID → set as `STRIPE_YEARLY_PRICE_ID`

**Step 2: Set up webhook**

For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This outputs a `whsec_...` key — set it as `STRIPE_WEBHOOK_SECRET`.

For production, go to Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

**Step 3: Test cards**

Use these Stripe test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Auth required: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC.

---

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Testing the full flow:**
1. Go to `/signup` and create an account
2. Check email for confirmation link (or disable email confirmation in Supabase settings for development)
3. Log in and browse `/decks`
4. Try purchasing a deck with Stripe test card
5. Go to `/dashboard` to see your content

---

## Deployment to Vercel

**Step 1: Push to GitHub**

```bash
git init
git add .
git commit -m "Initial CardCrack build"
git remote add origin https://github.com/YOUR_USERNAME/cardcrack.git
git push -u origin main
```

**Step 2: Import to Vercel**

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework: Next.js (auto-detected)
4. Add all environment variables from `.env`
5. Deploy

**Step 3: Configure Supabase for production**

1. In Supabase → Authentication → URL Configuration:
   - Set Site URL to `https://yourdomain.vercel.app`
   - Add `https://yourdomain.vercel.app/auth/callback` to Redirect URLs

**Step 4: Update Stripe webhook**

Add your production URL to Stripe webhooks (see Step 2 of Stripe setup above).

**Step 5: Update env**

Set `NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app` in Vercel env vars.

---

## Admin Access

1. Sign up with any email
2. In Supabase SQL Editor, run:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```
3. Log out and back in — you'll see the Admin panel link in your account menu
4. Go to `/admin` to manage decks, view orders, and see analytics

---

## Project Structure

```
cardcrack/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login, Signup
│   ├── (legal)/           # Terms, Privacy, Refund, Contact
│   ├── admin/             # Admin dashboard (role-protected)
│   ├── api/stripe/        # Stripe webhook + checkout API routes
│   ├── checkout/          # Success/cancel pages
│   ├── dashboard/         # User dashboard
│   ├── decks/             # Browse, detail, study, quiz
│   ├── pricing/           # Pricing page
│   └── auth/callback/     # Supabase auth callback
├── components/
│   ├── ui/                # Base UI components (Button, Card, etc.)
│   ├── layout/            # Navbar, Footer
│   ├── admin/             # Admin-specific components
│   ├── dashboard/         # Dashboard components
│   ├── decks/             # Deck grid, filters, purchase button
│   ├── quiz/              # Quiz mode
│   └── study/             # Flashcard study mode
├── lib/
│   ├── supabase/          # Client, server, middleware helpers
│   ├── stripe/            # Stripe utilities
│   ├── access.ts          # Entitlement checking
│   ├── constants.ts       # App-wide constants
│   └── utils.ts           # Shared utility functions
├── hooks/
│   └── use-toast.ts       # Toast notification hook
├── types/
│   └── index.ts           # TypeScript types
├── middleware.ts           # Route protection middleware
├── supabase/
│   ├── schema.sql         # Full database schema
│   └── seed.sql           # 10 decks with full content
└── scripts/
    └── seed.ts            # Seed helper script
```

---

## License

MIT — build something great.
