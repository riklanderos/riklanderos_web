import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { CountUp, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { ResourceCard } from "@/components/recursos/ResourceCard";
import { Arrow, Eyebrow, PullQuote, btn } from "@/components/ui";
import { RESOURCES } from "@/content/recursos";
import { QUOTES } from "@/lib/content";
import { OG_BASE, SITE } from "@/lib/site";

const DESCRIPTION =
  "El Business Operating System Canvas y guías de Ingeniak para revisar tu negocio en el orden correcto: branding, marketing, ventas e IA. Deja tu correo y te llegan a tu bandeja.";

export const metadata: Metadata = {
  title: "Recursos",
  description: DESCRIPTION,
  alternates: { canonical: "/recursos" },
  openGraph: {
    ...OG_BASE,
    type: "website",
    url: "/recursos",
    title: "Recursos para ver tu negocio como sistema · Rik Landeros",
    description: DESCRIPTION,
    images: [{ url: "/og/og-riklanderos.jpg", width: 1200, height: 630, alt: "Recursos · Rik Landeros" }],
  },
};

const STATS = [
  { to: 14, prefix: "", label: "Años en marketing" },
  { to: 73, prefix: "+", label: "Sistemas implementados · Ingeniak" },
  { to: 7, prefix: "", label: "Países donde opera Ingeniak" },
];

const STEPS = [
  { n: "01", title: "Eliges el recurso", body: "Empieza por el Canvas si quieres ver el negocio completo en una hoja." },
  { n: "02", title: "Dejas nombre y correo", body: "Dos campos. Nada de formularios de diez preguntas para descargar un PDF." },
  { n: "03", title: "Te llega a tu bandeja", body: "Si en unos minutos no lo ves, revisa promociones o spam." },
];

const CHANNELS = [
  { name: "Instagram", handle: "@riklanderos", body: "Ideas cortas sobre negocio, ventas e IA.", href: SITE.socials.instagram },
  { name: "YouTube", handle: "Videos", body: "Explicaciones a fondo, a peras y manzanas.", href: SITE.socials.youtube },
  { name: "LinkedIn", handle: "Rik Landeros", body: "Estrategia y sistemas para dueños de empresa.", href: SITE.socials.linkedin },
];

export default function RecursosPage() {
  const [main, ...guides] = RESOURCES;
  return (
    <>
      <PageHero
        eyebrow="Recursos"
        title="Herramientas para ver tu negocio como sistema."
        accentWords={["sistema"]}
        lead="Hojas de trabajo y guías para revisar tu negocio en el orden correcto: branding, marketing, ventas e IA. Dejas tu correo y te llegan a tu bandeja."
        actions={
          <>
            <a href={`#${main.slug}`} className={btn.primary}>
              Descarga el Canvas
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#guias" className={`${btn.ghost} bg-bg/50 backdrop-blur-sm`}>
              Ve las guías de Ingeniak
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </>
        }
        image="/img/orig/rik-15.webp"
        imageAlt="Rik Landeros riendo con el dedo índice levantado, como quien comparte una idea"
        imageFocus="60% 0%"
        imageFocusLg="62% 18%"
      />

      {/* Prueba */}
      <section aria-label="Trayectoria" className="border-y border-line">
        <Stagger className="container-x grid grid-cols-1 sm:grid-cols-3" stagger={0.1}>
          {STATS.map((s, i) => (
            <StaggerItem
              key={s.label}
              className={`flex items-baseline gap-4 py-7 sm:flex-col sm:gap-2 sm:py-10 ${
                i > 0 ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-8" : ""
              }`}
            >
              <span className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                {s.prefix ? <span className="text-accent">{s.prefix}</span> : null}
                <CountUp to={s.to} />
              </span>
              <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">{s.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* 01 · Recurso principal */}
      <section className="section" aria-labelledby="principal">
        <div className="container-x">
          <div className="max-w-[820px]">
            <Reveal>
              <Eyebrow index="01">Recurso principal</Eyebrow>
            </Reveal>
            <div id="principal">
              <SplitWords as="h2" className="t-h2 mt-6" text="Tu negocio completo en una sola hoja." accentWords={["completo"]} />
            </div>
          </div>
          <Reveal className="mt-14" delay={0.1}>
            <ResourceCard resource={main} index="01" />
          </Reveal>
        </div>
      </section>

      {/* 02 · Guías de Ingeniak */}
      <section id="guias" className="section border-t border-line" aria-labelledby="guias-title">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow index="02">Guías de Ingeniak</Eyebrow>
              </Reveal>
              <div id="guias-title">
                <SplitWords as="h2" className="t-h2 mt-6" text="Dos guías del estudio que ejecuta." accentWords={["ejecuta"]} />
              </div>
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <p className="text-muted">
                Ingeniak es el estudio que fundé en 2022 para construir lo que diseño: +73 sistemas implementados. Estas
                dos guías son del equipo.
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-14 grid gap-5 lg:grid-cols-2" stagger={0.12}>
            {guides.map((g, i) => (
              <StaggerItem key={g.slug} className="h-full">
                <ResourceCard resource={g} index={String(i + 2).padStart(2, "0")} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 03 · Cómo funciona */}
      <section className="section relative overflow-hidden border-t border-line" aria-labelledby="como-funciona">
        <div aria-hidden className="bg-dots mask-fade-y absolute inset-0 -z-10 opacity-60" />
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow index="03">Cómo funciona</Eyebrow>
            </Reveal>
            <div id="como-funciona">
              <SplitWords as="h2" className="t-h2 mt-6" text="Dos campos y llega a tu correo." accentWords={["correo"]} />
            </div>
            <Reveal delay={0.1}>
              <p className="mt-6 text-muted">Tu correo es para mandarte el recurso. No lo vendo ni lo comparto.</p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Stagger as="ol" className="divide-y divide-line border-y border-line" stagger={0.12}>
              {STEPS.map((s) => (
                <StaggerItem as="li" key={s.n} className="grid grid-cols-[3rem_1fr] gap-4 py-7">
                  <span className="t-mono pt-1 text-sm text-accent-text">{s.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">{s.title}</h3>
                    <p className="mt-2 text-[15px] text-muted">{s.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-12" delay={0.1}>
              <PullQuote>{QUOTES.software}</PullQuote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 · Contenido abierto */}
      <section className="section border-t border-line" aria-labelledby="contenido-abierto">
        <div className="container-x">
          <div className="max-w-[820px]">
            <Reveal>
              <Eyebrow index="04">Contenido abierto</Eyebrow>
            </Reveal>
            <div id="contenido-abierto">
              <SplitWords as="h2" className="t-h2 mt-6" text="Lo que publico sin pedirte el correo." accentWords={["sin"]} />
            </div>
          </div>
          <Stagger className="mt-14 grid gap-4 md:grid-cols-3" stagger={0.1}>
            {CHANNELS.map((c) => (
              <StaggerItem key={c.name}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                  className="group card flex h-full flex-col p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong"
                >
                  <span className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{c.handle}</span>
                  <span className="mt-8 flex items-center justify-between gap-4">
                    <span className="font-display text-2xl font-extrabold tracking-tight">{c.name}</span>
                    <Arrow className="h-5 w-5 -rotate-45 text-muted transition-[transform,color] duration-300 group-hover:rotate-0 group-hover:text-accent-text" />
                  </span>
                  <span className="mt-3 text-[15px] text-muted">{c.body}</span>
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        section="recursos"
        eyebrow="Siguiente paso"
        title="Un canvas te orienta. Un diagnóstico te dice qué mover."
        body="90 minutos conmigo sobre tu negocio real. Sales con los tres movimientos prioritarios en el orden correcto."
      />
    </>
  );
}
