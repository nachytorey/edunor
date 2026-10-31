/**
 * Catálogo de modelos para la portada.
 * Fuente: data/catalog.json (lo escribe `npm run sync:drive` desde Google Drive).
 * Mientras ese archivo esté vacío, usa el catálogo de demostración de lib/products.ts.
 */
import driveCatalog from "@/data/catalog.json"
import { products as demoProducts } from "@/lib/products"
import { whatsappLink } from "@/lib/site"

export type Category = "lanchas" | "cuatriciclos"

export type CatalogImage = { src: string; alt: string }

export type CatalogProduct = {
  slug: string
  name: string
  category: Category
  /** Subtítulo corto: "Lancha open", "Cuatriciclo", etc. */
  kind: string
  description: string | null
  images: CatalogImage[]
  /** Consulta directa por WhatsApp con el modelo ya escrito. */
  href: string
  /** Ficha del modelo con galería y zoom. */
  url: string
}

type DriveCatalog = {
  source: string
  syncedAt: string | null
  products: { slug: string; name: string; category: string; description: string | null; images: { src: string; alt: string }[] }[]
}

const consult = (name: string) => whatsappLink(`Hola Edunor! Quiero consultar por el modelo ${name}.`)

const pageFor = (slug: string) => `/modelos/${slug}`

const KIND: Record<Category, string> = { lanchas: "Lancha", cuatriciclos: "Cuatriciclo / UTV" }

function fromDrive(c: DriveCatalog): CatalogProduct[] {
  return c.products
    .filter((p) => p.images.length > 0)
    .map((p) => {
      const category: Category = p.category === "cuatriciclos" ? "cuatriciclos" : "lanchas"
      return {
        slug: p.slug,
        name: p.name,
        category,
        kind: KIND[category],
        description: p.description,
        images: p.images.map((i) => ({ src: i.src, alt: i.alt })),
        href: consult(p.name),
        url: pageFor(p.slug),
      }
    })
}

/**
 * Demo: cada modelo tiene una sola foto propia. Para que la ficha muestre el carrusel
 * mientras Drive no esté sincronizado, se suman las fotos de los otros modelos de la
 * misma línea (con su alt real). Con el catálogo de Drive esto no corre.
 */
function fromDemo(): CatalogProduct[] {
  const list = demoProducts.filter((p) => p.slug !== "kit-navegacion")
  return list.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.world === "agua" ? "lanchas" : "cuatriciclos",
    kind: p.kind,
    description: p.line,
    images: [p, ...list.filter((o) => o.world === p.world && o.slug !== p.slug)].map((o) => ({ src: o.image, alt: o.alt })),
    href: consult(p.name),
    url: pageFor(p.slug),
  }))
}

const synced = fromDrive(driveCatalog as DriveCatalog)

export const catalogSource: "drive" | "demo" = synced.length > 0 ? "drive" : "demo"
export const catalogSyncedAt = (driveCatalog as DriveCatalog).syncedAt
/**
 * Ranking de mejor a menor: el número del modelo es el tamaño del casco (348 > 285 > … > 168),
 * así que la lancha más grande y de gama más alta va primero. Las variantes del mismo casco
 * (DF / FB, Cuddy / Crossover) quedan juntas, en orden alfabético. Los modelos sin número
 * van al final, también por nombre. Para forzar otro orden, editá RANK_OVERRIDE.
 */
const RANK_OVERRIDE: Record<string, number> = {}
const hullSize = (name: string) => Number(name.match(/\d{2,4}/)?.[0] ?? 0)
/** Prioridad comercial de Edunor: primero lanchas, después cuatriciclos/UTV. */
const CATEGORY_PRIORITY: Record<Category, number> = { lanchas: 0, cuatriciclos: 1 }
export function byQuality(a: CatalogProduct, b: CatalogProduct) {
  const byType = CATEGORY_PRIORITY[a.category] - CATEGORY_PRIORITY[b.category]
  if (byType) return byType
  const ra = RANK_OVERRIDE[a.slug] ?? hullSize(a.name)
  const rb = RANK_OVERRIDE[b.slug] ?? hullSize(b.name)
  return rb - ra || a.name.localeCompare(b.name, "es", { numeric: true })
}

/**
 * Si Drive todavía no tiene una categoría (hoy: cuatriciclos/UTV), se completa con los
 * modelos de demostración de esa categoría, para que la portada mantenga su orden de venta.
 * En cuanto Drive traiga esa categoría, la demo deja de usarse.
 */
const demo = fromDemo()
const fillMissing = (list: CatalogProduct[]) =>
  (["lanchas", "cuatriciclos"] as Category[]).flatMap((cat) => {
    const own = list.filter((p) => p.category === cat)
    return own.length > 0 ? own : demo.filter((p) => p.category === cat)
  })

export const catalog: CatalogProduct[] = fillMissing(synced.length > 0 ? synced : demo).sort(byQuality)
/** Categorías que hoy salen de la demo y no de Drive (para avisarlo en el panel o en el sitio). */
export const demoCategories = (["lanchas", "cuatriciclos"] as Category[]).filter(
  (cat) => !synced.some((p) => p.category === cat),
)
export const lanchas = catalog.filter((p) => p.category === "lanchas")
export const cuatriciclos = catalog.filter((p) => p.category === "cuatriciclos")

export const getProduct = (slug: string) => catalog.find((p) => p.slug === slug)
