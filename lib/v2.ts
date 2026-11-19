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

/** Perfiles de Google Maps de cada local (para "Ver todas las reseñas"). */
export const googlePlaces = {
  temperley: {
    name: "Témperley",
    rating: "4,6",
    count: 283,
    url: "https://www.google.com/maps/place/Edunor+N%C3%A1utica/data=!4m8!3m7!1s0x95bcd30476c55245:0x7e8399f160f2a84d!8m2!3d-34.7899613!4d-58.4099142!9m1!1b1",
  },
  canning: {
    name: "Canning",
    rating: "5,0",
    count: 13,
    url: "https://www.google.com/maps/place/Edunor+Nautica+Canning/data=!4m8!3m7!1s0x95bcd1617cfc14f7:0xd9db554b7653dbda!8m2!3d-34.8507804!4d-58.5038225!9m1!1b1",
  },
} as const

/**
 * Reseñas de Google, REALES y textuales (autor tal cual figura, estrellas y comentario completo), copiadas el
 * 19/11/2026 de los perfiles de Maps de Témperley ("Edunor Náutica") y Canning ("Edunor Nautica Canning").
 * Google muestra fechas relativas ("hace 6 meses"): `date` es el mes aproximado contado desde ese día.
 * Ordenadas de la más nueva a la más vieja. Para actualizarlas, se vuelven a copiar de Maps; nunca se inventan.
 */
export type Review = { author: string; rating: 1 | 2 | 3 | 4 | 5; text: string; date: string; location: "temperley" | "canning" }
export const reviews: Review[] = [
  {
    author: "Mariano D",
    rating: 5,
    date: "oct. 2026",
    location: "canning",
    text: "Excelente atencion , el mejor precio en cascos motores y accesorios y muy buena post venta.  Servcio de Primera.",
  },
  {
    author: "Sergio Alvarez",
    rating: 5,
    date: "jul. 2026",
    location: "temperley",
    text: "Muy buena atención, todo según lo pactado en tiempo y en calidad.",
  },
  {
    author: "Javier cuman",
    rating: 5,
    date: "jul. 2026",
    location: "canning",
    text: "El mejor concesionario. Leandro Crack.\nIba a comprar usado pero Leandro me hizo una oferta tremenda\nCompré un Rzr Nuevo !!!!",
  },
  {
    author: "Eduardo ourens",
    rating: 5,
    date: "may. 2026",
    location: "canning",
    text: "Recomendables un 100%! Desde el primer contacto para consultar, hasta el último detalle al momento de entregar el cuatriciclo, fue todo excelente. Vivo a 150 Km y coordinamos todo con una facilidad increíble. Leandro tuvo un trato conmigo y mi familia que hace tiempo no recibíamos como clientes! Gracias por todo y éxitos!!",
  },
  {
    author: "Lucas Lizzi",
    rating: 5,
    date: "abr. 2026",
    location: "canning",
    text: "EXCELENTE ATENCIÓN LA VERDAD MUY RECOMENDABLE, TODO EN TIEMPO Y FORMA!!..\nrecomendable 100%",
  },
  {
    author: "Damián Ghibaudo",
    rating: 5,
    date: "abr. 2026",
    location: "canning",
    text: "Muy buena experiencia en Edunor Canning.. La atención es realmente personalizada, se toman el tiempo para explicarte todo y ayudarte a elegir..\n\nSe nota que saben mucho del tema y trabajan con marcas de calidad como Canestrari y Polaris, lo cual da mucha confianza.\n\nEs un lugar totalmente recomendable!!",
  },
  {
    author: "Lucas Pechin",
    rating: 5,
    date: "feb. 2026",
    location: "temperley",
    text: "Muy contento con la adquisición. La atención un 10. Muy buena gente. Recomendado",
  },
  {
    author: "Dario Florek",
    rating: 5,
    date: "ene. 2026",
    location: "temperley",
    text: "Brillante atención, años q estoy en la náutica y nunca nadie cumplió como ellos. El día q compré la lancha me dijieron día q me entregaba. Y cumplieron con entrega, instalacion de accesorios, todo.\nLo recomiendo 100%",
  },
  {
    author: "Ezequiel Bottino",
    rating: 5,
    date: "dic. 2025",
    location: "temperley",
    text: "La verdad Leandro y Eduardo unos genios la atención excelente, el producto un sueño la calidad y las terminaciones perfectas.\n1000% recomendables.",
  },
  {
    author: "Maxi Brandoni",
    rating: 5,
    date: "dic. 2025",
    location: "temperley",
    text: "Excelente! Compramos un cuatri Polaris en Octubre del 2024. Nos atendio Cristian Farfalla muy amablemente y nos asesoro muy bien. Totalmente recomendable!",
  },
  {
    author: "Matias Platas",
    rating: 5,
    date: "2025",
    location: "temperley",
    text: "Todo excelente! Les compré una lancha y Leandro se encargó de cada detalle asesorándome en la compra de la embarcación en sí y de cada accesorio y personalización, la probamos juntos y se el tiempo de explicarme a mí y mi familia absolutamente todo! Sin lugar a dudas, súper recomendable!",
  },
  {
    author: "Gabriel Cipollone",
    rating: 5,
    date: "2025",
    location: "temperley",
    text: "Este Lunes que paso (20/01/2025) nos entregaron la Embarcacion, nos dijeron un plazo de entrega y lo cumplieron.\nEl Asesoramiento tanto en la Náutica como en el Rio fue Excelente!!!\nLos Super Recomiendo!!!",
  },
  {
    author: "Silvana Balestrini",
    rating: 5,
    date: "2025",
    location: "temperley",
    text: "Impecable la atención y el servicio\nCompramos una embarcación y nos asesoraron muy bien\nMuy recomendable, los chicos unos divinos",
  },
  {
    author: "Diego Carames",
    rating: 5,
    date: "2025",
    location: "temperley",
    text: "Muy buena atención\nMe asesoraron directamente, padre e hijos\nRecomendable 100%",
  },
  {
    author: "dario sandez",
    rating: 5,
    date: "2025",
    location: "temperley",
    text: "Bueno paso a contar mi experiencia, me atendió Leandro siempre dispuesto a evacuar mis dudas , no entiendo absolutamente nada de embarcaciones, no tengo experiencia previa y me fue asesorando sobre las distintas opciones , me prometio entrega inmediata y me Cumplió, no me dio ni media vuelta , fui , pague y me entregaron todo como me dijeron, dejo este comentario no solo en agradecimiento si no para ayudar a otras personas que pudieran estar en mi situación, me cance de renegar buscando , nadie tiene tiempo, todos te dan vueltas , aca fui , pague y me entregaron en 2 dias mi embarcacion .",
  },
  {
    author: "francisco nitzke",
    rating: 5,
    date: "2024",
    location: "temperley",
    text: "Compre un cuatriciclo polaris 570cc. Excelente maquina! Gracias leandro por impecable servicio y atención. Muy recomendable!",
  },
  {
    author: "stella maris de chiano",
    rating: 5,
    date: "2024",
    location: "temperley",
    text: "Compré un cuatriciclo Polaris, y quedé muy conforme con la atención y asesoramiento por parte de Leandro de Edunor. Excelente todo, desde que comenzas a consultar por el producto hasta compra, entrega y post venta!!! Realmente gente muy profesional y sumamente atenta!! Muchas gracias!!!",
  },
  {
    author: "Victoria Chevalier",
    rating: 5,
    date: "2024",
    location: "temperley",
    text: "Espectacular la atención y el servicio. Soy de zona norte y fui hasta Lomas porque no hay otro igual. Lo súper recomiendo",
  },
  {
    author: "Pablo Triguero",
    rating: 5,
    date: "2024",
    location: "temperley",
    text: "Excelente atención antes y después de la venta le compré una lancha tuve un problema de garantía y me lo resolvió al instante volvería a comprar!!!!\nMuy serios y responsables cumplieron todo lo pactado",
  },
  {
    author: "martin bussolo",
    rating: 5,
    date: "2024",
    location: "temperley",
    text: "Impecable todo!!! Excelente atención!!! Seriedad y profesionalismo!!! Gracias Leandro y Cristian!!!",
  },
  {
    author: "Dario Seif",
    rating: 5,
    date: "2024",
    location: "temperley",
    text: "Excelente atención y asesoramiento por parte de Leandro en la compra de un equipo Generac",
  },
  {
    author: "Luca Molinari",
    rating: 5,
    date: "2022",
    location: "temperley",
    text: "Feliz con haber encontrado a Edunor para la compra de mi primer bote. Les compré un semirrígido 6mts/115hp usado (fabricado por ellos).\n\nMe ayudaron con todo, mucha paciencia y super profesionales. Me dieron la tranquilidad que buscaba a la hora de hacer una compra importante como esta, más todavía siendo primerizo.\n\nLa calidad del bote es de primera, excelentes terminaciones y funcionamiento. Inclusive el precio, después de haber investigado bastante estoy seguro de que sería muy difícil encontrar algo así de bueno por este precio.\n\nCualquier necesidad que tuve la resolvieron rápidamente, con transparencia. Inclusive hicimos la operación en tiempo récord porque yo tenía que viajar, y me hicieron el aguante.\n\nTambién sus chalecos salvavidas muy buenos.\n\nLos recomendaré siempre y estoy seguro que volveremos a encarar nuevos proyectos juntos.",
  },
]
