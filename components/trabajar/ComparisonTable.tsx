"use client";

import clsx from "clsx";
import { motion, type Variants } from "motion/react";
import { COMPARE_COLUMNS, COMPARE_ROWS, type CompareCell } from "@/content/trabajar-conmigo";

const EASE = [0.22, 1, 0.36, 1] as const;

const body: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const row: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
/** Las marcas de cada fila "aterrizan" justo después de que entra la fila. */
const pop: Variants = {
  hidden: { scale: 0 },
  show: { scale: 1, transition: { type: "spring", stiffness: 420, damping: 18, delay: 0.25 } },
};

function Mark({ kind }: { kind: CompareCell["kind"] }) {
  if (kind === "text") return null;
  return (
    <>
      <motion.span
        aria-hidden
        variants={pop}
        className={clsx("mt-[0.45em] h-2 w-2 shrink-0 rotate-45", kind === "full" ? "bg-accent" : "border border-fg/70")}
      />
      <span className="sr-only">{kind === "full" ? "Incluido: " : "Lo diseño yo, lo ejecuta tu equipo: "}</span>
    </>
  );
}

/**
 * Tabla comparativa sin precios (spec §7.3). Tabla real con caption en todos los tamaños;
 * en móvil cada fila se reacomoda como tarjeta. Los roles ARIA explícitos conservan la
 * semántica de tabla cuando CSS cambia el `display` de las celdas.
 */
export function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-elev">
      <table role="table" className="w-full border-collapse text-left max-md:block">
        <caption className="border-b border-line px-5 py-5 text-left caption-top max-md:block md:px-7">
          <span className="block font-display text-lg font-bold tracking-tight text-fg">
            Consultoría estratégica integral en IA frente a Growth Partner
          </span>
          {/* Leyenda visual: fuera del nombre accesible de la tabla (cada celda ya lleva su prefijo sr-only). */}
          <span aria-hidden className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 rotate-45 bg-accent" />
              Incluido
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 rotate-45 border border-fg/70" />
              Lo diseño yo, lo ejecuta tu equipo
            </span>
          </span>
        </caption>

        <thead role="rowgroup" className="max-md:sr-only">
          <tr role="row" className="border-b border-line-strong">
            <th role="columnheader" scope="col" className="w-[36%] px-7 py-5 align-bottom">
              <span className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Qué incluye</span>
            </th>
            {COMPARE_COLUMNS.map((col, i) => (
              <th
                key={col.id}
                role="columnheader"
                scope="col"
                className="border-l border-line px-7 py-5 align-bottom font-display text-lg font-extrabold leading-tight tracking-tight"
              >
                <span className="t-mono mb-2 block text-[11px] font-normal tracking-[0.16em] text-accent-text">
                  {i === 0 ? "A" : "B"}
                </span>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <motion.tbody
          role="rowgroup"
          className="max-md:block"
          variants={body}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {COMPARE_ROWS.map((r, ri) => (
            <motion.tr
              key={r.feature}
              role="row"
              variants={row}
              className={clsx(
                "group/row border-line transition-colors duration-300 md:hover:bg-elev-2/70 max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-3 max-md:px-5 max-md:py-5",
                ri > 0 && "border-t",
                r.cells[0].kind === "text" && "bg-bg/40",
              )}
            >
              <th
                role="rowheader"
                scope="row"
                className="relative px-7 py-4 align-top text-[15px] font-medium leading-snug text-fg max-md:col-span-2 max-md:p-0 max-md:font-display max-md:text-[17px] max-md:font-bold"
              >
                {/* Indicador de fila activa (hover, desktop) */}
                <span
                  aria-hidden
                  className="absolute inset-y-3 left-0 hidden w-[2px] origin-top scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-out)] group-hover/row:scale-y-100 md:block"
                />
                {r.feature}
              </th>
              {r.cells.map((cell, ci) => (
                <td
                  key={COMPARE_COLUMNS[ci].id}
                  role="cell"
                  className="px-7 py-4 align-top text-[15px] leading-snug text-muted max-md:p-0 md:border-l md:border-line"
                >
                  <span aria-hidden className="t-mono mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted md:hidden">
                    {COMPARE_COLUMNS[ci].short}
                  </span>
                  <span className={clsx("flex items-start gap-2.5", cell.kind === "full" && "text-fg")}>
                    <Mark kind={cell.kind} />
                    <span>{cell.text}</span>
                  </span>
                </td>
              ))}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}
