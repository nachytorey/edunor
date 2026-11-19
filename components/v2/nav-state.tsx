"use client"

import { useEffect } from "react"

/**
 * La barra de la portada nace transparente desde el CSS (`.v2:has(.v2-hero) .v2-bar:not([data-solid])`),
 * así no parpadea al cargar. Acá solo se le pone data-solid cuando el hero terminó de pasar por debajo
 * (y se le saca al volver), y el CSS la pasa a negra. Sin hero, el CSS ya la deja negra. No renderiza nada.
 */
export function NavState() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".v2-bar")
    const hero = document.querySelector(".v2-hero")
    if (!bar || !hero) return
    // El margen superior negativo es el alto de la barra: el hero "sale" cuando su borde inferior pasa por debajo de ella.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) delete bar.dataset.solid
        else bar.dataset.solid = ""
      },
      { rootMargin: `-${bar.offsetHeight}px 0px 0px 0px` },
    )
    io.observe(hero)
    return () => {
      io.disconnect()
      delete bar.dataset.solid
    }
  }, [])
  return null
}
