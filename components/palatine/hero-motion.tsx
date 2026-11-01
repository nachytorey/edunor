"use client"

import { useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Hero de la portada con la foto a pantalla completa, en clave "velocidad":
 * - Entrada: la foto se abre con un corte diagonal, sale de foco (desenfoque → nítida) y la cruza
 *   un destello; las palabras del título entran derrapando desde la derecha y el subtítulo aparece con un fundido suave.
 * - Después la foto sigue acercándose muy lento.
 * - Scroll: la foto baja más lento que la página, el texto se va antes, y todo se inclina un poco
 *   según la velocidad del scroll.
 * Mientras no corre la entrada, el CSS esconde el hero (.pal-hero:not(.is-ready)); con
 * "reducir movimiento" no se esconde ni se anima nada.
 */
export function HeroMotion({ children, labelledBy }: { children: ReactNode; labelledBy: string }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hero = root.current!
        const porthole = hero.querySelector<HTMLElement>(".pal-hero__porthole")!
        const img = porthole.querySelector("img")!
        const flash = hero.querySelector<HTMLElement>(".pal-hero__flash")
        const text = hero.querySelector<HTMLElement>(".pal-hero__text")!
        const words = hero.querySelectorAll<HTMLElement>(".pal-hero__word")
        const sub = hero.querySelector<HTMLElement>(".pal-hero__sub")

        hero.classList.add("is-ready")
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } })
        intro
          .fromTo(
            porthole,
            { clipPath: "polygon(0 0, 0 0, -30% 100%, -30% 100%)" },
            { clipPath: "polygon(0 0, 130% 0, 100% 100%, -30% 100%)", duration: 1.3, ease: "expo.inOut" },
          )
          .fromTo(img, { scale: 1.2, filter: "blur(14px)" }, { scale: 1, filter: "blur(0px)", duration: 2 }, "<0.2")
        if (flash) {
          intro.fromTo(
            flash,
            { xPercent: -150, autoAlpha: 1 },
            { xPercent: 700, autoAlpha: 0.2, duration: 1.1, ease: "power2.inOut" },
            "<0.35",
          )
        }
        intro.from(
          words,
          { x: 220, skewX: -24, autoAlpha: 0, filter: "blur(10px)", duration: 1.1, stagger: 0.14 },
          "<0.25",
        )
        // Subtítulo: fundido suave que sube apenas, sin efectos que distraigan de leerlo.
        if (sub) intro.from(sub, { y: 18, autoAlpha: 0, duration: 1.2, ease: "power2.out" }, "<0.45")
        // Acercamiento lento que sigue mientras el hero está a la vista.
        intro.to(img, { scale: 1.07, duration: 18, ease: "sine.inOut", repeat: -1, yoyo: true })

        // Al bajar: la foto se queda atrás y el texto se va primero.
        const scroll = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 }
        gsap.to(porthole, { yPercent: 22, ease: "none", scrollTrigger: scroll })
        gsap.to(text, { yPercent: -60, autoAlpha: 0, ease: "none", scrollTrigger: { ...scroll, end: "60% top" } })

        // Inclinación según la velocidad del scroll, que vuelve sola a 0.
        const skew = gsap.quickTo(porthole, "skewY", { duration: 0.5, ease: "power3" })
        const settle = gsap.delayedCall(0.15, () => skew(0)).pause()
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            skew(gsap.utils.clamp(-4, 4, self.getVelocity() / -400))
            settle.restart(true)
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="pal-hero" aria-labelledby={labelledBy}>
      {children}
    </section>
  )
}
