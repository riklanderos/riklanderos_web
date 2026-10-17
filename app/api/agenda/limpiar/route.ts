import { NextResponse, type NextRequest } from "next/server";
import { sweepHolds } from "@/lib/agenda/booking.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tarea programada (Vercel Cron, cada 10 min): confirma apartados pagados y libera los vencidos. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, ...(await sweepHolds()) });
  } catch (e) {
    console.error("[agenda] limpiar:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
