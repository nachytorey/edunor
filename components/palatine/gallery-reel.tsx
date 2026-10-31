"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal, flushSync } from "react-dom"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Anchor, Fish, Gull, Starfish, Triangle, Waves } from "@/components/palatine/ornaments"

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip)

export type ReelPhoto = {
  src: string
  alt: string
  name: string
  kind: string
  href: string
}

/** Tamaños que se van alternando para que la cinta no sea una cuadrícula. */
const SHAPES = ["tall", "wide", "square", "wide", "tall", "square"] as const
/** Altura de cada foto dentro de la cinta (arriba, abajo, al medio…). */
const LIFT = ["-8vh", "9vh", "-2vh", "-11vh", "6vh", "-4vh"]
const ORNAMENTS = [Fish, Starfish, Waves, Anchor, Gull]
const pad = (n: number) => String(n).padStart(2, "0")

/**
 * Galería de la portada: una cinta horizontal que se fija en pantalla y avanza con el scroll.
 * - Cada foto entra con una cortina (clip-path) y un leve giro; adentro del marco, la foto se
 *   desplaza más lento que la cinta (paralaje). Los grabados flotan a otra velocidad.
 * - Click en una foto: se agranda desde su lugar a pantalla completa (Flip), con flechas,
 *   teclado y Escape. Al cerrar vuelve a su lugar.
 * Con "reducir movimiento" la cinta es un scroll horizontal común, sin efectos.
 */
export function GalleryReel({ photos }: { photos: ReelPhoto[] }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const frames = useRef<HTMLButtonElement[]>([])
  const box = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  /** Proporción real de la foto abierta: el visor la respeta para que el Flip no deforme. */
  const [ratio, setRatio] = useState(1.5)
  const openRef = useRef<number | null>(null)
  const busy = useRef(false)
  /** El visor se monta directo en .pal-page: adentro de <main> (z-index 1) quedaría debajo del menú. */
  const [host, setHost] = useState<Element | null>(null)
  useEffect(() => setHost(root.current?.closest(".pal-page") ?? document.body), [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const strip = track.current!
        const distance = () => Math.max(0, strip.scrollWidth - window.innerWidth)

        const scroll = gsap.to(strip, {
          x: () => -distance(),
          ease: "none", // obligatorio con containerAnimation: scroll y posición 1 a 1
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        })

        gsap.utils.toArray<HTMLElement>(".pal-reel__item", root.current).forEach((item, n) => {
          const along = { trigger: item, containerAnimation: scroll }
          gsap.fromTo(
            item.querySelector(".pal-reel__reveal"),
            {
              clipPath: "inset(-12% -12% -12% 112%)",
              rotation: n % 2 ? -5 : 5,
            },
            {
              clipPath: "inset(-12% -12% -12% -12%)",
              rotation: n % 2 ? 1.5 : -1.5,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: {
                ...along,
                start: "left 92%",
                toggleActions: "play none none reverse",
              },
            },
          )
          gsap.fromTo(
            item.querySelector("img"),
            { xPercent: -9 },
            {
              xPercent: 9,
              ease: "none",
              scrollTrigger: {
                ...along,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          )
          const ornament = item.querySelector(".pal-reel__ornament")
          if (ornament) {
            gsap.fromTo(
              ornament,
              { y: 60, rotation: -12 },
              {
                y: -80,
                rotation: 14,
                ease: "none",
                scrollTrigger: {
                  ...along,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            )
          }
        })
      })
      // Las fotos tienen el tamaño fijado por CSS; igual se recalcula cuando terminan de cargar.
      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener("load", refresh)
      return () => window.removeEventListener("load", refresh)
    },
    { scope: root },
  )

  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches
  const ratioOf = (n: number) => {
    const img = frames.current[n]?.querySelector("img")
    return img?.naturalWidth ? img.naturalWidth / img.naturalHeight : 1.5
  }

  /** Abre la foto n creciendo desde su marco (Flip entre elementos con el mismo data-flip-id). */
  function show(n: number) {
    if (busy.current) return
    busy.current = true
    const state = Flip.getState(frames.current[n])
    openRef.current = n
    flushSync(() => {
      setRatio(ratioOf(n))
      setOpen(n)
    })
    gsap.set(frames.current[n], { autoAlpha: 0 })
    Flip.from(state, {
      targets: box.current,
      duration: reduced() ? 0 : 0.85,
      ease: "power3.inOut",
      onComplete: () => {
        busy.current = false
      },
    })
    gsap.fromTo(".pal-lightbox__veil", { autoAlpha: 0 }, { autoAlpha: 1, duration: reduced() ? 0 : 0.5 })
    gsap.fromTo(".pal-lightbox__ui", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: reduced() ? 0 : 0.5 })
  }

  /** Cierra volviendo al marco de la foto que se está viendo (si está a la vista; si no, se desvanece). */
  function hide() {
    const n = openRef.current
    if (n === null || busy.current) return
    busy.current = true
    const frame = frames.current[n]
    const r = frame.getBoundingClientRect()
    const visible = r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight
    const done = () => {
      gsap.set(frame, { autoAlpha: 1 })
      busy.current = false
      openRef.current = null
      setOpen(null)
      frame.focus({ preventScroll: true })
    }
    gsap.to(".pal-lightbox__ui, .pal-lightbox__veil", {
      autoAlpha: 0,
      duration: reduced() ? 0 : 0.35,
    })
    if (!visible || reduced()) {
      gsap.to(box.current, {
        autoAlpha: 0,
        scale: 0.94,
        duration: reduced() ? 0 : 0.4,
        onComplete: done,
      })
      return
    }
    const state = Flip.getState(box.current)
    gsap.set(frame, { autoAlpha: 1 })
    Flip.from(state, {
      targets: frame,
      duration: 0.75,
      ease: "power3.inOut",
      onComplete: done,
    })
    gsap.to(box.current, { autoAlpha: 0, duration: 0.2, delay: 0.55 })
  }

  /** Pasa de foto adentro del visor con un fundido corto. */
  function step(dir: 1 | -1) {
    const n = openRef.current
    if (n === null || busy.current) return
    const next = (n + dir + photos.length) % photos.length
    busy.current = true
    gsap.to(box.current, {
      autoAlpha: 0,
      x: -40 * dir,
      duration: reduced() ? 0 : 0.25,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(frames.current[n], { autoAlpha: 1 })
        gsap.set(frames.current[next], { autoAlpha: 0 })
        openRef.current = next
        flushSync(() => {
          setRatio(ratioOf(next))
          setOpen(next)
        })
        gsap.fromTo(
          box.current,
          { autoAlpha: 0, x: 40 * dir },
          {
            autoAlpha: 1,
            x: 0,
            duration: reduced() ? 0 : 0.45,
            ease: "power3.out",
            onComplete: () => void (busy.current = false),
          },
        )
      },
    })
  }

  // Con el visor abierto: teclado y la página de atrás quieta.
  useEffect(() => {
    if (open === null) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide()
      else if (e.key === "ArrowRight") step(1)
      else if (e.key === "ArrowLeft") step(-1)
    }
    document.addEventListener("keydown", onKey)
    return () => {
      html.style.overflow = prev
      document.removeEventListener("keydown", onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open === null])

  const current = open === null ? null : photos[open]

  return (
    <div ref={root} className="pal-reel">
      <ul ref={track} className="pal-reel__track">
        {photos.map((p, n) => {
          const Ornament = n % 2 === 0 ? ORNAMENTS[(n / 2) % ORNAMENTS.length] : null
          return (
            <li
              key={p.src}
              className={`pal-reel__item pal-reel__item--${SHAPES[n % SHAPES.length]}`}
              style={{ translate: `0 ${LIFT[n % LIFT.length]}` }}
            >
              {Ornament && <Ornament className="pal-reel__ornament" />}
              <div className="pal-reel__reveal">
                <button
                  type="button"
                  ref={(el) => {
                    if (el) frames.current[n] = el
                  }}
                  className="pal-reel__frame"
                  data-flip-id={`reel-${n}`}
                  onClick={() => show(n)}
                  aria-label={`Ampliar foto: ${p.alt}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.alt} loading="lazy" draggable={false} />
                </button>
                <p className="pal-reel__caption">
                  <span>{pad(n + 1)}</span> {p.name}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="pal-reel__progress" aria-hidden="true">
        <span ref={bar} />
      </div>

      {current &&
        host &&
        createPortal(
          <div className="pal-lightbox" role="dialog" aria-modal="true" aria-label={`Foto de ${current.name}`}>
            <div className="pal-lightbox__veil" onClick={hide} />
            <div
              ref={box}
              className="pal-lightbox__photo"
              data-flip-id={`reel-${open}`}
              style={{
                aspectRatio: ratio,
                width: `min(90vw, calc(76svh * ${ratio}))`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.src} alt={current.alt} />
            </div>
            <div className="pal-lightbox__ui">
              <p className="pal-lightbox__caption">
                <span>
                  {pad(open! + 1)} / {pad(photos.length)}
                </span>
                <strong>{current.name}</strong> {current.kind}
                <a href={current.href}>Ver el modelo</a>
              </p>
              <button
                type="button"
                className="pal-lightbox__arrow pal-lightbox__arrow--prev"
                onClick={() => step(-1)}
                aria-label="Foto anterior"
              >
                <Triangle />
              </button>
              <button
                type="button"
                className="pal-lightbox__arrow pal-lightbox__arrow--next"
                onClick={() => step(1)}
                aria-label="Foto siguiente"
              >
                <Triangle />
              </button>
              <button type="button" className="pal-lightbox__close" onClick={hide} aria-label="Cerrar" autoFocus>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>,
          host,
        )}
    </div>
  )
}
