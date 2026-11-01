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

/** Alto de una fila de la grilla en px (ver .pal-vgrid). Cuanto más chico, más fino encaja cada video. */
const ROW = 8

/**
 * Mosaico de videos: una grilla de 12 columnas con empaquetado denso. El ancho de cada tarjeta lo da
 * un ciclo de spans en el CSS (unas grandes, otras chicas) y el alto sale de la proporción real del
 * video (los hay 9:16 y apaisados), traducida a filas de ROW px. Así no quedan recortes ni huecos.
 * Arrancan solos, mudos y en loop, cuando están casi enteros en pantalla, y se pausan al salir.
 * El botón de cada tarjeta prende o apaga el sonido. Con "reducir movimiento" se reproducen al tocar.
 * Sin JS la grilla igual se ve: columnas variables y filas automáticas (sin masonry).
 */
export function VideoReel({ videos, label }: { videos: ReelVideo[]; label: string }) {
  const grid = useRef<HTMLDivElement>(null)
  const [loud, setLoud] = useState<string | null>(null)

  /** Cada tarjeta ocupa tantas filas como su alto real pida para el ancho que le tocó. */
  const layout = useCallback(() => {
    const root = grid.current
    if (!root) return
    const gap = parseFloat(getComputedStyle(root).rowGap) || 0
    root.querySelectorAll<HTMLElement>(".pal-vgrid__card").forEach((card) => {
      const ratio = Number(card.dataset.ratio) || 1
      const height = card.clientWidth / ratio
      card.style.gridRowEnd = `span ${Math.max(1, Math.round((height + gap) / (ROW + gap)))}`
    })
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
            preload="metadata"
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
