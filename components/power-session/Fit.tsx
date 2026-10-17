import { DrawPath, Stagger, StaggerItem, TiltCard } from "../motion";
import { PS_FIT } from "./data";
import { SectionTitle } from "./SectionTitle";

function Mark({ type }: { type: "yes" | "no" }) {
  return (
    <span
      aria-hidden
      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-[scale,background-color] duration-500 ease-[var(--ease-out)] group-hover/fit:scale-110 ${
        type === "yes" ? "border-accent text-accent-text group-hover/fit:bg-accent/10" : "border-line-strong text-dim"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
        {type === "yes" ? (
          <DrawPath d="M4 12.5l5 5L20 6.5" strokeWidth={2} duration={0.7} delay={0.3} />
        ) : (
          <>
            <DrawPath d="M6 6l12 12" strokeWidth={2} duration={0.5} delay={0.3} />
            <DrawPath d="M18 6L6 18" strokeWidth={2} duration={0.5} delay={0.45} />
          </>
        )}
      </svg>
    </span>
  );
}

/** 03 · Para quién es / para quién no (spec §2.1 y §2.5, sin tono ofensivo). */
export function Fit() {
  return (
    <section className="section border-t border-line" aria-labelledby="ps-para-quien">
      <div className="container-x">
        <SectionTitle
          id="ps-para-quien"
          index="03"
          eyebrow="Para quién es"
          title="Para quién es. Y para quién no."
          accentWords={["no"]}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <TiltCard
            as="article"
            reveal="view"
            max={2}
            className="spot rounded-[14px] border border-accent/50 bg-[linear-gradient(180deg,rgba(229,28,30,0.1),rgba(229,28,30,0)_60%)] bg-elev p-8 transition-colors duration-500 hover:border-accent md:p-10"
          >
            <h3 className="t-mono text-[11px] uppercase tracking-[0.16em] text-fg">Es para ti si</h3>
            <Stagger as="ul" className="mt-8 space-y-6" stagger={0.12}>
              {PS_FIT.yes.map((t) => (
                <StaggerItem as="li" key={t} className="group/fit flex gap-4">
                  <Mark type="yes" />
                  <span className="text-fg/90">{t}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </TiltCard>

          <TiltCard
            as="article"
            reveal="view"
            delay={0.12}
            max={2}
            className="spot flex flex-col rounded-[14px] border border-line bg-elev p-8 transition-colors duration-500 hover:border-line-strong md:p-10"
          >
            <h3 className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">No es para ti si</h3>
            <Stagger as="ul" className="mt-8 space-y-6" stagger={0.12}>
              {PS_FIT.no.map((t) => (
                <StaggerItem as="li" key={t} className="group/fit flex gap-4">
                  <Mark type="no" />
                  <span className="text-muted">{t}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <div className="mt-auto pt-10">
              <p className="border-t border-line pt-6 text-[15px] text-fg">Si no es para ti, mejor saberlo antes de pagar.</p>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
