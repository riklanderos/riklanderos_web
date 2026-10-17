"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion, type Variants } from "motion/react";
import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { SESSIONS, SESSION_LIST, type Session, type SessionKey } from "@/lib/sessions";
import { DiscoverySessionButton } from "./DiscoverySessionButton";
import { PowerSessionButton } from "./PowerSessionButton";
import { SessionGlyph } from "./SessionGlyph";
import { VslPlayer } from "./VslPlayer";
import { CountUp, DrawPath, Reveal, SplitWords, Stagger, StaggerItem, Tilt } from "./motion";
import { Arrow, Eyebrow, btn } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ──────────────────────────────────────────────────────────────
   Piezas
   ────────────────────────────────────────────────────────────── */

/** "90 min" → { n: 90, unit: "min" }; "Sin costo" → null. */
function splitNum(v: string) {
  const m = v.match(/^(\d+)\s+(.+)$/);
  return m ? { n: Number(m[1]), unit: m[2] } : null;
}

/** Cifra con unidad chica. count=false para precios: contar desde 0 se lee como "0 USD" antes de animar. */
function Figure({ value, count = true }: { value: string; count?: boolean }) {
  const p = splitNum(value);
  if (!p) return <>{value}</>;
  return (
    <>
      {count ? <CountUp to={p.n} /> : p.n}
      <span className="ml-1.5 text-[0.5em] font-bold tracking-[-0.01em]">{p.unit}</span>
    </>
  );
}

function Diamond({ className }: { className?: string }) {
  return <span aria-hidden className={clsx("inline-block h-1.5 w-1.5 shrink-0 rotate-45", className)} />;
}

function PlayIcon() {
  return (
    <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-current/30">
      <svg viewBox="0 0 24 24" className="ml-0.5 h-3 w-3" fill="currentColor">
        <path d="M7 4.5v15l12-7.5z" />
      </svg>
    </span>
  );
}

function SessionButton({
  s,
  section,
  label,
  variant = "primary",
  className,
}: {
  s: Session;
  section: string;
  label?: string;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const B = s.key === "power" ? PowerSessionButton : DiscoverySessionButton;
  return (
    <B
      section={section}
      label={label ?? s.cta}
      variant={variant}
      className={clsx(
        // Discovery lleva su propio acento (crema) para distinguirse de la Power Session a primera vista.
        s.key === "discovery" && variant === "primary" && "!bg-paper !text-paper-fg hover:!bg-fg",
        className,
      )}
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   Tarjeta de sesión
   ────────────────────────────────────────────────────────────── */

function SessionCard({
  s,
  section,
  full,
  onVideo,
}: {
  s: Session;
  section: string;
  full: boolean;
  onVideo: (key: SessionKey, trigger: HTMLElement) => void;
}) {
  const power = s.key === "power";
  const titleId = useId();
  const notes = s.footnote.split(" · ");
  const t = power
    ? {
        card: "bg-paper text-paper-fg",
        muted: "text-paper-muted",
        line: "border-paper-fg/15",
        kicker: "text-accent-paper",
        diamond: "bg-accent",
        link: "text-paper-fg decoration-paper-fg/30 hover:decoration-paper-fg",
      }
    : {
        card: "border border-line-strong bg-elev text-fg",
        muted: "text-muted",
        line: "border-line",
        kicker: "text-paper",
        diamond: "bg-paper",
        link: "text-fg decoration-fg/30 hover:decoration-fg",
      };

  return (
    <Tilt max={3} className="h-full">
      <article aria-labelledby={titleId} className={clsx("relative h-full rounded-[22px]", power && "border-sheen")}>
        <div className={clsx("spotlight relative isolate flex h-full flex-col overflow-hidden rounded-[22px] p-6 sm:p-9 lg:p-10", t.card)}>
          {/* Fondo propio de cada tarjeta */}
          {power ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(110%_70%_at_100%_0%,var(--paper-soft),transparent_65%)]"
            />
          ) : (
            <>
              <div
                aria-hidden
                className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(90%_70%_at_100%_0%,#000,transparent_75%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full opacity-[0.09] blur-[80px]"
                style={{ background: "var(--paper)" }}
              />
            </>
          )}

          <div className="relative z-[1] flex h-full flex-col">
            <div className="flex items-start justify-between gap-6">
              <p className={clsx("t-mono flex items-center gap-2.5 pt-1 text-[11px] font-medium uppercase tracking-[0.16em]", t.kicker)}>
                <Diamond className={t.diamond} />
                {s.kicker}
              </p>
              <SessionGlyph
                kind={s.key}
                className={clsx("-mr-1 -mt-1 h-[72px] w-[72px] shrink-0 sm:h-24 sm:w-24", power ? "text-paper-fg" : "text-paper")}
              />
            </div>

            <h3
              id={titleId}
              className="mt-4 font-display text-[clamp(2.3rem,4.4vw,3.6rem)] font-extrabold leading-[0.92] tracking-[-0.05em]"
            >
              {s.name}
            </h3>
            <p className={clsx("mt-4 max-w-[30ch] text-[1.15rem] font-medium leading-snug", power ? "text-paper-fg" : "text-fg")}>
              {s.tagline}
            </p>

            {/* Meta: duración · inversión · con quién */}
            <dl className={clsx("mt-8 grid grid-cols-2 border-y", t.line)}>
              <div className={clsx("border-r py-4 pr-4", t.line)}>
                <dt className={clsx("t-mono text-[10px] uppercase tracking-[0.16em]", t.muted)}>Duración</dt>
                <dd className="mt-1.5 font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.04em]">
                  <Figure value={s.duration} />
                </dd>
              </div>
              <div className="py-4 pl-4 sm:pl-5">
                <dt className={clsx("t-mono text-[10px] uppercase tracking-[0.16em]", t.muted)}>Inversión</dt>
                <dd
                  className={clsx(
                    "mt-1.5 font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.04em]",
                    power ? "text-accent-paper" : "text-paper",
                  )}
                >
                  <Figure value={s.price} count={false} />
                </dd>
                <dd className={clsx("mt-1.5 text-[13px]", t.muted)}>{s.priceNote}</dd>
              </div>
              <div className={clsx("col-span-2 flex items-baseline justify-between gap-4 border-t py-3", t.line)}>
                <dt className={clsx("t-mono text-[10px] uppercase tracking-[0.16em]", t.muted)}>Con quién</dt>
                <dd className="text-right text-[15px] font-semibold">{s.who}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <p className={clsx("t-mono text-[11px] uppercase tracking-[0.16em]", t.muted)}>Es para ti si…</p>
              <Stagger as="ul" className="mt-4 space-y-3" stagger={0.09}>
                {s.forYou.map((f) => (
                  <StaggerItem as="li" key={f} className="flex gap-3 text-[15.5px] leading-snug">
                    <Diamond className={clsx("mt-[0.5em]", t.diamond)} />
                    <span>{f}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {full ? (
              <div className="mt-8">
                <p className={clsx("t-mono text-[11px] uppercase tracking-[0.16em]", t.muted)}>{power ? "Sales con" : "Te llevas"}</p>
                <Stagger as="ol" className={clsx("mt-3 border-t", t.line)} stagger={0.09}>
                  {s.outcome.map((o, i) => (
                    <StaggerItem as="li" key={o} className={clsx("flex items-baseline gap-4 border-b py-3", t.line)}>
                      <span className={clsx("t-mono text-[11px]", power ? "text-accent-paper" : "text-paper")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium leading-snug">{o}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ) : null}

            {notes.length > 1 ? (
              <ul className="mt-7 flex flex-wrap gap-2">
                {notes.map((n) => (
                  <li key={n} className={clsx("rounded-full border px-2.5 py-1 text-[12.5px] leading-snug sm:px-3 sm:text-[13px]", power ? "border-paper-fg/25" : "border-line-strong")}>
                    {n}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={clsx("mt-7 text-[14px] leading-relaxed", t.muted)}>{s.footnote}</p>
            )}

            <div className="mt-auto pt-9">
              <SessionButton s={s} section={`${section}_chooser`} className="w-full px-5 py-4 text-base sm:w-auto sm:px-7 sm:text-[17px]" />
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] font-medium">
                <Link
                  href={s.more.href}
                  className={clsx("group inline-flex items-center gap-2 underline underline-offset-4 transition-colors", t.link)}
                >
                  {s.more.label}
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={(e) => onVideo(s.key, e.currentTarget)}
                  className={clsx("group inline-flex items-center gap-2.5 underline underline-offset-4 transition-colors", t.link)}
                >
                  <PlayIcon />
                  Ver el video ({s.video.duration})
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Tilt>
  );
}

/* ──────────────────────────────────────────────────────────────
   Video en diálogo (para verlo sin salir del selector)
   ────────────────────────────────────────────────────────────── */

function VideoDialog({ session, section, onClose }: { session: Session | null; section: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (session && !d.open) d.showModal();
    if (!session && d.open) d.close();
  }, [session]);

  // Sin scroll de fondo mientras el video está abierto.
  useEffect(() => {
    if (!session) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [session]);

  const onBackdrop = (e: ReactMouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={onBackdrop}
      className="m-auto max-h-[calc(100svh-24px)] w-[min(1080px,calc(100vw-24px))] max-w-none overflow-y-auto bg-transparent p-0 text-fg backdrop:bg-black/85 backdrop:backdrop-blur-[3px]"
    >
      {session ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded-[18px] border border-line-strong bg-bg p-3 sm:p-5"
        >
          <div className="flex items-center justify-between gap-4 pb-3 pl-1 sm:pb-4">
            <p id={titleId} className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted">
              <span className="text-fg">{session.name}</span> · «{session.video.title}» · {session.video.duration}
            </p>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Cerrar video"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong transition-colors hover:border-fg"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <VslPlayer video={session.video} sizes="(min-width: 1110px) 1040px, 94vw" />
          <div className="mt-4 flex flex-col gap-3 pl-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {session.duration} · {session.price} · {session.who}
            </p>
            <SessionButton s={session} section={`${section}_video`} />
          </div>
        </motion.div>
      ) : null}
    </dialog>
  );
}

/* ──────────────────────────────────────────────────────────────
   Comparativa y ayuda para decidir (variante "full")
   ────────────────────────────────────────────────────────────── */

const P = SESSIONS.power;
const D = SESSIONS.discovery;

const COMPARE = [
  { k: "Duración", power: P.duration, discovery: D.duration },
  { k: "Con quién", power: P.who, discovery: `${D.who} de Ingeniak` },
  { k: "Costo", power: `${P.price} · ${P.priceNote}`, discovery: `${D.price} · ${D.priceNote}` },
  {
    k: "Qué obtienes",
    power: "Mapa de fugas de tu operación, las 3 que más te cuestan y un plan de 90 días",
    discovery: "Diagnóstico de tu operación y qué sistema necesitas: agentes de IA, CRM y automatizaciones",
  },
  {
    k: "Siguiente paso",
    power: "Ejecutas el plan con tu equipo o con Ingeniak; si implementas con nosotros, se abona completo",
    discovery: "Implementamos el sistema con Ingeniak y lo operamos contigo",
  },
] as const;

const DECIDE = [
  { s: P, cond: "Si todavía no sabes qué está fallando" },
  { s: D, cond: "Si ya sabes que quieres el sistema funcionando" },
] as const;

const bodyV: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const rowV: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function CompareTable() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-line bg-elev">
      <table role="table" className="w-full border-collapse text-left max-md:block">
        <caption className="sr-only">Power Session frente a Discovery Session</caption>
        <thead role="rowgroup" className="max-md:sr-only">
          <tr role="row" className="border-b border-line-strong">
            <th role="columnheader" scope="col" className="w-[20%] px-7 py-6 align-bottom">
              <span className="t-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Compara</span>
            </th>
            {SESSION_LIST.map((s, i) => (
              <th role="columnheader" scope="col" key={s.key} className="relative w-[40%] border-l border-line px-7 py-6 text-left align-bottom">
                <motion.span
                  aria-hidden
                  className={clsx("absolute inset-x-0 top-0 h-[3px] origin-left", s.key === "power" ? "bg-accent" : "bg-paper")}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.2 }}
                />
                <span
                  className={clsx(
                    "t-mono flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em]",
                    s.key === "power" ? "text-accent-text" : "text-paper",
                  )}
                >
                  <Diamond className={s.key === "power" ? "bg-accent" : "bg-paper"} />
                  {s.kicker}
                </span>
                <span className="mt-2 block font-display text-[1.6rem] font-extrabold leading-tight tracking-[-0.03em]">{s.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <motion.tbody
          role="rowgroup"
          className="max-md:block"
          variants={bodyV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {COMPARE.map((r, ri) => (
            <motion.tr
              key={r.k}
              role="row"
              variants={rowV}
              className={clsx(
                "border-line transition-colors md:hover:bg-bg/50 max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-2.5 max-md:px-5 max-md:py-5",
                ri > 0 && "border-t",
              )}
            >
              <th
                role="rowheader"
                scope="row"
                className="t-mono px-7 py-5 align-top text-[11px] font-medium uppercase tracking-[0.16em] text-muted max-md:col-span-2 max-md:p-0"
              >
                {r.k}
              </th>
              {SESSION_LIST.map((s) => (
                <td
                  key={s.key}
                  role="cell"
                  className={clsx(
                    "px-7 py-5 align-top leading-snug text-fg max-md:p-0 md:border-l md:border-line",
                    ri < 3 ? "font-display text-[1.15rem] font-bold tracking-[-0.015em] md:text-[1.3rem]" : "text-[15px] md:text-base",
                  )}
                >
                  <span
                    aria-hidden
                    className={clsx(
                      "t-mono mb-1 block text-[10px] font-normal uppercase tracking-[0.14em] md:hidden",
                      s.key === "power" ? "text-accent-text" : "text-paper",
                    )}
                  >
                    {s.key === "power" ? "Power" : "Discovery"}
                  </span>
                  {r[s.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}

function DecideHelp({ section }: { section: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-[18px] border border-line">
      <div className="grid xl:grid-cols-12">
        <div className="border-b border-line bg-elev p-6 sm:p-8 xl:col-span-4 xl:border-b-0 xl:border-r">
          <p className="t-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Para decidir</p>
          <p className="mt-4 font-display text-[clamp(1.75rem,2.6vw,2.4rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            ¿Cuál es la tuya?
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">Una pregunta basta: ¿ya sabes qué está fallando?</p>
        </div>
        <Stagger as="ol" className="divide-y divide-line xl:col-span-8" stagger={0.15}>
          {DECIDE.map(({ s, cond }, i) => (
            <StaggerItem
              as="li"
              key={s.key}
              className="group grid gap-5 p-6 transition-colors hover:bg-elev/60 sm:p-8 md:grid-cols-[1fr_auto] md:items-center md:gap-8"
            >
              <div>
                <p className="text-[1.1rem] leading-snug text-muted md:text-[1.2rem]">{cond}</p>
                <p className="mt-3 flex items-center gap-3">
                  <svg viewBox="0 0 64 12" className="h-3 w-12 shrink-0 sm:w-16" aria-hidden>
                    <DrawPath
                      d="M1 6h60M55 1l6 5-6 5"
                      delay={0.3 + i * 0.2}
                      duration={0.9}
                      stroke={s.key === "power" ? "var(--accent)" : "var(--paper)"}
                    />
                  </svg>
                  <span className="font-display text-[1.6rem] font-extrabold leading-none tracking-[-0.03em] md:text-[1.9rem]">{s.name}</span>
                </p>
              </div>
              <SessionButton
                s={s}
                section={`${section}_decide`}
                label={s.key === "power" ? "Agenda la Power Session" : "Agenda la Discovery Session"}
                variant="ghost"
                className="w-full px-5 text-[15px] sm:w-auto sm:px-6 sm:text-base"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Sección
   ────────────────────────────────────────────────────────────── */

/**
 * "Elige cómo empezar": la Power Session (diagnóstico 1:1, tarjeta crema con borde rojo vivo) y la Discovery
 * Session (implementación con Ingeniak, tarjeta oscura con acento crema), lado a lado en desktop y apiladas en
 * móvil. Cada tarjeta trae su meta, para quién es, qué te llevas, su CTA y su video en un diálogo.
 * "full" agrega la tabla comparativa y la ayuda para decidir; "compact" deja una línea que lleva a /agendar.
 */
export function SessionChooser({
  section,
  variant = "full",
  index,
  id,
  title = "Dos formas de empezar. Tú eliges.",
  accentWords = ["eliges."],
  lead = "La Power Session es un diagnóstico 1:1 conmigo para saber qué está fallando y en qué orden arreglarlo. La Discovery Session es para implementar el sistema con mi equipo de Ingeniak.",
}: {
  /** Prefijo de los UTMs (utm_content) de los botones. */
  section: string;
  variant?: "full" | "compact";
  /** Número del eyebrow ("06"). Sin índice, el eyebrow lleva la rayita roja. */
  index?: string;
  /** Ancla de la sección ("sesiones"). */
  id?: string;
  title?: string;
  accentWords?: string[];
  lead?: string;
}) {
  const full = variant === "full";
  const headingId = `${section}-sesiones-titulo`;
  const [video, setVideo] = useState<SessionKey | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const openVideo = (key: SessionKey, el: HTMLElement) => {
    trigger.current = el;
    setVideo(key);
  };
  const closeVideo = () => {
    setVideo(null);
    trigger.current?.focus({ preventScroll: true });
  };

  return (
    <section id={id} className="section relative isolate overflow-hidden border-t border-line" aria-labelledby={headingId}>
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-50" />
      <div
        aria-hidden
        className="absolute -left-[12%] top-[18%] -z-10 h-[50%] w-[45%] rounded-full opacity-[0.12] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="absolute -right-[12%] top-[10%] -z-10 h-[50%] w-[45%] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--paper) 0%, transparent 65%)" }}
      />

      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index={index}>Elige cómo empezar</Eyebrow>
            </Reveal>
            <SplitWords id={headingId} as="h2" className="t-h2 mt-6" text={title} accentWords={accentWords} />
          </div>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="t-lead">{lead}</p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-5" stagger={0.14}>
          <StaggerItem className="h-full">
            <SessionCard s={P} section={section} full={full} onVideo={openVideo} />
          </StaggerItem>
          <StaggerItem className="flex items-center justify-center gap-4 lg:flex-col">
            <span aria-hidden className="h-px w-16 bg-line-strong lg:h-24 lg:w-px" />
            <span
              aria-hidden
              className="grid h-12 w-12 place-items-center rounded-full border border-line-strong bg-bg font-serif text-2xl italic text-muted"
            >
              o
            </span>
            <span aria-hidden className="h-px w-16 bg-line-strong lg:h-24 lg:w-px" />
          </StaggerItem>
          <StaggerItem className="h-full">
            <SessionCard s={D} section={section} full={full} onVideo={openVideo} />
          </StaggerItem>
        </Stagger>

        {full ? (
          <>
            <Reveal className="mt-16 lg:mt-20">
              <CompareTable />
            </Reveal>
            <DecideHelp section={section} />
          </>
        ) : (
          <Reveal className="mt-12 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between md:gap-10">
            <p className="max-w-3xl text-muted">
              <span className="font-medium text-fg">¿Cuál elijo?</span> Si todavía no sabes qué está fallando, la Power Session. Si ya
              sabes que quieres el sistema funcionando, la Discovery Session.
            </p>
            <Link href="/agendar" className={clsx(btn.text, "shrink-0")}>
              Compáralas a detalle
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        )}
      </div>

      <VideoDialog session={video ? SESSIONS[video] : null} section={section} onClose={closeVideo} />
    </section>
  );
}
