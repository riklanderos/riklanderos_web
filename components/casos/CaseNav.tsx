import Link from "next/link";
import clsx from "clsx";
import type { CaseStudy } from "@/lib/content";
import { getAdjacentCases } from "@/content/casos";
import { Reveal, Stagger, TiltCard } from "../motion";
import { Arrow, btn } from "../ui";

function NavCard({ c, dir }: { c: CaseStudy; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  return (
    <Link
      href={`/casos/${c.slug}`}
      rel={isNext ? "next" : "prev"}
      className={clsx(
        "spot group flex h-full flex-col rounded-[14px] border border-line bg-elev p-7 transition-[border-color,translate] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-line-strong md:p-9",
        isNext && "md:items-end md:text-right",
      )}
    >
      <span
        className={clsx(
          "t-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted",
          isNext && "md:flex-row-reverse",
        )}
      >
        <Arrow
          className={clsx(
            "transition-transform duration-300",
            isNext ? "group-hover:translate-x-1" : "rotate-180 group-hover:-translate-x-1",
          )}
        />
        {isNext ? "Caso siguiente" : "Caso anterior"}
      </span>
      <span className="mt-6 font-display text-3xl font-extrabold tracking-tight transition-colors group-hover:text-accent-text">
        {c.client}
      </span>
      <span className="mt-2 text-muted">{c.industry}</span>
      <span className="t-mono mt-6 text-sm text-fg">
        {c.result} <span className="text-muted">· {c.resultLabel}</span>
      </span>
    </Link>
  );
}

/** Navegación anterior / siguiente entre casos (circular). */
export function CaseNav({ slug }: { slug: string }) {
  const adj = getAdjacentCases(slug);
  return (
    <nav aria-label="Más casos" className="border-t border-line pt-16 lg:pt-24">
      <div className="container-x">
        {adj ? (
          <Stagger className="grid gap-5 md:grid-cols-2" stagger={0.12}>
            <TiltCard max={3} className="h-full rounded-[14px]">
              <NavCard c={adj.prev} dir="prev" />
            </TiltCard>
            <TiltCard max={3} className="h-full rounded-[14px]">
              <NavCard c={adj.next} dir="next" />
            </TiltCard>
          </Stagger>
        ) : null}
        <Reveal className="mt-10 flex justify-center pb-16 lg:pb-24" delay={0.1}>
          <Link href="/casos" className={btn.text}>
            <span className="link-sweep">Ver todos los casos</span>
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </nav>
  );
}
