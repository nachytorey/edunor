/**
 * / — portada blanca, armada sobre el bosquejo del cliente (19/11/2026):
 * Hero con fotos rotando → Nosotros con foto → Productos (3 categorías) → Representantes oficiales →
 * Números → Locales con mapa → Reseñas de Google.
 */
import type { Metadata } from "next"
import { preload } from "react-dom"
import { EdunorLogo } from "@/components/edunor-logo"
import { SectionTitle, WHATSAPP_V2 } from "@/components/v2/chrome"
import { HeroSlides } from "@/components/v2/hero-slides"
import { ReviewsTrack } from "@/components/v2/reviews-track"
import { VideoReel, type ReelVideo } from "@/components/palatine/video-reel"
import { catalog, publicidad } from "@/lib/catalog"
import { company } from "@/lib/edunor"
import { imageDims, imageSrcSet } from "@/lib/image-dims"
import { locations, mapsLink, shareMeta } from "@/lib/site"
import { categories, familyPhoto, googlePlaces, heroSlides, officialBrands, reviews, stats, v2Ficha } from "@/lib/v2"

const title = "Edunor Náutica — Embarcaciones, Polaris y Generac desde 1963"
const description =
  "Empresa familiar desde 1963: embarcaciones nuevas en stock, cuatriciclos y UTV Polaris y generadores GENERAC. Locales en Témperley y Canning."

export const metadata: Metadata = { title: { absolute: title }, description, ...shareMeta({ title, description, path: "/" }) }

const YEARS = new Date().getFullYear() - company.founded
/** Videos: primero los de publicidad (hechos para mostrar), después los de las fichas. Los links van a la ficha v2. */
const toReel = (images: { src: string; video?: string }[], name: string, kind: string, ficha: string, cta?: string): ReelVideo[] =>
  images
    .filter((m) => m.video && m.src)
    .flatMap((m) => {
      const dims = imageDims(m.src)
      return dims ? [{ src: m.video!, poster: m.src, ratio: dims.width / dims.height, name, kind, ficha, cta }] : []
    })
const reel: ReelVideo[] = [
  ...publicidad.flatMap((p) => toReel(p.images, p.name, p.kind, p.cta === "ver ficha" ? v2Ficha(p.slug) : p.url, p.cta)),
  ...catalog.flatMap((p) => toReel(p.images, p.name, p.kind, v2Ficha(p.slug))),
]

const mapEmbed = (q: string) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`

export default function V2Page() {
  const first = heroSlides[0]
  if (first) preload(first.src, { as: "image", imageSrcSet: first.srcSet, imageSizes: "100vw", fetchPriority: "high" })

  return (
    <>
      <HeroSlides slides={heroSlides}>
        <h1>
          Embarcaciones, Polaris y Generac <span>desde {company.founded}</span>
        </h1>
        <div className="v2-hero__ctas">
          <a href={`/#productos`} className="v2-btn v2-btn--light">
            Ver productos
          </a>
          <a href={WHATSAPP_V2} target="_blank" rel="noreferrer" className="v2-btn v2-btn--ghost">
            Escribinos
          </a>
        </div>
      </HeroSlides>

      {/* ── Nosotros ── */}
      <section id="nosotros" className="v2-about v2-wrap" aria-labelledby="v2-about-title">
        <div className="v2-about__copy">
          <SectionTitle id="v2-about-title" kicker={`Desde ${company.founded}`}>
            Más de {Math.floor(YEARS / 10) * 10} años ofreciendo <em>los mejores productos</em> del mercado
          </SectionTitle>
          <p>
            Somos una empresa familiar creada en {company.founded}. Brindamos atención y asesoramiento personalizado.
          </p>
          <p>
            Contamos con más de 50 embarcaciones nuevas en stock para entrega inmediata, y toda la línea de cuatriciclos y
            UTV Polaris. Amamos lo que hacemos y nos gustaría compartirlo con vos.
          </p>
          <details className="v2-more">
            <summary className="v2-btn">Conocé más sobre nosotros</summary>
            <div className="v2-more__body">
              <p>
                Somos service oficial de las marcas que representamos, con taller propio, repuestos originales en stock y
                gente que distingue un motor por el ruido. Y lo que no existe, lo fabricamos: consolas, arcos de radar,
                tapizados que aguantan sol y sal.
              </p>
              <p>
                Cuando algo pasa en el agua, del otro lado del teléfono atiende alguien con nombre y apellido. Hace {YEARS}{" "}
                años que la gente nos elige una vez y nos vuelve a elegir.
              </p>
            </div>
          </details>
        </div>
        <figure className="v2-about__photo">
          {familyPhoto ? (
            <img
              src={familyPhoto.src}
              srcSet={imageSrcSet(familyPhoto.src)}
              sizes="(max-width: 900px) 100vw, 50vw"
              alt={familyPhoto.alt}
              loading="lazy"
              decoding="async"
              {...imageDims(familyPhoto.src)}
            />
          ) : (
            <div className="v2-placeholder">Foto de la familia</div>
          )}
        </figure>
      </section>

      {/* ── Productos: tres categorías; en el celular se deslizan de costado ── */}
      <section id="productos" className="v2-products" aria-labelledby="v2-products-title">
        <div className="v2-wrap">
          <SectionTitle id="v2-products-title" kicker="Productos">
            Elegí tu forma de <em>salir</em>
          </SectionTitle>
        </div>
        <ul className="v2-cats" aria-label="Categorías">
          {categories.map((c) => (
            <li key={c.slug}>
              <a href={`/${c.slug}`} className="v2-cat">
                <img src={c.image.src} alt={c.image.alt} loading="lazy" decoding="async" {...imageDims(c.image.src)} />
                <span className="v2-cat__label">{c.label}</span>
                <span className="v2-cat__go">Ver todos →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Representantes oficiales ── */}
      <section className="v2-brands v2-wrap" aria-labelledby="v2-brands-title">
        <h2 id="v2-brands-title" className="v2-head__kicker">
          <span className="v2-head__line" aria-hidden="true" />
          Representantes oficiales
        </h2>
        <ul className="v2-brands__row">
          {officialBrands.map((b) => (
            <li key={b.slug} style={{ "--h": `${b.h ?? 24}px` } as React.CSSProperties}>
              {b.logo ? (
                <img src={b.logo} alt={b.name} loading="lazy" decoding="async" />
              ) : b.slug === "edunor" ? (
                <EdunorLogo title={b.name} className="v2-brands__edunor" />
              ) : (
                <span className="v2-wordmark">{b.name}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Números ── */}
      <section className="v2-stats v2-wrap" aria-label="Edunor en números">
        <dl>
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Videos: mosaico que se reproduce solo, mudo, al entrar en pantalla ── */}
      {reel.length > 0 && (
        <section id="videos" className="v2-videos" aria-labelledby="v2-videos-title">
          <div className="v2-wrap">
            <SectionTitle id="v2-videos-title" kicker="Videos">
              Mirala <em>andando</em>
            </SectionTitle>
          </div>
          <VideoReel videos={reel} label="Videos de modelos" />
        </section>
      )}

      {/* ── Locales ── */}
      <section id="locales" className="v2-places v2-wrap" aria-labelledby="v2-places-title">
        <SectionTitle id="v2-places-title" kicker="Locales">
          Vení a <em>conocernos</em>
        </SectionTitle>
        <ul className="v2-places__grid">
          {locations.map((l) => (
            <li key={l.id} className="v2-place">
              <iframe
                title={`Mapa del local de ${l.name}`}
                src={mapEmbed(l.mapsQuery)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="v2-place__info">
                <h3>{l.name}</h3>
                <p>{l.address}</p>
                <p className="v2-muted">{l.city}</p>
                {l.phones.length > 0 && <p className="v2-muted">Tel. {l.phones.join(" · ")}</p>}
                <a href={mapsLink(l.mapsQuery)} target="_blank" rel="noreferrer" className="v2-btn">
                  Abrir en Google Maps
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Reseñas de Google: reales, textuales (lib/v2.ts), en una cinta horizontal ── */}
      <section className="v2-reviews" aria-labelledby="v2-reviews-title">
        <div className="v2-wrap v2-reviews__head">
          <SectionTitle id="v2-reviews-title" kicker="Reseñas de Google">
            Lo que dicen <em>nuestros clientes</em>
          </SectionTitle>
          <ul className="v2-reviews__scores">
            {Object.values(googlePlaces).map((g) => (
              <li key={g.name}>
                <strong>{g.rating}</strong>
                <span className="v2-review__stars" aria-hidden="true">★★★★★</span>
                <a href={g.url} target="_blank" rel="noreferrer">
                  Reseñas en {g.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {reviews.length > 0 && <ReviewsTrack reviews={reviews} />}
        <div className="v2-wrap v2-reviews__ctas">
          {Object.values(googlePlaces).map((g) => (
            <a key={g.name} href={g.url} target="_blank" rel="noreferrer" className="v2-btn v2-btn--outline">
              Ver todas las de {g.name}
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
