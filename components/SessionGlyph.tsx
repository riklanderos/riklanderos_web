"use client";

import { motion, useReducedMotion } from "motion/react";
import type { SessionKey } from "@/lib/sessions";
import { DrawPath } from "./motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const INSTANT = { duration: 0 } as const;

/* ──────────────────────────────────────────────────────────────
   Íconos propios de cada sesión (se dibujan al entrar en pantalla)
   ────────────────────────────────────────────────────────────── */

/** Mira de diagnóstico sobre el plano de la operación, con las 3 fugas marcadas en rojo. */
function DiagnosisGlyph({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const leaks = [
    [42, 47],
    [77, 58],
    [53, 76],
  ] as const;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none">
      <DrawPath d="M60 12a48 48 0 1 1 0 96a48 48 0 1 1 0-96" duration={1.4} />
      <DrawPath d="M60 34a26 26 0 1 1 0 52a26 26 0 1 1 0-52" className="opacity-40" delay={0.25} duration={1.2} />
      <DrawPath d="M60 2v16M60 102v16M2 60h16M102 60h16" delay={0.4} duration={0.8} />
      <DrawPath d="M26 47h68M20 60h80M26 73h68" className="opacity-30" delay={0.55} duration={1} strokeWidth={1} />
      {leaks.map(([cx, cy], i) => (
        <g key={i}>
          <motion.circle
            cx={cx}
            cy={cy}
            r={4}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.2}
            initial={{ scale: 1, opacity: 0 }}
            whileInView={{ scale: 3.2, opacity: [0, 0.9, 0] }}
            viewport={{ once: true }}
            transition={reduce ? INSTANT : { duration: 1.4, ease: "easeOut", delay: 1.1 + i * 0.18 }}
          />
          <motion.circle
            cx={cx}
            cy={cy}
            r={4.5}
            fill="var(--accent)"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={reduce ? INSTANT : { duration: 0.5, ease: EASE, delay: 1 + i * 0.18 }}
          />
        </g>
      ))}
    </svg>
  );
}

/** Sistema conectado: un núcleo (rojo) enlazado con agentes, CRM y automatizaciones. */
function SystemGlyph({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const nodes = [
    [20, 24],
    [100, 24],
    [20, 96],
    [100, 96],
  ] as const;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none">
      <DrawPath d="M20 24H100M100 24V96M100 96H20M20 96V24" className="opacity-30" duration={1.6} strokeWidth={1} />
      {nodes.map(([x, y], i) => (
        <DrawPath key={i} d={`M60 60L${x} ${y}`} delay={0.3 + i * 0.15} duration={0.7} />
      ))}
      {nodes.map(([x, y], i) => (
        <motion.rect
          key={i}
          x={x - 8}
          y={y - 8}
          width={16}
          height={16}
          rx={4}
          fill="var(--bg)"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={reduce ? INSTANT : { duration: 0.5, ease: EASE, delay: 0.75 + i * 0.12 }}
        />
      ))}
      <motion.circle
        cx={60}
        cy={60}
        r={9}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.2}
        initial={{ scale: 1, opacity: 0 }}
        whileInView={{ scale: 2.6, opacity: [0, 0.8, 0] }}
        viewport={{ once: true }}
        transition={reduce ? INSTANT : { duration: 1.5, ease: "easeOut", delay: 1.35 }}
      />
      <motion.circle
        cx={60}
        cy={60}
        r={9}
        fill="var(--accent)"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={reduce ? INSTANT : { duration: 0.55, ease: EASE, delay: 0.15 }}
      />
    </svg>
  );
}

/** Ícono de cada sesión: diagnóstico (Power) o sistema conectado (Discovery). Decorativo. */
export function SessionGlyph({ kind, className }: { kind: SessionKey; className?: string }) {
  return kind === "power" ? <DiagnosisGlyph className={className} /> : <SystemGlyph className={className} />;
}
