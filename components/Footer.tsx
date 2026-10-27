import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/site";
import { ISO_PATH } from "@/lib/logo-paths";
import { Logo } from "./Logo";
import { DrawShape, LineReveal, Stagger, StaggerItem, WipeReveal } from "./motion";
import { Arrow } from "./ui";

const linkCls = "link-sweep text-muted transition-colors hover:text-fg";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg">
      <div className="container-x grid gap-14 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <Logo className="h-14 w-auto text-fg" />
          <p className="mt-8 max-w-sm text-muted">
            Consultor de IA para empresas y fundador de Ingeniak. Leo tu negocio completo y construyo el sistema que lo
            hace crecer sin ti.
          </p>
          <a
            href={SITE.ingeniakUrl}
            target="_blank"
            rel="noopener"
            className="btn-shine group mt-8 inline-flex items-center gap-3 rounded-full border border-line-strong px-5 py-3 text-sm transition-colors hover:border-fg"
          >
            <span className="t-mono text-xs tracking-[0.14em] text-muted">YO DISEÑO.</span>
            <span className="font-medium">Ingeniak construye.</span>
            <Arrow className="transition-transform group-hover:translate-x-1" />
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>

        <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7" aria-label="Pie de página">
          <div>
            <p className="t-eyebrow">Sitio</p>
            <Stagger as="ul" className="mt-5 space-y-3" stagger={0.05}>
              {NAV_LINKS.map((l) => (
                <StaggerItem as="li" key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div>
            <p className="t-eyebrow">Trabajemos</p>
            <Stagger as="ul" className="mt-5 space-y-3" stagger={0.05}>
              <StaggerItem as="li">
                <Link href="/power-session" className={linkCls}>
                  Power Session
                </Link>
              </StaggerItem>
              <StaggerItem as="li">
                <Link href="/agendar" className={linkCls}>
                  Power o Discovery: elige
                </Link>
              </StaggerItem>
              <StaggerItem as="li">
                <Link href="/contacto" className={linkCls}>
                  Prensa y conferencias
                </Link>
              </StaggerItem>
              <StaggerItem as="li">
                <a href={SITE.ingeniakUrl} target="_blank" rel="noopener" className={linkCls}>
                  Ingeniak
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </StaggerItem>
            </Stagger>
          </div>
          <div>
            <p className="t-eyebrow">Redes</p>
            <Stagger as="ul" className="mt-5 space-y-3" stagger={0.05}>
              <StaggerItem as="li">
                <a href={SITE.socials.instagram} target="_blank" rel="noopener" className={linkCls}>
                  Instagram
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </StaggerItem>
              <StaggerItem as="li">
                <a href={SITE.socials.linkedin} target="_blank" rel="noopener" className={linkCls}>
                  LinkedIn
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </StaggerItem>
              <StaggerItem as="li">
                <a href={SITE.socials.youtube} target="_blank" rel="noopener" className={linkCls}>
                  YouTube
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </StaggerItem>
            </Stagger>
          </div>
        </nav>
      </div>

      {/* Cierre: la brocha pinta "Haz que suceda" y el isotipo se traza y se rellena como firma. */}
      {/* La frase se mide contra el espacio que deja el isotipo (unidades de contenedor): así nunca queda
          debajo de él, aunque el navegador tenga otro tamaño de letra base. ~6.1em es lo que ocupa la frase. */}
      <div className="container-x flex items-end justify-between gap-3 [container-type:inline-size]" aria-hidden>
        <WipeReveal
          as="p"
          className="t-brush min-w-0 select-none whitespace-nowrap text-[min(10.5rem,calc((100cqw-clamp(2.75rem,7.5vw,7rem)*0.86-0.75rem)/6.1))] leading-[1.05] text-elev-2"
          duration={1.4}
        >
          Haz que suceda
        </WipeReveal>
        <svg
          viewBox="-6 -6 297.73 348.48"
          className="mb-[clamp(0.5rem,1.6vw,1.6rem)] h-[clamp(2.75rem,7.5vw,7rem)] w-auto shrink-0 text-accent"
          fill="none"
        >
          <DrawShape d={ISO_PATH} delay={0.5} duration={1.8} strokeWidth={1.2} />
        </svg>
      </div>

      <div className="relative">
        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
        <LineReveal className="absolute inset-x-0 top-0 block h-px bg-accent/60" delay={0.2} />
        <div className="container-x flex flex-col gap-3 py-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="t-mono">© {year} RIK LANDEROS · GUADALAJARA, MX</p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="link-sweep hover:text-fg">
              Privacidad
            </Link>
            <Link href="/terminos" className="link-sweep hover:text-fg">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
