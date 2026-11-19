/**
 * Layout de la v2 (portada blanca del bosquejo del cliente). Es una propuesta para comparar con la portada actual:
 * no se indexa, así no compite en Google con "/" ni duplica contenido. Si se aprueba, pasa a ser "/".
 */
import type { Metadata, Viewport } from "next"
import { Barlow, Barlow_Condensed, Instrument_Serif } from "next/font/google"
import { V2Footer, V2Header } from "@/components/v2/chrome"
import { V2Motion } from "@/components/v2/motion"
import "./v2.css"

const display = Barlow({ subsets: ["latin"], weight: ["400", "600", "900"], style: ["normal", "italic"], variable: "--font-v2-display", display: "swap" })
/* Serif para los títulos de sección: contrasta con la itálica pesada del logo (hero, nombres) y la condensada (etiquetas). */
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-v2-serif", display: "swap" })
const sans = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-v2-sans", display: "swap" })

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: "#0a0a0b", width: "device-width", initialScale: 1 }

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v2 ${display.variable} ${serif.variable} ${sans.variable}`}>
      <V2Header />
      <main>{children}</main>
      <V2Footer />
      <V2Motion />
      <noscript>
        <style>{".v2-hero__text{visibility:visible}"}</style>
      </noscript>
    </div>
  )
}
