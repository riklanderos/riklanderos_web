import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Marked } from "marked";
import INDICE from "@/content/blog/indice.json";

/**
 * Blog. Los artículos los publica el Estudio editorial por PR:
 *   content/blog/indice.json            → lista para el índice, el menú y el sitemap
 *   content/blog/articulos/<slug>.json   → el artículo completo (cuerpo en Markdown)
 * No se editan a mano: el Estudio los regenera en cada publicación.
 */

/** Imagen del artículo. Los archivos viven en public/blog/<slug>/ y los sube el Estudio en el mismo PR. */
export type ImagenArticulo = {
  src: string;
  alt: string;
  ancho: number;
  alto: number;
  /** portada: arriba del artículo y en Open Graph. figura: dentro del texto, con su llamado a la acción. */
  tipo: "portada" | "figura";
  /** La figura va al final de la sección del H2 número n (desde 1). */
  despuesDeH2?: number;
  cta?: "power-session" | "discovery";
  frase?: string;
};

export type ResumenArticulo = {
  slug: string;
  titulo: string;
  metaDescription: string;
  categoria: string;
  publicado: string;
  actualizado: string;
  minutos: number;
  portada?: { src: string; alt: string };
};

export type Articulo = ResumenArticulo & {
  metaTitle: string;
  keyword: string;
  secundarias: string[];
  respuestaDirecta: string;
  markdown: string;
  faqs: { p: string; r: string }[];
  fuentes: { titulo: string; editor?: string; url: string; fecha?: string }[];
  cta: string;
  autor: string;
  aprobadoPor: string | null;
  imagenes?: ImagenArticulo[];
};

export const ARTICULOS = (INDICE as ResumenArticulo[]).toSorted((a, b) => b.publicado.localeCompare(a.publicado));

export function getArticulo(slug: string): Articulo | null {
  if (!ARTICULOS.some((a) => a.slug === slug)) return null;
  return JSON.parse(readFileSync(join(process.cwd(), "content/blog/articulos", `${slug}.json`), "utf8")) as Articulo;
}

const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const idDe = (texto: string) =>
  texto
    .replace(/<[^>]+>/g, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 6)
    .join("-");

/**
 * Cuerpo del artículo en HTML + índice de H2. El HTML que venga dentro del Markdown se muestra como texto
 * (no se interpreta) y los enlaces externos abren en otra pestaña.
 */
export function renderArticulo(md: string) {
  const indice: { id: string; texto: string }[] = [];
  const marked = new Marked({
    gfm: true,
    renderer: {
      html: ({ text }) => escapar(text),
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const nivel = Math.min(Math.max(depth, 2), 4);
        if (nivel !== 2) return `<h${nivel}>${html}</h${nivel}>`;
        let id = idDe(html) || "seccion";
        for (let n = 2; indice.some((x) => x.id === id); n++) id = `${id.replace(/-\d+$/, "")}-${n}`;
        indice.push({ id, texto: html.replace(/<[^>]+>/g, "") });
        return `<h2 id="${id}">${html}</h2>`;
      },
      link({ href, tokens }) {
        const html = this.parser.parseInline(tokens);
        const seguro = /^(https?:|\/|#|mailto:)/i.test(href) ? href : "#";
        return /^https?:/i.test(seguro)
          ? `<a href="${escapar(seguro)}" target="_blank" rel="noopener">${html}</a>`
          : `<a href="${escapar(seguro)}">${html}</a>`;
      },
    },
  });
  // Cada tabla va en un contenedor que se desplaza en celular sin romper el ancho de la página.
  const html = (marked.parse(md, { async: false }) as string).replace(/<table>/g, '<div class="tabla"><table>').replace(/<\/table>/g, "</table></div>");
  // secciones[0] es la entrada antes del primer H2; secciones[n] empieza con el H2 número n (para intercalar figuras).
  const secciones = html.split(/(?=<h2 id=")/);
  if (!secciones[0].startsWith("<h2")) return { html, indice, secciones };
  return { html, indice, secciones: ["", ...secciones] };
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export function fechaLarga(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}
