"use client";

import { motion, useInView, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { splitBuilt } from "@/content/casos";

const EASE = [0.22, 1, 0.36, 1] as const;

function Item({ item, i }: { item: string; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, {
    once: true,
    amount: 0.7,
    margin: "0px 0px -20% 0px",
  });
  const { phase, detail } = splitBuilt(item);
  return (
    <motion.li
      ref={ref}
      className="relative grid grid-cols-[48px_1fr] gap-5 pb-12 last:pb-0 md:grid-cols-[64px_1fr] md:gap-8"
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="flex justify-center">
        <motion.span
          className="relative z-10 grid h-12 w-12 place-items-center rounded-full border bg-bg md:h-16 md:w-16"
          animate={{
            borderColor: active ? "var(--accent)" : "var(--line-strong)",
            backgroundColor: active ? "var(--accent)" : "var(--bg)",
          }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <span className="t-mono text-xs font-semibold text-white md:text-sm">{String(i + 1).padStart(2, "0")}</span>
        </motion.span>
      </div>
      <div className="pt-1.5 md:pt-3">
        <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">{phase}</p>
        {detail ? (
          <p className="mt-2 font-display text-xl font-bold leading-snug tracking-tight md:text-[1.75rem]">{detail}</p>
        ) : null}
      </div>
    </motion.li>
  );
}

/** Secuencia de lo que se construyó en un caso, en el orden en que se hizo. El trazo avanza con el scroll. */
export function BuiltSequence({ items }: { items: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  return (
    <div ref={ref} className="relative">
      <span aria-hidden className="absolute bottom-8 left-[24px] top-8 w-px -translate-x-1/2 bg-line md:left-[32px]" />
      <motion.span
        aria-hidden
        className="absolute bottom-8 left-[24px] top-8 w-px origin-top -translate-x-1/2 bg-accent md:left-[32px]"
        style={{ scaleY: progress }}
      />
      <ol className="relative" aria-label="Qué construimos, en orden">
        {items.map((it, i) => (
          <Item key={it} item={it} i={i} />
        ))}
      </ol>
    </div>
  );
}
