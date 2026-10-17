/**
 * Reglas de la agenda (Power Session y Discovery Session). Compartido entre cliente y servidor.
 * Zona de operación: America/Mexico_City (UTC−6 todo el año, sin horario de verano desde 2022).
 */

export type SessionType = "power" | "discovery";

export const CDMX_TZ = "America/Mexico_City";
export const CDMX_OFFSET = "-06:00";

/** Días hábiles (lunes a viernes) que se ofrecen, contados a partir de mañana. */
export const BOOKABLE_BUSINESS_DAYS = 5;
/** Anticipación mínima para reservar. */
export const MIN_HOURS_AHEAD = 12;
/** Colchón entre citas: un horario se descarta si choca con algo ocupado ± este margen. */
export const BUFFER_MINUTES = 15;
/** Cupo semanal de Power Sessions (lo que el sitio promete: 4 por semana). */
export const POWER_WEEKLY_LIMIT = 4;
/** Minutos que se aparta un horario mientras el cliente paga en Stripe. */
export const HOLD_MINUTES = 31;

export const SESSION_RULES: Record<SessionType, { minutes: number; times: readonly string[]; label: string }> = {
  power: {
    minutes: 90,
    // 90 min + 15 de colchón, 10:00–17:00 CDMX
    times: ["10:00", "11:45", "13:30", "15:15"],
    label: "Power Session",
  },
  discovery: {
    minutes: 30,
    // 30 min + 15 de colchón, con descanso de 13:45 a 15:00
    times: ["10:00", "10:45", "11:30", "12:15", "13:00", "15:00", "15:45", "16:30"],
    label: "Discovery Session",
  },
};

export const POWER_PRICE_CENTS = 29700;
export const POWER_CURRENCY = "usd";

/* ── Opciones del formulario ─────────────────────────────────── */

export const INDUSTRIES = [
  "Servicios profesionales",
  "Salud y bienestar",
  "Retail o tienda física",
  "E-commerce",
  "Restaurantes y alimentos",
  "Construcción e inmobiliaria",
  "Manufactura o industria",
  "Educación",
  "Agencia o marketing",
  "Otro",
] as const;

export const TEAM_SIZES = ["Solo yo", "2–5", "6–10", "11–25", "26–50", "Más de 50"] as const;

export const REVENUES = [
  "Menos de $100K MXN al mes",
  "$100K–$300K MXN",
  "$300K–$800K MXN",
  "$800K–$2M MXN",
  "Más de $2M MXN",
  "Apenas voy a empezar",
] as const;

export const TIME_DRAINS = [
  "Atender WhatsApp y prospectos",
  "Cotizar",
  "Cobrar y dar seguimiento a pagos",
  "Supervisar al equipo",
  "Atención a clientes y quejas",
  "Administración y facturación",
  "Compras y proveedores",
  "Marketing y contenido",
  "Otro",
] as const;

export type BookingForm = {
  fullName: string;
  email: string;
  whatsapp: string;
  businessName: string;
  website: string;
  industry: string;
  teamSize: string;
  revenue: string;
  /** Solo Power Session: hasta 3. */
  timeDrains: string[];
  /** Solo Power Session. */
  tools: string;
  goal: string;
};

export const EMPTY_FORM: BookingForm = {
  fullName: "",
  email: "",
  whatsapp: "",
  businessName: "",
  website: "",
  industry: "",
  teamSize: "",
  revenue: "",
  timeDrains: [],
  tools: "",
  goal: "",
};

export type FormErrors = Partial<Record<keyof BookingForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validación compartida (el servidor la repite: nunca se confía en el navegador). */
export function validateForm(type: SessionType, f: BookingForm): FormErrors {
  const e: FormErrors = {};
  const t = (s: string) => s.trim();
  if (t(f.fullName).length < 3) e.fullName = "Escribe tu nombre completo.";
  if (!EMAIL_RE.test(t(f.email)) || t(f.email).length > 200) e.email = "Revisa tu correo: ahí te llega la invitación.";
  if (t(f.whatsapp).replace(/\D/g, "").length < 10) e.whatsapp = "Incluye tu WhatsApp con lada (10 dígitos o más).";
  if (t(f.businessName).length < 2) e.businessName = "Escribe el nombre de tu negocio.";
  if (t(f.website).length > 200) e.website = "Máximo 200 caracteres.";
  if (!INDUSTRIES.includes(f.industry as (typeof INDUSTRIES)[number])) e.industry = "Elige un giro.";
  if (!TEAM_SIZES.includes(f.teamSize as (typeof TEAM_SIZES)[number])) e.teamSize = "Elige el tamaño de tu equipo.";
  if (!REVENUES.includes(f.revenue as (typeof REVENUES)[number])) e.revenue = "Elige un rango.";
  if (type === "power") {
    if (f.timeDrains.length < 1) e.timeDrains = "Elige al menos una.";
    else if (f.timeDrains.length > 3 || f.timeDrains.some((d) => !TIME_DRAINS.includes(d as (typeof TIME_DRAINS)[number])))
      e.timeDrains = "Máximo 3 opciones.";
    if (t(f.tools).length < 2 || t(f.tools).length > 300) e.tools = "Cuéntame qué usan hoy (CRM, Excel, WhatsApp…).";
    if (t(f.goal).length < 20 || t(f.goal).length > 1000) e.goal = "Cuéntame con al menos 20 caracteres qué quieres resolver.";
  } else if (t(f.goal).length < 10 || t(f.goal).length > 600) {
    e.goal = "Cuéntame con al menos 10 caracteres qué quieres resolver.";
  }
  return e;
}

/* ── Fechas ──────────────────────────────────────────────────── */

export type DayAvailability = { date: string; slots: string[] };

/** Instante UTC (ISO) de una fecha y hora en CDMX. */
export function cdmxToIso(date: string, time: string): string {
  return new Date(`${date}T${time}:00${CDMX_OFFSET}`).toISOString();
}

/** YYYY-MM-DD en CDMX para un instante. */
export function cdmxDateKey(d: Date): string {
  return new Date(d.getTime() - 6 * 3600_000).toISOString().slice(0, 10);
}

/** Los próximos N días hábiles (lunes a viernes) en CDMX, empezando mañana. */
export function bookableDates(now = new Date()): string[] {
  const out: string[] = [];
  const base = new Date(`${cdmxDateKey(now)}T12:00:00Z`);
  for (let i = 1; out.length < BOOKABLE_BUSINESS_DAYS && i < 15; i++) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + i);
    const wd = d.getUTCDay();
    if (wd === 0 || wd === 6) continue;
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function formatDayEs(date: string): { weekday: string; day: string; month: string } {
  const d = new Date(`${date}T12:00:00${CDMX_OFFSET}`);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("es-MX", { timeZone: CDMX_TZ, ...o }).format(d);
  return { weekday: f({ weekday: "long" }), day: f({ day: "numeric" }), month: f({ month: "long" }) };
}

export function formatTimeEs(iso: string, timeZone = CDMX_TZ): string {
  return new Intl.DateTimeFormat("es-MX", { timeZone, hour: "numeric", minute: "2-digit", hour12: true })
    .format(new Date(iso))
    .replace(/\s?([ap])\.?\s?m\.?/i, (_, x: string) => ` ${x.toUpperCase()}M`);
}

/** "Martes 21 de octubre · 10:00 AM (hora CDMX)". */
export function formatSlotEs(iso: string): string {
  const date = cdmxDateKey(new Date(iso));
  const { weekday, day, month } = formatDayEs(date);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${day} de ${month} · ${formatTimeEs(iso)}`;
}
