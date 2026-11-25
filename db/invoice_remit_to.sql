create table if not exists public.gb_invoice_settings (owner_id uuid primary key references auth.users(id), remit_to text not null default '' check (char_length(remit_to)<=3000));
alter table public.gb_invoice_settings enable row level security;
revoke all on public.gb_invoice_settings from public, anon, authenticated;
grant select, insert, update on public.gb_invoice_settings to service_role;
alter table public.gb_invoices add column if not exists remit_to text;
