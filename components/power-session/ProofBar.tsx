import Image from "next/image";
import { CLIENTS, type ClientSlug } from "@/lib/content";
import { CountUp, Reveal, Stagger, StaggerItem } from "../motion";

/** Alto de cada logo en esta franja (archivo y tamaño intrínseco viven en CLIENTS). */
const LOGO_CLS: Record<ClientSlug, string> = {
  cocacola: "h-14 md:h-16",
  nike: "h-8 md:h-9",
  bmw: "h-9 md:h-11",
  cemex: "h-5 md:h-6",
  argi: "h-7 md:h-9",
  tierrayarmonia: "h-9 md:h-12",
};

/** Solo datos verificados: spec §1.7, ingeniak.mx y lo confirmado por Rik. */
const STATS = [
  { kind: "count", to: 14, prefix: "", label: "Años en marketing" },
  { kind: "static", text: "#1", label: "Nacional en ventas (origen)" },
  { kind: "count", to: 73, prefix: "+", label: "Sistemas implementados con Ingeniak" },
  { kind: "count", to: 7, prefix: "", label: "Países donde opera Ingeniak" },
] as const;

/** Prueba social inmediatamente después del hero: quién te va a diagnosticar. */
export function ProofBar() {
  return (
    <section aria-labelledby="ps-prueba" className="relative border-y border-line bg-elev/40">
      <div className="container-x py-12 lg:py-14">
        <Reveal className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 id="ps-prueba" className="t-eyebrow !font-medium">
            Quién va a leer tu negocio
          </h2>
          <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Rik Landeros · Consultor de IA para empresas · Fundador de Ingeniak
          </p>
        </Reveal>

        <Stagger as="dl" className="mt-8 grid grid-cols-2 border-y border-line md:grid-cols-4" stagger={0.1}>
          {STATS.map((s, i) => (
            <StaggerItem
              key={s.label}
              className={`flex flex-col-reverse gap-2 py-7 md:py-8 ${i % 2 === 1 ? "border-l border-line pl-5" : "pr-4"} ${
                i >= 2 ? "border-t border-line md:border-t-0" : ""
              } ${i > 0 ? "md:border-l md:pl-7" : "md:pl-0"}`}
            >
              <dt className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted">{s.label}</dt>
              <dd className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">
                {s.kind === "count" ? (
                  <>
                    {s.prefix ? <span className="text-accent">{s.prefix}</span> : null}
                    <CountUp to={s.to} />
                  </>
                ) : (
                  <>
                    <span className="text-accent">#</span>1
                  </>
                )}
              </dd>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          <Reveal>
            <h3 className="t-eyebrow whitespace-nowrap">He colaborado con</h3>
          </Reveal>
          <Stagger as="ul" className="group/logos grid flex-1 grid-cols-3 items-center gap-x-6 gap-y-6 md:grid-cols-6" stagger={0.07}>
            {CLIENTS.map((c) => {
              const l = c.logo;
              return (
                <StaggerItem as="li" key={c.slug} className="group/logo relative flex h-14 items-center justify-center md:h-16">
                  {l ? (
                    <Image
                      src={l.src}
                      alt={c.name}
                      width={l.w}
                      height={l.h}
                      unoptimized
                      className={`${LOGO_CLS[c.slug]} w-auto max-w-full opacity-60 brightness-0 invert transition-[opacity,scale,translate] duration-500 ease-[var(--ease-out)] group-hover/logos:opacity-30 group-hover/logo:-translate-y-0.5 group-hover/logo:scale-110 group-hover/logo:opacity-100!`}
                    />
                  ) : (
                    <span className="t-mono text-xs uppercase tracking-[0.14em] text-muted">{c.name}</span>
                  )}
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
