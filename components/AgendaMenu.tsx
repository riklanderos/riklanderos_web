"use client";

import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { SESSION_LIST, type Session, type SessionKey } from "@/lib/sessions";
import { track } from "@/lib/analytics";
import { useMagnetic } from "./motion";
import { Arrow } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Debajo de este ancho el panel es una hoja a todo el ancho que cuelga del header (y bloquea el scroll). */
export const AGENDA_SHEET_QUERY = "(max-width: 639px)";

/** Ruta que compara las dos sesiones a fondo. */
const COMPARE_HREF = "/agendar";

function subscribeSheet(cb: () => void) {
  const m = window.matchMedia(AGENDA_SHEET_QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/** true en móvil (hoja), false en tablet/escritorio (popover). En servidor: popover. */
function useIsSheet() {
  return useSyncExternalStore(
    subscribeSheet,
    () => window.matchMedia(AGENDA_SHEET_QUERY).matches,
    () => false,
  );
}

/* ── Identidad visual de cada sesión ─────────────────────────────
   Power: rojo (diagnóstico 1:1, pago). Discovery: crema/papel (implementación con mi equipo, sin costo). */
const TONE: Record<
  SessionKey,
  { card: string; chip: string; pill: string; cta: string; glow: string; compact: string; compactMeta: string }
> = {
  power: {
    card: "border-accent/45 hover:border-accent bg-[radial-gradient(120%_90%_at_100%_0%,rgba(229,28,30,0.22),transparent_62%)]",
    chip: "bg-accent text-white",
    pill: "border-accent/45 text-accent-text",
    cta: "text-accent-text",
    glow: "rgba(229,28,30,0.18)",
    compact: "border-accent bg-accent text-white hover:bg-accent-hover",
    compactMeta: "text-white",
  },
  discovery: {
    card: "border-paper/25 hover:border-paper/60 bg-[radial-gradient(120%_90%_at_100%_0%,rgba(235,217,192,0.11),transparent_62%)]",
    chip: "bg-paper text-paper-fg",
    pill: "border-paper/35 text-paper",
    cta: "text-paper",
    glow: "rgba(235,217,192,0.12)",
    compact: "border-paper/40 bg-elev text-fg hover:border-paper",
    compactMeta: "text-muted",
  },
};

function SessionIcon({ k, className }: { k: SessionKey; className?: string }) {
  return (
    <span aria-hidden className={clsx("grid shrink-0 place-items-center rounded-full", className)}>
      {k === "power" ? (
        // Rayo: una sesión intensa, 1:1.
        <svg viewBox="0 0 16 16" className="h-[46%] w-[46%]" fill="currentColor">
          <path d="M9.6 1 3.2 9.1h4.1L6.4 15l6.4-8.1H8.7L9.6 1Z" />
        </svg>
      ) : (
        // Nodos conectados: el sistema (agentes, CRM, automatizaciones) que implementa mi equipo.
        <svg viewBox="0 0 16 16" className="h-[50%] w-[50%]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5.4 4.2h5.2M4.6 5.6l2.6 5M11.4 5.6l-2.6 5" strokeLinecap="round" />
          <circle cx="3.6" cy="4.2" r="1.9" fill="currentColor" stroke="none" />
          <circle cx="12.4" cy="4.2" r="1.9" fill="currentColor" stroke="none" />
          <circle cx="8" cy="12.2" r="1.9" fill="currentColor" stroke="none" />
        </svg>
      )}
    </span>
  );
}

/** Una persona (1:1 conmigo) o un grupo (conmigo y mi equipo). */
function WhoIcon({ k }: { k: SessionKey }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.4">
      {k === "power" ? (
        <>
          <circle cx="8" cy="5.2" r="2.6" />
          <path d="M3 14c.6-2.7 2.6-4.2 5-4.2s4.4 1.5 5 4.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="6" cy="5.4" r="2.3" />
          <circle cx="11.4" cy="6.2" r="1.8" />
          <path d="M1.8 14c.5-2.4 2.2-3.8 4.2-3.8s3.7 1.4 4.2 3.8M10.6 10.3c1.8-.2 3.3 1 3.7 3.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** Foco de luz que sigue al cursor dentro de la tarjeta (solo variables CSS, sin re-render). */
function followPointer(e: ReactPointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function SessionCard({
  s,
  section,
  delay,
  onSelect,
}: {
  s: Session;
  section: string;
  delay: number;
  onSelect?: () => void;
}) {
  const id = useId();
  const t = TONE[s.key];
  return (
    <motion.li
      className="h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
    >
      <a
        href={s.href(section)}
        aria-label={s.cta}
        aria-describedby={`${id}k ${id}m ${id}w ${id}t`}
        onClick={() => {
          track(s.event, { section });
          onSelect?.();
        }}
        onPointerMove={followPointer}
        className={clsx(
          "group/card relative flex h-full flex-col overflow-hidden rounded-xl border bg-elev p-5 transition-[border-color] duration-300",
          t.card,
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{ background: `radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), ${t.glow}, transparent 65%)` }}
        />
        <span className="relative flex items-center justify-between gap-3">
          <SessionIcon k={s.key} className={clsx("h-10 w-10", t.chip)} />
          <span className={clsx("t-mono rounded-full border px-2.5 py-1 text-[10.5px] uppercase tracking-[0.14em]", t.pill)}>
            {s.priceNote}
          </span>
        </span>
        <span id={`${id}k`} className="t-eyebrow relative mt-4 block text-[11px] sm:mt-5">
          {s.kicker}
        </span>
        <span className="relative mt-1.5 block font-display text-[1.4rem] font-bold leading-tight tracking-[-0.025em] text-fg">
          {s.name}
        </span>
        <span id={`${id}m`} className="t-mono relative mt-2 block text-[12px] leading-relaxed text-muted">
          {s.duration} · {s.price}
        </span>
        <span id={`${id}w`} className="relative mt-1 flex items-center gap-2 text-[13px] text-fg/80">
          <WhoIcon k={s.key} />
          {s.who}
        </span>
        <span id={`${id}t`} className="relative mt-3 block text-[14.5px] leading-snug text-fg/85">
          {s.tagline}
        </span>
        <span className={clsx("relative mt-auto flex items-center gap-2 pt-4 text-[14px] font-semibold sm:pt-5", t.cta)}>
          {s.cta}
          <Arrow className="transition-transform duration-300 group-hover/card:translate-x-1" />
        </span>
      </a>
    </motion.li>
  );
}

function SessionRow({
  s,
  section,
  delay,
  onSelect,
}: {
  s: Session;
  section: string;
  delay: number;
  onSelect?: () => void;
}) {
  const t = TONE[s.key];
  return (
    <motion.li initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay }}>
      <a
        href={s.href(section)}
        onClick={() => {
          track(s.event, { section });
          onSelect?.();
        }}
        className={clsx(
          "group/row flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-[background-color,border-color] duration-300",
          t.compact,
        )}
      >
        <SessionIcon
          k={s.key}
          className={clsx("h-10 w-10", s.key === "power" ? "bg-white text-accent" : t.chip)}
        />
        <span className="min-w-0 flex-1">
          <span className={clsx("t-mono block text-[10.5px] uppercase tracking-[0.14em]", t.compactMeta)}>{s.kicker}</span>
          <span className="block font-display text-[1.2rem] font-bold leading-tight tracking-[-0.02em]">{s.name}</span>
          <span className={clsx("block text-[13px]", t.compactMeta)}>
            {s.duration} · {s.price}
          </span>
        </span>
        <Arrow className="transition-transform duration-300 group-hover/row:translate-x-1" />
      </a>
    </motion.li>
  );
}

/**
 * Las dos sesiones para elegir, a partir de SESSION_LIST.
 * "card": tarjetas lado a lado (panel del menú). "compact": filas apiladas (menú móvil).
 */
export function SessionOptions({
  section,
  variant = "card",
  delay = 0,
  onSelect,
  label,
  className,
}: {
  section: string;
  variant?: "card" | "compact";
  delay?: number;
  onSelect?: () => void;
  /** Nombre accesible de la lista (p. ej. "Agenda conmigo"). */
  label?: string;
  className?: string;
}) {
  const Item = variant === "card" ? SessionCard : SessionRow;
  return (
    <ul aria-label={label} className={clsx(variant === "card" ? "grid gap-3 sm:grid-cols-2" : "space-y-2.5", className)}>
      {SESSION_LIST.map((s, i) => (
        <Item key={s.key} s={s} section={section} delay={delay + i * 0.07} onSelect={onSelect} />
      ))}
    </ul>
  );
}

/** Enlace a la página que compara las dos sesiones. */
export function CompareLink({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href={COMPARE_HREF}
      onClick={onClick}
      className={clsx("group inline-flex items-center gap-2 text-[14px] font-medium text-fg transition-colors hover:text-accent-text", className)}
    >
      <span className="text-muted transition-colors group-hover:text-accent-text">¿Cuál me conviene?</span>
      <span className="link-underline">Compáralas</span>
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

/**
 * CTA "Agendar" del header: abre un panel con las dos sesiones (Power y Discovery) para que el cliente elija.
 * Escritorio/tablet: popover anclado a la derecha. Móvil: hoja a todo el ancho que cuelga del header.
 * Puede ser controlado (open + onOpenChange) para coordinarse con el menú móvil.
 */
export function AgendaMenu({
  open: openProp,
  onOpenChange,
  section = "navbar_menu",
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  section?: string;
}) {
  const [innerOpen, setInnerOpen] = useState(false);
  const open = openProp ?? innerOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const panelId = useId();
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const magnetic = useMagnetic<HTMLDivElement>(0.18);
  const reduce = useReducedMotion();
  const sheet = useIsSheet();

  // Los listeners leen siempre el setOpen vigente sin re-suscribirse (ni robar el foco) en cada render del padre.
  const setOpenRef = useRef(setOpen);
  useEffect(() => {
    setOpenRef.current = setOpen;
  }, [setOpen]);

  // Al abrir: el foco entra al panel (primera opción). Escape cierra y regresa el foco al botón. Clic fuera cierra.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpenRef.current(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenRef.current(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Si el foco sale del botón y del panel (Tab al final de la lista), el panel se cierra.
  const onBlur = (e: ReactFocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget;
    if (open && next instanceof Node && !e.currentTarget.contains(next)) setOpen(false);
  };

  const close = () => setOpen(false);
  const animateDecor = !open && !reduce;

  return (
    <div ref={rootRef} className="relative" onBlur={onBlur}>
      <motion.div {...magnetic} className="relative">
        {/* Halo que respira despacio (se detiene con movimiento reducido o con el panel abierto). */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full bg-accent/55 blur-md"
          initial={{ opacity: 0.3 }}
          animate={animateDecor ? { opacity: [0.3, 0.75, 0.3] } : { opacity: open ? 0 : 0.35 }}
          transition={animateDecor ? { duration: 3.8, ease: "easeInOut", repeat: Infinity } : { duration: 0.3 }}
        />
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={() => setOpen(!open)}
          className={clsx(
            "relative inline-flex h-11 items-center gap-1.5 overflow-hidden rounded-full pl-4 pr-3 text-[14px] font-semibold text-white shadow-[0_10px_28px_-10px_rgba(229,28,30,0.9)] transition-[background-color] duration-300 sm:pl-5 sm:pr-4",
            open ? "bg-accent-hover" : "bg-accent hover:bg-accent-hover",
          )}
        >
          {/* Destello que cruza el botón unas pocas veces (no infinito: anima x en el hilo principal). Siempre se renderiza (el servidor no conoce
              prefers-reduced-motion); solo se anima cuando corresponde, si no queda fuera del botón. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            style={{ skewX: -20 }}
            initial={{ x: "-150%" }}
            animate={animateDecor ? { x: ["-150%", "420%"] } : { x: "-150%" }}
            transition={
              animateDecor ? { duration: 1.15, ease: EASE, repeat: 3, repeatDelay: 5.5, delay: 1.6 } : { duration: 0 }
            }
          />
          <span className="relative">
            Agendar<span className="hidden xl:inline"> sesión</span>
          </span>
          <motion.svg
            viewBox="0 0 16 16"
            aria-hidden
            className="relative h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && sheet ? (
          <motion.div
            key="velo"
            aria-hidden
            onClick={close}
            className="fixed inset-x-0 top-[68px] h-[calc(100dvh-68px)] bg-bg/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        ) : null}
        {open ? (
          <motion.div
            key="panel"
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={clsx(
              "overflow-y-auto overscroll-contain bg-bg shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] outline-none",
              sheet
                ? "fixed inset-x-0 top-[68px] max-h-[calc(100dvh-68px)] rounded-b-2xl border-b border-line"
                : "absolute right-0 top-[calc(100%+14px)] max-h-[calc(100dvh-96px)] w-[min(40rem,calc(100vw-3.5rem))] rounded-2xl border border-line-strong",
            )}
            style={sheet ? undefined : { transformOrigin: "calc(100% - 40px) 0%" }}
            initial={sheet ? (reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }) : { opacity: 0, y: -10, scale: 0.97 }}
            animate={sheet ? (reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }) : { opacity: 1, y: 0, scale: 1 }}
            exit={
              sheet
                ? reduce
                  ? { opacity: 0, transition: { duration: 0.15 } }
                  : { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.3, ease: EASE } }
                : { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.18 } }
            }
            transition={{ duration: sheet ? 0.5 : 0.32, ease: EASE }}
          >
            {/* Línea roja superior que se dibuja al abrir. */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-accent via-accent/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            />
            <div className="px-4 py-5 sm:px-5">
              <div className="flex items-end justify-between gap-4 px-0.5 pb-4">
                <div>
                  <p className="t-eyebrow flex items-center gap-3">
                    <span aria-hidden className="h-px w-6 bg-accent" />
                    Agenda conmigo
                  </p>
                  <p id={titleId} className="mt-2 font-display text-[1.25rem] font-bold leading-tight tracking-[-0.025em] text-fg">
                    ¿Diagnóstico o implementación?
                  </p>
                </div>
                <p className="hidden max-w-[15rem] text-right text-[13px] leading-snug text-muted sm:block">
                  Dos formas de empezar. Elige la que va con tu momento.
                </p>
              </div>
              <SessionOptions section={section} variant="card" delay={0.06} onSelect={close} />
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4">
                <CompareLink onClick={close} />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
