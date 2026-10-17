-- ─────────────────────────────────────────────────────────────
-- riklanderos.com · tabla de leads (spec §9.1)
-- Ejecutar en Supabase → SQL Editor. Idempotente.
--
-- Escritura: solo desde el servidor (app/api/lead/route.ts) con la
-- SERVICE ROLE KEY, que salta RLS. RLS queda activado y SIN políticas
-- públicas: anon y authenticated no pueden leer ni escribir.
-- ─────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  name          text not null check (char_length(name) between 2 and 120),
  email         text not null check (char_length(email) <= 254),
  phone         text check (char_length(phone) <= 40),
  business      text check (char_length(business) <= 160),
  revenue_range text check (revenue_range in ('lt-100k', '100k-300k', '300k-1m', '1m-5m', 'gt-5m')),

  source        text not null check (source in ('radikales', 'recurso', 'contacto')),
  resource      text check (char_length(resource) <= 120),           -- slug del recurso (source = 'recurso')
  reason        text check (reason in ('prensa', 'conferencia', 'podcast', 'partnership', 'otro')), -- motivo (source = 'contacto')
  message       text check (char_length(message) <= 4000),

  utm_source    text check (char_length(utm_source) <= 200),
  utm_medium    text check (char_length(utm_medium) <= 200),
  utm_campaign  text check (char_length(utm_campaign) <= 200),
  utm_content   text check (char_length(utm_content) <= 200),
  utm_term      text check (char_length(utm_term) <= 200),
  referrer      text check (char_length(referrer) <= 500),
  page_path     text check (char_length(page_path) <= 300)
);

comment on table public.leads is 'Leads de riklanderos.com: Radikales (lista de interés), recursos descargables y contacto.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_source_idx     on public.leads (source, created_at desc);
create index if not exists leads_email_idx      on public.leads (lower(email));

-- Seguridad: RLS activado, sin políticas => acceso denegado a anon/authenticated.
alter table public.leads enable row level security;
alter table public.leads force row level security;

revoke all on table public.leads from anon, authenticated;
