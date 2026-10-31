"use client"

import { useEffect, useRef, useState } from "react"
import { site } from "@/lib/clon"

export function NavMenu() {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const close = () => {
    setOpen(false)
    openRef.current?.focus()
  }

  return (
    <>
      <nav className="nav" aria-label="Principal">
        <a className="nav__item" href="#" aria-label="Volver al inicio">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="7" aria-hidden="true">
            <path d="M23 6.5a14 14 0 1 1-9.5 1.2" strokeLinecap="butt" />
          </svg>
        </a>
        <button
          ref={openRef}
          className="nav__item"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="clon-menu"
          onClick={() => setOpen(true)}
        >
          <svg viewBox="0 0 40 40" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M6 11h28M6 20h28M6 29h28" />
          </svg>
        </button>
      </nav>

      <div className="cl-menu__scrim" data-open={open} onClick={close} aria-hidden="true" />
      <div id="clon-menu" className="cl-menu" data-open={open} role="dialog" aria-modal="true" aria-label="Menú" inert={!open}>
        <button ref={closeRef} type="button" className="nav__item cl-menu__close" aria-label="Cerrar menú" onClick={close}>
          <svg viewBox="0 0 40 40" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M10 10l20 20M30 10L10 30" />
          </svg>
        </button>
        <div className="cl-menu__wrapper">
          <p className="cl-menu__logo">{site.name}</p>
          <div className="cl-menu__links">
            {site.menu.map((label) => (
              <a key={label} className="cl-menu__link" href="#" onClick={close}>
                {label}
              </a>
            ))}
          </div>
          <footer className="cl-menu__footer">
            {site.footer.map((label) => (
              <a key={label} className="cl-menu__footer-link" href="#">
                {label}
              </a>
            ))}
          </footer>
        </div>
      </div>
    </>
  )
}
