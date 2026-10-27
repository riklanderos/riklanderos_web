import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Arrow, Eyebrow } from "@/components/ui";
import { ARTICULOS, fechaLarga } from "@/lib/blog";
import { jsonLd } from "@/lib/jsonld";
import { OG_BASE, SITE } from "@/lib/site";

const DESCRIPTION =
  "Artículos de Rik Landeros sobre estrategia, marketing, ventas e IA para dueños de empresa: cómo ver tu negocio como sistema y qué mover primero.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  // Sin artículos todavía, la página existe pero no se indexa.
  robots: ARTICULOS.length ? undefined : { index: false, follow: true },
  openGraph: { ...OG_BASE, type: "website", url: "/blog", title: "Blog · Rik Landeros", description: DESCRIPTION },
};

export default function BlogPage() {
  const [principal, ...resto] = ARTICULOS;
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Ideas para dirigir tu negocio como sistema."
        accentWords={["sistema"]}
        lead="Estrategia, marketing, ventas e IA en el orden en que se construye un negocio. Escrito para dueños de empresa, sin humo."
      />

      <section className="section border-t border-line" aria-labelledby="articulos">
        <div className="container-x">
          <Reveal>
            <Eyebrow index="01">Artículos</Eyebrow>
          </Reveal>
          <h2 id="articulos" className="sr-only">
            Artículos
          </h2>

          {!principal ? (
            <Reveal className="mt-10" delay={0.1}>
              <p className="card max-w-[640px] p-8 text-muted">Pronto publicaremos los primeros artículos.</p>
            </Reveal>
          ) : (
            <>
              <Reveal className="mt-10" delay={0.05}>
                <Link
                  href={`/blog/${principal.slug}`}
                  className="group card grid gap-8 p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong md:p-12 lg:grid-cols-12"
                >
                  {principal.portada && (
                    <Image
                      src={principal.portada.src}
                      alt={principal.portada.alt}
                      width={1600}
                      height={900}
                      priority
                      sizes="(min-width: 1280px) 1150px, 100vw"
                      className="w-full rounded-[12px] lg:col-span-12"
                    />
                  )}
                  <div className="lg:col-span-8">
                    <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">{principal.categoria}</p>
                    <h3 className="mt-5 font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl">{principal.titulo}</h3>
                    <p className="mt-5 max-w-[60ch] text-muted">{principal.metaDescription}</p>
                  </div>
                  <div className="flex items-end justify-between gap-6 lg:col-span-4 lg:flex-col lg:items-end">
                    <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {fechaLarga(principal.publicado)} · {principal.minutos} min
                    </span>
                    <span className="inline-flex items-center gap-2 font-medium text-fg group-hover:text-accent-text">
                      Leer artículo <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>

              {resto.length > 0 && (
                <Stagger className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
                  {resto.map((a) => (
                    <StaggerItem key={a.slug} className="h-full">
                      <Link
                        href={`/blog/${a.slug}`}
                        className="group card flex h-full flex-col p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong"
                      >
                        {a.portada && (
                          <Image
                            src={a.portada.src}
                            alt={a.portada.alt}
                            width={1600}
                            height={900}
                            sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 100vw"
                            className="mb-6 w-full rounded-[10px]"
                          />
                        )}
                        <span className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">{a.categoria}</span>
                        <span className="mt-5 font-display text-2xl font-extrabold leading-[1.1] tracking-tight">{a.titulo}</span>
                        <span className="mt-3 flex-1 text-[15px] text-muted">{a.metaDescription}</span>
                        <span className="t-mono mt-6 text-[11px] uppercase tracking-[0.14em] text-muted">
                          {fechaLarga(a.publicado)} · {a.minutos} min
                        </span>
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </>
          )}
        </div>
      </section>

      <CTASection section="blog_indice" eyebrow="Siguiente paso" />

      {principal && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Blog de Rik Landeros",
            url: `${SITE.url}/blog`,
            inLanguage: "es-MX",
            author: { "@type": "Person", name: SITE.name, url: SITE.url },
            blogPost: ARTICULOS.map((a) => ({
              "@type": "BlogPosting",
              headline: a.titulo,
              url: `${SITE.url}/blog/${a.slug}`,
              datePublished: a.publicado,
              dateModified: a.actualizado,
            })),
          })}
        />
      )}
    </>
  );
}
