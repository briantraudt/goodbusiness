-- Devices that completed a Gridbook email sign-in (one-tap login next time). Server-only.
create table if not exists public.gridbook_devices (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now()
);
create index if not exists gridbook_devices_user_idx on public.gridbook_devices (user_id);
alter table public.gridbook_devices enable row level security;
revoke all on public.gridbook_devices from anon, authenticated;

-- Lets the tab that requested a sign-in link finish signing in once the link is opened anywhere. Server-only.
create table if not exists public.gridbook_pending_logins (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  poll_secret_hash text not null,
  approved_user_id uuid references auth.users(id) on delete cascade,
  approved_at timestamptz,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists gridbook_pending_created_idx on public.gridbook_pending_logins (created_at);
alter table public.gridbook_pending_logins enable row level security;
revoke all on public.gridbook_pending_logins from anon, authenticated;
