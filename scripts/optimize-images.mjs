/**
 * Achica las fotos que sirve el sitio: endereza según EXIF, limita el ancho y recomprime. Además deja,
 * al lado de cada foto, sus variantes responsive en WebP (<nombre>.w480.webp, .w960.webp, …) para el
 * srcset: el celular baja la de 480px en vez del JPEG de 1600px.
 * Lo usa sync-drive.mjs al bajar cada foto, y se puede correr a mano sobre lo que ya está en public/:
 *
 *   node scripts/optimize-images.mjs                 # public/catalog y public/publicidad
 *   node scripts/optimize-images.mjs public/otra     # otra carpeta
 *
 * Mantiene nombre y extensión del original (las rutas de data/catalog.json no cambian) y solo lo pisa
 * si el resultado pesa menos. Las variantes que faltan se generan; las que ya están, se dejan.
 * lib/image-dims.ts (imageSrcSet) las encuentra por nombre y suma el original como candidato más grande. sharp viene con Next; si no está, no hace nada.
 */
import { existsSync } from "node:fs"
import { readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const MAX_WIDTH = 1800
/**
 * Anchos de las variantes WebP: se generan solo las menores que el original. El original (JPEG mozjpeg,
 * hasta 1800px) cierra el srcset con su ancho real: un WebP del mismo tamaño pesa casi lo mismo y no vale el archivo extra.
 */
export const WIDTHS = [480, 960, 1440]
const QUALITY = 78
const WEBP_QUALITY = 74
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i
/** Variante generada: <stem>.w<ancho>.webp (mismo patrón en lib/image-dims.ts). */
export const VARIANT_RE = /^(.+)\.w(\d+)\.webp$/
/** Pósters de video (<id>.poster.jpg): van en el atributo poster, que no tiene srcset. */
const POSTER_RE = /\.poster\.jpe?g$/i

/** Foto original (no una variante ni un póster): la que recibe variantes. */
export const isSourceImage = (name) => IMAGE_EXT.test(name) && !VARIANT_RE.test(name) && !POSTER_RE.test(name)

const stemOf = (file) => path.basename(file).replace(/\.[^.]+$/, "")
/** Ruta de la variante de `file` para un ancho: foto.jpg → foto.w480.webp */
export const variantPath = (file, width) => path.join(path.dirname(file), `${stemOf(file)}.w${width}.webp`)

let sharpPromise
const loadSharp = () => (sharpPromise ??= import("sharp").then((m) => m.default).catch(() => null))

/** Devuelve los bytes optimizados en el mismo formato, o los originales si no se gana nada. */
export async function optimizeImage(bytes, ext) {
  const sharp = await loadSharp()
  if (!sharp) return bytes
  try {
    const img = sharp(bytes).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true })
    const format = ext.toLowerCase().replace("jpeg", "jpg")
    const out =
      format === "png"
        ? await img.png({ compressionLevel: 9 }).toBuffer()
        : format === "webp"
          ? await img.webp({ quality: QUALITY }).toBuffer()
          : await img.jpeg({ quality: QUALITY, mozjpeg: true, progressive: true }).toBuffer()
    return out.length < bytes.length ? out : bytes
  } catch {
    return bytes
  }
}

/** Ancho real de la foto, ya enderezada según EXIF (orientación 5–8: lados cambiados). */
async function pixelWidth(sharp, bytes) {
  const { width = 0, height = 0, orientation } = await sharp(bytes).metadata()
  return orientation && orientation >= 5 ? height : width
}

/** Borra las variantes de una foto (antes de regenerarlas, para no dejar una de un ancho viejo). */
export async function removeVariants(file) {
  const stem = stemOf(file)
  for (const f of await readdir(path.dirname(file)).catch(() => [])) {
    const m = f.match(VARIANT_RE)
    if (m && m[1] === stem) await rm(path.join(path.dirname(file), f), { force: true })
  }
}

/**
 * Escribe las variantes WebP de una foto. Con `force` las regenera aunque existan (la foto cambió);
 * si no, solo completa las que faltan. Devuelve los anchos disponibles.
 */
export async function writeVariants(file, bytes, { force = false } = {}) {
  const sharp = await loadSharp()
  if (!sharp || !isSourceImage(path.basename(file))) return []
  try {
    bytes ??= await readFile(file)
    const full = await pixelWidth(sharp, bytes)
    if (!full) return []
    if (force) await removeVariants(file)
    const widths = WIDTHS.filter((w) => w < full)
    for (const w of widths) {
      const out = variantPath(file, w)
      if (existsSync(out)) continue
      await writeFile(out, await sharp(bytes).rotate().resize({ width: w }).webp({ quality: WEBP_QUALITY }).toBuffer())
    }
    return widths
  } catch {
    return []
  }
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (isSourceImage(entry.name)) yield full
  }
}

/** Completa las variantes que falten en estas carpetas (fotos reutilizadas por el sync, repos recién clonados). */
export async function ensureVariants(dirs) {
  let n = 0
  for (const dir of dirs) for await (const file of walk(dir)) n += (await writeVariants(file)).length
  return n
}

async function main(dirs) {
  let before = 0
  let after = 0
  let variants = 0
  for (const dir of dirs) {
    for await (const file of walk(dir)) {
      const bytes = await readFile(file)
      const out = await optimizeImage(bytes, path.extname(file).slice(1))
      before += bytes.length
      after += out.length
      if (out !== bytes) await writeFile(file, out)
      variants += (await writeVariants(file, out, { force: out !== bytes })).length
    }
  }
  const mb = (n) => (n / 1048576).toFixed(1)
  console.log(`→ originales: ${mb(before)} MB → ${mb(after)} MB · ${variants} variantes WebP`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  await main(args.length ? args : ["public/catalog", "public/publicidad"])
}
