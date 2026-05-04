create table if not exists public.landing_page_variants (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  landing_page_id uuid not null references public.landing_pages(id) on delete cascade,
  variant_name text not null,
  headline text not null,
  subheadline text not null,
  cta text not null,
  bullets jsonb not null default '[]'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'archived')),
  reason text,
  created_at timestamptz not null default now()
);

create unique index if not exists landing_page_variants_one_active_idx
  on public.landing_page_variants(landing_page_id)
  where status = 'active';

create index if not exists landing_page_variants_goal_status_idx
  on public.landing_page_variants(goal_id, status, created_at);

insert into public.landing_page_variants (
  goal_id,
  landing_page_id,
  variant_name,
  headline,
  subheadline,
  cta,
  bullets,
  status,
  reason,
  created_at
)
select
  lp.goal_id,
  lp.id,
  'v1',
  lp.headline,
  lp.subheadline,
  lp.cta,
  lp.bullets,
  'active',
  'Backfilled from the original generated landing page.',
  lp.created_at
from public.landing_pages lp
where not exists (
  select 1
  from public.landing_page_variants lpv
  where lpv.landing_page_id = lp.id
);

create table if not exists public.distribution_events (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  content_asset_id uuid references public.content_assets(id) on delete set null,
  landing_page_id uuid references public.landing_pages(id) on delete set null,
  channel text not null,
  status text not null default 'claimed'
    check (status in ('claimed', 'verified', 'failed')),
  claimed_url text,
  tracking_url text not null,
  utm_source text not null,
  utm_medium text not null,
  utm_campaign text not null,
  utm_content text not null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists distribution_events_goal_status_idx
  on public.distribution_events(goal_id, status, created_at);

create index if not exists distribution_events_asset_idx
  on public.distribution_events(content_asset_id);

alter table public.metrics
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists distribution_event_id uuid references public.distribution_events(id) on delete set null,
  add column if not exists content_asset_id uuid references public.content_assets(id) on delete set null,
  add column if not exists landing_page_variant_id uuid references public.landing_page_variants(id) on delete set null;

alter table public.leads
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists distribution_event_id uuid references public.distribution_events(id) on delete set null,
  add column if not exists content_asset_id uuid references public.content_assets(id) on delete set null,
  add column if not exists landing_page_variant_id uuid references public.landing_page_variants(id) on delete set null;

create index if not exists metrics_distribution_event_idx
  on public.metrics(distribution_event_id, metric_type, created_at);

create index if not exists metrics_asset_idx
  on public.metrics(content_asset_id, metric_type, created_at);

create index if not exists metrics_variant_idx
  on public.metrics(landing_page_variant_id, metric_type, created_at);

alter table public.landing_page_variants enable row level security;
alter table public.distribution_events enable row level security;

create policy "goodbot public insert landing_page_variants"
  on public.landing_page_variants for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = landing_page_variants.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read landing_page_variants"
  on public.landing_page_variants for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = landing_page_variants.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public update landing_page_variants"
  on public.landing_page_variants for update
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = landing_page_variants.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  )
  with check (
    exists (
      select 1 from public.goals
      where goals.id = landing_page_variants.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public insert distribution_events"
  on public.distribution_events for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = distribution_events.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read distribution_events"
  on public.distribution_events for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = distribution_events.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public update distribution_events"
  on public.distribution_events for update
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = distribution_events.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  )
  with check (
    exists (
      select 1 from public.goals
      where goals.id = distribution_events.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );
