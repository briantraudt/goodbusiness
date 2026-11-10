-- Gridbook spreadsheets (workbooks). Each sheet belongs to one, both private to their owner.
create table if not exists public.gridbook_workbooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null default 'Untitled spreadsheet' check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists gridbook_workbooks_user_idx on public.gridbook_workbooks (user_id, updated_at desc);
alter table public.gridbook_workbooks enable row level security;
create policy "gridbook wb owner select" on public.gridbook_workbooks for select to authenticated using ((select auth.uid()) = user_id);
create policy "gridbook wb owner insert" on public.gridbook_workbooks for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "gridbook wb owner update" on public.gridbook_workbooks for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "gridbook wb owner delete" on public.gridbook_workbooks for delete to authenticated using ((select auth.uid()) = user_id);
revoke all on public.gridbook_workbooks from anon;
grant select, insert, update, delete on public.gridbook_workbooks to authenticated;

alter table public.gridbook_sheets add column if not exists workbook_id uuid references public.gridbook_workbooks(id) on delete cascade;

with owners as (select distinct user_id from public.gridbook_sheets where workbook_id is null),
made as (
  insert into public.gridbook_workbooks (user_id, name)
  select user_id, 'My spreadsheet' from owners
  returning id, user_id
)
update public.gridbook_sheets s set workbook_id = made.id from made where s.user_id = made.user_id and s.workbook_id is null;

alter table public.gridbook_sheets alter column workbook_id set not null;
create index if not exists gridbook_sheets_workbook_idx on public.gridbook_sheets (workbook_id, sort_order);

create or replace function public.gridbook_check_workbook_owner()
returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists (select 1 from public.gridbook_workbooks w where w.id = new.workbook_id and w.user_id = new.user_id) then
    raise exception 'workbook not found';
  end if;
  return new;
end;
$$;
drop trigger if exists gridbook_sheets_check_owner on public.gridbook_sheets;
create trigger gridbook_sheets_check_owner before insert or update of workbook_id, user_id on public.gridbook_sheets
  for each row execute function public.gridbook_check_workbook_owner();

create or replace function public.gridbook_touch_workbook()
returns trigger language plpgsql set search_path = '' as $$
begin
  update public.gridbook_workbooks set updated_at = now() where id = new.workbook_id;
  return new;
end;
$$;
drop trigger if exists gridbook_sheets_touch_workbook on public.gridbook_sheets;
create trigger gridbook_sheets_touch_workbook after insert or update on public.gridbook_sheets
  for each row execute function public.gridbook_touch_workbook();

drop trigger if exists gridbook_workbooks_touch on public.gridbook_workbooks;
create trigger gridbook_workbooks_touch before update on public.gridbook_workbooks
  for each row execute function public.gridbook_touch_updated_at();
