import clsx from "clsx";
import { SESSION_LIST, type Session } from "@/lib/sessions";
import { SITE } from "@/lib/site";
import { Backdrop } from "./Backdrop";
import { DiscoverySessionButton } from "./DiscoverySessionButton";
import { PowerSessionButton } from "./PowerSessionButton";
import { SessionGlyph } from "./SessionGlyph";
import { Reveal, SplitWords, Stagger, StaggerItem } from "./motion";
import { Eyebrow } from "./ui";

const LEAD_BOTH =
  "Dos formas de empezar: un diagnóstico 1:1 conmigo para saber qué está fallando, o una sesión con mi equipo para implementar el sistema con Ingeniak. Tú eliges.";

/** Fila compacta de cada sesión: crema con rojo (Power) u oscura con acento crema (Discovery), como en el selector. */
function SessionOption({ s, section }: { s: Session; section: string }) {
  const power = s.key === "power";
  return (
    <div
      className={clsx(
        "@container relative rounded-[18px]",
        power ? "border-sheen bg-paper text-paper-fg" : "border border-line-strong bg-elev/85 backdrop-blur-md",
      )}
    >
      <div className="flex flex-col gap-4 p-5 sm:p-6 @min-[34rem]:flex-row @min-[34rem]:items-center @min-[34rem]:gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <SessionGlyph kind={s.key} className={clsx("h-11 w-11 shrink-0", power ? "text-paper-fg" : "text-paper")} />
          <div className="min-w-0">
            <p
              className={clsx(
                "t-mono text-[10.5px] font-medium uppercase tracking-[0.16em]",
                power ? "text-accent-paper" : "text-paper",
              )}
            >
              {s.kicker}
            </p>
            <p className="mt-1.5 font-display text-[1.45rem] font-extrabold leading-none tracking-[-0.035em]">{s.name}</p>
            <p className={clsx("mt-2 text-[13.5px] leading-snug", power ? "text-paper-muted" : "text-muted")}>
              {s.duration} · <span className={clsx("font-semibold", power ? "text-paper-fg" : "text-fg")}>{s.price}</span>
            </p>
          </div>
        </div>
        {power ? (
          <PowerSessionButton section={section} label={s.cta} className="w-full shrink-0 px-5 py-3 text-[15px] @min-[34rem]:w-auto" />
        ) : (
          <DiscoverySessionButton
            section={section}
            label={s.cta}
            className="w-full shrink-0 !bg-paper px-5 py-3 text-[15px] !text-paper-fg hover:!bg-fg @min-[34rem]:w-auto"
          />
        )}
      </div>
    </div>
  );
}

/**
 * Bloque final de conversión (spec §6.11). La foto de Rik señalando es el fondo de la sección (lado derecho en
 * desktop, arriba en móvil) y el texto va del otro lado.
 * - mode "both" (por defecto): presenta las dos formas de empezar (Power y Discovery), cada una con su botón.
 *   Usa un lead propio y neutral: se ignora el `body` que mandan las páginas.
 * - mode "power": solo la Power Session (título, body, botón y línea de precio).
 */
export function CTASection({
  section = "cta_final",
  title = "Primero la verdad cruda. Después el sistema.",
  body = "90 minutos conmigo. Sales con un diagnóstico, no con una presentación.",
  eyebrow,
  mode = "both",
}: {
  section?: string;
  title?: string;
  body?: string;
  eyebrow?: string;
  mode?: "both" | "power";
}) {
  const both = mode === "both";
  // En "both" un eyebrow de solo "Power Session" (páginas que aún lo mandan) contradice las dos opciones.
  const label = both ? (eyebrow && eyebrow !== "Power Session" ? eyebrow : "Elige cómo empezamos") : (eyebrow ?? "Power Session");

  return (
    <section className="relative isolate overflow-hidden border-t border-line" aria-labelledby={`cta-${section}`}>
      <Backdrop
        src="/img/rik-point.webp"
        alt="Rik Landeros señalando hacia las opciones para agendar"
        side="right"
        width="62%"
        focus="76% 28%"
        focusLg="84% 30%"
        mobileHeight="min(84vw, 520px)"
        // En desktop la foto no pasa de ~780px de alto (centrada): Rik se ve completo y señala hacia el texto.
        className="lg:inset-y-[max(0px,calc((100%_-_780px)/2))]"
      />
      <div className="container-x relative pb-20 pt-[calc(min(84vw,520px)-4rem)] lg:flex lg:min-h-[760px] lg:items-center lg:pb-28 lg:pt-28">
        <div className="max-w-[640px] lg:max-w-[min(640px,56%)]">
          <Reveal>
            <Eyebrow>{label}</Eyebrow>
          </Reveal>
          <SplitWords
            id={`cta-${section}`}
            as="h2"
            className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.045em]"
            text={title}
            accentWords={["verdad", "cruda"]}
          />
          <Reveal delay={0.1}>
            <p className="t-lead mt-6 max-w-lg">{both ? LEAD_BOTH : body}</p>
          </Reveal>

          {both ? (
            <Stagger as="ul" className="mt-10 grid gap-3" stagger={0.14}>
              {SESSION_LIST.map((s) => (
                <StaggerItem as="li" key={s.key}>
                  <SessionOption s={s} section={section} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Reveal delay={0.2} className="mt-10">
              <PowerSessionButton section={section} className="px-8 py-4 text-lg" />
              <p className="t-mono mt-5 text-[11px] uppercase tracking-[0.14em] text-muted">
                {SITE.powerSessionPrice} · 4 sesiones por semana · por orden de pago
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
