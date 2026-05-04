alter table public.goals
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists goals_user_created_idx
  on public.goals(user_id, created_at desc)
  where user_id is not null;

create index if not exists goals_user_status_created_idx
  on public.goals(user_id, status, created_at desc)
  where user_id is not null;

drop policy if exists "goodbot users read own goals" on public.goals;
create policy "goodbot users read own goals"
  on public.goals for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "goodbot users insert own goals" on public.goals;
create policy "goodbot users insert own goals"
  on public.goals for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "goodbot users update own goals" on public.goals;
create policy "goodbot users update own goals"
  on public.goals for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
