export const SITE = {
  name: "Rik Landeros",
  url: "https://www.riklanderos.tech",
  title: "Rik Landeros — Consultor de IA para empresas · Fundador de Ingeniak",
  description:
    "Consultor de inteligencia artificial para empresas y fundador de Ingeniak. 14 años en marketing. Leo tu negocio completo, te digo qué te está frenando y construyo el sistema —branding, marketing, ventas e IA en el orden correcto— que lo hace crecer sin ti.",
  locale: "es_MX",
  powerSessionUrl: "https://agenda.ingeniak.tech/powersession",
  powerSessionAmount: 297,
  powerSessionCurrency: "USD",
  powerSessionPrice: "297 USD",
  /** Discovery Session de Ingeniak: 30 min para diagnosticar la operación (CTA del VSL "La silla vacía"). */
  discoverySessionUrl: "https://agenda.ingeniak.tech/discovery",
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
  images: [{ url: "/og/og-riklanderos.jpg", width: 1200, height: 630, alt: "Rik Landeros — Consultor de IA para empresas" }],
};

export const NAV_LINKS = [
  { href: "/metodo", label: "Método" },
  { href: "/trabajar-conmigo", label: "Trabajar conmigo" },
  { href: "/casos", label: "Casos" },
  { href: "/historia", label: "Historia" },
  { href: "/radikales", label: "Radikales" },
  { href: "/recursos", label: "Recursos" },
] as const;

function withUtm(url: string, campaign: string, section: string) {
  const params = new URLSearchParams({
    utm_source: "riklanderos",
    utm_medium: "web",
    utm_campaign: campaign,
    utm_content: section,
  });
  return `${url}?${params.toString()}`;
}

/** URL de la Power Session con UTMs por sección (spec §9.2). */
export function powerSessionHref(section: string) {
  return withUtm(SITE.powerSessionUrl, "powersession", section);
}

/** URL de la Discovery Session con UTMs por sección (mismo esquema que la Power Session). */
export function discoverySessionHref(section: string) {
  return withUtm(SITE.discoverySessionUrl, "discovery", section);
}
