import type { Metadata, Viewport } from "next"
import { Playfair_Display, Source_Serif_4, Barlow_Condensed } from "next/font/google"
import { shareMeta } from "@/lib/site"
import "./palatine.css"

/* Serif de grabado para títulos, serif de lectura y condensada para los carteles. */
const display = Playfair_Display({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-pal-display", display: "swap" })
const serif = Source_Serif_4({ subsets: ["latin"], weight: ["300", "400", "600"], style: ["normal", "italic"], variable: "--font-pal-serif", display: "swap" })
const sans = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-pal-sans", display: "swap" })

const title = "Edunor Náutica — Lanchas, cuatriciclos y service oficial desde 1963"
const description =
  "Concesionario náutico familiar desde 1963: lanchas Canestrari, semirrígidos, cuatriciclos Polaris y generadores GENERAC, con service oficial. Showrooms en Témperley y Canning."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  ...shareMeta({ title, description, path: "/" }),
}

export const viewport: Viewport = { themeColor: "#F6F4EE", width: "device-width", initialScale: 1 }

export default function PalatineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`pal ${display.variable} ${serif.variable} ${sans.variable}`}>
      {/* Filtro de "borde entintado": desplaza apenas el contorno de marcos y manchas. */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <filter id="pal-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
      </svg>
      {children}
    </div>
  )
}
