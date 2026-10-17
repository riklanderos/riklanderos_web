-- ─────────────────────────────────────────────────────────────
-- riklanderos.tech · brief previo a la Power Session
-- Ejecutar en Supabase → SQL Editor. Idempotente.
--
-- Un brief por Power Session pagada (se crea al confirmar el pago).
-- El cliente entra con un link secreto (/brief/<token>); el servidor
-- escribe con la SERVICE ROLE KEY. RLS activado y sin políticas:
-- anon y authenticated no pueden leer ni escribir.
-- Audios y archivos van al bucket privado "power-briefs".
-- ─────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

create table if not exists public.power_briefs (
  id                uuid primary key default gen_random_uuid(),
  token             text not null unique check (char_length(token) between 32 and 128),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  submitted_at      timestamptz,
  status            text not null default 'borrador' check (status in ('borrador', 'enviado')),

  event_id          text not null unique,                     -- evento de Google Calendar de la sesión
  stripe_session_id text,
  name              text check (char_length(name) <= 120),
  email             text check (char_length(email) <= 254),
  business          text check (char_length(business) <= 160),
  session_start     timestamptz,

  answers           jsonb not null default '{"values": {}, "files": {}}'::jsonb,  -- respuestas, audios y archivos
  transcripts       jsonb not null default '{}'::jsonb                            -- ruta del audio → texto
);

comment on table public.power_briefs is 'Brief previo a la Power Session: 7 pisos + meta, con audios y archivos en storage power-briefs.';

create index if not exists power_briefs_created_idx on public.power_briefs (created_at desc);
create index if not exists power_briefs_stripe_idx  on public.power_briefs (stripe_session_id);

alter table public.power_briefs enable row level security;
alter table public.power_briefs force row level security;
revoke all on table public.power_briefs from anon, authenticated;

-- Bucket privado: 50 MB por archivo; imágenes, video corto, audio, PDF y Office.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'power-briefs', 'power-briefs', false, 52428800,
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/heic', 'image/heif',
    'video/mp4', 'video/quicktime', 'video/webm',
    'audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/x-m4a', 'audio/aac',
    'application/pdf', 'text/plain', 'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint',
    'application/octet-stream'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
