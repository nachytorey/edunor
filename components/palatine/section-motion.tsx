"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Lo que cada entrada deja en línea y hay que borrar al terminar, para no pisar los :hover del CSS. */
const CLEAR = "transform,opacity,visibility,filter,clipPath"

/**
 * Movimiento de las secciones de la portada, en la misma clave "velocidad" que el hero:
 * - Títulos fantasma: se desplazan de costado mientras la sección pasa (scrub).
 * - Títulos de sección y "Visita"/"WhatsApp": entran derrapando desde la derecha.
 * - Fotos (modelos, generador, pila de UTV): se abren con un corte diagonal.
 * - Tarjetas, pasos, listas y botones: suben en tanda, uno detrás del otro.
 * - Sellos: entran girando.
 * No renderiza nada: busca los elementos por clase dentro de la portada.
 * Con "reducir movimiento" no se anima nada.
 */
export function SectionMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const page = document.querySelector<HTMLElement>(".pal-page main")
      if (!page) return
      const all = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(page.querySelectorAll(sel))
      const once = (trigger: Element, start = "top 82%") => ({ trigger, start, once: true })

      // Títulos fantasma: cruzan la pantalla según el lado en el que están.
      all(".pal-ghost").forEach((ghost) => {
        const title = ghost.querySelector(".pal-ghost__title")
        const dir = ghost.classList.contains("pal-ghost--left") ? 1 : -1
        gsap.fromTo(
          title,
          { xPercent: -14 * dir },
          {
            xPercent: 10 * dir,
            ease: "none",
            scrollTrigger: { trigger: ghost, start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        )
      })

      // Títulos de sección y llamados grandes: derrape desde la derecha.
      all(".pal-utv__title, .pal-about__title, .pal-chapter__title, .pal-video__title, .pal-contact__title, .pal-callout__big").forEach((el) => {
        gsap.from(el, {
          x: 160,
          skewX: -22,
          autoAlpha: 0,
          filter: "blur(8px)",
          duration: 1.1,
          ease: "expo.out",
          clearProps: CLEAR,
          scrollTrigger: once(el),
        })
      })

      // Fotos: corte diagonal + se alejan un poco.
      all(".pal-models__slider, .pal-gen__media, .pal-utv__stage > :last-child").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "polygon(0 0, 0 0, -25% 100%, -25% 100%)", scale: 1.06 },
          {
            clipPath: "polygon(0 0, 125% 0, 100% 100%, -25% 100%)",
            scale: 1,
            duration: 1.3,
            ease: "expo.inOut",
            clearProps: CLEAR,
            scrollTrigger: once(el, "top 85%"),
          },
        )
      })

      // Bloques chicos: suben en tanda a medida que aparecen.
      const items = all(
        [
          ".pal-utv__intro > p",
          ".pal-utv__models li",
          ".pal-video__head p",
          ".pal-reel__card",
          ".pal-gen__copy .pal-bubble",
          ".pal-gen__arrows",
          ".pal-about__lead",
          ".pal-about__intro > p:not(.pal-about__lead)",
          ".pal-about__intro .pal-signs",
          ".pal-chapter__kicker",
          ".pal-chapter__text p",
          ".pal-story__voices .pal-quote",
          ".pal-place__card",
          ".pal-contact__card li",
          ".pal-callout__small",
          ".pal-album__filters",
        ].join(","),
      )
      gsap.set(items, { y: 46, autoAlpha: 0 })
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, clearProps: CLEAR }),
      })

      // Sellos: giran y caen en su lugar.
      all(".pal-about__seal, .pal-place__seal").forEach((el) => {
        gsap.from(el, {
          rotate: -120,
          scale: 0.4,
          autoAlpha: 0,
          duration: 1.2,
          ease: "back.out(1.6)",
          clearProps: CLEAR,
          scrollTrigger: once(el, "top 88%"),
        })
      })

      // Galería: las primeras fotos aparecen en cascada (las que se suman con "Ver más" o los filtros, no).
      const photos = all(".pal-album .react-photo-album--photo")
      gsap.set(photos, { autoAlpha: 0, y: 40, scale: 0.96 })
      ScrollTrigger.batch(photos, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.06, clearProps: CLEAR }),
      })

      // Las fotos y los videos cargan sin tamaño fijo: cuando cambia la altura de la página se recalculan
      // las posiciones (si no, al entrar directo por un ancla los disparadores quedan corridos).
      let raf = 0
      const refresh = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => ScrollTrigger.refresh())
      }
      if (document.readyState === "complete") refresh()
      else window.addEventListener("load", refresh)
      const ro = new ResizeObserver(refresh)
      ro.observe(page)
      return () => {
        window.removeEventListener("load", refresh)
        ro.disconnect()
        cancelAnimationFrame(raf)
      }
    })
  })

  return null
}
