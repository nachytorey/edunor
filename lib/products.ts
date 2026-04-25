import productsData from "@/data/products.json"

export type Category = "Botes" | "UTVs" | "Cuatriciclos" | "Accesorios"

export interface Product {
  id: string
  name: string
  slug: string
  category: Category
  featured: boolean
  price: string
  shortDescription: string
  description: string
  specs: Record<string, string>
  images: string[]
}

export const products = productsData as unknown as Product[]

export const categories: Array<"Todos" | Category> = [
  "Todos",
  "Botes",
  "UTVs",
  "Cuatriciclos",
  "Accesorios",
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}

export function categoryColor(category: Category): string {
  switch (category) {
    case "Botes":
      return "bg-blue-500/15 text-blue-300 border-blue-500/30"
    case "UTVs":
      return "bg-primary/15 text-primary border-primary/30"
    case "Cuatriciclos":
      return "bg-red-500/15 text-red-300 border-red-500/30"
    case "Accesorios":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}
