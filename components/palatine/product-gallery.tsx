"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react"
import { flushSync } from "react-dom"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { useGSAP } from "@gsap/react"
import type { CatalogImage } from "@/lib/catalog"

gsap.registerPlugin(useGSAP, Flip)

const MAX = 5
const STEP = 1.6
const DOUBLE = 2.5

type View = { s: number; x: number; y: number }
type Gesture =
  | { kind: "pan" | "swipe"; sx: number; sy: number; vx: number; vy: number; moved: boolean }
  | { kind: "pinch"; dist: number; s0: number }

const clamp = (min: number, max: number, v: number) => Math.min(max, Math.max(min, v))
const pad = (n: number) => String(n).padStart(2, "0")

/**
 * Galería de la ficha de producto.
 * - Carrusel: las fotos se funden con un leve desenfoque y deriva lateral (GSAP).
 * - Zoom: botones, rueda (con Ctrl o ya ampliada), pellizco, doble click/toque.
 *   Ampliada, se arrastra para recorrerla y un mini-mapa marca qué parte se ve.
 * - Pantalla completa con Flip: el mismo visor se expande sin cortar la transición.
 * - Videos: son una diapositiva más, en 9:16 con marco entintado; arrancan solos y mudos, con sus controles nativos y sin zoom.
 * Con "reducir movimiento" todo cambia al instante.
 */
export function ProductGallery({ images, name }: { images: CatalogImage[]; name: string }) {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const slides = useRef<HTMLDivElement[]>([])
  const layers = useRef<HTMLDivElement[]>([])
  const thumbs = useRef<HTMLButtonElement[]>([])
  const marker = useRef<HTMLSpanElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const mapRect = useRef<HTMLSpanElement>(null)

  const view = useRef<View>({ s: 1, x: 0, y: 0 })
  const current = useRef(0)
  const reduced = useRef(false)
  const fullRef = useRef(false)
  const points = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<Gesture | null>(null)
  const lastTap = useRef({ t: 0, x: 0, y: 0 })

  const [index, setIndex] = useState(0)
  const [scale, setScale] = useState(1)
  const [full, setFull] = useState(false)
  /** Proporción de la portada: el escenario la copia para que las fotos no queden con franjas. */
  const [ratio, setRatio] = useState<number | null>(null)
  const many = images.length > 1
  const t = (d: number) => (reduced.current ? 0 : d)

  /* ── Geometría: tamaño real de la foto dentro del escenario (contain a pantalla completa, cover en la ficha) ── */
  function bounds(s: number) {
    const st = stage.current!
    const W = st.clientWidth
    const H = st.clientHeight
    const img = layers.current[current.current]?.querySelector("img")
    const r = img?.naturalWidth ? img.naturalWidth / img.naturalHeight : W / H
    const fit = img && getComputedStyle(img).objectFit === "cover" ? Math.max : Math.min
    const iw = fit(W, H * r)
    const ih = fit(H, W / r)
    return { W, H, iw, ih, mx: Math.max(0, (iw * s - W) / 2), my: Math.max(0, (ih * s - H) / 2) }
  }

  /** Lleva la foto actual a escala s y desplazamiento (x, y), sin dejar bordes vacíos. */
  function apply(s: number, x: number, y: number, d = 0.55) {
    s = clamp(1, MAX, s)
    const b = bounds(s)
    x = clamp(-b.mx, b.mx, x)
    y = clamp(-b.my, b.my, y)
    view.current = { s, x, y }
    const ease = "power3.out"
    gsap.to(layers.current[current.current], { scale: s, x, y, duration: t(d), ease, overwrite: true })
    if (mapRect.current) {
      const w = Math.min(1, b.W / s / b.iw)
      const h = Math.min(1, b.H / s / b.ih)
      const l = clamp(0, 1 - w, ((-b.W / 2 - x) / s + b.iw / 2) / b.iw)
      const top = clamp(0, 1 - h, ((-b.H / 2 - y) / s + b.ih / 2) / b.ih)
      gsap.to(mapRect.current, {
        left: `${l * 100}%`,
        top: `${top * 100}%`,
        width: `${w * 100}%`,
        height: `${h * 100}%`,
        duration: t(d),
        ease,
        overwrite: true,
      })
    }
    setScale(Math.round(s * 100) / 100)
  }

  /** Zoom anclado a un punto (relativo al centro del escenario): ese punto queda quieto. */
  function zoomAt(target: number, px = 0, py = 0, d?: number) {
    const v = view.current
    const s = clamp(1, MAX, target)
    const k = s / v.s
    apply(s, px - (px - v.x) * k, py - (py - v.y) * k, d)
  }

  function local(clientX: number, clientY: number) {
    const r = stage.current!.getBoundingClientRect()
    return { x: clientX - r.left - r.width / 2, y: clientY - r.top - r.height / 2 }
  }

  function moveMarker(n: number, d = 0.7) {
    const th = thumbs.current[n]
    if (!th || !marker.current) return
    gsap.to(marker.current, { x: th.offsetLeft, width: th.offsetWidth, duration: t(d), ease: "power3.inOut", overwrite: true })
  }

  const { contextSafe } = useGSAP(
    () => {
      reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches
      if (slides.current.length > 1) gsap.set(slides.current.slice(1), { autoAlpha: 0 })
      moveMarker(0, 0)
    },
    { scope: root },
  )

  /* ── Carrusel: fundido tenue con desenfoque y una deriva corta en la dirección del cambio ── */
  const go = contextSafe((target: number, dir?: number) => {
    const count = images.length
    const n = (target + count) % count
    const from = current.current
    if (n === from) return
    layers.current[from]?.querySelector("video")?.pause()
    const way = dir ?? (n > from ? 1 : -1)

    gsap.to(layers.current[from], { scale: 1, x: 0, y: 0, duration: t(0.9), ease: "power2.inOut", overwrite: true })
    gsap.set(layers.current[n], { scale: 1, x: 0, y: 0 })
    view.current = { s: 1, x: 0, y: 0 }
    current.current = n
    setScale(1)
    setIndex(n)

    const out = slides.current[from]
    const inn = slides.current[n]
    gsap.set(out, { zIndex: 1 })
    gsap.set(inn, { zIndex: 2 })
    gsap.to(out, {
      autoAlpha: 0,
      xPercent: -3 * way,
      scale: 1.02,
      filter: "blur(6px)",
      duration: t(1),
      ease: "power2.inOut",
      overwrite: true,
    })
    gsap.fromTo(
      inn,
      { autoAlpha: 0, x: 0, xPercent: 4 * way, scale: 1.04, filter: "blur(10px)" },
      { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: t(1.2), delay: t(0.12), ease: "power3.out", overwrite: true },
    )
    if (counter.current) {
      gsap.fromTo(counter.current, { yPercent: 60 * way, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: t(0.6), ease: "power3.out" })
    }
    moveMarker(n)
    thumbs.current[n]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced.current ? "auto" : "smooth" })
    apply(1, 0, 0, 0)
  })

  const zoomBy = contextSafe((f: number) => zoomAt(view.current.s * f))
  const reset = contextSafe(() => apply(1, 0, 0))

  /* ── Pantalla completa: Flip anima el mismo nodo de su lugar a cubrir la ventana ── */
  const toggleFull = contextSafe(() => {
    const el = root.current!
    const holder = el.parentElement!
    apply(1, 0, 0, 0)
    const next = !fullRef.current
    if (next) holder.style.height = `${holder.offsetHeight}px`
    const state = Flip.getState(el)
    fullRef.current = next
    flushSync(() => setFull(next))
    moveMarker(current.current, 0)
    Flip.from(state, {
      duration: t(0.8),
      ease: "power3.inOut",
      onComplete: () => {
        if (!next) holder.style.height = ""
        moveMarker(current.current, 0)
        el.focus({ preventScroll: true })
      },
    })
  })

  // Rueda: zoom con Ctrl/pinza del trackpad, o libre si la foto ya está ampliada o en pantalla completa.
  useEffect(() => {
    const st = stage.current
    if (!st) return
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || view.current.s > 1 || fullRef.current)) return
      e.preventDefault()
      const p = local(e.clientX, e.clientY)
      zoomAt(view.current.s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0025)), p.x, p.y, 0.35)
    }
    st.addEventListener("wheel", onWheel, { passive: false })
    return () => st.removeEventListener("wheel", onWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // En pantalla completa: Escape cierra y la página de atrás no scrollea.
  useEffect(() => {
    if (!full) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = "hidden"
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && toggleFull()
    document.addEventListener("keydown", onKey)
    return () => {
      html.style.overflow = prev
      document.removeEventListener("keydown", onKey)
    }
  }, [full, toggleFull])

  // Se mide la primera foto (no video) y el escenario toma su forma: cuadrada, apaisada o vertical.
  useEffect(() => {
    const cover = images.find((im) => !im.video && im.src)
    if (!cover) return
    const img = new Image()
    img.onload = () => img.naturalHeight && setRatio(clamp(0.8, 1.78, img.naturalWidth / img.naturalHeight))
    img.src = cover.src
  }, [images])

  // Cuando el escenario cambia de forma, se reacomodan el zoom y la marca de miniaturas.
  useEffect(() => {
    if (!ratio) return
    apply(view.current.s, view.current.x, view.current.y, 0)
    moveMarker(current.current, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratio])

  // El video de la diapositiva activa arranca solo, mudo y en loop (salvo con "reducir movimiento").
  useEffect(() => {
    const video = layers.current[index]?.querySelector("video")
    if (!video || reduced.current) return
    video.muted = true
    video.play().catch(() => {})
  }, [index])

  // Al cambiar el tamaño de la ventana se reacomoda el zoom y la marca de miniaturas.
  useEffect(() => {
    const onResize = () => {
      const v = view.current
      apply(v.s, v.x, v.y, 0)
      moveMarker(current.current, 0)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Gestos: arrastrar (mueve la foto ampliada o pasa de foto), pellizcar, doble toque ── */
  const onPointerDown = contextSafe((e: PointerEvent<HTMLDivElement>) => {
    // Sobre flechas y herramientas no hay gesto: capturar el puntero les robaría el click.
    // Sobre un video, el gesto es de sus controles (play, barra de tiempo).
    if ((e.pointerType === "mouse" && e.button !== 0) || (e.target as Element).closest("button, video")) return
    e.currentTarget.setPointerCapture(e.pointerId)
    points.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...points.current.values()]
    if (pts.length === 2) {
      gesture.current = { kind: "pinch", dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), s0: view.current.s }
    } else if (pts.length === 1) {
      const v = view.current
      gesture.current = { kind: v.s > 1 ? "pan" : "swipe", sx: e.clientX, sy: e.clientY, vx: v.x, vy: v.y, moved: false }
    }
  })

  const onPointerMove = contextSafe((e: PointerEvent<HTMLDivElement>) => {
    if (!points.current.has(e.pointerId)) return
    points.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    if (!g) return
    if (g.kind === "pinch") {
      const [a, b] = [...points.current.values()]
      if (!a || !b) return
      const mid = local((a.x + b.x) / 2, (a.y + b.y) / 2)
      zoomAt((g.s0 * Math.hypot(a.x - b.x, a.y - b.y)) / g.dist, mid.x, mid.y, 0.15)
      return
    }
    const dx = e.clientX - g.sx
    const dy = e.clientY - g.sy
    if (Math.abs(dx) + Math.abs(dy) > 5) g.moved = true
    if (g.kind === "pan") apply(view.current.s, g.vx + dx, g.vy + dy, 0.25)
    else if (many) gsap.to(slides.current[current.current], { x: dx * 0.35, duration: t(0.3), ease: "power2.out", overwrite: "auto" })
  })

  const endPointer = contextSafe((e: PointerEvent<HTMLDivElement>, cancelled = false) => {
    points.current.delete(e.pointerId)
    const g = gesture.current
    if (g && g.kind !== "pinch") {
      const dx = e.clientX - g.sx
      if (g.kind === "swipe" && many && !cancelled && Math.abs(dx) > 60) go(current.current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
      else if (g.kind === "swipe") gsap.to(slides.current[current.current], { x: 0, duration: t(0.5), ease: "power3.out" })

      if (!g.moved && !cancelled) {
        const now = performance.now()
        const last = lastTap.current
        if (now - last.t < 320 && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 30) {
          const p = local(e.clientX, e.clientY)
          if (view.current.s > 1.05) apply(1, 0, 0)
          else zoomAt(DOUBLE, p.x, p.y)
          lastTap.current = { t: 0, x: 0, y: 0 }
        } else lastTap.current = { t: now, x: e.clientX, y: e.clientY }
      }
    }
    const rest = [...points.current.values()]
    if (rest.length === 1) {
      const v = view.current
      gesture.current = { kind: v.s > 1 ? "pan" : "swipe", sx: rest[0].x, sy: rest[0].y, vx: v.x, vy: v.y, moved: true }
    } else if (rest.length === 0) gesture.current = null
  })

  /* ── Teclado: flechas pasan fotos (o recorren la foto ampliada), + − 0 zoom, F pantalla completa ── */
  const onKeyDown = contextSafe((e: KeyboardEvent<HTMLDivElement>) => {
    const v = view.current
    const nudge = 90
    const keys: Record<string, () => void> = {
      ArrowRight: () => (v.s > 1 ? apply(v.s, v.x - nudge, v.y, 0.3) : go(current.current + 1, 1)),
      ArrowLeft: () => (v.s > 1 ? apply(v.s, v.x + nudge, v.y, 0.3) : go(current.current - 1, -1)),
      ArrowDown: () => v.s > 1 && apply(v.s, v.x, v.y - nudge, 0.3),
      ArrowUp: () => v.s > 1 && apply(v.s, v.x, v.y + nudge, 0.3),
      "+": () => zoomBy(STEP),
      "=": () => zoomBy(STEP),
      "-": () => zoomBy(1 / STEP),
      "0": () => reset(),
      f: () => toggleFull(),
    }
    if (images[current.current]?.video && /^[-+=0]$/.test(e.key)) return
    const fn = keys[e.key]
    if (!fn || (v.s <= 1 && (e.key === "ArrowUp" || e.key === "ArrowDown"))) return
    e.preventDefault()
    fn()
  })

  const zoomed = scale > 1.01
  const active = images[index]
  const isVideo = Boolean(active?.video)
  const onlyVideos = images.every((im) => im.video)

  return (
    <div
      ref={root}
      className={`pd-viewer${full ? " is-full" : ""}${isVideo ? " has-video" : ""}${onlyVideos ? " only-video" : ""}`}
      style={ratio ? ({ "--pd-ratio": ratio } as React.CSSProperties) : undefined}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Fotos de ${name}`}
    >
      <div
        ref={stage}
        className={`pd-stage${zoomed ? " is-zoomed" : ""}`}
        tabIndex={0}
        aria-label={isVideo ? active.alt : `${active?.alt ?? name}. Doble toque o + para ampliar.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endPointer(e)}
        onPointerCancel={(e) => endPointer(e, true)}
      >
        {images.map((im, i) => (
          <div
            key={im.src}
            ref={(el) => {
              if (el) slides.current[i] = el
            }}
            className="pd-slide"
            role="group"
            aria-roledescription={im.video ? "video" : "foto"}
            aria-label={`${i + 1} de ${images.length}`}
            aria-hidden={i !== index}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {im.src && !im.video && <img className="pd-slide__ambient" src={im.src} alt="" aria-hidden="true" />}
            <div
              ref={(el) => {
                if (el) layers.current[i] = el
              }}
              className="pd-slide__zoom"
            >
              {im.video ? (
                <span className="pd-slide__phone">
                  <video
                    className="pd-slide__img pd-slide__video"
                    src={im.video}
                    poster={im.src || undefined}
                    aria-label={im.alt}
                    controls
                    muted
                    loop
                    playsInline
                    preload={i === 0 ? "auto" : "none"}
                  />
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="pd-slide__img"
                  src={im.src}
                  alt={im.alt}
                  draggable={false}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                />
              )}
            </div>
          </div>
        ))}

        {many && (
          <>
            <button type="button" className="pd-arrow pd-arrow--prev" onClick={() => go(current.current - 1, -1)} aria-label="Foto anterior">
              <Icon d="M15 5l-7 7 7 7" />
            </button>
            <button type="button" className="pd-arrow pd-arrow--next" onClick={() => go(current.current + 1, 1)} aria-label="Foto siguiente">
              <Icon d="M9 5l7 7-7 7" />
            </button>
          </>
        )}

        <div className={`pd-tools${isVideo ? " is-video" : ""}`} role="toolbar" aria-label="Zoom">
          <ToolButton label="Alejar" onClick={() => zoomBy(1 / STEP)} disabled={!zoomed}>
            <Icon d="M5 12h14" />
          </ToolButton>
          <output className="pd-tools__value" aria-live="polite">
            {Math.round(scale * 100)}%
          </output>
          <ToolButton label="Acercar" onClick={() => zoomBy(STEP)} disabled={isVideo || scale >= MAX}>
            <Icon d="M12 5v14M5 12h14" />
          </ToolButton>
          <ToolButton label="Ver entera" onClick={reset} disabled={!zoomed}>
            <Icon d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </ToolButton>
          <span className="pd-tools__sep" aria-hidden="true" />
          <ToolButton label={full ? "Salir de pantalla completa" : "Pantalla completa"} onClick={toggleFull} pressed={full}>
            {full ? <Icon d="M6 6l12 12M18 6L6 18" /> : <Icon d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />}
          </ToolButton>
        </div>

        <span className={`pd-map${zoomed ? " is-on" : ""}`} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active?.src} alt="" />
          <span ref={mapRect} className="pd-map__rect" />
        </span>
      </div>

      <div className="pd-bar">
        <p className="pd-bar__count" aria-live="polite">
          <span ref={counter} className="pd-bar__current">
            {pad(index + 1)}
          </span>
          <span className="pd-bar__total"> / {pad(images.length)}</span>
        </p>
        <p className="pd-bar__hint">
          {isVideo
            ? "Tocá el video para activar el sonido"
            : zoomed
              ? "Arrastrá para recorrer la foto · doble toque para volver"
              : "Doble toque, pellizco o + para ampliar"}
        </p>
      </div>

      {many && (
        <div className="pd-thumbs">
          <ul className="pd-thumbs__list">
            {images.map((im, i) => (
              <li key={im.src}>
                <button
                  type="button"
                  ref={(el) => {
                    if (el) thumbs.current[i] = el
                  }}
                  className={`pd-thumb${i === index ? " is-active" : ""}`}
                  onClick={() => go(i)}
                  aria-label={`Ver ${im.video ? "video" : "foto"} ${i + 1} de ${images.length}`}
                  aria-current={i === index}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {im.src ? <img src={im.src} alt="" loading="lazy" /> : <span className="pd-thumb__blank" />}
                  {im.video && (
                    <span className="pd-thumb__play" aria-hidden="true">
                      <Icon d="M8 5l11 7-11 7z" />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <span ref={marker} className="pd-thumbs__marker" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

function ToolButton({
  label,
  onClick,
  disabled,
  pressed,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  pressed?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className="pd-tool"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
    >
      {children}
    </button>
  )
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

/** Entrada de la ficha: título por renglones y bloques en tanda. Sin movimiento si el usuario lo pide. */
export function ProductMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } })
        // clearProps: un transform residual en un ancestro rompería el position: fixed de la pantalla completa.
        tl.fromTo("[data-pd=stage]", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 1.4, clearProps: "transform" }, 0)
        tl.fromTo("[data-pd=in]", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.2)
      })
      return () => mm.revert()
    },
    { scope: root },
  )
  return <div ref={root}>{children}</div>
}
