"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Lo que cada entrada deja en línea y hay que borrar al terminar, para no pisar los :hover del CSS. */
const CLEAR = "transform,opacity,visibility"

/**
 * Movimiento de la v2: poco y tranquilo. Nada se mueve atado al scroll (sin parallax ni cortes) y todo pasa
 * una sola vez. Se sacaron el parallax del hero, el zoom de las fotos, los cortes que destapaban imágenes y
 * las tandas de a uno: mareaban.
 * - Hero: el texto entra de abajo al cargar.
 * - Encabezados: la raya crece y el título aparece.
 * - Cada bloque aparece con un fundido corto hacia arriba al entrar en pantalla (el bloque entero, no ítem por ítem).
 * - Números: cuentan desde cero.
 * No renderiza nada: busca los elementos por clase. Con "reducir movimiento" no se anima nada
 * (y el texto del hero, que el CSS esconde para que no parpadee, se muestra de una).
 */
export function V2Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".v2-hero__text", { autoAlpha: 1 })
    })

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const all = (sel: string) => gsap.utils.toArray<HTMLElement>(sel)
      const once = (trigger: Element, start = "top 88%") => ({ trigger, start, once: true })

      // ── Hero: entrada del texto, una sola vez ──
      if (document.querySelector(".v2-hero")) {
        gsap.set(".v2-hero__text", { autoAlpha: 1 })
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .from(".v2-hero h1", { y: 30, autoAlpha: 0, duration: 0.9, clearProps: CLEAR })
          .from(".v2-hero h1 span, .v2-hero__ctas", { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.12, clearProps: CLEAR }, "-=0.5")
      }

      // ── Encabezados: la raya crece y el título aparece ──
      all(".v2-head, .v2-brands > .v2-head__kicker").forEach((head) => {
        const tl = gsap.timeline({ scrollTrigger: once(head) })
        tl.from(head.querySelector(".v2-head__line"), { scaleX: 0, duration: 0.6, ease: "power2.inOut", clearProps: CLEAR })
        const title = head.querySelector(".v2-head__title")
        if (title) tl.from(title, { y: 16, autoAlpha: 0, duration: 0.7, ease: "power2.out", clearProps: CLEAR }, "-=0.3")
      })

      // ── Bloques: fundido corto hacia arriba, el bloque entero ──
      all(
        [
          ".v2-about__copy > p, .v2-more, .v2-about__photo",
          ".v2-cats",
          ".v2-brands__row",
          ".v2-stats dl",
          ".v2 .pal-vgrid",
          ".v2-places__grid",
          ".v2-reviews__track, .v2-reviews__ctas",
          ".v2-catpage__head p, .v2-grid",
          ".v2-pd__info, .v2-pager",
        ].join(", "),
      ).forEach((el) => {
        gsap.from(el, { y: 20, autoAlpha: 0, duration: 0.8, ease: "power2.out", clearProps: CLEAR, scrollTrigger: once(el) })
      })

      // ── Números: cuentan desde cero (respetan el "+" y el punto de miles) ──
      all(".v2-stats dd").forEach((dd) => {
        const raw = dd.textContent ?? ""
        const target = Number(raw.replace(/\D/g, ""))
        if (!target) return
        const prefix = raw.match(/^\D*/)?.[0] ?? ""
        const n = { v: 0 }
        gsap.to(n, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: once(dd, "top 90%"),
          onUpdate: () => {
            dd.textContent = prefix + Math.round(n.v).toLocaleString("es-AR")
          },
          onComplete: () => {
            dd.textContent = raw
          },
        })
      })
    })
  })

  return null
}
