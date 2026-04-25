"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { type Product, categoryColor } from "@/lib/products"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  index?: number
  priority?: boolean
}

export function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: (index % 6) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link
        href={`/productos/${product.id}`}
        className="block relative overflow-hidden rounded-sm bg-card border border-border hover:border-primary/40 transition-colors"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
          <span
            className={cn(
              "absolute top-4 left-4 text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-sm border backdrop-blur-md",
              categoryColor(product.category),
            )}
          >
            {product.category}
          </span>
        </div>

        <div className="p-6 md:p-7 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-xl md:text-2xl leading-snug text-balance group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <ArrowUpRight className="h-5 w-5 text-foreground/40 group-hover:text-primary group-hover:rotate-0 transition-all -rotate-45" />
          </div>
          <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 text-pretty">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-[11px] uppercase tracking-[0.25em] text-foreground/50">
              {product.price === "Consultar" ? "Consultar precio" : product.price}
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-primary">
              Ver detalle →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
