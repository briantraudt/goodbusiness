alter table public.gb_invoices add column if not exists deleted_at timestamptz;
