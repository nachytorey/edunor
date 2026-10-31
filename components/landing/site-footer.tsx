import Image from "next/image"
import { EdunorLogo } from "@/components/edunor-logo"
import { locations, mapsLink, navLinks, siteConfig, whatsappLink } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="footer" data-ink="light">
      <div className="footer__photo" data-drift>
        <Image
          src="/images/hero.jpg"
          alt="Lancha navegando en mar abierto al atardecer, vista desde arriba"
          width={1024}
          height={1024}
          sizes="(max-width: 767px) 100vw, 50vw"
          loading="lazy"
        />
      </div>

      <div className="footer__menu">
        <a href="#" className="footer__brand" aria-label="Edunor Náutica, volver arriba">
          <EdunorLogo className="brand-logo" />
        </a>

        <nav aria-label="Mapa del sitio">
          <ul className="footer__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </nav>

        <div className="footer__blocks">
          <div>
            <h2>Sucursales</h2>
            {locations.map((l) => (
              <p key={l.id}>
                <a href={mapsLink(l.mapsQuery)} target="_blank" rel="noopener noreferrer">
                  {l.name}: {l.address}
                </a>
              </p>
            ))}
            <p>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
            </p>
            <p>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
          </div>
          <div>
            <h2>Redes</h2>
            <p>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </p>
            <p>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </p>
            <p>
              <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </p>
          </div>
        </div>

        <p className="footer__legal">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span>{siteConfig.tagline}</span>
        </p>
      </div>
    </footer>
  )
}
