import type { Metadata, Viewport } from "next"
import { Barlow, Barlow_Condensed } from "next/font/google"
import { shareMeta } from "@/lib/site"
import "./palatine.css"

/* Como el logo: grotesca pesada en itálica para títulos y lectura, condensada para etiquetas y botones. */
/* Solo los pesos que usa el CSS: cada peso × estilo es un archivo que se precarga. */
const display = Barlow({ subsets: ["latin"], weight: ["400", "600", "900"], style: ["normal", "italic"], variable: "--font-pal-display", display: "swap" })
const sans = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-pal-sans", display: "swap" })

const title = "Edunor Náutica — Lanchas, cuatriciclos y service desde 1963"
const description =
  "Concesionario náutico desde 1963: lanchas Canestrari, semirrígidos, cuatriciclos Polaris y generadores GENERAC, con service oficial en Témperley y Canning."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  ...shareMeta({ title, description, path: "/" }),
}

export const viewport: Viewport = { themeColor: "#0A0A0B", width: "device-width", initialScale: 1 }

export default function PalatineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`pal ${display.variable} ${sans.variable}`}>
      {children}
    </div>
  )
}
