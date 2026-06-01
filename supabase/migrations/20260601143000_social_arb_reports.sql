create table if not exists public.social_arb_reports (
  id uuid primary key default gen_random_uuid(),
  generated_at timestamptz not null,
  started_at timestamptz,
  item_count integer not null default 0,
  topics jsonb not null default '[]'::jsonb,
  source_counts jsonb not null default '{}'::jsonb,
  raw_item_sample jsonb not null default '[]'::jsonb,
  email_to text not null default 'briantraudt@gmail.com',
  created_at timestamptz not null default now()
);

alter table public.social_arb_reports enable row level security;

drop policy if exists "service_role manages social arb reports" on public.social_arb_reports;
create policy "service_role manages social arb reports"
on public.social_arb_reports
for all
to service_role
using (true)
with check (true);

create index if not exists social_arb_reports_generated_at_idx
on public.social_arb_reports (generated_at desc);
