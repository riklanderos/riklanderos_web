import clsx from "clsx";
import { Reveal, SplitWords } from "../motion";
import { Eyebrow } from "../ui";

/** Encabezado de sección de la landing: eyebrow numerado + H2 revelado por palabras + lead opcional. */
export function SectionTitle({
  id,
  index,
  eyebrow,
  title,
  accentWords = [],
  lead,
  className,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  accentWords?: string[];
  lead?: string;
  className?: string;
}) {
  return (
    <header className={clsx("max-w-[860px]", className)}>
      <Reveal>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
      </Reveal>
      <SplitWords id={id} as="h2" className="t-h2 mt-6" text={title} accentWords={accentWords} />
      {lead ? (
        <Reveal delay={0.1}>
          <p className="t-lead measure mt-6">{lead}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
