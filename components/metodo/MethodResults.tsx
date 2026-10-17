import { METRICS } from "@/lib/content";
import { CountUp, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink, Eyebrow } from "@/components/ui";

/** 04 · Pruebas: solo métricas verificadas (spec §1.7). */
export function MethodResults() {
  return (
    <section className="section border-t border-line" aria-labelledby="pruebas-titulo">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow index="04">Pruebas, no promesas</Eyebrow>
            </Reveal>
            <div id="pruebas-titulo">
              <SplitWords
                as="h2"
                className="t-h2 mt-6"
                text="Lo que pasa cuando respetas el orden."
                accentWords={["orden"]}
              />
            </div>
          </div>
          <Reveal className="flex items-end lg:col-span-4 lg:justify-end" delay={0.15}>
            <ButtonLink href="/casos">Lee los casos</ButtonLink>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid border-y border-line md:grid-cols-3" stagger={0.12}>
          {METRICS.map((m, i) => (
            <StaggerItem
              key={m.label}
              className={`py-10 md:px-8 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : "md:pl-0"}`}
            >
              <p className="whitespace-nowrap font-mono text-[clamp(2.75rem,12vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] text-fg md:text-[clamp(2.5rem,5vw,4.5rem)]">
                {m.prefix}
                <CountUp to={m.value} />
                <span className="text-accent">{m.suffix}</span>
              </p>
              <p className="mt-5 max-w-[260px] text-fg">{m.label}</p>
              <p className="t-mono mt-2 text-[11px] uppercase tracking-[0.14em] text-muted">{m.note}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
