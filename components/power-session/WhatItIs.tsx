import { QUOTES } from "@/lib/content";
import { BACKDROP_TOP_PAD, STICKY_BACKDROP_INNER, STICKY_BACKDROP_OUTER } from "@/lib/backdrop";
import { Backdrop } from "../Backdrop";
import { Reveal, Stagger, StaggerItem } from "../motion";
import { PullQuote } from "../ui";
import { PS_AUDIT } from "./data";
import { SectionTitle } from "./SectionTitle";

function FormatBadge() {
  return (
    <div className="rounded-[10px] border border-line-strong bg-bg/75 px-5 py-4 backdrop-blur-md">
      <p className="t-mono text-[10px] uppercase tracking-[0.16em] text-muted">Formato</p>
      <p className="mt-1 font-display text-lg font-bold tracking-tight">1:1 · 90 min · Google Meet</p>
    </div>
  );
}

/**
 * 01 · Qué es: auditoría 1:1 con Rik, no con un vendedor. El retrato con lentes rojos es el fondo del lado
 * derecho y se queda fijo mientras se lee la lista; en móvil va arriba.
 */
export function WhatItIs() {
  return (
    <section className="section relative isolate overflow-x-clip" aria-labelledby="ps-que-es">
      <div aria-hidden className={STICKY_BACKDROP_OUTER}>
        <div className={STICKY_BACKDROP_INNER}>
          <Backdrop
            src="/img/rik-glasses.webp"
            alt=""
            side="right"
            width="52%"
            focus="62% 8%"
            focusLg="60% 18%"
            sizes="(min-width: 1024px) 52vw, 100vw"
          />
        </div>
      </div>

      {/* Ficha de formato flotando sobre el retrato: abajo de la foto en móvil, fija junto a ella en desktop */}
      <Reveal delay={0.3} className="absolute left-4 top-[calc(min(112vw,620px)-9rem)] z-10 sm:left-8 lg:hidden">
        <FormatBadge />
      </Reveal>
      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <div className="sticky top-0 h-[100svh]">
          <Reveal delay={0.3} className="absolute bottom-[12%] right-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))]">
            <FormatBadge />
          </Reveal>
        </div>
      </div>

      <div className={`container-x relative ${BACKDROP_TOP_PAD}`}>
        <div className="lg:w-[54%] lg:pr-8">
          <SectionTitle
            id="ps-que-es"
            index="01"
            eyebrow="Qué es"
            title="Una auditoría 1:1 conmigo. No con un vendedor."
            accentWords={["conmigo"]}
          />
          <Reveal className="measure mt-8 space-y-4 text-muted" delay={0.1}>
            <p>
              La Power Session es hora y media de trabajo directo sobre tu negocio. Reviso cómo consigues clientes, cómo los
              cierras y qué tienes —o quieres— automatizar con IA.
            </p>
            <p className="text-fg">
              No hay vendedor esperando al final de la llamada. Hay preguntas incómodas, tus números y una lectura honesta
              de dónde se te va el dinero.
            </p>
          </Reveal>

          <Stagger as="ul" className="mt-10 divide-y divide-line border-y border-line" stagger={0.1}>
            {PS_AUDIT.map((a) => (
              <StaggerItem as="li" key={a.code} className="grid gap-2 py-5 sm:grid-cols-[210px_1fr] sm:gap-6">
                <p className="flex flex-col gap-1">
                  <span className="t-mono whitespace-nowrap text-[11px] tracking-[0.14em] text-accent-text">{a.code}</span>
                  <span className="font-display text-lg font-bold leading-snug tracking-tight">{a.name}</span>
                </p>
                <p className="text-[15px] leading-relaxed text-muted">{a.body}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12" delay={0.1}>
            <PullQuote>{QUOTES.leo}</PullQuote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
