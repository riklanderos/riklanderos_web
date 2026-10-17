/*
 * NOTA LEGAL (no se renderiza): este aviso de privacidad es una base redactada
 * para la LFPDPPP (México). Un abogado debe revisarlo antes de publicar,
 * en especial: domicilio completo del responsable, autoridad competente tras la
 * reforma de 2025, lista final de proveedores (encargados) y plazos ARCO.
 */
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SITE } from "@/lib/site";

const TITLE = "Aviso de privacidad";
const DESCRIPTION =
  "Quién trata tus datos en riklanderos.tech, para qué los usa, con quién se comparten y cómo ejercer tus derechos ARCO. Escrito para que se entienda.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacidad" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/privacidad`,
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
  return <h3 className="!mt-8 font-display first:!mt-0 text-lg font-bold tracking-tight text-fg">{children}</h3>;
}

const Email = () => <a href={mail}>{SITE.email}</a>;

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "responsable",
    title: "Quién es el responsable",
    body: (
      <>
        <p>
          <strong>Rik Landeros</strong> (en adelante, «el Responsable»), con domicilio en Guadalajara, Jalisco, México,
          es responsable del tratamiento de los datos personales que recaba a través de riklanderos.tech, conforme a la
          Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su normativa
          aplicable.
        </p>
        <p>
          Para cualquier tema relacionado con tus datos, escribe a <Email />.
        </p>
      </>
    ),
  },
  {
    id: "datos",
    title: "Qué datos recabamos",
    body: (
      <>
        <p>
          <strong>Los que tú nos das</strong> al llenar un formulario del sitio (lista de interés de Radikales, descarga
          de recursos o contacto):
        </p>
        <List>
          <Item>Nombre.</Item>
          <Item>Correo electrónico.</Item>
          <Item>Teléfono.</Item>
          <Item>Nombre de tu negocio.</Item>
          <Item>Rango aproximado de facturación de tu negocio.</Item>
          <Item>El mensaje o motivo de contacto que escribas.</Item>
        </List>
        <p>
          <strong>Los que se obtendrían al navegar</strong>, solo si en el futuro activamos cookies de analítica y
          publicidad y tú las aceptas: dirección IP, tipo de navegador y dispositivo, páginas visitadas, origen de la visita y parámetros de campaña
          (UTM).
        </p>
        <p>
          No te pedimos datos personales sensibles. Te pedimos no incluirlos en tus mensajes. Los pagos de la Power
          Session se hacen en una plataforma externa de agenda y pago: no recibimos ni guardamos los datos de tu tarjeta.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Para qué usamos tus datos",
    body: (
      <>
        <Sub>Finalidades primarias (necesarias para atenderte)</Sub>
        <List>
          <Item>Responder tu solicitud de contacto, prensa, conferencias o colaboración.</Item>
          <Item>Enviarte el recurso que solicitaste.</Item>
          <Item>Registrarte en la lista de interés de Radikales y escribirte sobre ella.</Item>
          <Item>Dar seguimiento a tu interés en una Power Session o en servicios de consultoría.</Item>
          <Item>Cumplir obligaciones legales.</Item>
        </List>
        <Sub>Finalidades secundarias (no necesarias)</Sub>
        <List>
          <Item>Enviarte contenido, novedades e invitaciones sobre estrategia, marketing, ventas e inteligencia artificial.</Item>
          <Item>Medir el uso del sitio para mejorarlo.</Item>
          <Item>Mostrarte publicidad relacionada en plataformas de terceros, como Meta.</Item>
        </List>
        <p>
          Si no quieres que usemos tus datos para las finalidades secundarias, escribe a <Email /> con el asunto
          «Finalidades secundarias». También puedes darte de baja desde el enlace que incluye cada correo. Tu negativa no
          afecta la atención de tu solicitud.
        </p>
      </>
    ),
  },
  {
    id: "terceros",
    title: "Con quién compartimos tus datos",
    body: (
      <>
        <p>
          <strong>No vendemos ni rentamos tus datos.</strong> Para operar el sitio usamos proveedores que tratan datos por
          cuenta del Responsable, solo bajo sus instrucciones y con obligaciones de confidencialidad. Algunos almacenan
          información fuera de México:
        </p>
        <List>
          <Item>
            <strong>Supabase</strong>: base de datos donde se guardan los formularios.
          </Item>
          <Item>
            <strong>n8n</strong>: automatización que entrega recursos y registra tu solicitud.
          </Item>
          <Item>
            <strong>CRM (Kommo o GoHighLevel)</strong>: gestión de contactos y seguimiento comercial.
          </Item>
          <Item>
            <strong>Proveedor de correo electrónico</strong>: envío de los correos que solicitas.
          </Item>
          <Item>
            <strong>Vercel</strong>: alojamiento del sitio.
          </Item>
          <Item>
            <strong>Google (Google Analytics 4) y Meta (Meta Pixel)</strong>: analítica y publicidad, solo si en el
            futuro las activamos y tú las aceptas.
          </Item>
        </List>
        <p>
          Si solicitas servicios de implementación, compartiremos tus datos con <strong>Ingeniak</strong>, el estudio
          que ejecuta los proyectos, para que pueda contactarte. Fuera de eso, solo transferimos datos sin tu
          consentimiento en los casos que permite la LFPDPPP, por ejemplo, ante el requerimiento de una autoridad
          competente.
        </p>
      </>
    ),
  },
  {
    id: "arco",
    title: "Tus derechos ARCO",
    body: (
      <>
        <p>Tienes derecho a:</p>
        <List>
          <Item>
            <strong>Acceso</strong>: saber qué datos tuyos tenemos y cómo los usamos.
          </Item>
          <Item>
            <strong>Rectificación</strong>: corregirlos si están incompletos o son inexactos.
          </Item>
          <Item>
            <strong>Cancelación</strong>: pedir que los eliminemos cuando ya no sean necesarios.
          </Item>
          <Item>
            <strong>Oposición</strong>: oponerte a su uso para fines específicos.
          </Item>
        </List>
        <p>Para ejercerlos, envía un correo a <Email /> con:</p>
        <List>
          <Item>Tu nombre y un medio para responderte.</Item>
          <Item>Un documento que acredite tu identidad o, en su caso, la de tu representante legal.</Item>
          <Item>La descripción clara de los datos y del derecho que quieres ejercer.</Item>
          <Item>Cualquier documento que ayude a localizar tus datos. Si pides una rectificación, indica la corrección y anexa el soporte.</Item>
        </List>
        <p>
          Te respondemos en un máximo de 20 días hábiles. Si la solicitud procede, la hacemos efectiva dentro de los 15
          días hábiles siguientes. Ejercer estos derechos no tiene costo; solo podrían cobrarse gastos justificados de
          envío o reproducción.
        </p>
      </>
    ),
  },
  {
    id: "revocacion",
    title: "Revocar tu consentimiento o limitar el uso",
    body: (
      <>
        <p>
          Puedes revocar el consentimiento que nos diste o pedir que limitemos el uso de tus datos escribiendo a{" "}
          <Email />. Ten en cuenta que, si la revocación afecta una finalidad primaria, quizá ya no podamos atender tu
          solicitud.
        </p>
        <p>
          Para dejar de recibir publicidad por teléfono o correo de forma general, también puedes inscribirte en el
          Registro Público para Evitar Publicidad (REPEP) de la Procuraduría Federal del Consumidor.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies, analítica y publicidad",
    body: (
      <>
        <p>
          Hoy el sitio no usa cookies de analítica ni de publicidad. Si en el futuro activamos{" "}
          <strong>Google Analytics 4</strong> para medir visitas o <strong>Meta Pixel</strong> para medir campañas, no se
          cargarán sin tu consentimiento: verás un aviso de cookies rechazado por defecto y actualizaremos este aviso.
        </p>
        <p>
          Cuando exista ese aviso, guardaremos tu decisión en tu navegador para no preguntarte en cada visita. Podrás
          cambiarla cuando quieras borrando las cookies del sitio en la configuración de tu navegador.
        </p>
      </>
    ),
  },
  {
    id: "seguridad",
    title: "Seguridad y conservación",
    body: (
      <p>
        Aplicamos medidas administrativas, técnicas y físicas para proteger tus datos contra daño, pérdida, alteración,
        destrucción o uso no autorizado. Los conservamos mientras sean necesarios para las finalidades de este aviso y,
        después, durante los plazos que exija la ley. Al terminar, se bloquean y se eliminan.
      </p>
    ),
  },
  {
    id: "menores",
    title: "Menores de edad",
    body: (
      <p>
        Este sitio está dirigido a dueños de negocio mayores de edad. No recabamos de forma intencional datos de menores.
        Si detectamos que los recibimos, los eliminamos.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Cambios a este aviso",
    body: (
      <p>
        Si este aviso cambia, publicamos la nueva versión en esta misma página con su fecha de actualización. Te
        recomendamos revisarlo de vez en cuando.
      </p>
    ),
  },
  {
    id: "autoridad",
    title: "Autoridad competente",
    body: (
      <p>
        Si consideras que tu derecho a la protección de datos personales fue vulnerado, puedes acudir a la autoridad
        competente en México en la materia (desde 2025, la Secretaría Anticorrupción y Buen Gobierno). Antes, si
        quieres, escríbenos a <Email /> y lo resolvemos directo.
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <>
      {/* NOTA: texto legal pendiente de revisión por un abogado antes de publicar (ver comentario al inicio). */}
      <PageHero
        eyebrow="Legal"
        title="Aviso de privacidad"
        lead={
          <>
            Quién trata tus datos, para qué y cómo ejercer tus derechos. Sin letra chiquita escondida.
            <span className="t-mono mt-5 block text-[11px] uppercase tracking-[0.16em] text-fg">{UPDATED}</span>
          </>
        }
      />

      <section className="border-t border-line" aria-label="Contenido del aviso de privacidad">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <aside className="hidden lg:col-span-3 lg:block">
            <nav aria-label="Secciones del aviso" className="sticky top-28">
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
                ¿Dudas sobre este aviso? Escribe a{" "}
                <a href={mail} className="text-fg underline decoration-accent underline-offset-4 hover:text-accent-text">
                  {SITE.email}
                </a>
                . Las reglas de uso del sitio y de la Power Session están en los{" "}
                <Link href="/terminos" className="text-fg underline decoration-accent underline-offset-4 hover:text-accent-text">
                  Términos y condiciones
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
