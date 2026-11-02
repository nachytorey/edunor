/**
 * Genera las variantes responsive de la foto del hero (la imagen LCP de la portada).
 * De public/palatine/portada.webp salen portada-640.webp, portada-1024.webp y portada-1400.webp;
 * la original (1672px) queda para pantallas grandes. Usa el sharp que trae Next.
 *
 *   node scripts/hero-variants.mjs
 */
import path from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const sharp = require("sharp")

const dir = path.join(process.cwd(), "public", "palatine")
const src = path.join(dir, "portada.webp")

for (const width of [640, 1024, 1400]) {
  const out = path.join(dir, `portada-${width}.webp`)
  const info = await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out)
  console.log(`${path.basename(out)}: ${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB`)
}
