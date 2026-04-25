"use client"

import { motion } from "framer-motion"
import { Mail, Phone, Clock } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { siteConfig, whatsappLink } from "@/lib/site"
import { ContactForm } from "@/components/contact-form"

export function Contact() {
  return (
    <section id="contacto" className="relative py-28 md:py-40 border-t border-border">
      <div className="container-luxe grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-primary">— Contacto</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
            Hablemos de tu <span className="text-primary italic">próxima aventura</span>
          </h2>
          <p className="mt-6 text-foreground/70 leading-relaxed text-pretty">
            Dejanos tu consulta y uno de nuestros asesores te contactará a la brevedad para
            ofrecerte la mejor opción para tu tiempo libre.
          </p>

          <ul className="mt-10 flex flex-col gap-5">
            <li>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors"
              >
                <span className="h-12 w-12 inline-flex items-center justify-center rounded-full border border-border group-hover:border-primary transition-colors">
                  <Phone className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                    Teléfono
                  </span>
                  <span className="block text-base">{siteConfig.phone}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors"
              >
                <span className="h-12 w-12 inline-flex items-center justify-center rounded-full border border-border group-hover:border-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                    Email
                  </span>
                  <span className="block text-base">{siteConfig.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors"
              >
                <span className="h-12 w-12 inline-flex items-center justify-center rounded-full border border-border group-hover:border-primary transition-colors">
                  <FaWhatsapp className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                    WhatsApp
                  </span>
                  <span className="block text-base">Chateá con un asesor</span>
                </span>
              </a>
            </li>
            <li className="flex items-center gap-4 text-foreground/80">
              <span className="h-12 w-12 inline-flex items-center justify-center rounded-full border border-border">
                <Clock className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                  Horarios
                </span>
                <span className="block text-base">Lun a Vie 9 a 18 · Sáb 9 a 13</span>
              </span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="rounded-sm border border-border bg-card p-8 md:p-10"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  )
}
