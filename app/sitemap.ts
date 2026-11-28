import type { MetadataRoute } from "next"
import { catalog, catalogSyncedAt } from "@/lib/catalog"
import { siteConfig } from "@/lib/site"
import { categories } from "@/lib/v2"

/**
 * Sitemap: la portada, las categorías, el índice de modelos y la ficha de cada modelo. /bitacora queda afuera (es una maqueta, con noindex).
 * lastModified sale de la última sincronización con Drive, que es cuando cambia el contenido.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = catalogSyncedAt ? new Date(catalogSyncedAt) : new Date()
  return [
    { url: siteConfig.url, lastModified, changeFrequency: "weekly", priority: 1 },
    ...categories.map((c) => ({ url: `${siteConfig.url}/${c.slug}`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 })),
    { url: `${siteConfig.url}/modelos`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...catalog.map((p) => ({
      url: `${siteConfig.url}${p.url}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p.category === "lanchas" ? 0.8 : 0.7,
    })),
  ]
}
