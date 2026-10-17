import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BriefFlow } from "@/components/brief/BriefFlow";
import { briefByToken, emptyAnswers } from "@/lib/brief/server";
import { formatSlotEs } from "@/lib/agenda/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Brief de tu Power Session",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/** Brief previo a la Power Session. El link es secreto: llega al confirmar el pago. */
export default async function BriefPage({ params }: { params: Promise<{ token: string }> }) {
  const brief = await briefByToken((await params).token).catch(() => null);
  if (!brief) notFound();
  return (
    <BriefFlow
      token={brief.token}
      initial={emptyAnswers(brief.answers)}
      transcripts={brief.transcripts ?? {}}
      firstName={(brief.name ?? "").trim().split(/\s+/)[0] ?? ""}
      business={brief.business ?? ""}
      when={brief.session_start ? `${formatSlotEs(brief.session_start)} (CDMX)` : null}
      submitted={brief.status === "enviado"}
    />
  );
}
