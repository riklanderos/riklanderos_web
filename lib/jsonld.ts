/**
 * Serializa datos estructurados para <script type="application/ld+json">.
 * Escapa "<" para que ningún texto pueda cerrar la etiqueta </script>.
 */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
