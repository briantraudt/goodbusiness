alter type goodbot_content_type add value if not exists 'email_draft';

alter table public.content_assets
  add column if not exists approval_status text not null default 'pending'
    check (approval_status in ('pending', 'approved', 'rejected')),
  add column if not exists approved_at timestamptz,
  add column if not exists rejected_at timestamptz,
  add column if not exists edited_body text,
  add column if not exists distribution_status text not null default 'not_ready'
    check (distribution_status in ('not_ready', 'ready', 'distributed', 'failed')),
  add column if not exists distributed_at timestamptz,
  add column if not exists distribution_channel text,
  add column if not exists recommended_action text;

alter table public.landing_pages
  add column if not exists approval_status text not null default 'approved'
    check (approval_status in ('pending', 'approved', 'rejected')),
  add column if not exists approved_at timestamptz default now(),
  add column if not exists rejected_at timestamptz,
  add column if not exists distribution_status text not null default 'ready'
    check (distribution_status in ('not_ready', 'ready', 'distributed', 'failed')),
  add column if not exists distributed_at timestamptz,
  add column if not exists distribution_channel text default 'landing_page',
  add column if not exists recommended_action text default 'Copy this link anywhere you are asking for early users.';

create table if not exists public.goodbot_jobs (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  step_id uuid references public.steps(id) on delete set null,
  job_type text not null,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'completed', 'failed')),
  attempts integer not null default 0,
  max_attempts integer not null default 3,
  run_after timestamptz not null default now(),
  locked_at timestamptz,
  error text,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists goodbot_jobs_status_run_after_idx
  on public.goodbot_jobs(status, run_after, created_at);

create index if not exists goodbot_jobs_goal_idx
  on public.goodbot_jobs(goal_id, status);

alter table public.goodbot_jobs enable row level security;

create policy "goodbot public insert jobs"
  on public.goodbot_jobs for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = goodbot_jobs.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read jobs"
  on public.goodbot_jobs for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = goodbot_jobs.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public update jobs"
  on public.goodbot_jobs for update
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = goodbot_jobs.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  )
  with check (
    exists (
      select 1 from public.goals
      where goals.id = goodbot_jobs.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );
