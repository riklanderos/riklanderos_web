type Params = Record<string, string | number | boolean | undefined>;

type Gtag = (command: "event", name: string, params?: Params) => void;
type Fbq = (command: "trackCustom", name: string, params?: Params) => void;

/**
 * Eventos de la spec §9.2: cta_powersession_click, lead_submit, resource_download, faq_open.
 * Además: cta_discovery_click y, en los VSL, video_play, video_progress (25/50/75) y video_complete.
 */
export function track(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag; fbq?: Fbq; dataLayer?: unknown[] };
  w.gtag?.("event", name, params);
  w.fbq?.("trackCustom", name, params);
  w.dataLayer?.push({ event: name, ...params });
}
