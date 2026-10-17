import { AUTHORITY } from "@/lib/content";
import { CountUp, Stagger, StaggerItem } from "../motion";
import { ClientsMarquee } from "./ClientsMarquee";

/** Cifra de autoridad: "#1" y "+73" llevan el símbolo en rojo; el número cuenta hacia arriba. */
function AuthorityValue({ k }: { k: string }) {
  const symbol = k.startsWith("#") || k.startsWith("+") ? k[0] : null;
  const n = Number(symbol ? k.slice(1) : k);
  return (
    <>
      {symbol ? <span className="text-accent">{symbol}</span> : null}
      <CountUp to={n} />
    </>
  );
}

export function ClientsStrip() {
  return (
    <section aria-labelledby="clientes" className="relative border-y border-line bg-bg">
      <ClientsMarquee headingId="clientes" />

      <Stagger className="container-x mt-6 grid grid-cols-2 border-t border-line md:grid-cols-4" stagger={0.1}>
        {AUTHORITY.map((a, i) => (
          <StaggerItem
            key={a.label}
            className={`flex flex-col gap-2 py-8 md:py-10 ${i % 2 === 1 ? "pl-6 border-l border-line" : ""} md:pl-8 ${
              i > 0 ? "md:border-l md:border-line" : "md:pl-0"
            }`}
          >
            <span className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">
              <AuthorityValue k={a.k} />
            </span>
            <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">{a.label}</span>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
