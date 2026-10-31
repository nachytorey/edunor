export type World = "agua" | "tierra"

export type Product = {
  slug: string
  name: string
  /** Line breaks of the name as it is set on the poster (two lines at most). */
  nameLines: string[]
  kind: string
  world: World
  image: string
  alt: string
  /** Darkest large tone of its own photograph: the chapter's ground. */
  ground: string
  ink: string
  /** One sentence, said out loud. */
  line: string
  /** Three blunt facts. Sample data: the client confirms them before launch. */
  facts: string[]
  featured: boolean
}

export const products: Product[] = [
  {
    slug: "open-250-sport",
    name: "Open 250 Sport",
    nameLines: ["Open 250", "Sport"],
    kind: "Lancha open",
    world: "agua",
    image: "/images/products/bote-open-250.jpg",
    alt: "Lancha Open 250 Sport con consola central y motor Mercury, fondeada de noche",
    ground: "#06121d",
    ink: "#f4f4f4",
    line: "Consola central para pescar o pasear, con un Mercury de hasta 250 HP en el espejo.",
    facts: ["Eslora 7,6 m", "Hasta 250 HP", "8 personas"],
    featured: true,
  },
  {
    slug: "cruiser-320-luxury",
    name: "Cruiser 320 Luxury",
    nameLines: ["Cruiser", "320 Luxury"],
    kind: "Crucero",
    world: "agua",
    image: "/images/products/bote-cruiser-320.jpg",
    alt: "Crucero Cruiser 320 Luxury navegando al atardecer",
    ground: "#143a54",
    ink: "#f4f4f4",
    line: "Dos camarotes y flybridge para dormir a bordo todo el fin de semana.",
    facts: ["Eslora 9,8 m", "2 camarotes", "Flybridge"],
    featured: true,
  },
  {
    slug: "pescador-180",
    name: "Pescador 180",
    nameLines: ["Pescador", "180"],
    kind: "Bote de aluminio",
    world: "agua",
    image: "/images/products/bote-pescador-180.jpg",
    alt: "Bote de aluminio Pescador 180 con motor fuera de borda en un río en calma",
    ground: "#28343a",
    ink: "#f4f4f4",
    line: "Aluminio liviano para el Delta, con consola y un fuera de borda de 40 HP.",
    facts: ["Eslora 5,5 m", "40 HP", "Aluminio"],
    featured: true,
  },
  {
    slug: "maverick-x3",
    name: "Maverick X3",
    nameLines: ["Maverick", "X3"],
    kind: "UTV deportivo",
    world: "tierra",
    image: "/images/products/utv-maverick-x3.jpg",
    alt: "UTV Maverick X3 derrapando en un camino de tierra al atardecer",
    ground: "#2a1f19",
    ink: "#f4f4f4",
    line: "El UTV más rápido del piso: turbo, trocha ancha y suspensión de competición.",
    facts: ["Turbo 200 HP", "Trocha 72 pulgadas", "2 plazas"],
    featured: true,
  },
  {
    slug: "sportsman-850",
    name: "Sportsman 850",
    nameLines: ["Sportsman", "850"],
    kind: "Cuatriciclo",
    world: "tierra",
    image: "/images/products/quad-sportsman-850.jpg",
    alt: "Cuatriciclo Sportsman 850 negro sobre un terreno de piedras",
    ground: "#0f1112",
    ink: "#f4f4f4",
    line: "Tracción integral y dirección asistida para el campo y las dunas.",
    facts: ["850 cc", "Tracción 4x4", "Dirección asistida"],
    featured: true,
  },
  {
    slug: "ranger-1000",
    name: "Ranger 1000",
    nameLines: ["Ranger", "1000"],
    kind: "UTV de trabajo",
    world: "tierra",
    image: "/images/products/utv-ranger-1000.jpg",
    alt: "UTV Ranger 1000 con jaula y luces, detenido en un camino de tierra",
    ground: "#3a3632",
    ink: "#f4f4f4",
    line: "Caja de carga de 450 kilos y tres plazas para trabajar el campo entero.",
    facts: ["1000 cc", "Carga 450 kg", "3 plazas"],
    featured: true,
  },
  {
    slug: "general-xp",
    name: "General XP",
    nameLines: ["General", "XP"],
    kind: "UTV",
    world: "tierra",
    image: "/images/products/utv-general-xp.jpg",
    alt: "UTV General XP verde en un camino de bosque",
    ground: "#1e2a21",
    ink: "#f4f4f4",
    line: "Trabajo y paseo en el mismo vehículo.",
    facts: ["1000 cc", "2 plazas", "Caja de carga"],
    featured: false,
  },
  {
    slug: "outlander-650",
    name: "Outlander 650",
    nameLines: ["Outlander", "650"],
    kind: "Cuatriciclo",
    world: "tierra",
    image: "/images/products/quad-outlander-650.jpg",
    alt: "Cuatriciclo Outlander 650 amarillo con piloto en un sendero de montaña",
    ground: "#0d0e0f",
    ink: "#f4f4f4",
    line: "Un cuatriciclo liviano para empezar.",
    facts: ["650 cc", "Tracción 4x4", "1 plaza"],
    featured: false,
  },
  {
    slug: "kit-navegacion",
    name: "Kit de navegación",
    nameLines: ["Kit de", "navegación"],
    kind: "Equipamiento",
    world: "agua",
    image: "/images/products/accesorio-kit-navegacion.jpg",
    alt: "Plotter de navegación con cartografía, controles remotos y antenas",
    ground: "#121212",
    ink: "#f4f4f4",
    line: "Plotter, sonda y radio para tu embarcación.",
    facts: ["Plotter", "Sonda", "Radio VHF"],
    featured: false,
  },
]

export const featured = products.filter((p) => p.featured)
export const more = products.filter((p) => !p.featured)

export type BrandGroup = {
  name: string
  items: { name: string; note: string }[]
}

export const brandGroups: BrandGroup[] = [
  {
    name: "Motores fuera de borda",
    items: [
      { name: "Mercury", note: "Representante oficial" },
      { name: "Mariner", note: "Representante oficial" },
      { name: "Yamaha", note: "Representante oficial" },
      { name: "Evinrude", note: "Service y repuestos" },
    ],
  },
  {
    name: "Motores internos",
    items: [
      { name: "Volvo Penta", note: "Representante oficial" },
      { name: "Mercruiser", note: "Representante oficial" },
    ],
  },
  {
    name: "Motos de agua y off-road",
    items: [
      { name: "Sea Doo", note: "Representante oficial" },
      { name: "Polaris", note: "Representante oficial" },
    ],
  },
  {
    name: "Semirrígidos e inflables",
    items: [
      { name: "Zodiac", note: "Representante oficial" },
      { name: "Semirrígidos Edunor", note: "Fabricación propia" },
      { name: "Canestrari", note: "Representante oficial" },
      { name: "Arco-Iris", note: "Representante oficial" },
      { name: "Autonáutica", note: "Representante oficial" },
    ],
  },
  {
    name: "Kayaks y camping",
    items: [
      { name: "Atlanti-kayak's", note: "Representante oficial" },
      { name: "Equipamiento outdoor", note: "En showroom" },
    ],
  },
  {
    name: "Generadores",
    items: [{ name: "Generac", note: "Representante oficial" }],
  },
  {
    name: "Service oficial",
    items: [
      { name: "Taller propio", note: "Témperley" },
      { name: "Técnicos certificados", note: "Por cada marca" },
      { name: "Repuestos originales", note: "En stock" },
    ],
  },
]
