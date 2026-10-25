-- Sprout adult-managed child learning profiles. No DOB, legal names, contact data or payments.
-- Names are optional nicknames. A child profile cannot authenticate independently.
create table if not exists public.sprout_child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(trim(nickname)) between 1 and 32),
  age_band text not null check (age_band in ('explore','build','thrive')),
  avatar_key text not null default 'leaf' check (avatar_key in ('leaf','star','sun','moon','rocket','flower')),
  consent_status text not null default 'pending' check (consent_status in ('pending','verified','withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sprout_child_profiles_parent_id_idx on public.sprout_child_profiles(parent_id);
alter table public.sprout_child_profiles enable row level security;
revoke all on public.sprout_child_profiles from public,anon;
grant select,insert,update,delete on public.sprout_child_profiles to authenticated;
create policy "Parents read own child profiles" on public.sprout_child_profiles
  for select to authenticated using ((select auth.uid()) = parent_id);
create policy "Parents create own child profiles" on public.sprout_child_profiles
  for insert to authenticated with check ((select auth.uid()) = parent_id AND consent_status='pending');
create policy "Parents update own child profiles" on public.sprout_child_profiles
  for update to authenticated using ((select auth.uid()) = parent_id)
  with check ((select auth.uid()) = parent_id AND consent_status in ('pending','withdrawn'));
create policy "Parents delete own child profiles" on public.sprout_child_profiles
  for delete to authenticated using ((select auth.uid()) = parent_id);
-- Securely store progress associated with a child profile; only owning parent can access.
create table if not exists public.sprout_child_practice_progress (
  child_id uuid not null references public.sprout_child_profiles(id) on delete cascade,
  module_id text not null check (char_length(module_id) between 1 and 80),
  completed_lesson_ids text[] not null default '{}',
  quiz_best_score smallint not null default 0 check (quiz_best_score between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (child_id,module_id)
);
alter table public.sprout_child_practice_progress enable row level security;
revoke all on public.sprout_child_practice_progress from public,anon;
grant select,insert,update,delete on public.sprout_child_practice_progress to authenticated;
create policy "Parent reads child practice" on public.sprout_child_practice_progress
 for select to authenticated using (exists (select 1 from public.sprout_child_profiles c where c.id=child_id and c.parent_id=(select auth.uid()) and c.consent_status='verified'));
create policy "Parent creates child practice" on public.sprout_child_practice_progress
 for insert to authenticated with check (exists (select 1 from public.sprout_child_profiles c where c.id=child_id and c.parent_id=(select auth.uid()) and c.consent_status='verified'));
create policy "Parent updates child practice" on public.sprout_child_practice_progress
 for update to authenticated using (exists (select 1 from public.sprout_child_profiles c where c.id=child_id and c.parent_id=(select auth.uid()) and c.consent_status='verified'))
 with check (exists (select 1 from public.sprout_child_profiles c where c.id=child_id and c.parent_id=(select auth.uid()) and c.consent_status='verified'));
create policy "Parent deletes child practice" on public.sprout_child_practice_progress
 for delete to authenticated using (exists (select 1 from public.sprout_child_profiles c where c.id=child_id and c.parent_id=(select auth.uid())));
