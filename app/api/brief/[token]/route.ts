import { NextResponse, type NextRequest } from "next/server";
import { BriefError, briefByToken, saveAnswers } from "@/lib/brief/server";
import { missingRequired, type BriefAnswers } from "@/lib/brief/questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ token: string }> };

/** PATCH: autoguardado. POST: envío final (valida lo obligatorio). */
async function handle(req: NextRequest, ctx: Ctx, submit: boolean) {
  try {
    const brief = await briefByToken((await ctx.params).token);
    if (!brief) return NextResponse.json({ ok: false, error: "Este link no es válido." }, { status: 404 });
    const body = (await req.json().catch(() => null)) as { answers?: unknown } | null;
    if (!body?.answers) return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
    if (submit) {
      const missing = missingRequired(body.answers as BriefAnswers);
      if (missing.length) return NextResponse.json({ ok: false, error: "Faltan respuestas.", missing: missing.map((q) => q.id) }, { status: 422 });
    }
    return NextResponse.json({ ok: true, ...(await saveAnswers(brief, body.answers, submit)) });
  } catch (e) {
    const status = e instanceof BriefError ? e.status : 500;
    console.error("[brief] guardar:", e instanceof Error ? e.message : "error");
    return NextResponse.json({ ok: false, error: "No pude guardar. Revisa tu conexión e inténtalo de nuevo." }, { status });
  }
}

export const PATCH = (req: NextRequest, ctx: Ctx) => handle(req, ctx, false);
export const POST = (req: NextRequest, ctx: Ctx) => handle(req, ctx, true);
