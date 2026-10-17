"use client";

import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import {
  ACCEPT_FILES,
  MAX_AUDIO_SECONDS,
  MAX_FILE_MB,
  MAX_FILES_PER_FLOOR,
  STEPS,
  missingRequired,
  progress,
  type AudioRef,
  type BriefAnswers,
  type ChipsQ,
  type FileRef,
  type Floor,
  type Question,
  type ScaleQ,
  type ShortQ,
  type VoiceAnswer,
  type VoiceQ,
} from "@/lib/brief/questions";
import { track } from "@/lib/analytics";
import { useSafeReducedMotion } from "../motion";
import { Logo } from "../Logo";
import { Arrow, btn } from "../ui";

const EASE = [0.22, 1, 0.36, 1] as const;
type Save = "idle" | "saving" | "saved" | "error";
/** -1 bienvenida · 0..7 pisos · 8 revisión · 9 enviado */
type Step = number;
const REVIEW = STEPS.length;
const DONE = STEPS.length + 1;

type Props = {
  token: string;
  initial: BriefAnswers;
  transcripts: Record<string, string>;
  firstName: string;
  business: string;
  when: string | null;
  submitted: boolean;
};

export function BriefFlow({ token, initial, transcripts: initialTranscripts, firstName, business, when, submitted }: Props) {
  const reduce = useSafeReducedMotion();
  const [step, setStep] = useState<Step>(submitted ? DONE : -1);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<BriefAnswers>(initial);
  const [transcripts, setTranscripts] = useState(initialTranscripts);
  const [save, setSave] = useState<Save>("idle");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const dirty = useRef(false);
  const latest = useRef(answers);
  latest.current = answers;

  const persist = useCallback(async () => {
    if (!dirty.current) return;
    dirty.current = false;
    setSave("saving");
    try {
      const r = await fetch(`/api/brief/${token}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers: latest.current }),
        keepalive: true,
      });
      if (!r.ok) throw new Error();
      setSave((s) => (dirty.current ? s : "saved"));
    } catch {
      dirty.current = true;
      setSave("error");
    }
  }, [token]);

  // Autoguardado con pausa corta; reintento si se cayó la conexión.
  useEffect(() => {
    if (!dirty.current) return;
    const t = setTimeout(() => void persist(), save === "error" ? 4000 : 900);
    return () => clearTimeout(t);
  }, [answers, persist, save]);

  useEffect(() => {
    const flush = () => {
      if (dirty.current) void persist();
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [persist]);

  const update = useCallback((fn: (a: BriefAnswers) => BriefAnswers) => {
    dirty.current = true;
    setAnswers(fn);
  }, []);
  const setValue = useCallback(
    (id: string, v: BriefAnswers["values"][string] | undefined) =>
      update((a) => {
        const values = { ...a.values };
        if (v === undefined) delete values[id];
        else values[id] = v;
        return { ...a, values };
      }),
    [update],
  );
  const setFiles = useCallback((floor: string, fn: (l: FileRef[]) => FileRef[]) => update((a) => ({ ...a, files: { ...a.files, [floor]: fn(a.files[floor] ?? []) } })), [update]);

  function go(next: Step) {
    setDir(next > step ? 1 : -1);
    setStep(next);
    void persist();
    if (next >= 0 && next < STEPS.length) track("brief_step", { piso: STEPS[next].id });
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  }

  async function submit() {
    const missing = missingRequired(latest.current);
    if (missing.length) {
      setSendError(`Te falta: ${missing.map((q) => `«${q.label}»`).join(" y ")}. Puedes contestar con un audio corto.`);
      return;
    }
    setSending(true);
    setSendError(null);
    try {
      const r = await fetch(`/api/brief/${token}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers: latest.current }),
      });
      if (!r.ok) throw new Error();
      dirty.current = false;
      setSave("saved");
      track("brief_submit", {});
      go(DONE);
    } catch {
      setSendError("No pude enviarlo. Revisa tu conexión e inténtalo de nuevo; tus respuestas están guardadas.");
    } finally {
      setSending(false);
    }
  }

  const pct = Math.round(progress(answers) * 100);
  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 60, filter: "blur(6px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -60, filter: "blur(6px)" }),
  };

  return (
    <div className="relative min-h-[100svh]">
      {step >= 0 && step <= REVIEW ? <TopBar step={step} pct={pct} save={save} onJump={go} /> : null}

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={step}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
        >
          {step === -1 ? (
            <Welcome firstName={firstName} business={business} when={when} started={pct > 0} onStart={() => go(0)} />
          ) : step === DONE ? (
            <Done firstName={firstName} when={when} onEdit={() => go(0)} />
          ) : step === REVIEW ? (
            <Review answers={answers} onJump={go} onBack={() => go(REVIEW - 1)} onSubmit={() => void submit()} sending={sending} error={sendError} />
          ) : (
            <FloorScreen
              floor={STEPS[step]}
              index={step}
              answers={answers}
              transcripts={transcripts}
              token={token}
              setValue={setValue}
              setFiles={setFiles}
              onTranscript={(path, text) => setTranscripts((t) => ({ ...t, [path]: text }))}
              onBack={() => go(step === 0 ? -1 : step - 1)}
              onNext={() => go(step + 1)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Barra superior: avance por piso + estado de guardado ────── */

function TopBar({ step, pct, save, onJump }: { step: number; pct: number; save: Save; onJump: (s: number) => void }) {
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="container-x flex items-center gap-4 py-3">
        <Logo variant="iso" className="h-6 w-auto shrink-0 text-accent" />
        <ol className="flex flex-1 gap-1.5" aria-label="Pisos del brief">
          {STEPS.map((f, i) => (
            <li key={f.id} className="flex-1">
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-current={i === step ? "step" : undefined}
                aria-label={`Piso ${f.n}: ${f.title}`}
                className="group block w-full py-2"
              >
                <span className={clsx("block h-1 rounded-full transition-colors duration-300", i < step ? "bg-fg" : i === step ? "bg-accent" : "bg-line-strong group-hover:bg-muted")} />
              </button>
            </li>
          ))}
        </ol>
        <span className="t-mono hidden w-10 text-right text-[11px] text-muted sm:block">{pct}%</span>
        <span
          role="status"
          className={clsx("t-mono w-[92px] text-right text-[10px] uppercase tracking-[0.12em]", save === "error" ? "text-accent-text" : "text-muted")}
        >
          {save === "saving" ? "Guardando…" : save === "saved" ? "✓ Guardado" : save === "error" ? "Sin conexión" : ""}
        </span>
      </div>
    </div>
  );
}

/* ── Bienvenida ───────────────────────────────────────────────── */

function Welcome({ firstName, business, when, started, onStart }: { firstName: string; business: string; when: string | null; started: boolean; onStart: () => void }) {
  const reduce = useSafeReducedMotion();
  const enter = (d: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.8, ease: EASE, delay: reduce ? 0 : d },
  });
  return (
    <section className="relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-60" />
      <div className="container-x absolute inset-x-0 top-0 z-10 pt-5 lg:pt-8">
        <Logo className="h-8 w-auto text-fg" />
      </div>
      <div className="absolute inset-x-0 top-0 -z-10 h-[min(100vw,560px)] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[52%]">
        <Image src="/img/rik-glasses.webp" alt="" fill priority sizes="(min-width:1024px) 52vw, 100vw" className="object-cover [object-position:50%_25%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent lg:bg-gradient-to-r lg:from-bg lg:via-bg/20 lg:to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg/80 to-transparent" />
      </div>
      <div className="container-x relative pb-16 pt-[calc(min(100vw,560px)-4rem)] lg:pb-0 lg:pt-16">
        <div className="max-w-[600px] lg:max-w-[46%]">
          <motion.p {...enter(0.1)} className="t-eyebrow flex items-center gap-3">
            <span aria-hidden className="h-px w-6 bg-accent" />
            Brief · Power Session
          </motion.p>
          <motion.h1 {...enter(0.2)} className="mt-5 font-display text-[clamp(2.6rem,6vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.045em]">
            {firstName ? `${firstName}, ` : ""}antes de vernos, <span className="text-accent">cuéntame de {business || "tu negocio"}.</span>
          </motion.h1>
          <motion.p {...enter(0.35)} className="t-lead mt-6 text-fg/80">
            Así llego con tu operación ya leída y usamos los 90 minutos para resolver, no para preguntar. Recorremos los mismos 7 pisos de la sesión.
          </motion.p>
          {when ? (
            <motion.p {...enter(0.45)} className="mt-6 text-[15px] text-fg">
              <span className="t-mono mr-2 text-[10px] uppercase tracking-[0.16em] text-muted">Tu sesión</span>
              {when}
            </motion.p>
          ) : null}
          <motion.ul {...enter(0.55)} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["8–10 min", "en total"],
              ["🎙", "contesta con audio"],
              ["📎", "sube archivos"],
              ["✓", "se guarda solo"],
            ].map(([a, b]) => (
              <li key={b} className="rounded-[10px] border border-line bg-elev/60 px-3 py-3 backdrop-blur-sm">
                <span className="block text-[17px] font-semibold">{a}</span>
                <span className="mt-0.5 block text-[12px] text-muted">{b}</span>
              </li>
            ))}
          </motion.ul>
          <motion.div {...enter(0.7)} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button type="button" onClick={onStart} className={clsx(btn.primary, "btn-shine px-8 py-4 text-lg")}>
              {started ? "Continuar donde me quedé" : "Empezar mi brief"}
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="text-[13px] text-muted">Puedes dejarlo a medias y volver con este mismo link.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Piso ─────────────────────────────────────────────────────── */

function FloorScreen({
  floor,
  index,
  answers,
  transcripts,
  token,
  setValue,
  setFiles,
  onTranscript,
  onBack,
  onNext,
}: {
  floor: Floor;
  index: number;
  answers: BriefAnswers;
  transcripts: Record<string, string>;
  token: string;
  setValue: (id: string, v: BriefAnswers["values"][string] | undefined) => void;
  setFiles: (floor: string, fn: (l: FileRef[]) => FileRef[]) => void;
  onTranscript: (path: string, text: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const reduce = useSafeReducedMotion();
  const next = STEPS[index + 1];
  return (
    <section className="relative isolate overflow-x-clip pt-10 lg:pt-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="bg-grid mask-radial absolute inset-0 opacity-40" />
      </div>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -right-[0.06em] -top-[0.12em] -z-10 select-none font-display text-[46vw] font-bold leading-none tracking-[-0.08em] text-transparent lg:text-[28vw]"
        style={{ WebkitTextStroke: "1px rgba(229,28,30,0.22)" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0 : 1.2, ease: EASE }}
      >
        {floor.n}
      </motion.span>
      <div className="container-x max-w-[860px]">
        <p className="t-eyebrow flex items-center gap-3">
          <span className="text-accent-text">Piso {floor.n}</span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          {index + 1} de {STEPS.length}
        </p>
        <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.25rem)] font-bold leading-[0.95] tracking-[-0.045em]">{floor.title}</h2>
        <p className="t-lead mt-3">{floor.kicker}</p>

        <div className="mt-10 space-y-10">
          {floor.questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.55, ease: EASE, delay: reduce ? 0 : 0.15 + i * 0.07 }}
            >
              <QuestionField q={q} value={answers.values[q.id]} transcripts={transcripts} token={token} setValue={setValue} onTranscript={onTranscript} />
            </motion.div>
          ))}
          {floor.uploads ? (
            <FilesField
              floorId={floor.id}
              label={floor.uploads.label}
              hint={floor.uploads.hint}
              files={answers.files[floor.id] ?? []}
              token={token}
              setFiles={setFiles}
            />
          ) : null}
        </div>
      </div>

      {/* Navegación pegada abajo mientras se recorre el piso */}
      <div className="sticky bottom-0 z-30 mt-16 border-t border-line bg-bg/90 backdrop-blur-md">
        <div className="container-x flex max-w-[860px] items-center justify-between gap-3 py-3">
          <button type="button" onClick={onBack} className={clsx(btn.ghost, "!px-5 !py-3")}>
            Atrás
          </button>
          <button type="button" onClick={onNext} className={clsx(btn.primary, "!py-3")}>
            {next ? (
              <>
                <span className="hidden sm:inline">Siguiente:</span> {next.title}
              </>
            ) : (
              "Revisar y enviar"
            )}
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <p className="mb-3.5 text-[17px] font-medium leading-snug text-fg">
      {children}
      {required ? <span className="ml-2 align-middle t-mono text-[10px] uppercase tracking-[0.14em] text-accent-text">Clave</span> : null}
    </p>
  );
}

function QuestionField({
  q,
  value,
  transcripts,
  token,
  setValue,
  onTranscript,
}: {
  q: Question;
  value: BriefAnswers["values"][string] | undefined;
  transcripts: Record<string, string>;
  token: string;
  setValue: (id: string, v: BriefAnswers["values"][string] | undefined) => void;
  onTranscript: (path: string, text: string) => void;
}) {
  if (q.kind === "chips") return <ChipsField q={q} value={value as string | string[] | undefined} onChange={(v) => setValue(q.id, v)} />;
  if (q.kind === "scale") return <ScaleField q={q} value={value as number | undefined} onChange={(v) => setValue(q.id, v)} />;
  if (q.kind === "short") return <ShortField q={q} value={(value as string) ?? ""} onChange={(v) => setValue(q.id, v || undefined)} />;
  return <VoiceField q={q} value={(value as VoiceAnswer) ?? {}} transcripts={transcripts} token={token} onChange={(v) => setValue(q.id, v)} onTranscript={onTranscript} />;
}

function ChipsField({ q, value, onChange }: { q: ChipsQ; value: string | string[] | undefined; onChange: (v: string | string[] | undefined) => void }) {
  const selected = new Set(Array.isArray(value) ? value : value ? [value] : []);
  return (
    <fieldset>
      <legend className="contents">
        <Label>
          {q.label}
          {q.multi ? <span className="ml-2 text-[13px] font-normal text-muted">(elige varias)</span> : null}
        </Label>
      </legend>
      <div className="flex flex-wrap gap-2">
        {q.options.map((o) => {
          const on = selected.has(o);
          return (
            <motion.button
              key={o}
              type="button"
              whileTap={{ scale: 0.95 }}
              aria-pressed={on}
              onClick={() => {
                if (q.multi) {
                  const next = on ? [...selected].filter((x) => x !== o) : [...selected, o];
                  onChange(next.length ? next : undefined);
                } else onChange(on ? undefined : o);
              }}
              className={clsx(
                "rounded-full border px-4 py-2.5 text-[15px] transition-[background,border-color,color] duration-200",
                on ? "border-accent bg-accent text-white shadow-[0_0_24px_-8px_var(--accent)]" : "border-line-input text-fg hover:border-fg",
              )}
            >
              {on && q.multi ? "✓ " : ""}
              {o}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ScaleField({ q, value, onChange }: { q: ScaleQ; value: number | undefined; onChange: (v: number | undefined) => void }) {
  return (
    <fieldset>
      <legend className="contents">
        <Label>{q.label}</Label>
      </legend>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const on = value === n;
          return (
            <motion.button
              key={n}
              type="button"
              whileTap={{ scale: 0.94 }}
              aria-pressed={on}
              aria-label={`${n} de 5`}
              onClick={() => onChange(on ? undefined : n)}
              className={clsx(
                "h-14 rounded-[10px] border font-display text-[1.5rem] font-bold transition-colors duration-200",
                on ? "border-accent bg-accent text-white" : value && n < value ? "border-accent/40 bg-accent/10 text-fg" : "border-line-input hover:border-fg",
              )}
            >
              {n}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-muted">
        <span>{q.low}</span>
        <span>{q.high}</span>
      </div>
    </fieldset>
  );
}

const inputCls =
  "block w-full !rounded-[10px] border border-line-input bg-bg px-4 py-3.5 text-[16px] leading-snug text-fg placeholder:text-muted transition-colors duration-200 hover:border-fg focus:border-accent-soft";

function ShortField({ q, value, onChange }: { q: ShortQ; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <Label>{q.label}</Label>
      {q.multiline ? (
        <textarea rows={3} className={clsx(inputCls, "resize-y")} placeholder={q.placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputCls} placeholder={q.placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

/* ── Respuesta con texto o audio ─────────────────────────────── */

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const m of ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus", "audio/webm"]) if (MediaRecorder.isTypeSupported(m)) return m;
  return "";
}
const extFor = (mime: string) => (mime.includes("mp4") ? "m4a" : mime.includes("ogg") ? "ogg" : "webm");
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Sube un Blob a Supabase con URL firmada pedida al servidor. */
async function uploadBlob(token: string, blob: Blob, name: string, kind: "audio" | "archivo"): Promise<string> {
  const mime = (blob.type || "application/octet-stream").split(";")[0];
  const r = await fetch(`/api/brief/${token}/subir`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, size: blob.size, mime, kind }),
  });
  const j = (await r.json()) as { ok: boolean; path?: string; url?: string; error?: string };
  if (!j.ok || !j.url || !j.path) throw new Error(j.error || "No pude preparar la subida.");
  const put = await fetch(j.url, { method: "PUT", headers: { "content-type": mime, "x-upsert": "false" }, body: blob });
  if (!put.ok) throw new Error(put.status === 413 ? `El archivo pesa más de ${MAX_FILE_MB} MB.` : "No se pudo subir. Inténtalo de nuevo.");
  return j.path;
}

type RecState = { kind: "idle" } | { kind: "recording"; seconds: number } | { kind: "uploading" } | { kind: "error"; message: string };

function VoiceField({
  q,
  value,
  transcripts,
  token,
  onChange,
  onTranscript,
}: {
  q: VoiceQ;
  value: VoiceAnswer;
  transcripts: Record<string, string>;
  token: string;
  onChange: (v: VoiceAnswer | undefined) => void;
  onTranscript: (path: string, text: string) => void;
}) {
  const [rec, setRec] = useState<RecState>({ kind: "idle" });
  const [transcribing, setTranscribing] = useState(false);
  const [mode, setMode] = useState<"audio" | "texto">(value.text && !value.audio ? "texto" : "audio");
  const [levels, setLevels] = useState<number[]>(() => Array(28).fill(0.08));
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const raf = useRef(0);
  const started = useRef(0);
  const valueRef = useRef(value);
  valueRef.current = value;
  const supported = typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia && !!pickMime();

  const stopTracks = () => {
    cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  };
  useEffect(() => () => stopTracks(), []);

  const transcribeNow = useCallback(
    async (path: string) => {
      setTranscribing(true);
      try {
        const r = await fetch(`/api/brief/${token}/transcribir`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ path }),
        });
        const j = (await r.json()) as { ok: boolean; text?: string };
        if (j.ok && j.text) onTranscript(path, j.text);
      } catch {
        /* el audio queda guardado aunque no haya transcripción */
      } finally {
        setTranscribing(false);
      }
    },
    [token, onTranscript],
  );

  async function start() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      stream.current = s;
      const mime = pickMime();
      const mr = new MediaRecorder(s, mime ? { mimeType: mime, audioBitsPerSecond: 64000 } : undefined);
      const chunks: BlobPart[] = [];
      mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      mr.onstop = async () => {
        stopTracks();
        const seconds = Math.round((Date.now() - started.current) / 1000);
        const type = (mr.mimeType || mime || "audio/webm").split(";")[0];
        const blob = new Blob(chunks, { type });
        if (seconds < 1 || blob.size < 1000) return setRec({ kind: "idle" });
        setRec({ kind: "uploading" });
        setLocalUrl(URL.createObjectURL(blob));
        try {
          const path = await uploadBlob(token, blob, `respuesta-${q.id}.${extFor(type)}`, "audio");
          const audio: AudioRef = { path, seconds, mime: type };
          onChange({ ...valueRef.current, audio });
          setRec({ kind: "idle" });
          track("brief_audio", { pregunta: q.id, segundos: seconds });
          void transcribeNow(path);
        } catch (e) {
          setRec({ kind: "error", message: e instanceof Error ? e.message : "No se pudo subir el audio." });
        }
      };
      // Ondas en vivo
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(s);
      const an = ctx.createAnalyser();
      an.fftSize = 64;
      src.connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      const loop = () => {
        an.getByteFrequencyData(buf);
        setLevels(Array.from({ length: 28 }, (_, i) => Math.max(0.08, (buf[(i % (buf.length - 2)) + 1] ?? 0) / 255)));
        const secs = (Date.now() - started.current) / 1000;
        setRec({ kind: "recording", seconds: secs });
        if (secs >= MAX_AUDIO_SECONDS) {
          mr.stop();
          void ctx.close();
          return;
        }
        raf.current = requestAnimationFrame(loop);
      };
      mr.addEventListener("stop", () => void ctx.close().catch(() => {}));
      recorder.current = mr;
      started.current = Date.now();
      mr.start(1000);
      loop();
    } catch {
      stopTracks();
      setRec({ kind: "error", message: "No pude usar tu micrófono. Revisa el permiso del navegador o escribe tu respuesta." });
    }
  }

  const stop = () => recorder.current?.state === "recording" && recorder.current.stop();
  const transcript = value.audio ? transcripts[value.audio.path] : undefined;

  return (
    <div>
      <Label required={q.required}>{q.label}</Label>
      <div className="overflow-hidden rounded-[14px] border border-line bg-elev">
        <div className="flex border-b border-line" role="tablist" aria-label="Forma de responder">
          {(["audio", "texto"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={clsx(
                "relative flex-1 py-3 text-[14px] font-medium transition-colors",
                mode === m ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {m === "audio" ? "🎙 Grabar audio" : "⌨ Escribir"}
              {mode === m ? <motion.span layoutId={`tab-${q.id}`} className="absolute inset-x-0 bottom-0 h-[2px] bg-accent" /> : null}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-5">
          {mode === "texto" ? (
            <textarea
              rows={4}
              className={clsx(inputCls, "resize-y bg-bg")}
              placeholder={q.hint ?? "Escribe con tus palabras, sin formalidades."}
              value={value.text ?? ""}
              onChange={(e) => {
                const text = e.target.value;
                const next: VoiceAnswer = { ...value, text };
                if (!text) delete next.text;
                onChange(next.text || next.audio ? next : undefined);
              }}
            />
          ) : rec.kind === "recording" ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={stop}
                aria-label="Detener grabación"
                className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent text-white"
              >
                <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
                <span aria-hidden className="relative h-5 w-5 rounded-[4px] bg-white" />
              </button>
              <div className="flex h-12 flex-1 items-center gap-[3px]" aria-hidden>
                {levels.map((l, i) => (
                  <span key={i} className="w-full rounded-full bg-accent" style={{ height: `${Math.round(l * 100)}%`, opacity: 0.4 + l * 0.6 }} />
                ))}
              </div>
              <span className="t-mono w-20 text-right text-[13px] text-fg">
                {mmss(rec.seconds)}
                <span className="block text-[10px] text-muted">máx {mmss(MAX_AUDIO_SECONDS)}</span>
              </span>
            </div>
          ) : value.audio ? (
            <div>
              <AudioPreview src={localUrl} audio={value.audio} />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-muted">
                  {transcribing ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner /> Transcribiendo…
                    </span>
                  ) : transcript ? (
                    "✓ Audio guardado y transcrito"
                  ) : (
                    "✓ Audio guardado"
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const next = { ...value };
                    delete next.audio;
                    setLocalUrl(null);
                    onChange(next.text ? next : undefined);
                  }}
                  className="text-[13px] text-muted underline underline-offset-4 hover:text-fg"
                >
                  Borrar y grabar otro
                </button>
              </div>
              {transcript ? <p className="mt-3 border-l-2 border-accent pl-3 text-[14px] italic leading-relaxed text-fg/80">“{transcript}”</p> : null}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2 text-center sm:flex-row sm:text-left">
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => (supported ? void start() : setMode("texto"))}
                disabled={rec.kind === "uploading"}
                aria-label="Grabar respuesta"
                className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent text-white shadow-[0_0_40px_-8px_var(--accent)] disabled:opacity-60"
              >
                {rec.kind === "uploading" ? <Spinner /> : <MicIcon />}
              </motion.button>
              <div>
                <p className="text-[15px] text-fg">{rec.kind === "uploading" ? "Subiendo tu audio…" : "Toca y cuéntamelo como si me mandaras un WhatsApp."}</p>
                <p className="mt-1 text-[13px] text-muted">
                  {rec.kind === "error" ? <span className="text-accent-text">{rec.message}</span> : supported ? `Hasta ${MAX_AUDIO_SECONDS / 60} minutos. Lo transcribo automáticamente.` : "Tu navegador no permite grabar: escribe tu respuesta."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Recién grabado: reproductor con el audio local. Al volver otro día: píldora con la duración (Rik lo escucha en su panel). */
function AudioPreview({ src, audio }: { src: string | null; audio: AudioRef }) {
  if (src) return <audio controls src={src} className="h-11 w-full" />;
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-line-strong bg-bg px-4 py-3">
      <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 text-accent-text">
        <MicIcon small />
      </span>
      <div className="flex h-6 flex-1 items-center gap-[3px]" aria-hidden>
        {Array.from({ length: 32 }, (_, i) => (
          <span key={i} className="w-full rounded-full bg-fg/40" style={{ height: `${30 + Math.abs(Math.sin(i * 1.7 + audio.seconds)) * 70}%` }} />
        ))}
      </div>
      <span className="t-mono text-[12px] text-muted">{mmss(audio.seconds)}</span>
    </div>
  );
}

/* ── Archivos ─────────────────────────────────────────────────── */

type Uploading = { id: string; name: string; error?: string };

function FilesField({
  floorId,
  label,
  hint,
  files,
  token,
  setFiles,
}: {
  floorId: string;
  label: string;
  hint: string;
  files: FileRef[];
  token: string;
  setFiles: (floor: string, fn: (l: FileRef[]) => FileRef[]) => void;
}) {
  const [busy, setBusy] = useState<Uploading[]>([]);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function add(list: FileList | null) {
    if (!list) return;
    const room = MAX_FILES_PER_FLOOR - files.length - busy.length;
    for (const f of Array.from(list).slice(0, Math.max(0, room))) {
      const id = Math.random().toString(36).slice(2);
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setBusy((b) => [...b, { id, name: f.name, error: `Pesa más de ${MAX_FILE_MB} MB` }]);
        continue;
      }
      setBusy((b) => [...b, { id, name: f.name }]);
      try {
        const path = await uploadBlob(token, f, f.name, "archivo");
        setFiles(floorId, (l) => [...l, { path, name: f.name.slice(0, 160), size: f.size, mime: f.type }]);
        setBusy((b) => b.filter((x) => x.id !== id));
        track("brief_file", { piso: floorId });
      } catch (e) {
        setBusy((b) => b.map((x) => (x.id === id ? { ...x, error: e instanceof Error ? e.message : "No se pudo subir" } : x)));
      }
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    void add(e.dataTransfer.files);
  };

  return (
    <div>
      <Label>
        {label} <span className="ml-1 text-[13px] font-normal text-muted">(opcional)</span>
      </Label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={clsx(
          "rounded-[14px] border border-dashed p-5 text-center transition-colors duration-200",
          over ? "border-accent bg-accent/10" : "border-line-input hover:border-fg",
        )}
      >
        <input ref={input} type="file" multiple accept={ACCEPT_FILES} className="sr-only" onChange={(e) => {
            const el = e.currentTarget;
            void add(el.files).then(() => (el.value = ""));
          }} />
        <button type="button" onClick={() => input.current?.click()} className="mx-auto flex flex-col items-center gap-2">
          <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-[20px]">
            ＋
          </span>
          <span className="text-[15px] font-medium text-fg">Subir archivos</span>
          <span className="text-[13px] text-muted">{hint}</span>
          <span className="t-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            Imágenes · PDF · Excel · Video · hasta {MAX_FILE_MB} MB
          </span>
        </button>
      </div>
      {files.length || busy.length ? (
        <ul className="mt-3 space-y-2">
          {files.map((f) => (
            <li key={f.path} className="flex items-center gap-3 rounded-[10px] border border-line bg-elev px-4 py-2.5 text-[14px]">
              <span aria-hidden className="text-accent-text">✓</span>
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <span className="t-mono text-[11px] text-muted">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              <button
                type="button"
                aria-label={`Quitar ${f.name}`}
                onClick={() => setFiles(floorId, (l) => l.filter((x) => x.path !== f.path))}
                className="text-muted hover:text-fg"
              >
                ✕
              </button>
            </li>
          ))}
          {busy.map((b) => (
            <li key={b.id} className="flex items-center gap-3 rounded-[10px] border border-line px-4 py-2.5 text-[14px]">
              {b.error ? <span className="text-accent-text">!</span> : <Spinner />}
              <span className="min-w-0 flex-1 truncate">{b.name}</span>
              {b.error ? (
                <button type="button" onClick={() => setBusy((x) => x.filter((y) => y.id !== b.id))} className="text-[12px] text-accent-text">
                  {b.error} · ✕
                </button>
              ) : (
                <span className="text-[12px] text-muted">Subiendo…</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ── Revisión y envío ────────────────────────────────────────── */

function Review({
  answers,
  onJump,
  onBack,
  onSubmit,
  sending,
  error,
}: {
  answers: BriefAnswers;
  onJump: (s: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  sending: boolean;
  error: string | null;
}) {
  const missing = new Set(missingRequired(answers).map((q) => q.id));
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-10 lg:pt-16">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-40" />
      <div className="container-x max-w-[860px]">
        <p className="t-eyebrow">Último paso</p>
        <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.25rem)] font-bold leading-[0.95] tracking-[-0.045em]">
          Revisa y <span className="text-accent">envía.</span>
        </h2>
        <p className="t-lead mt-3">Toca cualquier piso para completarlo. Lo que dejes vacío lo platicamos en la sesión.</p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {STEPS.map((f, i) => {
            const total = f.questions.length;
            const done = f.questions.filter((q) => {
              const v = answers.values[q.id];
              if (v === undefined || v === "") return false;
              if (Array.isArray(v)) return v.length > 0;
              if (typeof v === "object") return !!(v.text?.trim() || v.audio);
              return true;
            }).length;
            const files = answers.files[f.id]?.length ?? 0;
            const lacks = f.questions.some((q) => missing.has(q.id));
            return (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className={clsx(
                    "group flex w-full items-center gap-4 rounded-[12px] border bg-elev px-4 py-4 text-left transition-colors",
                    lacks ? "border-accent/60" : "border-line hover:border-fg",
                  )}
                >
                  <span className="font-display text-[1.6rem] font-bold text-accent">{f.n}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{f.title}</span>
                    <span className={clsx("block text-[13px]", lacks ? "text-accent-text" : "text-muted")}>
                      {lacks ? "Falta la pregunta clave" : `${done} de ${total} respondidas${files ? ` · ${files} archivo${files > 1 ? "s" : ""}` : ""}`}
                    </span>
                  </span>
                  <span className="relative h-9 w-9 shrink-0">
                    <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90" aria-hidden>
                      <circle cx="18" cy="18" r="15" fill="none" stroke="var(--line-strong)" strokeWidth="3" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="3"
                        strokeDasharray={`${(done / total) * 94.2} 94.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {error ? (
          <p role="alert" className="mt-6 rounded-[10px] border border-accent/50 bg-accent/10 px-4 py-3 text-[15px]">
            {error}
          </p>
        ) : null}
        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={onBack} className={btn.ghost}>
            Atrás
          </button>
          <button type="button" disabled={sending} onClick={onSubmit} className={clsx(btn.primary, "btn-shine px-8 py-4 text-lg disabled:cursor-wait disabled:opacity-80")}>
            {sending ? <Spinner /> : null}
            {sending ? "Enviando…" : "Enviar mi brief"}
            {sending ? null : <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />}
          </button>
        </div>
      </div>
    </section>
  );
}

function Done({ firstName, when, onEdit }: { firstName: string; when: string | null; onEdit: () => void }) {
  const reduce = useSafeReducedMotion();
  return (
    <section className="relative isolate grid min-h-[80svh] place-items-center overflow-hidden px-4 py-24 text-center">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-50" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
      />
      <div className="absolute inset-x-0 top-0 flex justify-center pt-6">
        <Logo className="h-8 w-auto text-fg" />
      </div>
      <div className="max-w-[640px]">
        <motion.span
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent text-white"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 13 }}
        >
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
        <h2 className="mt-8 font-display text-[clamp(2.4rem,6vw,4rem)] font-bold leading-[0.95] tracking-[-0.045em]">
          Listo{firstName ? `, ${firstName}` : ""}. <span className="text-accent">Ya tengo tu brief.</span>
        </h2>
        <p className="t-lead mx-auto mt-5 max-w-[520px]">
          Lo reviso antes de la sesión para llegar con tu operación leída{when ? ` · ${when}` : ""}. Si se te ocurre algo más, puedes volver a este link y agregarlo.
        </p>
        <button type="button" onClick={onEdit} className={clsx(btn.ghost, "mt-10")}>
          Agregar o cambiar algo
        </button>
      </div>
    </section>
  );
}

function MicIcon({ small }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={small ? "h-4 w-4" : "h-7 w-7"} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
