import { NextResponse, type NextRequest } from "next/server";
import { reserve, SlotTakenError } from "@/lib/agenda/booking.server";
import { isAdminHost } from "@/lib/agenda/connect.server";
import { SITE } from "@/lib/site";
import { EMPTY_FORM, validateForm, type BookingForm, type SessionType } from "@/lib/agenda/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "");
const text = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max) : "");

/** POST /api/agenda/reservar → Discovery: cita confirmada. Power: URL de pago en Stripe. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }
  // Bots: campo trampa lleno o envío instantáneo.
  if (str(body.website_url, 200) || (typeof body.elapsed_ms === "number" && body.elapsed_ms < 2500)) {
    return NextResponse.json({ ok: false, error: "No pudimos procesar la solicitud." }, { status: 400 });
  }
  const type = body.tipo as SessionType;
  if (type !== "power" && type !== "discovery") return NextResponse.json({ ok: false, error: "Tipo inválido." }, { status: 400 });

  const raw = (body.form ?? {}) as Record<string, unknown>;
  const form: BookingForm = {
    ...EMPTY_FORM,
    fullName: str(raw.fullName, 120),
    email: str(raw.email, 200).toLowerCase(),
    whatsapp: str(raw.whatsapp, 30),
    businessName: str(raw.businessName, 150),
    website: str(raw.website, 200),
    industry: str(raw.industry, 60),
    teamSize: str(raw.teamSize, 30),
    revenue: str(raw.revenue, 60),
    timeDrains: Array.isArray(raw.timeDrains) ? raw.timeDrains.map((d) => str(d, 60)).slice(0, 5) : [],
    tools: text(raw.tools, 300),
    goal: text(raw.goal, 1000),
  };
  const errors = validateForm(type, form);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, error: "Revisa los campos marcados.", errors }, { status: 422 });

  const start = str(body.start, 40);
  if (!start || Number.isNaN(Date.parse(start))) return NextResponse.json({ ok: false, error: "Elige un horario." }, { status: 422 });

  try {
    // Las reservas hechas desde una URL de prueba de Vercel regresan ahí después de Stripe; las demás, al dominio público.
    const host = req.headers.get("host");
    const baseUrl = isAdminHost(host) ? `https://${host}` : SITE.url;
    const result = await reserve(type, form, new Date(start).toISOString(), str(body.origen, 80) || null, baseUrl);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    if (e instanceof SlotTakenError) return NextResponse.json({ ok: false, error: e.message, slotTaken: true }, { status: 409 });
    console.error("[agenda] reservar:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { ok: false, error: "No pude completar la reserva. Inténtalo de nuevo o escríbeme a hola@riklanderos.com y te agendo yo." },
      { status: 503 },
    );
  }
}
