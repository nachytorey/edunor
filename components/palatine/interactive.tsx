"use client"

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { EdunorLogo } from "@/components/edunor-logo"
import { ChatIcon, Triangle } from "@/components/palatine/ornaments"

type Link = { href: string; label: string }

/** Primera letra más grande, como versalitas de grabado: "Modelos" → <span>M</span>odelos. */
export function Caps({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          {i > 0 ? " " : null}
          <span className="pal-cap">{w[0].toUpperCase()}</span>
          {w.slice(1)}
        </span>
      ))}
    </>
  )
}

/** Logo arriba a la izquierda + botón cuadrado naranja que abre el menú a pantalla completa. */
export function PalNav({ links, whatsapp, home }: { links: Link[]; whatsapp: string; home?: string }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    document.documentElement.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      btnRef.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.documentElement.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <header className="pal-nav" data-open={open || undefined}>
      <a
        href={home ?? "#top"}
        className="pal-nav__brand"
        aria-label={home ? "Edunor Náutica, ir al inicio" : "Edunor Náutica, volver arriba"}
      >
        <EdunorLogo />
      </a>
      <button
        ref={btnRef}
        type="button"
        className="pal-burger"
        aria-expanded={open}
        aria-controls="pal-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
      <nav id="pal-menu" className="pal-menu" aria-label="Secciones" hidden={!open}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className="pal-menu__link" onClick={() => setOpen(false)}>
            <Caps text={l.label} />
          </a>
        ))}
        <a href={whatsapp} target="_blank" rel="noreferrer" className="pal-menu__cta">
          <ChatIcon />
          <span>
            no te olvides del <strong>WhatsApp</strong>
          </span>
        </a>
      </nav>
    </header>
  )
}

/**
 * Carrusel de a un elemento con flechas triangulares a los costados y fundido entre slides.
 * Con `autoplay` avanza solo (se pausa con el puntero encima o con foco adentro).
 */
export function Fader({
  children,
  label,
  autoplay,
  className = "",
}: {
  children: ReactNode
  label: string
  autoplay?: number
  className?: string
}) {
  const slides = Children.toArray(children)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const go = useCallback((d: number) => setI((n) => (n + d + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (!autoplay || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = window.setTimeout(() => go(1), autoplay)
    return () => window.clearTimeout(t)
  }, [autoplay, paused, i, go])

  return (
    <div
      className={`pal-fader ${className}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="pal-fader__track">
        {slides.map((s, n) => (
          <div
            key={n}
            className="pal-fader__slide"
            data-active={n === i || undefined}
            aria-hidden={n !== i}
            inert={n !== i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${n + 1} de ${slides.length}`}
          >
            {s}
          </div>
        ))}
      </div>
      {slides.length > 1 ? (
        <>
          <button type="button" className="pal-fader__arrow pal-fader__arrow--prev" onClick={() => go(-1)} aria-label="Anterior">
            <Triangle />
          </button>
          <button type="button" className="pal-fader__arrow pal-fader__arrow--next" onClick={() => go(1)} aria-label="Siguiente">
            <Triangle />
          </button>
          <div className="pal-fader__dots" aria-hidden="true">
            {slides.map((_, n) => (
              <span key={n} data-active={n === i || undefined} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
