alter table public.goals
  add column if not exists autonomous_mode boolean not null default false,
  add column if not exists auto_post_mode text not null default 'manual',
  add column if not exists daily_post_limit integer not null default 1,
  add column if not exists channels_enabled jsonb not null default '["linkedin"]'::jsonb,
  add column if not exists auto_response_level text not null default 'approval_required',
  add column if not exists paused_at timestamptz;

alter table public.content_assets
  add column if not exists external_post_id text,
  add column if not exists external_url text,
  add column if not exists posted_at timestamptz,
  add column if not exists auto_post_status text not null default 'manual';

create table if not exists public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_user_id text,
  provider_account_name text,
  access_token_ciphertext text not null,
  refresh_token_ciphertext text,
  token_expires_at timestamptz,
  scopes text[] not null default '{}',
  status text not null default 'connected',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, provider, provider_user_id)
);

create table if not exists public.engagement_events (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  content_asset_id uuid references public.content_assets(id) on delete cascade,
  external_post_id text,
  external_comment_id text,
  commenter text,
  comment_text text not null,
  sentiment text,
  category text,
  requires_response boolean not null default true,
  response_status text not null default 'pending_approval',
  suggested_response text,
  raw_event jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(content_asset_id, external_comment_id)
);

create index if not exists connected_accounts_user_provider_idx
  on public.connected_accounts(user_id, provider);

create index if not exists content_assets_external_post_idx
  on public.content_assets(external_post_id)
  where external_post_id is not null;

create index if not exists engagement_events_goal_idx
  on public.engagement_events(goal_id, created_at desc);

create index if not exists engagement_events_asset_idx
  on public.engagement_events(content_asset_id, created_at desc);

alter table public.connected_accounts enable row level security;
alter table public.engagement_events enable row level security;

drop policy if exists "goodbot connected accounts owner read" on public.connected_accounts;
create policy "goodbot connected accounts owner read"
  on public.connected_accounts
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "goodbot engagement owner read" on public.engagement_events;
create policy "goodbot engagement owner read"
  on public.engagement_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.goals
      where goals.id = engagement_events.goal_id
        and goals.user_id = auth.uid()
    )
  );
