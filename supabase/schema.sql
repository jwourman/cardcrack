-- ============================================================
-- CardCrack Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS TABLE (extends auth.users)
-- ============================================================
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

-- Index
create index users_email_idx on public.users(email);
create index users_stripe_customer_id_idx on public.users(stripe_customer_id);

-- RLS
alter table public.users enable row level security;

create policy "Users can read own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

create policy "Service role can manage all users" on public.users
  using (true) with check (true);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- DECKS TABLE
-- ============================================================
create table public.decks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null,
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_minutes int not null default 30,
  thumbnail_url text,
  is_premium boolean not null default false,
  is_published boolean not null default false,
  price_cents int not null default 0,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index decks_slug_idx on public.decks(slug);
create index decks_category_idx on public.decks(category);
create index decks_is_published_idx on public.decks(is_published);

alter table public.decks enable row level security;

create policy "Anyone can view published decks" on public.decks
  for select using (is_published = true);

create policy "Admins can manage all decks" on public.decks
  using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- FLASHCARDS TABLE
-- ============================================================
create table public.flashcards (
  id uuid primary key default uuid_generate_v4(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  front text not null,
  back text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index flashcards_deck_id_idx on public.flashcards(deck_id);

alter table public.flashcards enable row level security;

create policy "Users can view flashcards of published decks" on public.flashcards
  for select using (
    exists (
      select 1 from public.decks d
      where d.id = deck_id and d.is_published = true
    )
  );

create policy "Admins can manage flashcards" on public.flashcards
  using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- QUIZ QUESTIONS TABLE
-- ============================================================
create table public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text not null check (correct_answer in ('a', 'b', 'c', 'd')),
  explanation text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index quiz_questions_deck_id_idx on public.quiz_questions(deck_id);

alter table public.quiz_questions enable row level security;

create policy "Users can view quiz questions of published decks" on public.quiz_questions
  for select using (
    exists (
      select 1 from public.decks d
      where d.id = deck_id and d.is_published = true
    )
  );

create policy "Admins can manage quiz questions" on public.quiz_questions
  using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- PURCHASES TABLE
-- ============================================================
create table public.purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  stripe_payment_intent_id text,
  amount_cents int not null default 0,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);

create index purchases_user_id_idx on public.purchases(user_id);
create index purchases_deck_id_idx on public.purchases(deck_id);

alter table public.purchases enable row level security;

create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid() = user_id);

create policy "Service role can manage purchases" on public.purchases
  using (true);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_price_id text not null,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_end timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_stripe_subscription_id_idx on public.subscriptions(stripe_subscription_id);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Service role can manage subscriptions" on public.subscriptions
  using (true);

-- ============================================================
-- STUDY SESSIONS TABLE
-- ============================================================
create table public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  cards_reviewed int not null default 0,
  known_count int not null default 0,
  review_count int not null default 0
);

create index study_sessions_user_id_idx on public.study_sessions(user_id);

alter table public.study_sessions enable row level security;

create policy "Users can manage own study sessions" on public.study_sessions
  using (auth.uid() = user_id);

-- ============================================================
-- QUIZ ATTEMPTS TABLE
-- ============================================================
create table public.quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  score int not null default 0,
  total_questions int not null default 0,
  completed_at timestamptz not null default now()
);

create index quiz_attempts_user_id_idx on public.quiz_attempts(user_id);

alter table public.quiz_attempts enable row level security;

create policy "Users can manage own quiz attempts" on public.quiz_attempts
  using (auth.uid() = user_id);

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  body text,
  created_at timestamptz not null default now(),
  unique (user_id, deck_id)
);

create index reviews_deck_id_idx on public.reviews(deck_id);

alter table public.reviews enable row level security;

create policy "Anyone can view reviews" on public.reviews for select using (true);

create policy "Users can manage own reviews" on public.reviews
  using (auth.uid() = user_id);

-- ============================================================
-- SAVED DECKS TABLE
-- ============================================================
create table public.saved_decks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, deck_id)
);

alter table public.saved_decks enable row level security;

create policy "Users can manage own saved decks" on public.saved_decks
  using (auth.uid() = user_id);
