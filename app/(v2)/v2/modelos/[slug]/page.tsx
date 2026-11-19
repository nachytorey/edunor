/**
 * /v2/modelos/[slug] — ficha de modelo en la versión blanca.
 * Reutiliza la galería de la ficha actual (zoom, pantalla completa, miniaturas, videos) con la paleta clara:
 * su CSS (modelo.css) cuelga de `.pal` y de variables --pal-*, que acá se redefinen en .v2-pd.
 * Abajo: dónde verla, anterior/siguiente y más modelos de la línea.
 */
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/palatine/product-gallery"
import { SectionTitle } from "@/components/v2/chrome"
import { catalog, getProduct } from "@/lib/catalog"
import { imageDims } from "@/lib/image-dims"
import { locations, mapsLink, whatsappLink } from "@/lib/site"
import { V2, v2Ficha } from "@/lib/v2"
import "../../../../(palatine)/modelos/[slug]/modelo.css"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return catalog.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug)
  return p ? { title: { absolute: `${p.name} — ${p.kind} | Edunor Náutica` }, description: p.description ?? undefined } : {}
}

export default async function V2ModeloPage({ params }: Props) {
  const product = getProduct((await params).slug)
  if (!product) notFound()

  const line = catalog.filter((p) => p.category === product.category)
  const at = line.findIndex((p) => p.slug === product.slug)
  const prev = line[(at - 1 + line.length) % line.length]
  const next = line[(at + 1) % line.length]
  const more = line.filter((p) => p.slug !== product.slug).slice(0, 6)
  const cat = product.category === "lanchas" ? { slug: "embarcaciones", label: "Embarcaciones" } : { slug: "polaris", label: "Polaris" }
  const visit = whatsappLink(`Hola Edunor! Quiero coordinar una visita para ver ${product.name}.`)

  return (
    <div className="v2-pd pal v2-wrap">
      <nav className="v2-crumbs" aria-label="Ruta">
        <a href={V2}>Inicio</a>
        <span aria-hidden="true">/</span>
        <a href={`${V2}/${cat.slug}`}>{cat.label}</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="v2-pd__grid" aria-labelledby="v2-pd-title">
        <div className="v2-pd__gallery">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="v2-pd__info">
          <p className="v2-head__kicker">
            <span className="v2-head__line" aria-hidden="true" />
            {product.kind}
          </p>
          <h1 id="v2-pd-title" className="v2-pd__name">
            {product.name}
          </h1>
          <p className="v2-pd__desc">
            {product.description ??
              `${product.kind} ${product.name}, lista en el showroom. Vení a subirte, mirá los acabados y consultanos por motorización, equipamiento y entrega.`}
          </p>
          <div className="v2-pd__ctas">
            <a href={product.href} target="_blank" rel="noreferrer" className="v2-btn">
              Consultar por WhatsApp
            </a>
            <a href={visit} target="_blank" rel="noreferrer" className="v2-btn v2-btn--outline">
              Coordinar visita
            </a>
          </div>
          <p className="v2-muted v2-pd__note">Te respondemos con precio, financiación y disponibilidad.</p>

          <ul className="v2-pd__places">
            {locations.map((l) => (
              <li key={l.id}>
                <strong>{l.name}</strong>
                <span>{l.address}</span>
                <a href={mapsLink(l.mapsQuery)} target="_blank" rel="noreferrer">
                  Cómo llegar →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {line.length > 1 && (
        <nav className="v2-pager" aria-label="Otros modelos">
          <a href={v2Ficha(prev.slug)}>
            <span>← Anterior</span>
            <strong>{prev.name}</strong>
          </a>
          <a href={v2Ficha(next.slug)} className="v2-pager__next">
            <span>Siguiente →</span>
            <strong>{next.name}</strong>
          </a>
        </nav>
      )}

      {more.length > 0 && (
        <section className="v2-pd__more" aria-labelledby="v2-pd-more-title">
          <SectionTitle id="v2-pd-more-title" kicker={cat.label}>
            Más <em>modelos</em>
          </SectionTitle>
          <ul className="v2-grid">
            {more.map((p) => {
              const photo = p.images.find((i) => i.src)
              return (
                <li key={p.slug} className="v2-card">
                  <a href={v2Ficha(p.slug)}>
                    <span className="v2-card__photo">
                      {photo && (
                        <img
                          src={photo.src}
                          srcSet={photo.srcSet}
                          sizes={photo.srcSet && "(min-width: 1100px) 33vw, (min-width: 640px) 50vw, 100vw"}
                          alt={photo.alt || `${p.kind} ${p.name}`}
                          loading="lazy"
                          decoding="async"
                          {...imageDims(photo.src)}
                        />
                      )}
                    </span>
                    <span className="v2-card__body">
                      <span className="v2-card__kind">{p.kind}</span>
                      <span className="v2-card__name">{p.name}</span>
                      <span className="v2-card__go">Ver ficha →</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
