import { NextResponse, type NextRequest } from "next/server";
import { availability } from "@/lib/agenda/booking.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/agenda/disponibilidad?tipo=power|discovery → próximos 5 días hábiles con sus horarios libres. */
export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get("tipo");
  if (tipo !== "power" && tipo !== "discovery") return NextResponse.json({ ok: false, error: "Tipo inválido" }, { status: 400 });
  try {
    const days = await availability(tipo);
    return NextResponse.json({ ok: true, days }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("[agenda] disponibilidad:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { ok: false, error: "No pude leer la agenda en este momento. Inténtalo en unos minutos o escríbeme a hola@riklanderos.com." },
      { status: 503 },
    );
  }
}
