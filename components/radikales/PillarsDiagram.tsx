"use client";

import { motion } from "motion/react";
import { DrawPath } from "../motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const PILLARS = [130, 310, 490, 670];

/**
 * Plano de los 4 pilares sosteniendo la libertad. Se dibuja de abajo hacia arriba
 * al entrar en pantalla. Decorativo: el contenido real está en las tarjetas.
 */
export function PillarsDiagram() {
  return (
    <svg viewBox="0 0 800 270" className="w-full" fill="none" aria-hidden="true">
      {/* Piso y cimiento */}
      <DrawPath d="M10 232 H790" stroke="rgba(255,255,255,0.55)" strokeWidth={1.2} duration={1.1} />
      <DrawPath d="M40 246 H760" stroke="rgba(255,255,255,0.22)" strokeWidth={1} delay={0.15} duration={1.1} />

      {/* Columnas */}
      {PILLARS.map((x, i) => {
        const d = 0.35 + i * 0.12;
        return (
          <g key={x}>
            <DrawPath d={`M${x - 34} 232 V220 H${x + 34} V232`} stroke="rgba(255,255,255,0.6)" strokeWidth={1.2} delay={d} duration={0.6} />
            <DrawPath d={`M${x - 26} 220 V96`} stroke="rgba(255,255,255,0.75)" strokeWidth={1.4} delay={d + 0.1} duration={0.9} />
            <DrawPath d={`M${x + 26} 220 V96`} stroke="rgba(255,255,255,0.75)" strokeWidth={1.4} delay={d + 0.1} duration={0.9} />
            <DrawPath d={`M${x - 9} 210 V106 M${x + 9} 210 V106`} stroke="rgba(255,255,255,0.18)" strokeWidth={1} delay={d + 0.3} duration={0.9} />
            <DrawPath d={`M${x - 34} 96 H${x + 34} V84 H${x - 34} Z`} stroke="rgba(255,255,255,0.6)" strokeWidth={1.2} delay={d + 0.7} duration={0.6} />
            <motion.text
              x={x}
              y={166}
              textAnchor="middle"
              className="font-mono"
              fontSize="15"
              fill="#ff5a52"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE, delay: d + 0.9 }}
            >
              {String(i + 1).padStart(2, "0")}
            </motion.text>
          </g>
        );
      })}

      {/* Viga: lo que sostienen */}
      <DrawPath d="M60 84 V46 H740 V84" stroke="rgba(255,255,255,0.75)" strokeWidth={1.4} delay={1.3} duration={1} />
      <DrawPath d="M40 46 L400 8 L760 46" stroke="rgba(229,28,30,0.85)" strokeWidth={1.4} delay={1.7} duration={1} />
      <motion.text
        x={400}
        y={73}
        textAnchor="middle"
        className="font-display"
        fontSize="22"
        fontWeight="800"
        letterSpacing="10"
        fill="#f4f4f2"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE, delay: 2 }}
      >
        LIBERTAD
      </motion.text>

      {/* Cotas de plano */}
      <DrawPath d="M786 46 V232 M780 46 H792 M780 232 H792" stroke="rgba(255,255,255,0.2)" strokeWidth={1} delay={2.1} duration={0.8} />
    </svg>
  );
}
