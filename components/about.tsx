"use client"

import Image from "next/image"
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useRef } from "react"

function Counter({ from = 0, to, suffix = "" }: { from?: number; to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20%" })
  const count = useMotionValue(from)
  const rounded = useTransform(count, (v) => Math.round(v).toString() + suffix)

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 1.8, ease: "easeOut" })
      return () => controls.stop()
    }
  }, [inView, count, to])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

const stats = [
  { value: 60, prefix: "+", label: "Años de trayectoria" },
  { value: 1500, prefix: "", suffix: "m²", label: "Showroom" },
  { value: 2, prefix: "", label: "Sucursales" },
]

const brands = [
  "Canestrari",
  "Arco-Iris",
  "Zodiac",
  "Autonáutica",
  "Semirrígidos Edunor",
  "Atlanti-kayak's",
  "Mercury",
  "Mariner",
  "Evinrude",
  "Yamaha",
  "Volvo Penta",
  "Mercruiser",
  "Sea Doo",
  "Polaris",
  "GENERAC",
]

export function About() {
  return (
    <section id="nosotros" className="relative py-28 md:py-40 border-t border-border">
      <div className="container-luxe grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-[4/5] overflow-hidden rounded-sm"
        >
          <Image
            src="/images/about.jpg"
            alt="Showroom Edunor Náutica"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
              Desde 1963
            </div>
            <div className="font-serif text-xl text-foreground">
              Témperley · Canning — Buenos Aires
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-primary">
            — Quiénes somos
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
            Más de <span className="text-primary italic">60 años</span> en el agua
          </h2>
          <p className="mt-6 text-foreground/70 leading-relaxed text-pretty">
            Edunor Náutica es una empresa familiar fundada en <strong className="text-foreground">1963</strong>,
            dedicada a la comercialización de los rubros Náutica, Camping y Outdoor — calzado e
            indumentaria de las mejores marcas. Una larga trayectoria trabajando para brindarle las
            mejores opciones para su tiempo libre.
          </p>

          <div className="mt-10 border-t border-border pt-8">
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-primary mb-4">
              Representantes oficiales
            </h3>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center h-8 px-3 text-xs text-foreground/80 border border-border rounded-sm bg-card/50"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 md:gap-10 border-t border-border pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-3xl md:text-5xl text-primary">
                  {s.prefix}
                  <Counter to={s.value} suffix={s.suffix ?? ""} />
                </div>
                <div className="mt-2 text-[11px] md:text-xs uppercase tracking-[0.2em] text-foreground/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
