-- ============================================================
-- SPROUT — Database Functions
-- ============================================================

-- Increment XP for a child and log it
create or replace function public.increment_xp(p_child_id uuid, p_amount integer)
returns void language plpgsql security definer as $$
begin
  update public.child_profiles
  set xp = xp + p_amount
  where id = p_child_id;

  insert into public.xp_log (child_id, amount, reason)
  values (p_child_id, p_amount, 'action');
end;
$$;

-- Update daily streak (call on login)
create or replace function public.update_streak(p_child_id uuid)
returns void language plpgsql security definer as $$
declare
  v_last_date date;
  v_today     date := current_date;
  v_streak    integer;
  v_longest   integer;
begin
  select last_activity_date, streak_days, longest_streak
  into   v_last_date, v_streak, v_longest
  from   public.child_profiles
  where  id = p_child_id;

  if v_last_date = v_today then
    -- Already updated today
    return;
  elsif v_last_date = v_today - 1 then
    -- Consecutive day
    v_streak := coalesce(v_streak, 0) + 1;
  else
    -- Streak broken
    v_streak := 1;
  end if;

  v_longest := greatest(coalesce(v_longest, 0), v_streak);

  update public.child_profiles
  set streak_days        = v_streak,
      longest_streak     = v_longest,
      last_activity_date = v_today,
      xp                 = xp + 10   -- daily login XP
  where id = p_child_id;
end;
$$;

-- Award an achievement (idempotent)
create or replace function public.award_achievement(p_child_id uuid, p_achievement_id text)
returns void language plpgsql security definer as $$
declare
  v_xp integer;
begin
  -- Get XP reward
  select xp_reward into v_xp from public.achievements where id = p_achievement_id;
  if not found then return; end if;

  -- Insert (ignore duplicate)
  insert into public.child_achievements (child_id, achievement_id)
  values (p_child_id, p_achievement_id)
  on conflict (child_id, achievement_id) do nothing;

  -- Award XP if newly inserted
  if found then
    perform public.increment_xp(p_child_id, v_xp);
  end if;
end;
$$;

-- Process allowance payments (run via cron or manual trigger)
create or replace function public.process_allowances()
returns void language plpgsql security definer as $$
declare
  v_allowance public.allowances%rowtype;
  v_next_date date;
begin
  for v_allowance in
    select * from public.allowances
    where active = true and next_payment_date <= current_date
  loop
    if v_allowance.currency_type = 'seeds' then
      update public.child_profiles
      set virtual_balance = virtual_balance + v_allowance.amount
      where id = v_allowance.child_id;

      insert into public.virtual_transactions (child_id, symbol, company_name, type, total_amount, note)
      values (v_allowance.child_id, 'ALLOWANCE', 'Parent Allowance', 'task_reward', v_allowance.amount, 'Weekly allowance');
    else
      update public.child_profiles
      set real_balance = real_balance + v_allowance.amount
      where id = v_allowance.child_id;

      insert into public.real_transactions (child_id, type, total_amount, note)
      values (v_allowance.child_id, 'deposit', v_allowance.amount, 'Parent allowance');
    end if;

    -- Calculate next payment date
    v_next_date := case v_allowance.frequency
      when 'weekly'    then v_allowance.next_payment_date + interval '7 days'
      when 'biweekly'  then v_allowance.next_payment_date + interval '14 days'
      when 'monthly'   then v_allowance.next_payment_date + interval '1 month'
      else v_allowance.next_payment_date + interval '7 days'
    end;

    update public.allowances
    set next_payment_date = v_next_date::date
    where id = v_allowance.id;
  end loop;
end;
$$;
