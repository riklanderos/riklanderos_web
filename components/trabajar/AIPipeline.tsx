"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { AI_PIPELINE } from "@/content/trabajar-conmigo";
import { useSafeReducedMotion } from "../motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const LAST = AI_PIPELINE.length - 1;

/** Nodo que se enciende cuando el trazo (ligado al scroll) pasa por él. Solo motion values: sin re-render por frame. */
function Node({ i, progress, inView }: { i: number; progress: MotionValue<number>; inView: boolean }) {
  const p = AI_PIPELINE[i];
  const last = i === LAST;
  const t = i / LAST;
  // Al pasar el trazo: destello y queda un rastro tenue; el último nodo se queda encendido.
  const glow = useTransform(progress, last ? [t - 0.08, t] : [t - 0.08, t, t + 0.18], last ? [0, 1] : [0, 0.85, 0.16], {
    clamp: true,
  });
  const ring = useTransform(progress, [t - 0.04, t], [0, 1], { clamp: true });
  return (
    <li className="relative flex items-start gap-5 lg:flex-col lg:items-center lg:px-3 lg:text-center">
      <motion.div
        className={`relative z-10 grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[14px] border bg-bg ${
          last ? "border-accent" : "border-line-strong"
        }`}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.55, ease: EASE, delay: 0.1 + i * 0.08 }}
      >
        <motion.span aria-hidden className="absolute inset-0 bg-accent" style={{ opacity: glow }} />
        <motion.span aria-hidden className="absolute inset-0 rounded-[13px] border border-accent" style={{ opacity: ring }} />
        <span className={`t-mono relative text-sm font-semibold ${last ? "text-white" : "text-fg"}`}>{p.n}</span>
      </motion.div>
      <motion.div
        className="pt-1.5 lg:pt-5"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE, delay: 0.2 + i * 0.08 }}
      >
        <h3 className="font-display text-lg font-bold leading-tight tracking-tight">{p.title}</h3>
        <ul className="mt-3 flex flex-wrap gap-1.5 lg:justify-center">
          {p.tools.map((tool) => (
            <li
              key={tool}
              className="t-mono rounded-full border border-line-strong px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-muted transition-colors duration-300 hover:border-accent hover:text-fg"
            >
              {tool}
            </li>
          ))}
        </ul>
      </motion.div>
    </li>
  );
}

/**
 * Flujo de un sistema de atención con IA: mensaje → agente → CRM → automatización → cierre.
 * El conector se dibuja con el scroll y cada nodo se enciende cuando el pulso pasa por él.
 * El contenido entra una vez al aparecer (no depende del scroll); con movimiento reducido todo queda encendido.
 */
export function AIPipeline({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  // Versión segura para la hidratación: la preferencia cambia motion values de `style`.
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const done = useMotionValue(1);
  const progress = reduce ? done : smooth;
  const pulseX = useTransform(progress, (v) => `${v * 100}%`);
  // Con movimiento reducido el pulso no se muestra (se queda montado para no alterar la hidratación).
  const pulseOpacity = useTransform(progress, [0, 0.03, 0.97, 1], reduce ? [0, 0, 0, 0] : [0, 1, 1, 0]);

  return (
    <div ref={ref} className={className}>
      <div className="relative">
        {/* Conector horizontal (desktop) */}
        <div aria-hidden className="absolute left-[10%] right-[10%] top-[32px] hidden h-px bg-line lg:block">
          <motion.div className="h-full origin-left bg-accent" style={{ scaleX: progress }} />
          {/* Pulso viajero: la capa mide lo mismo que el conector y se traslada su propio ancho × progreso. */}
          <motion.div className="absolute inset-0" style={{ x: pulseX }}>
            <motion.span
              className="absolute -left-[3px] -top-[3px] h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_14px_3px_rgba(229,28,30,0.6)]"
              style={{ opacity: pulseOpacity }}
            />
          </motion.div>
        </div>
        {/* Conector vertical (móvil) */}
        <div aria-hidden className="absolute bottom-[10%] left-[32px] top-[6%] w-px bg-line lg:hidden">
          <motion.div className="h-full w-full origin-top bg-accent" style={{ scaleY: progress }} />
        </div>

        <ol className="relative grid gap-7 lg:grid-cols-5 lg:gap-0" aria-label="Flujo de un sistema de atención con IA">
          {AI_PIPELINE.map((p, i) => (
            <Node key={p.n} i={i} progress={progress} inView={inView} />
          ))}
        </ol>
      </div>
    </div>
  );
}
