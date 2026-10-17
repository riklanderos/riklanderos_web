import { NextResponse, type NextRequest } from "next/server";
import { BriefError, briefByToken, uploadUrl } from "@/lib/brief/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Devuelve una URL firmada para subir un archivo o audio directo a Supabase Storage. */
export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  try {
    const brief = await briefByToken((await ctx.params).token);
    if (!brief) return NextResponse.json({ ok: false, error: "Este link no es válido." }, { status: 404 });
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json({ ok: true, ...(await uploadUrl(brief, body as never)) });
  } catch (e) {
    if (e instanceof BriefError) return NextResponse.json({ ok: false, error: e.message }, { status: e.status });
    console.error("[brief] subir:", e instanceof Error ? e.message : "error");
    return NextResponse.json({ ok: false, error: "No pude preparar la subida." }, { status: 500 });
  }
}
