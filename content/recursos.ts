/**
 * Recursos descargables (spec §7.7). La entrega es por correo vía n8n:
 * cada descarga se etiqueta en el CRM como `recurso:<slug>`.
 * Descripciones pendientes de confirmar por Rik contra el contenido final de cada PDF.
 */

export type Resource = {
  slug: string;
  title: string;
  kind: string;
  owner: "rik" | "ingeniak";
  featured: boolean;
  summary: string;
  points: readonly string[];
  cta: string;
  cover: "canvas" | "mapa" | "fugas";
};

export const RESOURCES = [
  {
    slug: "business-operating-system-canvas",
    title: "Business Operating System Canvas",
    kind: "Canvas",
    owner: "rik",
    featured: true,
    summary:
      "Tu negocio completo en una sola hoja. Dirección, tráfico, conversión y escala, y dónde estás tú atorando el sistema.",
    points: [
      "Ves tu negocio en el orden correcto: branding, marketing, ventas e IA.",
      "Ubicas qué decisiones siguen pasando por ti y no deberían.",
      "Detectas qué pieza falta antes de comprar otra herramienta.",
    ],
    cta: "Descarga el Canvas",
    cover: "canvas",
  },
  {
    slug: "el-mapa-del-dueno-libre",
    title: "El Mapa del Dueño Libre",
    kind: "Guía de Ingeniak",
    owner: "ingeniak",
    featured: false,
    summary:
      "La ruta para dejar de ser el operador de tu negocio: qué ordenar, qué delegar y qué automatizar, en ese orden.",
    points: [
      "Dónde estás hoy: operador, gerente o dueño.",
      "Qué se sistematiza primero para soltar la operación.",
      "Dónde entra la IA y dónde todavía no.",
    ],
    cta: "Descarga la guía",
    cover: "mapa",
  },
  {
    slug: "las-7-fugas-de-tu-negocio",
    title: "Las 7 Fugas de tu Negocio",
    kind: "Guía de Ingeniak",
    owner: "ingeniak",
    featured: false,
    summary:
      "Siete puntos por donde un negocio que ya vende pierde dinero y tiempo sin darse cuenta. Para revisarlos uno por uno.",
    points: [
      "Dónde se enfrían los prospectos que ya pagaste.",
      "Qué tareas repetidas le cuestan horas a tu equipo.",
      "Cómo priorizar cuál fuga tapar primero.",
    ],
    cta: "Descarga la guía",
    cover: "fugas",
  },
] as const satisfies readonly Resource[];

export const RESOURCE_SLUGS: readonly string[] = RESOURCES.map((r) => r.slug);

export function getResource(slug: string | undefined | null) {
  if (!slug) return undefined;
  return RESOURCES.find((r) => r.slug === slug);
}
