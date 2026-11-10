-- Gridbook: one row per sheet, private to the signed-in owner.
create table if not exists public.gridbook_sheets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null default 'Sheet1' check (char_length(name) between 1 and 100),
  sort_order integer not null default 1,
  row_count integer not null default 200 check (row_count between 1 and 5000),
  col_widths jsonb not null default '{}'::jsonb,
  cells jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gridbook_cells_size check (pg_column_size(cells) < 5000000)
);

create index if not exists gridbook_sheets_user_idx on public.gridbook_sheets (user_id, sort_order);

alter table public.gridbook_sheets enable row level security;

create policy "gridbook owner select" on public.gridbook_sheets
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "gridbook owner insert" on public.gridbook_sheets
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "gridbook owner update" on public.gridbook_sheets
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "gridbook owner delete" on public.gridbook_sheets
  for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.gridbook_touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists gridbook_sheets_touch on public.gridbook_sheets;
create trigger gridbook_sheets_touch before update on public.gridbook_sheets
  for each row execute function public.gridbook_touch_updated_at();

revoke all on public.gridbook_sheets from anon;
grant select, insert, update, delete on public.gridbook_sheets to authenticated;
