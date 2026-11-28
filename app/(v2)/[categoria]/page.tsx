/**
 * /[categoria] — todos los productos de una categoría (embarcaciones, polaris, generac).
 * Arriba, las tres categorías como pestañas que se deslizan de costado para saltar de una a otra.
 * Lanchas y Polaris abren la ficha existente (/modelos/<slug>); los generadores van directo a la consulta.
 */
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SectionTitle } from "@/components/v2/chrome"
import { cuatriciclos, lanchas, type CatalogProduct } from "@/lib/catalog"
import { imageDims } from "@/lib/image-dims"
import { shareMeta, whatsappLink } from "@/lib/site"
import { categories, generacLines, getCategory, v2Ficha } from "@/lib/v2"

type Props = { params: Promise<{ categoria: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).categoria)
  if (!cat) return {}
  const title = `${cat.title} | Edunor Náutica`
  return { title: { absolute: title }, description: cat.intro, ...shareMeta({ title, description: cat.intro, path: `/${cat.slug}` }) }
}

const products: Record<string, CatalogProduct[]> = { embarcaciones: lanchas, polaris: cuatriciclos }

export default async function V2CategoryPage({ params }: Props) {
  const cat = getCategory((await params).categoria)
  if (!cat) notFound()
  const list = products[cat.slug] ?? []

  return (
    <div className="v2-catpage v2-wrap">
      <nav className="v2-tabs" aria-label="Categorías">
        {categories.map((c) => (
          <a key={c.slug} href={`/${c.slug}`} aria-current={c.slug === cat.slug ? "page" : undefined}>
            {c.label}
          </a>
        ))}
      </nav>

      <header className="v2-catpage__head">
        <SectionTitle kicker="Productos">{cat.title}</SectionTitle>
        <p>{cat.intro}</p>
      </header>

      <ul className="v2-grid">
        {cat.slug === "generac"
          ? generacLines.map((g) => (
              <li key={g.slug} className="v2-card">
                <a href={whatsappLink(`Hola Edunor! Quiero consultar por generadores GENERAC ${g.name.toLowerCase()}.`)} target="_blank" rel="noreferrer">
                  <span className="v2-card__photo">
                    <img src={g.src} alt={`Generador GENERAC ${g.name.toLowerCase()}`} loading="lazy" decoding="async" {...imageDims(g.src)} />
                  </span>
                  <span className="v2-card__body">
                    <span className="v2-card__name">{g.name}</span>
                    <span className="v2-card__text">{g.text}</span>
                    <span className="v2-card__go">Consultar por WhatsApp →</span>
                  </span>
                </a>
              </li>
            ))
          : list.map((p) => {
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
    </div>
  )
}
