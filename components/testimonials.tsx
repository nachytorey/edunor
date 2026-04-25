"use client"

import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "El nivel de atención y asesoramiento fue excepcional. Encontré exactamente la embarcación que buscaba y el servicio posventa sigue siendo impecable dos años después.",
    name: "Martín Rodríguez",
    role: "Propietario Open 250 Sport",
    rating: 5,
  },
  {
    quote:
      "Compré mi UTV con ellos y la experiencia superó mis expectativas. Equipo profesional, transparente y con un conocimiento técnico envidiable.",
    name: "Laura Giménez",
    role: "Propietaria Maverick X3",
    rating: 5,
  },
  {
    quote:
      "Llevo más de 10 años comprando con Edunor. La calidad de las unidades y la seriedad del equipo son únicas en la industria.",
    name: "Gonzalo Pérez",
    role: "Cliente fidelizado",
    rating: 5,
  },
  {
    quote:
      "La mejor decisión que tomé fue confiar en ellos para mi primer bote. Me acompañaron en cada paso y hoy tengo exactamente la embarcación que soñaba.",
    name: "Sofía Ibarra",
    role: "Propietaria Cruiser 320",
    rating: 5,
  },
  {
    quote:
      "Profesionales de punta a punta. Desde la entrega hasta los mantenimientos anuales, todo impecable. Recomiendo ampliamente.",
    name: "Diego Fernández",
    role: "Propietario Ranger 1000",
    rating: 5,
  },
]

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
  const [selected, setSelected] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()

    const autoplay = setInterval(() => emblaApi.scrollNext(), 6000)
    return () => {
      clearInterval(autoplay)
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <section className="relative py-28 md:py-40 bg-[#060606] border-y border-border overflow-hidden">
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-primary">— Testimonios</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance max-w-2xl">
              Lo que dicen nuestros <span className="text-primary italic">clientes</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Testimonio anterior"
              className="h-11 w-11 inline-flex items-center justify-center border border-border rounded-full text-foreground/70 hover:text-primary hover:border-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Siguiente testimonio"
              className="h-11 w-11 inline-flex items-center justify-center border border-border rounded-full text-foreground/70 hover:text-primary hover:border-primary transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((t, i) => {
              const initials = t.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
              return (
                <div
                  key={i}
                  className="flex-[0_0_100%] md:flex-[0_0_60%] lg:flex-[0_0_42%] min-w-0"
                >
                  <article className="relative h-full bg-card border border-border rounded-sm p-8 md:p-10">
                    <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/15" aria-hidden />
                    <div className="flex items-center gap-1 mb-6">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="h-4 w-4 text-primary"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <blockquote className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90 text-pretty">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <footer className="mt-8 pt-6 border-t border-border flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center text-sm font-medium tracking-wider">
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm text-foreground">{t.name}</div>
                        <div className="text-xs uppercase tracking-[0.2em] text-foreground/50 mt-0.5">
                          {t.role}
                        </div>
                      </div>
                    </footer>
                  </article>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al testimonio ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1 rounded-full transition-all ${
                selected === i ? "bg-primary w-8" : "bg-foreground/20 w-4"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
