import clsx from "clsx";
import { ParallaxLayer, Stagger, TiltCard } from "../motion";
import { PS_DELIVERABLES } from "./data";
import { SectionTitle } from "./SectionTitle";

/** 02 · Qué sales teniendo: diagnóstico escrito, tres movimientos, recomendación honesta. */
export function Deliverables() {
  const last = PS_DELIVERABLES.length - 1;
  return (
    <section className="section relative isolate overflow-hidden border-t border-line" aria-labelledby="ps-entregables">
      <ParallaxLayer distance={60} className="pointer-events-none absolute inset-x-0 -inset-y-20 -z-10">
        <div aria-hidden className="bg-grid mask-radial h-full w-full opacity-50" />
      </ParallaxLayer>
      <div className="container-x">
        <SectionTitle
          id="ps-entregables"
          index="02"
          eyebrow="Qué sales teniendo"
          title="Sales con tres cosas. Ninguna es una propuesta."
          accentWords={["tres"]}
        />

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-3" stagger={0.12}>
          {PS_DELIVERABLES.map((d, i) => (
            <TiltCard
              key={d.n}
              as="article"
              className={clsx(
                "spot group flex flex-col overflow-hidden rounded-[14px] border bg-elev p-8 transition-[border-color,translate] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 md:p-10",
                i === last ? "border-accent/60 hover:border-accent" : "border-line hover:border-line-strong",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="t-mono text-sm text-accent-text">{d.n}</span>
                <span className="t-mono text-[10px] uppercase tracking-[0.16em] text-muted">{d.tag}</span>
              </div>
              {/* Filete: se ilumina de izquierda a derecha en hover */}
              <span aria-hidden className="relative mt-6 block h-px w-full bg-line">
                <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100" />
              </span>
              <h3 className="mt-8 font-display text-2xl font-extrabold leading-tight tracking-tight md:text-[1.75rem]">
                {d.title}
                {"brush" in d ? <span className="t-brush ml-2 inline-block text-[1.35em] text-accent">{d.brush}</span> : null}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{d.body}</p>
            </TiltCard>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
