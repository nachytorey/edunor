"use client"

import { useState } from "react"
import { EdunorLogo } from "@/components/edunor-logo"
import { navLinks, siteConfig, whatsappLink } from "@/lib/site"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="header" data-site-header data-ink="light" data-open={open}>
      <a href="#" className="header__brand" aria-label="Edunor Náutica, inicio" onClick={() => setOpen(false)}>
        <EdunorLogo className="brand-logo" />
      </a>

      <div className="header__right">
        <nav className="header__nav" aria-label="Secciones">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--small header__cta" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          Escribinos
        </a>
        <button
          type="button"
          className="header__menu"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>

      {open && (
        <div className="menu" id="menu" role="dialog" aria-label="Menú">
          <nav aria-label="Secciones">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
          <p className="menu__foot">
            {siteConfig.phone}. Témperley y Canning, Buenos Aires.
          </p>
        </div>
      )}
    </header>
  )
}
