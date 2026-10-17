import { PowerSessionButton } from "../PowerSessionButton";
import { ParallaxLayer, Reveal, Stagger, StaggerItem } from "../motion";
import { PS_MICROCOPY, PS_STEPS } from "./data";
import { SectionTitle } from "./SectionTitle";
import { StepConnector, StepsRail } from "./StepsRail";

/** 04 · Cómo funciona: 01–04 + segundo botón de Power Session (spec §7.2). */
export function HowItWorks() {
  return (
    <section className="section relative isolate overflow-hidden border-t border-line" aria-labelledby="ps-como-funciona">
      <ParallaxLayer distance={50} className="pointer-events-none absolute inset-x-0 -inset-y-16 -z-10">
        <div aria-hidden className="bg-dots mask-fade-y h-full w-full opacity-60" />
      </ParallaxLayer>
      <div className="container-x">
        <SectionTitle
          id="ps-como-funciona"
          index="04"
          eyebrow="Cómo funciona"
          title="Cuatro pasos. Sin vueltas."
          accentWords={["Sin", "vueltas"]}
        />

        <div className="relative mt-14 lg:mt-16">
          <StepsRail />
          <Stagger as="ol" className="relative grid lg:grid-cols-4" stagger={0.14} amount={0.3}>
            {PS_STEPS.map((s, i) => (
              <StaggerItem as="li" key={s.n} className="group relative grid grid-cols-[48px_1fr] gap-5 pb-10 last:pb-0 lg:block lg:pb-0 lg:pr-8">
                {i < PS_STEPS.length - 1 ? <StepConnector /> : null}
                <span
                  className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border transition-[border-color,scale] duration-500 ease-[var(--ease-out)] group-hover:scale-110 ${
                    i === PS_STEPS.length - 1 ? "border-accent bg-accent" : "border-line-strong bg-bg group-hover:border-accent"
                  }`}
                >
                  <span className={`t-mono text-sm font-semibold ${i === PS_STEPS.length - 1 ? "text-white" : "text-fg"}`}>{s.n}</span>
                </span>
                <div className="pt-2.5 transition-transform duration-500 ease-[var(--ease-out)] lg:pt-8 lg:group-hover:-translate-y-1">
                  <h3 className="font-display text-xl font-bold leading-snug tracking-tight md:text-[1.35rem]">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="mt-14 flex flex-col gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:gap-6" delay={0.1}>
          <PowerSessionButton section="ps_como_funciona" className="px-8 py-4 text-lg" />
          <p className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted">{PS_MICROCOPY}</p>
        </Reveal>
      </div>
    </section>
  );
}
