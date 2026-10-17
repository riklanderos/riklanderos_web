import { PAINS } from "@/lib/content";
import { ParallaxLayer, Reveal, SplitWords, Stagger, TiltCard } from "../motion";
import { Eyebrow } from "../ui";

export function Problem() {
  return (
    <section className="section" aria-labelledby="problema">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow index="01">El diagnóstico que nadie te hace</Eyebrow>
          <SplitWords
            id="problema"
            as="h2"
            className="t-h2 mt-6"
            text="Emprendiste por libertad. Hoy trabajas más que de empleado."
            accentWords={["libertad"]}
          />
        </div>
        <Reveal className="space-y-5 text-muted lg:col-span-5 lg:pt-14" delay={0.15}>
          <p>
            Ya vendes. Ya tienes equipo. Ya inviertes en marketing. Y aun así eres el primero en llegar, el último en irte
            y el que resuelve todo.
          </p>
          <p className="text-fg">
            No es falta de esfuerzo. Te vendieron piezas sueltas: un logo, una pauta, un curso, un agente de IA. Y las
            piezas sueltas no hacen un motor. Hacen caos.
          </p>
        </Reveal>
      </div>

      <div className="container-x mt-16">
        <Stagger className="grid gap-px overflow-hidden rounded-[12px] border border-line bg-line md:grid-cols-3" stagger={0.12}>
          {PAINS.map((p, i) => {
            const n = String(i + 1).padStart(2, "0");
            return (
              // La celda conserva el fondo mientras la tarjeta entra (si no, asoma el color de las juntas).
              <div key={p.title} className="bg-bg">
              <TiltCard
                as="article"
                max={0}
                className="spot group h-full overflow-hidden p-8 transition-colors duration-500 hover:bg-elev md:p-10"
              >
                {/* Número grande en contorno con parallax sutil (decorativo) */}
                <ParallaxLayer distance={18} className="pointer-events-none absolute -right-2 -top-4 select-none" >
                  <span
                    aria-hidden
                    className="text-outline block font-display text-[7.5rem] font-black leading-none tracking-[-0.06em] opacity-60 transition-opacity duration-500 [--stroke:color-mix(in_srgb,var(--fg)_12%,transparent)] group-hover:opacity-100"
                  >
                    {n}
                  </span>
                </ParallaxLayer>
                <span className="t-mono relative text-xs text-accent-text">SEÑAL {n}</span>
                <h3 className="t-h3 relative mt-8 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
                  {p.title}
                </h3>
                <p className="relative mt-4 text-[15px] text-muted">{p.body}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100"
                />
              </TiltCard>
              </div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
