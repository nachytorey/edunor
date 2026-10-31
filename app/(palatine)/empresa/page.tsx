/**
 * /empresa — historia y presentación de Edunor Náutica, con el mismo grabado de la portada.
 */
import type { Metadata } from "next"
import { GhostTitle, NAV, PalFooter, WHATSAPP } from "@/components/palatine/blocks"
import { PalNav } from "@/components/palatine/interactive"
import { Anchor, ShipWheel } from "@/components/palatine/ornaments"
import { brands, company } from "@/lib/edunor"

const title = "La empresa | Edunor Náutica"
const description = `Empresa familiar desde ${company.founded}: lanchas, motores, cuatriciclos y service oficial. Showrooms en Témperley y Canning.`

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: { type: "website", locale: "es_AR", siteName: "Edunor Náutica", title, description },
  twitter: { card: "summary_large_image", title, description },
}

export default function PalatineEmpresaPage() {
  return (
    <div id="top" className="pal-page">
      <PalNav links={NAV} whatsapp={WHATSAPP} />

      <main>
        {/* ── La empresa ── */}
        <section id="empresa" className="pal-intro pal-intro--page">
          <GhostTitle ornament={<Anchor />}>Empresa</GhostTitle>
          <div className="pal-intro__grid">
            <a href="/#modelos" className="pal-frame pal-intro__media">
              <img src="/palatine/hero-interior.jpg" alt="Interior de una lancha con tapizado náutico claro" loading="lazy" />
              <span className="pal-play" aria-hidden="true">
                <ShipWheel />
              </span>
              <span className="pal-sr">Ver modelos</span>
            </a>
            <div className="pal-blob pal-intro__text">
              <p>
                Edunor es una empresa familiar que nació en {company.founded} entre botes, carpas y motores, y que
                nunca se fue del agua. Hoy el showroom de Témperley tiene más de {company.showroomM2.toLocaleString("es-AR")}{" "}
                m² y lo acompaña una segunda sede en Canning.
              </p>
              <p>
                Vendemos lanchas Canestrari, Arco-Iris y semirrígidos de fabricación propia, motos de agua Yamaha y
                Sea-Doo, cuatriciclos Polaris y motores Mercury, Yamaha y Volvo Penta. Somos service oficial de todas
                las marcas que representamos, con taller propio y repuestos originales en stock.
              </p>
              <p>
                En el taller fabricamos consolas, arcos de radar, guardamancebos y tapizados náuticos a medida, así
                que la lancha sale equipada como la querés.
              </p>
            </div>
          </div>
        </section>

        {/* ── Marcas que representamos ── */}
        <section className="pal-brands" aria-labelledby="pal-brands-title">
          <h2 id="pal-brands-title" className="pal-brands__title">Marcas que representamos</h2>
          <dl className="pal-brands__list">
            {brands.map((b) => (
              <div key={b.group}>
                <dt>{b.group}</dt>
                <dd>{b.names.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <PalFooter />
    </div>
  )
}
