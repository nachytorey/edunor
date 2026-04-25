"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"
import { EdunorLogo } from "@/components/edunor-logo"

const links = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Sucursales", href: "/#sucursales" },
  { label: "Contacto", href: "/#contacto" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent",
      )}
    >
      <nav className="container-luxe flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
          aria-label={siteConfig.name}
        >
          <EdunorLogo />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-primary transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/productos"
          className="hidden lg:inline-flex items-center justify-center h-10 px-5 text-xs uppercase tracking-[0.2em] border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-sm"
        >
          Ver Catálogo
        </Link>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center text-foreground"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <ul className="container-luxe flex flex-col py-6 gap-4">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    className="block py-2 text-base uppercase tracking-[0.2em] text-foreground/80 hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <Link
                href="/productos"
                className="inline-flex items-center justify-center h-11 px-5 text-xs uppercase tracking-[0.2em] border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-sm mt-2"
              >
                Ver Catálogo
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
