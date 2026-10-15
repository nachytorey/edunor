export type Card = {
  title: string
  tag: string
  image: string
}

export type Category = {
  id: string
  index: string
  title: string
  description: string
  // Colores en oklch: `main` es el fondo, `paired` el texto
  main: string
  paired: string
  cards?: Card[]
  brands?: string[]
}

export const featured: Card[] = [
  { title: "Embarcaciones", tag: "Náutica", image: "/images/hero.jpg" },
  { title: "UTVs y cuatriciclos", tag: "Off-road", image: "/images/products/utv-maverick-x3.jpg" },
  { title: "Showroom de 1500m²", tag: "Témperley · Canning", image: "/images/about.jpg" },
]

export const categories: Category[] = [
  {
    id: "nautica",
    index: "01",
    title: "Náutica",
    description:
      "Lanchas, semirrígidos, botes de pesca y todo el equipamiento para salir al agua. Te asesoramos para elegir la embarcación que va con tu forma de navegar.",
    main: "oklch(0.29 0.07 250)",
    paired: "oklch(0.95 0.025 200)",
    cards: [
      { title: "Open 250 Sport", tag: "Lancha", image: "/images/products/bote-open-250.jpg" },
      { title: "Cruiser 320 Luxury", tag: "Crucero", image: "/images/products/bote-cruiser-320.jpg" },
      { title: "Pescador 180", tag: "Aluminio", image: "/images/products/bote-pescador-180.jpg" },
      { title: "Kit de navegación", tag: "Accesorios", image: "/images/products/accesorio-kit-navegacion.jpg" },
    ],
  },
  {
    id: "off-road",
    index: "02",
    title: "Off-road",
    description:
      "UTVs y cuatriciclos para el trabajo y la aventura. Representantes oficiales con unidades en exhibición, financiación y entrega inmediata.",
    main: "oklch(0.55 0.18 35)",
    paired: "oklch(0.94 0.025 50)",
    cards: [
      { title: "Maverick X3", tag: "UTV", image: "/images/products/utv-maverick-x3.jpg" },
      { title: "Ranger 1000", tag: "UTV", image: "/images/products/utv-ranger-1000.jpg" },
      { title: "Sportsman 850", tag: "Cuatriciclo", image: "/images/products/quad-sportsman-850.jpg" },
      { title: "Outlander 650", tag: "Cuatriciclo", image: "/images/products/quad-outlander-650.jpg" },
    ],
  },
  {
    id: "service",
    index: "03",
    title: "Service oficial",
    description:
      "Taller propio con técnicos certificados por las marcas que representamos. Mantenimiento, reparación y repuestos originales para tu motor.",
    main: "oklch(0.32 0.05 155)",
    paired: "oklch(0.93 0.05 90)",
    brands: [
      "Mercury",
      "Mariner",
      "Evinrude",
      "Yamaha",
      "Volvo Penta",
      "Mercruiser",
      "Sea Doo",
      "Polaris",
      "Generac",
    ],
  },
  {
    id: "camping",
    index: "04",
    title: "Camping & Outdoor",
    description:
      "Kayaks, inflables y todo lo que necesitás para disfrutar al aire libre. Las mismas marcas de siempre, con la atención de una empresa familiar.",
    main: "oklch(0.27 0.045 330)",
    paired: "oklch(0.94 0.06 85)",
    brands: [
      "Zodiac",
      "Canestrari",
      "Arco-Iris",
      "Autonáutica",
      "Atlanti-kayak's",
      "Semirrígidos Edunor",
    ],
  },
]

export const stats = [
  { value: "+60", label: "Años de trayectoria" },
  { value: "1500m²", label: "De showroom" },
  { value: "2", label: "Sucursales" },
]
