-- Adult-owned practice only. No child PII, billing, or real-money accounts.
create table if not exists public.sprout_adult_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Learner' check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.sprout_adult_practice_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null check (module_id ~ '^(F[0-9]{2}|T[0-9]{2}|A-F[0-9]{2})$' and char_length(module_id) <= 8),
  band text not null check (band in ('explore','build','thrive')),
  completed_lesson_ids text[] not null default '{}',
  quiz_best_score smallint not null default 0 check (quiz_best_score between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id,module_id,band)
);
alter table public.sprout_adult_profiles enable row level security;
alter table public.sprout_adult_practice_progress enable row level security;
revoke all on public.sprout_adult_profiles from public,anon;
revoke all on public.sprout_adult_practice_progress from public,anon;
grant select,insert,update,delete on public.sprout_adult_profiles to authenticated;
grant select,insert,update,delete on public.sprout_adult_practice_progress to authenticated;
create policy "Adult reads own profile" on public.sprout_adult_profiles for select to authenticated using ((select auth.uid())=user_id);
create policy "Adult inserts own profile" on public.sprout_adult_profiles for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Adult updates own profile" on public.sprout_adult_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Adult deletes own profile" on public.sprout_adult_profiles for delete to authenticated using ((select auth.uid())=user_id);
create policy "Adult reads own practice" on public.sprout_adult_practice_progress for select to authenticated using ((select auth.uid())=user_id);
create policy "Adult inserts own practice" on public.sprout_adult_practice_progress for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Adult updates own practice" on public.sprout_adult_practice_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Adult deletes own practice" on public.sprout_adult_practice_progress for delete to authenticated using ((select auth.uid())=user_id);
