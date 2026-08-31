create or replace function public.set_home_service_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create index if not exists home_service_requests_assigned_provider_id_idx
on public.home_service_requests (assigned_provider_id);
