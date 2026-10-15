"use client"

import { motion } from "framer-motion"
import { featured } from "@/lib/landing"
import { ImageCard } from "@/components/landing/image-card"

const links = [
  { href: "#que-hacemos", label: "Qué hacemos" },
  { href: "#sucursales", label: "Sucursales" },
  { href: "#contacto", label: "Contacto" },
]

const ease = [0.22, 1, 0.36, 1] as const

export function SiteHeader() {
  return (
    <header className="flex min-h-svh flex-col px-5 pb-10 pt-5 md:px-10">
      <nav className="flex items-center justify-between text-sm">
        <a href="#" className="font-display text-2xl tracking-tight">
          Edunor<sup className="text-xs">®</sup>
        </a>
        <ul className="flex gap-4 sm:gap-6 md:gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="opacity-70 transition-opacity hover:opacity-100">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease }}
        className="font-display text-giant mt-[14vh] whitespace-pre-line text-balance md:mt-[18vh]"
      >
        {"Náutica, camping\ny outdoor desde 1963."}
      </motion.h1>

      <div className="mt-auto grid grid-cols-1 gap-5 pt-16 sm:grid-cols-3 md:gap-8">
        {featured.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25 + i * 0.12, ease }}
          >
            <ImageCard {...card} sizes="(max-width: 640px) 100vw, 33vw" aspect="aspect-[3/2]" priority />
          </motion.div>
        ))}
      </div>
    </header>
  )
}
