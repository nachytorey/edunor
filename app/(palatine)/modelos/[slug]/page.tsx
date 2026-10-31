/**
 * /modelos/[slug] — la ficha de modelo (galería con zoom, datos,
 * sedes, anterior/siguiente y más modelos de la línea) vestida con el grabado de la portada.
 */
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductGallery, ProductMotion } from "@/components/palatine/product-gallery"
import { fichaHref, GhostTitle, NAV, PalFooter, Signs } from "@/components/palatine/blocks"
import { Caps, PalNav } from "@/components/palatine/interactive"
import { Anchor, Fish, Gull, Lighthouse, PinIcon, ShipWheel, Starfish, Triangle, Waves } from "@/components/palatine/ornaments"
import { catalog, getProduct } from "@/lib/catalog"
import { locations, mapsLink, whatsappLink } from "@/lib/site"
import "./modelo.css"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return catalog.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug)
  if (!product) return {}
  const title = `${product.name} — ${product.kind} | Edunor Náutica`
  const description = product.description ?? `${product.name}: fotos, detalles y consulta directa con Edunor Náutica.`
  const image = product.images[0]?.src
  return {
    title: { absolute: title },
    description,
    openGraph: { type: "website", locale: "es_AR", siteName: "Edunor Náutica", title, description, images: image ? [image] : [] },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function PalatineModeloPage({ params }: Props) {
  const product = getProduct((await params).slug)
  if (!product) notFound()

  const line = catalog.filter((p) => p.category === product.category)
  const at = line.findIndex((p) => p.slug === product.slug)
  const prev = line[(at - 1 + line.length) % line.length]
  const next = line[(at + 1) % line.length]
  const more = line.filter((p) => p.slug !== product.slug)
  const lineLabel = product.category === "lanchas" ? "Lanchas" : "Cuatriciclos y UTV"
  const visit = whatsappLink(`Hola Edunor! Quiero coordinar una visita para ver ${product.name}.`)

  return (
    <div id="top" className="pal-page pal-pd-page">
      <PalNav links={NAV} whatsapp={product.href} home="/" />

      <main>
        <ProductMotion>
          <section className="pal-pd" aria-labelledby="pal-pd-title">
            <GhostTitle ornament={<ShipWheel className="pal-spin" />} side="left">
              {product.category === "lanchas" ? "Modelos" : "Tierra"}
            </GhostTitle>

            <a className="pal-pd__back" href="/#modelos" data-pd="in">
              <Triangle aria-hidden="true" /> {lineLabel}
            </a>

            <div className="pal-pd__grid">
              <div className="pal-pd__gallery" data-pd="stage">
                <Gull className="pal-pd__gull" />
                <ProductGallery images={product.images} name={product.name} />
              </div>

              <div className="pal-pd__info">
                <div className="pal-bubble pal-pd__bubble" data-pd="in">
                  <p className="pal-pd__kind">{product.kind}</p>
                  <h1 id="pal-pd-title" className="pal-pd__name">
                    <Caps text={product.name} />
                  </h1>
                  <p className="pal-pd__desc">
                    {product.description ??
                      `${product.kind} ${product.name}, lista en el showroom. Vení a subirte, mirá los acabados y consultanos por motorización, equipamiento y entrega.`}
                  </p>
                </div>

                <div className="pal-pd__actions" data-pd="in">
                  <Lighthouse className="pal-pd__lighthouse" />
                  <Signs
                    items={[
                      { href: product.href, label: "consultar", external: true },
                      { href: visit, label: "visitar", external: true },
                    ]}
                  />
                  <p className="pal-pd__note">Te respondemos con precio, financiación y disponibilidad.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="pal-pd-visit" aria-labelledby="pal-pd-visit-title" data-pd="in">
            <h2 id="pal-pd-visit-title" className="pal-pd-visit__title">
              <Anchor className="pal-pd-visit__anchor" aria-hidden="true" />
              <span><Caps text="Vení a verla en persona" /></span>
            </h2>
            <ul className="pal-pd-visit__list">
              {locations.map((l, n) => (
                <li key={l.id} className="pal-place">
                  <div className="pal-place__seal">
                    <span>sede</span>
                    <strong>{String(n + 1).padStart(2, "0")}</strong>
                    <span>{l.name.slice(0, 3)}</span>
                  </div>
                  <div className="pal-place__card">
                    <h3>{l.name}</h3>
                    <p className="pal-place__sub">{l.address}</p>
                    <p className="pal-place__where">
                      {l.city} · {l.region}
                    </p>
                    <a href={mapsLink(l.mapsQuery)} target="_blank" rel="noreferrer">
                      <PinIcon /> Cómo llegar
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {line.length > 1 && (
            <nav className="pal-pd-pager" aria-label="Otros modelos">
              <a href={fichaHref(prev.slug)} className="pal-pd-pager__link pal-pd-pager__link--prev">
                <Triangle className="pal-pd-pager__arrow" aria-hidden="true" />
                <span className="pal-pd-pager__dir">anterior</span>
                <span className="pal-pd-pager__name">{prev.name}</span>
              </a>
              <Waves className="pal-pd-pager__waves" />
              <a href={fichaHref(next.slug)} className="pal-pd-pager__link pal-pd-pager__link--next">
                <span className="pal-pd-pager__dir">siguiente</span>
                <span className="pal-pd-pager__name">{next.name}</span>
                <Triangle className="pal-pd-pager__arrow" aria-hidden="true" />
              </a>
            </nav>
          )}
        </ProductMotion>

        {more.length > 0 && (
          <section className="pal-media pal-pd-more" aria-labelledby="pal-pd-more-title">
            <GhostTitle ornament={<Gull />} side="right">
              Flota
            </GhostTitle>
            <h2 id="pal-pd-more-title" className="pal-sr">
              Más {lineLabel.toLowerCase()}
            </h2>
            <ul className="pal-pd-more__grid">
              {more.map((p, n) => {
                const Engraving = [Fish, Starfish, Waves, Anchor][n % 4]
                return (
                  <li key={p.slug} className="pal-media__item">
                    {n < 4 ? <Engraving className={`pal-media__engraving pal-media__engraving--${n % 4}`} /> : null}
                    <a href={fichaHref(p.slug)} className="pal-frame">
                      <img src={p.images[0]?.src} alt={p.images[0]?.alt || p.name} loading="lazy" />
                    </a>
                    <p className="pal-plaque">
                      {p.name} <span aria-hidden="true">–</span> {p.kind}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </main>

      <PalFooter />
    </div>
  )
}
