import type { Metadata } from "next";
import { OG_BASE } from "@/lib/site";
import { CASES, METRICS, QUOTES } from "@/lib/content";
import { BACKDROP_TOP_PAD } from "@/lib/backdrop";
import { Backdrop } from "@/components/Backdrop";
import { PageHero } from "@/components/PageHero";
import { PowerSessionButton } from "@/components/PowerSessionButton";
import { OrderDiagram } from "@/components/OrderDiagram";
import { CTASection } from "@/components/CTASection";
import { CountUp, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink, Eyebrow, PullQuote } from "@/components/ui";
import { CaseCard } from "@/components/casos/CaseCard";
import { ClientLogos } from "@/components/casos/ClientLogos";

const TITLE = "Casos: antes, diagnóstico y después";
const DESCRIPTION =
  "Qué estaba roto, qué encontré en el diagnóstico y qué construimos en el orden correcto. Casos con cifras comprobables: de licitar a ser buscados, de 8 minutos a 12 segundos en responder.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/casos" },
  openGraph: {
    ...OG_BASE,
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
    url: "/casos",
    type: "website",
    images: [
      {
        url: "/og/og-riklanderos-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Casos de Rik Landeros",
      },
    ],
  },
};

const CASE_PARTS = [
  { n: "01", name: "Contexto", line: "Cómo operaba el negocio antes." },
  {
    n: "02",
    name: "Diagnóstico de verdad cruda",
    line: "Lo que de verdad lo estaba frenando.",
  },
  {
    n: "03",
    name: "Qué construimos",
    line: "Las piezas, en el orden correcto.",
  },
  { n: "04", name: "Resultado", line: "El cambio que se puede comprobar." },
  { n: "05", name: "Qué puedes aprender", line: "Lo que aplica a tu negocio." },
] as const;

export default function CasosPage() {
  return (
    <>
      <PageHero
        eyebrow="Casos · Pruebas, no promesas"
        title="Qué estaba roto y qué construimos en su lugar."
        accentWords={["roto"]}
        lead={
          <>
            Cada caso sigue el mismo orden: contexto, diagnóstico de verdad cruda, lo que construimos y el resultado. Solo publico
            cifras que se pueden comprobar.
          </>
        }
        actions={
          <>
            <PowerSessionButton section="casos_hero" />
            <ButtonLink href="#casos" variant="ghost">
              Ver los casos
            </ButtonLink>
          </>
        }
        image="/img/rik-glasses.webp"
        imageAlt="Rik Landeros con lentes rojos, en retrato de estudio en blanco y negro"
        imageFocus="62% 0%"
        imageFocusLg="60% 16%"
      />

      {/* Métricas de prueba (spec §1.7) */}
      <section aria-labelledby="casos-metricas" className="border-y border-line">
        <div className="container-x">
          <h2 id="casos-metricas" className="sr-only">
            Resultados de clientes
          </h2>
          <Stagger className="grid md:grid-cols-3" stagger={0.12}>
            {METRICS.map((m, i) => (
              <StaggerItem
                key={m.label}
                className={`py-10 md:px-8 md:py-14 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : "md:pl-0"}`}
              >
                <p className="whitespace-nowrap font-mono text-[clamp(3rem,6vw,5.25rem)] font-semibold leading-none tracking-[-0.05em] text-fg">
                  {m.prefix}
                  <CountUp to={m.value} />
                  <span className="text-accent">{m.suffix}</span>
                </p>
                <p className="mt-5 max-w-[280px] text-fg">{m.label}</p>
                <p className="t-mono mt-2 text-[11px] uppercase tracking-[0.14em] text-muted">{m.note}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Grid de casos */}
      <section id="casos" className="section" aria-labelledby="casos-grid">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow index="01">Casos documentados</Eyebrow>
              <div id="casos-grid">
                <SplitWords
                  as="h2"
                  className="t-h2 mt-6"
                  text="Cada negocio se rompe en un lugar distinto."
                  accentWords={["distinto"]}
                />
              </div>
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <p className="t-lead">
                Uno no tenía dirección de marca. Otro perdía pacientes en el inbox. Otro cobraba poco por el mismo esfuerzo. Por
                eso no hay receta: hay diagnóstico.
              </p>
            </Reveal>
          </div>

          <Stagger as="ul" className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
            {CASES.map((c, i) => (
              <StaggerItem as="li" key={c.slug}>
                <CaseCard c={c} index={i} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Cómo leer un caso */}
      <section className="section relative isolate overflow-hidden border-t border-line" aria-labelledby="casos-orden">
        <div aria-hidden className="bg-dots mask-fade-y absolute inset-0 -z-10 opacity-60" />
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow index="02">El mismo orden en todos</Eyebrow>
              <div id="casos-orden">
                <SplitWords
                  as="h2"
                  className="t-h2 mt-6"
                  text="Ningún caso empieza por la herramienta."
                  accentWords={["herramienta"]}
                />
              </div>
              <Reveal delay={0.1}>
                <p className="t-lead mt-6">
                  Primero dirección, después tráfico, después conversión y al final escala. Cuando alguien se salta el orden,
                  compra piezas sueltas que no se hablan.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="mt-10">
                <PullQuote>{QUOTES.software}</PullQuote>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal>
                <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Cómo está escrito cada caso</p>
              </Reveal>
              <Stagger as="ol" className="mt-5 divide-y divide-line border-y border-line" stagger={0.08}>
                {CASE_PARTS.map((p) => (
                  <StaggerItem
                    as="li"
                    key={p.n}
                    className="grid grid-cols-[44px_1fr] gap-x-4 gap-y-1 py-5 md:grid-cols-[56px_1fr_1fr] md:items-baseline"
                  >
                    <span className="t-mono text-xs text-accent-text">{p.n}</span>
                    <span className="font-display text-xl font-bold tracking-tight">{p.name}</span>
                    <span className="col-start-2 text-[15px] text-muted md:col-start-auto">{p.line}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>

          <div className="mt-20 rounded-[14px] border border-line bg-bg/60 p-6 md:p-10">
            <Reveal>
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">El orden correcto</p>
            </Reveal>
            <OrderDiagram className="mt-8" />
          </div>
        </div>
      </section>

      {/* Con quién he colaborado: el retrato de cuerpo completo es el fondo del lado izquierdo */}
      <section
        className="section relative isolate overflow-hidden border-t border-line lg:flex lg:min-h-[100svh] lg:items-center"
        aria-labelledby="casos-clientes"
      >
        <Backdrop
          src="/img/rik-seated.webp"
          alt="Rik Landeros sentado en un banco, retrato de cuerpo completo sobre fondo negro"
          side="left"
          width="46%"
          focus="50% 10%"
          focusLg="50% 40%"
          sizes="(min-width: 1024px) 46vw, 100vw"
        />
        <div className={`container-x relative w-full ${BACKDROP_TOP_PAD}`}>
          <div className="lg:ml-auto lg:w-[58%]">
            <Reveal>
              <Eyebrow index="03">Trayectoria</Eyebrow>
            </Reveal>
            <div id="casos-clientes">
              <SplitWords as="h2" className="t-h2 mt-6" text="Empresas con las que he colaborado." accentWords={["colaborado"]} />
            </div>
            <Reveal delay={0.1}>
              <p className="t-lead mt-6 max-w-[600px]">
                14 años en marketing. Empecé a vender a los 17 y llegué a ser #1 nacional en ventas en una financiera. Hoy soy
                consultor de inteligencia artificial para empresas y fundador de Ingeniak.
              </p>
            </Reveal>
            <ClientLogos wide={false} className="mt-10" />
          </div>
        </div>
      </section>

      <CTASection
        section="casos_final"
        body="90 minutos conmigo. Sales con el diagnóstico de tu negocio, no con una presentación de casos."
      />
    </>
  );
}
