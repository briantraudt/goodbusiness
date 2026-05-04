alter table public.goals
  add column if not exists access_token_hash text;

create index if not exists goals_access_token_hash_idx
  on public.goals(access_token_hash)
  where access_token_hash is not null;

create table if not exists public.goodbot_rate_limits (
  id uuid primary key default gen_random_uuid(),
  key_hash text not null,
  route text not null,
  window_start timestamptz not null,
  count integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (key_hash, window_start)
);

create index if not exists goodbot_rate_limits_route_window_idx
  on public.goodbot_rate_limits(route, window_start);

alter table public.goodbot_rate_limits enable row level security;

create index if not exists distribution_events_landing_page_idx
  on public.distribution_events(landing_page_id)
  where landing_page_id is not null;

create index if not exists executions_goal_idx
  on public.executions(goal_id);

create index if not exists executions_step_idx
  on public.executions(step_id)
  where step_id is not null;

create index if not exists goodbot_jobs_step_idx
  on public.goodbot_jobs(step_id)
  where step_id is not null;

create index if not exists plans_goal_idx
  on public.plans(goal_id, created_at desc);

create index if not exists leads_goal_created_idx
  on public.leads(goal_id, created_at desc);

create index if not exists landing_pages_goal_created_idx
  on public.landing_pages(goal_id, created_at desc);

create index if not exists notifications_goal_created_idx
  on public.notifications(goal_id, created_at desc);
