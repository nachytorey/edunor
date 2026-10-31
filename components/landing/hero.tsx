"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import type { World } from "@/lib/products"

const worlds: Record<
  World,
  { label: string; image: string; alt: string; cta: string; href: string; ink: "light" | "dark" }
> = {
  agua: {
    label: "Agua",
    image: "/images/products/bote-open-250.jpg",
    alt: "Lancha Open 250 Sport fondeada de noche",
    cta: "Ver lanchas",
    href: "#lanchas",
    ink: "light",
  },
  tierra: {
    label: "Tierra",
    image: "/images/products/quad-sportsman-850.jpg",
    alt: "Cuatriciclo Sportsman 850 sobre piedras",
    cta: "Ver cuatriciclos",
    href: "#cuatriciclos",
    ink: "dark",
  },
}

/**
 * Portada. Lo vivo: el visitante elige agua o tierra con el pulgar y la portada
 * cambia de campo, de foto y de destino. Sin JavaScript queda en agua.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [world, setWorld] = useState<World>("agua")

  const { contextSafe } = useGSAP(() => {}, { scope: ref })

  const choose = contextSafe((next: World) => {
    if (next === world) return
    setWorld(next)
    const prints = ref.current?.querySelectorAll<HTMLImageElement>("[data-world-img]") ?? []
    prints.forEach((img) => {
      const on = img.dataset.worldImg === next
      gsap.to(img, { autoAlpha: on ? 1 : 0, scale: on ? 1 : 1.06, duration: 0.7, ease: "expo.out", overwrite: true })
    })
    const header = document.querySelector<HTMLElement>("[data-site-header]")
    if (header) header.dataset.ink = worlds[next].ink
  })

  const current = worlds[world]

  return (
    <section ref={ref} className="hero" data-hero data-world={world} data-ink={current.ink} aria-labelledby="hero-title">
      <h1 id="hero-title" className="display hero__title lines">
        <span className="line">
          <span data-line>Agua</span>
        </span>
        <span className="line">
          <span data-line>y tierra</span>
        </span>
      </h1>

      <div className="hero__print" data-hero-print>
        <div className="hero__print-inner">
          {(Object.keys(worlds) as World[]).map((key) => (
            <Image
              key={key}
              src={worlds[key].image}
              alt={worlds[key].alt}
              width={1024}
              height={1024}
              priority={key === "agua"}
              data-world-img={key}
              aria-hidden={key !== world}
            />
          ))}
        </div>
      </div>

      <div className="hero__bottom">
        <div className="switch" role="group" aria-label="Elegí qué querés ver" data-hero-fade>
          {(Object.keys(worlds) as World[]).map((key) => (
            <button key={key} type="button" aria-pressed={world === key} onClick={() => choose(key)}>
              {worlds[key].label}
            </button>
          ))}
        </div>
        <p className="hero__lede" data-hero-fade>
          Lanchas y cuatriciclos con service oficial, en Témperley y Canning desde 1963.
        </p>
        <div className="hero__actions" data-hero-fade>
          <a className="btn" href={current.href}>
            {current.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
