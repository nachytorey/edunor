/**
 * Datos de la portada v2 (la versión blanca del bosquejo del cliente, en /v2).
 * Todo lo que el cliente tiene que completar o confirmar está acá: números, logos, foto de la familia y reseñas.
 */
import { cuatriciclos, lanchas, type CatalogProduct } from "@/lib/catalog"
import { company } from "@/lib/edunor"
import { imageSrcSet } from "@/lib/image-dims"

export const V2 = "/v2"
/** Ficha v2 de un modelo (lanchas y Polaris). */
export const v2Ficha = (slug: string) => `${V2}/modelos/${slug}`

/** Fotos que rotan en el hero. La primera es la imagen LCP: tiene que ser la mejor. */
const cover = (p: CatalogProduct | undefined) => p?.images.find((i) => i.src && !i.video)
const pick = (list: CatalogProduct[], slug: string) => cover(list.find((p) => p.slug === slug))

export const heroSlides = [
  pick(lanchas, "245-df"),
  pick(cuatriciclos, "polaris-rzr-xp-1000-premium"),
  pick(lanchas, "285-fb"),
  { src: "/palatine/generac/instalados.jpg", alt: "Generador GENERAC instalado en una casa" },
  pick(lanchas, "348"),
]
  .filter((s): s is { src: string; alt: string } => Boolean(s?.src))
  .map((s) => ({ src: s.src, alt: s.alt, srcSet: imageSrcSet(s.src) }))

/**
 * Foto de la familia para "Nosotros" (la del bosquejo). Cuando el cliente la pase, va a /public/v2/familia.jpg
 * y se pone acá: { src: "/v2/familia.jpg", alt: "…" }. Mientras sea null se ve un recuadro de reemplazo.
 */
export const familyPhoto: { src: string; alt: string } | null = null

/** Las tres categorías del bloque "Productos". Cada una abre /v2/<slug> con todos sus productos. */
export type CategorySlug = "embarcaciones" | "polaris" | "generac"

export const categories: { slug: CategorySlug; label: string; title: string; intro: string; image: { src: string; alt: string } }[] = [
  {
    slug: "embarcaciones",
    label: "Embarcaciones",
    title: "Embarcaciones",
    intro: "Lanchas Canestrari, Eclipse y semirrígidos Edunor, con motores Mercury y Volvo Penta. Más de 50 unidades nuevas en stock para entrega inmediata.",
    image: { src: cover(lanchas.find((p) => p.slug === "245-df"))?.src ?? lanchas[0]?.images[0]?.src ?? "", alt: "Lancha Canestrari 245 navegando" },
  },
  {
    slug: "polaris",
    label: "Polaris",
    title: "Cuatriciclos y UTV Polaris",
    intro: "Toda la línea de cuatriciclos y UTV Polaris, para el campo, la arena y el trabajo. Con service oficial y repuestos originales.",
    image: { src: pick(cuatriciclos, "polaris-rzr-xp-1000-premium")?.src ?? "", alt: "UTV Polaris RZR XP 1000" },
  },
  {
    slug: "generac",
    label: "Generac",
    title: "Generadores GENERAC",
    intro: "Representantes oficiales de GENERAC. Portátiles, residenciales que arrancan solos cuando se corta la luz e industriales. Te asesoramos y lo instalamos.",
    image: { src: "/palatine/generac/instalados.jpg", alt: "Generador GENERAC instalado junto a una casa" },
  },
]
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)

/** Líneas de generadores (la web anterior no tenía fichas técnicas: solo nombre, foto y consulta). */
export const generacLines = [
  { slug: "portatiles", name: "Portátiles", text: "Para el campo, la obra o el fin de semana. Livianos y listos para usar.", src: "/palatine/generac/portatiles.jpg" },
  { slug: "residenciales", name: "Residenciales", text: "Guardian y Protector: se instalan fijos y arrancan solos cuando se corta la luz.", src: "/palatine/generac/residenciales.jpg" },
  { slug: "industriales", name: "Industriales", text: "Alta potencia para comercios, industrias y edificios.", src: "/palatine/generac/industriales.jpg" },
]

/**
 * Representantes oficiales con sus logos a color (public/v2/marcas). Canestrari y Generac vienen en blanco
 * para fondo oscuro: se recolorearon (#222834, el azul de canestrari.com.ar; letras negras de Generac).
 * Fuentes: Canestrari y Generac de sus sitios oficiales; Volvo Penta y Polaris de Wikimedia/Wikipedia;
 * Mercury Marine de worldvectorlogo (recortado y sin el fondo blanco). Eclipse no publica logo: va el nombre
 * escrito hasta que el cliente lo pase. Edunor usa el logo del sitio. `h` es la altura óptica en px:
 * cada logo tiene otra proporción, así todos pesan parecido en la fila.
 */
export const officialBrands: { slug: string; name: string; logo?: string; h?: number }[] = [
  { slug: "canestrari", name: "Canestrari", logo: "/v2/marcas/canestrari.svg", h: 18 },
  { slug: "eclipse", name: "Eclipse" },
  { slug: "mercury", name: "Mercury Marine", logo: "/v2/marcas/mercury.svg", h: 26 },
  { slug: "volvo-penta", name: "Volvo Penta", logo: "/v2/marcas/volvo-penta.svg", h: 9 },
  { slug: "polaris", name: "Polaris", logo: "/v2/marcas/polaris.svg", h: 20 },
  { slug: "generac", name: "Generac", logo: "/v2/marcas/generac.svg", h: 28 },
  { slug: "edunor", name: "Edunor Náutica", h: 30 },
]

/**
 * Números del bosquejo, tal cual los pasó el cliente (a confirmar):
 * - "Embarcaciones en stock: 60", pero el texto de Nosotros del mismo bosquejo dice "más de 50".
 * - "Metros cuadrados: +2.000", y lib/edunor.ts dice 1500 m² de showroom en Témperley (¿suma Canning?).
 */
export const stats = [
  { value: "60", label: "Embarcaciones en stock" },
  { value: "40", label: "Modelos diferentes" },
  { value: String(new Date().getFullYear() - company.founded), label: "Años de trayectoria" },
  { value: "+2.000", label: "Metros cuadrados" },
]

/**
 * Reseñas de Google: se copian a mano desde el perfil de cada local (nombre, estrellas, texto, fecha).
 * Nunca inventadas. Con la lista vacía, la sección muestra solo los botones para verlas en Google.
 */
export type Review = { author: string; rating: 1 | 2 | 3 | 4 | 5; text: string; date: string; location: "temperley" | "canning" }
export const reviews: Review[] = []
