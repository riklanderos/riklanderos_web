import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminHost } from "@/lib/agenda/connect.server";
import { formatSlotEs } from "@/lib/agenda/config";
import { briefById, briefUrl, signedDownload, transcribeAudio } from "@/lib/brief/server";
import { STEPS, type FileRef, type Question, type VoiceAnswer } from "@/lib/brief/questions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const metadata: Metadata = { title: "Brief · Administración", robots: { index: false, follow: false } };

async function retranscribe(formData: FormData) {
  "use server";
  if (!isAdminHost((await headers()).get("host"))) return;
  const id = String(formData.get("id") ?? "");
  const brief = await briefById(id);
  if (!brief) return;
  try {
    await transcribeAudio(brief, formData.get("path"));
  } catch (e) {
    console.error("[brief] retranscribir:", e instanceof Error ? e.message : "error");
  }
  revalidatePath(`/admin/briefs/${id}`);
}

/** Brief completo de un cliente: piso por piso, con audios, transcripciones y archivos. */
export default async function BriefDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!isAdminHost((await headers()).get("host"))) notFound();
  const brief = await briefById((await params).id).catch(() => null);
  if (!brief) notFound();
  const values = brief.answers?.values ?? {};
  const files = brief.answers?.files ?? {};

  // Links firmados (1 h) para audios y archivos.
  const paths = [
    ...Object.values(values).flatMap((v) => (v && typeof v === "object" && !Array.isArray(v) && (v as VoiceAnswer).audio ? [(v as VoiceAnswer).audio!.path] : [])),
    ...Object.values(files).flatMap((l) => l.map((f) => f.path)),
  ];
  const urls = new Map(await Promise.all(paths.map(async (p) => [p, await signedDownload(p)] as const)));

  return (
    <main className="container-x max-w-[980px] pb-24 pt-32">
      <Link href="/admin/briefs" className="text-[14px] text-muted hover:text-fg">
        ← Todos los briefs
      </Link>
      <p className="t-eyebrow mt-8">Brief · Power Session · {brief.status}</p>
      <h1 className="t-h2 mt-4">{brief.business || "Sin negocio"}</h1>
      <dl className="mt-6 grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2">
        <Info k="Cliente" v={brief.name} />
        <Info k="Correo" v={brief.email} />
        <Info k="Sesión" v={brief.session_start ? `${formatSlotEs(brief.session_start)} (CDMX)` : null} />
        <Info k="Enviado" v={brief.submitted_at ? new Date(brief.submitted_at).toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) : "Aún no"} />
      </dl>
      <p className="mt-4 break-all text-[13px] text-muted">
        Link del cliente: <span className="select-all font-mono">{briefUrl(brief.token)}</span>
      </p>

      {STEPS.map((f) => (
        <section key={f.id} className="mt-14 border-t border-line pt-8">
          <p className="t-eyebrow">
            <span className="text-accent-text">{f.n}</span> · {f.kicker}
          </p>
          <h2 className="t-h3 mt-3 !text-[1.9rem]">{f.title}</h2>
          <div className="mt-6 space-y-6">
            {f.questions.map((q) => (
              <AnswerRow key={q.id} q={q} value={values[q.id]} briefId={brief.id} transcripts={brief.transcripts ?? {}} urls={urls} />
            ))}
            {files[f.id]?.length ? <FileList files={files[f.id]} urls={urls} /> : null}
          </div>
        </section>
      ))}
    </main>
  );
}

function Info({ k, v }: { k: string; v: string | null }) {
  return (
    <div>
      <dt className="inline text-muted">{k}: </dt>
      <dd className="inline">{v || "—"}</dd>
    </div>
  );
}

function AnswerRow({
  q,
  value,
  briefId,
  transcripts,
  urls,
}: {
  q: Question;
  value: unknown;
  briefId: string;
  transcripts: Record<string, string>;
  urls: Map<string, string | null>;
}) {
  let body: React.ReactNode = <span className="text-muted">Sin respuesta</span>;
  if (Array.isArray(value) && value.length) {
    body = (
      <span className="flex flex-wrap gap-2">
        {value.map((v) => (
          <span key={String(v)} className="rounded-full bg-accent px-3 py-1 text-[13px] text-white">
            {String(v)}
          </span>
        ))}
      </span>
    );
  } else if (typeof value === "string" && value) {
    body = q.kind === "chips" ? <span className="rounded-full bg-accent px-3 py-1 text-[13px] text-white">{value}</span> : <span className="whitespace-pre-wrap">{value}</span>;
  } else if (typeof value === "number") {
    body = (
      <span>
        <strong className="font-display text-[1.4rem]">{value}</strong>
        <span className="text-muted"> / 5</span>
      </span>
    );
  } else if (value && typeof value === "object") {
    const v = value as VoiceAnswer;
    const t = v.audio ? transcripts[v.audio.path] : undefined;
    body = (
      <div className="space-y-3">
        {v.text ? <p className="whitespace-pre-wrap">{v.text}</p> : null}
        {v.audio ? (
          <div className="rounded-[10px] border border-line bg-elev p-4">
            {urls.get(v.audio.path) ? <audio controls preload="none" src={urls.get(v.audio.path)!} className="h-10 w-full" /> : null}
            {t ? (
              <p className="mt-3 border-l-2 border-accent pl-3 italic leading-relaxed text-fg/90">“{t}”</p>
            ) : (
              <form action={retranscribe} className="mt-3">
                <input type="hidden" name="id" value={briefId} />
                <input type="hidden" name="path" value={v.audio.path} />
                <button className="text-[13px] text-accent-text underline underline-offset-4">Sin transcripción · Transcribir ahora</button>
              </form>
            )}
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <div>
      <p className="mb-2 text-[14px] text-muted">{q.label}</p>
      <div className="text-[16px]">{body}</div>
    </div>
  );
}

function FileList({ files, urls }: { files: FileRef[]; urls: Map<string, string | null> }) {
  return (
    <div>
      <p className="mb-3 text-[14px] text-muted">Archivos</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {files.map((f) => {
          const url = urls.get(f.path);
          return (
            <li key={f.path} className="overflow-hidden rounded-[10px] border border-line bg-elev">
              {url && f.mime.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={f.name} className="h-44 w-full object-cover" />
              ) : null}
              <a href={url ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-[14px] hover:text-accent-text">
                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                <span className="t-mono text-[11px] text-muted">{(f.size / 1024 / 1024).toFixed(1)} MB ↓</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
