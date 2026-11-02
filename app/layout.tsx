import type { Metadata, Viewport } from "next"
import { Red_Hat_Display, Red_Hat_Text } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { JsonLd, organizationJsonLd } from "@/lib/seo"
import { OG_IMAGE, SITE_URL } from "@/lib/site"
import "./globals.css"

const display = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-display",
  display: "swap",
  // La portada usa Barlow (app/(palatine)/layout.tsx): que no baje esta de entrada.
  preload: false,
})

const text = Red_Hat_Text({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-text",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Edunor Náutica — Lanchas y cuatriciclos desde 1963",
    template: "%s | Edunor Náutica",
  },
  description:
    "Concesionario familiar desde 1963. Lanchas, semirrígidos, cuatriciclos y UTVs con service oficial Mercury, Yamaha, Sea Doo, Polaris y Zodiac. Showroom de 1500 m² en Témperley y Canning, Buenos Aires.",
  keywords: [
    "edunor",
    "edunor náutica",
    "lanchas",
    "semirrígidos",
    "cuatriciclos",
    "utv",
    "zodiac",
    "mercury",
    "yamaha",
    "sea doo",
    "polaris",
    "témperley",
    "canning",
  ],
  authors: [{ name: "Edunor Náutica" }],
  creator: "Edunor Náutica",
  icons: {
    icon: [
      { url: "/brand/icon.svg", type: "image/svg+xml" },
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/brand/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Edunor Náutica",
    title: "Edunor Náutica — Lanchas y cuatriciclos desde 1963",
    description:
      "Concesionario familiar desde 1963. Lanchas, cuatriciclos y UTVs con service oficial. Showroom de 1500 m² en Témperley y Canning.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunor Náutica — Lanchas y cuatriciclos desde 1963",
    description: "Concesionario familiar desde 1963. Service oficial de las mejores marcas.",
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: { canonical: "/" },
}

export const viewport: Viewport = {
  themeColor: "#0b3550",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${text.variable}`}>
      <body>
        {children}
        {/* Empresa, locales y sitio en schema.org: sale en el HTML del servidor para que lo lean los crawlers. */}
        <JsonLd data={organizationJsonLd()} />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
