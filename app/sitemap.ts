import type { MetadataRoute } from "next"
import { catalog, catalogSyncedAt } from "@/lib/catalog"
import { siteConfig } from "@/lib/site"

/**
 * Sitemap: la portada y la ficha de cada modelo. /bitacora queda afuera (es una maqueta, con noindex).
 * lastModified sale de la última sincronización con Drive, que es cuando cambia el contenido.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = catalogSyncedAt ? new Date(catalogSyncedAt) : new Date()
  return [
    { url: siteConfig.url, lastModified, changeFrequency: "weekly", priority: 1 },
    ...catalog.map((p) => ({
      url: `${siteConfig.url}${p.url}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p.category === "lanchas" ? 0.8 : 0.7,
    })),
  ]
}
