"use client"

import { useEffect, useId, useRef, useState } from "react"
import { issue, sections } from "@/lib/stories"

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-black uppercase leading-none tracking-[-0.03em] ${className}`}>
      {issue.name}
    </span>
  )
}

function NavLinks({ onNavigate, className = "" }: { onNavigate?: () => void; className?: string }) {
  return (
    <ul className={className}>
      {sections.map((s) => (
        <li key={s.slug} className="border-l border-navy-900 first:border-l-0">
          <a
            href={s.href}
            onClick={onNavigate}
            className="link-red caps block px-3 py-3 text-[0.8125rem] font-semibold text-navy-900 lg:px-4"
          >
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function Burger({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-4 w-5">
      <span
        className={`absolute left-0 top-0 h-[2px] w-full bg-current transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
      />
      <span className={`absolute left-0 top-[7px] h-[2px] w-full bg-current ${open ? "opacity-0" : ""}`} />
      <span
        className={`absolute left-0 bottom-0 h-[2px] w-full bg-current transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
      />
    </span>
  )
}

export function Masthead() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const menuId = useId()

  // Masthead compacto cuando el grande sale de pantalla.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Menú mobile: bloquear scroll y cerrar con Escape.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <>
      <header className="bg-paper text-navy-900">
        <div className="container-page">
          {/* Logo + filas de metadata, estilo tapa de revista */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 pt-5 pb-3 sm:pt-7 sm:pb-4">
            <p className="caps hidden text-meta font-semibold sm:block">
              Nº {issue.number} · Año {issue.year}
            </p>
            <h1 className="col-span-3 text-center sm:col-span-1">
              <a href="#" className="block focus-visible:outline-offset-8">
                <Wordmark className="block text-[clamp(3rem,12vw,7.25rem)]" />
                <span className="caps mt-2 block text-[0.75rem] font-medium tracking-[0.3em] text-navy-900/80 sm:text-meta">
                  {issue.tagline}
                </span>
              </a>
            </h1>
            <p className="caps hidden text-right text-meta font-semibold sm:block">Edición {issue.season}</p>
          </div>

          {/* Doble filete: gruesa + fina */}
          <div className="rule-double-b h-[6px]" aria-hidden="true" />

          {/* Navegación desktop */}
          <nav aria-label="Secciones" className="hidden border-b border-navy-900 md:block">
            <NavLinks className="flex items-stretch justify-center" />
          </nav>

          {/* Fila mobile: edición + hamburguesa */}
          <div className="flex items-center justify-between border-b border-navy-900 py-2 md:hidden">
            <p className="caps text-kicker font-semibold">
              Nº {issue.number} · {issue.season}
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls={menuId}
              className="caps flex h-10 items-center gap-2 border border-navy-900 px-3 text-kicker font-semibold"
            >
              <Burger open={false} />
              Menú
            </button>
          </div>
        </div>
        <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      </header>

      {/* Barra compacta sticky */}
      <div
        className="masthead-compact fixed inset-x-0 top-0 z-50 border-b-2 border-navy-900 bg-paper text-navy-900"
        data-visible={compact}
        inert={!compact}
      >
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <a href="#" className="flex items-baseline gap-3">
            <Wordmark className="text-[1.75rem]" />
            <span className="caps hidden text-kicker font-medium text-navy-900/70 lg:inline">Nº {issue.number}</span>
          </a>
          <nav aria-label="Secciones (barra compacta)" className="hidden lg:block">
            <NavLinks className="flex items-stretch" />
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#newsletter"
             
              className="caps hidden h-10 items-center bg-navy-900 px-4 text-kicker font-semibold text-white hover:bg-navy-700 sm:inline-flex"
            >
              Suscribirse
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
             
              aria-expanded={open}
              aria-controls={menuId}
              aria-label="Abrir menú"
              className="flex h-10 w-10 items-center justify-center border border-navy-900 lg:hidden"
            >
              <Burger open={false} />
            </button>
          </div>
        </div>
      </div>

      {/* Menú mobile a pantalla completa */}
      {open && (
        <div id={menuId} role="dialog" aria-modal="true" aria-label="Menú de secciones" className="mobile-menu">
          <div className="container-page flex h-14 items-center justify-between border-b border-white/30">
            <Wordmark className="text-[1.75rem]" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="flex h-10 w-10 items-center justify-center border border-white"
              autoFocus
            >
              <Burger open />
            </button>
          </div>
          <nav aria-label="Secciones" className="container-page flex-1 py-6">
            <ul className="divide-y divide-white/20 border-b border-white/20">
              {sections.map((s, i) => (
                <li key={s.slug}>
                  <a
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4 font-display text-[2rem] font-bold leading-none"
                  >
                    {s.label}
                    <span className="caps text-kicker text-sky-100/60">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#newsletter"
              onClick={() => setOpen(false)}
              className="caps mt-8 inline-flex h-12 items-center bg-signal-red px-6 text-meta font-semibold text-white"
            >
              Suscribirse a la revista
            </a>
          </nav>
          <p className="caps container-page py-5 text-kicker text-sky-100/70">
            {issue.coordinates} · Nº {issue.number} · Año {issue.year}
          </p>
        </div>
      )}
    </>
  )
}
