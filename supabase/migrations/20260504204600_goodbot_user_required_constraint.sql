alter table public.goals
  drop constraint if exists goals_user_id_required_for_new_rows;

alter table public.goals
  add constraint goals_user_id_required_for_new_rows
  check (user_id is not null or created_at < timestamptz '2026-05-04 20:46:00+00')
  not valid;
