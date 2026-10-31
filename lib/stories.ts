/**
 * Contenido mockeado de BITÁCORA.
 * Para pasar a contenido real: reemplazá este archivo por un fetch a tu CMS
 * manteniendo los tipos `Story`, `Section` e `Issue`. Nada en los componentes
 * depende de los textos, solo de la forma de estos objetos.
 */

export type SectionSlug =
  | "actualidad"
  | "barcos"
  | "navegacion"
  | "pesca"
  | "destinos"
  | "tecnologia"
  | "regatas"
  | "opinion"

export type Section = {
  slug: SectionSlug
  label: string
  href: string
}

export type Story = {
  id: string
  slug: string
  section: SectionSlug
  kicker: string
  title: string
  dek: string
  author: string
  date: string // ISO
  readingTime: number // minutos
  image: {
    src: string
    alt: string
  }
  /** Cita destacada para tarjetas de opinión sobre fondo azul marino. */
  quote?: string
  isNew?: boolean
}

export const issue = {
  name: "Bitácora",
  tagline: "Revista de náutica y navegación",
  number: 272,
  year: "XXV",
  season: "Primavera 2026",
  date: "2026-10-31",
  coordinates: "34°36′S 58°22′O",
  weather: "Viento 12 nudos NE · Río crecido",
  url: "https://bitacora.example",
}

export const sections: Section[] = [
  { slug: "actualidad", label: "Actualidad", href: "#notas" },
  { slug: "barcos", label: "Barcos", href: "#barcos" },
  { slug: "navegacion", label: "Navegación", href: "#navegacion" },
  { slug: "pesca", label: "Pesca", href: "#notas" },
  { slug: "destinos", label: "Destinos", href: "#destinos" },
  { slug: "tecnologia", label: "Tecnología", href: "#notas" },
  { slug: "regatas", label: "Regatas", href: "#notas" },
  { slug: "opinion", label: "Opinión", href: "#notas" },
]

export const sectionLabel = (slug: SectionSlug) =>
  sections.find((s) => s.slug === slug)?.label ?? slug

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop`

export const stories: Story[] = [
  {
    id: "s01",
    slug: "bertram-35-prueba-mar-abierto",
    section: "barcos",
    kicker: "Prueba a bordo",
    title: "El nuevo Bertram 35 vuelve a las raíces: probamos el casco en mar abierto",
    dek: "Con 2,5 metros de ola frente a Punta Mogotes, el clásico de pesca deportiva demostró que la quilla profunda sigue siendo un argumento. Consumos, velocidades y lo que no nos gustó.",
    author: "Tomás Ferreyra",
    date: "2026-10-30",
    readingTime: 9,
    image: { src: unsplash("1605281317010-fe5ffe798166"), alt: "Lancha a motor blanca navegando a velocidad con estela de espuma en mar azul" },
    isNew: true,
  },
  {
    id: "s02",
    slug: "rolex-fastnet-2026-flota-record",
    section: "regatas",
    kicker: "Regatas oceánicas",
    title: "La Fastnet 2026 ya tiene fecha y una flota récord de 450 barcos",
    dek: "La organización confirmó la largada desde Cowes para el 25 de julio. Tres equipos argentinos ya están inscriptos.",
    author: "Lucía Benítez",
    date: "2026-10-29",
    readingTime: 4,
    image: { src: unsplash("1540946485063-a40da27545f8"), alt: "Velero de un solo mástil navegando con todas las velas desplegadas en mar abierto" },
  },
  {
    id: "s03",
    slug: "guia-cruzar-rio-de-la-plata",
    section: "navegacion",
    kicker: "Guía práctica",
    title: "Cómo cruzar el Río de la Plata: canales, mareas y radio paso a paso",
    dek: "Del Canal Emilio Mitre a Colonia y Montevideo. Qué cartas usar, cómo leer la tabla de mareas y los canales de VHF que tenés que tener programados.",
    author: "Martín Oyarzábal",
    date: "2026-10-28",
    readingTime: 12,
    image: { src: unsplash("1468581264429-2548ef9eb732"), alt: "Superficie calma del mar abierto bajo un cielo despejado y azul" },
  },
  {
    id: "s04",
    slug: "chartplotters-2026-comparativa",
    section: "tecnologia",
    kicker: "Electrónica marina",
    title: "Chartplotters 2026: comparamos Garmin, Raymarine y Simrad en el agua",
    dek: "Pantallas, sonda, radar e integración con el piloto. Tres semanas de uso real y una conclusión que sorprende.",
    author: "Carolina Dávila",
    date: "2026-10-27",
    readingTime: 11,
    image: { src: unsplash("1523496922380-91d5afba98a3"), alt: "Vista aérea cenital de la proa de una lancha sobre agua turquesa" },
  },
  {
    id: "s05",
    slug: "patagonia-a-vela-fiordos",
    section: "destinos",
    kicker: "Travesía",
    title: "Patagonia a vela: 15 días entre fiordos, hielo y silencio",
    dek: "Desde Puerto Williams hasta el glaciar Pía. Una bitácora de viaje con los fondeaderos que funcionan y los que conviene evitar.",
    author: "Federico Lanz",
    date: "2026-10-26",
    readingTime: 14,
    image: { src: unsplash("1476514525535-07fb3b4ae5f1"), alt: "Proa de un bote de madera avanzando por un lago turquesa rodeado de montañas" },
  },
  {
    id: "s06",
    slug: "pesca-nocturna-corvina",
    section: "pesca",
    kicker: "Pesca deportiva",
    title: "Pesca nocturna de corvina: luces, carnada y paciencia",
    dek: "Los pescadores de Bahía Samborombón cuentan cómo cambió la técnica con las luces LED sumergibles.",
    author: "Pablo Ibarra",
    date: "2026-10-25",
    readingTime: 6,
    image: { src: unsplash("1534447677768-be436bb09401"), alt: "Pequeña embarcación fondeada en aguas calmas bajo un cielo nocturno estrellado" },
  },
  {
    id: "s07",
    slug: "azimut-seadeck-7-hibrido",
    section: "barcos",
    kicker: "Novedades",
    title: "Azimut presenta el Seadeck 7: el primer yate híbrido de la casa",
    dek: "Veintidós metros, propulsión Volvo Penta IPS híbrida y una popa que se convierte en terraza. Lo vimos en Génova.",
    author: "Tomás Ferreyra",
    date: "2026-10-24",
    readingTime: 7,
    image: { src: unsplash("1569263979104-865ab7cd8d13"), alt: "Yate a motor blanco de gran porte navegando en aguas azules" },
    isNew: true,
  },
  {
    id: "s08",
    slug: "por-que-seguimos-navegando-sin-chaleco",
    section: "opinion",
    kicker: "Columna",
    title: "¿Por qué seguimos navegando sin chaleco? Una columna incómoda",
    dek: "Las estadísticas de Prefectura son claras y aun así la cultura náutica local sigue tratando el chaleco como un estorbo.",
    author: "Inés Carrizo",
    date: "2026-10-23",
    readingTime: 5,
    image: { src: unsplash("1559827260-dc66d52bef19"), alt: "Ola grande rompiendo en mar abierto bajo un cielo con nubes" },
    quote: "El chaleco no se usa cuando hace falta. Se usa antes, cuando todavía parece innecesario.",
  },
  {
    id: "s09",
    slug: "mantenimiento-casco-antifouling",
    section: "navegacion",
    kicker: "Mantenimiento",
    title: "Mantenimiento del casco: la guía anual de antifouling, ánodos y pintura",
    dek: "Cuándo sacar el barco, cómo elegir la pintura según el agua donde navegás y los errores más caros que vemos en los varaderos.",
    author: "Martín Oyarzábal",
    date: "2026-10-22",
    readingTime: 10,
    image: { src: unsplash("1484291470158-b8f8d608850d"), alt: "Espuma blanca de olas vista desde arriba sobre agua azul profundo" },
  },
  {
    id: "s10",
    slug: "seguridad-a-bordo-elementos-prefectura",
    section: "actualidad",
    kicker: "Seguridad",
    title: "Seguridad a bordo: los 12 elementos que exige Prefectura y los 5 que recomendamos",
    dek: "Actualizamos la lista con la última disposición vigente y sumamos lo que la experiencia enseña.",
    author: "Valentina Roldán",
    date: "2026-10-21",
    readingTime: 8,
    image: { src: unsplash("1500375592092-40eb2168fd21"), alt: "Ola rompiendo con fuerza sobre el mar en un día de viento" },
  },
  {
    id: "s11",
    slug: "starlink-maritime-vs-iridium",
    section: "tecnologia",
    kicker: "Conectividad",
    title: "Starlink Maritime vs. Iridium: conectividad a 200 millas de la costa",
    dek: "Costos, consumo, antenas y qué pasa cuando el cielo se cierra. Lo probamos en una travesía a Río de Janeiro.",
    author: "Carolina Dávila",
    date: "2026-10-20",
    readingTime: 9,
    image: { src: unsplash("1505142468610-359e7d316be0"), alt: "Vista aérea de olas rompiendo sobre la orilla en tonos azul y turquesa" },
  },
  {
    id: "s12",
    slug: "mediterraneo-santorini-milos",
    section: "destinos",
    kicker: "Chárter",
    title: "Mediterráneo clásico: de Santorini a Milos en una semana",
    dek: "La ruta de las Cícladas occidentales para quienes alquilan por primera vez. Vientos meltemi, marinas y dónde fondear.",
    author: "Federico Lanz",
    date: "2026-10-19",
    readingTime: 11,
    image: { src: unsplash("1563789031959-4c02bcb41319"), alt: "Cúpulas azules y casas blancas de Santorini con vista al mar Egeo" },
  },
  {
    id: "s13",
    slug: "caribe-fuera-de-temporada",
    section: "destinos",
    kicker: "Chárter",
    title: "Caribe fuera de temporada: por qué junio es el mejor mes para alquilar",
    dek: "Precios un 40% más bajos, fondeaderos vacíos y un riesgo de huracanes menor al que se cree.",
    author: "Lucía Benítez",
    date: "2026-10-18",
    readingTime: 7,
    image: { src: unsplash("1506929562872-bb421503ef21"), alt: "Vista aérea de botes de colores fondeados frente a una playa de arena blanca" },
  },
  {
    id: "s14",
    slug: "entrevista-mariana-lozada-mini-transat",
    section: "actualidad",
    kicker: "Entrevista",
    title: "Mariana Lozada: \"La Mini Transat se gana en los días en que no pasa nada\"",
    dek: "La primera navegante argentina en completar la regata en solitario habla de sueño, miedo y los 21 días sin ver a nadie.",
    author: "Inés Carrizo",
    date: "2026-10-17",
    readingTime: 13,
    image: { src: unsplash("1526761122248-c31c93f8b2b9"), alt: "Cubierta de un velero navegando al atardecer con el sol bajo sobre el mar" },
  },
  {
    id: "s15",
    slug: "test-mercury-verado-400-v10",
    section: "barcos",
    kicker: "Test de motores",
    title: "Test: Mercury Verado 400 V10, el fueraborda que cambia la ecuación",
    dek: "Diez cilindros, 400 caballos y un silencio que desconcierta. Datos de consumo a todas las vueltas.",
    author: "Tomás Ferreyra",
    date: "2026-10-16",
    readingTime: 8,
    image: { src: unsplash("1513553404607-988bf2703777"), alt: "Vista aérea de agua turquesa con olas suaves y espuma" },
  },
  {
    id: "s16",
    slug: "semana-de-buenos-aires-2026",
    section: "regatas",
    kicker: "Calendario",
    title: "Semana de Buenos Aires 2026: todo lo que hay que saber antes de la largada",
    dek: "Clases, recorridos, pronóstico y la polémica por el nuevo sistema de hándicap.",
    author: "Lucía Benítez",
    date: "2026-10-15",
    readingTime: 6,
    image: { src: unsplash("1518837695005-2083093ee35b"), alt: "Superficie del mar con olas en movimiento bajo luz suave" },
  },
  {
    id: "s17",
    slug: "pesca-con-mosca-en-el-mar",
    section: "pesca",
    kicker: "Técnica",
    title: "Pesca con mosca en el mar: la técnica que gana adeptos en la costa atlántica",
    dek: "Equipos, moscas y las playas de Necochea y Monte Hermoso donde ya hay guías especializados.",
    author: "Pablo Ibarra",
    date: "2026-10-14",
    readingTime: 7,
    image: { src: unsplash("1566024287286-457247b70310"), alt: "Costa rocosa con olas rompiendo bajo un cielo despejado" },
  },
  {
    id: "s18",
    slug: "leer-el-cielo-senales-pampero",
    section: "navegacion",
    kicker: "Meteorología",
    title: "Leer el cielo: nubes, barómetro y las señales que anticipan un pampero",
    dek: "Antes del radar y las apps, los navegantes del Plata sabían qué venía mirando al sudoeste. Esa lectura sigue salvando barcos.",
    author: "Martín Oyarzábal",
    date: "2026-10-13",
    readingTime: 9,
    image: { src: unsplash("1473116763249-2faaef81ccda"), alt: "Playa al atardecer con olas suaves y el cielo en tonos naranjas" },
  },
  {
    id: "s19",
    slug: "semirrigidos-7-metros-comparativa",
    section: "barcos",
    kicker: "Comparativa",
    title: "Semirrígidos de 7 metros: cinco modelos nacionales frente a frente",
    dek: "Precio, construcción, comportamiento con ola corta y equipamiento de serie. Hay un claro ganador.",
    author: "Valentina Roldán",
    date: "2026-10-12",
    readingTime: 10,
    image: { src: unsplash("1504681869696-d977211a5f4c"), alt: "Vista aérea de una costa con agua turquesa y vegetación" },
  },
  {
    id: "s20",
    slug: "baterias-litio-a-bordo",
    section: "tecnologia",
    kicker: "Instalación",
    title: "Baterías de litio a bordo: lo que nadie te cuenta sobre instalación y seguro",
    dek: "Ventajas reales, el BMS, la temperatura en la sentina y por qué algunas aseguradoras todavía las rechazan.",
    author: "Carolina Dávila",
    date: "2026-10-11",
    readingTime: 8,
    image: { src: unsplash("1505118380757-91f5f5632de0"), alt: "Vista aérea de olas de color azul intenso rompiendo sobre la arena" },
  },
  {
    id: "s21",
    slug: "nahuel-huapi-brazos-escondidos",
    section: "destinos",
    kicker: "Lagos",
    title: "Nahuel Huapi: la ruta de los brazos escondidos",
    dek: "Cinco días a motor por el Brazo Tristeza, Blest y Última Esperanza con viento, lluvia y los mejores fondeaderos del lago.",
    author: "Federico Lanz",
    date: "2026-10-10",
    readingTime: 9,
    image: { src: unsplash("1552083375-1447ce886485"), alt: "Lago de montaña con una isla boscosa y agua de color azul profundo" },
  },
  {
    id: "s22",
    slug: "puerto-mar-del-plata-amarras-superyates",
    section: "actualidad",
    kicker: "Infraestructura",
    title: "El puerto de Mar del Plata suma 200 amarras y una marina para superyates",
    dek: "La obra demandará dos años y busca captar el turismo náutico que hoy se queda en Punta del Este.",
    author: "Valentina Roldán",
    date: "2026-10-09",
    readingTime: 5,
    image: { src: unsplash("1548574505-5e239809ee19"), alt: "Vista aérea de un puerto con grandes embarcaciones amarradas junto a la costa" },
  },
  {
    id: "s23",
    slug: "superyates-construccion-viareggio",
    section: "barcos",
    kicker: "Astilleros",
    title: "Superyates: así se construye un 60 metros en los astilleros de Viareggio",
    dek: "Recorrimos Benetti y Rossinavi para entender por qué un barco de este tamaño lleva tres años y medio millón de horas de trabajo.",
    author: "Tomás Ferreyra",
    date: "2026-10-08",
    readingTime: 12,
    image: { src: unsplash("1567899378494-47b22a2ae96a"), alt: "Yate a motor de casco blanco visto de costado navegando en mar azul" },
  },
  {
    id: "s24",
    slug: "buceo-puerto-madryn-lobos-marinos",
    section: "actualidad",
    kicker: "Buceo",
    title: "Buceo en Puerto Madryn: arranca la temporada de lobos marinos",
    dek: "Operadores, precios y el protocolo para interactuar con la colonia de Punta Loma sin molestarla.",
    author: "Pablo Ibarra",
    date: "2026-10-07",
    readingTime: 6,
    image: { src: unsplash("1544551763-46a013bb70d5"), alt: "Buzo rodeado de un cardumen de peces amarillos en aguas azules" },
  },
  {
    id: "s25",
    slug: "elogio-del-lapiz-y-el-compas",
    section: "opinion",
    kicker: "Columna",
    title: "La electrónica no reemplaza la carta: elogio del lápiz y el compás",
    dek: "Un GPS puede fallar. Una posición estimada hecha a mano, bien llevada, no.",
    author: "Martín Oyarzábal",
    date: "2026-10-06",
    readingTime: 5,
    image: { src: unsplash("1510414842594-a61c69b5ae57"), alt: "Caleta con acantilados y agua turquesa vista desde lo alto" },
    quote: "Navegar es saber dónde estás cuando la pantalla se apaga.",
  },
  {
    id: "s26",
    slug: "especial-islas-atlantico-sur",
    section: "destinos",
    kicker: "Especial de la edición",
    title: "Islas del Atlántico Sur: la travesía de 2.000 millas que nadie hace",
    dek: "Un número especial de 40 páginas con la expedición de Bitácora desde Ushuaia hasta las Georgias del Sur. Cartas, fondeaderos, fauna y los relatos de la tripulación.",
    author: "Redacción Bitácora",
    date: "2026-10-31",
    readingTime: 25,
    image: { src: unsplash("1559128010-7c1ad6e1b6a5"), alt: "Isla rocosa cubierta de vegetación rodeada de mar turquesa" },
  },
]

export const bySlug = (slug: string) => stories.find((s) => s.slug === slug)

const pick = (...ids: string[]) =>
  ids.map((id) => stories.find((s) => s.id === id)).filter((s): s is Story => Boolean(s))

/** Nota principal y secundarias del hero. */
export const heroStory = stories[0]
export const heroSecondary = pick("s02", "s03", "s04", "s05")

/** Lo más leído. */
export const trending = pick("s03", "s07", "s14", "s10", "s12")

/** Feed principal: 12 tarjetas; la 6ª es ancha y la 9ª es opinión en azul marino. */
export const feedStories = pick("s06", "s07", "s09", "s10", "s11", "s14", "s13", "s15", "s08", "s16", "s17", "s18")

/** Bloques por sección. */
export const barcosBlock = { lead: stories.find((s) => s.id === "s23")!, list: pick("s07", "s15", "s19", "s01") }
export const navegacionBlock = pick("s03", "s09", "s18", "s10")
export const destinosBlock = pick("s05", "s12", "s21")

/** Franja editorial destacada (full bleed). */
export const featuredSpecial = stories.find((s) => s.id === "s26")!

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]

/** "31 OCT 2026" a partir de un ISO. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

/** "31 de octubre de 2026" para texto corrido / dateTime legible. */
export function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  )
}
