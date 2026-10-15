import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { WhatsAppButton } from "@/components/whatsapp-button"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://edunornautica.com"),
  title: {
    default: "Edunor Náutica — Náutica, Camping y Outdoor desde 1963",
    template: "%s | Edunor Náutica",
  },
  description:
    "Empresa familiar fundada en 1963. Representantes oficiales de Zodiac, Mercury, Yamaha, Sea Doo, Polaris y más. Service oficial, showroom de 1500m² en Témperley y Canning, Buenos Aires.",
  keywords: [
    "edunor",
    "edunor náutica",
    "náutica",
    "botes",
    "semirrígidos",
    "zodiac",
    "mercury",
    "yamaha",
    "sea doo",
    "polaris",
    "cuatriciclos",
    "camping",
    "outdoor",
    "témperley",
    "canning",
  ],
  authors: [{ name: "Edunor Náutica" }],
  creator: "Edunor Náutica",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://edunornautica.com",
    siteName: "Edunor Náutica",
    title: "Edunor Náutica — Náutica, Camping y Outdoor desde 1963",
    description:
      "Empresa familiar fundada en 1963. Representantes oficiales de las mejores marcas. Service oficial, showroom de 1500m² en Témperley y Canning.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Edunor Náutica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunor Náutica — Náutica, Camping y Outdoor desde 1963",
    description: "Empresa familiar fundada en 1963. Service oficial de las mejores marcas.",
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://edunornautica.com",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Edunor Náutica",
  description:
    "Empresa familiar fundada en 1963, dedicada a Náutica, Camping y Outdoor. Representantes oficiales de Zodiac, Mercury, Yamaha, Sea Doo, Polaris y más.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <WhatsAppButton />
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
