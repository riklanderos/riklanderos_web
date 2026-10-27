import Image from "next/image";
import { DiscoverySessionButton } from "@/components/DiscoverySessionButton";
import { PowerSessionButton } from "@/components/PowerSessionButton";
import type { ImagenArticulo } from "@/lib/blog";
import { SESSIONS } from "@/lib/sessions";

/**
 * Imagen dentro del artículo con su llamado a la acción: el póster a un lado y la sesión del otro
 * (apilados en celular). La imagen también lleva a la sesión.
 */
export function FiguraBlog({ imagen, section }: { imagen: ImagenArticulo; section: string }) {
  const s = imagen.cta === "discovery" ? SESSIONS.discovery : SESSIONS.power;
  const power = s.key === "power";
  return (
    <figure className="not-prose my-14 grid overflow-hidden rounded-[16px] border border-line bg-elev md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <a href={s.href(section)} aria-label={`${s.cta}: ${imagen.alt}`} className="group block overflow-hidden">
        <Image
          src={imagen.src}
          alt={imagen.alt}
          width={imagen.ancho}
          height={imagen.alto}
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </a>
      <figcaption className="flex flex-col justify-end gap-5 p-7 md:p-9">
        <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">
          {s.name} · {s.kicker}
        </p>
        {imagen.frase && <p className="font-display text-[1.7rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-fg">{imagen.frase}</p>}
        <p className="text-[15px] leading-relaxed text-muted">
          {s.tagline} {s.duration} · {s.price}.
        </p>
        {power ? (
          <PowerSessionButton section={section} label={s.cta} className="w-full justify-center px-5 py-3 text-[15px] sm:w-auto sm:self-start" />
        ) : (
          <DiscoverySessionButton section={section} label={s.cta} className="w-full justify-center px-5 py-3 text-[15px] sm:w-auto sm:self-start" />
        )}
      </figcaption>
    </figure>
  );
}
