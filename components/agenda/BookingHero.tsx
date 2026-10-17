"use client";

import clsx from "clsx";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties } from "react";
import type { SessionType } from "@/lib/agenda/config";
import { SESSIONS } from "@/lib/sessions";
import { Backdrop } from "../Backdrop";
import { useSafeReducedMotion } from "../motion";
import { Arrow, btn } from "../ui";

const EASE = [0.22, 1, 0.36, 1] as const;
const INSTANT = { duration: 0 } as const;

/** Foto y encuadre de cada sesión (retrato vertical para la Power, horizontal para la Discovery). */
const ART: Record<
  SessionType,
  { src: string; alt: string; width: string; focus: string; focusLg: string; mobileHeight: string; brush: string; title: string; note: string }
> = {
  power: {
    src: "/img/rik-frame.webp",
    alt: "Rik Landeros enmarcando su rostro con las manos, listo para tu diagnóstico 1:1",
    width: "54%",
    focus: "50% 22%",
    focusLg: "50% 30%",
    mobileHeight: "min(112vw, 600px)",
    brush: "1:1 conmigo",
    title: "text-[clamp(3.6rem,8.4vw,8rem)]",
    note: "Solo 4 sesiones por semana",
  },
  discovery: {
    src: "/img/rik-explain.webp",
    alt: "Rik Landeros explicando en su escritorio con luz roja de fondo",
    width: "64%",
    focus: "62% 30%",
    focusLg: "64% 35%",
    mobileHeight: "min(80vw, 500px)",
    brush: "Sin costo",
    title: "text-[clamp(3rem,6.6vw,6.4rem)]",
    note: "30 min por Google Meet",
  },
};

function Word({ children, delay, className, reduce }: { children: string; delay: number; className?: string; reduce: boolean | null }) {
  return (
    <span className="block overflow-x-visible overflow-y-clip pb-[0.04em]">
      <motion.span
        className={clsx("block", className)}
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={reduce ? INSTANT : { duration: 1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Hero épico de las páginas de agenda: Rik a sangre completa de fondo, el nombre de la sesión gigante
 * revelado palabra por palabra, una palabra en brocha, barrido de luz roja y el nombre en contorno detrás.
 */
export function BookingHero({ type }: { type: SessionType }) {
  const s = SESSIONS[type];
  const art = ART[type];
  const [first, ...rest] = s.name.split(" ");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const still = useSafeReducedMotion();
  const zero = useMotionValue(0);
  const ghostMove = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textMove = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const ghostY = still ? zero : ghostMove;
  const textY = still ? zero : textMove;

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden pb-14 lg:flex lg:min-h-[min(94svh,900px)] lg:items-center lg:pb-0"
      style={{ "--bh-h": art.mobileHeight, "--bh-w": art.width } as CSSProperties}
    >
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-30 opacity-60" />

      {/* Nombre de la sesión en contorno gigante, detrás de todo */}
      <motion.p
        aria-hidden
        style={{ y: ghostY, WebkitTextStroke: "1px rgba(255,255,255,0.09)" }}
        className="pointer-events-none absolute -bottom-[0.12em] left-0 -z-20 select-none whitespace-nowrap font-display text-[26vw] font-bold uppercase leading-none tracking-[-0.06em] text-transparent lg:text-[19vw]"
        initial={{ opacity: 0, x: "-4%" }}
        animate={{ opacity: 1, x: "0%" }}
        transition={reduce ? INSTANT : { duration: 1.8, ease: EASE, delay: 0.2 }}
      >
        {first}
      </motion.p>

      <Backdrop
        src={art.src}
        alt={art.alt}
        side="right"
        width={art.width}
        focus={art.focus}
        focusLg={art.focusLg}
        mobileHeight={art.mobileHeight}
        reveal="load"
        priority
        className="top-14 lg:top-0"
      />

      {/* Barrido de luz roja sobre la foto, una vez al cargar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-14 z-[-5] h-(--bh-h) overflow-hidden lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:h-auto lg:w-(--bh-w)"
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-full"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "100%", opacity: [0, 1, 1, 0] }}
          transition={reduce ? INSTANT : { duration: 2.2, ease: [0.45, 0, 0.2, 1], delay: 0.7 }}
        >
          <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-accent/15" />
          <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
        </motion.div>
      </div>

      <motion.div className="container-x relative w-full pt-[calc(var(--bh-h)-2.5rem)] lg:pt-28" style={{ y: textY }}>
        <div className="max-w-[640px] lg:max-w-[50%]">
          <motion.p
            className="t-eyebrow flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? INSTANT : { duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            <span aria-hidden className="h-px w-6 bg-accent" />
            Agenda · {s.kicker}
          </motion.p>

          <h1 className="mt-5 font-display font-bold uppercase leading-[0.86] tracking-[-0.055em]">
            <span className="sr-only">Agenda tu {s.name}</span>
            <span aria-hidden className="block">
              <Word delay={0.25} reduce={reduce} className="t-mono text-[clamp(0.85rem,1.2vw,1rem)] font-medium normal-case tracking-[0.2em] text-muted">
                AGENDA TU
              </Word>
              <Word delay={0.35} reduce={reduce} className={clsx("mt-2 text-fg", art.title)}>
                {first}
              </Word>
              <Word delay={0.5} reduce={reduce} className={clsx("text-accent", art.title)}>
                {rest.join(" ")}
              </Word>
            </span>
          </h1>

          <motion.p
            aria-hidden
            className="t-brush mt-3 inline-block -rotate-3 text-[clamp(2rem,4.4vw,3.4rem)] text-fg"
            initial={{ opacity: 0, scale: 1.3, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={reduce ? INSTANT : { type: "spring", stiffness: 260, damping: 14, delay: 1 }}
          >
            {art.brush}
          </motion.p>

          <motion.p
            className="t-lead mt-5 max-w-[520px] text-fg/80"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? INSTANT : { duration: 0.8, ease: EASE, delay: 0.8 }}
          >
            {s.tagline}
          </motion.p>

          <motion.dl
            className="mt-8 flex flex-wrap gap-x-8 gap-y-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? INSTANT : { duration: 0.8, ease: EASE, delay: 0.95 }}
          >
            {[
              ["Duración", s.duration],
              ["Inversión", s.price],
              ["Con", s.who],
            ].map(([k, v]) => (
              <div key={k} className="border-l-2 border-accent pl-3">
                <dt className="t-mono text-[10px] uppercase tracking-[0.16em] text-muted">{k}</dt>
                <dd className="mt-1 text-[17px] font-semibold">{v}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? INSTANT : { duration: 0.8, ease: EASE, delay: 1.1 }}
          >
            <a href="#agenda" className={clsx(btn.primary, "btn-shine px-8 py-4 text-lg")}>
              Elegir mi horario
              <Arrow className="rotate-90 transition-transform duration-300 group-hover:translate-y-1" />
            </a>
            <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">{art.note}</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
