-- ============================================================
-- SPROUT — Row Level Security Policies
-- Ensures parents only see their own data, kids can't access
-- other families' data.
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles          enable row level security;
alter table public.child_profiles    enable row level security;
alter table public.virtual_holdings  enable row level security;
alter table public.virtual_transactions enable row level security;
alter table public.real_holdings     enable row level security;
alter table public.trade_requests    enable row level security;
alter table public.real_transactions enable row level security;
alter table public.savings_goals     enable row level security;
alter table public.allowances        enable row level security;
alter table public.achievements      enable row level security;
alter table public.child_achievements enable row level security;
alter table public.xp_log            enable row level security;
alter table public.game_sessions     enable row level security;
alter table public.stock_quote_cache enable row level security;
alter table public.activity_log      enable row level security;
alter table public.learn_progress    enable row level security;

-- ============================================================
-- PROFILES — users see only their own profile
-- ============================================================
create policy "profiles: owner read" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: owner update" on public.profiles
  for update using (auth.uid() = id);

-- ============================================================
-- CHILD PROFILES — parent sees/manages their own kids
-- ============================================================
create policy "child_profiles: parent read" on public.child_profiles
  for select using (auth.uid() = parent_id);

create policy "child_profiles: parent insert" on public.child_profiles
  for insert with check (auth.uid() = parent_id);

create policy "child_profiles: parent update" on public.child_profiles
  for update using (auth.uid() = parent_id);

create policy "child_profiles: parent delete" on public.child_profiles
  for delete using (auth.uid() = parent_id);

-- ============================================================
-- VIRTUAL HOLDINGS — parent sees their kids' holdings
-- ============================================================
create policy "virtual_holdings: parent read" on public.virtual_holdings
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = virtual_holdings.child_id
      and cp.parent_id = auth.uid()
    )
  );

create policy "virtual_holdings: parent write" on public.virtual_holdings
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = virtual_holdings.child_id
      and cp.parent_id = auth.uid()
    )
  );

-- ============================================================
-- VIRTUAL TRANSACTIONS
-- ============================================================
create policy "virtual_transactions: parent read" on public.virtual_transactions
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = virtual_transactions.child_id
      and cp.parent_id = auth.uid()
    )
  );

create policy "virtual_transactions: parent write" on public.virtual_transactions
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = virtual_transactions.child_id
      and cp.parent_id = auth.uid()
    )
  );

-- ============================================================
-- REAL HOLDINGS
-- ============================================================
create policy "real_holdings: parent read" on public.real_holdings
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = real_holdings.child_id
      and cp.parent_id = auth.uid()
    )
  );

create policy "real_holdings: parent write" on public.real_holdings
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = real_holdings.child_id
      and cp.parent_id = auth.uid()
    )
  );

-- ============================================================
-- TRADE REQUESTS — parent approves/denies
-- ============================================================
create policy "trade_requests: parent read" on public.trade_requests
  for select using (auth.uid() = parent_id);

create policy "trade_requests: parent write" on public.trade_requests
  for all using (auth.uid() = parent_id);

-- ============================================================
-- REAL TRANSACTIONS
-- ============================================================
create policy "real_transactions: parent read" on public.real_transactions
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = real_transactions.child_id
      and cp.parent_id = auth.uid()
    )
  );

create policy "real_transactions: parent write" on public.real_transactions
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = real_transactions.child_id
      and cp.parent_id = auth.uid()
    )
  );

-- ============================================================
-- SAVINGS GOALS
-- ============================================================
create policy "savings_goals: parent read" on public.savings_goals
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = savings_goals.child_id
      and cp.parent_id = auth.uid()
    )
  );

create policy "savings_goals: parent write" on public.savings_goals
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = savings_goals.child_id
      and cp.parent_id = auth.uid()
    )
  );

-- ============================================================
-- ALLOWANCES
-- ============================================================
create policy "allowances: parent read" on public.allowances
  for select using (auth.uid() = parent_id);

create policy "allowances: parent write" on public.allowances
  for all using (auth.uid() = parent_id);

-- ============================================================
-- ACHIEVEMENTS (read-only catalog)
-- ============================================================
create policy "achievements: public read" on public.achievements
  for select using (true);

-- ============================================================
-- CHILD ACHIEVEMENTS
-- ============================================================
create policy "child_achievements: parent read" on public.child_achievements
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = child_achievements.child_id
      and cp.parent_id = auth.uid()
    )
  );

create policy "child_achievements: parent write" on public.child_achievements
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = child_achievements.child_id
      and cp.parent_id = auth.uid()
    )
  );

-- ============================================================
-- XP LOG
-- ============================================================
create policy "xp_log: parent read" on public.xp_log
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = xp_log.child_id
      and cp.parent_id = auth.uid()
    )
  );

create policy "xp_log: parent write" on public.xp_log
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = xp_log.child_id
      and cp.parent_id = auth.uid()
    )
  );

-- ============================================================
-- GAME SESSIONS
-- ============================================================
create policy "game_sessions: parent read" on public.game_sessions
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = game_sessions.child_id
      and cp.parent_id = auth.uid()
    )
  );

create policy "game_sessions: parent write" on public.game_sessions
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = game_sessions.child_id
      and cp.parent_id = auth.uid()
    )
  );

-- ============================================================
-- STOCK QUOTE CACHE — service role only (via API routes)
-- ============================================================
create policy "stock_cache: authenticated read" on public.stock_quote_cache
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- ACTIVITY LOG — parents read their family's activity
-- ============================================================
create policy "activity_log: parent read" on public.activity_log
  for select using (auth.uid() = parent_id);

create policy "activity_log: parent write" on public.activity_log
  for all using (auth.uid() = parent_id);

-- ============================================================
-- LEARN PROGRESS
-- ============================================================
create policy "learn_progress: parent read" on public.learn_progress
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = learn_progress.child_id
      and cp.parent_id = auth.uid()
    )
  );

create policy "learn_progress: parent write" on public.learn_progress
  for all using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = learn_progress.child_id
      and cp.parent_id = auth.uid()
    )
  );
