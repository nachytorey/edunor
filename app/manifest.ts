import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Edunor",
    description: "Lanchas, cuatriciclos y service oficial desde 1963.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F4EE",
    theme_color: "#0a1f44",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  }
}
