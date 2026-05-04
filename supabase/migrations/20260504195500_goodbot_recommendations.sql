create table if not exists public.goodbot_recommendations (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  recommendation_type text not null,
  title text not null,
  rationale text not null,
  confidence text not null default 'medium'
    check (confidence in ('low', 'medium', 'high')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'executed')),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  executed_at timestamptz
);

create index if not exists goodbot_recommendations_goal_status_idx
  on public.goodbot_recommendations(goal_id, status, created_at desc);

create index if not exists goodbot_recommendations_goal_type_pending_idx
  on public.goodbot_recommendations(goal_id, recommendation_type)
  where status = 'pending';

alter table public.goodbot_recommendations enable row level security;

create policy "goodbot public insert recommendations"
  on public.goodbot_recommendations for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = goodbot_recommendations.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read recommendations"
  on public.goodbot_recommendations for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = goodbot_recommendations.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public update recommendations"
  on public.goodbot_recommendations for update
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = goodbot_recommendations.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  )
  with check (
    exists (
      select 1 from public.goals
      where goals.id = goodbot_recommendations.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );
