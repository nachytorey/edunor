"use client"

/**
 * Menú de la v2: botón redondo que despliega un panel NEGRO desde la
 * derecha, con el lenguaje del logo y de la barra: los productos en grande (itálica pesada, mayúsculas, numerados),
 * el resto de las secciones en una fila chica condensada, y abajo WhatsApp + redes. Entrada escalonada por CSS.
 * Se cierra tocando afuera, con el botón, con Escape o al elegir un link; mientras está abierto la página no scrollea.
 * Estilos en app/(v2)/v2.css (.v2-menubtn, .v2-drawer).
 * El panel se dibuja en el <body> (portal): dentro de la barra quedaría atrapado por su backdrop-filter,
 * que convierte a la barra en el contenedor de los position: fixed.
 */
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type Link = { href: string; label: string }

export function V2Menu({
  primary,
  secondary,
  social,
  whatsapp,
}: {
  primary: Link[]
  secondary: Link[]
  social: Link[]
  whatsapp: string
}) {
  const [open, setOpen] = useState(false)
  // Al cerrar, el panel sigue visible con data-closing mientras corre la salida (la entrada al revés);
  // recién cuando termina la animación del panel se oculta de verdad.
  const [closing, setClosing] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const close = () => {
    if (!open || closing) return
    // Sin animaciones (prefers-reduced-motion) no hay animationend que esperar: se cierra directo.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setOpen(false)
    else setClosing(true)
  }
  const closeRef = useRef(close)
  closeRef.current = close

  const onPanelAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget || e.animationName !== "v2-slide-out") return
    setClosing(false)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    document.documentElement.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      closeRef.current()
      btnRef.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.documentElement.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="v2-menubtn"
        aria-expanded={open}
        aria-controls="v2-drawer"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
          <div className="v2 v2-drawer" hidden={!open} data-closing={closing || undefined}>
            <button type="button" className="v2-drawer__backdrop" aria-label="Cerrar menú" tabIndex={-1} onClick={close} />
            <nav id="v2-drawer" className="v2-drawer__panel" aria-label="Menú" onAnimationEnd={onPanelAnimationEnd}>
              <div className="v2-drawer__top">
                <p className="v2-drawer__kicker">Menú</p>
                <button type="button" className="v2-drawer__close" aria-label="Cerrar menú" onClick={close}>
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                </button>
              </div>

              <ol className="v2-drawer__main">
                {primary.map((l, i) => (
                  <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                    <a href={l.href} onClick={close}>
                      <span className="v2-drawer__num" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ol>

              <ul className="v2-drawer__sub" style={{ "--i": primary.length } as React.CSSProperties}>
                {secondary.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} onClick={close}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="v2-drawer__foot" style={{ "--i": primary.length + 1 } as React.CSSProperties}>
                <a href={whatsapp} target="_blank" rel="noreferrer" className="v2-btn v2-btn--light v2-drawer__wa">
                  Escribinos por WhatsApp
                </a>
                <ul className="v2-drawer__social">
                  {social.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </>
  )
}
