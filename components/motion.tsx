"use client";

import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Disparo de entrada: basta con que asome cualquier parte del bloque ("some").
 * Un umbral proporcional (p. ej. 25%) nunca se alcanza en bloques más altos que
 * el viewport (zoom 400%, móviles), y el contenido se quedaría invisible.
 * El margen inferior negativo conserva la sensación de "entrar" al hacer scroll.
 */
const ENTER_VIEWPORT = { once: true, amount: "some", margin: "0px 0px -12% 0px" } as const;

const PUNCT = /[.,:;¿?¡!]/g;

/**
 * Con movimiento reducido, MotionConfig reducedMotion="user" solo frena transform y layout;
 * clip-path y pathLength siguen animándose. Para esos casos se usa una transición instantánea
 * (no se cambia `initial`: el HTML del servidor debe coincidir con el primer render del cliente).
 */
const INSTANT = { duration: 0 } as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "article" | "span" | "p" | "header" | "figure";
  /** @deprecated Se ignora: la entrada se dispara con cualquier parte visible (ver ENTER_VIEWPORT). */
  amount?: number;
};

/** Entrada sutil: fade + translate (spec §4.5), una sola vez por elemento. */
export function Reveal({ children, className, delay = 0, y = 16, as = "div" }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={ENTER_VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: (stagger: number = 0.08) => ({ transition: { staggerChildren: stagger } }),
};
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

/** Contenedor que escalona la entrada de sus hijos directos. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol" | "dl";
  /** @deprecated Se ignora: la entrada se dispara con cualquier parte visible (ver ENTER_VIEWPORT). */
  amount?: number;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={staggerParent}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={ENTER_VIEWPORT}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={staggerChild}>
      {children}
    </Comp>
  );
}

/**
 * Titular que se revela palabra por palabra desde una máscara.
 * Acepta texto plano o nodos (cada hijo directo se trata como bloque).
 */
export function SplitWords({
  text,
  id,
  className,
  as = "h2",
  delay = 0,
  accentWords = [],
  immediate = false,
}: {
  text: string;
  id?: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  accentWords?: string[];
  immediate?: boolean;
}) {
  const Comp = as;
  const words = text.split(" ");
  // Se normalizan ambos lados: "cruda." en accentWords debe coincidir con la palabra "cruda." del texto.
  const accentSet = new Set(accentWords.map((a) => a.replace(PUNCT, "")));
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const show = immediate || inView;
  return (
    <Comp ref={ref} id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => {
          const clean = w.replace(PUNCT, "");
          const accent = accentSet.has(clean);
          return (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
              <motion.span
                className={`inline-block ${accent ? "text-accent" : ""}`}
                initial={{ y: "105%" }}
                animate={show ? { y: "0%" } : { y: "105%" }}
                transition={{ duration: 0.85, ease: EASE, delay: delay + i * 0.045 }}
              >
                {w}
              </motion.span>
              {i < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </span>
    </Comp>
  );
}

/** Número que cuenta hacia arriba al entrar en pantalla. */
export function CountUp({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
}: {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(from);
  const rounded = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString("es-MX")}${suffix}`);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(to);
      return;
    }
    const controls = animate(mv, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, reduce, to, duration, mv]);
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${prefix}${to}${suffix}`}</span>
      <motion.span aria-hidden="true">{rounded}</motion.span>
    </span>
  );
}

/** Trazo SVG que se "dibuja" al entrar en viewport (stroke-dashoffset). */
export function DrawPath({
  d,
  className,
  delay = 0,
  duration = 1.6,
  stroke = "currentColor",
  strokeWidth = 1.5,
}: {
  d: string;
  className?: string;
  delay?: number;
  duration?: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.path
      d={d}
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={reduce ? INSTANT : { pathLength: { duration, ease: EASE, delay }, opacity: { duration: 0.2, delay } }}
    />
  );
}

/**
 * Imagen con revelado por máscara (clip-path) al entrar en pantalla.
 * La detección de viewport vive en el contenedor (sin clip-path): un elemento
 * recortado al 100% no cuenta como visible para IntersectionObserver.
 */
export function MaskReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();
  const from = direction === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  // Con movimiento reducido la imagen aparece de inmediato, sin esperar al viewport.
  const shown = inView || reduce;
  return (
    <div ref={ref} className={className}>
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: from }}
        animate={shown ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath: from }}
        transition={reduce ? INSTANT : { duration: 1.2, ease: EASE, delay }}
      >
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: 1.12 }}
          animate={shown ? { scale: 1 } : { scale: 1.12 }}
          transition={reduce ? INSTANT : { duration: 1.6, ease: EASE, delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}


/**
 * Parallax de scroll: el contenido se desplaza `distance` px en sentido contrario al scroll mientras
 * cruza el viewport. Sin efecto con movimiento reducido.
 */
export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Segura para la hidratación: el servidor no conoce la preferencia de movimiento reducido.
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const moving = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const still = useMotionValue(0);
  return (
    <motion.div ref={ref} className={className} style={{ y: reduce ? still : moving }}>
      {children}
    </motion.div>
  );
}

/**
 * Efecto magnético para CTAs: el elemento sigue un poco al cursor y regresa con resorte.
 * Solo con mouse (no en táctil) y nunca con movimiento reducido. Devuelve props para un motion.*.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.35 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.35 });
  const onPointerMove = (e: ReactPointerEvent<T>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };
  return { ref, style: { x, y }, onPointerMove, onPointerLeave };
}

/**
 * Tarjeta con inclinación 3D sutil y foco de luz que sigue al cursor (variables --mx/--my que usa
 * la clase .spotlight de globals.css). Solo con mouse; con movimiento reducido queda estática.
 */
export function Tilt({
  children,
  className,
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 180, damping: 20, mass: 0.5 });
  const ry = useSpring(0, { stiffness: 180, damping: 20, mass: 0.5 });
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (reduce) return;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
  };
  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Capa de animación v2: tarjetas vivas, rieles ligados al scroll,
   tipografía cinética y trazos de cierre. Todo con motion values
   (sin estado de React por frame) y respetando movimiento reducido.
   ────────────────────────────────────────────────────────────── */

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>["offset"]>;

const noopSubscribe = () => () => {};

/**
 * Movimiento reducido sin romper la hidratación: devuelve false en el render de hidratación (igual que el
 * servidor) y la preferencia real justo después. Úsalo cuando la preferencia cambia valores de `style`
 * (motion values), que el servidor no puede conocer.
 */
export function useSafeReducedMotion() {
  const reduce = useReducedMotion();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return hydrated && !!reduce;
}

const TILT_SPRING = { stiffness: 180, damping: 20, mass: 0.5 } as const;
const RAIL_SPRING = { stiffness: 140, damping: 30, mass: 0.35 } as const;

/**
 * Tarjeta viva: inclinación 3D sutil + foco de luz que sigue al cursor (alimenta --mx/--my para las
 * clases .spot y .spotlight) + entrada.
 * - reveal="stagger": dentro de <Stagger> (hereda sus variantes y entra escalonada).
 * - reveal="view": entrada propia al aparecer (con `delay`).
 * - reveal="none": sin entrada (cuando ya la anima un contenedor).
 * - max={0}: solo foco de luz, sin inclinar (rejillas unidas, tarjetas con formulario).
 * Para elevar en hover usa `hover:-translate-y-1` + `transition-[translate,...]` (nunca `transform`
 * en la transición CSS: lo controla motion).
 */
export function TiltCard({
  children,
  className,
  as = "div",
  max = 4,
  reveal = "stagger",
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  max?: number;
  reveal?: "stagger" | "view" | "none";
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(0, TILT_SPRING);
  const ry = useSpring(0, TILT_SPRING);
  const tilt = max > 0;
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (reduce || !tilt) return;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
  };
  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };
  const Comp = motion[as] as typeof motion.div;
  const entry =
    reveal === "stagger"
      ? { variants: staggerChild }
      : reveal === "view"
        ? {
            initial: { opacity: 0, y: 18 },
            whileInView: { opacity: 1, y: 0 },
            viewport: ENTER_VIEWPORT,
            transition: { duration: 0.7, ease: EASE, delay },
          }
        : {};
  return (
    <Comp
      ref={ref}
      id={id}
      className={className}
      style={tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 1100 } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...entry}
    >
      {children}
    </Comp>
  );
}

/**
 * Línea que se dibuja con el scroll (scaleX / scaleY ligado al progreso, suavizado con resorte).
 * El elemento debe ser de bloque (p. ej. `absolute`) y llevar su `origin-*`. Con movimiento reducido
 * queda dibujada completa.
 */
export function ScrollLine({
  className,
  axis = "x",
  offset = ["start 85%", "end 55%"],
}: {
  className?: string;
  axis?: "x" | "y";
  offset?: ScrollOffset;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const smooth = useSpring(scrollYProgress, RAIL_SPRING);
  const full = useMotionValue(1);
  const v = reduce ? full : smooth;
  return <motion.span ref={ref} aria-hidden className={className} style={axis === "x" ? { scaleX: v } : { scaleY: v }} />;
}

/**
 * Franja de tipografía cinética: el contenido se repite y se desplaza en horizontal mientras la franja
 * cruza el viewport. Decorativa (aria-hidden): el texto real vive en el titular de la sección.
 * `distance` es el % del ancho de la pista; con `repeat` = 4 y 25% se recorre exactamente una copia.
 */
export function ScrollMarquee({
  children,
  className,
  trackClassName,
  direction = "left",
  repeat = 4,
  distance = 25,
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  direction?: "left" | "right";
  repeat?: number;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const range = direction === "left" ? ["0%", `-${distance}%`] : [`-${distance}%`, "0%"];
  const x = useTransform(scrollYProgress, [0, 1], reduce ? [range[0], range[0]] : range);
  return (
    <div ref={ref} aria-hidden="true" className={`overflow-hidden ${className ?? ""}`}>
      <motion.div className={`flex w-max whitespace-nowrap ${trackClassName ?? ""}`} style={{ x }}>
        {Array.from({ length: repeat }, (_, i) => (
          <span key={i} className="flex shrink-0 items-center">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Revelado de izquierda a derecha con clip-path, como una brocha que pinta (ideal para la tipografía
 * Native Brush). La detección vive en el contenedor sin recorte. Con movimiento reducido aparece de inmediato.
 */
export function WipeReveal({
  children,
  className,
  delay = 0,
  duration = 1.15,
  as = "span",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: "span" | "div" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const shown = inView || reduce;
  // Márgenes negativos: los trazos de brocha se salen de la caja de la línea.
  const hidden = "inset(-30% 100% -30% -6%)";
  const visible = "inset(-30% -6% -30% -6%)";
  const Comp = as as ElementType;
  return (
    <Comp ref={ref} className={className}>
      <motion.span
        className="block"
        initial={{ clipPath: hidden }}
        animate={{ clipPath: shown ? visible : hidden }}
        transition={reduce ? INSTANT : { duration, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </Comp>
  );
}

/**
 * Forma SVG que primero se traza (contorno) y luego se rellena; el contorno se desvanece al final.
 * Pensada para el isotipo. Va dentro de un <svg> con su viewBox.
 */
export function DrawShape({
  d,
  className,
  color = "currentColor",
  strokeWidth = 1.4,
  delay = 0,
  duration = 1.8,
}: {
  d: string;
  className?: string;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.path
      d={d}
      className={className}
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, fillOpacity: 0, strokeOpacity: 1 }}
      whileInView={{ pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={
        reduce
          ? INSTANT
          : {
              pathLength: { duration, ease: EASE, delay },
              fillOpacity: { duration: 0.8, ease: EASE, delay: delay + duration * 0.7 },
              strokeOpacity: { duration: 0.6, delay: delay + duration },
            }
      }
    />
  );
}

/** Filete que se traza de izquierda a derecha (o al revés) al entrar en pantalla. */
export function LineReveal({ className, delay = 0, from = "left" }: { className?: string; delay?: number; from?: "left" | "right" }) {
  return (
    <motion.span
      aria-hidden
      className={className}
      style={{ originX: from === "left" ? 0 : 1 }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      // Sin margen inferior: un filete al final de la página también debe poder trazarse.
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    />
  );
}

/**
 * Capa decorativa con parallax de scroll (retículas, puntos, texturas, números grandes): se desplaza
 * `distance` px en sentido contrario al scroll mientras cruza el viewport. Igual que <Parallax>, pero segura
 * para la hidratación con movimiento reducido (con reduce queda quieta tras montar, sin desajuste SSR).
 */
export function ParallaxLayer({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const moving = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const still = useMotionValue(0);
  return (
    <motion.div ref={ref} className={className} style={{ y: reduce ? still : moving }}>
      {children}
    </motion.div>
  );
}
