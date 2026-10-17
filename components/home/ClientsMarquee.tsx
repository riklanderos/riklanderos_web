"use client";

import Image from "next/image";
import { useState } from "react";
import { CLIENTS, type ClientSlug } from "@/lib/content";

/** Alto de cada logo en la franja (el archivo y su tamaño viven en CLIENTS). */
const LOGO_CLS: Record<ClientSlug, string> = {
  cocacola: "h-12 md:h-14",
  nike: "h-8 md:h-9",
  bmw: "h-10 md:h-11",
  cemex: "h-6 md:h-7",
  argi: "h-8 md:h-9",
  tierrayarmonia: "h-10 md:h-12",
};

function ClientLogo({ client, hidden }: { client: (typeof CLIENTS)[number]; hidden: boolean }) {
  const { logo } = client;
  return (
    <li className="group/logo relative flex h-20 shrink-0 items-center justify-center px-10 md:px-14" aria-hidden={hidden || undefined}>
      <Image
        src={logo.src}
        alt={hidden ? "" : client.name}
        width={logo.w}
        height={logo.h}
        className={`${LOGO_CLS[client.slug]} w-auto opacity-60 brightness-0 invert transition-[opacity,scale,translate] duration-500 ease-[var(--ease-out)] group-hover/logos:opacity-25 group-hover/logo:-translate-y-1 group-hover/logo:scale-110 group-hover/logo:opacity-100!`}
        unoptimized
      />
      {/* Reacción al hover: marca roja bajo el logo (los demás se atenúan) */}
      <span
        aria-hidden
        className="absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 scale-0 bg-accent transition-transform duration-500 ease-[var(--ease-out)] group-hover/logo:scale-100"
      />
    </li>
  );
}

/**
 * Marquee de logos con control de pausa (WCAG 2.2.2). La segunda copia de la
 * lista solo existe para el bucle visual y se oculta a tecnologías de asistencia.
 */
export function ClientsMarquee({ headingId }: { headingId: string }) {
  const [paused, setPaused] = useState(false);
  const loop = [...CLIENTS, ...CLIENTS];
  return (
    <>
      <div className="container-x flex flex-col items-start gap-3 pt-10 md:flex-row md:items-center md:justify-between">
        <h2 id={headingId} className="t-eyebrow !font-medium">
          He colaborado con
        </h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">Marcas globales · empresas industriales</p>
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg motion-reduce:hidden"
          >
            {paused ? "Reanudar" : "Pausar"} animación
          </button>
        </div>
      </div>

      <div className="marquee relative mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <ul
          className="marquee-track group/logos flex items-center"
          aria-label="Empresas con las que he colaborado"
          style={{ animationPlayState: paused ? "paused" : undefined }}
        >
          {loop.map((c, i) => (
            <ClientLogo key={`${c.slug}-${i}`} client={c} hidden={i >= CLIENTS.length} />
          ))}
        </ul>
      </div>
    </>
  );
}
