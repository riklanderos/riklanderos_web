import type { Metadata } from "next";
import Link from "next/link";
import { BACKDROP_WIDE_H, BACKDROP_WIDE_PAD } from "@/lib/backdrop";
import { Backdrop } from "@/components/Backdrop";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import { Arrow, Eyebrow, btn } from "@/components/ui";
import { getResource } from "@/content/recursos";
import { SITE, powerSessionHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gracias",
  description: "Lo que sigue después de agendar tu Power Session, descargar un recurso, anotarte en Radikales o escribirme.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/**
 * Pendiente (spec §7.9): reemplazar por la URL de un video corto de Rik
 * (reel de Instagram o YouTube). Mientras tanto apunta al perfil de Instagram.
 */
const SHORT_VIDEO_URL = SITE.socials.instagram;

type Src = "powersession" | "recurso" | "radikales" | "contacto";
const SOURCES: readonly Src[] = ["powersession", "recurso", "radikales", "contacto"];

type Step = { title: string; body: string; done?: boolean; href?: string; cta?: string };
type Variant = {
  eyebrow: string;
  title: string;
  accent: string[];
  lead: string;
  image: string;
  imageAlt: string;
  /** object-position de la foto en móvil / desktop. */
  focus: string;
  focusLg: string;
  stepsTitle: string;
  steps: Step[];
  action?: { href: string; label: string };
  cta: boolean;
};

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function variantFor(src: Src | null, resourceTitle?: string): Variant {
  switch (src) {
    case "powersession":
      return {
        eyebrow: "Power Session agendada",
        title: "Tu Power Session está apartada.",
        accent: ["apartada"],
        lead: "Revisa tu correo para la confirmación. El siguiente paso es el cuestionario previo: con eso llego a la sesión con tu negocio leído.",
        image: "/img/orig/rik-9.webp",
        imageAlt: "Rik Landeros sonriendo y haciendo con la mano el gesto de llamar por teléfono",
        focus: "50% 0%",
        focusLg: "50% 16%",
        stepsTitle: "Lo que sigue antes de la sesión.",
        steps: [
          { title: "Pago y horario", body: "Listo. Tu lugar está apartado.", done: true },
          { title: "Cuestionario previo", body: "Llénalo con números reales, no con los que te gustaría tener." },
          { title: "Sesión por Google Meet", body: "90 minutos 1:1 conmigo. Ten a la mano tus ventas y tu proceso comercial." },
          { title: "Tu diagnóstico", body: "Sales con los tres movimientos prioritarios en el orden correcto y una recomendación honesta." },
        ],
        cta: false,
      };
    case "recurso":
      return {
        eyebrow: "Recurso en camino",
        title: "Revisa tu correo. Ya va en camino.",
        accent: ["correo"],
        lead: `${resourceTitle ?? "Tu recurso"} va en camino a tu correo. Si en unos minutos no lo ves, revisa promociones o spam.`,
        image: "/img/rik-glasses.webp",
        imageAlt: "Retrato en blanco y negro de Rik Landeros con lentes rojos",
        focus: "62% 0%",
        focusLg: "60% 16%",
        stepsTitle: "Cómo sacarle provecho.",
        steps: [
          { title: "Ábrelo hoy", body: "Un recurso que se queda en descargas no cambia nada." },
          { title: "Llénalo con números reales", body: "Lo que duele en papel es lo primero que hay que arreglar." },
          {
            title: "Si ves fracturas que no sabes resolver",
            body: "Eso es justo lo que revisamos en una Power Session.",
            href: powerSessionHref("gracias_recurso_pasos"),
            cta: "Agenda tu Power Session",
          },
        ],
        action: { href: "/recursos", label: "Ve los demás recursos" },
        cta: true,
      };
    case "radikales":
      return {
        eyebrow: "Lista de interés",
        title: "Estás en la lista de Radikales.",
        accent: ["Radikales"],
        lead: "Te escribo cuando abra la siguiente etapa, con cómo funciona y antes de que decidas nada. Sin fechas inventadas.",
        image: "/img/rik-seated.webp",
        imageAlt: "Rik Landeros sentado en un banco, retrato de cuerpo completo sobre fondo oscuro",
        focus: "50% 0%",
        focusLg: "50% 30%",
        stepsTitle: "Lo que pasa ahora.",
        steps: [
          { title: "Estás en la lista", body: "Guardé tus datos y lo que te tiene atrapado hoy.", done: true },
          { title: "Leo tu respuesta", body: "Me ayuda a entender en qué etapa está tu negocio y a diseñar lo que viene." },
          { title: "Te escribo cuando abra", body: "A tu correo, con cómo funciona, antes de que decidas nada." },
        ],
        action: { href: "/radikales#manifiesto", label: "Relee el manifiesto" },
        cta: true,
      };
    case "contacto":
      return {
        eyebrow: "Mensaje recibido",
        title: "Recibí tu mensaje.",
        accent: ["mensaje"],
        lead: "Lo reviso y te respondo por correo. Si encaja, te propongo siguientes pasos; si no, también te lo digo.",
        image: "/img/orig/rik-15.webp",
        imageAlt: "Rik Landeros riendo con el dedo índice levantado",
        focus: "60% 0%",
        focusLg: "62% 18%",
        stepsTitle: "Lo que pasa ahora.",
        steps: [
          { title: "Mensaje recibido", body: "Llegó completo, con el motivo que elegiste.", done: true },
          { title: "Lo reviso", body: "Tema, formato, audiencia y fecha." },
          { title: "Te respondo por correo", body: "Al correo que me dejaste en el formulario." },
        ],
        cta: false,
      };
    default:
      return {
        eyebrow: "Gracias",
        title: "Gracias. Seguimos en contacto.",
        accent: ["contacto"],
        lead: "Lo que sigue depende de lo que buscas. Aquí están los tres caminos.",
        image: "/img/rik-hero.webp",
        imageAlt: "Retrato de Rik Landeros mirando a cámara",
        focus: "58% 0%",
        focusLg: "60% 24%",
        stepsTitle: "Elige tu camino.",
        steps: [
          {
            title: "Trabajar conmigo en tu negocio",
            body: "90 minutos 1:1 y sales con un diagnóstico.",
            href: powerSessionHref("gracias_default"),
            cta: "Agenda tu Power Session",
          },
          { title: "Empezar por tu cuenta", body: "El Canvas y las guías de Ingeniak.", href: "/recursos", cta: "Descarga el Canvas" },
          { title: "Ser parte de Radikales", body: "La comunidad de dueños que construyen su libertad.", href: "/radikales", cta: "Lee el manifiesto" },
        ],
        cta: false,
      };
  }
}

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = first(sp.src);
  const src = SOURCES.find((s) => s === raw) ?? null;
  const resource = src === "recurso" ? getResource(first(sp.r)) : undefined;
  const v = variantFor(src, resource?.title);

  return (
    <>
      <PageHero
        eyebrow={v.eyebrow}
        title={v.title}
        accentWords={v.accent}
        lead={v.lead}
        actions={
          v.action ? (
            <Link href={v.action.href} className={btn.ghost}>
              {v.action.label}
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ) : undefined
        }
        image={v.image}
        imageAlt={v.imageAlt}
        imageFocus={v.focus}
        imageFocusLg={v.focusLg}
      />

      {/* 01 · Siguiente paso */}
      <section className="section border-t border-line" aria-labelledby="siguiente-paso">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow index="01">Siguiente paso</Eyebrow>
            </Reveal>
            <div id="siguiente-paso">
              <SplitWords as="h2" className="t-h2 mt-6" text={v.stepsTitle} />
            </div>
          </div>
          <Stagger as="ol" className="divide-y divide-line border-y border-line lg:col-span-7" stagger={0.12}>
            {v.steps.map((s, i) => (
              <StaggerItem as="li" key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 py-7">
                <span
                  className={`t-mono grid h-8 w-8 place-items-center rounded-full border text-xs ${
                    s.done ? "border-accent bg-accent text-white" : "border-line-strong text-accent-text"
                  }`}
                >
                  {s.done ? (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                  {s.done ? <span className="sr-only">Hecho:</span> : null}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">{s.title}</h3>
                  <p className="mt-2 text-[15px] text-muted">{s.body}</p>
                  {s.href && s.cta ? (
                    s.href.startsWith("http") ? (
                      <a href={s.href} className={`${btn.text} mt-4 text-[15px]`}>
                        {s.cta}
                        <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    ) : (
                      <Link href={s.href} className={`${btn.text} mt-4 text-[15px]`}>
                        {s.cta}
                        <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    )
                  ) : null}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 02 · Mientras tanto: Instagram. Rik con audífonos es el fondo del lado derecho */}
      <section
        className="relative isolate overflow-hidden border-t border-line pb-16 lg:flex lg:min-h-[min(84svh,760px)] lg:items-center lg:py-[120px]"
        aria-labelledby="mientras-tanto"
      >
        <div aria-hidden className="bg-dots mask-fade-y absolute inset-0 -z-20 opacity-60" />
        <Backdrop
          src="/img/orig/rik-4.webp"
          side="right"
          width="60%"
          focus="38% 30%"
          focusLg="40% 30%"
          mobileHeight={BACKDROP_WIDE_H}
          sizes="(min-width: 1024px) 60vw, 100vw"
        />

        {/* Botón de reproducir sobre la foto: lleva al perfil de Instagram */}
        <div className="absolute inset-x-0 top-0 z-10 grid h-[min(84vw,520px)] place-items-center lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[60%]">
          <a
            href={SHORT_VIDEO_URL}
            target="_blank"
            rel="noopener"
            className="group relative grid h-20 w-20 translate-x-[8%] translate-y-[55%] place-items-center rounded-full bg-accent text-white shadow-[0_0_0_10px_color-mix(in_srgb,var(--accent)_18%,transparent)] transition-[scale,box-shadow] duration-500 hover:scale-110 hover:shadow-[0_0_0_16px_color-mix(in_srgb,var(--accent)_22%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:h-24 lg:w-24 lg:translate-y-[18%]"
            aria-label="Ve mi perfil de Instagram (se abre en una pestaña nueva)"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15l12-7.5z" />
            </svg>
          </a>
        </div>

        <div className="container-x relative w-full">
          <div className={`lg:w-[46%] ${BACKDROP_WIDE_PAD}`}>
            <Reveal>
              <Eyebrow index="02">Mientras tanto</Eyebrow>
            </Reveal>
            <div id="mientras-tanto">
              <SplitWords as="h2" className="t-h2 mt-6" text="La conversación sigue en Instagram." accentWords={["Instagram"]} />
            </div>
            <Reveal delay={0.1}>
              <p className="t-lead mt-6 max-w-[520px]">
                Ahí comparto ideas cortas sobre negocio, ventas e IA. Es el camino más rápido para seguir lo que estoy
                construyendo.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={SITE.socials.instagram} target="_blank" rel="noopener" className={`${btn.ghost} bg-bg/50 backdrop-blur-sm`}>
                Sígueme en Instagram
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">@riklanderos</span>
            </Reveal>
          </div>
        </div>
      </section>

      {v.cta ? (
        <CTASection
          section={`gracias_${src ?? "default"}`}
          eyebrow="Cuando quieras el diagnóstico"
          title="Primero la verdad cruda. Después el sistema."
          body="90 minutos conmigo. Sales con un diagnóstico, no con una presentación."
        />
      ) : null}
    </>
  );
}
