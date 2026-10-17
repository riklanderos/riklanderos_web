"use client";

import Image from "next/image";
import clsx from "clsx";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { useSafeReducedMotion } from "./motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const INSTANT = { duration: 0 } as const;

/**
 * Foto de fondo de sección (no como pieza suelta): la imagen ocupa un lado de la sección en desktop y se
 * funde con el negro del sitio hacia el lado del texto, arriba y abajo. En móvil va arriba a todo el ancho
 * ("top", el contenido debe dejarle espacio con padding superior) o cubre la sección con un velo ("cover").
 * Entra con fade + zoom-out lento y tiene parallax suave con el scroll (nada de eso con movimiento reducido).
 *
 * La sección que la contiene debe ser `relative isolate overflow-hidden`; la Backdrop va en -z-10.
 * Con mobile="top", el contenido necesita BACKDROP_TOP_PAD (lib/backdrop.ts) para empezar debajo de la foto.
 * Funciona mejor con fotos de fondo negro (todas las de /img/rik-*).
 */
export function Backdrop({
  src,
  alt = "",
  side = "right",
  width = "58%",
  focus = "50% 25%",
  focusLg,
  mobile = "top",
  mobileHeight = "min(112vw, 620px)",
  mono = false,
  glow = true,
  priority = false,
  reveal = "view",
  sizes,
  className,
}: {
  src: string;
  /** Vacío = decorativa (aria-hidden). */
  alt?: string;
  /** Lado de la foto en desktop; el texto va del otro lado. */
  side?: "left" | "right";
  /** Ancho del panel de la foto en desktop (CSS: "58%", "100%"). */
  width?: string;
  /** object-position en móvil (y en desktop si no hay focusLg). */
  focus?: string;
  focusLg?: string;
  mobile?: "top" | "cover";
  /** Alto de la foto en móvil cuando mobile="top". */
  mobileHeight?: string;
  mono?: boolean;
  /** Resplandor rojo detrás del sujeto, como la luz de borde de las fotos. */
  glow?: boolean;
  priority?: boolean;
  /** "load": entra al cargar (heroes). "view": entra al aparecer en pantalla. */
  reveal?: "load" | "view";
  sizes?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // El rango del parallax va en style: usa la versión segura para no desajustar la hidratación con reduce.
  const still = useSafeReducedMotion();
  const moving = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const resting = useMotionValue("0%");
  const y = still ? resting : moving;

  const vars = {
    "--bd-w": width,
    "--bd-h": mobileHeight,
    "--bd-pos": focus,
    "--bd-pos-lg": focusLg ?? focus,
  } as CSSProperties;

  const enter = reveal === "load" ? { animate: { opacity: 1 } } : { whileInView: { opacity: 1 }, viewport: { once: true, amount: 0.05 } };
  const zoom = reveal === "load" ? { animate: { scale: 1 } } : { whileInView: { scale: 1 }, viewport: { once: true, amount: 0.05 } };
  const toText = side === "right" ? "lg:bg-gradient-to-r" : "lg:bg-gradient-to-l";

  return (
    <div
      ref={ref}
      aria-hidden={alt ? undefined : true}
      className={clsx("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      style={vars}
    >
      <motion.div
        className={clsx(
          "absolute overflow-hidden",
          mobile === "top" ? "inset-x-0 top-0 h-(--bd-h)" : "inset-0",
          "lg:inset-y-0 lg:h-auto lg:w-(--bd-w)",
          side === "right" ? "lg:left-auto lg:right-0" : "lg:left-0 lg:right-auto",
        )}
        initial={{ opacity: 0 }}
        {...enter}
        transition={reduce ? INSTANT : { duration: 1.2, ease: EASE }}
      >
        <motion.div className="absolute inset-x-0 -inset-y-[7%]" style={{ y }}>
          <motion.div
            className="relative h-full w-full"
            initial={{ scale: 1.12 }}
            {...zoom}
            transition={reduce ? INSTANT : { duration: 2.2, ease: EASE }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes={sizes ?? `(min-width: 1024px) ${width === "100%" ? "100vw" : "60vw"}, 100vw`}
              className={clsx(
                "object-cover [object-position:var(--bd-pos)] lg:[object-position:var(--bd-pos-lg)]",
                mono && "grayscale",
              )}
            />
          </motion.div>
        </motion.div>
        {/* Fundidos del panel: hacia el texto (desktop), abajo y arriba */}
        <div className={clsx("absolute inset-0 lg:from-bg lg:via-bg/25 lg:via-30% lg:to-transparent lg:to-70%", toText)} />
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-bg via-bg/60 to-transparent lg:h-[30%]" />
        <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-bg/90 to-transparent" />
      </motion.div>

      {/* Velo para legibilidad: en móvil "cover" oscurece todo; en desktop, solo el lado del texto */}
      {mobile === "cover" ? <div className="absolute inset-0 bg-bg/72 lg:hidden" /> : null}
      <div
        className={clsx(
          "absolute inset-0 hidden lg:block from-bg/85 via-bg/15 via-45% to-transparent",
          side === "right" ? "bg-gradient-to-r" : "bg-gradient-to-l",
        )}
      />

      {glow ? (
        <motion.div
          className={clsx(
            "absolute top-[10%] h-[70%] w-[60%] rounded-full opacity-0 blur-[110px] mix-blend-screen",
            side === "right" ? "right-[-12%]" : "left-[-12%]",
          )}
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
          initial={{ opacity: 0 }}
          {...(reveal === "load" ? { animate: { opacity: 0.22 } } : { whileInView: { opacity: 0.22 }, viewport: { once: true } })}
          transition={reduce ? INSTANT : { duration: 1.6, ease: EASE, delay: 0.3 }}
        />
      ) : null}
    </div>
  );
}

