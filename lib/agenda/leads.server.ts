import "server-only";
import { UTM_KEYS, type UtmKey } from "@/content/leads";
import { LEADS_TABLE, getSupabaseAdmin } from "@/lib/supabase-server";
import { CDMX_TZ, type BookingForm, type SessionType } from "./config";

/**
 * Reservas de la agenda → public.leads.
 * El correo de Rik lo dispara un webhook de Supabase en INSERT/UPDATE: por eso
 * el paso a "pagado" se escribe una sola vez (solo si el renglón sigue pendiente
 * o expirado). Un fallo de Supabase se registra y no interrumpe la reserva.
 * Los logs no incluyen nombres, correos ni secretos.
 */

const SUPABASE_MS = 5000;

/**
 * Códigos que acepta el check de revenue_range. La llave es el texto del formulario
 * (el guion es un en-dash). Los rangos que cruzan dos códigos no se adivinan: quedan
 * null y el texto exacto va en details.revenue.
 */
const REVENUE_CODE = new Map<string, string>([
  ["Menos de $100K MXN al mes", "lt-100k"],
  ["$100K\u2013$300K MXN", "100k-300k"],
  ["$300K\u2013$800K MXN", "300k-1m"],
]);

const TZ_RE = /^[A-Za-z0-9_+-]+(?:\/[A-Za-z0-9_+-]+){0,2}$/;

export type BookingAttribution = {
  utm: Record<UtmKey, string | null>;
  referrer: string | null;
  pagePath: string | null;
  visitorTimezone: string | null;
};

class LeadSyncTimeout extends Error {
  override name = "LeadSyncTimeout";
}

function clip(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
  return s || null;
}

/** Atribución que el formulario de agenda ya manda (UTM, referrer, ruta, zona del navegador). */
export function bookingAttribution(raw: unknown): BookingAttribution {
  const body = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const utm = {} as Record<UtmKey, string | null>;
  for (const k of UTM_KEYS) utm[k] = clip(body[k], 200);
  const ref = clip(body.referrer, 500);
  const path = clip(body.page_path, 300);
  const zona = clip(body.zona, 80);
  return {
    utm,
    referrer: ref && /^https?:\/\//i.test(ref) ? ref : null,
    pagePath: path && path.startsWith("/") && !path.startsWith("//") ? path : null,
    visitorTimezone: zona && TZ_RE.test(zona) ? zona : null,
  };
}

function revenueCode(label: string): string | null {
  return REVENUE_CODE.get(label) ?? null;
}

function leadDetails(form: BookingForm, startIso: string, origin: string | null, eventId: string, visitorTimezone: string | null) {
  return {
    fullName: form.fullName,
    email: form.email,
    whatsapp: form.whatsapp,
    businessName: form.businessName,
    website: form.website,
    industry: form.industry,
    teamSize: form.teamSize,
    revenue: form.revenue,
    timeDrains: form.timeDrains,
    tools: form.tools,
    goal: form.goal,
    slot: startIso,
    origin,
    timezone: CDMX_TZ,
    eventId,
    ...(visitorTimezone ? { visitorTimezone } : {}),
  };
}

function withTimeout<T>(work: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new LeadSyncTimeout());
    }, ms);
    Promise.resolve(work).then(
      (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function logSupabase(action: string, error: { code?: string } | null, caught?: unknown) {
  if (error) {
    console.error(`[agenda] ${action} (${error.code ?? "sin código"}).`);
    return;
  }
  if (caught) console.error(`[agenda] ${action}:`, caught instanceof Error ? caught.name : "error");
}

/** Inserta la reserva. No lanza: la cita en Calendar (y el pago) siguen aunque Supabase falle. */
export async function recordBookingLead(input: {
  type: SessionType;
  form: BookingForm;
  startIso: string;
  origin: string | null;
  eventId: string;
  attribution?: BookingAttribution;
  stripeSessionId?: string | null;
}): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.warn("[agenda] Supabase no configurado: la reserva no se guardó en leads.");
      return;
    }
    const attr = input.attribution ?? bookingAttribution(null);
    const row = {
      name: input.form.fullName.trim().slice(0, 120),
      email: input.form.email.trim().toLowerCase().slice(0, 254),
      phone: input.form.whatsapp.trim().slice(0, 40) || null,
      business: input.form.businessName.trim().slice(0, 160) || null,
      revenue_range: revenueCode(input.form.revenue),
      source: input.type,
      message: input.form.goal.trim().slice(0, 4000) || null,
      session_start: input.startIso,
      details: leadDetails(input.form, input.startIso, input.origin, input.eventId, attr.visitorTimezone),
      referrer: attr.referrer,
      page_path: attr.pagePath,
      ...attr.utm,
      ...(input.type === "power"
        ? { payment_status: "pendiente" as const, stripe_session_id: input.stripeSessionId ?? null }
        : {}),
    };
    const { error } = await withTimeout(supabase.from(LEADS_TABLE).insert(row).select("id").single(), SUPABASE_MS);
    if (error) logSupabase(`No se guardó el lead de ${input.type}`, error);
  } catch (e) {
    logSupabase(`No se guardó el lead de ${input.type}`, null, e);
  }
}

/**
 * Pasa el renglón a pagado una sola vez (pendiente o expirado → pagado).
 * Un segundo llamado no escribe y no vuelve a disparar el webhook.
 */
export async function markBookingPaid(stripeSessionId: string | null | undefined): Promise<void> {
  try {
    await setPaymentByStripe(stripeSessionId, "pagado", ["pendiente", "expirado"]);
  } catch (e) {
    logSupabase("No se actualizó el lead a pagado", null, e);
  }
}

/** Apartado liberado sin pago. No pisa un renglón que ya está pagado. */
export async function markBookingExpired(stripeSessionId: string | null | undefined): Promise<void> {
  try {
    await setPaymentByStripe(stripeSessionId, "expirado", ["pendiente"]);
  } catch (e) {
    logSupabase("No se actualizó el lead a expirado", null, e);
  }
}

/** El evento de Calendar ya no existe: se localiza la fila por details.eventId. */
export async function markBookingExpiredByEvent(eventId: string): Promise<void> {
  if (!eventId) return;
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.warn("[agenda] Supabase no configurado: no se marcó el lead como expirado.");
      return;
    }
    const { error } = await withTimeout(
      supabase.from(LEADS_TABLE).update({ payment_status: "expirado" }).contains("details", { eventId }).eq("payment_status", "pendiente").select("id"),
      SUPABASE_MS,
    );
    if (error) logSupabase("No se marcó el lead como expirado", error);
  } catch (e) {
    logSupabase("No se marcó el lead como expirado", null, e);
  }
}

async function setPaymentByStripe(
  stripeSessionId: string | null | undefined,
  status: "pagado" | "expirado",
  from: readonly ("pendiente" | "expirado")[],
) {
  if (!stripeSessionId) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn(`[agenda] Supabase no configurado: no se actualizó el lead a ${status}.`);
    return;
  }
  try {
    const { error } = await withTimeout(
      supabase.from(LEADS_TABLE).update({ payment_status: status }).eq("stripe_session_id", stripeSessionId).in("payment_status", [...from]).select("id"),
      SUPABASE_MS,
    );
    if (error) logSupabase(`No se actualizó el lead a ${status}`, error);
  } catch (e) {
    logSupabase(`No se actualizó el lead a ${status}`, null, e);
  }
}
