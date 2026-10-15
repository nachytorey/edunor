import { siteConfig, whatsappLink } from "@/lib/site"
import { Reveal } from "@/components/landing/reveal"

export function ContactCta() {
  return (
    <section id="contacto" className="px-5 pb-32 md:px-10 md:pb-56">
      <Reveal>
        <p className="text-statement max-w-[30ch] text-pretty">
          ¿Querés saber más sobre un producto o coordinar un service? Escribinos y te
          respondemos en el día.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          Escribinos por WhatsApp
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="rounded-full border border-foreground/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground/5"
        >
          {siteConfig.email}
        </a>
      </Reveal>
    </section>
  )
}
