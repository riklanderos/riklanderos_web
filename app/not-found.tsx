import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Reveal, SplitWords } from "@/components/motion";
import { Arrow, Eyebrow, btn } from "@/components/ui";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden pt-24">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10 opacity-60" />
      <div className="container-x">
        <Reveal>
          <Logo variant="iso" className="h-14 w-auto text-accent" />
        </Reveal>
        <Reveal>
          <Eyebrow className="mt-10">Error 404</Eyebrow>
        </Reveal>
        <SplitWords
          as="h1"
          className="t-h1 mt-4 max-w-3xl"
          text="Esta página no existe. Tu sistema sí puede."
          accentWords={["sistema"]}
          immediate
        />
        <Reveal delay={0.35}>
          <p className="t-lead mt-6 max-w-xl">
            El enlace está roto o cambió de lugar. Vuelve al inicio y seguimos por el orden correcto.
          </p>
        </Reveal>
        <Reveal delay={0.5} className="mt-10">
          <Link href="/" className={btn.primary}>
            Volver al inicio
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
