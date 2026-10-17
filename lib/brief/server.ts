import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { experimental_transcribe as transcribe, gateway } from "ai";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { SITE } from "@/lib/site";
import {
  EMPTY_ANSWERS,
  MAX_AUDIO_SECONDS,
  MAX_FILE_MB,
  MAX_FILES_PER_FLOOR,
  STEPS,
  type AnswerValue,
  type BriefAnswers,
  type FileRef,
} from "./questions";

export const BRIEFS_TABLE = "power_briefs";
export const BRIEFS_BUCKET = "power-briefs";
const TRANSCRIBE_MODEL = "openai/gpt-4o-mini-transcribe";

export type Brief = {
  id: string;
  token: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  status: "borrador" | "enviado";
  event_id: string;
  stripe_session_id: string | null;
  name: string | null;
  email: string | null;
  business: string | null;
  session_start: string | null;
  answers: BriefAnswers;
  transcripts: Record<string, string>;
};

export class BriefError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

function db() {
  const s = getSupabaseAdmin();
  if (!s) throw new BriefError("Supabase no configurado", 503);
  return s;
}

export const TOKEN_RE = /^[A-Za-z0-9_-]{40,64}$/;

export function briefUrl(token: string) {
  return `${SITE.url}/brief/${token}`;
}

/* ── Alta (al confirmar el pago) ──────────────────────────────── */

/** Crea el brief de una Power Session o devuelve el existente. Idempotente por event_id. No lanza. */
export async function ensureBrief(input: {
  eventId: string;
  stripeSessionId?: string | null;
  name?: string | null;
  email?: string | null;
  business?: string | null;
  sessionStart?: string | null;
}): Promise<string | null> {
  try {
    const s = db();
    const found = await s.from(BRIEFS_TABLE).select("token").eq("event_id", input.eventId).maybeSingle();
    if (found.data?.token) return found.data.token as string;
    const token = randomBytes(32).toString("base64url");
    const { data, error } = await s
      .from(BRIEFS_TABLE)
      .upsert(
        {
          token,
          event_id: input.eventId,
          stripe_session_id: input.stripeSessionId ?? null,
          name: input.name?.slice(0, 120) ?? null,
          email: input.email?.slice(0, 254) ?? null,
          business: input.business?.slice(0, 160) ?? null,
          session_start: input.sessionStart ?? null,
        },
        { onConflict: "event_id", ignoreDuplicates: true },
      )
      .select("token")
      .maybeSingle();
    if (error) throw error;
    if (data?.token) return data.token as string;
    // Otra solicitud lo creó al mismo tiempo.
    const again = await s.from(BRIEFS_TABLE).select("token").eq("event_id", input.eventId).maybeSingle();
    return (again.data?.token as string | undefined) ?? null;
  } catch (e) {
    console.error("[brief] No se creó el brief:", e instanceof Error ? e.message : "error");
    return null;
  }
}

/* ── Lectura ─────────────────────────────────────────────────── */

export async function briefByToken(token: string): Promise<Brief | null> {
  if (!TOKEN_RE.test(token)) return null;
  const { data, error } = await db().from(BRIEFS_TABLE).select("*").eq("token", token).maybeSingle();
  if (error) throw new BriefError("No pude leer el brief", 503);
  return (data as Brief | null) ?? null;
}

export async function briefById(id: string): Promise<Brief | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await db().from(BRIEFS_TABLE).select("*").eq("id", id).maybeSingle();
  return (data as Brief | null) ?? null;
}

export async function listBriefs(): Promise<Brief[]> {
  const { data, error } = await db().from(BRIEFS_TABLE).select("*").order("session_start", { ascending: false }).limit(200);
  if (error) throw new BriefError("No pude leer los briefs", 503);
  return (data as Brief[]) ?? [];
}

/* ── Guardado ────────────────────────────────────────────────── */

const QUESTION_IDS = new Map(STEPS.flatMap((f) => f.questions.map((q) => [q.id, q] as const)));
const FLOOR_IDS = new Set(STEPS.map((f) => f.id));

function cleanText(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, max) : "";
}

function ownPath(briefId: string, p: unknown): string | null {
  const s = cleanText(p, 300);
  return s.startsWith(`${briefId}/`) && !s.includes("..") ? s : null;
}

/** Normaliza lo que manda el navegador: solo preguntas y pisos conocidos, rutas del propio brief. */
export function sanitizeAnswers(briefId: string, raw: unknown): BriefAnswers {
  const out: BriefAnswers = { values: {}, files: {} };
  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const values = body.values && typeof body.values === "object" ? (body.values as Record<string, unknown>) : {};
  for (const [id, v] of Object.entries(values)) {
    const q = QUESTION_IDS.get(id);
    if (!q) continue;
    let val: AnswerValue | undefined;
    if (q.kind === "chips") {
      const opts = new Set(q.options);
      if (Array.isArray(v)) val = v.filter((x): x is string => typeof x === "string" && opts.has(x)).slice(0, q.options.length);
      else if (typeof v === "string" && opts.has(v)) val = v;
    } else if (q.kind === "scale") {
      if (typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5) val = v;
    } else if (q.kind === "short") {
      val = cleanText(v, 2000);
    } else if (q.kind === "voice" && v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      const text = cleanText(o.text, 4000);
      const a = o.audio as Record<string, unknown> | undefined;
      const path = a ? ownPath(briefId, a.path) : null;
      val = {
        ...(text ? { text } : {}),
        ...(path
          ? {
              audio: {
                path,
                seconds: Math.min(MAX_AUDIO_SECONDS + 5, Math.max(0, Math.round(Number(a!.seconds) || 0))),
                mime: cleanText(a!.mime, 80) || "audio/webm",
              },
            }
          : {}),
      };
    }
    if (val !== undefined) out.values[id] = val;
  }
  const files = body.files && typeof body.files === "object" ? (body.files as Record<string, unknown>) : {};
  for (const [floor, list] of Object.entries(files)) {
    if (!FLOOR_IDS.has(floor) || !Array.isArray(list)) continue;
    const refs: FileRef[] = [];
    for (const f of list.slice(0, MAX_FILES_PER_FLOOR)) {
      const o = f as Record<string, unknown>;
      const path = ownPath(briefId, o?.path);
      if (!path) continue;
      refs.push({ path, name: cleanText(o.name, 160) || "archivo", size: Math.max(0, Number(o.size) || 0), mime: cleanText(o.mime, 120) });
    }
    if (refs.length) out.files[floor] = refs;
  }
  return out;
}

export async function saveAnswers(brief: Brief, raw: unknown, submit: boolean) {
  // Después de enviar se puede seguir completando: se guarda igual, sin regresar a borrador.
  const answers = sanitizeAnswers(brief.id, raw);
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { answers, updated_at: now };
  if (submit) {
    patch.status = "enviado";
    patch.submitted_at = brief.submitted_at ?? now;
  }
  const { error } = await db().from(BRIEFS_TABLE).update(patch).eq("id", brief.id);
  if (error) throw new BriefError("No pude guardar", 503);
  return { savedAt: now };
}

/* ── Archivos y audios ───────────────────────────────────────── */

function safeName(name: string) {
  const base = name.normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-");
  return base.replace(/^[-.]+/, "").slice(-80) || "archivo";
}

/** URL firmada para que el navegador suba el archivo directo a Supabase (sin pasar por Vercel). */
export async function uploadUrl(brief: Brief, input: { name: unknown; size: unknown; mime: unknown; kind: unknown }) {
  const size = Number(input.size) || 0;
  if (size <= 0 || size > MAX_FILE_MB * 1024 * 1024) throw new BriefError(`El archivo pesa más de ${MAX_FILE_MB} MB.`);
  const kind = input.kind === "audio" ? "audio" : "archivo";
  const name = safeName(cleanText(input.name, 160) || (kind === "audio" ? "audio.webm" : "archivo"));
  const path = `${brief.id}/${kind}/${randomUUID().slice(0, 8)}-${name}`;
  const { data, error } = await db().storage.from(BRIEFS_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new BriefError("No pude preparar la subida", 503);
  return { path, url: data.signedUrl };
}

export async function signedDownload(path: string, seconds = 3600): Promise<string | null> {
  const { data } = await db().storage.from(BRIEFS_BUCKET).createSignedUrl(path, seconds);
  return data?.signedUrl ?? null;
}

/** Transcribe un audio del brief (AI Gateway de Vercel) y guarda el texto en `transcripts`. */
export async function transcribeAudio(brief: Brief, rawPath: unknown): Promise<string> {
  const path = ownPath(brief.id, rawPath);
  if (!path || !path.startsWith(`${brief.id}/audio/`)) throw new BriefError("Audio inválido");
  if (brief.transcripts?.[path]) return brief.transcripts[path];
  const file = await db().storage.from(BRIEFS_BUCKET).download(path);
  if (file.error || !file.data) throw new BriefError("No encontré el audio", 404);
  const audio = new Uint8Array(await file.data.arrayBuffer());
  const result = await transcribe({
    model: gateway.transcriptionModel(TRANSCRIBE_MODEL),
    audio,
    providerOptions: { openai: { language: "es" } },
    abortSignal: AbortSignal.timeout(55_000),
  });
  const text = result.text.trim();
  // Lectura y escritura del mapa completo: los audios de un mismo brief son pocos y secuenciales.
  const current = await db().from(BRIEFS_TABLE).select("transcripts").eq("id", brief.id).single();
  const transcripts = { ...((current.data?.transcripts as Record<string, string>) ?? {}), [path]: text };
  await db().from(BRIEFS_TABLE).update({ transcripts }).eq("id", brief.id);
  return text;
}

export function emptyAnswers(a: BriefAnswers | null | undefined): BriefAnswers {
  return { values: a?.values ?? EMPTY_ANSWERS.values, files: a?.files ?? EMPTY_ANSWERS.files };
}
