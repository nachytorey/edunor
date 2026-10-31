import type { Metadata, Viewport } from "next"
import { Playfair_Display, Barlow_Condensed, Source_Serif_4 } from "next/font/google"
import { issue } from "@/lib/stories"
import "./bitacora.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
})

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
})

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-serif",
  display: "swap",
})

const title = `${issue.name} — ${issue.tagline}`
const description =
  "Portada de Bitácora, revista de náutica y navegación: pruebas de barcos y motores, guías de navegación en el Río de la Plata, regatas, pesca deportiva, destinos y tecnología marina."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: ["náutica", "navegación", "veleros", "yates", "regatas", "pesca deportiva", "Río de la Plata", "revista náutica"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: issue.name,
    title,
    description,
    images: [
      {
        url: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Velero navegando a toda vela en mar abierto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: [{ url: "/bitacora-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/bitacora-apple-icon.png", sizes: "180x180" }],
  },
  alternates: { canonical: "/bitacora" },
}

export const viewport: Viewport = {
  themeColor: "#0a1f44",
  width: "device-width",
  initialScale: 1,
}

export default function BitacoraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`bitacora no-js min-h-screen ${playfair.variable} ${barlow.variable} ${sourceSerif.variable}`}>
      {children}
    </div>
  )
}
