alter table public.goals
  add column if not exists project_name text;

create index if not exists goals_user_project_created_idx
  on public.goals(user_id, project_name, created_at desc)
  where user_id is not null;

update public.goals
set project_name = coalesce(
  nullif(app_name, ''),
  case
    when goal ~* 'www\\.nda\\.company|nda\\.company' then 'NDA.company'
    when goal ~* 'goodbot' then 'GoodBot'
    else 'Untitled Project'
  end
)
where project_name is null;
