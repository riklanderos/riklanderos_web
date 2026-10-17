import { ScrollLine } from "../motion";

/** Riel horizontal (desktop) que une los 4 pasos y se traza en rojo conforme haces scroll. */
export function StepsRail() {
  return (
    <>
      <span aria-hidden className="absolute left-6 right-[calc(25%-24px)] top-6 hidden h-px bg-line lg:block" />
      <ScrollLine
        className="absolute left-6 right-[calc(25%-24px)] top-6 hidden h-px origin-left bg-accent lg:block"
        offset={["start 88%", "start 38%"]}
      />
    </>
  );
}

/** Tramo vertical (móvil) entre un paso y el siguiente; se traza hacia abajo con el scroll. */
export function StepConnector() {
  return (
    <>
      <span aria-hidden className="absolute bottom-0 left-6 top-12 w-px -translate-x-1/2 bg-line lg:hidden" />
      <ScrollLine
        axis="y"
        className="absolute bottom-0 left-6 top-12 w-px origin-top -translate-x-1/2 bg-accent lg:hidden"
        offset={["start 78%", "end 58%"]}
      />
    </>
  );
}
