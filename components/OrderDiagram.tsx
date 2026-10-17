"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { ORDER } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Diagrama del orden correcto: Branding → Marketing → Ventas → Automatización / IA.
 * El conector se "dibuja" y cada nodo se enciende en secuencia al entrar en viewport.
 */
export function OrderDiagram({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const step = 0.45;

  return (
    <div ref={ref} className={className}>
      <div className="relative">
        {/* Conector horizontal (desktop) */}
        <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[38px] hidden h-px bg-line md:block">
          <motion.div
            className="h-full origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: step * 3.4, ease: "linear", delay: 0.3 }}
          />
          {/* Pulso viajero: se omite con movimiento reducido (se queda invisible, sin desmontarse). */}
          <motion.span
            className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_14px_3px_rgba(229,28,30,0.6)]"
            initial={{ left: "0%", opacity: 0 }}
            animate={inView && !reduce ? { left: "100%", opacity: [0, 1, 1, 0] } : {}}
            transition={{ duration: step * 3.4, ease: "linear", delay: 0.3 }}
          />
        </div>
        {/* Conector vertical (móvil) */}
        <div aria-hidden className="absolute bottom-[12%] left-[38px] top-[12%] w-px bg-line md:hidden">
          <motion.div
            className="w-full origin-top bg-accent"
            style={{ height: "100%" }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: step * 3.4, ease: "linear", delay: 0.3 }}
          />
        </div>

        <ol className="relative grid gap-4 md:grid-cols-4 md:gap-0" aria-label="El orden correcto">
        {ORDER.map((o, i) => {
          const last = i === ORDER.length - 1;
          const d = 0.3 + i * step;
          return (
            <li key={o.n} className="relative flex items-start gap-5 md:flex-col md:items-center md:gap-0 md:px-3 md:text-center">
              <motion.div
                className={`relative z-10 grid h-[76px] w-[76px] shrink-0 place-items-center rounded-full border bg-bg ${
                  last ? "border-accent" : "border-fg/70"
                }`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: d }}
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-[6px] rounded-full bg-accent"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: last ? 1 : 0, opacity: last ? 1 : 0 } : {}}
                  transition={{ duration: 0.6, ease: EASE, delay: d + 0.2 }}
                />
                <span className={`t-mono relative text-sm font-semibold ${last ? "text-white" : "text-fg"}`}>{o.n}</span>
              </motion.div>
              <motion.div
                className="pt-3 md:pt-6"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: d + 0.15 }}
              >
                <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{o.word}</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-[1.7rem]">{o.name}</h3>
                <p className={`mt-1.5 text-[15px] ${last ? "text-accent-text" : "text-muted"}`}>→ {o.verb}</p>
              </motion.div>
            </li>
          );
        })}
        </ol>
      </div>
    </div>
  );
}
