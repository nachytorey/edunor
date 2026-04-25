"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { getFeaturedProducts } from "@/lib/products"

export function FeaturedProducts() {
  const products = getFeaturedProducts()

  return (
    <section className="relative py-28 md:py-40 border-t border-border">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.4em] text-primary">
              — Selección destacada
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
              Nuestros <span className="text-primary italic">Vehículos</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-foreground/60 max-w-sm text-pretty"
          >
            Una selección curada de nuestras unidades más pedidas. Potencia, estética y
            confiabilidad en perfecta armonía.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <Link
            href="/productos"
            className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors border-b border-border hover:border-primary pb-2"
          >
            Ver todos los productos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
