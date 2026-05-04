create table if not exists public.goodbot_context (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  source_type text not null check (source_type in ('website', 'user_input')),
  status text not null default 'pending_confirmation' check (status in ('pending_confirmation', 'confirmed')),
  extracted_json jsonb not null default '{}'::jsonb,
  raw_text text,
  questions jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists goodbot_context_goal_created_idx
  on public.goodbot_context(goal_id, created_at desc);

alter table public.goodbot_context enable row level security;

drop policy if exists "goodbot users read own context" on public.goodbot_context;
create policy "goodbot users read own context"
  on public.goodbot_context for select
  to authenticated
  using (
    exists (
      select 1 from public.goals
      where goals.id = goodbot_context.goal_id
        and goals.user_id = auth.uid()
    )
  );
