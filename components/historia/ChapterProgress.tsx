"use client";

import clsx from "clsx";
import { motion, motionValue } from "motion/react";
import { useEffect, useState } from "react";

export type ChapterMeta = { id: string; n: string; title: string };

/**
 * Progreso de lectura por capítulo (0 → 1), ligado al scroll.
 * 0 = el capítulo aún no llega a la línea de lectura; 1 = ya se leyó completo.
 * Las barras leen motion values (se pintan sin re-render); el estado de React solo cambia cuando cambia
 * el capítulo activo o el conjunto de capítulos terminados.
 */
function useChapterProgress(ids: string[]) {
  const key = ids.join("|");
  const [values] = useState(() => ids.map(() => motionValue(0)));
  const [active, setActive] = useState(-1);
  const [doneMask, setDoneMask] = useState("");

  useEffect(() => {
    const list = key.split("|");
    let raf = 0;

    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let nextActive = -1;
      let nextMask = "";
      list.forEach((id, i) => {
        const el = document.getElementById(id);
        let p = 0;
        if (el) {
          const r = el.getBoundingClientRect();
          p = Math.min(1, Math.max(0, (line - r.top) / Math.max(r.height, 1)));
        }
        values[i]?.set(p);
        if (p > 0) nextActive = i;
        nextMask += p >= 1 ? "1" : "0";
      });
      setActive((prev) => (prev === nextActive ? prev : nextActive));
      setDoneMask((prev) => (prev === nextMask ? prev : nextMask));
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [key, values]);

  return { values, active, done: (i: number) => doneMask[i] === "1" };
}

/** Índice lateral fijo (desktop) con una barra de progreso por capítulo. */
export function ChapterRail({ chapters }: { chapters: ChapterMeta[] }) {
  const { values, active, done: isDone } = useChapterProgress(chapters.map((c) => c.id));

  return (
    <nav aria-label="Capítulos de la historia">
      <p className="t-eyebrow !text-paper-muted">Índice · {String(chapters.length).padStart(2, "0")} capítulos</p>
      <ol className="mt-6 border-t border-paper-fg/15">
        {chapters.map((c, i) => {
          const isActive = i === active;
          const done = isDone(i);
          return (
            <li key={c.id} className="border-b border-paper-fg/15">
              <a
                href={`#${c.id}`}
                aria-current={isActive ? "location" : undefined}
                className={clsx(
                  "group block py-4 transition-colors duration-300",
                  isActive ? "text-paper-fg" : "text-paper-muted hover:text-paper-fg",
                )}
              >
                <span className="flex items-baseline gap-3">
                  <span className="t-mono text-[11px] font-semibold tracking-[0.12em]">{c.n}</span>
                  <span className="font-display text-[15px] font-bold leading-snug tracking-tight">{c.title}</span>
                  {done && !isActive ? (
                    <span aria-hidden className="ml-auto h-1.5 w-1.5 shrink-0 rotate-45 bg-paper-fg/40" />
                  ) : null}
                </span>
                <span aria-hidden className="mt-3 block h-[2px] w-full overflow-hidden rounded-full bg-paper-fg/10">
                  <motion.span className="block h-full w-full origin-left bg-accent" style={{ scaleX: values[i] }} />
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <p className="t-mono mt-6 text-[11px] uppercase tracking-[0.14em] text-paper-muted">
        Verdad cruda · cero lástima · cero épica
      </p>
    </nav>
  );
}

/** Barra fija (móvil/tablet): capítulo actual + progreso segmentado de los cinco. */
export function ChapterBar({ chapters }: { chapters: ChapterMeta[] }) {
  const { values, active } = useChapterProgress(chapters.map((c) => c.id));
  const current = chapters[Math.max(0, active)];
  const total = String(chapters.length).padStart(2, "0");

  return (
    <div
      aria-hidden="true"
      className="sticky top-[68px] z-30 border-b border-paper-fg/10 bg-paper/90 backdrop-blur-md lg:hidden"
    >
      <div className="container-x flex h-11 items-center gap-3">
        <span className="t-mono shrink-0 text-[11px] font-semibold tracking-[0.12em] text-paper-fg">
          {current.n} <span className="text-paper-muted">/ {total}</span>
        </span>
        <span aria-hidden className="h-3 w-px shrink-0 bg-paper-fg/20" />
        <span className="truncate font-display text-[14px] font-bold tracking-tight text-paper-fg">{current.title}</span>
      </div>
      <div className="container-x flex gap-1 pb-2">
        {chapters.map((c, i) => (
          <span key={c.id} className="block h-[2px] flex-1 overflow-hidden rounded-full bg-paper-fg/10">
            <motion.span className="block h-full w-full origin-left bg-accent" style={{ scaleX: values[i] }} />
          </span>
        ))}
      </div>
    </div>
  );
}
