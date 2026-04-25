"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0])

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero.jpg"
          alt="Lancha de lujo navegando al atardecer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full items-center"
      >
        <div className="container-luxe">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block text-xs uppercase tracking-[0.4em] text-primary mb-6"
          >
            — Náutica, Camping & Outdoor · Desde 1963
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight text-balance max-w-4xl"
          >
            Domina el agua.
            <br />
            <span className="text-primary italic font-normal">Conquista</span> el terreno.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
            className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 leading-relaxed text-pretty"
          >
            Representantes oficiales de Zodiac, Mercury, Yamaha, Sea Doo, Polaris y más.
            Más de 60 años ofreciendo las mejores opciones para tu tiempo libre.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/productos"
              className="group inline-flex items-center justify-center gap-2 h-12 px-7 bg-primary text-primary-foreground text-xs uppercase tracking-[0.25em] rounded-full hover:bg-primary/90 transition-colors"
            >
              Ver Productos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#sucursales"
              className="inline-flex items-center justify-center h-12 px-7 border border-foreground/30 text-foreground text-xs uppercase tracking-[0.25em] rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Nuestras Sucursales
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-foreground/40">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-px bg-gradient-to-b from-primary to-transparent"
          />
        </div>
      </motion.div>
    </section>
  )
}
