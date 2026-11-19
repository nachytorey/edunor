"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Lo que cada entrada deja en línea y hay que borrar al terminar, para no pisar los :hover del CSS. */
const CLEAR = "transform,opacity,visibility,clipPath"

/**
 * Movimiento de la v2: sobrio, sin interacción. Todo se dispara solo con el scroll y una sola vez.
 * - Hero: el texto entra de abajo en tanda y la foto se desplaza apenas más lento que la página (parallax).
 * - Encabezados: la raya de la etiqueta crece y el título en serif sube detrás de una máscara.
 * - Fotos (Nosotros, categorías, mapas): se descubren con un corte de abajo hacia arriba.
 * - Textos, marcas, tarjetas y reseñas: suben en tanda.
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
      const once = (trigger: Element, start = "top 85%") => ({ trigger, start, once: true })

      // ── Hero: entrada del texto y parallax de la foto ──
      const hero = document.querySelector(".v2-hero")
      if (hero) {
        gsap.set(".v2-hero__text", { autoAlpha: 1 })
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".v2-hero h1", { y: 60, autoAlpha: 0, duration: 1.1, clearProps: CLEAR })
          .from(".v2-hero h1 span", { y: 24, autoAlpha: 0, duration: 0.9, clearProps: CLEAR }, "-=0.7")
          .from(".v2-hero__ctas > *", { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1, clearProps: CLEAR }, "-=0.6")
          .from(".v2-hero__dots", { autoAlpha: 0, duration: 0.6, clearProps: CLEAR }, "-=0.4")

        gsap.to(".v2-hero__slides", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        })
        gsap.to(".v2-hero__text", {
          yPercent: -30,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        })
      }

      // ── Encabezados: la raya crece y el título sube detrás de una máscara ──
      all(".v2-head, .v2-brands > .v2-head__kicker").forEach((head) => {
        const tl = gsap.timeline({ scrollTrigger: once(head, "top 88%") })
        tl.from(head.querySelector(".v2-head__line"), { scaleX: 0, duration: 0.7, ease: "power3.inOut", clearProps: CLEAR })
        const kicker = head.matches(".v2-head__kicker") ? head : head.querySelector(".v2-head__kicker")
        tl.from(kicker, { x: -12, autoAlpha: 0, duration: 0.5, ease: "power2.out", clearProps: "transform,opacity,visibility" }, "-=0.35")
        const title = head.querySelector(".v2-head__title")
        if (title) {
          tl.fromTo(
            title,
            { yPercent: 40, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
            { yPercent: 0, autoAlpha: 1, clipPath: "inset(0 0 -20% 0)", duration: 1.1, ease: "expo.out", clearProps: CLEAR },
            "-=0.3",
          )
        }
      })

      // ── Fotos: corte de abajo hacia arriba, con la imagen que se acomoda ──
      all(".v2-about__photo, .v2-place iframe").forEach((el) => {
        gsap.from(el, { clipPath: "inset(100% 0 0 0)", duration: 1.2, ease: "expo.out", clearProps: CLEAR, scrollTrigger: once(el) })
      })
      const cats = all(".v2-cat")
      if (cats.length) {
        gsap.from(cats, {
          clipPath: "inset(100% 0 0 0)",
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          clearProps: CLEAR,
          scrollTrigger: once(cats[0]),
        })
        gsap.from(".v2-cat img", { scale: 1.18, duration: 1.6, ease: "expo.out", stagger: 0.12, clearProps: CLEAR, scrollTrigger: once(cats[0]) })
      }

      // ── Bloques de texto y tarjetas: suben en tanda a medida que aparecen ──
      const rise = (sel: string, opts: gsap.TweenVars = {}) => {
        const items = all(sel)
        if (!items.length) return
        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.from(batch, { y: 36, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, clearProps: CLEAR, ...opts }),
        })
      }
      rise(".v2-about__copy > p, .v2-more")
      rise(".v2-brands__row li", { y: 20, stagger: 0.06 })
      rise(".v2-stats dl > div")
      rise(".v2-place__info > *", { y: 16, stagger: 0.05 })
      rise(".v2-review, .v2-reviews__ctas > *")
      rise(".v2-catpage__head p, .v2-card")
      rise(".v2 .pal-vgrid__card", { y: 40, stagger: 0.07 })
      rise(".v2-pd__info > *, .v2-pager a", { y: 18, stagger: 0.05 })
      rise(".v2-tabs a", { y: 14, stagger: 0.06 })

      // ── Números: cuentan desde cero (respetan el "+" y el punto de miles) ──
      all(".v2-stats dd").forEach((dd) => {
        const raw = dd.textContent ?? ""
        const target = Number(raw.replace(/\D/g, ""))
        if (!target) return
        const prefix = raw.match(/^\D*/)?.[0] ?? ""
        const n = { v: 0 }
        gsap.to(n, {
          v: target,
          duration: 1.8,
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
