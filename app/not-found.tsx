/**
 * 404 global: las urls que no existen no pasan por el layout del grupo (v2),
 * así que lo envolvemos acá para tener la misma barra, pie y tipografía que el resto del sitio.
 */
import type { Metadata } from "next"
import { SectionTitle } from "@/components/v2/chrome"
import SiteLayout from "./(v2)/layout"

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada | Edunor Náutica" },
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="v2-catpage v2-wrap">
        <header className="v2-catpage__head">
          <SectionTitle kicker="Error 404">
            Esta página <em>no existe</em>
          </SectionTitle>
          <p>Puede que se haya movido o que el enlace esté mal escrito.</p>
        </header>
        <p className="v2-pd__ctas">
          <a href="/" className="v2-btn">
            Volver al inicio
          </a>
          <a href="/modelos" className="v2-btn v2-btn--outline">
            Ver todos los modelos
          </a>
        </p>
      </div>
    </SiteLayout>
  )
}
