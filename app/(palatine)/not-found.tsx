/**
 * 404 — página fuera de la carta. Se usa dentro del grupo (fichas inexistentes)
 * y desde app/not-found.tsx para cualquier url que no existe.
 */
import { GhostTitle, NAV, PalFooter, Signs, WHATSAPP } from "@/components/palatine/blocks"
import { Caps, PalNav } from "@/components/palatine/interactive"
import { CompassRose, Gull, Lighthouse, Sunburst } from "@/components/palatine/ornaments"

export default function PalatineNotFound() {
  return (
    <div id="top" className="pal-page">
      <PalNav links={NAV} whatsapp={WHATSAPP} />

      <main className="pal-lost" aria-labelledby="pal-lost-title">
        <div className="pal-lost__art" aria-hidden="true">
          <Sunburst className="pal-lost__rays" />
          <Lighthouse className="pal-lost__lighthouse" />
          <CompassRose className="pal-lost__compass" />
          <Gull className="pal-lost__gull" />
        </div>

        <div className="pal-lost__text">
          <GhostTitle side="left">404</GhostTitle>
          <h1 id="pal-lost-title" className="pal-lost__title">
            <Caps text="Fuera de rumbo" />
          </h1>
          <div className="pal-blob pal-lost__copy">
            <p>
              La página que buscás no figura en nuestra carta. Puede que se haya movido o que el enlace esté mal
              escrito.
            </p>
            <p>Seguí la luz del faro: te llevamos de vuelta a puerto.</p>
          </div>
          <Signs
            items={[
              { href: "/", label: "Inicio" },
              { href: "/#modelos", label: "Modelos" },
            ]}
          />
        </div>
      </main>

      <PalFooter />
    </div>
  )
}
