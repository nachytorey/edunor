"use client"

/**
 * Menú de la v2: botón píldora "Menú" que abre un panel a pantalla completa en dos columnas.
 * - Izquierda: los links en filas (número, nombre, flecha), separadas por líneas finas.
 * - Derecha: una foto que cambia según el link señalado (mouse o foco) y, abajo, el contacto (`aside`,
 *   que llega armado desde el servidor). En el celular: una sola columna, sin foto.
 * Se cierra con el botón, con Escape o al elegir un link; mientras está abierto la página no scrollea.
 * Estilos en app/(v2)/v2.css (.v2-menubtn, .v2-fullmenu).
 */
import { useEffect, useRef, useState, type ReactNode } from "react"

export type MenuLink = { href: string; label: string; image: { src: string; alt: string } }

export function V2Menu({ links, aside }: { links: MenuLink[]; aside: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const bar = btnRef.current?.closest<HTMLElement>(".v2-bar")
    if (bar) {
      if (open) bar.dataset.menu = ""
      else delete bar.dataset.menu
    }
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
        aria-controls="v2-fullmenu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="v2-menubtn__label">{open ? "Cerrar" : "Menú"}</span>
        <span className="v2-menubtn__icon" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <div id="v2-fullmenu" className="v2-fullmenu" hidden={!open}>
        <div className="v2-fullmenu__inner">
          <nav className="v2-fullmenu__nav" aria-label="Secciones">
            <ol className="v2-fullmenu__list">
              {links.map((l, n) => (
                <li key={l.href} style={{ "--i": n } as React.CSSProperties}>
                  <a
                    href={l.href}
                    className="v2-fullmenu__link"
                    data-active={n === active || undefined}
                    onMouseEnter={() => setActive(n)}
                    onFocus={() => setActive(n)}
                    onClick={() => setOpen(false)}
                  >
                    <span className="v2-fullmenu__num" aria-hidden="true">
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    <span className="v2-fullmenu__label">{l.label}</span>
                    <span className="v2-fullmenu__arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="v2-fullmenu__side">
            <div className="v2-fullmenu__media" aria-hidden="true">
              {links.map((l, n) => (
                <img key={l.href} src={l.image.src} alt="" data-on={n === active || undefined} loading="lazy" decoding="async" />
              ))}
              <span className="v2-fullmenu__caption">{links[active]?.label}</span>
            </div>
            <div className="v2-fullmenu__aside">{aside}</div>
          </div>
        </div>
      </div>
    </>
  )
}
