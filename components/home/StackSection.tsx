import Image from "next/image";
import { STACK } from "@/lib/content";
import { Reveal, SplitWords, Stagger, TiltCard } from "../motion";
import { Eyebrow } from "../ui";

function Monogram({ name }: { name: string }) {
  return (
    <span aria-hidden className="t-mono grid h-6 w-6 place-items-center rounded-[5px] border border-line-strong text-[10px] font-semibold text-fg">
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function StackSection() {
  return (
    <section className="section border-t border-line" aria-labelledby="stack">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow index="06">Stack tecnológico de IA</Eyebrow>
            <SplitWords id="stack" as="h2" className="t-h2 mt-6" text="Las herramientas cambian. El criterio para elegirlas, no." accentWords={["criterio"]} />
          </div>
          <Reveal className="lg:col-span-5 lg:pt-14" delay={0.1}>
            <p className="t-lead">
              Trabajo con el stack que usan las empresas que operan con IA en serio. No me caso con ninguna marca: elijo la
              pieza según tu nivel, tu equipo y tu presupuesto.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
          {STACK.map((g, gi) => (
            // La celda conserva el fondo mientras la tarjeta entra (si no, asoma el color de las juntas).
            <div key={g.group} className="bg-bg">
            <TiltCard max={0} className="spot h-full p-6 transition-colors duration-500 hover:bg-elev md:p-7">
              <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-accent-text">
                {String(gi + 1).padStart(2, "0")} · {g.group}
              </p>
              <ul className="mt-6 space-y-4">
                {g.items.map((it) => (
                  <li key={it.name} className="group/item flex items-center gap-3">
                    <span className="block h-6 w-6 shrink-0 transition-[scale,rotate] duration-500 ease-[var(--ease-out)] group-hover/item:-rotate-6 group-hover/item:scale-[1.15]">
                      {it.icon ? (
                        <Image
                          src={`/stack/${it.icon}.svg`}
                          alt=""
                          width={24}
                          height={24}
                          className="h-6 w-6 opacity-70 transition-opacity duration-300 group-hover/item:opacity-100"
                          unoptimized
                        />
                      ) : (
                        <Monogram name={it.name} />
                      )}
                    </span>
                    <span className="text-[15px] text-muted transition-[color,translate] duration-300 group-hover/item:translate-x-0.5 group-hover/item:text-fg">
                      {it.name}
                    </span>
                  </li>
                ))}
              </ul>
            </TiltCard>
            </div>
          ))}
        </Stagger>
        <Reveal className="t-mono mt-6 text-[11px] uppercase tracking-[0.14em] text-muted" delay={0.1}>
          Las marcas pertenecen a sus respectivos dueños. Uso de referencia.
        </Reveal>
      </div>
    </section>
  );
}
