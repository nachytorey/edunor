export const siteConfig = {
  name: "Edunor Náutica",
  tagline: "Lanchas y cuatriciclos desde 1963.",
  url: "https://edunornautica.com",
  whatsapp: "5491142989291",
  whatsappMessage: "Hola Edunor! Me gustaría recibir más información sobre sus productos.",
  email: "ventas@edunornautica.com.ar",
  phone: "+54 11 4298 9291",
  foundedYear: 1963,
  social: {
    instagram: "https://instagram.com/edunornautica",
    facebook: "https://facebook.com/edunornautica",
    youtube: "https://youtube.com/@edunornautica",
  },
}

/** Miniatura por defecto al compartir un link (1200×630, sacada de la portada de la landing). */
export const OG_IMAGE = { url: "/og/edunor.jpg", width: 1200, height: 630, alt: "Showroom de Edunor Náutica con lanchas y cuatriciclos" }

/**
 * Tags de Open Graph, Twitter y canonical de una página.
 * Next reemplaza `openGraph` entero en cada página (no lo mezcla con el del layout), por eso van completos acá.
 */
export function shareMeta({ title, description, path, image = OG_IMAGE }: {
  title: string
  description: string
  path: string
  image?: { url: string; width?: number; height?: number; alt?: string }
}) {
  return {
    alternates: { canonical: path },
    openGraph: { type: "website" as const, locale: "es_AR", siteName: siteConfig.name, url: path, title, description, images: [image] },
    twitter: { card: "summary_large_image" as const, title, description, images: [image.url] },
  }
}

export const navLinks = [
  { href: "#lanchas", label: "Lanchas" },
  { href: "#cuatriciclos", label: "Cuatriciclos" },
  { href: "#showroom", label: "Showroom" },
  { href: "#marcas", label: "Marcas" },
  { href: "#contacto", label: "Contacto" },
]

export type Location = {
  id: string
  name: string
  address: string
  city: string
  region: string
  phones: string[]
  mapsQuery: string
}

export const locations: Location[] = [
  {
    id: "temperley",
    name: "Témperley",
    address: "Av. Antártida Argentina 101",
    city: "Témperley, Lomas de Zamora",
    region: "Provincia de Buenos Aires",
    phones: ["4298 9291", "4231 5663"],
    mapsQuery: "Av. Antártida Argentina 101, Témperley, Lomas de Zamora, Buenos Aires",
  },
  {
    id: "canning",
    name: "Canning",
    address: "Mariano Castex 560",
    city: "Canning, Ezeiza",
    region: "Provincia de Buenos Aires",
    phones: ["4298 9291", "4231 5663"],
    mapsQuery: "Mariano Castex 560, B1842 Canning, Buenos Aires",
  },
]

export function whatsappLink(message?: string) {
  const msg = encodeURIComponent(message ?? siteConfig.whatsappMessage)
  return `https://wa.me/${siteConfig.whatsapp}?text=${msg}`
}

export function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
