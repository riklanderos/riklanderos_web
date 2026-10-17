# riklanderos.com

Sitio de marca personal de Rik Landeros — Consultor de IA para empresas · Fundador de Ingeniak.
Fuente de verdad del contenido: `riklanderos-web-spec.md` (v1.0) + brandbook 2025.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Animaciones: `motion` (Reveal, SplitWords, MaskReveal, CountUp, DrawPath en `components/motion.tsx`), respeta `prefers-reduced-motion`
- Leads: `/api/lead` → Supabase (tabla `leads`) + webhook n8n (`LEAD_WEBHOOK_URL`)
- Deploy recomendado: Vercel, dominio `riklanderos.com` (www → apex)

## Desarrollo

```bash
npm install
npm run dev
```

Variables de entorno: ver `.env.example`. Sin ellas el formulario funciona en modo desarrollo (no guarda nada).

## Identidad visual

- Paleta del brandbook: `#0B0C0D` · `#FFFFFF` · `#B3B3B3` · `#646564` · `#EBD9C0` · `#E51C1E` (tokens en `app/globals.css`)
- Tipografías web: Inter Tight (display), Inter (texto), JetBrains Mono (etiquetas/datos), Instrument Serif (citas),
  Native Brush (acento del brandbook, `app/fonts/NativeBrush.ttf`). Ebrima no se embebe: es una fuente de sistema de
  Windows sin licencia web; si quieres usarla, compra la licencia web y agrégala con `next/font/local`.
- Logo: `components/Logo.tsx` (paths del SVG oficial), variantes en `public/brand/`.

## Fotografía

Retratos editoriales generados con Higgsfield (GPT Image 2.5) a partir de las fotos de estudio de Rik
(`public/img/rik-*.webp`). Originales optimizados en `public/img/orig/`.

## Pendientes antes de publicar (spec §10)

1. Confirmar URLs de LinkedIn y YouTube en `lib/site.ts` (hoy son supuestas).
2. Confirmar datos de los casos (Argi, clínica dental, clínica estética) y aprobación de clientes para usar nombres.
3. Confirmar uso de logos de clientes (Coca-Cola, Nike, BMW, Cemex, ARGI, Tierra y Armonía) y su relación directa.
4. Configurar Supabase (`supabase/schema.sql`), `LEAD_WEBHOOK_URL` (n8n → Kommo/GHL), GA4 y Meta Pixel.
5. Revisión legal de `/privacidad` y `/terminos`.
6. Testimonios reales de clientes: el sitio no muestra ninguno hasta tenerlos con nombre y permiso.
