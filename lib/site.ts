import BLOG_INDICE from "@/content/blog/indice.json";

export const SITE = {
  name: "Rik Landeros",
  url: "https://www.riklanderos.tech",
  title: "Rik Landeros — Consultor de IA para empresas · Fundador de Ingeniak",
  description:
    "Consultor de inteligencia artificial para empresas y fundador de Ingeniak. 14 años en marketing. Leo tu negocio completo, te digo qué te está frenando y construyo el sistema —branding, marketing, ventas e IA en el orden correcto— que lo hace crecer sin ti.",
  locale: "es_MX",
  /** Página única de cada sesión: información, video y agenda (Google Calendar + Stripe). Absoluta para JSON-LD; los enlaces usan la ruta relativa. */
  powerSessionUrl: "https://www.riklanderos.tech/power-session",
  powerSessionAmount: 297,
  powerSessionCurrency: "USD",
  powerSessionPrice: "297 USD",
  /** Discovery Session: 30 min sin costo para diagnosticar la operación (CTA del VSL "La silla vacía"). */
  discoverySessionUrl: "https://www.riklanderos.tech/discovery",
  ingeniakUrl: "https://ingeniak.mx",
  email: "hola@riklanderos.com",
  socials: {
    instagram: "https://instagram.com/riklanderos",
    // Pendiente (spec §10.7): reemplazar con las URLs reales.
    linkedin: "https://www.linkedin.com/in/riklanderos",
    youtube: "https://www.youtube.com/@riklanderos",
  },
} as const;

/**
 * Base de Open Graph para cada página. Next reemplaza (no fusiona) el objeto
 * openGraph por segmento: sin esto se pierden og:site_name y og:locale.
 */
export const OG_BASE = {
  siteName: SITE.name,
  locale: SITE.locale,
  type: "website" as const,
  images: [{ url: "/og/og-riklanderos-v2.jpg", width: 1200, height: 630, alt: "Rik Landeros — Consultor de IA para empresas" }],
};

/** El blog entra al menú solo cuando ya tiene artículos publicados (content/blog/indice.json). */
const HAY_BLOG = (BLOG_INDICE as unknown[]).length > 0;

export const NAV_LINKS = [
  { href: "/metodo", label: "Método" },
  { href: "/trabajar-conmigo", label: "Trabajar conmigo" },
  { href: "/casos", label: "Casos" },
  { href: "/historia", label: "Historia" },
  { href: "/radikales", label: "Radikales" },
  { href: "/recursos", label: "Recursos" },
  ...(HAY_BLOG ? [{ href: "/blog", label: "Blog" }] : []),
] as const;

/**
 * Enlace interno a la agenda con la sección de origen en ?desde= (no UTMs: en enlaces internos reinician la
 * sesión de analítica). La agenda guarda ese origen en la descripción del evento de Google Calendar.
 */
function bookingHref(url: string, section: string) {
  return `${new URL(url).pathname}?${new URLSearchParams({ desde: section }).toString()}`;
}

/** Ruta de la agenda de la Power Session con la sección de origen (spec §9.2). */
export function powerSessionHref(section: string) {
  return bookingHref(SITE.powerSessionUrl, section);
}

/** Ruta de la agenda de la Discovery Session con la sección de origen. */
export function discoverySessionHref(section: string) {
  return bookingHref(SITE.discoverySessionUrl, section);
}
