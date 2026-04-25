"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, ExternalLink } from "lucide-react"
import { locations, mapsLink } from "@/lib/site"

export function Locations() {
  return (
    <section id="sucursales" className="relative py-28 md:py-40 border-t border-border bg-card/30">
      <div className="container-luxe">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">— Sucursales</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
            Dos locales, <span className="text-primary italic">un mismo servicio</span>
          </h2>
          <p className="mt-6 text-foreground/70 leading-relaxed text-pretty">
            Visitanos en cualquiera de nuestras sucursales en la Zona Sur del Gran Buenos Aires.
            Te esperamos con el mejor asesoramiento para tu próxima compra.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              <article className="group relative overflow-hidden rounded-sm border border-border bg-card p-8 md:p-10 hover:border-primary/50 transition-colors flex-shrink-0">
                <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 blur-3xl rounded-sm" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
                        0{i + 1} — Buenos Aires
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                        {loc.name}
                      </h3>
                    </div>
                    <div className="h-11 w-11 inline-flex items-center justify-center rounded-sm border border-primary/30 text-primary flex-shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-4 text-sm">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-1">
                        Dirección
                      </div>
                      <p className="text-foreground/90 leading-relaxed">
                        {loc.address}
                        <br />
                        {loc.city}
                        <br />
                        {loc.region}
                      </p>
                    </div>

                    {loc.phones.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-1">
                          Teléfonos
                        </div>
                        <ul className="flex flex-wrap gap-x-4 gap-y-1">
                          {loc.phones.map((p) => (
                            <li key={p}>
                              <a
                                href={`tel:${p.replace(/\s/g, "")}`}
                                className="inline-flex items-center gap-2 text-foreground/90 hover:text-primary transition-colors"
                              >
                                <Phone className="h-3.5 w-3.5 text-primary" />
                                {p}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* <div className="mt-8 pt-6 border-t border-border">
                    <a
                      href={mapsLink(loc.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary hover:gap-3 transition-all"
                    >
                      Ver en Google Maps
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div> */}
                </div>
              </article>

              {/* <div className="w-full h-80 rounded-sm border border-border overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBnr5A-DyZC3R0Y0KlDQg3-3j3Xq3z-yBY&q=${encodeURIComponent(loc.address + " " + loc.city)}`}
                />
              </div> */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
