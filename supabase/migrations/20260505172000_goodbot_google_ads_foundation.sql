alter table public.goals
  add column if not exists ads_enabled boolean not null default false,
  add column if not exists max_daily_ad_spend numeric not null default 0,
  add column if not exists max_total_ad_spend numeric not null default 0,
  add column if not exists approved_channels jsonb not null default '[]'::jsonb,
  add column if not exists ads_autonomy_level text not null default 'off';

alter table public.goals
  drop constraint if exists goals_ads_autonomy_level_check;

alter table public.goals
  add constraint goals_ads_autonomy_level_check
  check (ads_autonomy_level in ('off', 'assisted', 'controlled'));

create table if not exists public.google_ads_campaign_drafts (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  status text not null default 'pending_approval',
  draft_json jsonb not null,
  estimated_daily_budget numeric,
  estimated_total_budget numeric,
  estimated_keywords jsonb,
  landing_page_url text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  launched_at timestamptz,
  constraint google_ads_campaign_drafts_status_check
    check (status in ('pending_approval', 'approved', 'rejected', 'queued', 'dry_run_launched', 'launched', 'failed'))
);

create table if not exists public.google_ads_campaigns (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  draft_id uuid references public.google_ads_campaign_drafts(id) on delete set null,
  google_customer_id text not null,
  google_campaign_id text,
  status text not null default 'created',
  daily_budget numeric,
  total_spend numeric not null default 0,
  created_at timestamptz not null default now(),
  launched_at timestamptz,
  paused_at timestamptz,
  error text,
  constraint google_ads_campaigns_status_check
    check (status in ('created', 'dry_run', 'queued', 'active', 'paused', 'failed'))
);

create table if not exists public.google_ads_metrics (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  campaign_id uuid references public.google_ads_campaigns(id) on delete cascade,
  google_campaign_id text,
  ad_group_id text,
  keyword text,
  clicks integer not null default 0,
  impressions integer not null default 0,
  spend numeric not null default 0,
  conversions integer not null default 0,
  cpc numeric,
  cpa numeric,
  captured_at timestamptz not null default now()
);

create index if not exists google_ads_campaign_drafts_goal_status_idx
  on public.google_ads_campaign_drafts(goal_id, status, created_at desc);

create index if not exists google_ads_campaigns_goal_status_idx
  on public.google_ads_campaigns(goal_id, status, created_at desc);

create index if not exists google_ads_campaigns_draft_id_idx
  on public.google_ads_campaigns(draft_id);

create index if not exists google_ads_metrics_goal_captured_idx
  on public.google_ads_metrics(goal_id, captured_at desc);

create index if not exists google_ads_metrics_campaign_id_idx
  on public.google_ads_metrics(campaign_id, captured_at desc);

create index if not exists google_ads_metrics_google_campaign_id_idx
  on public.google_ads_metrics(google_campaign_id, captured_at desc)
  where google_campaign_id is not null;

alter table public.google_ads_campaign_drafts enable row level security;
alter table public.google_ads_campaigns enable row level security;
alter table public.google_ads_metrics enable row level security;

drop policy if exists "goodbot google ads drafts owner read" on public.google_ads_campaign_drafts;
create policy "goodbot google ads drafts owner read"
  on public.google_ads_campaign_drafts
  for select
  to authenticated
  using (exists (
    select 1 from public.goals
    where goals.id = google_ads_campaign_drafts.goal_id
      and goals.user_id = auth.uid()
  ));

drop policy if exists "goodbot google ads campaigns owner read" on public.google_ads_campaigns;
create policy "goodbot google ads campaigns owner read"
  on public.google_ads_campaigns
  for select
  to authenticated
  using (exists (
    select 1 from public.goals
    where goals.id = google_ads_campaigns.goal_id
      and goals.user_id = auth.uid()
  ));

drop policy if exists "goodbot google ads metrics owner read" on public.google_ads_metrics;
create policy "goodbot google ads metrics owner read"
  on public.google_ads_metrics
  for select
  to authenticated
  using (exists (
    select 1 from public.goals
    where goals.id = google_ads_metrics.goal_id
      and goals.user_id = auth.uid()
  ));
