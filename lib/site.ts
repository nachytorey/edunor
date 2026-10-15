export const siteConfig = {
  name: "Edunor Náutica",
  tagline: "Náutica, Camping y Outdoor desde 1963.",
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
    name: "Sucursal Témperley",
    address: "Av. Antártida Argentina 101",
    city: "Témperley, Partido de Lomas de Zamora",
    region: "Provincia de Buenos Aires",
    phones: ["4298 9291", "4231 5663"],
    mapsQuery: "Av. Antártida Argentina 101, Témperley, Lomas de Zamora, Buenos Aires",
  },
  {
    id: "canning",
    name: "Sucursal Canning",
    address: "Mariano Castex 560",
    city: "B1842 Canning",
    region: "Provincia de Buenos Aires",
    phones: [],
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
