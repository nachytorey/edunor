import type { Metadata, Viewport } from "next"
import { Red_Hat_Display, Red_Hat_Text } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
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
  metadataBase: new URL("https://edunornautica.com"),
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
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://edunornautica.com",
    siteName: "Edunor Náutica",
<<<<<<< HEAD
    title: "Edunor Náutica — Lanchas y cuatriciclos desde 1963",
    description:
      "Concesionario familiar desde 1963. Lanchas, cuatriciclos y UTVs con service oficial. Showroom de 1500 m² en Témperley y Canning.",
    images: [{ url: "/images/hero.jpg", width: 1024, height: 1024, alt: "Edunor Náutica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunor Náutica — Lanchas y cuatriciclos desde 1963",
    description: "Concesionario familiar desde 1963. Service oficial de las mejores marcas.",
    images: ["/images/hero.jpg"],
=======
    title: "Edunor Náutica | Náutica, camping y outdoor",
    description:
      "Representantes oficiales de Zodiac, Mercury, Yamaha, Sea Doo y Polaris. Showrooms en Témperley y Canning.",
    images: [
      {
        url: "/images/edunor-logo.png",
        width: 1200,
        height: 630,
        alt: "Logo de Edunor Náutica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunor Náutica | Náutica, camping y outdoor",
    description:
      "Representantes oficiales de Zodiac, Mercury, Yamaha, Sea Doo y Polaris. Showrooms en Témperley y Canning.",
    images: ["/images/edunor-logo.png"],
>>>>>>> origin/main
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://edunornautica.com" },
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
  url: "https://edunornautica.com",
  foundingDate: "1963",
  logo: "https://edunornautica.com/images/edunor-logo.png",
  image: "https://edunornautica.com/images/hero.jpg",
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
        <Script
          id="ld-json-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
