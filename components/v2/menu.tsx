"use client"

/**
 * El menú de la v1 (components/palatine/interactive.tsx → PalNav) en la v2: el mismo botón inclinado y el mismo
 * panel a pantalla completa, negro con la malla hexagonal del logo, links gigantes en itálica con el corte de
 * velocidad y el llamado a WhatsApp. Se cierra con Escape, con la X o al elegir un link; mientras está abierto,
 * la página no scrollea. Los estilos están en app/(v2)/v2.css (.v2-burger, .v2-fullmenu).
 */
import { useEffect, useRef, useState } from "react"
import { Caps } from "@/components/palatine/interactive"
import { ChatIcon } from "@/components/palatine/ornaments"

type Link = { href: string; label: string }

export function V2Menu({ links, whatsapp }: { links: Link[]; whatsapp: string }) {
  const [open, setOpen] = useState(false)
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
        className="v2-burger"
        aria-expanded={open}
        aria-controls="v2-fullmenu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
      <nav id="v2-fullmenu" className="v2-fullmenu" aria-label="Secciones" hidden={!open}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className="v2-fullmenu__link" onClick={() => setOpen(false)}>
            <Caps text={l.label} />
          </a>
        ))}
        <a href={whatsapp} target="_blank" rel="noreferrer" className="v2-fullmenu__cta">
          <ChatIcon />
          <span>
            no te olvides del <strong>WhatsApp</strong>
          </span>
        </a>
      </nav>
    </>
  )
}
