import "server-only";
import { SITE } from "@/lib/site";
import {
  BUFFER_MINUTES,
  HOLD_MINUTES,
  MIN_HOURS_AHEAD,
  POWER_CURRENCY,
  POWER_PRICE_CENTS,
  POWER_WEEKLY_LIMIT,
  SESSION_RULES,
  bookableDates,
  cdmxToIso,
  formatSlotEs,
  type BookingForm,
  type DayAvailability,
  type SessionType,
} from "./config";
import { AgendaConfigError } from "./connect.server";
import { deleteEvent, freeBusy, getEvent, insertEvent, listEvents, patchEvent, type CalEvent } from "./google.server";
import { stripeClient } from "./stripe.server";

/* ── Calendarios ─────────────────────────────────────────────── */

/** Calendario donde vive cada sesión (se eligen en /admin/agenda y se guardan como variables de entorno). */
export function calendarFor(type: SessionType): string {
  const id = type === "power" ? process.env.POWER_CALENDAR_ID : process.env.DISCOVERY_CALENDAR_ID;
  if (!id) throw new AgendaConfigError(`Falta ${type === "power" ? "POWER" : "DISCOVERY"}_CALENDAR_ID`);
  return id;
}

/** Rik atiende las dos sesiones: la ocupación se cruza entre ambos calendarios y su calendario principal. */
function busyCalendars(): string[] {
  return Array.from(new Set([calendarFor("power"), calendarFor("discovery"), "primary"]));
}

const P = {
  type: "rl_tipo",
  state: "rl_estado",
  stripe: "rl_stripe",
  email: "rl_email",
  name: "rl_nombre",
} as const;

/* ── Disponibilidad ──────────────────────────────────────────── */

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

/** Lunes 00:00 CDMX (como clave YYYY-MM-DD) de la semana de una fecha. */
function weekKey(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  const wd = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - wd);
  return d.toISOString().slice(0, 10);
}

export async function availability(type: SessionType, now = new Date()): Promise<DayAvailability[]> {
  const rule = SESSION_RULES[type];
  const dates = bookableDates(now);
  const timeMin = cdmxToIso(dates[0], "00:00");
  const timeMax = cdmxToIso(dates[dates.length - 1], "23:59");
  const busy = (await freeBusy(busyCalendars(), timeMin, timeMax)).map((b) => [Date.parse(b.start), Date.parse(b.end)] as const);
  const earliest = now.getTime() + MIN_HOURS_AHEAD * 3600_000;
  const pad = BUFFER_MINUTES * 60_000;

  // Cupo semanal de Power Sessions: cuenta las reservadas y las apartadas en pago.
  const fullWeeks = new Set<string>();
  if (type === "power") {
    const weeks = Array.from(new Set(dates.map(weekKey)));
    for (const w of weeks) {
      const start = cdmxToIso(w, "00:00");
      const end = new Date(Date.parse(start) + 7 * 86400_000).toISOString();
      const events = await listEvents(calendarFor("power"), { timeMin: start, timeMax: end, privateProps: { [P.type]: "power" } });
      if (events.length >= POWER_WEEKLY_LIMIT) fullWeeks.add(w);
    }
  }

  return dates.map((date) => {
    if (fullWeeks.has(weekKey(date))) return { date, slots: [] };
    const slots = rule.times
      .map((t) => cdmxToIso(date, t))
      .filter((iso) => {
        const s = Date.parse(iso);
        const e = s + rule.minutes * 60_000;
        if (s < earliest) return false;
        return !busy.some(([bs, be]) => overlaps(s - pad, e + pad, bs, be));
      });
    return { date, slots };
  });
}

async function assertSlotFree(type: SessionType, startIso: string) {
  const days = await availability(type);
  if (!days.some((d) => d.slots.includes(startIso))) {
    throw new SlotTakenError("Ese horario se acaba de ocupar. Elige otro, por favor.");
  }
}

export class SlotTakenError extends Error {}

/* ── Descripción del evento (lo que Rik ve antes de la llamada) ── */

function describe(type: SessionType, f: BookingForm, extra: string[] = []): string {
  const lines = [
    `${SESSION_RULES[type].label} · ${SESSION_RULES[type].minutes} min`,
    "",
    `Nombre: ${f.fullName}`,
    `Correo: ${f.email}`,
    `WhatsApp: ${f.whatsapp}`,
    `Negocio: ${f.businessName}`,
    f.website ? `Sitio / redes: ${f.website}` : null,
    `Giro: ${f.industry}`,
    `Equipo: ${f.teamSize}`,
    `Facturación mensual: ${f.revenue}`,
    type === "power" ? `Dónde se le va el tiempo: ${f.timeDrains.join(", ")}` : null,
    type === "power" ? `Herramientas que usan hoy: ${f.tools}` : null,
    "",
    "Qué quiere resolver:",
    f.goal,
    ...(extra.length ? ["", ...extra] : []),
    "",
    `Agendado desde ${SITE.url}`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

function endIso(type: SessionType, startIso: string) {
  return new Date(Date.parse(startIso) + SESSION_RULES[type].minutes * 60_000).toISOString();
}

/* ── Reservas ────────────────────────────────────────────────── */

export type ReservationResult =
  | { kind: "confirmed"; when: string; meetLink: string | null }
  | { kind: "checkout"; url: string };

/** baseUrl: dominio al que Stripe regresa al cliente (el público, o la URL de prueba desde donde se reservó). */
export async function reserve(
  type: SessionType,
  form: BookingForm,
  startIso: string,
  origin: string | null,
  baseUrl: string = SITE.url,
): Promise<ReservationResult> {
  await assertSlotFree(type, startIso);
  const cal = calendarFor(type);
  const props = { [P.type]: type, [P.email]: form.email.slice(0, 200), [P.name]: form.fullName.slice(0, 120) };
  const source = origin ? [`Origen: ${origin}`] : [];

  if (type === "discovery") {
    const ev = await insertEvent(cal, {
      summary: `Discovery Session · ${form.businessName} (${form.fullName})`,
      description: describe(type, form, source),
      startIso,
      endIso: endIso(type, startIso),
      attendeeEmail: form.email,
      withMeet: true,
      privateProps: { ...props, [P.state]: "confirmada" },
    });
    return { kind: "confirmed", when: formatSlotEs(startIso), meetLink: ev.hangoutLink ?? null };
  }

  // Power Session: se aparta el horario (sin invitar al cliente) mientras paga.
  const hold = await insertEvent(cal, {
    summary: `[Apartado · pago pendiente] Power Session · ${form.businessName}`,
    description: describe(type, form, source),
    startIso,
    endIso: endIso(type, startIso),
    privateProps: { ...props, [P.state]: "pendiente" },
  });

  try {
    const stripe = await stripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: form.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: POWER_CURRENCY,
            unit_amount: POWER_PRICE_CENTS,
            product_data: {
              name: "Power Session · 90 min 1:1 con Rik Landeros",
              description: formatSlotEs(startIso) + " (hora del centro de México)",
            },
          },
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60,
      metadata: { rl_event: hold.id, rl_tipo: "power", rl_inicio: startIso },
      payment_intent_data: { description: `Power Session · ${form.businessName} · ${formatSlotEs(startIso)}` },
      success_url: `${baseUrl}/agendar/confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/agendar/power-session?pago=cancelado&apartado=${encodeURIComponent(hold.id)}`,
      locale: "es-419",
    });
    await patchEvent(cal, hold.id, {
      summary: `[Apartado · pago pendiente] Power Session · ${form.businessName}`,
      description: describe(type, form, source),
      startIso,
      endIso: endIso(type, startIso),
      privateProps: { ...props, [P.state]: "pendiente", [P.stripe]: session.id },
    });
    if (!session.url) throw new Error("Stripe no devolvió URL de pago");
    return { kind: "checkout", url: session.url };
  } catch (e) {
    await deleteEvent(cal, hold.id).catch(() => {});
    throw e;
  }
}

/** Convierte un apartado pagado en la cita real: invita al cliente y crea el Google Meet. Idempotente. */
export async function confirmPower(eventId: string): Promise<{ when: string; meetLink: string | null }> {
  const cal = calendarFor("power");
  const ev = await getEvent(cal, eventId);
  const props = ev.extendedProperties?.private ?? {};
  const startIso = ev.start?.dateTime ? new Date(ev.start.dateTime).toISOString() : "";
  if (props[P.state] === "confirmada") return { when: formatSlotEs(startIso), meetLink: ev.hangoutLink ?? null };
  const desc = await getDescription(cal, eventId);
  const name = props[P.name] ?? "";
  const business = (ev.summary ?? "").split("Power Session · ")[1] ?? name;
  const updated = await patchEvent(cal, eventId, {
    summary: `Power Session · ${business} (${name})`,
    description: desc.replace(/\n\nAgendado desde/, "\n\nPago confirmado en Stripe.\n\nAgendado desde"),
    startIso,
    endIso: ev.end?.dateTime ? new Date(ev.end.dateTime).toISOString() : endIso("power", startIso),
    attendeeEmail: props[P.email],
    withMeet: true,
    privateProps: { ...props, [P.state]: "confirmada" },
  });
  return { when: formatSlotEs(startIso), meetLink: updated.hangoutLink ?? null };
}

async function getDescription(cal: string, eventId: string): Promise<string> {
  const ev = (await getEvent(cal, eventId)) as CalEvent & { description?: string };
  return ev.description ?? "";
}

/** Página de éxito de Stripe: verifica el pago con Stripe (no con la URL) y confirma la cita. */
export async function confirmFromCheckout(sessionId: string) {
  const stripe = await stripeClient();
  const s = await stripe.checkout.sessions.retrieve(sessionId);
  const eventId = s.metadata?.rl_event;
  if (!eventId) throw new Error("Pago sin cita asociada");
  if (s.payment_status !== "paid") return { paid: false as const };
  const r = await confirmPower(eventId);
  return { paid: true as const, ...r, email: s.customer_details?.email ?? s.customer_email ?? null };
}

/** Libera un apartado si el cliente canceló en Stripe (solo si sigue pendiente y su pago no se completó). */
export async function releaseHold(eventId: string) {
  const cal = calendarFor("power");
  const ev = await getEvent(cal, eventId).catch(() => null);
  const props = ev?.extendedProperties?.private;
  if (!ev || props?.[P.state] !== "pendiente") return;
  if (props[P.stripe]) {
    const stripe = await stripeClient();
    const s = await stripe.checkout.sessions.retrieve(props[P.stripe]);
    if (s.payment_status === "paid") return void (await confirmPower(eventId));
    if (s.status === "open") await stripe.checkout.sessions.expire(s.id).catch(() => {});
  }
  await deleteEvent(cal, eventId);
}

/** Tarea periódica: confirma apartados pagados (por si el cliente cerró la pestaña) y libera los vencidos. */
export async function sweepHolds(now = new Date()) {
  const cal = calendarFor("power");
  const events = await listEvents(cal, {
    timeMin: new Date(now.getTime() - 86400_000).toISOString(),
    timeMax: new Date(now.getTime() + 21 * 86400_000).toISOString(),
    privateProps: { [P.state]: "pendiente" },
  });
  const stripe = events.length ? await stripeClient() : null;
  const result = { revisados: events.length, confirmados: 0, liberados: 0 };
  for (const ev of events) {
    const sid = ev.extendedProperties?.private?.[P.stripe];
    if (!sid || !stripe) {
      await deleteEvent(cal, ev.id);
      result.liberados++;
      continue;
    }
    const s = await stripe.checkout.sessions.retrieve(sid);
    if (s.payment_status === "paid") {
      await confirmPower(ev.id);
      result.confirmados++;
    } else if (s.status === "expired" || (s.status === "open" && s.expires_at * 1000 < now.getTime())) {
      // Stripe marca las sesiones vencidas con retraso: si ya pasó su hora, se vence aquí mismo.
      if (s.status === "open") await stripe.checkout.sessions.expire(s.id).catch(() => {});
      await deleteEvent(cal, ev.id);
      result.liberados++;
    }
  }
  return result;
}
