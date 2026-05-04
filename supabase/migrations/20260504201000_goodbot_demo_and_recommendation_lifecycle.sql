alter table public.goodbot_recommendations
  drop constraint if exists goodbot_recommendations_status_check;

alter table public.goodbot_recommendations
  add constraint goodbot_recommendations_status_check
  check (status in ('pending', 'approved', 'running', 'executed', 'failed', 'rejected'));

alter table public.goodbot_jobs
  add column if not exists recommendation_id uuid references public.goodbot_recommendations(id) on delete set null;

create index if not exists goodbot_jobs_recommendation_idx
  on public.goodbot_jobs(recommendation_id)
  where recommendation_id is not null;

alter table public.goals
  add column if not exists is_demo boolean not null default false;

alter table public.metrics
  add column if not exists is_demo boolean not null default false;

alter table public.leads
  add column if not exists is_demo boolean not null default false;

create index if not exists metrics_goal_demo_idx
  on public.metrics(goal_id, is_demo, metric_type, created_at);

create index if not exists leads_goal_demo_idx
  on public.leads(goal_id, is_demo, created_at);
