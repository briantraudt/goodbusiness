create policy "goodbot public read leads"
  on public.leads for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = leads.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );
