import type { Metadata } from "next";
import Image from "next/image";
import clsx from "clsx";
import type { ReactNode } from "react";
import { BACKDROP_TOP_PAD } from "@/lib/backdrop";
import { Backdrop } from "@/components/Backdrop";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { CountUp, MaskReveal, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { Arrow, ButtonLink, PullQuote, btn } from "@/components/ui";
import { ChapterBar, ChapterRail, type ChapterMeta } from "@/components/historia/ChapterProgress";
import { PaperClients } from "@/components/historia/PaperClients";
import { QUOTES } from "@/lib/content";
import { SITE } from "@/lib/site";
import { jsonLd } from "@/lib/jsonld";

/*
 * /historia (spec §7.5): narrativa editorial larga sobre --paper, 5 capítulos.
 * Tono: verdad cruda, cero lástima, cero épica. Solo hechos verificados
 * (spec §1.7 + datos publicados de Ingeniak + 14 años en marketing).
 */

const TITLE = "Historia: de vendedor #1 a consultor de IA";
const DESCRIPTION =
  "Empecé a vender a los 17, fui #1 nacional en ventas, monté una agencia y quebré. Hoy soy consultor de IA para empresas y fundador de Ingeniak. Te ahorro el golpe que yo me di.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/historia" },
  openGraph: {
    type: "profile",
    url: `${SITE.url}/historia`,
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
    locale: SITE.locale,
    siteName: SITE.name,
    images: [{ url: "/og/og-riklanderos.jpg", width: 1200, height: 630, alt: "Rik Landeros — Consultor de IA para empresas" }],
  },
};

const CHAPTERS: ChapterMeta[] = [
  { id: "capitulo-01", n: "01", title: "El vendedor nato" },
  { id: "capitulo-02", n: "02", title: "El lado equivocado" },
  { id: "capitulo-03", n: "03", title: "La agencia que quebró" },
  { id: "capitulo-04", n: "04", title: "Empezar de cero en Guadalajara" },
  { id: "capitulo-05", n: "05", title: "El sistema" },
];

const FACTS: { key: string; value: ReactNode; label: string }[] = [
  { key: "17", value: <CountUp to={17} />, label: "Años tenía cuando empecé a vender" },
  {
    key: "1",
    value: (
      <>
        <span className="text-accent">#</span>1
      </>
    ),
    label: "Nacional en ventas en una financiera",
  },
  { key: "14", value: <CountUp to={14} />, label: "Años en marketing" },
  { key: "2022", value: "2022", label: "Año en que fundé Ingeniak" },
  {
    key: "73",
    value: (
      <>
        <span className="text-accent">+</span>
        <CountUp to={73} />
      </>
    ),
    label: "Sistemas implementados por Ingeniak",
  },
  { key: "7", value: <CountUp to={7} />, label: "Países donde opera Ingeniak" },
];

const PROOF: ReactNode[] = [
  <>
    Clientes que <strong className="font-semibold text-paper-fg">dejaron de licitar</strong> porque ahora los buscan.
  </>,
  <>
    Casos con hasta <strong className="font-semibold text-paper-fg">300% de crecimiento en ventas</strong> en menos de 6
    meses.
  </>,
  <>
    Clientes que recuperan en promedio <strong className="font-semibold text-paper-fg">15–20 horas a la semana</strong>.
  </>,
];

const profileLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "Historia de Rik Landeros",
  url: `${SITE.url}/historia`,
  inLanguage: "es-MX",
  description: DESCRIPTION,
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE.url}/#rik`,
    name: SITE.name,
    url: SITE.url,
    image: `${SITE.url}/img/rik-hero.webp`,
    sameAs: [SITE.socials.instagram, SITE.socials.linkedin, SITE.socials.youtube],
  },
};

/* ── Piezas editoriales ─────────────────────────────────────── */

function P({ children, dropCap = false }: { children: ReactNode; dropCap?: boolean }) {
  return (
    <Reveal
      as="p"
      className={clsx(
        "text-[1.08rem] leading-[1.75] text-paper-fg/85 md:text-[1.2rem]",
        dropCap &&
          "flow-root first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[4.4rem] first-letter:font-extrabold first-letter:leading-[0.78] first-letter:text-paper-fg",
      )}
    >
      {children}
    </Reveal>
  );
}

function Quote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <Reveal className="py-6 md:py-8">
      <PullQuote tone="paper" cite={cite}>
        {children}
      </PullQuote>
    </Reveal>
  );
}

function Chapter({ meta, children }: { meta: ChapterMeta; children: ReactNode }) {
  return (
    <section
      id={meta.id}
      aria-label={`Capítulo ${meta.n}: ${meta.title}`}
      className="relative scroll-mt-10 border-t border-paper-fg/15 pt-14 lg:scroll-mt-0 lg:pt-20"
    >
      <header className="relative">
        <Reveal
          y={8}
          className="pointer-events-none absolute -top-12 right-0 select-none font-mono text-[clamp(5rem,14vw,9.5rem)] lg:-top-16 font-semibold leading-none tracking-[-0.06em] text-paper-fg/[0.07]"
        >
          <span aria-hidden="true">{meta.n}</span>
        </Reveal>
        <Reveal>
          <p className="t-mono relative flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-paper-muted">
            <span aria-hidden className="h-2 w-2 rotate-45 bg-accent" />
            Capítulo {meta.n} <span aria-hidden className="text-paper-fg/30">/</span> 05
          </p>
        </Reveal>
        <SplitWords
          as="h2"
          text={meta.title}
          className="relative mt-6 max-w-[16ch] font-display text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.045em]"
        />
      </header>
      <div className="mt-10 space-y-6 md:mt-12">{children}</div>
    </section>
  );
}

/* ── Página ─────────────────────────────────────────────────── */

export default function HistoriaPage() {
  return (
    <>
      <PageHero
        eyebrow="Historia · 14 años en marketing"
        title="Esta historia no es épica. Es útil."
        accentWords={["útil"]}
        lead={
          <>
            Vendedor desde los 17, #1 nacional en ventas, dueño de una agencia que quebró. Hoy, consultor de
            inteligencia artificial para empresas y fundador de Ingeniak. Cinco capítulos sin adornos.
          </>
        }
        actions={
          <>
            <a href="#capitulo-01" className={btn.ghost}>
              Leer el capítulo 01
              <Arrow className="rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:ml-3">
              5 capítulos · Lectura corta
            </p>
          </>
        }
        image="/img/rik-bw.webp"
        imageAlt="Retrato en blanco y negro de Rik Landeros, consultor de inteligencia artificial para empresas y fundador de Ingeniak"
        imageFocus="50% 0%"
        imageFocusLg="50% 24%"
      />

      {/* ── Narrativa en papel ─────────────────────────────── */}
      <section aria-label="Historia en cinco capítulos" className="relative overflow-x-clip bg-paper text-paper-fg">
        <ChapterBar chapters={CHAPTERS} />

        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <ChapterRail chapters={CHAPTERS} />
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-8 lg:col-start-5">
            <div className="max-w-[720px]">
              {/* Antes de empezar */}
              <div>
                <Reveal>
                  <p className="t-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-paper-muted">
                    <span aria-hidden className="h-px w-6 bg-accent" />
                    Antes de empezar
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-6 font-serif text-[1.7rem] leading-[1.22] md:text-[2.2rem]">
                    No te la cuento para que me tengas lástima ni para que me aplaudas. Te la cuento porque cada error
                    de esta historia es uno que tú ya no tienes que cometer.
                  </p>
                </Reveal>

                <Stagger as="ol" className="mt-10 border-t border-paper-fg/15 lg:hidden" stagger={0.06}>
                  {CHAPTERS.map((c) => (
                    <StaggerItem as="li" key={c.id} className="border-b border-paper-fg/15">
                      <a href={`#${c.id}`} className="group flex items-baseline gap-3 py-3.5">
                        <span className="t-mono text-[11px] font-semibold tracking-[0.12em] text-paper-muted">{c.n}</span>
                        <span className="font-display text-lg font-bold tracking-tight">{c.title}</span>
                        <Arrow className="ml-auto shrink-0 rotate-90 self-center text-paper-muted transition-transform group-hover:translate-y-0.5" />
                      </a>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>

              <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
                {/* 01 */}
                <Chapter meta={CHAPTERS[0]}>
                  <P dropCap>
                    Empecé a vender a los 17, mucho antes de saber qué era un embudo o un CRM. Tenía una sola regla:
                  </P>
                  <Quote cite="Rik, a los 17">No hablo porque no me pagan por hablar.</Quote>
                  <P>
                    Sonaba a soberbia de chavo. En realidad era instinto comercial: cada palabra tenía que mover una
                    decisión o no valía la pena decirla.
                  </P>
                  <P>
                    Ese instinto me llevó a ser <strong className="font-semibold text-paper-fg">#1 en ventas a nivel nacional</strong>{" "}
                    en una financiera. De todo el país, no de la sucursal.
                  </P>
                  <P>
                    Ahí aprendí que vender bien es entender qué necesita el otro antes de que lo diga. Y aprendí algo más
                    incómodo: vender bien no te dice si lo que vendes sirve.
                  </P>
                </Chapter>

                {/* 02 */}
                <Chapter meta={CHAPTERS[1]}>
                  <P dropCap>La financiera prometía cosas que no entregaba. Y yo era el que mejor las vendía.</P>
                  <P>
                    Tenía la habilidad y tenía la oportunidad de quedarme. Me fui. No fue heroísmo: ya no podía vender
                    algo en lo que no creía.
                  </P>
                  <Quote>No puedo vender lo que no funciona.</Quote>
                  <P>
                    De ahí sale una regla que sigo hasta hoy. Por eso empiezo con diagnóstico, no con propuesta. Si lo que
                    tienes sirve, te lo digo y no te vendo nada.
                  </P>
                </Chapter>

                {/* 03 */}
                <Chapter meta={CHAPTERS[2]}>
                  <P dropCap>
                    Después monté una agencia creyendo que sabía de marketing. Sabía vender. De estrategia no sabía nada.
                  </P>
                  <P>
                    Llegamos a tener 13 personas con sueldo fijo, una renta cara y cero estrategia. Mucho
                    movimiento, ningún sistema.
                  </P>
                  <P>
                    <strong className="font-semibold text-paper-fg">Quebré.</strong> Vendí la camioneta y terminé
                    endeudado. Sin adornos: así fue.
                  </P>
                  <Quote>El marketing no es un logo ni un botón de promocionar.</Quote>
                  <P>
                    Lo aprendí pagando. Una marca sin dirección, una pauta sin proceso y un equipo sin sistema no hacen
                    negocio: hacen nómina.
                  </P>
                  <div className="pt-6">
                    <MaskReveal direction="left" className="relative h-24 overflow-hidden rounded-[6px] md:h-32">
                      <Image
                        src="/textures/brush-4.webp"
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 720px, 92vw"
                        className="object-cover object-[50%_35%]"
                      />
                    </MaskReveal>
                  </div>
                </Chapter>

                {/* 04 */}
                <Chapter meta={CHAPTERS[3]}>
                  <P dropCap>Empecé de cero en Guadalajara. Manejé Uber y conté los pesos.</P>
                  <P>
                    No lo cuento para que suene a película. Lo cuento porque ahí se cayó la última idea equivocada que me
                    quedaba: que yo era lo que tenía.
                  </P>
                  <Quote>No eres lo material. Eres tu cerebro y tu corazón.</Quote>
                  <P>
                    La camioneta, la oficina y el equipo ya no estaban. Lo que sabía hacer seguía ahí. Con eso reconstruí
                    todo.
                  </P>
                  <P>
                    Esta vez con una convicción: el negocio no se arregla con una herramienta. Se arregla con estrategia y
                    sistemas, en el orden correcto.
                  </P>
                </Chapter>

                {/* 05 */}
                <Chapter meta={CHAPTERS[4]}>
                  <P dropCap>
                    Hoy llevo <strong className="font-semibold text-paper-fg">14 años en marketing</strong>. Soy
                    consultor de inteligencia artificial para empresas, y la convicción no cambió: primero la
                    estrategia, al final el software.
                  </P>
                  <P>
                    En 2022 fundé{" "}
                    <a
                      href={SITE.ingeniakUrl}
                      target="_blank"
                      rel="noopener"
                      className="font-semibold text-paper-fg underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-paper"
                    >
                      Ingeniak
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>{" "}
                    para implementar IA en negocios que ya venden: agentes en WhatsApp, CRM, automatización con n8n y
                    modelos de lenguaje aplicados a ventas.
                  </P>
                  <P>
                    Yo leo el negocio completo, diagnostico y diseño la arquitectura. Mi equipo en Ingeniak la construye
                    y se encarga de que funcione todos los días.
                  </P>

                  <Reveal className="py-4">
                    <p className="t-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-paper-muted">
                      <span aria-hidden className="h-px w-6 shrink-0 bg-accent" />
                      Primero el diagnóstico. Al final el software.
                    </p>
                  </Reveal>

                  <P>
                    Y estoy construyendo Radikales: una comunidad de dueños de negocio que dejan de comprar piezas sueltas
                    y aprenden a operar su negocio como un sistema.
                  </P>
                  <P>Lo que queda son resultados, no anécdotas:</P>
                  <Stagger as="ul" className="space-y-4 border-l-2 border-paper-fg/15 pl-6" stagger={0.1}>
                    {PROOF.map((item, i) => (
                      <StaggerItem as="li" key={i} className="flex gap-4 text-[1.05rem] leading-[1.6] text-paper-fg/85 md:text-[1.15rem]">
                        <span aria-hidden className="t-mono mt-[0.35em] shrink-0 text-[11px] font-semibold text-paper-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </StaggerItem>
                    ))}
                  </Stagger>

                  <Quote>{QUOTES.ia}</Quote>

                  {/* La ficha: solo cifras verificadas */}
                  <div className="pt-4">
                    <Reveal>
                      <p className="t-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-paper-muted">
                        <span aria-hidden className="h-px w-6 bg-accent" />
                        La ficha
                      </p>
                    </Reveal>
                    <Stagger
                      as="dl"
                      className="mt-6 grid grid-cols-2 border-l border-t border-paper-fg/15 sm:grid-cols-3"
                      stagger={0.08}
                    >
                      {FACTS.map((f) => (
                        <StaggerItem key={f.key} className="flex flex-col-reverse justify-end gap-2 border-b border-r border-paper-fg/15 p-5 md:p-6">
                          <dt className="t-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-paper-muted md:text-[11px]">
                            {f.label}
                          </dt>
                          <dd className="font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.04em] md:text-5xl">
                            {f.value}
                          </dd>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>

                  <div className="pt-8">
                    <PaperClients />
                  </div>
                </Chapter>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cierre: Rik hoy, de fondo a la izquierda (el CTA siguiente lleva la foto a la derecha) ── */}
      <section
        aria-labelledby="historia-cierre"
        className="section relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center"
      >
        <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-50" />
        <Backdrop
          src="/img/rik-glasses.webp"
          alt="Rik Landeros hoy, sonriendo con sus lentes rojos"
          side="left"
          width="54%"
          focus="62% 6%"
          focusLg="60% 20%"
          sizes="(min-width: 1024px) 54vw, 100vw"
        />
        <div className={`container-x relative w-full ${BACKDROP_TOP_PAD}`}>
          <div className="lg:ml-auto lg:w-[50%] lg:pl-8">
            <Reveal>
              <p className="t-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted">
                <span aria-hidden className="h-2 w-2 rotate-45 bg-accent" />
                Cierre
              </p>
            </Reveal>
            <h2
              id="historia-cierre"
              className="mt-8 font-display text-[clamp(2.2rem,4.8vw,4.1rem)] font-extrabold leading-[1] tracking-[-0.045em]"
            >
              <Reveal as="span" className="block">
                Creí que sabía.
              </Reveal>
              <Reveal as="span" delay={0.15} className="t-brush mt-3 block text-[1.45em] text-accent">
                Quebré.
              </Reveal>
              <Reveal as="span" delay={0.3} className="mt-4 block">
                Entendí que el negocio no se arregla con una herramienta.
              </Reveal>
              <Reveal as="span" delay={0.45} className="mt-6 block text-muted">
                Hoy te ahorro el golpe que yo me di.
              </Reveal>
            </h2>
            <Reveal delay={0.2} className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/radikales" variant="ghost" className="bg-bg/50 backdrop-blur-sm">
                Leer el manifiesto
              </ButtonLink>
              <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                Radikales · La libertad no se sueña. Se construye.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection section="historia_final" eyebrow="Siguiente capítulo: tu negocio" />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(profileLd)} />
    </>
  );
}
