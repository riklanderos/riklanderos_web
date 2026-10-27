import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion } from "@/components/Accordion";
import { CTASection } from "@/components/CTASection";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { ARTICULOS, fechaLarga, getArticulo, renderArticulo } from "@/lib/blog";
import { jsonLd } from "@/lib/jsonld";
import { OG_BASE, SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICULOS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticulo(slug);
  if (!a) return { title: "Artículo no encontrado" };
  const url = `/blog/${a.slug}`;
  return {
    // El meta title ya viene completo del Estudio: sin la plantilla "· Rik Landeros".
    title: { absolute: a.metaTitle },
    description: a.metaDescription,
    keywords: [a.keyword, ...a.secundarias],
    alternates: { canonical: url },
    authors: [{ name: a.autor, url: SITE.url }],
    openGraph: {
      ...OG_BASE,
      type: "article",
      url,
      title: a.metaTitle,
      description: a.metaDescription,
      publishedTime: a.publicado,
      modifiedTime: a.actualizado,
      authors: [a.autor],
    },
  };
}

export default async function ArticuloPage({ params }: Props) {
  const { slug } = await params;
  const a = getArticulo(slug);
  if (!a) notFound();
  const { html, indice } = renderArticulo(a.markdown);
  const url = `${SITE.url}/blog/${a.slug}`;
  const faqs = a.faqs.filter((f) => f.p && f.r).map((f) => ({ q: f.p, a: f.r }));

  return (
    <>
      <article>
        {/* Cabecera */}
        <header className="container-x pt-28 md:pt-36">
          <nav aria-label="Ruta" className="t-mono flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
            <Link href="/" className="hover:text-fg">
              Inicio
            </Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-fg">
              Blog
            </Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="text-fg">
              {a.categoria}
            </span>
          </nav>
          <div className="mt-10 max-w-[980px]">
            <Eyebrow>{a.categoria}</Eyebrow>
            <h1 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.25rem)] font-extrabold leading-[1] tracking-[-0.04em]">{a.titulo}</h1>
            <p className="t-mono mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[12px] uppercase tracking-[0.12em] text-muted">
              <span>Por {a.autor}</span>
              <time dateTime={a.publicado}>{fechaLarga(a.publicado)}</time>
              <span>{a.minutos} min de lectura</span>
            </p>
          </div>

          {/* Respuesta corta: lo que citan buscadores e IAs */}
          <Reveal className="mt-12 max-w-[860px]" delay={0.05}>
            <section aria-label="La respuesta corta" className="card border-l-2 !border-l-accent p-7 md:p-9">
              <p className="t-eyebrow">La respuesta corta</p>
              <p className="mt-4 text-[1.15rem] leading-relaxed text-fg md:text-[1.3rem]">{a.respuestaDirecta}</p>
            </section>
          </Reveal>
        </header>

        {/* Cuerpo */}
        <div className="container-x section grid gap-12 lg:grid-cols-12">
          {indice.length > 1 && (
            <aside aria-label="En este artículo" className="lg:col-span-3">
              <nav className="lg:sticky lg:top-28">
                <p className="t-eyebrow">En este artículo</p>
                <ol className="mt-5 space-y-3 border-l border-line pl-5 text-[14px]">
                  {indice.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-muted transition-colors hover:text-fg">
                        {h.texto}
                      </a>
                    </li>
                  ))}
                  {faqs.length > 0 && (
                    <li>
                      <a href="#preguntas" className="text-muted transition-colors hover:text-fg">
                        Preguntas frecuentes
                      </a>
                    </li>
                  )}
                </ol>
              </nav>
            </aside>
          )}

          <div className={indice.length > 1 ? "lg:col-span-8 lg:col-start-5" : "lg:col-span-8 lg:col-start-3"}>
            <div className="articulo-prosa" dangerouslySetInnerHTML={{ __html: html }} />

            {faqs.length > 0 && (
              <section id="preguntas" aria-labelledby="t-preguntas" className="mt-20 scroll-mt-28">
                <Eyebrow>Preguntas frecuentes</Eyebrow>
                <h2 id="t-preguntas" className="t-h3 mt-5 font-display font-extrabold">
                  Lo que más me preguntan sobre esto
                </h2>
                <div className="mt-8">
                  <Accordion items={faqs} id={`blog-${a.slug}`} />
                </div>
              </section>
            )}

            {a.fuentes.length > 0 && (
              <section aria-labelledby="t-fuentes" className="mt-16">
                <p id="t-fuentes" className="t-eyebrow">
                  Fuentes
                </p>
                <ul className="mt-5 space-y-3 text-[14px] text-muted">
                  {a.fuentes.map((f) => (
                    <li key={f.url}>
                      <a href={f.url} target="_blank" rel="noopener" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                        {f.titulo}
                      </a>
                      {f.editor ? ` · ${f.editor}` : ""}
                      {f.fecha ? ` · consultada el ${fechaLarga(f.fecha)}` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </article>

      <CTASection section={`blog_${a.slug}`} eyebrow="Siguiente paso" mode={a.cta === "power-session" ? "power" : "both"} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#articulo`,
              headline: a.titulo,
              description: a.metaDescription,
              inLanguage: "es-MX",
              url,
              mainEntityOfPage: url,
              datePublished: a.publicado,
              dateModified: a.actualizado,
              keywords: [a.keyword, ...a.secundarias].join(", "),
              articleSection: a.categoria,
              author: { "@type": "Person", name: a.autor, url: SITE.url },
              publisher: { "@type": "Person", name: SITE.name, url: SITE.url },
              ...(a.fuentes.length ? { citation: a.fuentes.map((f) => ({ "@type": "CreativeWork", name: f.titulo, url: f.url })) } : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE.url}/` },
                { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
                { "@type": "ListItem", position: 3, name: a.titulo, item: url },
              ],
            },
            ...(faqs.length
              ? [
                  {
                    "@type": "FAQPage",
                    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
                  },
                ]
              : []),
          ],
        })}
      />
    </>
  );
}
