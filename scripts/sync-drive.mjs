#!/usr/bin/env node
/**
 * Sincroniza el catálogo de modelos desde una carpeta de Google Drive.
 *
 * Qué hace:
 *   1. Recorre la carpeta raíz (y sus subcarpetas) con la API de Google Drive v3.
 *   2. Arma un producto por cada carpeta que tenga fotos o videos. El nombre del producto es
 *      el nombre de la carpeta. Si una carpeta tiene imágenes sueltas y ninguna
 *      subcarpeta con imágenes, cada imagen es un producto (nombre = nombre del archivo).
 *   3. Deduce la categoría (lanchas / cuatriciclos) por el nombre de la carpeta o de
 *      cualquiera de sus carpetas madre. Estructura actual de Drive:
 *        CANESTRARI/LANCHAS/CATALOGO/<modelo>/…  → lanchas
 *        CANESTRARI/LANCHAS/PUBLICIDAD/<pieza>/… → publicidad (no son modelos)
 *        CANESTRARI/CUATRI/<modelo>/…            → cuatriciclos
 *      Una carpeta llamada PUBLICIDAD (o Promo, Marketing, Landing, Redes) no genera modelos:
 *      sus videos e imágenes son piezas para la portada. Cada subcarpeta es una pieza
 *      (nombre = carpeta); cada archivo suelto, una pieza más. Se bajan a public/publicidad/<pieza>/
 *      y van en `publicidad` dentro de data/catalog.json.
 *   4. Si la carpeta del modelo tiene un .txt (idealmente "descripcion.txt"), su texto es la
 *      descripción del modelo. Si no, se usa data/descripciones/<carpeta>/descripcion.txt
 *      del repo (la carpeta se compara por slug: "225 CUDDY DF" ↔ "225-cuddy-df").
 *   5. Descarga las fotos redimensionadas a public/catalog/<modelo>/ y escribe
 *      data/catalog.json, que es lo que lee el sitio. Las fotos que no cambiaron
 *      (mismo checksum) no se vuelven a bajar.
 *   6. Los videos (.mp4, .mov, .webm…) se bajan enteros a la misma carpeta, junto con su
 *      miniatura de Drive como póster (<id>.poster.jpg). Si el modelo no tiene fotos, el
 *      sitio usa ese póster como portada.
 *
 * Sin credenciales (modo por defecto): la carpeta tiene que estar compartida como
 *   "Cualquier persona con el enlace: Lector". Se recorre la vista pública de Drive
 *   (embeddedfolderview) y las fotos se bajan de su miniatura pública. No hace falta clave.
 *
 * Con credenciales (opcional, en .env.local), por ejemplo para una carpeta privada:
 *   GOOGLE_DRIVE_API_KEY=...            → la carpeta tiene que estar compartida como
 *                                          "Cualquier persona con el enlace: lector".
 *   GOOGLE_SERVICE_ACCOUNT_JSON=...      → JSON completo de una cuenta de servicio (o
 *   GOOGLE_APPLICATION_CREDENTIALS=path    la ruta al archivo). La carpeta se comparte
 *                                          con el email de esa cuenta; puede ser privada.
 *
 * Opciones:
 *   DRIVE_FOLDER_ID   carpeta raíz (por defecto la del catálogo de Edunor)
 *   DRIVE_MAX_IMAGES  fotos por modelo (por defecto 6)
 *   DRIVE_MAX_VIDEOS  videos por modelo (por defecto 3)
 *   --optional        si no hay credenciales o falla la red, avisa y sale con 0
 *                     (se usa en prebuild para no romper el deploy)
 *   --dry-run         lista lo que encontraría sin descargar ni escribir
 *
 * Uso:  npm run sync:drive
 */

import { createSign } from "node:crypto"
import { mkdir, readFile, readdir, writeFile, rm } from "node:fs/promises"
import { existsSync } from "node:fs"
import { optimizeImage } from "./optimize-images.mjs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT_JSON = path.join(ROOT, "data", "catalog.json")
const OUT_IMG_DIR = path.join(ROOT, "public", "catalog")
const OUT_AD_DIR = path.join(ROOT, "public", "publicidad")
const LOCAL_DESC_DIR = path.join(ROOT, "data", "descripciones")
const DEFAULT_FOLDER = "17jFiWFdEk4QG6NqpGCMOKow9uKnT573V"
const API = "https://www.googleapis.com/drive/v3"
const FOLDER_MIME = "application/vnd.google-apps.folder"
const TEXT_NAMES = /^(descripcion|descripción|info|ficha)\.txt$/i

/* ───────── utilidades puras (se testean sin red) ───────── */

/** Descripciones escritas en el repo: data/descripciones/<modelo>/descripcion.txt, por slug. */
async function readLocalDescriptions() {
  const map = new Map()
  if (!existsSync(LOCAL_DESC_DIR)) return map
  for (const entry of await readdir(LOCAL_DESC_DIR, { withFileTypes: true })) {
    const file = path.join(LOCAL_DESC_DIR, entry.name, "descripcion.txt")
    if (!entry.isDirectory() || !existsSync(file)) continue
    const text = (await readFile(file, "utf8")).replace(/^\uFEFF/, "").replace(/\n{3,}/g, "\n\n").trim()
    if (text) map.set(slugify(entry.name), text)
  }
  return map
}

export function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** "sea-doo_spark_trixx.jpg" → "Sea Doo Spark Trixx" */
export function prettyName(raw) {
  const base = raw.replace(/\.[a-z0-9]{2,5}$/i, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
  return base.replace(/(^|\s)([a-záéíóúñ])/g, (m, s, c) => s + c.toUpperCase())
}

/* Palabras que nombran la categoría (mandan) y pistas por marca/modelo (solo de respaldo). */
const LAND = /(cuatri|atv|utv|quad|side.?by.?side|tierra|terrestre)/i
const WATER = /(lancha|bote|semi.?r[ií]gido|gomon|crucero|yate|embarcaci|n[aá]utic|moto.?de.?agua|jet.?ski|velero|kayak)/i
const LAND_HINT = /(maverick|outlander|sportsman|ranger|general|rzr|can.?am|polaris|renegade|commander|defender)/i
const WATER_HINT = /(zodiac|sea.?doo|spark|gti|rxp|open|cruiser|pescador|mercury|yamaha|fueraborda)/i

/** Primero busca una carpeta que nombre la categoría (de la más específica a la raíz); después, pistas de modelo. */
export function categorize(names) {
  const ordered = [...names].reverse()
  for (const name of ordered) {
    if (LAND.test(name)) return "cuatriciclos"
    if (WATER.test(name)) return "lanchas"
  }
  for (const name of ordered) {
    if (LAND_HINT.test(name)) return "cuatriciclos"
    if (WATER_HINT.test(name)) return "lanchas"
  }
  return "lanchas"
}

/** Para publicidad manda el nombre de la pieza ("Polaris RZR 200" es UTV aunque cuelgue de LANCHAS); después, el camino. */
export function categorizeAd(names) {
  const own = names[names.length - 1] ?? ""
  if (LAND.test(own) || LAND_HINT.test(own)) return "cuatriciclos"
  if (WATER.test(own) || WATER_HINT.test(own)) return "lanchas"
  return categorize(names)
}

export const isImage = (f) => f.mimeType?.startsWith("image/")
const VIDEO_EXT = /\.(mp4|m4v|mov|webm)$/i
export const isVideo = (f) => f.mimeType?.startsWith("video/") || VIDEO_EXT.test(f.name)
export const isText = (f) => /\.txt$/i.test(f.name) || f.mimeType === "text/plain"

/** "Lanchas", "Cuatriciclos y UTV", "Motos de agua"… = carpeta contenedora, no un modelo. */
const CATEGORY_ONLY =
  /^(lanchas?|botes?|embarcaciones|semi ?rigidos?|gomones?|cruceros?|yates?|motos? de agua|jet ?skis?|nauticas?|cuatriciclos?|cuatris?|atvs?|utvs?|quads?|vehiculos?|modelos?|catalogos?|productos?|fotos?|y|e|\s)+$/
export const isCategoryFolder = (name) =>
  CATEGORY_ONLY.test(
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z ]+/g, " ")
      .trim(),
  )

/** "PUBLICIDAD", "Promo", "Marketing"…: material para la portada, no modelos del catálogo. */
const AD_FOLDER = /^(publicidad|promos?|promociones|marketing|landing|redes)$/
export const isAdFolder = (name) =>
  AD_FOLDER.test(
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim(),
  )

/** Las fotos que se llaman "portada" (portada.jpg, Portada 2.png…) van primero: son la tapa del modelo. */
export const isCover = (name) => /portada/i.test(name)
export function byCoverThenName(a, b) {
  return Number(isCover(b.name)) - Number(isCover(a.name)) || a.name.localeCompare(b.name, "es", { numeric: true })
}

/**
 * Convierte el árbol de Drive en productos.
 * tree: { id, name, files: DriveFile[], folders: tree[] }
 */
export function buildProducts(tree, trail = []) {
  const products = []
  const here = [...trail, tree.name]
  const images = tree.files.filter(isImage).sort(byCoverThenName)
  const videos = tree.files.filter(isVideo).sort(byCoverThenName)
  const childProducts = tree.folders.filter((f) => !isAdFolder(f.name)).flatMap((f) => buildProducts(f, here))
  // Descripción del modelo: un .txt en su carpeta. Si hay varios, manda "descripcion.txt" (o info/ficha).
  const texts = tree.files.filter(isText)
  const descFile = texts.find((f) => TEXT_NAMES.test(f.name)) ?? texts[0]

  if ((images.length || videos.length) && trail.length > 0 && childProducts.length === 0 && !isCategoryFolder(tree.name)) {
    // Carpeta de un modelo: todas sus fotos y videos son la galería del producto.
    products.push({
      name: prettyName(tree.name),
      folderId: tree.id,
      category: categorize(here),
      images,
      videos,
      descriptionFileId: descFile?.id,
    })
  } else if (images.length) {
    // Fotos sueltas en la raíz o en una carpeta de categoría: cada una es un modelo.
    for (const img of images) {
      products.push({ name: prettyName(img.name), folderId: tree.id, category: categorize([...here, img.name]), images: [img], videos: [] })
    }
  }
  return [...products, ...childProducts]
}

/**
 * Piezas de publicidad (videos e imágenes para la portada) de las carpetas PUBLICIDAD, estén
 * donde estén en el árbol. Cada subcarpeta es una pieza con sus archivos; cada archivo suelto,
 * una pieza propia. La categoría sale del camino de carpetas o del nombre, igual que en los modelos.
 */
export function buildAds(tree, trail = []) {
  const here = [...trail, tree.name]
  if (!isAdFolder(tree.name)) return tree.folders.flatMap((f) => buildAds(f, here))
  const media = (files) => ({
    images: files.filter(isImage).sort(byCoverThenName),
    videos: files.filter(isVideo).sort(byCoverThenName),
  })
  const pieces = tree.folders
    .map((f) => ({ name: prettyName(f.name), folderId: f.id, category: categorizeAd([...here, f.name]), ...media(f.files) }))
    .filter((p) => p.images.length || p.videos.length)
  for (const f of tree.files.filter((f) => isImage(f) || isVideo(f))) {
    pieces.push({ name: prettyName(f.name), folderId: tree.id, category: categorizeAd([...here, f.name]), ...media([f]) })
  }
  return pieces
}

/* ───────── autenticación ───────── */

async function serviceAccountToken(json) {
  const sa = typeof json === "string" ? JSON.parse(json) : json
  const now = Math.floor(Date.now() / 1000)
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url")
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`
  const signature = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key, "base64url")
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  })
  if (!res.ok) throw new Error(`No se pudo autenticar la cuenta de servicio (${res.status}): ${await res.text()}`)
  return (await res.json()).access_token
}

async function resolveAuth(env) {
  if (env.GOOGLE_SERVICE_ACCOUNT_JSON) return { token: await serviceAccountToken(env.GOOGLE_SERVICE_ACCOUNT_JSON) }
  if (env.GOOGLE_APPLICATION_CREDENTIALS && existsSync(env.GOOGLE_APPLICATION_CREDENTIALS)) {
    return { token: await serviceAccountToken(await readFile(env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")) }
  }
  if (env.GOOGLE_DRIVE_API_KEY) return { key: env.GOOGLE_DRIVE_API_KEY }
  return null
}

/* ───────── API de Drive ───────── */

export function createDrive(auth, fetchImpl = fetch) {
  const withAuth = (url) => {
    if (auth.key) url.searchParams.set("key", auth.key)
    return { url, headers: auth.token ? { authorization: `Bearer ${auth.token}` } : {} }
  }

  async function request(pathname, params = {}) {
    const { url, headers } = withAuth(new URL(API + pathname))
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
    const res = await fetchImpl(url, { headers })
    if (!res.ok) {
      const body = await res.text()
      const hint =
        res.status === 404 || res.status === 403
          ? " → Revisá que la carpeta esté compartida con 'Cualquier persona con el enlace' (clave de API) o con el email de la cuenta de servicio."
          : res.status === 400
            ? " → La clave de API no es válida o no tiene habilitada la Google Drive API."
            : ""
      throw new Error(`Drive respondió ${res.status} en ${pathname}${hint}\n${body.slice(0, 400)}`)
    }
    return res
  }

  async function list(folderId) {
    const files = []
    let pageToken
    do {
      const res = await request("/files", {
        q: `'${folderId}' in parents and trashed = false`,
        fields: "nextPageToken, files(id, name, mimeType, md5Checksum, modifiedTime, thumbnailLink, imageMediaMetadata(width, height), videoMediaMetadata(width, height))",
        pageSize: "1000",
        supportsAllDrives: "true",
        includeItemsFromAllDrives: "true",
        ...(pageToken ? { pageToken } : {}),
      })
      const data = await res.json()
      files.push(...data.files)
      pageToken = data.nextPageToken
    } while (pageToken)
    return files
  }

  async function tree(folderId, name = "catalogo", depth = 0) {
    if (depth > 6) return { id: folderId, name, files: [], folders: [] }
    const entries = await list(folderId)
    const folders = await Promise.all(
      entries.filter((e) => e.mimeType === FOLDER_MIME).map((f) => tree(f.id, f.name, depth + 1)),
    )
    return { id: folderId, name, files: entries.filter((e) => e.mimeType !== FOLDER_MIME), folders }
  }

  async function folderName(folderId) {
    const res = await request(`/files/${folderId}`, { fields: "name", supportsAllDrives: "true" })
    return (await res.json()).name
  }

  /** Foto redimensionada (thumbnailLink acepta =w1600) y, si no hay miniatura, el original. */
  async function download(file, width = 1600) {
    if (file.thumbnailLink) {
      const thumb = file.thumbnailLink.replace(/=s\d+(-[a-z0-9-]+)?$/i, `=w${width}`)
      const res = await fetchImpl(thumb, { headers: auth.token ? { authorization: `Bearer ${auth.token}` } : {} })
      if (res.ok) return { bytes: Buffer.from(await res.arrayBuffer()), ext: "jpg" }
    }
    const res = await request(`/files/${file.id}`, { alt: "media", supportsAllDrives: "true" })
    const ext = (file.name.match(/\.([a-z0-9]{2,5})$/i)?.[1] ?? "jpg").toLowerCase()
    return { bytes: Buffer.from(await res.arrayBuffer()), ext }
  }

  async function text(fileId) {
    const res = await request(`/files/${fileId}`, { alt: "media", supportsAllDrives: "true" })
    return (await res.text()).trim()
  }

  /** Video original, sin recomprimir. */
  async function downloadVideo(file) {
    const res = await request(`/files/${file.id}`, { alt: "media", supportsAllDrives: "true" })
    return { bytes: Buffer.from(await res.arrayBuffer()), ext: videoExt(file) }
  }

  /** Póster del video: la miniatura que genera Drive (null si todavía no la tiene). */
  async function poster(file, width = 1600) {
    if (!file.thumbnailLink) return null
    const res = await fetchImpl(file.thumbnailLink.replace(/=s\d+(-[a-z0-9-]+)?$/i, `=w${width}`), {
      headers: auth.token ? { authorization: `Bearer ${auth.token}` } : {},
    })
    return res.ok ? Buffer.from(await res.arrayBuffer()) : null
  }

  return { tree, folderName, download, text, downloadVideo, poster }
}

const videoExt = (file) => (file.name.match(VIDEO_EXT)?.[1] ?? "mp4").toLowerCase()

/* ───────── Drive público, sin clave ───────── */

const decode = (t) =>
  t
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .trim()

/** Parsea el HTML de https://drive.google.com/embeddedfolderview?id=… */
export function parseEmbeddedFolder(html) {
  const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "catalogo")
  const entries = []
  const re = /<div class="flip-entry" id="entry-([\w-]+)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<div class="flip-entry-title">([\s\S]*?)<\/div>/g
  for (const m of html.matchAll(re)) {
    const [, id, href, rawName] = m
    const block = m[0]
    const isFolder = /\/drive\/(u\/\d+\/)?folders\//.test(href)
    const typeIcon = block.match(/\/type\/([\w.+-]+\/[\w.+-]+)/)?.[1]
    const name = decode(rawName.replace(/<[^>]+>/g, ""))
    const guessed = /\.(jpe?g|png|webp|gif|heic|avif)$/i.test(name)
      ? "image/jpeg"
      : VIDEO_EXT.test(name)
        ? "video/mp4"
        : /\.txt$/i.test(name)
          ? "text/plain"
          : "application/octet-stream"
    entries.push({
      id,
      name,
      mimeType: isFolder ? FOLDER_MIME : typeIcon && !typeIcon.startsWith("application/vnd.google-apps.folder") ? typeIcon : guessed,
      md5Checksum: `public:${id}:${name}`,
    })
  }
  return { title, entries }
}

export function createPublicDrive(fetchImpl = fetch) {
  const headers = { "user-agent": "Mozilla/5.0 (EdunorCatalogSync)", "accept-language": "es" }

  async function folder(folderId) {
    const res = await fetchImpl(`https://drive.google.com/embeddedfolderview?id=${folderId}`, { headers })
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      throw new Error(
        `La carpeta ${folderId} no es pública (Drive respondió ${res.status}). ` +
          "En Drive: Compartir → Acceso general → 'Cualquier persona con el enlace' → Lector. " +
          "O configurá credenciales en .env.local para leerla privada.",
      )
    }
    if (!res.ok) throw new Error(`Drive respondió ${res.status} al listar ${folderId}.`)
    return parseEmbeddedFolder(await res.text())
  }

  async function tree(folderId, name, depth = 0) {
    const { title, entries } = await folder(folderId)
    if (depth > 6) return { id: folderId, name: name ?? title, files: [], folders: [] }
    const folders = []
    for (const f of entries.filter((e) => e.mimeType === FOLDER_MIME)) folders.push(await tree(f.id, f.name, depth + 1))
    return { id: folderId, name: name ?? title, files: entries.filter((e) => e.mimeType !== FOLDER_MIME), folders }
  }

  return {
    tree,
    folderName: async (folderId) => (await folder(folderId)).title,
    async download(file, width = 1600) {
      const res = await fetchImpl(`https://drive.google.com/thumbnail?id=${file.id}&sz=w${width}`, { headers })
      const type = res.headers?.get?.("content-type") ?? "image/jpeg"
      if (!res.ok || !type.startsWith("image/")) throw new Error(`No se pudo bajar la foto ${file.name} (${res.status}).`)
      return { bytes: Buffer.from(await res.arrayBuffer()), ext: type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg" }
    },
    async text(fileId) {
      const res = await fetchImpl(`https://drive.google.com/uc?export=download&id=${fileId}`, { headers })
      if (!res.ok) throw new Error(`No se pudo leer el texto ${fileId}.`)
      return (await res.text()).trim()
    },
    /** confirm=t saltea el aviso de "no se pudo analizar en busca de virus" de los archivos grandes. */
    async downloadVideo(file) {
      const res = await fetchImpl(`https://drive.usercontent.google.com/download?id=${file.id}&export=download&confirm=t`, { headers })
      const type = res.headers?.get?.("content-type") ?? ""
      if (!res.ok || !(type.startsWith("video/") || type.includes("octet-stream"))) {
        throw new Error(`No se pudo bajar el video ${file.name} (${res.status} ${type}).`)
      }
      return { bytes: Buffer.from(await res.arrayBuffer()), ext: videoExt(file) }
    },
    async poster(file, width = 1600) {
      const res = await fetchImpl(`https://drive.google.com/thumbnail?id=${file.id}&sz=w${width}`, { headers })
      const type = res.headers?.get?.("content-type") ?? ""
      return res.ok && type.startsWith("image/") ? Buffer.from(await res.arrayBuffer()) : null
    },
  }
}

/* ───────── sincronización ───────── */

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT_JSON, "utf8"))
  } catch {
    return null
  }
}

export async function sync({ env = process.env, dryRun = false, log = console.log, fetchImpl = fetch } = {}) {
  const auth = await resolveAuth(env)
  const folderId = env.DRIVE_FOLDER_ID || DEFAULT_FOLDER
  const maxImages = Number(env.DRIVE_MAX_IMAGES || 6)
  const maxVideos = Number(env.DRIVE_MAX_VIDEOS || 3)
  const drive = auth ? createDrive(auth, fetchImpl) : createPublicDrive(fetchImpl)
  log(auth ? "→ Modo API (con credenciales)." : "→ Modo público (sin clave).")

  log(`→ Leyendo la carpeta ${folderId}…`)
  const rootName = await drive.folderName(folderId)
  const tree = await drive.tree(folderId, rootName)
  const found = buildProducts(tree)
  const ads = buildAds(tree)
  log(`→ ${found.length} modelos y ${ads.length} piezas de publicidad encontrados.`)

  // Slugs únicos aunque dos carpetas se llamen igual (modelos y publicidad numeran por separado).
  const assignSlugs = (list, fallback) => {
    const used = new Map()
    for (const p of list) {
      const base = slugify(p.name) || fallback
      const n = (used.get(base) ?? 0) + 1
      used.set(base, n)
      p.slug = n === 1 ? base : `${base}-${n}`
    }
  }
  assignSlugs(found, "modelo")
  assignSlugs(ads, "pieza")

  if (dryRun) {
    for (const p of found) log(`   [${p.category}] ${p.name} — ${p.images.length} fotos, ${p.videos.length} videos`)
    for (const p of ads) log(`   [publicidad · ${p.category}] ${p.name} — ${p.images.length} fotos, ${p.videos.length} videos`)
    return { products: found, publicidad: ads, written: false }
  }

  const previous = await readPrevious()
  const prevItems = [...(previous?.products ?? []), ...(previous?.publicidad ?? [])]
  const prevImages = new Map(prevItems.flatMap((p) => p.images.map((i) => [i.driveId, i])))
  const prevVideos = new Map(prevItems.flatMap((p) => (p.videos ?? []).map((v) => [v.driveId, v])))
  const isFresh = (prev, file, ...srcs) =>
    prev && prev.checksum === (file.md5Checksum ?? file.modifiedTime) && srcs.every((s) => s && existsSync(path.join(ROOT, "public", s)))

  /** Baja (o reutiliza) las fotos y videos de un modelo o pieza a public/<base>/<slug>/ y devuelve sus entradas. */
  async function syncMedia(p, base) {
    const dir = path.join(ROOT, "public", base, p.slug)
    await mkdir(dir, { recursive: true })
    const images = []
    for (const [i, file] of p.images.slice(0, maxImages).entries()) {
      const prev = prevImages.get(file.id)
      const reuse = isFresh(prev, file, prev?.src)
      let src = prev?.src
      if (!reuse) {
        const { bytes, ext } = await drive.download(file)
        // Nombre por ID de Drive: estable aunque cambie el orden (no pisa fotos reutilizadas).
        const name = `${file.id}.${ext}`
        await writeFile(path.join(dir, name), await optimizeImage(bytes, ext))
        src = `/${base}/${p.slug}/${name}`
        log(`   ↓ ${p.name} · ${file.name}`)
      }
      images.push({
        src,
        driveId: file.id,
        checksum: file.md5Checksum ?? file.modifiedTime,
        width: file.imageMediaMetadata?.width ?? null,
        height: file.imageMediaMetadata?.height ?? null,
        alt: isCover(file.name) ? `${p.name}, foto de portada` : `${p.name}, foto ${i + 1}`,
        file: file.name,
        cover: isCover(file.name),
      })
    }
    const videos = []
    for (const file of p.videos.slice(0, maxVideos)) {
      const prev = prevVideos.get(file.id)
      let { src, poster } = prev ?? {}
      if (!isFresh(prev, file, src, ...(poster ? [poster] : []))) {
        const { bytes, ext } = await drive.downloadVideo(file)
        await writeFile(path.join(dir, `${file.id}.${ext}`), bytes)
        src = `/${base}/${p.slug}/${file.id}.${ext}`
        // Sin póster el video igual se muestra; Drive tarda un rato en generar la miniatura de un video nuevo.
        const still = await drive.poster(file).catch(() => null)
        poster = null
        if (still) {
          await writeFile(path.join(dir, `${file.id}.poster.jpg`), still)
          poster = `/${base}/${p.slug}/${file.id}.poster.jpg`
        }
        log(`   ↓ ${p.name} · ${file.name} (${(bytes.length / 1048576).toFixed(1)} MB)`)
      }
      videos.push({
        src,
        poster: poster ?? null,
        driveId: file.id,
        checksum: file.md5Checksum ?? file.modifiedTime,
        width: file.videoMediaMetadata?.width ?? null,
        height: file.videoMediaMetadata?.height ?? null,
        alt: `${p.name}, video`,
        file: file.name,
      })
    }
    // Borra fotos y videos viejos de este modelo que ya no forman parte de la galería.
    const keepFiles = new Set([...images, ...videos].flatMap((m) => [m.src, m.poster]).filter(Boolean).map((s) => path.basename(s)))
    for (const f of await readdir(dir)) if (!keepFiles.has(f)) await rm(path.join(dir, f), { force: true })
    return { images, videos }
  }

  const products = []
  const localDescriptions = await readLocalDescriptions()
  for (const p of found) {
    const { images, videos } = await syncMedia(p, "catalog")
    let description = null
    if (p.descriptionFileId) {
      try {
        // Sin BOM y sin líneas en blanco de más; un texto vacío cuenta como "sin descripción".
        description = (await drive.text(p.descriptionFileId)).replace(/^\uFEFF/, "").replace(/\n{3,}/g, "\n\n").trim() || null
      } catch {
        description = null
      }
    }
    description ??= localDescriptions.get(p.slug) ?? null
    products.push({ slug: p.slug, name: p.name, category: p.category, folderId: p.folderId, description, images, videos })
  }

  const publicidad = []
  for (const p of ads) {
    const { images, videos } = await syncMedia(p, "publicidad")
    publicidad.push({ slug: p.slug, name: p.name, category: p.category, folderId: p.folderId, images, videos })
  }

  // Borra carpetas de modelos y piezas que ya no están en Drive.
  const sweep = async (dirBase, current, old) => {
    const keep = new Set(current.map((p) => p.slug))
    for (const o of old) if (!keep.has(o.slug)) await rm(path.join(dirBase, o.slug), { recursive: true, force: true })
  }
  await sweep(OUT_IMG_DIR, products, previous?.products ?? [])
  await sweep(OUT_AD_DIR, publicidad, previous?.publicidad ?? [])

  const catalog = { source: "drive", folderId, folderName: rootName, syncedAt: new Date().toISOString(), products, publicidad }
  await mkdir(path.dirname(OUT_JSON), { recursive: true })
  await writeFile(OUT_JSON, JSON.stringify(catalog, null, 2) + "\n")
  log(`✓ Catálogo escrito en data/catalog.json (${products.length} modelos, ${publicidad.length} piezas de publicidad).`)
  return { products, publicidad, written: true }
}

/* ───────── CLI ───────── */

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) {
  const optional = process.argv.includes("--optional")
  const dryRun = process.argv.includes("--dry-run")
  sync({ dryRun }).catch((err) => {
    if (optional) {
      console.warn(`⚠ Sincronización de Drive omitida: ${err.message.split("\n")[0]}`)
      console.warn("  El sitio usa el último data/catalog.json guardado (o el catálogo de demostración).")
      process.exit(0)
    }
    console.error(`✗ ${err.message}`)
    process.exit(1)
  })
}
