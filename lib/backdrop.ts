/**
 * Espacio superior para el contenido cuando la <Backdrop> va arriba en móvil (mobile="top", alto por defecto
 * min(112vw, 620px)): el texto empieza 7rem antes del final de la foto, sobre su fundido.
 * Vive fuera de Backdrop.tsx porque ese archivo es "use client": un string exportado desde ahí llega a los
 * componentes de servidor como referencia de cliente, no como texto.
 */
export const BACKDROP_TOP_PAD = "pt-[calc(min(112vw,620px)-7rem)] lg:pt-0";

/**
 * Fotos horizontales (rik-desk, orig/rik-4…) arriba en móvil: banda más baja para que no se recorte de más.
 * Úsalas juntas: mobileHeight={BACKDROP_WIDE_H} en la <Backdrop> y BACKDROP_WIDE_PAD en el contenido.
 */
export const BACKDROP_WIDE_H = "min(84vw, 520px)";
export const BACKDROP_WIDE_PAD = "pt-[calc(min(84vw,520px)-4rem)] lg:pt-0";

/**
 * Retratos verticales que llenan el alto de la sección en desktop cuando el contenido es muy largo:
 * la foto se queda fija (sticky) mientras el texto avanza. Envuelve la <Backdrop> en estas dos capas
 * y usa `overflow-x-clip` (no `overflow-hidden`) en la sección para que el sticky funcione.
 */
export const STICKY_BACKDROP_OUTER = "pointer-events-none absolute inset-0 -z-10";
export const STICKY_BACKDROP_INNER = "relative h-full lg:sticky lg:top-0 lg:h-[100svh]";
