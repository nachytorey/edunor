/**
 * Achica las fotos que sirve el sitio: endereza según EXIF, limita el ancho y recomprime.
 * Lo usa sync-drive.mjs al bajar cada foto, y se puede correr a mano sobre lo que ya está en public/:
 *
 *   node scripts/optimize-images.mjs                 # public/catalog y public/palatine
 *   node scripts/optimize-images.mjs public/otra     # otra carpeta
 *
 * Mantiene nombre y extensión (las rutas de data/catalog.json no cambian) y solo pisa el archivo
 * si el resultado pesa menos. sharp viene con Next; si no está, no hace nada.
 */
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const MAX_WIDTH = 1800
const QUALITY = 78
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i

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

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (IMAGE_EXT.test(entry.name)) yield full
  }
}

async function main(dirs) {
  let before = 0
  let after = 0
  for (const dir of dirs) {
    for await (const file of walk(dir)) {
      const bytes = await readFile(file)
      const out = await optimizeImage(bytes, path.extname(file).slice(1))
      before += bytes.length
      after += out.length
      if (out !== bytes) await writeFile(file, out)
    }
  }
  const mb = (n) => (n / 1048576).toFixed(1)
  console.log(`→ ${mb(before)} MB → ${mb(after)} MB`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  await main(args.length ? args : ["public/catalog", "public/palatine"])
}
