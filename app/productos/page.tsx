import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductsGrid } from "@/components/products-grid"

export const metadata: Metadata = {
  title: "Productos — Catálogo completo",
  description:
    "Explorá nuestro catálogo completo de botes, UTVs, cuatriciclos y accesorios premium. Vehículos seleccionados con obsesión por el detalle.",
  openGraph: {
    title: "Productos — Náutica Élite",
    description: "Catálogo completo de botes, UTVs, cuatriciclos y accesorios premium.",
  },
  alternates: {
    canonical: "/productos",
  },
}

export default function ProductosPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground min-h-screen pt-32 pb-24">
        <section className="container-luxe">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.4em] text-primary">
              — Catálogo completo
            </span>
            <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-balance">
              Nuestros <span className="text-primary italic">Productos</span>
            </h1>
            <p className="mt-6 text-foreground/70 leading-relaxed text-pretty max-w-xl">
              Explorá cada categoría y encontrá el vehículo perfecto. Cada unidad incluye
              garantía, servicio técnico certificado y financiación disponible.
            </p>
          </div>

          <div className="mt-16">
            <ProductsGrid />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
