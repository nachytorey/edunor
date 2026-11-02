import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { imageSize } from "image-size"

/** Ancho y alto de una imagen de /public, leídos del archivo al renderizar (en el build). */
export function imageDims(src: string): { width: number; height: number } | null {
  try {
    const { width, height, orientation } = imageSize(readFileSync(path.join(process.cwd(), "public", src)))
    if (!width || !height) return null
    // EXIF 5–8: la foto está girada 90°, el navegador la muestra con los lados cambiados.
    return orientation && orientation >= 5 ? { width: height, height: width } : { width, height }
  } catch {
    return null
  }
}

/** Variante responsive que deja scripts/optimize-images.mjs junto a cada foto: <stem>.w<ancho>.webp */
const VARIANT_RE = /^(.+)\.w(\d+)\.webp$/

/** Listado de cada carpeta de /public, una sola vez por proceso (se consulta por cada foto del catálogo). */
const dirCache = new Map<string, string[]>()
function listPublicDir(dir: string): string[] {
  let files = dirCache.get(dir)
  if (!files) {
    try {
      files = readdirSync(path.join(process.cwd(), "public", dir))
    } catch {
      files = []
    }
    dirCache.set(dir, files)
  }
  return files
}

/**
 * `srcset` de una foto de /public: sus variantes WebP ("/catalog/x/foto.w480.webp 480w, …") de menor a mayor
 * y, al final, la foto original con su ancho real (es la más grande; un WebP de ese tamaño no ahorraría nada).
 * Sin variantes devuelve undefined y el <img> se queda con su `src`. En desarrollo, si las variantes se generan
 * con el servidor levantado, hay que reiniciarlo (el listado se cachea).
 */
export function imageSrcSet(src: string): string | undefined {
  const clean = src.split(/[?#]/)[0]
  const dir = path.posix.dirname(clean)
  const stem = path.posix.basename(clean).replace(/\.[^.]+$/, "")
  const variants = listPublicDir(dir)
    .flatMap((file) => {
      const m = file.match(VARIANT_RE)
      return m && m[1] === stem ? [{ file, width: Number(m[2]) }] : []
    })
    .sort((a, b) => a.width - b.width)
  if (!variants.length) return undefined
  const full = imageDims(clean)
  const candidates = variants.map((v) => `${dir}/${v.file} ${v.width}w`)
  if (full && full.width > variants[variants.length - 1].width) candidates.push(`${clean} ${full.width}w`)
  return candidates.join(", ")
}
