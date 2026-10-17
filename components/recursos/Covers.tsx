"use client";

import Image from "next/image";
import clsx from "clsx";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { DrawPath } from "../motion";
import type { Resource } from "@/content/recursos";

/**
 * Portadas de recursos hechas con CSS + SVG (sin fotos de stock).
 * Son decorativas: el título real vive en el <h3> de la tarjeta, así que
 * cada portada va con aria-hidden.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

function Sheet({
  tone,
  className,
  children,
}: {
  tone: "paper" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "@container relative isolate aspect-[4/5] w-full overflow-hidden rounded-[12px] border shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]",
        "transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-y-1.5 group-hover:-rotate-[0.6deg]",
        tone === "paper" ? "border-paper-fg/10 bg-paper text-paper-fg" : "border-line-strong bg-elev text-fg",
        className,
      )}
    >
      {/* Lomo del documento */}
      <span
        className={clsx(
          "absolute inset-y-0 left-0 z-10 w-3",
          tone === "paper"
            ? "bg-[linear-gradient(90deg,rgba(11,12,13,0.18),rgba(11,12,13,0))]"
            : "bg-[linear-gradient(90deg,rgba(0,0,0,0.6),rgba(0,0,0,0))]",
        )}
      />
      {children}
    </div>
  );
}

const paperGrid = {
  backgroundImage:
    "linear-gradient(to right, rgba(11,12,13,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,12,13,0.07) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

/* ── 01 · Business Operating System Canvas ──────────────────── */

const STAGES = [
  { n: "01", w: "Dirección" },
  { n: "02", w: "Tráfico" },
  { n: "03", w: "Conversión" },
  { n: "04", w: "Escala" },
];

export function CanvasCover({ className }: { className?: string }) {
  const boxX = [9, 90, 171, 252];
  return (
    <Sheet tone="paper" className={className}>
      <div className="absolute inset-0 -z-10" style={paperGrid} />
      <div className="flex h-full flex-col p-[7%] pl-[9%]">
        <div className="t-mono flex items-center justify-between gap-2 text-[max(7px,2.6cqw)] uppercase tracking-[0.16em] text-paper-muted">
          <span>Rik Landeros</span>
          <span>Canvas · v1</span>
        </div>

        <svg viewBox="0 0 330 210" className="mt-[8%] w-full" fill="none">
          {boxX.map((x, i) => (
            <g key={x}>
              <DrawPath
                d={`M${x} 14 H${x + 69} V70 H${x} Z`}
                stroke={i === 3 ? "#e51c1e" : "rgba(11,12,13,0.75)"}
                strokeWidth={1.2}
                delay={0.15 + i * 0.12}
              />
              <text x={x + 8} y={30} className="font-mono" fontSize="8" fill="rgba(11,12,13,0.55)">
                {STAGES[i].n}
              </text>
              <text x={x + 8} y={58} className="font-display" fontSize="10" fontWeight="800" fill="#0b0c0d">
                {STAGES[i].w}
              </text>
              {i < 3 ? (
                <DrawPath d={`M${x + 71} 42 H${x + 79} M${x + 76} 39 L${x + 79} 42 L${x + 76} 45`} stroke="rgba(11,12,13,0.6)" strokeWidth={1} delay={0.6 + i * 0.12} duration={0.5} />
              ) : null}
            </g>
          ))}
          {/* Todo pasa por el dueño: el cuello de botella */}
          {boxX.map((x, i) => (
            <DrawPath
              key={`l-${x}`}
              d={`M165 150 C165 ${118 - Math.abs(i - 1.5) * 6}, ${x + 34.5} 104, ${x + 34.5} 72`}
              stroke="rgba(11,12,13,0.38)"
              strokeWidth={1}
              delay={0.9 + i * 0.08}
              duration={1.1}
            />
          ))}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1.3 }}
            style={{ transformOrigin: "165px 166px" }}
          >
            <circle cx="165" cy="166" r="17" fill="#e51c1e" />
            <text x="165" y="170" textAnchor="middle" className="font-display" fontSize="11" fontWeight="800" fill="#fff">
              TÚ
            </text>
          </motion.g>
          <text x="190" y="196" className="font-mono" fontSize="7.5" letterSpacing="1.2" fill="rgba(11,12,13,0.6)">
            TODO PASA POR TI
          </text>
        </svg>

        <div className="mt-auto">
          <p className="font-display text-[8.4cqw] font-extrabold leading-[0.95] tracking-[-0.04em]">
            Business Operating System
          </p>
          <p className="t-brush mt-[1cqw] text-[14cqw] text-accent">Canvas</p>
        </div>
      </div>
    </Sheet>
  );
}

/* ── 02 · El Mapa del Dueño Libre ───────────────────────────── */

const CONTOURS = [
  "M198 18 C252 14 292 50 290 94 C288 140 248 166 202 164 C152 162 118 134 122 90 C126 46 154 22 198 18 Z",
  "M200 40 C240 38 268 62 266 92 C264 124 236 142 204 140 C170 138 146 118 148 90 C150 60 168 42 200 40 Z",
  "M202 62 C226 60 244 74 243 92 C242 112 224 122 204 121 C184 120 170 108 171 91 C172 74 184 63 202 62 Z",
  "M40 168 C72 150 112 160 122 186 C132 212 102 232 70 230 C40 228 18 214 20 194 C22 182 30 174 40 168 Z",
  "M46 184 C64 174 90 180 96 196 C102 212 84 222 66 220 C48 218 36 208 37 198 C38 192 41 187 46 184 Z",
];

export function MapaCover({ className }: { className?: string }) {
  return (
    <Sheet tone="dark" className={className}>
      <div
        className="absolute -right-1/4 -top-1/4 -z-10 h-3/4 w-3/4 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />
      <div className="bg-dots absolute inset-0 -z-10 opacity-70" />
      <div className="flex h-full flex-col p-[7%] pl-[9%]">
        <div className="t-mono flex items-center justify-between gap-2 text-[max(7px,2.6cqw)] uppercase tracking-[0.16em] text-muted">
          <span>Guía</span>
          <span>Ruta 01 → 03</span>
        </div>

        <svg viewBox="0 0 300 240" className="mt-[4%] w-full" fill="none">
          {CONTOURS.map((d, i) => (
            <DrawPath key={i} d={d} stroke="rgba(255,255,255,0.22)" strokeWidth={1} delay={0.1 + i * 0.1} duration={1.8} />
          ))}
          <DrawPath
            d="M52 200 C92 196 98 156 128 146 C166 133 160 104 204 92"
            stroke="#e51c1e"
            strokeWidth={2}
            delay={0.9}
            duration={1.6}
          />
          <circle cx="52" cy="200" r="4" fill="#0b0c0d" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
          <motion.g
            initial={{ y: -10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE, delay: 2.2 }}
          >
            <circle cx="204" cy="92" r="9" fill="#e51c1e" fillOpacity="0.25" />
            <circle cx="204" cy="92" r="4.5" fill="#e51c1e" />
          </motion.g>
          <text x="36" y="222" className="font-mono" fontSize="8" letterSpacing="1.2" fill="rgba(255,255,255,0.55)">
            OPERACIÓN
          </text>
          <text x="216" y="88" className="font-mono" fontSize="8" letterSpacing="1.2" fill="#f4f4f2">
            LIBERTAD
          </text>
        </svg>

        <div className="mt-auto">
          <p className="font-display text-[10.5cqw] font-extrabold leading-[0.95] tracking-[-0.04em]">
            El Mapa del Dueño Libre
          </p>
          <Image src="/brand/ingeniak.svg" alt="" width={140} height={19} className="mt-[4cqw] h-[3.4cqw] w-auto opacity-70" unoptimized />
        </div>
      </div>
    </Sheet>
  );
}

/* ── 03 · Las 7 Fugas de tu Negocio ─────────────────────────── */

const LEAKS = [0, 1, 2, 3, 4, 5, 6];

export function FugasCover({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  return (
    <Sheet tone="dark" className={className}>
      <div className="bg-grid absolute inset-0 -z-10 opacity-50" />
      <div
        className="absolute -bottom-1/4 left-1/4 -z-10 h-1/2 w-3/4 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />
      <div className="flex h-full flex-col p-[7%] pl-[9%]">
        <div className="t-mono flex items-center justify-between gap-2 text-[max(7px,2.6cqw)] uppercase tracking-[0.16em] text-muted">
          <span>Guía</span>
          <span>07 puntos</span>
        </div>

        <svg ref={ref} viewBox="0 0 300 220" className="mt-[6%] w-full" fill="none">
          <DrawPath d="M6 64 H294" stroke="rgba(255,255,255,0.6)" strokeWidth={1.2} delay={0.1} duration={1.2} />
          <DrawPath d="M6 82 H294" stroke="rgba(255,255,255,0.6)" strokeWidth={1.2} delay={0.2} duration={1.2} />
          {[50, 130, 210].map((x) => (
            <rect key={x} x={x} y="60" width="10" height="26" rx="1.5" fill="#121416" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
          ))}
          {LEAKS.map((i) => {
            const x = 24 + i * 42;
            return (
              <g key={i}>
                <text x={x} y="50" textAnchor="middle" className="font-mono" fontSize="7.5" fill="rgba(255,255,255,0.55)">
                  {String(i + 1).padStart(2, "0")}
                </text>
                <path d={`M${x - 3} 82 L${x} 86 L${x + 3} 82`} stroke="#e51c1e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <motion.path
                  d={`M${x} 92 C${x + 3} 97 ${x + 4} 99 ${x + 4} 101 A4 4 0 0 1 ${x - 4} 101 C${x - 4} 99 ${x - 3} 97 ${x} 92 Z`}
                  fill="#e51c1e"
                  initial={{ y: 0, opacity: reduce ? 0.9 : 0 }}
                  animate={
                    reduce || !inView
                      ? { y: 0, opacity: reduce ? 0.9 : 0 }
                      : { y: [0, 0, 92], opacity: [0, 1, 0] }
                  }
                  transition={
                    reduce || !inView
                      ? { duration: 0.3 }
                      : { duration: 2.4, times: [0, 0.18, 1], ease: "easeIn", repeat: 2, repeatDelay: 0.6, delay: i * 0.34 }
                  }
                />
              </g>
            );
          })}
          <DrawPath d="M20 200 H280" stroke="rgba(229,28,30,0.55)" strokeWidth={1} delay={0.6} duration={1.4} />
          <text x="150" y="216" textAnchor="middle" className="font-mono" fontSize="7.5" letterSpacing="1.4" fill="rgba(255,255,255,0.55)">
            DINERO · TIEMPO · CLIENTES
          </text>
        </svg>

        <div className="mt-auto">
          <p className="font-display text-[10.5cqw] font-extrabold leading-[0.95] tracking-[-0.04em]">
            Las <span className="text-accent">7</span> Fugas de tu Negocio
          </p>
          <Image src="/brand/ingeniak.svg" alt="" width={140} height={19} className="mt-[4cqw] h-[3.4cqw] w-auto opacity-70" unoptimized />
        </div>
      </div>
    </Sheet>
  );
}

export function ResourceCover({ cover, className }: { cover: Resource["cover"]; className?: string }) {
  if (cover === "canvas") return <CanvasCover className={className} />;
  if (cover === "mapa") return <MapaCover className={className} />;
  return <FugasCover className={className} />;
}
