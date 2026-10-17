import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion";
import { SITE } from "@/lib/site";
import { jsonLd } from "@/lib/jsonld";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-inter-tight",
  display: "swap",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-jetbrains", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
// Native Brush: tipografía de acento del brandbook (solo mayúsculas, uso puntual).
const brush = localFont({ src: "./fonts/NativeBrush.ttf", variable: "--font-brush", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s · Rik Landeros" },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  keywords: [
    "consultor de inteligencia artificial para empresas",
    "consultoría de IA para empresas México",
    "estratega de negocios Guadalajara",
    "consultor de sistemas para empresas",
    "automatización con IA para PyMEs",
    "Ingeniak",
  ],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/og/og-riklanderos-v2.jpg", width: 1200, height: 630, alt: "Rik Landeros — Consultor de IA para empresas" }],
  },
  // Sin title/description: Next los toma del openGraph (o title/description) de cada página.
  twitter: { card: "summary_large_image", images: ["/og/og-riklanderos-v2.jpg"] },
  // Sin canonical global: cada página declara el suyo (un canonical heredado apuntaría todo a "/").
};

export const viewport: Viewport = {
  themeColor: "#0b0c0d",
  colorScheme: "dark",
};

const personLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE.url}/#rik`,
      name: "Rik Landeros",
      url: SITE.url,
      image: `${SITE.url}/img/rik-hero.webp`,
      jobTitle: "Consultor de IA para empresas · Fundador de Ingeniak",
      description: SITE.description,
      worksFor: { "@id": `${SITE.url}/#ingeniak` },
      address: { "@type": "PostalAddress", addressLocality: "Guadalajara", addressRegion: "Jalisco", addressCountry: "MX" },
      knowsAbout: ["Inteligencia artificial para empresas", "Automatización", "Branding", "Marketing", "Ventas", "CRM"],
      sameAs: [SITE.socials.instagram, SITE.socials.linkedin, SITE.socials.youtube],
    },
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#ingeniak`,
      name: "Ingeniak",
      url: SITE.ingeniakUrl,
      founder: { "@id": `${SITE.url}/#rik` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-MX"
      className={`${inter.variable} ${interTight.variable} ${jetbrains.variable} ${instrument.variable} ${brush.variable}`}
    >
      <body className="grain">
        <MotionProvider>
          <Navbar />
          <main id="contenido">{children}</main>
          <Footer />
        </MotionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(personLd)} />
      </body>
    </html>
  );
}
