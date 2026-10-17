import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className,
  index,
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  index?: string;
  /** "paper": sobre fondo --paper (texto paper-muted, índice en rojo oscuro con contraste AA). */
  tone?: "dark" | "paper";
}) {
  return (
    <p className={clsx("t-eyebrow flex items-center gap-3", tone === "paper" && "!text-paper-muted", className)}>
      {index ? (
        <span className={tone === "paper" ? "text-accent-paper" : "text-accent-text"}>{index}</span>
      ) : (
        <span aria-hidden className="h-px w-6 bg-accent" />
      )}
      <span>{children}</span>
    </p>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={clsx("h-4 w-4 shrink-0", className)} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const base =
  "group inline-flex max-w-full items-center justify-center gap-2.5 whitespace-normal text-center sm:whitespace-nowrap rounded-full font-medium transition-[background,color,border-color,scale] duration-300 ease-[var(--ease-out)] active:scale-[0.98]";
export const btn = {
  primary: clsx(base, "bg-accent text-white px-6 py-3.5 hover:bg-accent-hover"),
  ghost: clsx(base, "border border-line-strong text-fg px-6 py-3.5 hover:border-fg"),
  dark: clsx(base, "bg-paper-fg text-paper px-6 py-3.5 hover:bg-black"),
  text: "group inline-flex items-center gap-2 font-medium text-fg hover:text-accent-text transition-colors",
};

export function ButtonLink({
  href,
  children,
  variant = "ghost",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof btn;
  className?: string;
}) {
  return (
    <Link href={href} className={clsx(btn[variant], className)}>
      {children}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function PullQuote({ children, className, cite = "Rik", tone = "dark" }: { children: ReactNode; className?: string; cite?: string; tone?: "dark" | "paper" }) {
  return (
    <figure className={clsx("border-l-2 border-accent pl-6", className)}>
      <blockquote
        className={clsx(
          "font-serif text-[1.75rem] leading-[1.15] italic md:text-[2.25rem]",
          tone === "paper" ? "text-paper-fg" : "text-fg",
        )}
      >
        “{children}”
      </blockquote>
      <figcaption className={clsx("t-eyebrow mt-4", tone === "paper" && "!text-paper-muted")}>— {cite}</figcaption>
    </figure>
  );
}

