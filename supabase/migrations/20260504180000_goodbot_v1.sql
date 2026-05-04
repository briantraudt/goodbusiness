create extension if not exists pgcrypto;

create type goodbot_goal_status as enum ('working', 'paused', 'completed', 'failed');
create type goodbot_step_status as enum ('pending', 'running', 'completed', 'failed', 'skipped');
create type goodbot_execution_status as enum ('started', 'completed', 'failed');
create type goodbot_step_type as enum ('create_landing_page', 'generate_content', 'publish_content', 'track_metrics');
create type goodbot_metric_type as enum ('visit', 'signup');
create type goodbot_notification_type as enum ('milestone', 'strategy_changed', 'goal_completed');
create type goodbot_content_type as enum ('linkedin_post', 'blog_post');
create type goodbot_content_status as enum ('draft', 'published', 'ready_to_publish');

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  goal text not null,
  domain text not null default 'user_acquisition_web_app',
  target_metric text not null default 'users',
  target_value integer not null check (target_value > 0),
  timeframe text,
  status goodbot_goal_status not null default 'working',
  app_name text,
  audience text,
  positioning text,
  last_evaluated_at timestamptz
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  created_at timestamptz not null default now(),
  version integer not null default 1,
  status text not null default 'active',
  rationale text,
  plan_json jsonb not null default '[]'::jsonb
);

create table public.steps (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  position integer not null,
  step_type goodbot_step_type not null,
  title text not null,
  status goodbot_step_status not null default 'pending',
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  error text
);

create table public.executions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  step_id uuid references public.steps(id) on delete set null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status goodbot_execution_status not null default 'started',
  function_name text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  error text
);

create table public.metrics (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  created_at timestamptz not null default now(),
  metric_type goodbot_metric_type not null,
  value integer not null default 1,
  source text,
  metadata jsonb not null default '{}'::jsonb
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  source text not null default 'goodbot_landing_page',
  metadata jsonb not null default '{}'::jsonb,
  unique (goal_id, email)
);

create table public.landing_pages (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  created_at timestamptz not null default now(),
  slug text not null unique,
  headline text not null,
  subheadline text not null,
  cta text not null,
  bullets jsonb not null default '[]'::jsonb,
  status text not null default 'published',
  version integer not null default 1
);

create table public.content_assets (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  created_at timestamptz not null default now(),
  content_type goodbot_content_type not null,
  status goodbot_content_status not null default 'draft',
  title text,
  body text not null,
  channel text not null,
  published_url text,
  metadata jsonb not null default '{}'::jsonb
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  created_at timestamptz not null default now(),
  notification_type goodbot_notification_type not null,
  message text not null,
  delivered_at timestamptz
);

create index goals_status_idx on public.goals(status);
create index steps_goal_position_idx on public.steps(goal_id, position);
create index metrics_goal_type_created_idx on public.metrics(goal_id, metric_type, created_at);
create index content_assets_goal_idx on public.content_assets(goal_id, content_type, status);

alter table public.goals enable row level security;
alter table public.plans enable row level security;
alter table public.steps enable row level security;
alter table public.executions enable row level security;
alter table public.metrics enable row level security;
alter table public.leads enable row level security;
alter table public.landing_pages enable row level security;
alter table public.content_assets enable row level security;
alter table public.notifications enable row level security;

-- V1 uses server-side service role access from Next.js route handlers.
-- Add end-user auth policies before exposing goal ownership beyond anonymous intake pages.
