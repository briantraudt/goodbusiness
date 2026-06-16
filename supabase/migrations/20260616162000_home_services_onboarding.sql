create table if not exists public.home_service_user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  preferred_contact_method text not null,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  zip text not null,
  home_type text not null,
  ownership_status text not null,
  year_built_range text,
  square_footage_range text,
  stories text,
  gate_code text,
  parking_notes text,
  pets_type text not null,
  pet_notes text,
  provider_entry_preference text not null,
  access_notes text,
  water_heater_type text,
  water_heater_location text,
  water_shutoff_location text,
  electrical_panel_location text,
  hvac_units_count text,
  hvac_age_range text,
  has_irrigation text,
  has_pool text,
  has_ev_charger text,
  has_solar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_home_services_onboarding_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_home_service_user_profiles_updated_at on public.home_service_user_profiles;
create trigger set_home_service_user_profiles_updated_at
before update on public.home_service_user_profiles
for each row execute function public.set_home_services_onboarding_updated_at();

drop trigger if exists set_home_profiles_updated_at on public.home_profiles;
create trigger set_home_profiles_updated_at
before update on public.home_profiles
for each row execute function public.set_home_services_onboarding_updated_at();

alter table public.home_service_user_profiles enable row level security;
alter table public.home_profiles enable row level security;

drop policy if exists "Users manage own concierge profile" on public.home_service_user_profiles;
create policy "Users manage own concierge profile"
on public.home_service_user_profiles
for all
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Users manage own home profiles" on public.home_profiles;
create policy "Users manage own home profiles"
on public.home_profiles
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create index if not exists home_profiles_user_id_idx
on public.home_profiles (user_id);

grant select, insert, update, delete on public.home_service_user_profiles to authenticated;
grant select, insert, update, delete on public.home_profiles to authenticated;
