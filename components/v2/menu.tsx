"use client"

/**
 * Menú de la v2, simple: botón "Menú" que abre un panel blanco angosto desde la derecha con la lista de links
 * y un botón de WhatsApp. Se cierra tocando afuera, con el botón, con Escape o al elegir un link; mientras
 * está abierto la página no scrollea. Estilos en app/(v2)/v2.css (.v2-menubtn, .v2-drawer).
 * El panel se dibuja en el <body> (portal): dentro de la barra quedaría atrapado por su backdrop-filter,
 * que convierte a la barra en el contenedor de los position: fixed.
 */
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type Link = { href: string; label: string }

export function V2Menu({ links, whatsapp }: { links: Link[]; whatsapp: string }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

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
    <>
      <button
        ref={btnRef}
        type="button"
        className="v2-menubtn"
        aria-expanded={open}
        aria-controls="v2-drawer"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
          <div className="v2 v2-drawer" hidden={!open}>
            <button
              type="button"
              className="v2-drawer__backdrop"
              aria-label="Cerrar menú"
              tabIndex={-1}
              onClick={() => setOpen(false)}
            />
            <nav id="v2-drawer" className="v2-drawer__panel" aria-label="Menú">
              <button type="button" className="v2-drawer__close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
                ✕
              </button>
              <ul className="v2-drawer__list">
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} onClick={() => setOpen(false)}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="v2-btn v2-drawer__wa">
                Escribinos por WhatsApp
              </a>
            </nav>
          </div>,
          document.body,
        )}
    </>
  )
}
