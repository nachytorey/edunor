/**
 * Datos mock del clon de portada. Textos placeholder neutros (sin identidad).
 * Para reemplazar: mantener los tipos y cambiar los contenidos / imágenes.
 */

export type Scheme = {
  a: string // fondo
  b: string // texto principal / acento 1
  c: string // acento 2 (fecha, marco, squiggle)
  headline: "b" | "c" // color del título gigante del bloque
}

export const schemes = {
  "blue-mint": { a: "#04284a", b: "#afffcc", c: "#ff6b68", headline: "c" },
  "yellow-purple": { a: "#68268c", b: "#fbd200", c: "#fb6754", headline: "c" },
  "purple-lime-saturated": { a: "#661f4f", b: "#00ff7e", c: "#661f4f", headline: "b" },
  "maroon-yellow-saturated": { a: "#881910", b: "#ffff00", c: "#881910", headline: "b" },
  "pink-mint": { a: "#ff294c", b: "#afffcc", c: "#04284a", headline: "c" },
  "coral-blue": { a: "#183f63", b: "#fb6754", c: "#afffcc", headline: "c" },
  "black-white": { a: "#000000", b: "#ffffff", c: "#4745d1", headline: "b" },
} satisfies Record<string, Scheme>

export type SchemeName = keyof typeof schemes

export type Tone = "none" | "mono" | "duotone"

export type CardType =
  | { kind: "headline-serif"; text: string } // Eksell centrado
  | { kind: "headline-sans"; text: string; strong?: string } // Maria uppercase, izquierda; strong = contorneado
  | { kind: "headline-serif-caps"; text: string } // serif en mayúsculas (tipo dólar)
  | { kind: "cardicle"; text: string; dek: string } // título + bajada arriba a la izquierda
  | { kind: "outline"; text: string } // gigante uppercase abajo a la izquierda

export type Card = {
  id: string
  href: string
  image: string
  tone: Tone
  scheme: SchemeName
  content: CardType
}

export type Post = {
  id: string
  href: string
  eyebrow: string
  date: string
  title: string
  emoji: string
}

export type Chunk =
  | {
      type: "feature"
      scheme: SchemeName
      hero: { href: string; eyebrow: string; date: string; title: string; description: string; image: string }
      posts: Post[]
    }
  | { type: "card-image"; href: string; image: string }
  | { type: "card-headline"; href: string; image: string; eyebrow: string; title: string; dek: string }
  | { type: "card-grid"; scheme: SchemeName; label: string; split?: boolean; cards: Card[] }
  | { type: "sentence"; scheme: SchemeName; items: { href: string; taxonomy: string; title: string; emoji: string }[] }

export const site = {
  name: "Portada",
  menu: ["Recientes", "Poder", "Cultura", "Futuro"],
  footer: ["Nosotros", "Legales", "Trabajá con nosotros", "¿Tenés un dato?"],
}

const pic = (seed: string, w = 750, h = 1125) => `https://picsum.photos/seed/${seed}/${w}/${h}`

let n = 0
const card = (content: CardType, scheme: SchemeName, tone: Tone = "none"): Card => {
  n += 1
  return { id: `c${n}`, href: "#", image: pic(`card-${n}`), tone, scheme, content }
}

export const chunks: Chunk[] = [
  {
    type: "feature",
    scheme: "blue-mint",
    hero: {
      href: "#",
      eyebrow: "Cultura",
      date: "20 Mar",
      title: "El desteñido",
      description:
        "Hace poco descubrí dos cosas: un término del teñido de telas sobre cómo quitarle la vida a los colores, y una vieja carta familiar. Están relacionadas, más o menos.",
      image: pic("hero-flowers", 1400, 1400),
    },
    posts: [
      { id: "p1", href: "#", eyebrow: "Cultura", date: "03 Abr", title: "Comercio injusto", emoji: "☕️" },
      { id: "p2", href: "#", eyebrow: "Poder", date: "02 Abr", title: "Carta abierta a mi perro, que no quiere salir de abajo del sillón", emoji: "🐕" },
      { id: "p3", href: "#", eyebrow: "Poder", date: "30 Mar", title: "Siempre hubo una forma de pagar los programas que necesitamos", emoji: "💵" },
      { id: "p4", href: "#", eyebrow: "El futuro", date: "02 Abr", title: "“Intuimos lo que necesitan”: una cuidadora de zoológico describe su trabajo durante la cuarentena", emoji: "🦒" },
      { id: "p5", href: "#", eyebrow: "Cultura", date: "02 Abr", title: "Colgados del teléfono", emoji: "📞" },
      { id: "p6", href: "#", eyebrow: "Poder", date: "01 Abr", title: "El científico australiano que se metió imanes en la nariz debería inspirarnos a todos", emoji: "👃" },
    ],
  },
  { type: "card-image", href: "#", image: pic("cheese", 1600, 1000) },
  {
    type: "card-grid",
    scheme: "yellow-purple",
    label: "Muy online",
    cards: [
      card({ kind: "headline-sans", text: "Bueno, al menos queda el golf" }, "purple-lime-saturated", "mono"),
      card({ kind: "headline-sans", text: ": la historia alternativa del archivo parlamentario", strong: "Un buen lugar" }, "maroon-yellow-saturated", "duotone"),
      card({ kind: "headline-serif-caps", text: "Ya alcanzamos niveles alarmantes de mal contenido de cuarentena" }, "yellow-purple", "mono"),
      card({ kind: "cardicle", text: "Algunos sitios felices para visitar si estás harto de leer artículos sobre el virus", dek: "El mundo de afuera ya da bastante miedo. Internet no tiene por qué darlo también." }, "black-white"),
      card({ kind: "headline-serif", text: "La reina del drag está fracturando el fin del mundo" }, "black-white"),
      card({ kind: "headline-serif", text: "La pandemia está generando diseño gráfico en código rojo" }, "black-white"),
    ],
  },
  {
    type: "card-grid",
    scheme: "purple-lime-saturated",
    label: "Lecturas obligadas",
    split: true,
    cards: [
      card({ kind: "headline-serif", text: "10 recetas para no cocineros con harina y tiempo de sobra" }, "black-white"),
      card({ kind: "headline-serif", text: "Todos deberíamos volver a ver ‘Los Soprano’ como una película de terror" }, "black-white"),
      card({ kind: "headline-sans", text: "", strong: "Mi papá, el votante moderado" }, "purple-lime-saturated", "duotone"),
      card({ kind: "headline-serif", text: "Este país no tiene un sistema de salud" }, "black-white", "mono"),
      card({ kind: "headline-serif", text: "" }, "black-white"),
      card({ kind: "headline-serif", text: "¿Cuánto gastarías para salvarle la vida a tu mascota?" }, "black-white"),
    ],
  },
  {
    type: "card-headline",
    href: "#",
    image: pic("hands", 1600, 1000),
    eyebrow: "El futuro",
    title: "No debería hacer falta una pandemia para que todos sean menos asquerosos",
    dek: "¡Lavate las manos!",
  },
  {
    type: "card-headline",
    href: "#",
    image: pic("debate", 1600, 1000),
    eyebrow: "Cultura",
    title: "No es momento de hablar de tu voto protesta",
    dek: "Votar a alguien que no querés es como darte la vacuna de la gripe: lo hacés por los demás.",
  },
  {
    type: "card-grid",
    scheme: "maroon-yellow-saturated",
    label: "Poder",
    cards: [
      card({ kind: "headline-serif", text: "Todos nos estamos volviendo, literalmente, más miopes" }, "black-white"),
      card({ kind: "headline-serif", text: "‘La vaca’ es una película hermosa sobre cómo el sistema nos ordeña a todos" }, "black-white"),
      card({ kind: "headline-serif", text: "¿De verdad se abolió el aislamiento en las cárceles?" }, "black-white", "mono"),
      card({ kind: "headline-serif", text: "" }, "black-white", "mono"),
      card({ kind: "headline-serif", text: "No me siento positivo con mi cuerpo" }, "black-white"),
      card({ kind: "headline-serif", text: "Una nación bajo Dios, aunque no quieras" }, "black-white"),
    ],
  },
  {
    type: "card-grid",
    scheme: "blue-mint",
    label: "Cultura",
    cards: [
      card({ kind: "headline-serif", text: "" }, "black-white"),
      card({ kind: "headline-serif", text: "Nunca vamos a encontrar dignidad en los viajes en avión" }, "black-white"),
      card({ kind: "headline-serif", text: "Cuando sos el presunto arquitecto de un programa de tortura pero, sin presunción, amás a los perros" }, "black-white"),
      card({ kind: "headline-serif", text: "Dios mío, ¿de verdad juego tanto?" }, "black-white"),
      card({ kind: "outline", text: "Dame un respiro" }, "black-white"),
      card({ kind: "headline-serif", text: "“El sapo canta Chandelier” es la canción más memorable del año" }, "black-white"),
    ],
  },
  {
    type: "card-headline",
    href: "#",
    image: pic("map", 1600, 1000),
    eyebrow: "Poder",
    title: "Canadá es falso",
    dek: "Lo que los vecinos imaginan como un país amable del norte, si es que lo imaginan, es una estafa.",
  },
  {
    type: "card-grid",
    scheme: "pink-mint",
    label: "Buenos consejos",
    cards: [
      card({ kind: "headline-serif", text: "Consultorio: ¿debería terminar con mi pareja mucho más joven?" }, "black-white"),
      card({ kind: "headline-serif", text: "Consultorio: ¿ya superé a mi ex?" }, "black-white"),
      card({ kind: "headline-serif", text: "Consultorio: ¿cómo sigo siendo amigo de alguien que me rechazó?" }, "black-white"),
      card({ kind: "headline-serif", text: "Consultorio: descubrí que mi novio piensa distinto" }, "black-white"),
      card({ kind: "headline-serif", text: "Consultorio: no sé si mi esposa está deprimida o solo cansada" }, "black-white"),
      card({ kind: "headline-serif", text: "Consultorio: me acosté con el novio de mi mejor amiga" }, "black-white"),
    ],
  },
  {
    type: "card-headline",
    href: "#",
    image: pic("laptop", 1600, 1000),
    eyebrow: "Cultura",
    title: "Me encantaría salir con alguien que no sepa leer",
    dek: "Algunos todavía intentamos divertirnos antes de morir y, lo siento, la gente inteligente rara vez es divertida.",
  },
  {
    type: "sentence",
    scheme: "coral-blue",
    items: [
      { href: "#", taxonomy: "Cultura", title: "Cómo un museo de pueblo se convirtió en un santuario de una estrella pop", emoji: "🎤" },
      { href: "#", taxonomy: "Cultura", title: "Todos deberíamos leer más ensayos", emoji: "📚" },
      { href: "#", taxonomy: "Cultura", title: "Vi demasiados videos de chanchos tiernos y ahora quiero dejar de comerlos", emoji: "🐷" },
      { href: "#", taxonomy: "Poder", title: "¿Quién es el villano número uno del mundo?", emoji: "💣" },
      { href: "#", taxonomy: "Poder", title: "Cómo equivocarse", emoji: "❓" },
      { href: "#", taxonomy: "Cultura", title: "Trabajar en gastronomía te va a perseguir en sueños", emoji: "🍽️" },
      { href: "#", taxonomy: "El futuro", title: "Si pudieras ir a la Luna gratis, ¿irías?", emoji: "🌙" },
      { href: "#", taxonomy: "El futuro", title: "Empiezo a sospechar que tener millones de seguidores no hace feliz a nadie", emoji: "😢" },
      { href: "#", taxonomy: "Poder", title: "“Diversidad”, ¿en qué sentido exactamente?", emoji: "❔" },
      { href: "#", taxonomy: "El futuro", title: "La revolución del 5G que no fue", emoji: "📱" },
      { href: "#", taxonomy: "Cultura", title: "Los ladrillos de mi cordura vienen del Tetris del teléfono", emoji: "🧠" },
      { href: "#", taxonomy: "Poder", title: "La historia de la doctrina sobre ese tema no es tan clara como creés", emoji: "⏳" },
      { href: "#", taxonomy: "Cultura", title: "Este emperador está desnudo", emoji: "🧱" },
      { href: "#", taxonomy: "El futuro", title: "Por quién doblan los trolls", emoji: "✅" },
    ],
  },
]
