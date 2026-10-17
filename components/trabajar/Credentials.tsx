import { INGENIAK_STATS } from "@/lib/content";
import { CountUp, Reveal, Stagger, StaggerItem } from "../motion";
import { ClientLogos } from "../casos/ClientLogos";

const systems = INGENIAK_STATS.find((s) => s.k.startsWith("+"));

/** Franja de autoridad: solo hechos verificados (spec §1.7, ingeniak.mx y lo confirmado por Rik). */
const FACTS = [
  { node: <CountUp to={14} />, label: "Años en marketing" },
  {
    node: (
      <>
        <span className="text-accent">#</span>
        <CountUp to={1} />
      </>
    ),
    label: "Nacional en ventas (origen)",
  },
  {
    node: (
      <>
        <span className="text-accent">+</span>
        <CountUp to={Number(systems?.k.replace(/\D/g, "") ?? 73)} />
      </>
    ),
    label: "Sistemas implementados · Ingeniak",
  },
  { node: <CountUp to={7} />, label: "Países donde opera Ingeniak" },
];

export function Credentials() {
  return (
    <section aria-labelledby="trabajar-trayectoria" className="border-y border-line">
      <div className="container-x">
        <Stagger className="grid grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {FACTS.map((f, i) => (
            <StaggerItem
              key={f.label}
              className={`flex flex-col gap-2 py-8 md:py-10 ${i % 2 === 1 ? "border-l border-line pl-5 md:pl-8" : ""} ${
                i > 1 ? "border-t border-line lg:border-t-0" : ""
              } ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
            >
              <span className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">{f.node}</span>
              <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">{f.label}</span>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="border-t border-line pb-12 pt-10 md:pb-16">
          <Reveal className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 id="trabajar-trayectoria" className="t-eyebrow !font-medium">
              He colaborado con
            </h2>
            <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Consultor de IA para empresas · Fundador de Ingeniak
            </p>
          </Reveal>
          <ClientLogos />
        </div>
      </div>
    </section>
  );
}
