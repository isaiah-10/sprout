-- ============================================================
-- SPROUT — Initial Database Schema
-- Run this in Supabase SQL editor or via `supabase db push`
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES (parent accounts, extends auth.users)
-- ============================================================
create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  full_name           text not null,
  avatar_url          text,
  subscription_status text not null default 'free_trial',
    -- 'free_trial' | 'active' | 'past_due' | 'cancelled'
  subscription_plan   text,
    -- 'solo' | 'family'
  subscription_end_at timestamptz,
  trial_end_at        timestamptz default (now() + interval '14 days'),
  stripe_customer_id  text unique,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- CHILD PROFILES
-- ============================================================
create table public.child_profiles (
  id               uuid primary key default gen_random_uuid(),
  parent_id        uuid not null references public.profiles(id) on delete cascade,
  name             text not null,
  date_of_birth    date not null,
  avatar_emoji     text not null default '🌱',
  color            text not null default '#52B788',
    -- accent color for this child's profile card
  pin_hash         text,
    -- bcrypt hash of 4-digit PIN, for under-13 access on shared device
  auth_user_id     uuid references auth.users(id),
    -- for 13+ with their own login
  -- Investing settings
  approval_mode    text not null default 'all',
    -- 'all' = parent approves everything (13–16 default)
    -- 'self' = kid self-approves (17–18, if parent enables)
  monthly_invest_limit numeric,
    -- max real money kid can request to invest per month (null = no limit)
  -- Balances
  virtual_balance  numeric not null default 10000,
    -- "Seeds" for under-13 simulator (starts at $10,000 virtual)
  real_balance     numeric not null default 0,
    -- real money funded by parent for 13+ investing
  real_balance_pending numeric not null default 0,
    -- funds locked in pending trade requests
  -- Gamification
  xp               integer not null default 0,
  streak_days      integer not null default 0,
  longest_streak   integer not null default 0,
  last_activity_date date,
  -- Meta
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- VIRTUAL HOLDINGS (5–12 stock simulator)
-- ============================================================
create table public.virtual_holdings (
  id            uuid primary key default gen_random_uuid(),
  child_id      uuid not null references public.child_profiles(id) on delete cascade,
  symbol        text not null,
  company_name  text not null,
  shares        numeric not null check (shares > 0),
  avg_buy_price numeric not null check (avg_buy_price > 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (child_id, symbol)
);

-- ============================================================
-- VIRTUAL TRANSACTIONS (5–12)
-- ============================================================
create table public.virtual_transactions (
  id              uuid primary key default gen_random_uuid(),
  child_id        uuid not null references public.child_profiles(id) on delete cascade,
  symbol          text not null,
  company_name    text not null,
  type            text not null check (type in ('buy', 'sell', 'game_reward', 'task_reward', 'starting_balance')),
  shares          numeric,
  price_per_share numeric,
  total_amount    numeric not null,
  note            text,
  executed_at     timestamptz not null default now()
);

-- ============================================================
-- REAL HOLDINGS (13+ investing)
-- ============================================================
create table public.real_holdings (
  id            uuid primary key default gen_random_uuid(),
  child_id      uuid not null references public.child_profiles(id) on delete cascade,
  symbol        text not null,
  company_name  text not null,
  asset_type    text not null default 'stock',
    -- 'stock' | 'etf' | 'index_fund' | 'reit' | 'crypto'
  shares        numeric not null check (shares > 0),
  avg_buy_price numeric not null check (avg_buy_price > 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (child_id, symbol)
);

-- ============================================================
-- TRADE REQUESTS (13+ parent approval system)
-- ============================================================
create table public.trade_requests (
  id                uuid primary key default gen_random_uuid(),
  child_id          uuid not null references public.child_profiles(id) on delete cascade,
  parent_id         uuid not null references public.profiles(id) on delete cascade,
  symbol            text not null,
  company_name      text not null,
  asset_type        text not null default 'stock',
  trade_type        text not null check (trade_type in ('buy', 'sell')),
  shares            numeric not null check (shares > 0),
  estimated_price   numeric not null,
  total_estimated   numeric not null,
  status            text not null default 'pending',
    -- 'pending' | 'approved' | 'denied' | 'expired'
  kid_note          text,
    -- kid's reason for wanting the trade
  parent_note       text,
    -- parent's feedback when approving/denying
  created_at        timestamptz not null default now(),
  reviewed_at       timestamptz,
  expires_at        timestamptz not null default (now() + interval '48 hours')
);

-- ============================================================
-- REAL TRANSACTIONS (13+)
-- ============================================================
create table public.real_transactions (
  id                uuid primary key default gen_random_uuid(),
  child_id          uuid not null references public.child_profiles(id) on delete cascade,
  trade_request_id  uuid references public.trade_requests(id),
  symbol            text,
  company_name      text,
  asset_type        text,
  type              text not null,
    -- 'buy' | 'sell' | 'deposit' | 'withdrawal'
  shares            numeric,
  price_per_share   numeric,
  total_amount      numeric not null,
  note              text,
  executed_at       timestamptz not null default now()
);

-- ============================================================
-- SAVINGS GOALS (5–12)
-- ============================================================
create table public.savings_goals (
  id             uuid primary key default gen_random_uuid(),
  child_id       uuid not null references public.child_profiles(id) on delete cascade,
  title          text not null,
  emoji          text not null default '🎯',
  target_amount  numeric not null check (target_amount > 0),
  current_amount numeric not null default 0,
  completed      boolean not null default false,
  completed_at   timestamptz,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- ALLOWANCES (recurring parent-to-kid payments)
-- ============================================================
create table public.allowances (
  id                uuid primary key default gen_random_uuid(),
  child_id          uuid not null references public.child_profiles(id) on delete cascade,
  parent_id         uuid not null references public.profiles(id) on delete cascade,
  amount            numeric not null check (amount > 0),
  currency_type     text not null default 'seeds',
    -- 'seeds' for under-13, 'real' for 13+
  frequency         text not null default 'weekly',
    -- 'weekly' | 'biweekly' | 'monthly'
  next_payment_date date not null,
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- ACHIEVEMENTS CATALOG
-- ============================================================
create table public.achievements (
  id          text primary key,
  name        text not null,
  description text not null,
  emoji       text not null,
  xp_reward   integer not null default 50,
  category    text not null default 'general',
    -- 'investing' | 'saving' | 'learning' | 'streak' | 'social'
  min_age     integer not null default 5,
  max_age     integer not null default 18
);

create table public.child_achievements (
  id             uuid primary key default gen_random_uuid(),
  child_id       uuid not null references public.child_profiles(id) on delete cascade,
  achievement_id text not null references public.achievements(id),
  earned_at      timestamptz not null default now(),
  unique (child_id, achievement_id)
);

-- ============================================================
-- XP LOG
-- ============================================================
create table public.xp_log (
  id         uuid primary key default gen_random_uuid(),
  child_id   uuid not null references public.child_profiles(id) on delete cascade,
  amount     integer not null,
  reason     text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- GAME SESSIONS
-- ============================================================
create table public.game_sessions (
  id           uuid primary key default gen_random_uuid(),
  child_id     uuid not null references public.child_profiles(id) on delete cascade,
  game_slug    text not null,
  score        integer not null default 0,
  seeds_earned integer not null default 0,
  xp_earned    integer not null default 0,
  completed    boolean not null default false,
  played_at    timestamptz not null default now()
);

-- ============================================================
-- STOCK QUOTE CACHE (reduces API calls)
-- ============================================================
create table public.stock_quote_cache (
  symbol     text primary key,
  data       jsonb not null,
  cached_at  timestamptz not null default now()
);

-- ============================================================
-- ACTIVITY LOG (parent's view of kid activity)
-- ============================================================
create table public.activity_log (
  id          uuid primary key default gen_random_uuid(),
  child_id    uuid not null references public.child_profiles(id) on delete cascade,
  parent_id   uuid not null references public.profiles(id),
  type        text not null,
    -- 'trade_request' | 'trade_executed' | 'game_played' |
    -- 'lesson_completed' | 'goal_created' | 'goal_completed' |
    -- 'achievement_earned' | 'deposit_received' | 'streak_milestone'
  title       text not null,
  description text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- LEARN PROGRESS (track completed lessons)
-- ============================================================
create table public.learn_progress (
  id           uuid primary key default gen_random_uuid(),
  child_id     uuid not null references public.child_profiles(id) on delete cascade,
  lesson_id    text not null,
  completed_at timestamptz not null default now(),
  xp_earned    integer not null default 0,
  unique (child_id, lesson_id)
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_update
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger on_child_profiles_update
  before update on public.child_profiles
  for each row execute function public.handle_updated_at();

create trigger on_virtual_holdings_update
  before update on public.virtual_holdings
  for each row execute function public.handle_updated_at();

create trigger on_real_holdings_update
  before update on public.real_holdings
  for each row execute function public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SEED ACHIEVEMENTS
-- ============================================================
insert into public.achievements (id, name, description, emoji, xp_reward, category, min_age, max_age) values
  ('first_trade',       'First Trade!',          'Made your first investment',           '📈', 100, 'investing', 5,  18),
  ('first_goal',        'Goal Setter',            'Created your first savings goal',      '🎯', 50,  'saving',    5,  12),
  ('goal_complete',     'Goal Crusher',           'Completed a savings goal',             '🏆', 150, 'saving',    5,  12),
  ('streak_3',          '3-Day Streak',           'Logged in 3 days in a row',            '🔥', 30,  'streak',    5,  18),
  ('streak_7',          'Week Warrior',           'Logged in 7 days in a row',            '⚡', 75,  'streak',    5,  18),
  ('streak_30',         'Month Master',           'Logged in 30 days in a row',           '🌟', 300, 'streak',    5,  18),
  ('first_game',        'Game On!',               'Played your first game',               '🎮', 25,  'learning',  5,  12),
  ('first_lesson',      'Eager Learner',          'Completed your first lesson',          '📚', 50,  'learning',  5,  18),
  ('portfolio_up',      'Green Machine',          'Your portfolio is up 10%',             '💚', 100, 'investing', 5,  18),
  ('diversified',       'Smart Investor',         'Hold 5 different investments',         '🧠', 200, 'investing', 5,  18),
  ('first_deposit',     'Funded!',                'Parent added real money to invest',    '💰', 100, 'investing', 13, 18),
  ('penny_saver',       'Penny Saver',            'Saved 100 Seeds',                      '🐷', 50,  'saving',    5,  12),
  ('seed_millionaire',  'Seed Millionaire',       'Grew your Seeds to $50,000',           '🌱', 500, 'investing', 5,  12),
  ('lesson_5',          'Curious Mind',           'Completed 5 lessons',                  '🔭', 100, 'learning',  5,  18),
  ('lesson_20',         'Finance Scholar',        'Completed 20 lessons',                 '🎓', 300, 'learning',  5,  18),
  ('game_master',       'Game Master',            'Got a perfect score in any game',      '🏅', 150, 'learning',  5,  12),
  ('compound_king',     'Compound King',          'Learned about compound interest',      '📊', 75,  'learning',  13, 18),
  ('watchlist_5',       'Market Watcher',         'Added 5 stocks to watchlist',          '👀', 50,  'investing', 5,  18);
