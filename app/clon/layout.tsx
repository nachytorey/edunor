import type { Metadata, Viewport } from "next"
import { DM_Serif_Display, Inter_Tight, Cormorant_Garamond, Inter } from "next/font/google"
import "./clon.css"

const display = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-clon-display", display: "swap" })
const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-clon-sans", display: "swap" })
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-clon-serif", display: "swap" })
const body = Inter({ subsets: ["latin"], weight: ["400"], variable: "--font-clon-body", display: "swap" })

export const metadata: Metadata = {
  title: { absolute: "Portada — clon de maqueta" },
  description: "Maqueta de portada editorial: portada destacada, grillas de cards por sección, notas a pantalla completa y oración de titulares.",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: "#ad0c27", width: "device-width", initialScale: 1 }

export default function ClonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`clon ${display.variable} ${sans.variable} ${serif.variable} ${body.variable}`}>
      <div className="clon__bg" aria-hidden="true" />
      {children}
    </div>
  )
}
