"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { MethodTimeline } from "@/components/MethodTimeline";
import { Stagger, StaggerItem } from "@/components/motion";
import { METHOD } from "@/lib/content";
import { STEP_QUOTES } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Línea de tiempo detallada del Sistema Radikal + una cita de Rik por paso.
 * En desktop la cita vive en una columna fija y cambia según el paso que va
 * alcanzando el trazo rojo; en móvil (y para lectores de pantalla) las cinco
 * citas se listan completas debajo de los pasos.
 */
export function StepsWithQuotes({ aside, className }: { aside?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Mismo offset que MethodTimeline para que la cita cambie junto con el trazo.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(METHOD.length - 1, Math.max(0, Math.floor(v * METHOD.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const step = METHOD[active];

  return (
    <div className={clsx("grid gap-14 lg:grid-cols-12 lg:gap-20", className)}>
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          {aside}

          <div aria-hidden className="card relative mt-6 hidden min-h-[290px] overflow-hidden p-8 lg:block">
            <div className="flex items-center justify-between gap-4">
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Paso <span className="text-accent-text">{step.n}</span> / 05
              </p>
              <div className="flex gap-1.5">
                {METHOD.map((s, i) => (
                  <span
                    key={s.n}
                    className={clsx(
                      "h-1 w-5 rounded-full transition-colors duration-500",
                      i <= active ? "bg-accent" : "bg-line-strong",
                    )}
                  />
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={active}
                className="mt-8 border-l-2 border-accent pl-6"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <blockquote className="font-serif text-[1.75rem] italic leading-[1.15] text-fg xl:text-[2rem]">
                  “{STEP_QUOTES[active]}”
                </blockquote>
                <figcaption className="t-eyebrow mt-4">— Rik · {step.name}</figcaption>
              </motion.figure>
            </AnimatePresence>
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-accent opacity-[0.12] blur-3xl"
            />
          </div>
        </div>
      </div>

      <div ref={ref} className="lg:col-span-7">
        <MethodTimeline detailed />
      </div>

      {/* Todas las citas: visibles en móvil, solo para lectores de pantalla en desktop */}
      <div className="lg:sr-only">
        <h3 className="t-eyebrow">Lo que te digo en cada paso</h3>
        <Stagger as="ol" className="mt-6 grid gap-4" stagger={0.08}>
          {METHOD.map((s, i) => (
            <StaggerItem as="li" key={s.n} className="card p-6">
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Paso <span className="text-accent-text">{s.n}</span> · {s.name}
              </p>
              <figure className="mt-4 border-l-2 border-accent pl-5">
                <blockquote className="font-serif text-[1.4rem] italic leading-[1.2] text-fg">“{STEP_QUOTES[i]}”</blockquote>
                <figcaption className="t-eyebrow mt-3">— Rik</figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
