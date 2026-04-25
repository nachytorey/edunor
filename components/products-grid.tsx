"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CategoryFilter } from "@/components/category-filter"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"

export function ProductsGrid() {
  const [active, setActive] = useState<string>("Todos")
  const [isFiltering, setIsFiltering] = useState(false)

  const filtered = useMemo(() => {
    if (active === "Todos") return products
    return products.filter((p) => p.category === active)
  }, [active])

  const handleChange = (value: string) => {
    if (value === active) return
    setIsFiltering(true)
    setActive(value)
    setTimeout(() => setIsFiltering(false), 250)
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 mb-14">
        <CategoryFilter active={active} onChange={handleChange} />
        <motion.p
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.2em] text-foreground/50"
        >
          {filtered.length}{" "}
          {filtered.length === 1 ? "producto encontrado" : "productos encontrados"}
        </motion.p>
      </div>

      {isFiltering ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: Math.min(6, filtered.length || 3) }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-sm border border-border bg-card overflow-hidden"
            >
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-6 space-y-4">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-5/6 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-foreground/60">
          <p className="font-serif text-2xl">No se encontraron productos</p>
          <p className="mt-2 text-sm">Probá con otra categoría</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} priority={i < 3} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
