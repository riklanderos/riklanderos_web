import Link from "next/link";
import clsx from "clsx";
import { SERVICES } from "@/lib/content";
import { PowerSessionButton } from "../PowerSessionButton";
import { ParallaxLayer, Reveal, SplitWords, Stagger, TiltCard } from "../motion";
import { Arrow, Eyebrow, btn } from "../ui";

export function Services() {
  return (
    <section className="section relative isolate overflow-hidden" aria-labelledby="servicios-titulo" id="servicios">
      <ParallaxLayer distance={60} className="pointer-events-none absolute inset-x-0 -inset-y-20 -z-10">
        <div aria-hidden className="bg-grid mask-radial h-full w-full opacity-50" />
      </ParallaxLayer>
      <div className="container-x">
        <div className="max-w-[860px]">
          <Eyebrow index="07">Tres formas de trabajar conmigo</Eyebrow>
          <SplitWords
            id="servicios-titulo"
            as="h2"
            className="t-h2 mt-6"
            text="Primero te digo qué está mal. Después tú decides."
            accentWords={["qué", "está", "mal"]}
          />
        </div>

        <Stagger className="mt-16 grid gap-5 lg:grid-cols-3" stagger={0.12}>
          {SERVICES.map((s, i) => (
            <TiltCard
              key={s.id}
              as="article"
              max={3}
              className={clsx(
                "spot group flex flex-col rounded-[14px] border p-8 transition-[border-color,translate] duration-500 ease-[var(--ease-out)] hover:-translate-y-1.5 md:p-10",
                s.featured
                  ? "border-accent bg-[linear-gradient(180deg,rgba(229,28,30,0.12),rgba(229,28,30,0)_55%)] bg-elev"
                  : "border-line bg-elev hover:border-line-strong",
              )}
            >
              {s.featured ? (
                <span className="t-mono absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white">
                  Para empezar
                </span>
              ) : null}
              <div className="flex items-start justify-between gap-4">
                <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{s.eyebrow}</p>
                <span aria-hidden className="t-mono text-[11px] text-dim transition-colors duration-300 group-hover:text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-3xl font-extrabold tracking-tight">{s.name}</h3>
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-muted">{s.body}</p>
              <p
                className={clsx(
                  "t-mono relative mt-8 pt-5 text-xs uppercase tracking-[0.12em]",
                  s.featured ? "text-fg" : "text-muted",
                )}
              >
                {/* Filete superior que se ilumina de izquierda a derecha en hover */}
                <span aria-hidden className={clsx("absolute inset-x-0 top-0 h-px", s.featured ? "bg-accent/40" : "bg-line")} />
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100"
                />
                {s.meta}
              </p>
              <div className="mt-6">
                {s.featured ? (
                  <PowerSessionButton section="servicios" label={s.cta} className="w-full" />
                ) : (
                  // En 3 columnas la etiqueta puede no caber en una línea: se permite partirla (el brillo recorta el desborde).
                  <Link href={s.href ?? "/trabajar-conmigo"} className={clsx(btn.ghost, "btn-shine w-full [text-wrap-style:balance] lg:whitespace-normal lg:leading-snug")}>
                    {s.cta}
                    <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </TiltCard>
          ))}
        </Stagger>

        <Reveal className="mt-10 flex items-start gap-3 text-muted" delay={0.1}>
          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
          <p>
            Todo empieza con un diagnóstico: la Power Session (90 min 1:1 conmigo) o la Discovery Session (30 min, sin costo, conmigo y mi equipo). No trabajo con nadie sin diagnosticar primero.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
