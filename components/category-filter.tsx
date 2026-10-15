"use client"

import { motion } from "framer-motion"
import { categories } from "@/lib/products"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  active: string
  onChange: (value: string) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar por categoría"
      className="flex flex-wrap items-center gap-2 md:gap-3 p-1.5 bg-card border border-border rounded-full w-fit mx-auto"
    >
      {categories.map((c) => {
        const selected = active === c
        return (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(c)}
            className={cn(
              "relative px-4 md:px-6 py-2.5 text-[11px] md:text-xs uppercase tracking-[0.2em] rounded-full transition-colors",
              selected ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {selected && (
              <motion.span
                layoutId="category-pill"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            )}
            <span className="relative z-10">{c}</span>
          </button>
        )
      })}
    </div>
  )
}
