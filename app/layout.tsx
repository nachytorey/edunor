import type { Metadata, Viewport } from "next"
import { Red_Hat_Display, Red_Hat_Text } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { OG_IMAGE, SITE_URL } from "@/lib/site"
import "./globals.css"

const display = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-display",
  display: "swap",
})

const text = Red_Hat_Text({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-text",
  display: "swap",
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
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
}

export const viewport: Viewport = {
  themeColor: "#0b3550",
  width: "device-width",
  initialScale: 1,
}

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Edunor Náutica",
  description:
    "Concesionario familiar fundado en 1963. Lanchas, semirrígidos, cuatriciclos y UTVs. Representantes oficiales de Zodiac, Mercury, Yamaha, Sea Doo, Polaris y más.",
  url: SITE_URL,
  foundingDate: "1963",
  logo: `${SITE_URL}/images/edunor-logo.png`,
  image: `${SITE_URL}/og/edunor-portada.jpg`,
  location: [
    {
      "@type": "Place",
      name: "Edunor Náutica — Témperley",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Av. Antártida Argentina 101",
        addressLocality: "Témperley, Lomas de Zamora",
        addressRegion: "Buenos Aires",
        addressCountry: "AR",
      },
      telephone: "+54 11 4298 9291",
    },
    {
      "@type": "Place",
      name: "Edunor Náutica — Canning",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Mariano Castex 560",
        addressLocality: "Canning",
        postalCode: "B1842",
        addressRegion: "Buenos Aires",
        addressCountry: "AR",
      },
    },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${text.variable}`}>
      <body>
        {children}
        {/* <script> común y no next/script: así el JSON-LD sale en el HTML del servidor y lo leen los crawlers. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
