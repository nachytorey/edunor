/**
 * Datos de Edunor Náutica tomados de su web anterior
 * (https://www.edunornautica.com.ar/web-nuevo/ — La empresa, Servicio técnico, Ubicación y Contacto),
 * relevados el 31/10/2026. Si algo cambió, se corrige acá y se actualiza toda la portada.
 */

export const company = {
  founded: 1963,
  summary:
    "Empresa familiar fundada en 1963, dedicada a la náutica, el camping y el outdoor. Más de 1500 m² de showroom en Témperley.",
  showroomM2: 1500,
  officialMercury: true,
}

/** Marcas que representa, agrupadas como en "La empresa". */
export const brands: { group: string; names: string[] }[] = [
  { group: "Embarcaciones", names: ["Canestrari", "Arco-Iris", "Zodiac", "Autonáutica", "Semirrígidos Edunor", "Atlanti-Kayak's"] },
  { group: "Motores fuera de borda", names: ["Mercury", "Mariner", "Evinrude", "Yamaha"] },
  { group: "Motores internos", names: ["Volvo Penta", "MerCruiser"] },
  { group: "Motos de agua", names: ["Yamaha", "Sea-Doo"] },
  { group: "Cuatriciclos", names: ["Polaris"] },
  { group: "Generadores", names: ["Generac"] },
]

export const service = {
  title: "Service oficial de las marcas que representamos",
  points: [
    "Garantías oficiales",
    "Stock permanente de repuestos originales",
    "Taller propio y atención en guarderías de Zona Norte",
    "Equipamiento mecánico y electrónico de última generación",
  ],
}

/** Fabricación propia (página "Servicio técnico"). */
export const equipment = {
  fiberglass: ["Consolas con tanque de combustible interno", "Tambuchos estancos", "Catalinas de proa", "Tanques de combustible"],
  stainless: ["Arcos de radar", "Guardamancebos", "Pasamanos", "Barras de ski", "Escaleras"],
  upholstery: ["Tapizados náuticos con costuras soldadas", "Butacas", "Cerramientos", "Toldillas"],
  accessories: ["Ecosonda", "Radio VHF", "GPS", "Bombas de achique", "Luces de navegación", "Elementos de seguridad", "Salvavidas", "Wakeboard, ski e inflables"],
}

export const contact = {
  address: "Av. Antártida Argentina 101, Témperley",
  area: "Partido de Lomas de Zamora, Pcia. de Buenos Aires",
  phones: ["011 4231-5663", "011 4298-9291"],
  emails: ["ventas@edunornautica.com.ar", "info@edunornautica.com.ar", "edunornautica@gmail.com"],
  facebook: "https://www.facebook.com/edunornautica",
}

/**
 * Generadores (página "Productos / Generadores" de la web anterior: "Representantes oficiales
 * de generadores GENERAC"). Las subpáginas de cada línea estaban caídas (error 500), así que
 * solo se usan los nombres de las líneas y sus fotos; no hay fichas técnicas.
 */
export const generators = {
  brand: "GENERAC",
  title: "Generadores",
  lead: "Representantes oficiales de generadores GENERAC",
  dek: "Portátiles para el campo, la obra o el fin de semana; residenciales y comerciales que arrancan solos cuando se corta la luz; e industriales para alta potencia. Te asesoramos para elegir el equipo y lo instalamos.",
  image: { src: "/palatine/generac.webp", alt: "Generadores GENERAC: residenciales Guardian y Protector, industrial y portátiles" },
}
