import Link from "next/link";
import type { CaseStudy } from "@/lib/content";
import { splitBuilt } from "@/content/casos";
import { TiltCard } from "../motion";
import { Arrow } from "../ui";

/** Tarjeta de caso: industria, problema en una línea y resultado en mono grande (spec §7.4). */
export function CaseCard({ c, index }: { c: CaseStudy; index: number }) {
  const phases = c.built.map((b) => splitBuilt(b).phase);
  return (
    <TiltCard
      as="article"
      reveal="none"
      max={3}
      className="spot sweep-host group flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-elev p-7 transition-[border-color,translate] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-line-strong md:p-9"
    >
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-40"
      />
      <div className="flex items-center justify-between gap-4">
        <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{c.industry}</p>
        <span aria-hidden className="t-mono text-[11px] text-dim transition-colors duration-300 group-hover:text-accent-text">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-5 font-display text-3xl font-extrabold tracking-tight">
        <Link
          href={`/casos/${c.slug}`}
          className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none"
        >
          {c.client}
          <span className="sr-only">: lee el caso</span>
        </Link>
      </h3>
      <p className="mt-3 text-muted">{c.problem}</p>

      <div className="mt-10 border-t border-line pt-6">
        <p className="t-mono text-[10px] uppercase tracking-[0.16em] text-muted">Resultado</p>
        <p className="mt-2 origin-left break-words font-mono text-[clamp(2.75rem,6vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-fg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]">
          {c.result}
        </p>
        <p className="t-mono mt-3 text-[11px] uppercase tracking-[0.14em] text-accent-text">{c.resultLabel}</p>
      </div>

      <ul className="mt-8 flex flex-wrap gap-2" aria-label="Qué se construyó">
        {phases.map((p) => (
          <li
            key={p}
            className="t-mono rounded-full border border-line-strong px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted transition-colors duration-500 group-hover:border-accent/50 group-hover:text-fg"
          >
            {p}
          </li>
        ))}
      </ul>

      <p
        className="mt-auto flex items-center gap-2 pt-10 font-medium text-fg transition-colors group-hover:text-accent-text"
        aria-hidden
      >
        <span className="link-sweep">Lee el caso</span>
        <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
      </p>
      {/* Foco visible para el enlace que cubre toda la tarjeta */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[14px] ring-2 ring-inset ring-accent-soft opacity-0 transition-opacity group-has-[:focus-visible]:opacity-100"
      />
    </TiltCard>
  );
}
