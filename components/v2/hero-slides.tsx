"use client"

/**
 * Hero de la v2: fotos que rotan con fundido. Se frena con la pestaña oculta, con el mouse encima
 * y si el usuario pidió menos movimiento (ahí queda la primera foto y los puntos para cambiar a mano).
 */
import { useEffect, useState } from "react"

type Slide = { src: string; alt: string; srcSet?: string }

const EVERY_MS = 5500

export function HeroSlides({ slides, children }: { slides: Slide[]; children: React.ReactNode }) {
  const [at, setAt] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || slides.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => {
      if (!document.hidden) setAt((n) => (n + 1) % slides.length)
    }, EVERY_MS)
    return () => window.clearInterval(id)
  }, [paused, slides.length])

  return (
    <section
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
          />
        ))}
      </div>
      <div className="v2-hero__shade" aria-hidden="true" />
      <div className="v2-hero__text">{children}</div>
      {slides.length > 1 && (
        <div className="v2-hero__dots">
          {slides.map((s, n) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Ver foto ${n + 1} de ${slides.length}`}
              aria-current={n === at || undefined}
              onClick={() => setAt(n)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
