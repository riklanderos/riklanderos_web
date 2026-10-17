"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { track } from "@/lib/analytics";

type Item = { q: string; a: string };

/** FAQ accesible (botón + región con aria). Registra `faq_open`. */
export function Accordion({ items, id = "faq" }: { items: readonly Item[]; id?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-b-${i}`;
        const panelId = `${uid}-p-${i}`;
        return (
          <li key={it.q}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  if (!isOpen) track("faq_open", { faq: id, question: it.q });
                }}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="flex gap-5">
                  <span className="t-mono pt-1.5 text-xs text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-fg md:text-2xl">
                    {it.q}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`relative mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                    isOpen ? "border-accent bg-accent" : "border-line-strong"
                  }`}
                >
                  <span className="absolute h-px w-3 bg-fg" />
                  <span className={`absolute h-3 w-px bg-fg transition-transform duration-300 ${isOpen ? "scale-y-0" : ""}`} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-8 pl-10 text-muted md:pl-11">{it.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
