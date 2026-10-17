import Image from "next/image";
import clsx from "clsx";
import { CLIENTS, type ClientSlug } from "@/lib/content";
import { Stagger, StaggerItem } from "../motion";

/** Alto de cada logo en esta rejilla (archivo y tamaño intrínseco viven en CLIENTS). */
const LOGO_CLS: Record<ClientSlug, string> = {
  cocacola: "h-10 md:h-12",
  nike: "h-7 md:h-8",
  bmw: "h-9 md:h-10",
  cemex: "h-5 md:h-6",
  argi: "h-7 md:h-8",
  tierrayarmonia: "h-9 md:h-11",
};

/** Rejilla estática de logos de empresas con las que Rik ha colaborado. */
export function ClientLogos({
  className,
  tone = "dark",
  wide = true,
}: {
  className?: string;
  tone?: "dark" | "elev";
  /** true: 6 columnas en desktop (ancho completo). false: 3 columnas (columna estrecha). */
  wide?: boolean;
}) {
  return (
    <div className={clsx("overflow-hidden rounded-[12px] border border-line", className)}>
      <Stagger as="ul" className={clsx("group/logos -mb-px -mr-px grid grid-cols-2 sm:grid-cols-3", wide && "lg:grid-cols-6")} stagger={0.07}>
        {CLIENTS.map((c) => {
          const l = c.logo;
          return (
            <StaggerItem
              as="li"
              key={c.slug}
              className={clsx(
                "logo-cell group/cell flex h-24 items-center justify-center border-b border-r border-line px-6 transition-colors duration-500 md:h-28",
                tone === "elev" ? "bg-elev hover:bg-elev-2" : "bg-bg hover:bg-elev",
              )}
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
                    "w-auto max-w-full opacity-60 brightness-0 invert transition-[opacity,scale] duration-500 ease-[var(--ease-out)] group-hover/logos:opacity-35 group-hover/cell:scale-110 group-hover/cell:opacity-100!",
                  )}
                />
              ) : (
                <span className="t-mono text-xs uppercase tracking-[0.14em] text-muted">{c.name}</span>
              )}
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
