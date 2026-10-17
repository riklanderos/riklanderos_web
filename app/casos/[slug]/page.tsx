import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CASES, type CaseStudy } from "@/lib/content";
import { OG_BASE, SITE } from "@/lib/site";
import { caseView, getCase, parseResult, splitBuilt } from "@/content/casos";
import { BACKDROP_TOP_PAD } from "@/lib/backdrop";
import { Backdrop } from "@/components/Backdrop";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { CountUp, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink, Eyebrow, PullQuote } from "@/components/ui";
import { BuiltSequence } from "@/components/casos/BuiltSequence";
import { CaseNav } from "@/components/casos/CaseNav";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

function describe(c: CaseStudy) {
  return `${c.problem} ${c.after}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return { title: "Caso no encontrado" };
  const title = `Caso ${c.client} — ${c.industry}`;
  const description = describe(c);
  const url = `/casos/${c.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...OG_BASE,
      title: `${title} · Rik Landeros`,
      description,
      url,
      type: "article",
      images: [
        {
          url: "/og/og-riklanderos-v2.jpg",
          width: 1200,
          height: 630,
          alt: `Caso ${c.client} · Rik Landeros`,
        },
      ],
    },
  };
}

/** Encabezado de cada bloque del caso: número mono + H2 que se revela por palabras. */
function BlockHeader({
  id,
  index,
  label,
  title,
  accent = [],
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  accent?: string[];
  children?: ReactNode;
}) {
  return (
    <div className="lg:sticky lg:top-28">
      <Eyebrow index={index}>{label}</Eyebrow>
      <div id={id}>
        <SplitWords
          as="h2"
          className="mt-5 font-display text-[clamp(1.9rem,3.4vw,2.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em]"
          text={title}
          accentWords={accent}
        />
      </div>
      {children}
    </div>
  );
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const view = caseView(c);
  const result = parseResult(c.result);
  const phases = c.built.map((b) => splitBuilt(b).phase);
  const url = `${SITE.url}/casos/${c.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: view.headline,
        description: describe(c),
        url,
        mainEntityOfPage: url,
        inLanguage: "es-MX",
        datePublished: c.publishedAt,
        dateModified: c.publishedAt,
        articleSection: "Casos",
        image: `${SITE.url}/og/og-riklanderos-v2.jpg`,
        about: { "@type": "Thing", name: c.industry },
        author: {
          "@type": "Person",
          "@id": `${SITE.url}/#rik`,
          name: SITE.name,
          url: SITE.url,
        },
        publisher: {
          "@type": "Person",
          "@id": `${SITE.url}/#rik`,
          name: SITE.name,
          url: SITE.url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Casos",
            item: `${SITE.url}/casos`,
          },
          { "@type": "ListItem", position: 3, name: c.client, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHero
        eyebrow={`Caso · ${c.client} · ${c.industry}`}
        title={view.headline}
        accentWords={view.accentWords}
        lead={c.problem}
        actions={
          <ButtonLink href="/casos" variant="ghost">
            Ver todos los casos
          </ButtonLink>
        }
      />

      {/* Ficha del caso */}
      <section aria-label={`Ficha del caso ${c.client}`} className="border-y border-line">
        <div className="container-x">
          <Stagger as="dl" className="grid grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {[
              ["Cliente", c.client],
              ["Industria", c.industry],
              ["Resultado", `${c.result} · ${c.resultLabel}`],
              ["Qué se construyó", phases.join(" → ")],
            ].map(([k, v], i) => (
              <StaggerItem
                key={k}
                className={`py-7 lg:py-9 ${i % 2 === 1 ? "border-l border-line pl-5" : "pr-5"} ${i > 1 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""} ${i > 0 ? "lg:pl-7" : ""} lg:pr-7`}
              >
                <dt className="t-mono text-[10px] uppercase tracking-[0.16em] text-muted">{k}</dt>
                <dd className="mt-2 text-[15px] leading-snug text-fg">{v}</dd>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 01 · Contexto */}
      <section className="section" aria-labelledby="caso-contexto">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BlockHeader id="caso-contexto" index="01" label="Contexto" title="Cómo operaba antes." />
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-[1.2] tracking-[-0.02em] text-fg">
                {c.before}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 02 · Diagnóstico de verdad cruda */}
      <section className="section relative isolate overflow-hidden border-t border-line" aria-labelledby="caso-diagnostico">
        <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10 opacity-50" />
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BlockHeader
              id="caso-diagnostico"
              index="02"
              label="Diagnóstico"
              title="Diagnóstico de verdad cruda."
              accent={["verdad", "cruda"]}
            />
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <div className="relative rounded-[14px] border border-line bg-elev p-7 md:p-10">
                <span aria-hidden className="absolute bottom-7 left-0 top-7 w-[2px] bg-accent md:bottom-10 md:top-10" />
                <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">Hallazgo</p>
                <p className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-[1.2] tracking-[-0.02em]">
                  {c.diagnosis}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 · Qué construimos */}
      <section className="section relative isolate overflow-hidden border-t border-line" aria-labelledby="caso-construido">
        <Image
          src="/img/blueprint.webp"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="mask-fade-y -z-10 object-cover opacity-[0.12]"
        />
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BlockHeader
              id="caso-construido"
              index="03"
              label="Qué construimos"
              title="Qué construimos, en el orden correcto."
              accent={["orden", "correcto"]}
            >
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-sm text-muted">
                  Primero dirección, después tráfico, después conversión y al final escala.
                </p>
              </Reveal>
            </BlockHeader>
          </div>
          <div className="lg:col-span-8">
            <BuiltSequence items={c.built} />
          </div>
        </div>
      </section>

      {/* 04 · Resultado */}
      <section className="section border-t border-line" aria-labelledby="caso-resultado">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BlockHeader id="caso-resultado" index="04" label="Resultado" title="Lo que cambió." />
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[14px] border border-line bg-bg p-7 md:p-12">
                <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
                <div
                  aria-hidden
                  className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-25 blur-[90px]"
                  style={{
                    background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                  }}
                />
                <p className="relative break-words font-mono text-[clamp(3.5rem,13vw,9rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-fg">
                  {result ? (
                    <>
                      <CountUp to={result.n} />
                      <span className="text-accent">{result.suffix}</span>
                    </>
                  ) : (
                    c.result
                  )}
                </p>
                <p className="t-mono relative mt-5 text-xs uppercase tracking-[0.14em] text-accent-text">{c.resultLabel}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Después</p>
              <p className="mt-3 font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold leading-[1.25] tracking-[-0.02em]">
                {c.after}
              </p>
            </Reveal>
            {c.pending ? (
              <Reveal delay={0.15} className="t-mono mt-8 text-[11px] uppercase tracking-[0.14em] text-muted">
                Cifras en verificación con el cliente.
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* 05 · Qué puedes aprender de esto: Rik con el índice arriba es el fondo del lado derecho */}
      <section
        className="section relative isolate overflow-hidden border-t border-line lg:flex lg:min-h-[86svh] lg:items-center"
        aria-labelledby="caso-leccion"
      >
        <Backdrop
          src="/img/orig/rik-15.webp"
          alt="Rik Landeros sonriendo con el dedo índice levantado, como quien comparte una lección"
          side="right"
          width="52%"
          focus="60% 6%"
          focusLg="62% 22%"
          sizes="(min-width: 1024px) 52vw, 100vw"
        />
        <div className={`container-x relative w-full ${BACKDROP_TOP_PAD}`}>
          <div className="lg:w-[56%] lg:pr-8">
            <Reveal>
              <Eyebrow index="05">La lección</Eyebrow>
            </Reveal>
            <div id="caso-leccion">
              <SplitWords
                as="h2"
                className="mt-5 font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
                text="Qué puedes aprender de esto."
              />
            </div>
            <Reveal delay={0.1} className="mt-10">
              <PullQuote>{c.lesson}</PullQuote>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-10 max-w-xl text-muted">
                Si te reconoces en el antes, el primer paso no es una herramienta. Es un diagnóstico.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CaseNav slug={c.slug} />

      <CTASection
        section={`caso_${c.slug}`}
        eyebrow="Tu negocio"
        body="90 minutos conmigo. Sales con el diagnóstico de tu negocio, no con una presentación."
      />
    </>
  );
}
