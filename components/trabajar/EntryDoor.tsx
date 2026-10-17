import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { PowerSessionButton } from "../PowerSessionButton";
import { MaskReveal, Reveal, SplitWords, Stagger, StaggerItem } from "../motion";
import { Arrow, Eyebrow } from "../ui";

const PATH = [
  {
    n: "01",
    title: "Power Session",
    body: "90 minutos 1:1 conmigo sobre tu prospección, ventas y automatización.",
  },
  {
    n: "02",
    title: "Diagnóstico",
    body: "Sales con los tres movimientos que tienes que hacer, en el orden correcto.",
  },
  {
    n: "03",
    title: "Decides",
    body: "Consultoría, Growth Partner o seguir por tu cuenta. Te digo con honestidad cuál tiene sentido.",
  },
] as const;

/** 06 · La Power Session como puerta de entrada (fondo paper). */
export function EntryDoor() {
  return (
    <section className="relative isolate overflow-hidden bg-paper text-paper-fg" aria-labelledby="trabajar-puerta">
      <Image
        src="/textures/brush-1.webp"
        alt=""
        aria-hidden
        width={600}
        height={797}
        sizes="(min-width: 1280px) 600px, 48vw"
        className="pointer-events-none absolute -right-28 -top-28 -z-10 w-[48vw] max-w-[600px] rotate-[18deg] opacity-80 mix-blend-multiply"
      />
      <div className="container-x grid items-center gap-14 py-20 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow index="06" tone="paper">
              La puerta de entrada
            </Eyebrow>
          </Reveal>
          <div id="trabajar-puerta">
            <SplitWords
              as="h2"
              className="mt-6 font-display text-[clamp(2.3rem,5vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.045em]"
              text="Todo empieza con 90 minutos de verdad cruda."
              accentWords={["verdad", "cruda"]}
            />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper-muted">
              No trabajo con nadie sin diagnosticar primero. Ni en consultoría ni en Growth Partner. La Power Session es la única
              forma de empezar.
            </p>
          </Reveal>

          <div className="mt-12 overflow-hidden rounded-[12px] border border-paper-fg/15">
            <Stagger as="ol" className="-mb-px -mr-px grid md:grid-cols-3" stagger={0.12}>
              {PATH.map((p) => (
                <StaggerItem as="li" key={p.n} className="border-b border-r border-paper-fg/15 bg-paper-soft p-5 md:p-6">
                  <span className="t-mono text-xs font-semibold text-paper-fg">{p.n}</span>
                  <p className="mt-3 font-display text-xl font-extrabold tracking-tight">{p.title}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-paper-muted">{p.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.15} className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <PowerSessionButton section="trabajar_puerta" className="px-8 py-4 text-lg" />
            <Link
              href="/power-session"
              className="group inline-flex items-center gap-2 font-medium text-paper-fg underline decoration-paper-fg/30 underline-offset-4 transition-colors hover:decoration-paper-fg"
            >
              Ve cómo funciona la Power Session
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="t-mono mt-6 text-[11px] uppercase tracking-[0.14em] text-paper-muted">
              {SITE.powerSessionPrice} · Solo 4 sesiones por semana · Por orden de pago
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <MaskReveal className="relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[14px] bg-paper-fg">
            <Image
              src="/img/orig/rik-9.webp"
              alt="Rik Landeros sonriendo y haciendo la seña de llámame con la mano"
              fill
              sizes="(min-width: 1024px) 36vw, 90vw"
              className="object-cover object-[50%_20%]"
            />
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
