-- Rate limiting for Gridbook sign-in emails. Written only by the server with the service role.
create table if not exists public.gridbook_link_requests (
  id bigint generated always as identity primary key,
  email_hash text not null,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists gridbook_link_requests_email_idx on public.gridbook_link_requests (email_hash, created_at desc);
create index if not exists gridbook_link_requests_ip_idx on public.gridbook_link_requests (ip_hash, created_at desc);
alter table public.gridbook_link_requests enable row level security;
revoke all on public.gridbook_link_requests from anon, authenticated;
