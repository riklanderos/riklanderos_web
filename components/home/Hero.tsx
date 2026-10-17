"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { PROOF_LINE } from "@/lib/content";
import { SESSIONS } from "@/lib/sessions";
import { Backdrop } from "../Backdrop";
import { DiscoverySessionButton } from "../DiscoverySessionButton";
import { useSafeReducedMotion } from "../motion";
import { PowerSessionButton } from "../PowerSessionButton";
import { ISO_OUTLINE } from "../Logo";

const EASE = [0.22, 1, 0.36, 1] as const;
const INSTANT = { duration: 0 } as const;

const LINE_1 = ["Tu", "empresa", "no", "necesita", "más", "IA."];
const LINE_2 = ["Necesita", "un"];

/**
 * Geometría del panel de la foto: la misma que usa <Backdrop> (arriba a todo el ancho en móvil con
 * mobileHeight, a la derecha con `width` en desktop). Las capas del HUD se posicionan en % de este panel
 * para quedar alrededor de Rik en cualquier ancho.
 */
const PHOTO_H = "min(112vw, 600px)";
/** En móvil el panel empieza 48px abajo (top-12) para que la cabeza no quede bajo el menú. */
const PANEL = "absolute inset-x-0 top-12 h-[min(112vw,600px)] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[58%]";

type Hud = {
  n: string;
  label: string;
  /** Posición en % del panel (móvil / desktop). */
  cls: string;
  /** Hacia dónde sale la línea guía: hacia Rik. */
  lead: "left" | "right";
  delay: number;
  /** Profundidad: cuánto sigue al mouse y cuánto se adelanta con el scroll. */
  depth: number;
  accent?: boolean;
};

const HUD: Hud[] = [
  // En desktop el texto puede invadir hasta ~21% del panel: las etiquetas de la izquierda van después del 24%.
  { n: "01", label: "Branding", cls: "left-[4%] top-[25%] lg:left-[25%] lg:top-[19%]", lead: "right", delay: 1.5, depth: 1 },
  { n: "02", label: "Marketing", cls: "right-[4%] top-[45%] lg:right-[7%] lg:top-[29%]", lead: "left", delay: 1.65, depth: 0.6 },
  { n: "03", label: "Ventas", cls: "left-[4%] top-[55%] lg:left-[24%] lg:top-[54%]", lead: "right", delay: 1.8, depth: 1.35 },
  { n: "04", label: "IA", cls: "right-[8%] top-[66%] lg:right-[9%] lg:top-[68%]", lead: "left", delay: 1.95, depth: 0.85, accent: true },
];

function Word({ children, delay, className }: { children: string; delay: number; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.06em] align-top">
      <motion.span
        className={`inline-block ${className ?? ""}`}
        initial={{ y: "108%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.95, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Etiqueta HUD flotante: entra escalonada y sigue al mouse según su profundidad. */
function HudTag({ h, mx, my }: { h: Hud; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * 22 * h.depth);
  const y = useTransform(my, (v) => v * 14 * h.depth);
  const line = (
    <motion.span
      aria-hidden
      className={`hidden h-px w-6 bg-gradient-to-r sm:block lg:w-10 ${
        h.lead === "right" ? "origin-left from-accent/80 to-transparent" : "origin-right from-transparent to-accent/80"
      }`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: h.delay + 0.35 }}
    />
  );
  return (
    <motion.div className={`absolute ${h.cls}`} style={{ x, y }}>
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, scale: 0.85, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: h.delay }}
      >
        {h.lead === "left" ? line : null}
        <span
          className={`flex items-center gap-2 rounded-full border bg-bg/70 px-2.5 py-1 backdrop-blur-md sm:px-3 sm:py-1.5 ${
            h.accent ? "border-accent/70 shadow-[0_0_24px_-6px_var(--accent)]" : "border-line-strong"
          }`}
        >
          <span className={`t-mono text-[9px] sm:text-[10px] ${h.accent ? "text-accent-text" : "text-muted"}`}>{h.n}</span>
          <span className="t-mono text-[10px] uppercase tracking-[0.14em] text-fg sm:text-[11px]">{h.label}</span>
        </span>
        {h.lead === "right" ? line : null}
      </motion.div>
    </motion.div>
  );
}

/**
 * Hero del inicio: retrato de Rik a sangre completa como fondo (derecha en desktop, arriba en móvil),
 * texto a la izquierda. Capas con profundidad: la foto se mueve lento con el scroll (Backdrop), el trazo
 * del isotipo y las etiquetas HUD se adelantan y siguen al mouse a distintas velocidades.
 */
export function Hero() {
  // MotionConfig reducedMotion="user" no frena clip-path ni pathLength ni los valores ligados al scroll:
  // con movimiento reducido se usan transiciones instantáneas y rangos en cero.
  // (Se cambia la transición, no `initial`, para que el HTML del servidor coincida al hidratar.)
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Mouse normalizado a [-1, 1] sobre el hero, suavizado con resorte.
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 70, damping: 18, mass: 0.6 });
  const my = useSpring(myRaw, { stiffness: 70, damping: 18, mass: 0.6 });
  const isoX = useTransform(mx, (v) => v * -10);
  const isoMouseY = useTransform(my, (v) => v * -8);

  // Parallax de scroll: el retrato (Backdrop) va lento; el isotipo y las etiquetas se adelantan.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Rangos fijos + selección tras montar: el servidor no conoce reduce y el style debe coincidir al hidratar.
  const still = useSafeReducedMotion();
  const zero = useMotionValue(0);
  const hudScroll = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const isoScroll = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const textScroll = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const hudY = still ? zero : hudScroll;
  const isoY = still ? zero : isoScroll;
  const textY = still ? zero : textScroll;

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mxRaw.set(((e.clientX - r.left) / r.width) * 2 - 1);
    myRaw.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    mxRaw.set(0);
    myRaw.set(0);
  };

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center"
    >
      {/* Fondo: retícula de blueprint + retrato a sangre completa */}
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-60" />
      <Backdrop
        src="/img/rik-hero.webp"
        alt="Rik Landeros, consultor de IA para empresas, en retrato de estudio con camisa negra"
        side="right"
        width="58%"
        focus="58% 0%"
        focusLg="60% 26%"
        mobileHeight={PHOTO_H}
        reveal="load"
        priority
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="top-12 lg:top-0"
      />

      {/* Barrido de luz roja que recorre el retrato una sola vez al cargar */}
      <div aria-hidden className={`pointer-events-none z-[-5] overflow-hidden ${PANEL}`}>
        <motion.div
          className="absolute inset-x-0 top-0 h-full"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "100%", opacity: [0, 1, 1, 0] }}
          transition={reduce ? INSTANT : { duration: 2.2, ease: [0.45, 0, 0.2, 1], delay: 0.6 }}
        >
          <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-accent/15" />
          <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
        </motion.div>
      </div>

      {/* Isotipo en línea que se dibuja alrededor de Rik (se abre alrededor de la cara con una máscara) */}
      <motion.div aria-hidden className={`pointer-events-none z-[-4] ${PANEL}`} style={{ y: isoY }}>
        <motion.svg
          viewBox="-60 -40 410 420"
          className="absolute inset-0 h-full w-full text-accent mix-blend-screen [mask-image:radial-gradient(ellipse_30%_24%_at_60%_27%,transparent_62%,#000_100%)] lg:[mask-image:radial-gradient(ellipse_22%_26%_at_60%_28%,transparent_60%,#000_100%)]"
          fill="none"
          style={{ x: isoX, y: isoMouseY }}
        >
          <motion.path
            d={ISO_OUTLINE}
            stroke="currentColor"
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={
              reduce ? INSTANT : { pathLength: { duration: 2.6, ease: EASE, delay: 0.5 }, opacity: { duration: 0.3, delay: 0.5 } }
            }
          />
        </motion.svg>
      </motion.div>

      {/* Etiquetas HUD alrededor de Rik: el orden correcto */}
      <motion.div aria-hidden className={`pointer-events-none z-0 ${PANEL}`} style={{ y: hudY }}>
        {HUD.map((h) => (
          <HudTag key={h.n} h={h} mx={mx} my={my} />
        ))}
        <motion.div
          className="absolute bottom-[9%] left-[56%] hidden w-max -translate-x-1/2 items-center gap-2.5 rounded-full border border-line-strong bg-bg/75 px-4 py-2 backdrop-blur-md lg:flex"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 2.2 }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-accent" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="t-mono text-[11px] uppercase tracking-[0.12em] text-fg">Dos formas de empezar · Power o Discovery</span>
        </motion.div>
      </motion.div>

      {/* Texto */}
      <div className="container-x relative w-full pb-14 pt-[calc(min(112vw,600px)+48px-7rem)] lg:pb-16 lg:pt-[calc(68px+3rem)]">
        <motion.div className="max-w-[640px] lg:max-w-[54%]" style={{ y: textY }}>
          <motion.p
            className="t-eyebrow flex flex-wrap items-center gap-x-3 gap-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          >
            <span aria-hidden className="h-px w-6 bg-accent" />
            <span>Consultor de IA para empresas</span>
            <span aria-hidden className="text-dim">/</span>
            <span>Fundador de Ingeniak</span>
          </motion.p>

          <h1 className="t-h1 mt-6 lg:text-[clamp(3.5rem,5.7vw,5.5rem)]">
            <span className="sr-only">Tu empresa no necesita más IA. Necesita un sistema.</span>
            <span aria-hidden className="block">
              {LINE_1.map((w, i) => (
                <span key={i}>
                  <Word delay={0.2 + i * 0.06}>{w}</Word>{" "}
                </span>
              ))}
            </span>
            <span aria-hidden className="mt-1 block">
              {LINE_2.map((w, i) => (
                <span key={i}>
                  <Word delay={0.6 + i * 0.06} className="text-muted">
                    {w}
                  </Word>{" "}
                </span>
              ))}
              <span className="relative inline-block">
                <Word delay={0.78} className="t-brush text-accent text-[1.12em] translate-y-[0.06em]">
                  sistema.
                </Word>
                <svg aria-hidden viewBox="0 0 300 20" className="absolute -bottom-2 left-0 h-3 w-full text-accent" fill="none" preserveAspectRatio="none">
                  <motion.path
                    d="M2 14 C 70 4, 160 4, 298 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={reduce ? INSTANT : { duration: 0.9, ease: EASE, delay: 1.3 }}
                  />
                </svg>
              </span>
            </span>
          </h1>

          <motion.p
            className="t-lead mt-8 max-w-[560px] text-fg/80"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}
          >
            14 años en marketing. Hoy llevo inteligencia artificial a empresas que ya venden: leo tu negocio completo, te
            digo la verdad cruda de qué te frena y construyo el sistema que lo hace crecer sin que estés en cada incendio.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
          >
            <PowerSessionButton section="hero" />
            <DiscoverySessionButton section="hero" variant="ghost" className="bg-bg/40 backdrop-blur-sm" />
          </motion.div>
          <motion.p
            className="t-mono mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase leading-relaxed tracking-[0.12em] text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.25 }}
          >
            <span>
              {SESSIONS.power.duration} · {SESSIONS.power.price}
            </span>
            <span aria-hidden className="text-dim">/</span>
            <span>
              {SESSIONS.discovery.duration} · {SESSIONS.discovery.price}
            </span>
            <Link href="#sesiones" className="link-underline text-fg">
              ¿Cuál me conviene?
            </Link>
          </motion.p>

          <motion.ul
            className="mt-10 flex flex-wrap gap-x-5 gap-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.35 }}
            aria-label="Resultados de clientes"
          >
            {PROOF_LINE.map((p, i) => (
              <li key={p} className="t-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted">
                {i > 0 ? <span aria-hidden className="h-1 w-1 rotate-45 bg-accent" /> : null}
                {p}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-8 right-8 hidden flex-col items-center gap-3 2xl:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
      >
        <span className="t-mono text-[10px] uppercase tracking-[0.3em] text-dim">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-accent"
            animate={{ y: ["-100%", "250%"] }}
            transition={{ duration: 1.6, repeat: 3, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
