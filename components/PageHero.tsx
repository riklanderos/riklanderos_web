import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { Backdrop } from "./Backdrop";
import { Reveal, SplitWords } from "./motion";
import { Eyebrow } from "./ui";

/** Saca "x y" de una clase object-[x_y] (compatibilidad con el antiguo imageClassName). */
function focusFrom(cls?: string) {
  const m = cls?.match(/object-\[([^\]]+)\]/);
  return m ? m[1].replace(/_/g, " ") : undefined;
}

/**
 * Encabezado estándar de páginas internas: eyebrow mono + H1 (único por página) revelado por palabras +
 * subhead + acciones opcionales. Con imagen, la foto es el fondo del hero (un lado en desktop, arriba en
 * móvil) y el texto va del otro lado, no una tarjeta suelta.
 *
 * La foto empieza debajo del menú fijo (3.5rem en móvil, 4rem en desktop) para que la cabeza no quede
 * tapada; el fundido superior de la Backdrop la une con el negro. En móvil el texto arranca sobre el
 * fundido inferior de la foto.
 */
export function PageHero({
  eyebrow,
  title,
  accentWords = [],
  lead,
  actions,
  image,
  imageAlt = "",
  imageClassName,
  imageFocus,
  imageFocusLg,
  imageSide = "right",
  imageWidth = "58%",
  imageMobileHeight = "min(112vw, 620px)",
  imageMono = false,
}: {
  eyebrow: string;
  title: string;
  accentWords?: string[];
  lead?: ReactNode;
  actions?: ReactNode;
  image?: string;
  imageAlt?: string;
  /** @deprecated Usa imageFocus. Se lee solo la clase object-[x_y]. */
  imageClassName?: string;
  /** object-position de la foto en móvil (y en desktop si no hay imageFocusLg): "50% 30%". */
  imageFocus?: string;
  imageFocusLg?: string;
  imageSide?: "left" | "right";
  /** Ancho del panel de la foto en desktop ("58%"; más ancho para fotos horizontales). */
  imageWidth?: string;
  /** Alto de la foto en móvil (CSS). Para fotos horizontales conviene algo más bajo: "min(84vw, 520px)". */
  imageMobileHeight?: string;
  imageMono?: boolean;
}) {
  const focus = imageFocus ?? focusFrom(imageClassName) ?? "50% 25%";
  return (
    <section
      className={clsx(
        "relative isolate overflow-hidden pb-16 lg:pb-24",
        image ? "lg:flex lg:min-h-[min(86svh,820px)] lg:items-center lg:pt-32" : "pt-32 lg:pt-44",
      )}
    >
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-60" />
      {image ? (
        <Backdrop
          src={image}
          alt={imageAlt}
          side={imageSide}
          width={imageWidth}
          focus={focus}
          focusLg={imageFocusLg}
          mono={imageMono}
          mobileHeight={imageMobileHeight}
          reveal="load"
          priority
          className="top-14 lg:top-16"
        />
      ) : (
        <div
          aria-hidden
          className="absolute -z-10 right-[-15%] top-0 h-[60vh] w-[55vw] rounded-full opacity-[0.16] blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
        />
      )}
      <div
        className={clsx("container-x relative w-full", image && "pt-[calc(var(--ph-h)-3.5rem)] lg:pt-0")}
        style={image ? ({ "--ph-h": imageMobileHeight } as CSSProperties) : undefined}
      >
        <div
          className={clsx(
            // Con foto: entre 1024 y 1279 px el texto se queda en 48 % para no cruzar la cara ni las manos.
            image ? "max-w-[640px] lg:max-w-[48%] xl:max-w-[54%]" : "max-w-[980px]",
            image && imageSide === "left" && "lg:ml-auto",
          )}
        >
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <SplitWords
            as="h1"
            className={clsx("t-h1 mt-6", image && "lg:text-[clamp(3.4rem,5.5vw,5.25rem)]")}
            text={title}
            accentWords={accentWords}
            immediate
          />
          {lead ? (
            <Reveal delay={0.35}>
              <div className={clsx("t-lead mt-8 max-w-[640px]", image && "text-fg/80")}>{lead}</div>
            </Reveal>
          ) : null}
          {actions ? (
            <Reveal delay={0.5} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              {actions}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
