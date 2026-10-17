import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite builds de verificación locales sin pisar la carpeta del servidor de desarrollo.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
