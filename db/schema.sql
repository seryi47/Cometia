-- ============================================================================
-- COMETIA 2.0 — Modelo de datos (Supabase / Postgres)
-- ----------------------------------------------------------------------------
-- Multi-tenant desde el minuto uno:
--   Organization → Websites → Snapshots → (Findings viven en el snapshot jsonb)
--                          → Changes → Alerts
--                          → Actions
--   Organization → Members (auth.users)
--
-- Aislamiento por RLS: un usuario SOLO ve datos de las organizaciones a las
-- que pertenece. El backend (cron/análisis) usa la service_role, que salta RLS.
--
-- Diseñado para crecer (SSL, uptime, GSC, GA, CrUX, competencia…) SIN migrar:
-- las piezas variables van en columnas jsonb (metrics, findings, signals…).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ===========================================================================
-- ORGANIZATIONS
-- ===========================================================================
create table if not exists public.organizations (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  plan                   text not null default 'free' check (plan in ('free','starter','agency')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  subscription_status    text,             -- active, past_due, canceled…
  website_limit          int  not null default 1,   -- cupo según plan
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create trigger trg_org_touch before update on public.organizations
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- MEMBERS  (auth.users ↔ organizations)
-- ===========================================================================
create table if not exists public.org_members (
  org_id     uuid not null references public.organizations(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'owner' check (role in ('owner','member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index if not exists idx_members_user on public.org_members(user_id);

-- Función SECURITY DEFINER: ¿el usuario actual pertenece a esta org?
-- (evita recursión de RLS al consultarse org_members a sí misma)
create or replace function public.is_org_member(target uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.org_members m
    where m.org_id = target and m.user_id = auth.uid()
  );
$$;

-- ===========================================================================
-- WEBSITES
-- ===========================================================================
create table if not exists public.websites (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references public.organizations(id) on delete cascade,
  url               text not null,
  host              text not null,
  name              text,                                   -- etiqueta opcional (cliente)
  frequency         text not null default 'weekly' check (frequency in ('daily','weekly')),
  active            boolean not null default true,
  alert_email       text,                                   -- a quién avisar (por defecto, dueño)
  thresholds        jsonb,                                  -- override de umbrales del diff
  status            text not null default 'nuevo' check (status in ('nuevo','ok','vigilar','revisar','error')),
  last_salud        int,
  last_snapshot_id  uuid,
  last_checked_at   timestamptz,
  next_check_at     timestamptz,                            -- lo usa el cron
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (org_id, url)
);
create index if not exists idx_websites_org        on public.websites(org_id);
create index if not exists idx_websites_due         on public.websites(next_check_at) where active;
create trigger trg_websites_touch before update on public.websites
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- SNAPSHOTS  (fotografía completa y comparable — la produce snapshot.js)
-- ===========================================================================
create table if not exists public.snapshots (
  id           uuid primary key default gen_random_uuid(),
  website_id   uuid not null references public.websites(id) on delete cascade,
  org_id       uuid not null references public.organizations(id) on delete cascade,
  strategy     text not null default 'mobile',
  reachable    boolean not null default true,
  error        text,
  salud        int,
  global       int,
  counts       jsonb,     -- {critico,importante,mejora,bien,evaluados}
  scores       jsonb,     -- {performance,seo,accessibility,bestPractices}
  metrics      jsonb,     -- {lcp,cls,tbt,fcp,si,ttfb,tti}
  resources    jsonb,     -- {thirdPartyCount,totalBytes,requestCount,...}
  findings     jsonb,     -- [{id,categoria,titulo,severidad,prioridad,evidencia}]
  ok           jsonb,     -- [titulos correctos]
  signals      jsonb,     -- {title,hasTel,ctaCount,tech,schemaTypes,...}
  created_at   timestamptz not null default now()
);
create index if not exists idx_snapshots_web on public.snapshots(website_id, created_at desc);
create index if not exists idx_snapshots_org on public.snapshots(org_id);

-- ===========================================================================
-- CHANGES  (resultado de un diff entre dos snapshots — lo produce diff.js)
-- ===========================================================================
create table if not exists public.changes (
  id                uuid primary key default gen_random_uuid(),
  website_id        uuid not null references public.websites(id) on delete cascade,
  org_id            uuid not null references public.organizations(id) on delete cascade,
  snapshot_id       uuid references public.snapshots(id) on delete cascade,      -- nuevo
  prev_snapshot_id  uuid references public.snapshots(id) on delete set null,     -- anterior
  salud_delta       int,
  alert_level       text not null default 'none' check (alert_level in ('critical','important','minor','none')),
  headline          text,
  changes           jsonb,   -- [{tipo,severidad,confianza,titulo,evidencia}]
  causa             jsonb,   -- {texto,confianza} | null
  seen              boolean not null default false,
  created_at        timestamptz not null default now()
);
create index if not exists idx_changes_web on public.changes(website_id, created_at desc);
create index if not exists idx_changes_org on public.changes(org_id, created_at desc);

-- ===========================================================================
-- ALERTS  (notificaciones accionables enviadas / pendientes)
-- ===========================================================================
create table if not exists public.alerts (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  website_id  uuid not null references public.websites(id) on delete cascade,
  change_id   uuid references public.changes(id) on delete cascade,
  level       text not null check (level in ('critical','important')),
  headline    text,
  channel     text not null default 'email',
  status      text not null default 'pending' check (status in ('pending','sent','failed')),
  sent_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists idx_alerts_org on public.alerts(org_id, created_at desc);
-- Idempotencia: una sola alerta por change.
create unique index if not exists uq_alerts_change on public.alerts(change_id) where change_id is not null;

-- ===========================================================================
-- ACTIONS  (un finding → una acción, con estado y re-verificación)
-- ===========================================================================
create table if not exists public.actions (
  id                  uuid primary key default gen_random_uuid(),
  org_id              uuid not null references public.organizations(id) on delete cascade,
  website_id          uuid not null references public.websites(id) on delete cascade,
  finding_id          text,                       -- id del detector (ej. 'lcp-alto')
  title               text not null,
  categoria           text,
  status              text not null default 'pendiente'
                        check (status in ('pendiente','en_progreso','completada','verificando','verificada')),
  snapshot_before_id  uuid references public.snapshots(id) on delete set null,
  snapshot_after_id   uuid references public.snapshots(id) on delete set null,
  result              jsonb,                       -- {antes,despues,mejora,texto}
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_actions_web on public.actions(website_id, status);
create trigger trg_actions_touch before update on public.actions
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- RLS — aislamiento por organización
-- ===========================================================================
alter table public.organizations enable row level security;
alter table public.org_members   enable row level security;
alter table public.websites      enable row level security;
alter table public.snapshots     enable row level security;
alter table public.changes       enable row level security;
alter table public.alerts        enable row level security;
alter table public.actions       enable row level security;

-- organizations: ver/editar las mías
create policy org_select on public.organizations for select using (public.is_org_member(id));
create policy org_update on public.organizations for update using (public.is_org_member(id));

-- org_members: ver los miembros de mis orgs; un usuario puede verse a sí mismo
create policy members_select on public.org_members for select
  using (user_id = auth.uid() or public.is_org_member(org_id));

-- websites / snapshots / changes / alerts / actions: todo por pertenencia a la org
create policy websites_all  on public.websites  for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy snapshots_all on public.snapshots for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy changes_all   on public.changes   for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy alerts_all    on public.alerts    for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy actions_all   on public.actions   for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));

-- ===========================================================================
-- ONBOARDING — al registrarse un usuario, crear su organización personal
-- ===========================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare new_org uuid;
begin
  insert into public.organizations (name)
    values (coalesce(new.raw_user_meta_data->>'org_name', split_part(new.email,'@',1) || ' — Cometia'))
    returning id into new_org;
  insert into public.org_members (org_id, user_id, role) values (new_org, new.id, 'owner');
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
