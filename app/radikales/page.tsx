import type { Metadata } from "next";
import { OG_BASE } from "@/lib/site";
import { LeadForm } from "@/components/LeadForm";
import { BACKDROP_WIDE_H, BACKDROP_WIDE_PAD, STICKY_BACKDROP_INNER, STICKY_BACKDROP_OUTER } from "@/lib/backdrop";
import { Backdrop } from "@/components/Backdrop";
import { PageHero } from "@/components/PageHero";
import { CountUp, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { ClientLogos } from "@/components/radikales/ClientLogos";
import { ManifestoFull } from "@/components/radikales/ManifestoFull";
import { Mantra } from "@/components/radikales/Mantra";
import { PillarsDiagram } from "@/components/radikales/PillarsDiagram";
import { Arrow, Eyebrow, PullQuote, btn } from "@/components/ui";
import { QUOTES } from "@/lib/content";

const DESCRIPTION =
  "Radikales es la comunidad de dueños de negocio que dejan de comprar piezas sueltas y aprenden a operar su empresa como un sistema. Manifiesto, pilares y lista de interés.";

export const metadata: Metadata = {
  title: "Radikales",
  description: DESCRIPTION,
  alternates: { canonical: "/radikales" },
  openGraph: {
    ...OG_BASE,
    type: "website",
    url: "/radikales",
    title: "Radikales: empresarios que construyen su libertad",
    description: DESCRIPTION,
    images: [{ url: "/og/og-riklanderos-v2.jpg", width: 1200, height: 630, alt: "Radikales · Rik Landeros" }],
  },
};

const FOR_YOU = [
  "Ya vendes, pero todo sigue pasando por ti.",
  "Quieres entender el sistema, no solo contratarlo.",
  "Estás dispuesto a hacer el trabajo, no solo a escucharlo.",
];

const NOT_FOR_YOU = [
  "Buscas un atajo que no exija constancia.",
  "Quieres que alguien lo resuelva sin que tú cambies nada.",
  "Ya estás cómodo donde estás. Y está bien.",
];

const PILLARS = [
  {
    word: "Compromiso",
    body: "Decides en serio. No pruebas a ver qué pasa: te comprometes con un objetivo y con el proceso para llegar.",
  },
  {
    word: "Constancia",
    body: "Los sistemas se construyen con repetición, no con inspiración. Una semana buena no cambia un negocio; un año de semanas constantes, sí.",
  },
  {
    word: "Esfuerzo",
    body: "Nadie va a construir tu libertad por ti. Puedes delegar la ejecución, no la responsabilidad.",
  },
  {
    word: "Acción",
    body: "Aprender sin aplicar es entretenimiento. Cada idea se vuelve un movimiento concreto en tu negocio.",
  },
];

const PROOF = [
  { to: 14, prefix: "", suffix: "", label: "Años en marketing" },
  { to: 73, prefix: "+", suffix: "", label: "Sistemas implementados · Ingeniak" },
  { to: 7, prefix: "", suffix: "", label: "Países donde opera Ingeniak" },
  { to: 300, prefix: "", suffix: "%", label: "Crecimiento en ventas en menos de 6 meses · mejor caso" },
];

export default function RadikalesPage() {
  return (
    <>
      <PageHero
        eyebrow="Comunidad Radikales"
        title="Radikales: empresarios que construyen su libertad."
        accentWords={["libertad"]}
        lead="Para dueños de negocio que ya venden y quieren operar su empresa como un sistema vivo, no como una cadena de incendios."
        actions={
          <>
            <a href="#lista" className={btn.primary}>
              Únete a la lista de interés
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#manifiesto" className={btn.ghost}>
              Lee el manifiesto
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </>
        }
        image="/img/orig/rik-12.webp"
        imageAlt="Rik Landeros con lentes rojos y los brazos cruzados, sonriendo a cámara"
        imageFocus="58% 0%"
        imageFocusLg="58% 18%"
      />

      {/* 01 · Qué es */}
      <section className="section border-t border-line" aria-labelledby="que-es">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow index="01">Qué es Radikales</Eyebrow>
              </Reveal>
              <div id="que-es">
                <SplitWords
                  as="h2"
                  className="t-h2 mt-6"
                  text="Dueños que dejaron de comprar piezas sueltas."
                  accentWords={["piezas", "sueltas"]}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal className="space-y-5 text-[1.075rem] text-muted" delay={0.1}>
              <p>
                Radikales es una comunidad de dueños de negocio que aprenden a operar su empresa como un sistema vivo:
                branding, marketing, ventas e IA conectados y en el orden correcto.
              </p>
              <p>
                Aquí no se habla de motivación. Se habla de decisiones: qué arreglar primero, qué delegar, qué automatizar
                y qué dejar de hacer.
              </p>
              <p className="text-fg">
                Es la base de la academia que viene. La construyo con el mismo criterio que un diagnóstico: primero
                estructura, después volumen.
              </p>
            </Reveal>

            <Stagger className="mt-12 grid gap-4 sm:grid-cols-2" stagger={0.12}>
              <StaggerItem className="card p-7">
                <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">Es para ti si</p>
                <ul className="mt-5 space-y-4">
                  {FOR_YOU.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15px] text-fg/90">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
              <StaggerItem className="rounded-[10px] border border-dashed border-line-strong p-7">
                <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">No es para ti si</p>
                <ul className="mt-5 space-y-4">
                  {NOT_FOR_YOU.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15px] text-muted">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 border border-line-strong" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </section>

      {/* 02 · Manifiesto (fondo papel) */}
      <ManifestoFull />

      {/* 03 · Los 4 pilares */}
      <section className="section relative overflow-hidden" aria-labelledby="pilares">
        <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10 opacity-50" />
        <div className="container-x">
          <div className="max-w-[820px]">
            <Reveal>
              <Eyebrow index="03">Los 4 pilares</Eyebrow>
            </Reveal>
            <div id="pilares">
              <SplitWords as="h2" className="t-h2 mt-6" text="Cuatro pilares. Ninguno es opcional." accentWords={["Ninguno"]} />
            </div>
            <Reveal delay={0.1}>
              <p className="t-lead mt-6 measure">
                La libertad de un dueño no se sostiene en una idea brillante. Se sostiene en cuatro hábitos que nadie puede
                hacer por ti.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-14 hidden md:block" delay={0.1}>
            <PillarsDiagram />
          </Reveal>

          <Stagger as="ol" className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-6 lg:grid-cols-4" stagger={0.1}>
            {PILLARS.map((p, i) => (
              <StaggerItem
                as="li"
                key={p.word}
                className="group card relative overflow-hidden p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong"
              >
                <span className="t-mono text-xs text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 font-display text-[1.9rem] font-extrabold leading-none tracking-[-0.035em]">{p.word}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{p.body}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 group-hover:scale-x-100"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 04 · Quién la dirige (prueba) */}
      <section className="section relative isolate overflow-x-clip border-t border-line" aria-labelledby="quien-dirige">
        {/* Rik en su escritorio: fondo fijo del lado izquierdo mientras se lee la prueba */}
        <div aria-hidden className={STICKY_BACKDROP_OUTER}>
          <div className={STICKY_BACKDROP_INNER}>
            <Backdrop
              src="/img/rik-desk.webp"
              side="left"
              width="46%"
              focus="50% 35%"
              focusLg="44% 40%"
              mobileHeight={BACKDROP_WIDE_H}
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>
        </div>
        <div className="container-x relative">
          <div className={`lg:ml-auto lg:w-[58%] ${BACKDROP_WIDE_PAD}`}>
            <Reveal>
              <Eyebrow index="04">Quién la dirige</Eyebrow>
            </Reveal>
            <div id="quien-dirige">
              <SplitWords as="h2" className="t-h2 mt-6" text="La dirijo yo. Desde los golpes, no desde la teoría." accentWords={["golpes"]} />
            </div>
            <Reveal className="mt-8 space-y-4 text-muted" delay={0.1}>
              <p>
                Empecé a vender a los 17 y llegué a ser #1 nacional en ventas en una financiera. Llevo 14 años en
                marketing.
              </p>
              <p className="text-fg">
                Soy consultor de inteligencia artificial para empresas y fundador de Ingeniak, el estudio que construye lo
                que diseño.
              </p>
            </Reveal>

            <Stagger className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-line bg-line" stagger={0.1}>
              {PROOF.map((s) => (
                <StaggerItem key={s.label} className="bg-bg/90 p-5 backdrop-blur-sm md:p-6">
                  <p className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                    {s.prefix ? <span className="text-accent">{s.prefix}</span> : null}
                    <CountUp to={s.to} />
                    {s.suffix ? <span className="text-accent">{s.suffix}</span> : null}
                  </p>
                  <p className="t-mono mt-2 text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">{s.label}</p>
                </StaggerItem>
              ))}
            </Stagger>

            <ClientLogos className="mt-10" />

            <Reveal className="mt-12" delay={0.1}>
              <PullQuote>{QUOTES.horas}</PullQuote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 · Lista de interés */}
      <section id="lista" className="section relative overflow-hidden border-t border-line bg-elev" aria-labelledby="lista-title">
        <div aria-hidden className="bg-dots mask-fade-y absolute inset-0 opacity-60" />
        <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow index="05">Lista de interés</Eyebrow>
              </Reveal>
              <div id="lista-title">
                <SplitWords as="h2" className="t-h2 mt-6" text="Anótate. Te escribo cuando abra." accentWords={["Anótate"]} />
              </div>
              <Reveal className="mt-8 space-y-4 text-muted" delay={0.1}>
                <p>
                  Radikales abre por etapas. Si te anotas, te escribo cuando haya lugar y te explico cómo funciona antes de
                  que decidas nada.
                </p>
                <p>Tus respuestas me ayudan a entender en qué etapa está tu negocio. No las comparto con nadie.</p>
              </Reveal>
            </div>
          </div>

          <Reveal className="lg:col-span-7" delay={0.15}>
            <div className="rounded-[16px] border border-line-strong bg-bg p-6 sm:p-10">
              <p className="t-mono mb-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted">
                <span aria-hidden className="relative flex h-2 w-2">
                  <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-accent" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Radikales · Lista de interés
              </p>
              <LeadForm source="radikales" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cierre: mantra */}
      <Mantra />
    </>
  );
}
