/** @type {import('next').NextConfig} */

/** Carpetas de /public con fotos, videos y marca. Vercel las sirve sin caché en el navegador si no se le dice. */
const MEDIA = ["catalog", "publicidad", "palatine", "og", "brand", "images"]

const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [
      {
        // Las fotos de /catalog se llaman 01.jpg, 02.jpg… y pueden cambiar con el mismo nombre al sincronizar Drive:
        // un día en el navegador y hasta un mes servidas como "viejas" mientras se revalidan por atrás.
        source: `/:dir(${MEDIA.join("|")})/:path*`,
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=2592000" }],
      },
    ]
  },
}

export default nextConfig
