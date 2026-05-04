create policy "goodbot public insert goals"
  on public.goals for insert
  to anon
  with check (domain = 'user_acquisition_web_app');

create policy "goodbot public read goals"
  on public.goals for select
  to anon
  using (domain = 'user_acquisition_web_app');

create policy "goodbot public update goals"
  on public.goals for update
  to anon
  using (domain = 'user_acquisition_web_app')
  with check (domain = 'user_acquisition_web_app');

create policy "goodbot public insert plans"
  on public.plans for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = plans.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read plans"
  on public.plans for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = plans.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public insert steps"
  on public.steps for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = steps.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read steps"
  on public.steps for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = steps.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public update steps"
  on public.steps for update
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = steps.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  )
  with check (
    exists (
      select 1 from public.goals
      where goals.id = steps.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public insert executions"
  on public.executions for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = executions.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read executions"
  on public.executions for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = executions.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public update executions"
  on public.executions for update
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = executions.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  )
  with check (
    exists (
      select 1 from public.goals
      where goals.id = executions.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public insert metrics"
  on public.metrics for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = metrics.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read metrics"
  on public.metrics for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = metrics.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public insert leads"
  on public.leads for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = leads.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public update leads"
  on public.leads for update
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = leads.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  )
  with check (
    exists (
      select 1 from public.goals
      where goals.id = leads.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public insert landing_pages"
  on public.landing_pages for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = landing_pages.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read landing_pages"
  on public.landing_pages for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = landing_pages.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public update landing_pages"
  on public.landing_pages for update
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = landing_pages.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  )
  with check (
    exists (
      select 1 from public.goals
      where goals.id = landing_pages.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public insert content_assets"
  on public.content_assets for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = content_assets.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read content_assets"
  on public.content_assets for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = content_assets.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public update content_assets"
  on public.content_assets for update
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = content_assets.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  )
  with check (
    exists (
      select 1 from public.goals
      where goals.id = content_assets.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public insert notifications"
  on public.notifications for insert
  to anon
  with check (
    exists (
      select 1 from public.goals
      where goals.id = notifications.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );

create policy "goodbot public read notifications"
  on public.notifications for select
  to anon
  using (
    exists (
      select 1 from public.goals
      where goals.id = notifications.goal_id
        and goals.domain = 'user_acquisition_web_app'
    )
  );
