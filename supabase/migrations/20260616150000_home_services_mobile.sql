create table if not exists public.home_service_categories (
  slug text primary key,
  name text not null,
  summary text not null,
  icon_name text not null,
  accent_hex text not null,
  sort_order integer not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.home_service_categories
  (slug, name, summary, icon_name, accent_hex, sort_order)
values
  ('plumbing', 'Plumbing', 'Leaks, fixtures, drains, and water heaters', 'wrench.and.screwdriver.fill', '#2563EB', 1),
  ('electrical', 'Electrical', 'Outlets, panels, lighting, and safety fixes', 'bolt.fill', '#F59E0B', 2),
  ('landscaping', 'Landscaping', 'Lawn care, planting, cleanup, and outdoor work', 'leaf.fill', '#16A34A', 3),
  ('painting', 'Painting', 'Interior rooms, exterior refreshes, and touch-ups', 'paintbrush.fill', '#7C3AED', 4),
  ('cleaning', 'Cleaning', 'Standard, deep, move-in, and move-out cleaning', 'sparkles', '#0891B2', 5),
  ('hvac', 'HVAC', 'Heating, cooling, filters, repairs, and tune-ups', 'fan.fill', '#DC2626', 6)
on conflict (slug) do update
set
  name = excluded.name,
  summary = excluded.summary,
  icon_name = excluded.icon_name,
  accent_hex = excluded.accent_hex,
  sort_order = excluded.sort_order,
  is_active = true;

create table if not exists public.home_service_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_service_providers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  phone text,
  email text,
  service_area text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_service_provider_categories (
  provider_id uuid not null references public.home_service_providers(id) on delete cascade,
  service_slug text not null references public.home_service_categories(slug),
  created_at timestamptz not null default now(),
  primary key (provider_id, service_slug)
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'home_service_request_status') then
    create type public.home_service_request_status as enum (
      'draft',
      'submitted',
      'matched',
      'scheduled',
      'completed',
      'cancelled'
    );
  end if;
end $$;

create table if not exists public.home_service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  service_slug text not null references public.home_service_categories(slug),
  status public.home_service_request_status not null default 'submitted',
  title text,
  description text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  preferred_date date,
  preferred_time_window text,
  assigned_provider_id uuid references public.home_service_providers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_home_service_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_home_service_profiles_updated_at on public.home_service_profiles;
create trigger set_home_service_profiles_updated_at
before update on public.home_service_profiles
for each row execute function public.set_home_service_updated_at();

drop trigger if exists set_home_service_providers_updated_at on public.home_service_providers;
create trigger set_home_service_providers_updated_at
before update on public.home_service_providers
for each row execute function public.set_home_service_updated_at();

drop trigger if exists set_home_service_requests_updated_at on public.home_service_requests;
create trigger set_home_service_requests_updated_at
before update on public.home_service_requests
for each row execute function public.set_home_service_updated_at();

alter table public.home_service_categories enable row level security;
alter table public.home_service_profiles enable row level security;
alter table public.home_service_providers enable row level security;
alter table public.home_service_provider_categories enable row level security;
alter table public.home_service_requests enable row level security;

drop policy if exists "Anyone can read active home service categories" on public.home_service_categories;
create policy "Anyone can read active home service categories"
on public.home_service_categories
for select
to anon, authenticated
using (is_active);

drop policy if exists "Users manage own home service profile" on public.home_service_profiles;
create policy "Users manage own home service profile"
on public.home_service_profiles
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Anyone can read active home service providers" on public.home_service_providers;
create policy "Anyone can read active home service providers"
on public.home_service_providers
for select
to anon, authenticated
using (is_active);

drop policy if exists "Provider owners manage own provider profiles" on public.home_service_providers;
create policy "Provider owners manage own provider profiles"
on public.home_service_providers
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Anyone can read active provider categories" on public.home_service_provider_categories;
create policy "Anyone can read active provider categories"
on public.home_service_provider_categories
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.home_service_providers providers
    where providers.id = provider_id
      and providers.is_active
  )
);

drop policy if exists "Provider owners manage own provider categories" on public.home_service_provider_categories;
create policy "Provider owners manage own provider categories"
on public.home_service_provider_categories
for all
to authenticated
using (
  exists (
    select 1
    from public.home_service_providers providers
    where providers.id = provider_id
      and providers.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.home_service_providers providers
    where providers.id = provider_id
      and providers.owner_id = auth.uid()
  )
);

drop policy if exists "Customers manage own home service requests" on public.home_service_requests;
create policy "Customers manage own home service requests"
on public.home_service_requests
for all
to authenticated
using (customer_id = auth.uid())
with check (customer_id = auth.uid());

create index if not exists home_service_categories_sort_order_idx
on public.home_service_categories (sort_order);

create index if not exists home_service_providers_owner_id_idx
on public.home_service_providers (owner_id);

create index if not exists home_service_provider_categories_service_slug_idx
on public.home_service_provider_categories (service_slug);

create index if not exists home_service_requests_customer_id_idx
on public.home_service_requests (customer_id);

create index if not exists home_service_requests_service_status_idx
on public.home_service_requests (service_slug, status);

grant select on public.home_service_categories to anon, authenticated;
grant select on public.home_service_providers to anon, authenticated;
grant select on public.home_service_provider_categories to anon, authenticated;
grant select, insert, update, delete on public.home_service_profiles to authenticated;
grant select, insert, update, delete on public.home_service_requests to authenticated;
grant select, insert, update, delete on public.home_service_providers to authenticated;
grant select, insert, update, delete on public.home_service_provider_categories to authenticated;
