"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import type { Resource } from "@/content/recursos";
import { LeadForm } from "../LeadForm";
import { TiltCard } from "../motion";
import { Arrow, btn } from "../ui";
import { ResourceCover } from "./Covers";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Tarjeta de recurso con formulario en línea (gate por correo).
 * Se abre con el botón o al llegar con #<slug> en la URL.
 */
export function ResourceCard({ resource, index }: { resource: Resource; index: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const featured = resource.featured;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Al llegar por #slug, lleva al visitante directo al formulario (en móvil queda bajo la portada).
    // Se espera a `load`: mientras la página carga, el navegador re-ancla el scroll al #fragmento.
    const scrollToPanel = () => {
      clearTimeout(timer);
      timer = setTimeout(() => panelRef.current?.scrollIntoView({ block: "start" }), 400);
    };
    const sync = () => {
      if (window.location.hash !== `#${resource.slug}`) return;
      setOpen(true);
      if (document.readyState === "complete") scrollToPanel();
      else window.addEventListener("load", scrollToPanel, { once: true });
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("load", scrollToPanel);
    };
  }, [resource.slug]);

  const button = (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => setOpen((o) => !o)}
      className={clsx(open ? btn.ghost : featured ? btn.primary : btn.ghost, "w-full sm:w-auto")}
    >
      {open ? "Ocultar formulario" : resource.cta}
      <Arrow className={clsx("transition-transform duration-300", open ? "rotate-90" : "group-hover:translate-x-1")} />
    </button>
  );

  const panel = (
    <div id={panelId} ref={panelRef}>
      <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="panel"
          role="region"
          aria-label={`Formulario para recibir ${resource.title}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="overflow-hidden"
        >
          <div className="mt-8 border-t border-line pt-8">
            <p className="t-mono mb-6 text-[11px] uppercase tracking-[0.16em] text-muted">
              Te lo mando a tu correo · <span className="text-fg">{resource.title}</span>
            </p>
            <LeadForm source="recurso" resource={resource.slug} submitLabel={`Envíame ${featured ? "el Canvas" : "la guía"}`} autoFocus />
          </div>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </div>
  );

  if (featured) {
    return (
      // Solo foco de luz (sin inclinar): la tarjeta contiene un formulario.
      <TiltCard reveal="none" max={0} className="rounded-[16px]">
      <article
        id={resource.slug}
        className="spot group overflow-hidden rounded-[16px] border border-line bg-elev transition-colors duration-500 hover:border-line-strong"
        aria-labelledby={`${resource.slug}-title`}
      >
        <div aria-hidden className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14">
          <div className="lg:col-span-5">
            <ResourceCover cover={resource.cover} className="mx-auto max-w-[420px]" />
          </div>
          <div className="flex flex-col lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="t-mono rounded-full bg-accent px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white">Principal</span>
              <span className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {index} · {resource.kind} · Rik Landeros
              </span>
            </div>
            <h3 id={`${resource.slug}-title`} className="mt-6 font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1] tracking-[-0.04em]">
              {resource.title}
            </h3>
            <p className="t-lead mt-5 max-w-[560px]">{resource.summary}</p>
            <ul className="mt-8 space-y-3 border-t border-line pt-6">
              {resource.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] text-fg/90">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">{button}</div>
            {panel}
          </div>
        </div>
      </article>
      </TiltCard>
    );
  }

  return (
    <TiltCard reveal="none" max={0} className="h-full rounded-[10px]">
    <article
      id={resource.slug}
      className="spot group card flex h-full flex-col p-6 transition-colors duration-500 hover:border-line-strong sm:p-8"
      aria-labelledby={`${resource.slug}-title`}
    >
      <div className="grid gap-7 sm:grid-cols-[minmax(0,190px)_1fr] sm:items-start">
        <ResourceCover cover={resource.cover} className="max-w-[240px] sm:max-w-none" />
        <div className="flex h-full flex-col">
          <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">
            {index} · {resource.kind}
          </p>
          <h3 id={`${resource.slug}-title`} className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight md:text-[1.75rem]">
            {resource.title}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{resource.summary}</p>
          <ul className="mt-5 space-y-2">
            {resource.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[14px] text-fg/85">
                <span aria-hidden className="mt-[0.55rem] h-1 w-1 shrink-0 rotate-45 bg-accent" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto pt-8">{button}</div>
      {panel}
    </article>
    </TiltCard>
  );
}
