import { CASES, type CaseStudy } from "@/lib/content";

/**
 * Datos de presentación de /casos y /casos/[slug] (spec §7.4).
 * Solo titulares y helpers: los hechos de cada caso viven en lib/content.ts (CASES).
 * Sin citas de clientes ni métricas adicionales hasta que Rik las entregue.
 */

type CaseView = { headline: string; accentWords: string[] };

const CASE_VIEW: Record<string, CaseView> = {
  argi: {
    headline: "Argi dejó de licitar. Ahora los buscan a ellos.",
    accentWords: ["buscan"],
  },
  "clinica-dental": {
    headline: "De 8 minutos a 12 segundos en responder.",
    accentWords: ["12", "segundos"],
  },
  "clinica-estetica": {
    headline: "El mismo esfuerzo, ahora por el pez gordo.",
    accentWords: ["pez", "gordo"],
  },
};

export function caseView(c: CaseStudy): CaseView {
  return (
    CASE_VIEW[c.slug] ?? {
      headline: `${c.client}: ${c.problem}`,
      accentWords: [],
    }
  );
}

export function getCase(slug: string) {
  return CASES.find((c) => c.slug === slug);
}

/** Caso anterior y siguiente (circular) para la navegación entre casos. */
export function getAdjacentCases(slug: string) {
  const i = CASES.findIndex((c) => c.slug === slug);
  if (i === -1 || CASES.length < 2) return null;
  return {
    prev: CASES[(i - 1 + CASES.length) % CASES.length],
    next: CASES[(i + 1) % CASES.length],
  };
}

/** "Branding: posicionamiento de autoridad" → { phase: "Branding", detail: "Posicionamiento de autoridad" } */
export function splitBuilt(item: string) {
  const idx = item.indexOf(":");
  if (idx === -1) return { phase: item.trim(), detail: "" };
  const detail = item.slice(idx + 1).trim();
  return {
    phase: item.slice(0, idx).trim(),
    detail: detail.charAt(0).toUpperCase() + detail.slice(1),
  };
}

/** "12 seg" → { n: 12, suffix: " seg" }; "Premium" → null (se muestra como texto). */
export function parseResult(result: string) {
  const m = result.match(/^(\d+)(.*)$/);
  if (!m) return null;
  return { n: Number(m[1]), suffix: m[2] };
}
