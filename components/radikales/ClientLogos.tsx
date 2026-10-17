import Image from "next/image";
import clsx from "clsx";
import { CLIENTS, type ClientSlug } from "@/lib/content";
import { Stagger, StaggerItem } from "../motion";

/** Alto de cada logo en esta rejilla (archivo y tamaño intrínseco viven en CLIENTS). */
const LOGO_CLS: Record<ClientSlug, string> = {
  cocacola: "h-12 md:h-14",
  nike: "h-7 md:h-8",
  bmw: "h-9 md:h-10",
  cemex: "h-5 md:h-6",
  argi: "h-7 md:h-8",
  tierrayarmonia: "h-10 md:h-12",
};

/** Rejilla estática de marcas con las que Rik ha colaborado (lib/content CLIENTS). */
export function ClientLogos({ label = "Marcas con las que he colaborado", className }: { label?: string; className?: string }) {
  return (
    <div className={className}>
      <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <Stagger
        as="ul"
        className="group/logos mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-3"
        stagger={0.06}
      >
        {CLIENTS.map((c) => {
          const l = c.logo;
          return (
            <StaggerItem
              as="li"
              key={c.slug}
              className="logo-cell group/cell flex h-20 items-center justify-center bg-bg px-6 transition-colors duration-500 hover:bg-elev md:h-24"
            >
              {l ? (
                <Image
                  src={l.src}
                  alt={c.name}
                  width={l.w}
                  height={l.h}
                  unoptimized
                  className={clsx(
                    LOGO_CLS[c.slug],
                    "w-auto max-w-full opacity-70 brightness-0 invert transition-[opacity,scale] duration-500 ease-[var(--ease-out)] group-hover/logos:opacity-35 group-hover/cell:scale-110 group-hover/cell:opacity-100!",
                  )}
                />
              ) : (
                <span className="font-display text-lg font-bold">{c.name}</span>
              )}
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
