import Image from "next/image";
import { CLIENTS, type ClientSlug } from "@/lib/content";
import { Stagger, StaggerItem } from "@/components/motion";

/** Logos en negro sobre papel. Alto por logo; archivo y tamaño intrínseco viven en CLIENTS. */
const LOGO_CLS: Record<ClientSlug, string> = {
  cocacola: "h-12 md:h-14",
  nike: "h-8 md:h-9",
  bmw: "h-9 md:h-10",
  cemex: "h-5 md:h-6",
  argi: "h-7 md:h-8",
  tierrayarmonia: "h-9 md:h-10",
};

export function PaperClients() {
  return (
    <div>
      <p className="t-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-paper-muted">
        <span aria-hidden className="h-px w-6 bg-accent" />
        Marcas y empresas con las que he colaborado
      </p>
      <Stagger
        as="ul"
        className="group/logos mt-6 grid grid-cols-2 border-l border-t border-paper-fg/15 sm:grid-cols-3"
        stagger={0.07}
      >
        {CLIENTS.map((c) => {
          const l = c.logo;
          return (
            <StaggerItem
              as="li"
              key={c.slug}
              className="logo-cell group/cell flex h-24 items-center justify-center border-b border-r border-paper-fg/15 px-6 transition-colors duration-500 hover:bg-paper-soft md:h-28"
            >
              {l ? (
                <Image
                  src={l.src}
                  alt={c.name}
                  width={l.w}
                  height={l.h}
                  unoptimized
                  className={`${LOGO_CLS[c.slug]} w-auto opacity-75 brightness-0 transition-[opacity,scale] duration-500 ease-[var(--ease-out)] group-hover/logos:opacity-35 group-hover/cell:scale-110 group-hover/cell:opacity-100!`}
                />
              ) : (
                <span className="font-display text-lg font-bold tracking-tight">{c.name}</span>
              )}
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
