import type { Metadata } from "next";
import Link from "next/link";
import { DiscoverySessionButton } from "@/components/DiscoverySessionButton";
import { SESSIONS } from "@/lib/sessions";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { PowerSessionButton } from "@/components/PowerSessionButton";
import { Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { ClientLogos } from "@/components/radikales/ClientLogos";
import { Arrow, Eyebrow, btn } from "@/components/ui";
import { COUNTRIES } from "@/lib/content";
import { OG_BASE, SITE } from "@/lib/site";

const DESCRIPTION =
  "Prensa, conferencias, podcast y alianzas con Rik Landeros, consultor de IA para empresas y fundador de Ingeniak. Si quieres trabajar conmigo en tu negocio, empieza con un diagnóstico: Power Session o Discovery Session.";

export const metadata: Metadata = {
  title: "Contacto",
  description: DESCRIPTION,
  alternates: { canonical: "/contacto" },
  openGraph: {
    ...OG_BASE,
    type: "website",
    url: "/contacto",
    title: "Contacto · Rik Landeros",
    description: DESCRIPTION,
    images: [{ url: "/og/og-riklanderos.jpg", width: 1200, height: 630, alt: "Contacto · Rik Landeros" }],
  },
};

const TOPICS = [
  { t: "IA aplicada a ventas", d: "Agentes de IA en WhatsApp, CRM y automatización conectados a un proceso comercial real." },
  { t: "El orden correcto", d: "Branding, marketing, ventas e IA. Por qué la mayoría de las empresas lo hace al revés." },
  { t: "Del autoempleo a la empresa", d: "Cómo el dueño deja de ser el cuello de botella de su propio negocio." },
  { t: "La agencia que quebré", d: "Lo que aprendí cuando tuve un equipo completo en nómina y cero estrategia." },
];

const FACTS: { k: string; v: string }[] = [
  { k: "Nombre", v: "Rik Landeros" },
  { k: "Rol", v: "Consultor de inteligencia artificial para empresas · Fundador de Ingeniak" },
  { k: "Trayectoria", v: "14 años en marketing. Empezó a vender a los 17 y fue #1 nacional en ventas en una financiera." },
  { k: "Ingeniak", v: `Estudio de implementación de IA fundado en 2022. +73 sistemas implementados. Opera en ${COUNTRIES.join(", ")}.` },
  { k: "Base", v: "Guadalajara, México" },
];

const CHANNELS = [
  { label: "Instagram", value: "@riklanderos", href: SITE.socials.instagram },
  { label: "LinkedIn", value: "Rik Landeros", href: SITE.socials.linkedin },
  { label: "YouTube", value: "Canal", href: SITE.socials.youtube },
];

export default function ContactoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Prensa, conferencias, podcast y alianzas."
        accentWords={["alianzas"]}
        lead="Si quieres invitarme a tu evento, entrevistarme o construir algo en conjunto, escríbeme aquí. Cuéntame fecha, formato y audiencia."
        actions={
          <a href="#formulario" className={btn.primary}>
            Escribe tu mensaje
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        }
        image="/img/orig/rik-9.webp"
        imageAlt="Rik Landeros sonriendo y haciendo con la mano el gesto de llamar por teléfono"
        imageFocus="50% 0%"
        imageFocusLg="50% 16%"
      />

      {/* Desvío a las dos sesiones para quien busca consultoría o implementación */}
      <section aria-label="Si buscas consultoría" className="border-y border-line bg-elev">
        <div className="container-x py-12 lg:py-16">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">¿Buscas consultoría?</p>
              <p className="mt-4 font-display text-[clamp(1.6rem,3.2vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                Si lo que buscas es trabajar conmigo en tu negocio, empieza con un diagnóstico.
              </p>
              <p className="mt-3 text-muted">
                Power Session: {SESSIONS.power.duration} 1:1 conmigo · {SESSIONS.power.price}. Discovery Session:{" "}
                {SESSIONS.discovery.duration} conmigo y mi equipo · {SESSIONS.discovery.price}.{" "}
                <Link href="/agendar" className="link-underline text-fg">
                  ¿Cuál me conviene?
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
              <PowerSessionButton section="contacto" className="w-full sm:w-auto" />
              <DiscoverySessionButton section="contacto" variant="ghost" className="w-full sm:w-auto" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 01 · Para prensa y organizadores */}
      <section className="section" aria-labelledby="prensa">
        <div className="container-x">
          <div className="max-w-[820px]">
            <Reveal>
              <Eyebrow index="01">Para prensa y organizadores</Eyebrow>
            </Reveal>
            <div id="prensa">
              <SplitWords as="h2" className="t-h2 mt-6" text="Lo que necesitas para presentarme." accentWords={["presentarme"]} />
            </div>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal>
                <h3 className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">De qué hablo</h3>
              </Reveal>
              <Stagger as="ol" className="mt-5 divide-y divide-line border-y border-line" stagger={0.1}>
                {TOPICS.map((tp, i) => (
                  <StaggerItem as="li" key={tp.t} className="grid grid-cols-[2.5rem_1fr] gap-3 py-6">
                    <span className="t-mono pt-1 text-xs text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-display text-xl font-bold tracking-tight">{tp.t}</p>
                      <p className="mt-1.5 text-[15px] text-muted">{tp.d}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.1}>
                <p className="mt-6 text-[15px] text-muted">
                  Formatos: conferencia, panel, podcast y entrevista. Si necesitas semblanza o fotos, pídelas en tu mensaje.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal>
                <h3 className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Ficha rápida</h3>
              </Reveal>
              <Reveal delay={0.1}>
                <dl className="mt-5 overflow-hidden rounded-[12px] border border-line">
                  {FACTS.map((f, i) => (
                    <div key={f.k} className={`grid gap-1 bg-elev px-5 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4 ${i > 0 ? "border-t border-line" : ""}`}>
                      <dt className="t-mono pt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted">{f.k}</dt>
                      <dd className="text-[15px] text-fg/90">{f.v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <ClientLogos className="mt-10" />
            </div>
          </div>
        </div>
      </section>

      {/* 02 · Formulario */}
      <section id="formulario" className="section relative overflow-hidden border-t border-line" aria-labelledby="formulario-title">
        <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10 opacity-40" />
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow index="02">Escríbeme</Eyebrow>
              </Reveal>
              <div id="formulario-title">
                <SplitWords as="h2" className="t-h2 mt-6" text="Cuéntame qué tienes en mente." accentWords={["mente"]} />
              </div>
              <Reveal delay={0.1}>
                <p className="mt-6 text-muted">
                  Mientras más concreto, más rápido te respondo: tema, fecha, ciudad o formato y a quién le hablamos.
                </p>
              </Reveal>

              <Reveal delay={0.15} className="mt-10">
                <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Correo directo</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-2 inline-block break-all font-display text-2xl font-bold tracking-tight transition-colors hover:text-accent-text"
                >
                  {SITE.email}
                </a>
              </Reveal>

              <Stagger as="ul" className="mt-8 divide-y divide-line border-y border-line" stagger={0.08}>
                {CHANNELS.map((c) => (
                  <StaggerItem as="li" key={c.label}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener"
                      className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-fg"
                    >
                      <span className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{c.label}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-[15px]">{c.value}</span>
                        <Arrow className="-rotate-45 text-muted transition-[transform,color] duration-300 group-hover:rotate-0 group-hover:text-accent-text" />
                      </span>
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="rounded-[16px] border border-line-strong bg-elev p-6 sm:p-10">
              <LeadForm source="contacto" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
