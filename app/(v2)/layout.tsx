/**
 * Layout del sitio (la portada blanca del bosquejo del cliente, aprobada como definitiva el 27/11/2026):
 * barra, pie y animaciones compartidas por la portada, las categorías y las fichas de modelo.
 */
import type { Metadata, Viewport } from "next"
import { Archivo } from "next/font/google"
import { V2Footer, V2Header } from "@/components/v2/chrome"
import { V2Motion } from "@/components/v2/motion"
import { NavState } from "@/components/v2/nav-state"
import "./v2.css"

/* Una sola familia variable (Archivo, eje de ancho 62–125%) en tres anchos: condensada para etiquetas y botones,
   normal para el texto e itálica pesada para nombres, y expandida para los títulos. Un solo archivo de fuente. */
const archivo = Archivo({ subsets: ["latin"], style: ["normal", "italic"], axes: ["wdth"], variable: "--font-v2", display: "swap" })

export const metadata: Metadata = {}

export const viewport: Viewport = { themeColor: "#0a0a0b", width: "device-width", initialScale: 1 }

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v2 ${archivo.variable}`}>
      <V2Header />
      <main>{children}</main>
      <V2Footer />
      <V2Motion />
      <NavState />
      <noscript>
        <style>{".v2-hero__text{visibility:visible}"}</style>
      </noscript>
    </div>
  )
}
