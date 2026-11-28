"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type ReelVideo = {
  src: string
  poster: string
  /** ancho / alto del video (sale del póster en el build). */
  ratio: number
  name: string
  kind: string
  ficha: string
  /** Texto del enlace de la tarjeta; por defecto "ver ficha". */
  cta?: string
}

/** Alto ideal de una fila según el ancho disponible: ~45% del ancho, nunca menos de 260px. */
const targetHeight = (width: number) => Math.max(260, width * 0.45)

/**
 * Parte la lista (en orden) en filas justificadas: cada fila tiene un alto H tal que sus videos, a su
 * proporción real, llenan EXACTO el ancho (H = (ancho - huecos) / suma de proporciones). Entre todas las
 * particiones posibles elige, por programación dinámica, la que deja los altos más cerca del ideal.
 * Devuelve el alto de cada fila y qué índices van en cada una.
 */
function justify(ratios: number[], width: number, gap: number) {
  const n = ratios.length
  const target = targetHeight(width)
  const heightOf = (i: number, j: number) => {
    let sum = 0
    for (let k = i; k < j; k++) sum += ratios[k]
    return (width - gap * (j - i - 1)) / sum
  }
  // best[j] = menor costo para acomodar los primeros j videos; from[j] = dónde empieza su última fila.
  const best = new Array<number>(n + 1).fill(Infinity)
  const from = new Array<number>(n + 1).fill(0)
  best[0] = 0
  for (let j = 1; j <= n; j++) {
    for (let i = j - 1; i >= 0; i--) {
      const h = heightOf(i, j)
      if (h < target / 3) break // fila demasiado cargada: agregar más solo empeora
      const cost = best[i] + (h - target) ** 2
      if (cost < best[j]) {
        best[j] = cost
        from[j] = i
      }
    }
  }
  const rows: { start: number; end: number; height: number }[] = []
  for (let j = n; j > 0; j = from[j]) rows.unshift({ start: from[j], end: j, height: heightOf(from[j], j) })
  return rows
}

/**
 * Mosaico de videos en filas justificadas (como un álbum de fotos): en cada fila todos los videos tienen
 * el mismo alto y entre todos ocupan el ancho exacto, así que no queda NINGÚN espacio en blanco, sin
 * recortar los videos (cada tarjeta respeta la proporción real, 9:16 o apaisada). Ver justify().
 * Arrancan solos, mudos y en loop, cuando están casi enteros en pantalla, y se pausan al salir.
 * El botón de cada tarjeta prende o apaga el sonido. Con "reducir movimiento" se reproducen al tocar.
 * Sin JS la grilla igual se ve, como una grilla simple de columnas iguales.
 */
export function VideoReel({ videos, label }: { videos: ReelVideo[]; label: string }) {
  const grid = useRef<HTMLDivElement>(null)
  const [loud, setLoud] = useState<string | null>(null)

  /**
   * Arma las filas justificadas con el ancho actual y le da a cada tarjeta su alto (el de su fila) y su
   * ancho (flex-basis), más flex-grow = proporción para que el redondeo de píxeles nunca deje una rendija.
   * Se repite en cada cambio de tamaño (ResizeObserver).
   */
  const layout = useCallback(() => {
    const root = grid.current
    if (!root) return
    const style = getComputedStyle(root)
    const gap = parseFloat(style.columnGap) || 0
    // Ancho real con decimales (clientWidth redondea y puede pasarse), menos medio píxel de margen:
    // si la fila calculada se pasa aunque sea un pelo, el último video salta de línea.
    const width = root.getBoundingClientRect().width - 0.5
    if (!width) return
    const cards = [...root.querySelectorAll<HTMLElement>(".pal-vgrid__card")]
    const ratios = cards.map((c) => Number(c.dataset.ratio) || 1)
    for (const row of justify(ratios, width, gap)) {
      for (let k = row.start; k < row.end; k++) {
        const card = cards[k]
        card.style.height = `${row.height}px`
        // Base = ancho justo (un pelo menos, por el redondeo): la fila queda llena y la siguiente tarjeta
        // ya no entra, así que baja sola. flex-grow reparte ese pelo y no queda rendija.
        card.style.flex = `${ratios[k]} 1 ${Math.max(0, Math.floor(ratios[k] * row.height * 100) / 100 - 0.05)}px`
        card.classList.toggle("is-small", ratios[k] * row.height < 200)
      }
    }
    root.classList.add("is-ready")
  }, [])

  useEffect(() => {
    const root = grid.current
    if (!root) return
    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(root)
    return () => ro.disconnect()
  }, [layout, videos])

  useEffect(() => {
    const root = grid.current
    if (!root) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement
          if (e.intersectionRatio >= 0.6) v.play().catch(() => {})
          else v.pause()
        }
      },
      { threshold: [0, 0.6] },
    )
    root.querySelectorAll("video").forEach((v) => io.observe(v))
    return () => io.disconnect()
  }, [videos])

  const toggleSound = (src: string) => {
    const next = loud === src ? null : src
    setLoud(next)
    grid.current?.querySelectorAll("video").forEach((v) => {
      v.muted = v.dataset.src !== next
      if (v.dataset.src === next) v.play().catch(() => {})
    })
  }

  return (
    <div ref={grid} className="pal-vgrid" role="region" aria-label={label}>
      {videos.map((v) => (
        <figure key={v.src} className="pal-vgrid__card" data-ratio={v.ratio} style={{ aspectRatio: String(v.ratio) }}>
          <video
            data-src={v.src}
            src={v.src}
            poster={v.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={`Video de ${v.kind} ${v.name}`}
            onClick={(e) => {
              const el = e.currentTarget
              if (el.paused) el.play().catch(() => {})
              else el.pause()
            }}
          />
          <button
            type="button"
            className={`pal-vgrid__sound${loud === v.src ? " is-on" : ""}`}
            aria-pressed={loud === v.src}
            aria-label={loud === v.src ? "Silenciar" : "Activar sonido"}
            onClick={() => toggleSound(v.src)}
          >
            <span aria-hidden="true">{loud === v.src ? "sonido" : "mudo"}</span>
          </button>
          <figcaption className="pal-vgrid__caption">
            <a href={v.ficha}>
              <strong>{v.name}</strong>
              <span>{v.cta ?? "ver ficha"}</span>
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
