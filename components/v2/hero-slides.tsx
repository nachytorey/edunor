"use client"

/**
 * Hero de la v2: fotos que rotan con fundido.
 * - Solas cada EVERY_MS. Se frenan con la pestaña oculta, con el mouse encima y con "reducir movimiento".
 * - A mano: deslizando con dos dedos en el trackpad (scroll horizontal), con un dedo en el celular, o con los puntos.
 *   Cada cambio a mano reinicia la cuenta, así la foto elegida no se va enseguida.
 */
import { useCallback, useEffect, useRef, useState } from "react"

type Slide = { src: string; alt: string; srcSet?: string }

const EVERY_MS = 5500
/** Desplazamiento horizontal acumulado (px) que cuenta como un gesto del trackpad. */
const WHEEL_STEP = 40
/** Después de un cambio, se ignora la inercia del trackpad por este tiempo: un gesto = una foto. */
const COOLDOWN_MS = 650
/** Recorrido mínimo del dedo (px) para que cuente como deslizar en el celular. */
const SWIPE_MIN = 45

export function HeroSlides({ slides, children }: { slides: Slide[]; children: React.ReactNode }) {
  const [at, setAt] = useState(0)
  const [paused, setPaused] = useState(false)
  const root = useRef<HTMLElement>(null)
  const count = slides.length

  const go = useCallback((dir: number) => setAt((n) => (n + dir + count) % count), [count])

  // Rotación automática; depende de `at` para que un cambio a mano reinicie la cuenta.
  useEffect(() => {
    if (paused || count < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setTimeout(() => {
      if (!document.hidden) go(1)
    }, EVERY_MS)
    return () => window.clearTimeout(id)
  }, [at, paused, count, go])

  // Trackpad (dos dedos de costado) y dedo en pantallas táctiles.
  useEffect(() => {
    const el = root.current
    if (!el || count < 2) return
    let acc = 0
    let lockedUntil = 0
    let resetId = 0

    // No pasivo: hay que poder cancelar el "volver atrás" del navegador al deslizar de costado.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return // scroll vertical: la página baja normal
      e.preventDefault()
      const now = performance.now()
      if (now < lockedUntil) return
      acc += e.deltaX
      window.clearTimeout(resetId)
      resetId = window.setTimeout(() => (acc = 0), 200)
      if (Math.abs(acc) >= WHEEL_STEP) {
        go(acc > 0 ? 1 : -1)
        acc = 0
        lockedUntil = now + COOLDOWN_MS
      }
    }

    let x0 = 0
    let y0 = 0
    const onStart = (e: TouchEvent) => {
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
    }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - x0
      const dy = e.changedTouches[0].clientY - y0
      if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("touchstart", onStart, { passive: true })
    el.addEventListener("touchend", onEnd, { passive: true })
    return () => {
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchend", onEnd)
      window.clearTimeout(resetId)
    }
  }, [count, go])

  return (
    <section
      ref={root}
      className="v2-hero"
      aria-roledescription="carrusel"
      aria-label="Fotos de Edunor"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="v2-hero__slides">
        {slides.map((s, n) => (
          <img
            key={s.src}
            className="v2-hero__img"
            data-on={n === at || undefined}
            src={s.src}
            srcSet={s.srcSet}
            sizes={s.srcSet && "100vw"}
            alt={n === at ? s.alt : ""}
            aria-hidden={n !== at || undefined}
            fetchPriority={n === 0 ? "high" : "low"}
            loading={n === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        ))}
      </div>
      <div className="v2-hero__shade" aria-hidden="true" />
      <div className="v2-hero__text">{children}</div>
      {count > 1 && (
        <div className="v2-hero__dots">
          {slides.map((s, n) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Ver foto ${n + 1} de ${count}`}
              aria-current={n === at || undefined}
              onClick={() => setAt(n)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
