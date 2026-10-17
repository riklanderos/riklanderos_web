import { SITE } from "./site";

export type Vsl = {
  /** Nombre del video en los eventos de analítica. */
  id: string;
  src: string;
  poster: string;
  title: string;
  label: string;
  /** Duración visible (m:ss) y en ISO 8601 para el schema. */
  duration: string;
  isoDuration: string;
  description: string;
  /** Clases de posición del botón de play si el centro de la portada tiene texto (por defecto, centrado). */
  playPos?: string;
};

/**
 * Videos de venta (VSL). Se sirven desde /public con faststart para que empiecen a reproducirse
 * antes de descargarse completos. Si se mudan a un CDN de video, basta con cambiar `src`.
 */
export const VSL = {
  powerSession: {
    id: "vsl_power_session",
    src: "/video/vsl-power-session.mp4",
    poster: "/img/vsl-power-session-poster.webp",
    title: "La factura invisible",
    label: "Power Session",
    duration: "2:17",
    isoDuration: "PT2M17S",
    // En móvil y tablet el centro cae sobre la factura: el play va al hueco entre las píldoras y la factura.
    playPos: "left-[40%] top-[43%] lg:left-1/2 lg:top-1/2",
    description:
      "Qué es la Power Session: 90 minutos 1:1 con Rik Landeros para revisar tu operación piso por piso y salir con tu mapa de fugas y un plan de 90 días.",
  },
  discoverySession: {
    id: "vsl_discovery_session",
    src: "/video/vsl-discovery-session.mp4",
    poster: "/img/vsl-discovery-session-poster.webp",
    title: "La silla vacía",
    label: "Ingeniak · Discovery Session",
    duration: "3:27",
    isoDuration: "PT3M27S",
    description:
      "Cómo Ingeniak diseña, implementa y opera un sistema conectado que atrae, atiende, organiza y da seguimiento a tus clientes con IA.",
  },
} as const satisfies Record<string, Vsl>;

/** Schema VideoObject para que el video aparezca en resultados de búsqueda. */
export function videoLd(v: Vsl) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${v.title} · ${v.label}`,
    description: v.description,
    thumbnailUrl: [`${SITE.url}${v.poster}`],
    uploadDate: "2026-10-16T09:00:00-06:00",
    duration: v.isoDuration,
    contentUrl: `${SITE.url}${v.src}`,
    inLanguage: "es-MX",
    author: { "@type": "Person", name: SITE.name, url: SITE.url },
  };
}

/** JSON-LD listo para dangerouslySetInnerHTML (escapa "<" como el resto del sitio). */
export function videoLdHtml(v: Vsl) {
  return JSON.stringify(videoLd(v)).replace(/</g, "\\u003c");
}
