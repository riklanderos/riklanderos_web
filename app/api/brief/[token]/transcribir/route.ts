import { NextResponse, type NextRequest } from "next/server";
import { BriefError, briefByToken, transcribeAudio } from "@/lib/brief/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Transcribe un audio ya subido. Si falla, el audio queda guardado igual y Rik lo escucha. */
export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  try {
    const brief = await briefByToken((await ctx.params).token);
    if (!brief) return NextResponse.json({ ok: false, error: "Este link no es válido." }, { status: 404 });
    const body = (await req.json().catch(() => ({}))) as { path?: unknown };
    return NextResponse.json({ ok: true, text: await transcribeAudio(brief, body.path) });
  } catch (e) {
    if (e instanceof BriefError) return NextResponse.json({ ok: false, error: e.message }, { status: e.status });
    console.error("[brief] transcribir:", e instanceof Error ? e.message : "error");
    return NextResponse.json({ ok: false, error: "No pude transcribir; tu audio sí quedó guardado." }, { status: 502 });
  }
}
