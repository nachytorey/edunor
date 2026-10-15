import { siteConfig, whatsappLink } from "@/lib/site"

const sitemap = [
  { href: "#", label: "Inicio" },
  { href: "#que-hacemos", label: "Qué hacemos" },
  { href: "#sucursales", label: "Sucursales" },
  { href: "#contacto", label: "Contacto" },
]

const social = [
  { href: siteConfig.social.instagram, label: "Instagram" },
  { href: siteConfig.social.facebook, label: "Facebook" },
  { href: siteConfig.social.youtube, label: "YouTube" },
  { href: whatsappLink(), label: "WhatsApp" },
]

export function SiteFooter() {
  return (
    // Queda fijo abajo, detrás del contenido, y se descubre al terminar el scroll
    <footer className="sticky bottom-0 z-0 flex min-h-svh flex-col bg-footer px-5 py-5 text-footer-foreground md:px-10 md:py-10">
      <div className="grid grid-cols-2 gap-8 text-lg md:grid-cols-12">
        <nav className="flex flex-col gap-3 md:col-span-3">
          {sitemap.map((link) => (
            <a key={link.label} href={link.href} className="opacity-70 transition-opacity hover:opacity-100">
              {link.label}
            </a>
          ))}
        </nav>
        <nav className="flex flex-col gap-3 md:col-span-3">
          {social.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="col-span-2 flex flex-col gap-1 opacity-70 md:col-span-4 md:col-start-9">
          <span>{siteConfig.phone}</span>
          <span>{siteConfig.email}</span>
        </div>
      </div>

      <div className="mt-auto">
        <p className="font-display text-[clamp(4rem,22vw,22rem)] leading-[0.8]">
          Edunor<sup className="text-[0.2em]">®</sup>
        </p>
        <div className="mt-6 flex flex-col justify-between gap-2 border-t border-current/20 pt-5 text-sm opacity-60 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span>{siteConfig.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
