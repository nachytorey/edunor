"use client"

import { useEffect, useRef, useState } from "react"
import { Triangle } from "@/components/palatine/ornaments"

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

/**
 * Cinta horizontal de videos del catálogo. Cada uno tiene la altura de la fila y el ancho de su proporción
 * (los hay apaisados y verticales). Arrancan solos, mudos y en loop, cuando están casi enteros en pantalla,
 * y se pausan al salir. El botón de cada tarjeta prende o apaga el sonido. Con "reducir movimiento" no
 * arrancan solos: se reproducen al tocar.
 */
export function VideoReel({ videos, label }: { videos: ReelVideo[]; label: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [loud, setLoud] = useState<string | null>(null)

  useEffect(() => {
    const root = track.current
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
    track.current?.querySelectorAll("video").forEach((v) => {
      v.muted = v.dataset.src !== next
      if (v.dataset.src === next) v.play().catch(() => {})
    })
  }

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" })
  }

  return (
    <div className="pal-reel">
      <div ref={track} className="pal-reel__track" role="region" aria-label={label} tabIndex={0}>
        {videos.map((v) => (
          <figure key={v.src} className="pal-reel__card" style={{ aspectRatio: String(v.ratio) }}>
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
              className={`pal-reel__sound${loud === v.src ? " is-on" : ""}`}
              aria-pressed={loud === v.src}
              aria-label={loud === v.src ? "Silenciar" : "Activar sonido"}
              onClick={() => toggleSound(v.src)}
            >
              <span aria-hidden="true">{loud === v.src ? "sonido" : "mudo"}</span>
            </button>
            <figcaption className="pal-reel__caption">
              <a href={v.ficha}>
                <strong>{v.name}</strong>
                <span>{v.cta ?? "ver ficha"}</span>
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
      {videos.length > 1 && (
        <div className="pal-reel__bar">
          <button type="button" className="pal-reel__arrow pal-reel__arrow--prev" aria-label="Videos anteriores" onClick={() => scrollBy(-1)}>
            <Triangle />
          </button>
          <button type="button" className="pal-reel__arrow" aria-label="Videos siguientes" onClick={() => scrollBy(1)}>
            <Triangle />
          </button>
        </div>
      )}
    </div>
  )
}
