import { NextResponse, type NextRequest } from "next/server";
import {
  CONTACT_REASONS,
  EMAIL_RE,
  HONEYPOT_FIELD,
  LEAD_SOURCES,
  LIMITS,
  REVENUE_RANGES,
  UTM_KEYS,
  isValidPhone,
  type LeadSource,
  type UtmKey,
} from "@/content/leads";
import { getResource } from "@/content/recursos";
import { LEADS_TABLE, getSupabaseAdmin } from "@/lib/supabase-server";
import { SITE } from "@/lib/site";

/**
 * POST /api/lead — captura de leads (spec §9.1 y §9.2).
 * 1. Valida en servidor (sin dependencias extra).
 * 2. Descarta en silencio a los bots (honeypot + tiempo mínimo de llenado).
 * 3. Inserta en Supabase (tabla `leads`, service role, RLS sin políticas públicas).
 * 4. Reenvía a n8n (LEAD_WEBHOOK_URL) con etiqueta por origen, p. ej. `recurso:<slug>`.
 * Si no hay ningún destino configurado: en desarrollo responde ok para no romper el flujo;
 * en producción responde 503 para que el visitante no crea que su mensaje llegó.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_000;
/** Un humano tarda más de esto en llenar el formulario más corto. */
const MIN_FILL_MS = 1200;
const WEBHOOK_TIMEOUT_MS = 6000;

const GENERIC_ERROR = `No pudimos registrar tus datos. Inténtalo de nuevo en unos minutos o escríbeme a ${SITE.email}.`;

type LeadRow = {
  name: string;
  email: string;
  phone: string | null;
  business: string | null;
  revenue_range: string | null;
  source: LeadSource;
  resource: string | null;
  reason: string | null;
  message: string | null;
  referrer: string | null;
  page_path: string | null;
} & Record<UtmKey, string | null>;

type FieldErrors = Record<string, string>;

/* ── Utilidades de saneo ─────────────────────────────────────── */

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function text(v: unknown): string {
  return typeof v === "string" ? v.replace(CONTROL_CHARS, "").trim() : "";
}
function oneLine(v: unknown): string {
  return text(v).replace(/\s+/g, " ");
}
function multiLine(v: unknown): string {
  return text(v).replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n");
}
function optionalShort(v: unknown, max: number): string | null {
  const s = oneLine(v).slice(0, max);
  return s || null;
}

/* ── Rate limit best-effort (por instancia) ──────────────────── */

const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 8;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  if (hits.size > 5000) hits.clear();
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
}

/* ── Validación ──────────────────────────────────────────────── */

function validate(body: Record<string, unknown>): { ok: true; row: LeadRow } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};

  const source = oneLine(body.source) as LeadSource;
  if (!LEAD_SOURCES.includes(source)) {
    return { ok: false, errors: { form: "Origen del formulario no válido." } };
  }

  const name = oneLine(body.name);
  if (name.length < LIMITS.name.min) errors.name = "Escribe tu nombre.";
  else if (name.length > LIMITS.name.max) errors.name = `Máximo ${LIMITS.name.max} caracteres.`;

  const email = oneLine(body.email).toLowerCase();
  if (!email) errors.email = "Escribe tu correo.";
  else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email)) errors.email = "Revisa tu correo: parece incompleto.";

  let phone: string | null = null;
  let business: string | null = null;
  let revenue_range: string | null = null;
  let resource: string | null = null;
  let reason: string | null = null;
  let message: string | null = null;

  if (source === "radikales") {
    business = oneLine(body.business);
    if (business.length < LIMITS.business.min) errors.business = "Dime el nombre o giro de tu negocio.";
    else if (business.length > LIMITS.business.max) errors.business = `Máximo ${LIMITS.business.max} caracteres.`;

    revenue_range = oneLine(body.revenue_range);
    if (!REVENUE_RANGES.some((r) => r.value === revenue_range)) errors.revenue_range = "Elige un rango de facturación.";

    message = multiLine(body.message);
    if (message.length < LIMITS.stuck.min) errors.message = "Cuéntame en una o dos frases qué te tiene atrapado.";
    else if (message.length > LIMITS.stuck.max) errors.message = `Máximo ${LIMITS.stuck.max} caracteres.`;
  }

  if (source === "recurso") {
    const r = getResource(oneLine(body.resource));
    if (!r) errors.form = "Ese recurso no existe. Recarga la página e inténtalo de nuevo.";
    else resource = r.slug;
  }

  if (source === "contacto") {
    const rawPhone = oneLine(body.phone);
    if (rawPhone) {
      if (rawPhone.length > LIMITS.phone.max || !isValidPhone(rawPhone)) errors.phone = "Revisa el teléfono: usa solo números y el código de país si aplica.";
      else phone = rawPhone;
    }

    reason = oneLine(body.reason);
    if (!CONTACT_REASONS.some((r) => r.value === reason)) errors.reason = "Elige el motivo de tu mensaje.";

    message = multiLine(body.message);
    if (message.length < LIMITS.message.min) errors.message = "Cuéntame un poco más: fecha, formato o idea.";
    else if (message.length > LIMITS.message.max) errors.message = `Máximo ${LIMITS.message.max} caracteres.`;
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  const utm = {} as Record<UtmKey, string | null>;
  for (const k of UTM_KEYS) utm[k] = optionalShort(body[k], 200);

  const ref = oneLine(body.referrer).slice(0, 500);
  const path = oneLine(body.page_path).slice(0, 300);

  return {
    ok: true,
    row: {
      name,
      email,
      phone,
      business,
      revenue_range,
      source,
      resource,
      reason,
      message,
      referrer: /^https?:\/\//i.test(ref) ? ref : null,
      page_path: path.startsWith("/") ? path : null,
      ...utm,
    },
  };
}

/* ── Destinos ────────────────────────────────────────────────── */

type SinkStatus = "skipped" | "ok" | "error";

async function storeLead(row: LeadRow): Promise<{ status: SinkStatus; id?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "skipped" };
  try {
    const { data, error } = await supabase.from(LEADS_TABLE).insert(row).select("id").single();
    if (error) {
      console.error(`[lead] Supabase insert falló (${error.code ?? "sin código"}): ${error.message}`);
      return { status: "error" };
    }
    return { status: "ok", id: (data as { id?: string } | null)?.id };
  } catch (e) {
    console.error("[lead] Supabase no respondió:", e instanceof Error ? e.name : "error");
    return { status: "error" };
  }
}

function tagFor(row: LeadRow) {
  if (row.source === "recurso") return `recurso:${row.resource}`;
  if (row.source === "contacto") return `contacto:${row.reason}`;
  return "radikales:lista-interes";
}

async function forwardLead(row: LeadRow, leadId: string | undefined): Promise<SinkStatus> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return "skipped";
  const tag = tagFor(row);
  const payload = {
    event: "lead.created",
    site: "riklanderos.tech",
    submitted_at: new Date().toISOString(),
    lead_id: leadId ?? null,
    tag,
    tags: [tag, `origen:${row.source}`, "web:riklanderos"],
    ...row,
    resource_title: row.resource ? (getResource(row.resource)?.title ?? null) : null,
    revenue_range_label: REVENUE_RANGES.find((r) => r.value === row.revenue_range)?.label ?? null,
    reason_label: CONTACT_REASONS.find((r) => r.value === row.reason)?.label ?? null,
  };
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.LEAD_WEBHOOK_SECRET) headers["x-webhook-secret"] = process.env.LEAD_WEBHOOK_SECRET;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[lead] Webhook respondió ${res.status}.`);
      return "error";
    }
    return "ok";
  } catch (e) {
    // Nunca se registra la URL: puede contener tokens.
    console.error("[lead] Webhook falló:", e instanceof Error ? e.name : "error");
    return "error";
  }
}

/* ── Handler ─────────────────────────────────────────────────── */

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "Formato no soportado." }, 415);
  }

  // Rechazo temprano por tamaño declarado, antes de leer el cuerpo completo.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return json({ ok: false, error: "El mensaje es demasiado largo." }, 413);

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return json({ ok: false, error: GENERIC_ERROR }, 400);
  }
  // Se mide en bytes UTF-8, no en unidades de código de JS.
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "El mensaje es demasiado largo." }, 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Solicitud no válida." }, 400);
  }

  // Bots: honeypot lleno o envío más rápido de lo humanamente posible. Respondemos ok y no guardamos nada.
  const elapsed = typeof body.elapsed_ms === "number" ? body.elapsed_ms : null;
  if (text(body[HONEYPOT_FIELD]) || (elapsed !== null && elapsed < MIN_FILL_MS)) {
    console.info("[lead] Envío descartado por filtro antispam.");
    return json({ ok: true });
  }

  if (rateLimited(clientIp(req))) {
    return json({ ok: false, error: "Demasiados intentos seguidos. Espera unos minutos y vuelve a intentarlo." }, 429);
  }

  const result = validate(body);
  if (!result.ok) {
    return json({ ok: false, error: result.errors.form ?? "Revisa los campos marcados.", errors: result.errors }, 422);
  }
  const row = result.row;

  const stored = await storeLead(row);
  const forwarded = await forwardLead(row, stored.id);

  if (stored.status === "skipped") console.warn("[lead] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no configurados: el lead no se guardó en base de datos.");
  if (forwarded === "skipped") console.warn("[lead] LEAD_WEBHOOK_URL no configurado: el lead no se envió al CRM.");

  if (stored.status === "skipped" && forwarded === "skipped") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[lead] Modo desarrollo: respondo ok sin destino. source=${row.source} tag=${tagFor(row)}`);
      return json({ ok: true, dev: true });
    }
    console.error(`[lead] Sin destino configurado en producción. Lead perdido (source=${row.source}).`);
    return json({ ok: false, error: GENERIC_ERROR }, 503);
  }

  if (stored.status === "ok" || forwarded === "ok") return json({ ok: true });

  return json({ ok: false, error: GENERIC_ERROR }, 502);
}
