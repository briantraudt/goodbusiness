-- Keeps every close-to-open recommendation and its realized next-open result auditable.
create table if not exists public.social_arb_signals (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.social_arb_reports(id) on delete cascade,
  session_date date not null,
  ticker text not null,
  rank integer not null,
  score integer not null check (score between 0 and 100),
  confidence_band text not null,
  entry_reference numeric,
  next_open_price numeric,
  overnight_return_pct numeric,
  outcome text check (outcome in ('win', 'loss', 'flat', 'pending')) default 'pending',
  thesis jsonb not null default '{}'::jsonb,
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (session_date, ticker)
);

alter table public.social_arb_signals enable row level security;
revoke all on table public.social_arb_signals from anon, authenticated;
grant select, insert, update, delete on table public.social_arb_signals to service_role;
drop policy if exists "service_role manages social arb signals" on public.social_arb_signals;
create policy "service_role manages social arb signals" on public.social_arb_signals
for all to service_role using (true) with check (true);
create index if not exists social_arb_signals_pending_idx on public.social_arb_signals (outcome, session_date);
