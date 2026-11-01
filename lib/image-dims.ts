import { readFileSync } from "node:fs"
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
