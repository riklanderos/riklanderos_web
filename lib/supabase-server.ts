import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase SOLO para servidor (route handlers). Usa la service role key,
 * que salta RLS: nunca importes este módulo desde un componente "use client" ni
 * expongas estas variables con el prefijo NEXT_PUBLIC_.
 *
 * Devuelve null si faltan variables de entorno, para que el llamador decida cómo
 * degradar (en desarrollo, el flujo de formularios sigue funcionando sin base de datos).
 */
let cached: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    cached = null;
    return cached;
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { "x-application-name": "riklanderos-web" } },
  });
  return cached;
}

export const LEADS_TABLE = "leads";
