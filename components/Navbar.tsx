"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { NAV_LINKS } from "@/lib/site";
import { AGENDA_SHEET_QUERY, AgendaMenu, CompareLink, SessionOptions } from "./AgendaMenu";
import { Logo } from "./Logo";

const MOBILE_LINKS = [{ href: "/", label: "Inicio" }, ...NAV_LINKS, { href: "/contacto", label: "Contacto" }];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [agendaOpen, setAgendaOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Al cambiar de ruta se cierran el menú móvil y el panel de agenda.
  useEffect(() => {
    setOpen(false);
    setAgendaOpen(false);
  }, [pathname]);

  // El panel de agenda y el menú móvil nunca están abiertos a la vez.
  const onAgendaChange = useCallback((next: boolean) => {
    setAgendaOpen(next);
    if (next) setOpen(false);
  }, []);

  // Bloquea el scroll con el menú móvil abierto o con la hoja de agenda (solo móvil; en escritorio es un popover).
  useEffect(() => {
    const lock = open || (agendaOpen && window.matchMedia(AGENDA_SHEET_QUERY).matches);
    document.documentElement.style.overflow = lock ? "hidden" : "";
  }, [open, agendaOpen]);

  // Menú móvil como diálogo: vuelve inerte el resto, enfoca el primer enlace y cierra con Escape.
  useEffect(() => {
    const main = document.getElementById("contenido");
    const footer = document.querySelector("footer");
    if (main) main.inert = open;
    if (footer) footer.inert = open;
    if (!open) return;
    document.querySelector<HTMLAnchorElement>("#menu-movil a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open || agendaOpen;

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500",
          solid ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent bg-transparent",
        )}
      >
        <nav className="container-x flex h-[68px] items-center justify-between gap-3 sm:gap-6" aria-label="Principal">
          <Link href="/" className="flex min-w-0 items-center gap-3 text-fg" aria-label="Rik Landeros — inicio">
            <Logo variant="iso" className="h-7 w-auto shrink-0 text-accent" />
            <span className="t-mono whitespace-nowrap text-[13px] font-semibold tracking-[0.22em] max-[359px]:hidden max-[389px]:tracking-[0.14em]">
              RIK LANDEROS
            </span>
          </Link>

          <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={clsx(
                      "link-underline whitespace-nowrap text-[14px] transition-colors",
                      active ? "text-fg" : "text-muted hover:text-fg",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              ref={toggleRef}
              type="button"
              className="relative grid h-11 w-11 place-items-center rounded-full border border-line-strong transition-colors hover:border-fg lg:hidden"
              aria-expanded={open}
              aria-controls={open ? "menu-movil" : undefined}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => {
                setAgendaOpen(false);
                setOpen((v) => !v);
              }}
            >
              <span
                className={clsx(
                  "absolute h-px w-5 bg-fg transition-transform duration-300",
                  open ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={clsx(
                  "absolute h-px w-5 bg-fg transition-transform duration-300",
                  open ? "-rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
            {/* CTA fijo en la orilla derecha: abre las dos sesiones para elegir. */}
            <AgendaMenu open={agendaOpen} onOpenChange={onAgendaChange} section="navbar_menu" />
          </div>
        </nav>
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-accent"
          style={{ scaleX: progress }}
        />
      </header>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="menu-movil"
            aria-label="Menú móvil"
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-bg pt-[68px] lg:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-x flex min-h-full flex-col justify-between gap-8 pb-8 pt-3">
              <ul>
                {MOBILE_LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.04, duration: 0.5 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === l.href ? "page" : undefined}
                      className="flex items-baseline gap-4 border-b border-line py-3 font-display text-[1.6rem] font-bold tracking-tight"
                    >
                      <span className="t-mono text-xs text-accent-text">{String(i).padStart(2, "0")}</span>
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 + MOBILE_LINKS.length * 0.04, duration: 0.5 }}
              >
                <p className="t-eyebrow mb-3 flex items-center gap-3">
                  <span aria-hidden className="h-px w-6 bg-accent" />
                  Agenda conmigo
                </p>
                <SessionOptions
                  section="menu_movil"
                  variant="compact"
                  label="Agenda conmigo"
                  delay={0.2 + MOBILE_LINKS.length * 0.04}
                  onSelect={() => setOpen(false)}
                />
                <CompareLink className="mt-4" onClick={() => setOpen(false)} />
              </motion.div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
