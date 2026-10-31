"use client"

import { useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Capa de movimiento de toda la landing. Lee atributos data-* del marcado
 * (que es server-rendered y visible sin JavaScript) y los anima con GSAP.
 * Todo lo que esconde contenido vive adentro de prefers-reduced-motion: no-preference.
 */
export function Motion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const q = gsap.utils.selector(root)
      const header = q<HTMLElement>("[data-site-header]")[0]

      // Tinta de la cabecera según el capítulo (no es movimiento: corre siempre).
      q<HTMLElement>("[data-ink]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 40px",
          end: "bottom 40px",
          onToggle: (self) => {
            if (self.isActive && header) header.dataset.ink = section.dataset.ink ?? "dark"
          },
        })
      })

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. La jugada principal: las dos líneas suben desde su propia base.
        const hero = q<HTMLElement>("[data-hero]")[0]
        if (hero) {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } })
          tl.from(hero.querySelectorAll("[data-line]"), { yPercent: 110, duration: 0.9, stagger: 0.11 }, 0.15)
            .from(hero.querySelector("[data-hero-print]"), { autoAlpha: 0, scale: 1.08, y: 60, duration: 1.1 }, 0.35)
            .from(
              hero.querySelectorAll("[data-hero-fade]"),
              { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.08, ease: "power3.out" },
              0.7
            )
        }

        // 2. Capítulos de producto: el campo crece desde un panel, el retrato se asienta.
        q<HTMLElement>("[data-chapter]").forEach((chapter) => {
          const field = chapter.querySelector("[data-field]")
          const portrait = chapter.querySelector("[data-portrait]")
          const image = portrait?.querySelector("img")

          const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: chapter, start: "top 70%", once: true },
          })
          tl.fromTo(field, { clipPath: "inset(20px)" }, { clipPath: "inset(0px)", duration: 0.6, ease: "power3.out" }, 0)
            .from(portrait, { scale: 0.92, autoAlpha: 0, duration: 0.8 }, 0)
            .from(chapter.querySelectorAll("[data-line]"), { yPercent: 110, duration: 0.8, stagger: 0.09 }, 0.1)
            .from(
              chapter.querySelectorAll("[data-rise]"),
              { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.07, ease: "power3.out" },
              0.3
            )

          if (image) {
            gsap.fromTo(
              image,
              { yPercent: -5, scale: 1.12 },
              {
                yPercent: 5,
                scale: 1.12,
                ease: "none",
                scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: true },
              }
            )
          }
        })

        // 3. Títulos que suben línea por línea al entrar.
        q<HTMLElement>("[data-lines-scroll]").forEach((heading) => {
          gsap.from(heading.querySelectorAll("[data-line]"), {
            yPercent: 110,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: heading, start: "top 85%", once: true },
          })
        })

        // 4. Entradas por sección: cada parte llega en orden de lectura.
        q<HTMLElement>("[data-rise-group]").forEach((group) => {
          gsap.from(group.querySelectorAll("[data-rise]"), {
            autoAlpha: 0,
            y: 24,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          })
        })

        // 5. Copias que caen sobre el campo amarillo.
        q<HTMLElement>("[data-prints]").forEach((group) => {
          gsap.from(group.querySelectorAll("[data-print]"), {
            autoAlpha: 0,
            y: 140,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: group, start: "top 80%", once: true },
          })
        })

        // 6. Filas de marcas, una por una.
        q<HTMLElement>("[data-bars]").forEach((group) => {
          gsap.from(group.children, {
            autoAlpha: 0,
            x: -24,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          })
        })

        // 7. Fotos que se abren de arriba hacia abajo.
        q<HTMLElement>("[data-open]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            }
          )
        })

        // 8. La foto del pie deriva con el scroll.
        const drift = q<HTMLElement>("[data-drift]")[0]
        const driftImg = drift?.querySelector("img")
        if (drift && driftImg) {
          gsap.fromTo(
            driftImg,
            { scale: 1.12, yPercent: -4 },
            {
              scale: 1.12,
              yPercent: 4,
              ease: "none",
              scrollTrigger: { trigger: drift, start: "top bottom", end: "bottom bottom", scrub: true },
            }
          )
        }
      })
    },
    { scope: ref }
  )

  return <div ref={ref}>{children}</div>
}
