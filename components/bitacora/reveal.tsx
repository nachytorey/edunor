"use client"

import { useEffect, type ReactNode } from "react"

/* Un solo IntersectionObserver para todos los .reveal de la página.
   Sin JS (o con reduced-motion) todo queda visible vía CSS. */
export function RevealProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".bitacora")
    root?.classList.remove("no-js")

    const items = Array.from(document.querySelectorAll<HTMLElement>(".bitacora .reveal"))
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return <>{children}</>
}
