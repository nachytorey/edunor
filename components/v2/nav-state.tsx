"use client"

import { useEffect } from "react"

/**
 * Barra transparente sobre el hero: mientras el hero está debajo de la barra, le pone data-over-hero
 * y el CSS la deja transparente; cuando el hero termina de pasar, se lo saca y vuelve a ser negra.
 * Sin hero (categorías, fichas) o sin JavaScript, la barra queda negra. No renderiza nada.
 */
export function NavState() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".v2-bar")
    const hero = document.querySelector(".v2-hero")
    if (!bar || !hero) return
    // El margen superior negativo es el alto de la barra: el hero "sale" cuando su borde inferior pasa por debajo de ella.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) bar.dataset.overHero = ""
        else delete bar.dataset.overHero
      },
      { rootMargin: `-${bar.offsetHeight}px 0px 0px 0px` },
    )
    io.observe(hero)
    return () => {
      io.disconnect()
      delete bar.dataset.overHero
    }
  }, [])
  return null
}
