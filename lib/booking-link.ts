import type { MouseEvent } from "react";

/**
 * Si el CTA apunta a la página en la que ya estás (/power-session o /discovery), baja al formulario (#agenda)
 * en vez de recargar la página desde el inicio.
 */
export function scrollIfSamePage(e: MouseEvent<HTMLAnchorElement>, href: string) {
  if (typeof window === "undefined") return;
  if (new URL(href, window.location.href).pathname !== window.location.pathname) return;
  const target = document.getElementById("agenda");
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
