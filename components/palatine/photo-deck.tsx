"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Triangle } from "@/components/palatine/ornaments"

gsap.registerPlugin(useGSAP)

export type DeckPhoto = { href: string; src: string; alt: string; name: string }

/** Las fotos de Drive están sacadas de lejos: arrancan ampliadas y siguen acercándose mientras están arriba. */
const ZOOM = 1.45
const DRIFT = 1.16
/** Giro de cada foto en la pila, para que parezcan copias sueltas sobre la mesa. */
const TILT = [-4, 3, -1.5, 5, -3, 2]
const pad = (n: number) => String(n).padStart(2, "0")

/**
 * Pila de fotos sueltas: una por modelo. La de arriba sale volando hacia un costado
 * y vuelve al fondo de la pila; la que queda arriba se va acercando despacio (GSAP).
 * Avanza sola cada `autoplay` ms (pausa con el puntero encima o con foco adentro),
 * con flechas, teclado o arrastrando. Con "reducir movimiento" cambia sin animación.
 */
export function PhotoDeck({ photos, label, autoplay = 5000 }: { photos: DeckPhoto[]; label: string; autoplay?: number }) {
  const root = useRef<HTMLDivElement>(null)
  const cards = useRef<HTMLAnchorElement[]>([])
  const order = useRef(photos.map((_, n) => n))
  const busy = useRef(false)
  const reduced = useRef(false)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)
  const [top, setTop] = useState(0)
  const [paused, setPaused] = useState(false)
  const many = photos.length > 1
  const t = (d: number) => (reduced.current ? 0 : d)

  /** Acomoda la pila según `order`: la primera arriba, las demás un poco corridas y más chicas. */
  function layout(d = 0.8) {
    order.current.forEach((idx, pos) => {
      const depth = Math.min(pos, 3)
      gsap.to(cards.current[idx], {
        zIndex: photos.length - pos,
        x: depth * 14,
        xPercent: 0,
        y: depth * -10,
        rotation: TILT[idx % TILT.length],
        scale: 1 - depth * 0.04,
        autoAlpha: pos > 3 ? 0 : 1,
        duration: t(d),
        ease: "power3.out",
        overwrite: "auto",
      })
    })
  }

  /** Acercamiento lento de la foto de arriba; las demás vuelven al zoom de base. */
  function drift() {
    order.current.forEach((idx, pos) => {
      const img = cards.current[idx]?.querySelector("img")
      if (!img) return
      if (pos === 0 && !reduced.current) {
        gsap.fromTo(img, { scale: ZOOM }, { scale: ZOOM * DRIFT, duration: autoplay / 1000 + 1.5, ease: "none", overwrite: true })
      } else gsap.to(img, { scale: ZOOM, duration: t(0.6), overwrite: true })
    })
  }

  const { contextSafe } = useGSAP(
    () => {
      reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches
      layout(0)
      drift()
    },
    { scope: root },
  )

  const go = contextSafe((dir: 1 | -1) => {
    if (!many || busy.current) return
    busy.current = true
    const done = () => {
      busy.current = false
      setTop(order.current[0])
      drift()
    }
    if (dir === 1) {
      // La de arriba sale volando a la derecha y vuelve al fondo de la pila.
      const leaving = order.current[0]
      gsap.to(cards.current[leaving], {
        xPercent: 115,
        y: -30,
        rotation: 16,
        duration: t(0.5),
        ease: "power2.in",
        onComplete: () => {
          order.current = [...order.current.slice(1), leaving]
          gsap.set(cards.current[leaving], { zIndex: 0 })
          layout()
          gsap.delayedCall(t(0.45), done)
        },
      })
    } else {
      // La del fondo entra desde la izquierda y se apoya arriba.
      const coming = order.current[order.current.length - 1]
      order.current = [coming, ...order.current.slice(0, -1)]
      gsap.set(cards.current[coming], { zIndex: photos.length + 1, xPercent: -115, y: -30, rotation: -16, autoAlpha: 1 })
      layout(0.7)
      gsap.delayedCall(t(0.6), done)
    }
  })

  useEffect(() => {
    if (!many || paused || reduced.current) return
    const timer = window.setTimeout(() => go(1), autoplay)
    return () => window.clearTimeout(timer)
  }, [many, paused, top, autoplay, go])

  /* ── Arrastre: más de 50px pasa de foto (y ese gesto no abre la ficha) ── */
  const onPointerDown = (e: PointerEvent) => {
    drag.current = { x: e.clientX, moved: false }
  }
  const onPointerUp = (e: PointerEvent) => {
    const g = drag.current
    if (!g) return
    const dx = e.clientX - g.x
    if (Math.abs(dx) > 50) {
      g.moved = true
      go(dx < 0 ? 1 : -1)
    }
  }

  const current = photos[top]

  return (
    <div
      ref={root}
      className="pal-deck"
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1)
        else if (e.key === "ArrowLeft") go(-1)
      }}
    >
      <div className="pal-deck__table" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {photos.map((p, n) => (
          <a
            key={p.href}
            ref={(el) => {
              if (el) cards.current[n] = el
            }}
            href={p.href}
            className="pal-deck__photo"
            aria-hidden={n !== top}
            tabIndex={n === top ? 0 : -1}
            draggable={false}
            onClickCapture={(e) => {
              if (drag.current?.moved) e.preventDefault()
              drag.current = null
            }}
          >
            <span className="pal-deck__print">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} loading="lazy" draggable={false} />
            </span>
            <span className="pal-deck__caption">{p.name}</span>
          </a>
        ))}
      </div>

      {many && (
        <div className="pal-deck__bar">
          <button type="button" className="pal-deck__arrow pal-deck__arrow--prev" onClick={() => go(-1)} aria-label="Foto anterior">
            <Triangle />
          </button>
          <p className="pal-deck__count" aria-live="polite">
            <strong>{pad(top + 1)}</strong> / {pad(photos.length)}
            <span className="pal-sr"> — {current?.name}</span>
          </p>
          <button type="button" className="pal-deck__arrow" onClick={() => go(1)} aria-label="Foto siguiente">
            <Triangle />
          </button>
        </div>
      )}
    </div>
  )
}
