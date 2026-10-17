"use client";

import { motion, useInView, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { METHOD } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

function Step({ s, detailed }: { s: (typeof METHOD)[number]; detailed: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { amount: 0.6, margin: "-10% 0px -30% 0px" });
  return (
    <li ref={ref} className="relative grid grid-cols-[56px_1fr] gap-5 pb-14 last:pb-0 md:grid-cols-[88px_1fr] md:gap-8 md:pb-20">
      <div className="relative flex justify-center">
        <motion.span
          className="relative z-10 grid h-14 w-14 place-items-center rounded-full border bg-bg md:h-[72px] md:w-[72px]"
          animate={{
            borderColor: active ? "var(--accent)" : "var(--line-strong)",
            backgroundColor: active ? "var(--accent)" : "var(--bg)",
          }}
          transition={{ duration: 0.5 }}
        >
          <span className="t-mono text-sm font-semibold text-white">{s.n}</span>
        </motion.span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="pt-2 md:pt-4"
      >
        <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Paso {s.n}</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-[2.1rem]">{s.name}</h3>
        <p className="mt-3 text-lg text-fg/90">{s.line}</p>
        {detailed ? (
          <>
            <p className="mt-3 max-w-xl text-muted">{s.body}</p>
            <p className="t-mono mt-5 inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-fg">
              <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" /> Sales con: {s.deliverable}
            </p>
          </>
        ) : null}
      </motion.div>
    </li>
  );
}

/** Línea de tiempo del Sistema Radikal; el trazo rojo avanza con el scroll. */
export function MethodTimeline({ detailed = false }: { detailed?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <div ref={ref} className="relative">
      <span aria-hidden className="absolute bottom-10 left-[28px] top-10 w-px -translate-x-1/2 bg-line md:left-[44px]" />
      <motion.span
        aria-hidden
        className="absolute bottom-10 left-[28px] top-10 w-px origin-top -translate-x-1/2 bg-accent md:left-[44px]"
        style={{ scaleY: progress }}
      />
      <ol className="relative" aria-label="Sistema Radikal en 5 pasos">
        {METHOD.map((s) => (
          <Step key={s.n} s={s} detailed={detailed} />
        ))}
      </ol>
    </div>
  );
}
