import Image from "next/image";
import { PowerSessionButton } from "../PowerSessionButton";
import { DiscoverySessionButton } from "@/components/DiscoverySessionButton";
import { MaskReveal, ParallaxLayer, Reveal, SplitWords, WipeReveal } from "../motion";

/** Cierre de /radikales: el mantra en grande (spec §7.6). */
export function Mantra() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line" aria-labelledby="mantra">
      <MaskReveal className="absolute inset-0 -z-10 opacity-35 [mask-image:radial-gradient(ellipse_at_center,#000_10%,transparent_70%)]">
        <ParallaxLayer distance={70} className="absolute inset-x-0 -inset-y-24">
          <Image src="/textures/brush-4.webp" alt="" aria-hidden fill sizes="100vw" className="object-cover" />
        </ParallaxLayer>
      </MaskReveal>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--bg)_75%)]" />

      <div className="container-x py-28 text-center lg:py-44">
        <h2 id="mantra" className="font-display font-extrabold tracking-[-0.05em]">
          <SplitWords as="span" className="block text-[clamp(2.6rem,8.5vw,7.5rem)] leading-[0.92]" text="La libertad no se sueña." />
          {/* La brocha pinta la respuesta de izquierda a derecha */}
          <WipeReveal className="t-brush mt-3 block text-[clamp(3.6rem,13vw,11.5rem)] text-accent" delay={0.45} duration={1.3}>
            Se construye.
          </WipeReveal>
        </h2>
        <Reveal delay={0.45} className="mx-auto mt-14 flex max-w-xl flex-col items-center gap-6">
          <p className="text-muted">
            Si tu negocio necesita atención antes de que abra la comunidad, empieza con un diagnóstico: la Power Session (1:1
            conmigo) o la Discovery Session (sin costo, conmigo y mi equipo).
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <PowerSessionButton section="radikales_cierre" variant="ghost" />
            <DiscoverySessionButton section="radikales_cierre" variant="ghost" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
