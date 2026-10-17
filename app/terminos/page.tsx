/*
 * NOTA LEGAL (no se renderiza): estos términos son una base redactada para
 * México. Un abogado debe revisarlos antes de publicar, en especial: política
 * de reprogramación y reembolsos de la Power Session (valores propuestos,
 * pendientes de confirmar por Rik), facturación e impuestos, quién cobra en la
 * plataforma de agenda, ley aplicable y jurisdicción, y su compatibilidad con
 * la Ley Federal de Protección al Consumidor.
 */
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SITE } from "@/lib/site";

const TITLE = "Términos y condiciones";
const DESCRIPTION =
  "Las reglas de uso de riklanderos.tech y de la Power Session: pago, reprogramación, alcance, propiedad intelectual y límites de responsabilidad.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terminos" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/terminos`,
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
    locale: SITE.locale,
    siteName: SITE.name,
    images: [{ url: "/og/og-riklanderos.jpg", width: 1200, height: 630, alt: "Rik Landeros — Consultor de IA para empresas" }],
  },
};

const UPDATED = "Última actualización: octubre 2026";
const mail = `mailto:${SITE.email}`;

/* ── Piezas de tipografía legal ─────────────────────────────── */

function List({ children }: { children: ReactNode }) {
  return <ul className="space-y-2.5">{children}</ul>;
}

function Item({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-6">
      <span aria-hidden className="absolute left-0 top-[0.72em] h-1.5 w-1.5 rotate-45 bg-accent" />
      {children}
    </li>
  );
}

function Sub({ children }: { children: ReactNode }) {
  return <h3 className="!mt-8 font-display text-lg font-bold tracking-tight text-fg first:!mt-0">{children}</h3>;
}

const Email = () => <a href={mail}>{SITE.email}</a>;

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "aceptacion",
    title: "Aceptación",
    body: (
      <p>
        Estos términos regulan el uso de riklanderos.tech y la contratación de la Power Session. Al usar el sitio o
        agendar una sesión, los aceptas. Si no estás de acuerdo, no uses el sitio.
      </p>
    ),
  },
  {
    id: "quien",
    title: "Quién está detrás",
    body: (
      <p>
        El sitio es operado por <strong>Rik Landeros</strong>, con domicilio en Guadalajara, Jalisco, México. Contacto:{" "}
        <Email />.
      </p>
    ),
  },
  {
    id: "uso",
    title: "Uso del sitio",
    body: (
      <>
        <p>Puedes navegar, leer y descargar los recursos para uso propio. No está permitido:</p>
        <List>
          <Item>Copiar o republicar el contenido con fines comerciales sin autorización por escrito.</Item>
          <Item>Extraer contenido de forma automatizada o masiva.</Item>
          <Item>Intentar vulnerar la seguridad del sitio o de sus formularios.</Item>
          <Item>Enviar información falsa, de terceros sin su permiso o con fines de spam.</Item>
        </List>
      </>
    ),
  },
  {
    id: "contenido-asesoria",
    title: "El contenido no es asesoría personalizada",
    body: (
      <>
        <p>
          Artículos, casos, diagramas y recursos son informativos y generales. No sustituyen un diagnóstico de tu negocio
          ni asesoría legal, fiscal o financiera. Lo que decidas con base en ellos es tu decisión.
        </p>
        <p>
          Los casos y cifras publicados corresponden a clientes específicos, en su contexto. No son una promesa de
          resultados para tu negocio.
        </p>
      </>
    ),
  },
  {
    id: "power-session",
    title: "Power Session",
    body: (
      <>
        <Sub>Qué es</Sub>
        <p>
          Una sesión 1:1 de 90 minutos con Rik Landeros por videollamada (Google Meet) para auditar tu prospección,
          ventas y automatización. Sales con un diagnóstico escrito, los tres movimientos prioritarios en el orden
          correcto y una recomendación honesta sobre si tiene sentido seguir trabajando juntos, o no.
        </p>

        <Sub>Precio y pago</Sub>
        <List>
          <Item>
            El precio es de <strong>{SITE.powerSessionPrice}</strong>, pago único y por adelantado.
          </Item>
          <Item>
            El pago y la agenda se hacen en la plataforma externa enlazada desde el sitio. Sus propias condiciones y
            políticas de privacidad también aplican.
          </Item>
          <Item>Los impuestos aplicables y la facturación se informan al momento del pago.</Item>
          <Item>
            Solo hay <strong>4 sesiones por semana</strong> y se asignan por orden de pago.
          </Item>
        </List>

        <Sub>Preparación</Sub>
        <p>
          Después de pagar, llenas un cuestionario breve. Sin esa información la sesión rinde menos, así que
          llénalo antes de la fecha.
        </p>

        <Sub>Reprogramación y cancelación</Sub>
        <List>
          <Item>
            Puedes reprogramar <strong>una vez</strong>, avisando con al menos <strong>24 horas</strong> de anticipación a{" "}
            <Email /> o desde la plataforma de agenda.
          </Item>
          <Item>
            Si no te conectas en los primeros <strong>15 minutos</strong> y no avisaste, la sesión se considera tomada.
          </Item>
          <Item>
            Si Rik necesita mover la sesión, te propone una nueva fecha. Si ninguna te funciona, se te reembolsa el pago
            completo.
          </Item>
          <Item>Fuera de esos casos, el pago de una sesión agendada no es reembolsable.</Item>
        </List>

        <Sub>Sin garantía de resultados</Sub>
        <p>
          La Power Session es un diagnóstico. Te digo qué está frenando tu negocio y qué mover primero; los resultados
          dependen de tu implementación, tu mercado y tu equipo. No se garantizan resultados específicos de ventas,
          ingresos ni tiempo.
        </p>

        <Sub>Confidencialidad y alcance</Sub>
        <p>
          Lo que compartas en la sesión se trata como confidencial, conforme al{" "}
          <Link href="/privacidad">Aviso de privacidad</Link>. La sesión no te obliga a contratar nada más: si tiene
          sentido seguir, te lo digo; si no, también.
        </p>
      </>
    ),
  },
  {
    id: "propiedad",
    title: "Propiedad intelectual",
    body: (
      <>
        <p>
          Los textos, fotografías, diagramas, recursos descargables y los nombres <strong>Rik Landeros</strong>,{" "}
          <strong>Sistema Radikal</strong> y <strong>Radikales</strong> pertenecen a Rik Landeros o se usan con
          autorización. Ingeniak y las marcas de clientes mencionadas pertenecen a sus respectivos titulares.
        </p>
        <p>
          Los recursos descargables son para uso personal o interno de tu negocio. No puedes revenderlos,
          redistribuirlos ni presentarlos como propios. Puedes citar fragmentos breves siempre que menciones la fuente y
          enlaces a riklanderos.tech.
        </p>
      </>
    ),
  },
  {
    id: "enlaces",
    title: "Enlaces a terceros",
    body: (
      <p>
        El sitio enlaza a plataformas de terceros, como la agenda de la Power Session, ingeniak.mx y redes sociales. No
        controlamos su contenido ni sus políticas; revísalas al usarlas.
      </p>
    ),
  },
  {
    id: "responsabilidad",
    title: "Limitación de responsabilidad",
    body: (
      <>
        <p>
          El sitio se ofrece tal como está. Hacemos lo razonable para que funcione y que su información sea correcta,
          pero no garantizamos que esté libre de errores o interrupciones.
        </p>
        <p>
          En la medida que lo permita la ley, Rik Landeros no responde por daños indirectos, pérdida de utilidades o
          decisiones tomadas con base en el contenido del sitio. Si se determinara alguna responsabilidad por la Power
          Session, esta no excederá el monto pagado por ella.
        </p>
        <p>
          Nada en estos términos limita los derechos que te otorga la Ley Federal de Protección al Consumidor.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    title: "Cambios a estos términos",
    body: (
      <p>
        Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con su fecha de
        actualización. Una sesión ya pagada se rige por los términos vigentes al momento del pago.
      </p>
    ),
  },
  {
    id: "ley",
    title: "Ley aplicable y jurisdicción",
    body: (
      <p>
        Estos términos se rigen por las leyes federales de México. Para cualquier controversia, las partes se someten a
        los tribunales competentes de Guadalajara, Jalisco, sin perjuicio de tu derecho a acudir a la Procuraduría
        Federal del Consumidor.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Contacto",
    body: (
      <p>
        Para dudas sobre estos términos o sobre una Power Session, escribe a <Email />.
      </p>
    ),
  },
];

export default function TerminosPage() {
  return (
    <>
      {/* NOTA: texto legal pendiente de revisión por un abogado antes de publicar (ver comentario al inicio). */}
      <PageHero
        eyebrow="Legal"
        title="Términos y condiciones"
        lead={
          <>
            Las reglas del sitio y de la Power Session, dichas de frente. Si algo no queda claro, pregunta antes de pagar.
            <span className="t-mono mt-5 block text-[11px] uppercase tracking-[0.16em] text-fg">{UPDATED}</span>
          </>
        }
      />

      <section className="border-t border-line" aria-label="Contenido de los términos y condiciones">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <aside className="hidden lg:col-span-3 lg:block">
            <nav aria-label="Secciones de los términos" className="sticky top-28">
              <p className="t-eyebrow">Contenido</p>
              <Stagger as="ol" className="mt-5 space-y-2.5" stagger={0.04}>
                {SECTIONS.map((s, i) => (
                  <StaggerItem as="li" key={s.id}>
                    <a href={`#${s.id}`} className="group flex gap-3 text-[14px] text-muted transition-colors hover:text-fg">
                      <span className="t-mono text-[11px] text-muted transition-colors group-hover:text-accent-text">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.title}
                    </a>
                  </StaggerItem>
                ))}
              </Stagger>
            </nav>
          </aside>

          <article className="measure min-w-0 lg:col-span-8 lg:col-start-5">
            {SECTIONS.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-titulo`}
                className="scroll-mt-6 border-t border-line pt-10 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-12"
              >
                <Reveal>
                  <p className="t-mono text-[11px] tracking-[0.16em] text-accent-text">{String(i + 1).padStart(2, "0")}</p>
                  <h2 id={`${s.id}-titulo`} className="mt-3 font-display text-[1.6rem] font-extrabold tracking-tight md:text-[1.9rem]">
                    {s.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-[16px] leading-[1.75] text-muted md:text-[17px] [&_a]:text-fg [&_a]:underline [&_a]:decoration-accent [&_a]:underline-offset-4 [&_a:hover]:text-accent-text [&_strong]:font-semibold [&_strong]:text-fg">
                    {s.body}
                  </div>
                </Reveal>
              </section>
            ))}

            <Reveal className="mt-16 rounded-[10px] border border-line bg-elev p-6 md:p-8">
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{UPDATED}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                El tratamiento de tus datos personales se explica en el{" "}
                <Link href="/privacidad" className="text-fg underline decoration-accent underline-offset-4 hover:text-accent-text">
                  Aviso de privacidad
                </Link>
                .
              </p>
            </Reveal>
          </article>
        </div>
      </section>
    </>
  );
}
