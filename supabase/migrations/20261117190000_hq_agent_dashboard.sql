-- Good Business HQ: one private page that shows every scheduled agent.
-- All of these tables are server-only: RLS is on with no policies, so only the
-- service role (the /api/hq route and the sync agent) can read or write them.

create table if not exists public.hq_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.hq_login_attempts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.hq_agents (
  trigger_id text primary key,
  name text not null,
  product text not null default 'Other',
  role text,
  schedule text,
  enabled boolean not null default true,
  next_run_at timestamptz,
  last_status text,
  last_fired_at timestamptz,
  last_finished_at timestamptz,
  summary text,
  updated_at timestamptz not null default now()
);

create table if not exists public.hq_agent_runs (
  trigger_id text not null,
  fired_at timestamptz not null,
  finished_at timestamptz,
  status text not null default 'unknown',
  summary text,
  primary key (trigger_id, fired_at)
);
create index if not exists hq_agent_runs_fired_at_idx on public.hq_agent_runs (fired_at desc);

create table if not exists public.hq_products (
  product text primary key,
  repo text,
  site_url text,
  shipped text,
  in_review text,
  open_prs integer,
  merged_24h integer,
  deploy_state text,
  updated_at timestamptz not null default now()
);

create table if not exists public.hq_items (
  id bigint generated always as identity primary key,
  product text not null,
  kind text not null default 'needs_you',
  title text not null,
  detail text,
  url text,
  created_at timestamptz not null default now()
);

create table if not exists public.hq_sync (
  id text primary key default 'current',
  synced_at timestamptz not null default now(),
  note text
);

alter table public.hq_settings enable row level security;
alter table public.hq_login_attempts enable row level security;
alter table public.hq_agents enable row level security;
alter table public.hq_agent_runs enable row level security;
alter table public.hq_products enable row level security;
alter table public.hq_items enable row level security;
alter table public.hq_sync enable row level security;

-- The sync agent sends one JSON document; this stores it in one transaction.
create or replace function public.hq_ingest(payload jsonb)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  a jsonb;
  st text;
  n_agents int := 0;
begin
  if jsonb_typeof(payload->'agents') = 'array' and jsonb_array_length(payload->'agents') > 0 then
    for a in select * from jsonb_array_elements(payload->'agents') loop
      st := lower(coalesce(a->'last_run'->>'status', ''));
      st := case
        when st like '%succe%' then 'succeeded'
        when st like '%fail%' or st like '%error%' or st like '%cancel%' or st like '%timeout%' then 'failed'
        when st like '%pend%' or st like '%run%' or st like '%progress%' then 'running'
        when st = '' then null
        else 'unknown' end;
      insert into hq_agents (trigger_id, name, product, role, schedule, enabled, next_run_at,
                             last_status, last_fired_at, last_finished_at, summary, updated_at)
      values (a->>'trigger_id', a->>'name', coalesce(nullif(a->>'product',''), 'Other'), a->>'role', a->>'schedule',
              coalesce((a->>'enabled')::boolean, true), nullif(a->>'next_run_at','')::timestamptz,
              st, nullif(a->'last_run'->>'fired_at','')::timestamptz, nullif(a->'last_run'->>'finished_at','')::timestamptz,
              nullif(a->>'summary',''), now())
      on conflict (trigger_id) do update set
        name = excluded.name, product = excluded.product, role = excluded.role, schedule = excluded.schedule,
        enabled = excluded.enabled, next_run_at = excluded.next_run_at, last_status = excluded.last_status,
        last_fired_at = excluded.last_fired_at, last_finished_at = excluded.last_finished_at,
        summary = coalesce(excluded.summary, hq_agents.summary), updated_at = now();

      if nullif(a->'last_run'->>'fired_at','') is not null then
        insert into hq_agent_runs (trigger_id, fired_at, finished_at, status, summary)
        values (a->>'trigger_id', (a->'last_run'->>'fired_at')::timestamptz,
                nullif(a->'last_run'->>'finished_at','')::timestamptz, coalesce(st, 'unknown'), nullif(a->>'summary',''))
        on conflict (trigger_id, fired_at) do update set
          finished_at = coalesce(excluded.finished_at, hq_agent_runs.finished_at),
          status = excluded.status,
          summary = coalesce(excluded.summary, hq_agent_runs.summary);
      end if;
      n_agents := n_agents + 1;
    end loop;

    -- Agents that no longer exist drop off the page; their run history stays.
    delete from hq_agents where trigger_id not in (
      select x->>'trigger_id' from jsonb_array_elements(payload->'agents') x);
  end if;

  -- A run still marked running after six hours never reported back.
  update hq_agent_runs set status = 'unknown'
   where status = 'running' and fired_at < now() - interval '6 hours';

  if jsonb_typeof(payload->'products') = 'array' then
    delete from hq_products where true;
    insert into hq_products (product, repo, site_url, shipped, in_review, open_prs, merged_24h, deploy_state)
    select p->>'product', p->>'repo', p->>'site_url', p->>'shipped', p->>'in_review',
           nullif(p->>'open_prs','')::int, nullif(p->>'merged_24h','')::int, p->>'deploy_state'
      from jsonb_array_elements(payload->'products') p
     where coalesce(p->>'product','') <> ''
    on conflict (product) do nothing;
  end if;

  if jsonb_typeof(payload->'items') = 'array' then
    delete from hq_items where true;
    insert into hq_items (product, kind, title, detail, url)
    select coalesce(i->>'product','Other'), coalesce(nullif(i->>'kind',''),'needs_you'), i->>'title', i->>'detail', i->>'url'
      from jsonb_array_elements(payload->'items') i
     where coalesce(i->>'title','') <> '';
  end if;

  insert into hq_sync (id, synced_at, note) values ('current', now(), payload->>'note')
  on conflict (id) do update set synced_at = now(), note = excluded.note;

  delete from hq_agent_runs where fired_at < now() - interval '60 days';
  return jsonb_build_object('ok', true, 'agents', n_agents);
end;
$$;

-- Everything the page needs, in one call.
create or replace function public.hq_dashboard()
returns jsonb
language sql
stable
set search_path = public
as $$
  select jsonb_build_object(
    'synced_at', (select synced_at from hq_sync where id = 'current'),
    'note', (select note from hq_sync where id = 'current'),
    'agents', coalesce((select jsonb_agg(to_jsonb(a) order by a.product, a.name) from hq_agents a), '[]'::jsonb),
    'runs', coalesce((select jsonb_agg(to_jsonb(r) order by r.fired_at)
                        from hq_agent_runs r
                       where r.fired_at > now() - interval '7 days'
                         and exists (select 1 from hq_agents a where a.trigger_id = r.trigger_id)), '[]'::jsonb),
    'products', coalesce((select jsonb_agg(to_jsonb(p) order by p.product) from hq_products p), '[]'::jsonb),
    'items', coalesce((select jsonb_agg(to_jsonb(i) order by i.id) from hq_items i), '[]'::jsonb)
  );
$$;

revoke all on function public.hq_ingest(jsonb) from public, anon, authenticated;
revoke all on function public.hq_dashboard() from public, anon, authenticated;
grant execute on function public.hq_ingest(jsonb) to service_role;
grant execute on function public.hq_dashboard() to service_role;
