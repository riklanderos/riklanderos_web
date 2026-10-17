import Image from "next/image";
import clsx from "clsx";
import { CLIENTS } from "@/lib/content";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { CLIENT_LOGO_CLS, PROOF_FACTS } from "./data";

/** Autoridad verificable + empresas con las que Rik ha colaborado. */
export function ProofStrip() {
  return (
    <section aria-labelledby="metodo-autoridad" className="relative border-y border-line bg-elev/50">
      <h2 id="metodo-autoridad" className="sr-only">
        Trayectoria de Rik Landeros
      </h2>
      <Stagger className="container-x grid grid-cols-2 md:grid-cols-4" stagger={0.1}>
        {PROOF_FACTS.map((f, i) => (
          <StaggerItem
            key={f.label}
            className={clsx(
              "flex flex-col gap-2 border-line py-8 md:py-10",
              i % 2 === 1 && "border-l pl-5",
              i > 1 && "border-t md:border-t-0",
              i > 0 && "md:border-l md:pl-8",
            )}
          >
            <span className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {f.kind === "static" ? (
                f.text
              ) : (
                <>
                  {f.prefix ? <span className="text-accent">{f.prefix}</span> : null}
                  <CountUp to={f.value} />
                </>
              )}
            </span>
            <span className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted">{f.label}</span>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:gap-12">
          <Reveal>
            <p className="t-eyebrow whitespace-nowrap">He colaborado con</p>
          </Reveal>
          <Stagger
            as="ul"
            className="group/logos grid flex-1 grid-cols-3 items-center gap-x-6 gap-y-6 sm:grid-cols-6"
            stagger={0.07}
            amount={0.4}
          >
            {CLIENTS.map((c) => {
              const l = c.logo;
              return (
                <StaggerItem as="li" key={c.slug} className="group/logo flex h-14 items-center justify-center">
                  {l ? (
                    <Image
                      src={l.src}
                      alt={c.name}
                      width={l.w}
                      height={l.h}
                      unoptimized
                      className={`${CLIENT_LOGO_CLS[c.slug]} w-auto max-w-full object-contain opacity-60 brightness-0 invert transition-[opacity,scale,translate] duration-500 ease-[var(--ease-out)] group-hover/logos:opacity-30 group-hover/logo:-translate-y-0.5 group-hover/logo:scale-110 group-hover/logo:opacity-100!`}
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
