import Link from "next/link";
import { CASES, INGENIAK_STATS, METRICS } from "@/lib/content";
import { CountUp, ParallaxLayer, Reveal, ScrollMarquee, SplitWords, Stagger, StaggerItem, TiltCard } from "../motion";
import { Arrow, Eyebrow, btn } from "../ui";

/** Cifra de Ingeniak: "+73" y "7" cuentan al entrar; el año (2022) se queda fijo. */
function StatValue({ k }: { k: string }) {
  const symbol = k.startsWith("+") ? "+" : null;
  const n = Number(symbol ? k.slice(1) : k);
  if (!Number.isFinite(n) || n >= 1000) return <>{k}</>;
  return (
    <>
      {symbol ? <span className="text-accent">{symbol}</span> : null}
      <CountUp to={n} />
    </>
  );
}

export function Results() {
  const [featured, ...rest] = CASES;
  return (
    <section className="section overflow-hidden border-t border-line" aria-labelledby="resultados">
      {/* Franja cinética: el eyebrow de la sección en contorno, desplazándose con el scroll */}
      <ScrollMarquee className="-mt-4 mb-14 lg:-mt-8 lg:mb-20" distance={25}>
        <span className="text-outline px-[0.25em] font-display text-[clamp(4.5rem,13vw,11rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] [--stroke:color-mix(in_srgb,var(--fg)_20%,transparent)]">
          Pruebas, no promesas
        </span>
        <span className="mx-[0.35em] inline-block h-[0.16em] w-[0.16em] rotate-45 bg-accent text-[clamp(4.5rem,13vw,11rem)]" />
      </ScrollMarquee>

      <div className="container-x">
        <div className="max-w-[900px]">
          <Eyebrow index="08">Pruebas, no promesas</Eyebrow>
          <SplitWords
            id="resultados"
            as="h2"
            className="t-h2 mt-6"
            text="Mis clientes venden más y dejan de operar su negocio."
            accentWords={["operar"]}
          />
        </div>

        <Stagger className="mt-16 grid border-y border-line md:grid-cols-3" stagger={0.12}>
          {METRICS.map((m, i) => (
            <StaggerItem key={m.label} className={`group py-10 md:px-8 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : "md:pl-0"}`}>
              <p className="whitespace-nowrap font-mono text-[clamp(3.25rem,6.4vw,5.75rem)] font-semibold leading-none tracking-[-0.05em] text-fg">
                {m.prefix}
                <CountUp to={m.value} />
                <span className="inline-block text-accent transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1">
                  {m.suffix}
                </span>
              </p>
              <p className="mt-5 max-w-[260px] text-fg">{m.label}</p>
              <p className="t-mono mt-2 text-[11px] uppercase tracking-[0.14em] text-muted">{m.note}</p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Caso destacado */}
        <TiltCard reveal="view" max={0} as="article" className="spot group mt-14 grid overflow-hidden rounded-[14px] border border-line bg-elev transition-colors duration-500 hover:border-line-strong lg:grid-cols-12">
          <div className="p-8 md:p-12 lg:col-span-7">
            <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">Caso destacado · {featured.industry}</p>
            <h3 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">{featured.client}</h3>
            <Stagger as="dl" className="mt-8 grid gap-6 sm:grid-cols-3" stagger={0.1}>
              {[
                ["Antes", featured.before],
                ["Diagnóstico", featured.diagnosis],
                ["Después", featured.after],
              ].map(([k, v]) => (
                <StaggerItem key={k} className="border-t border-line-strong pt-4">
                  <dt className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{k}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-fg/90">{v}</dd>
                </StaggerItem>
              ))}
            </Stagger>
            <Link href={`/casos/${featured.slug}`} className={`${btn.text} mt-10`}>
              <span className="link-sweep">Leer el caso</span>
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative flex flex-col justify-end overflow-hidden border-t border-line bg-bg p-8 md:p-12 lg:col-span-5 lg:border-l lg:border-t-0">
            <ParallaxLayer distance={40} className="absolute inset-x-0 -inset-y-12">
              <div aria-hidden className="bg-grid h-full w-full opacity-60" />
            </ParallaxLayer>
            <Reveal y={60} delay={0.15} className="relative">
              <p className="font-mono text-[7rem] font-semibold leading-none tracking-[-0.06em] text-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105 md:text-[9rem]">
                0
              </p>
            </Reveal>
            <p className="relative t-mono mt-4 text-xs uppercase tracking-[0.14em] text-fg">Licitaciones. Ahora los buscan a ellos.</p>
          </div>
        </TiltCard>

        <Stagger className="mt-5 grid gap-5 md:grid-cols-2" stagger={0.12}>
          {rest.map((c) => (
            <TiltCard
              key={c.slug}
              as="article"
              max={3}
              className="spot group card flex flex-col p-8 transition-[border-color,translate] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-line-strong md:p-10"
            >
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{c.industry}</p>
              <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight">{c.client}</h3>
              <p className="mt-3 text-muted">{c.problem}</p>
              <p className="mt-8 origin-left font-mono text-4xl font-semibold tracking-tight text-fg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]">
                {c.result}
              </p>
              <p className="t-mono mt-1 text-[11px] uppercase tracking-[0.14em] text-accent-text">{c.resultLabel}</p>
              <Link href={`/casos/${c.slug}`} className={`${btn.text} mt-8 self-start`}>
                <span className="link-sweep">Leer el caso</span>
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </TiltCard>
          ))}
        </Stagger>

        <Stagger className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-3" stagger={0.1}>
          {INGENIAK_STATS.map((s) => (
            <div key={s.label} className="bg-bg">
              <TiltCard max={0} className="spot h-full p-6 transition-colors duration-500 hover:bg-elev">
                <p className="font-display text-3xl font-extrabold tracking-tight">
                  <StatValue k={s.k} />
                </p>
                <p className="t-mono mt-1 text-[10px] uppercase tracking-[0.14em] text-muted">{s.label} · Ingeniak</p>
              </TiltCard>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
