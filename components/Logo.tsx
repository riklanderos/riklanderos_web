import { ISO_PATH, LANDEROS_PATH, RIK_PATH } from "@/lib/logo-paths";

type Props = {
  variant?: "full" | "iso";
  className?: string;
  title?: string;
};

/** Logo oficial (brandbook 2025). Hereda el color con `currentColor`. */
export function Logo({ variant = "full", className, title = "Rik Landeros" }: Props) {
  if (variant === "iso") {
    return (
      <svg viewBox="0 0 285.73 336.48" className={className} role="img" aria-label={title} fill="currentColor">
        <path d={ISO_PATH} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 869.52 336.48" className={className} role="img" aria-label={title} fill="currentColor">
      <path d={ISO_PATH} className="text-accent" fill="var(--accent)" />
      <path d={RIK_PATH} />
      <path d={LANDEROS_PATH} />
    </svg>
  );
}

/** Contorno del isotipo como trazo (para animaciones de dibujo). */
export const ISO_OUTLINE =
  "M4.4 0.2 L285.7 104.5 L180.5 207.6 L281.9 336.4 L111.4 274.5 L45.6 336.4 L45.6 189.9 L129.1 157.1 Z";
