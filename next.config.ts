import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite builds de verificación locales sin pisar la carpeta del servidor de desarrollo.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: { formats: ["image/avif", "image/webp"] },
  // Una sola página por sesión: las rutas viejas de la agenda redirigen (permanente, conserva ?desde= y los
  // parámetros de Stripe) para que ningún link compartido se rompa.
  async redirects() {
    return [
      { source: "/agendar/power-session", destination: "/power-session", permanent: true },
      { source: "/agendar/discovery", destination: "/discovery", permanent: true },
    ];
  },
};

export default nextConfig;
