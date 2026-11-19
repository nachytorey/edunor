/**
 * Piezas compartidas de la v2: barra superior negra (como el bosquejo), título de sección en franja negra
 * y pie. El menú del celular es un <details>: anda sin JavaScript.
 */
import { EdunorLogo } from "@/components/edunor-logo"
import { contact } from "@/lib/edunor"
import { locations, siteConfig, whatsappLink } from "@/lib/site"
import { categories, V2 } from "@/lib/v2"

export const WHATSAPP_V2 = whatsappLink()

const MENU = [
  ...categories.map((c) => ({ href: `${V2}/${c.slug}`, label: c.label })),
  { href: `${V2}/modelos`, label: "Todos los modelos" },
  { href: `${V2}#videos`, label: "Videos" },
  { href: `${V2}#nosotros`, label: "Nosotros" },
  { href: `${V2}#locales`, label: "Locales" },
  { href: `${V2}#contacto`, label: "Contacto" },
]

export function V2Header() {
  return (
    <header className="v2-bar">
      <a href={V2} className="v2-bar__logo" aria-label="Edunor Náutica, inicio">
        <EdunorLogo mono />
      </a>
      <nav className="v2-bar__nav" aria-label="Principal">
        {categories.map((c) => (
          <a key={c.slug} href={`${V2}/${c.slug}`}>
            {c.label}
          </a>
        ))}
      </nav>
      <details className="v2-menu">
        <summary aria-label="Menú">
          <span />
          <span />
          <span />
        </summary>
        <nav className="v2-menu__panel" aria-label="Menú">
          {MENU.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href={WHATSAPP_V2} target="_blank" rel="noreferrer" className="v2-menu__cta">
            Escribinos por WhatsApp
          </a>
        </nav>
      </details>
    </header>
  )
}

/**
 * Título de sección: etiqueta chica en condensada con una raya ("— PRODUCTOS") y el título en serif,
 * con una palabra en itálica (<em>) de acento. Tres tipografías: serif para títulos, Barlow itálica pesada
 * (la del logo) para el hero y los nombres de producto, condensada para etiquetas y botones.
 */
export function SectionTitle({ id, kicker, children }: { id?: string; kicker: string; children: React.ReactNode }) {
  return (
    <div className="v2-head">
      <p className="v2-head__kicker">
        <span className="v2-head__line" aria-hidden="true" />
        {kicker}
      </p>
      <h2 id={id} className="v2-head__title">
        {children}
      </h2>
    </div>
  )
}

export function V2Footer() {
  return (
    <footer id="contacto" className="v2-footer">
      <div className="v2-footer__brand">
        <EdunorLogo mono />
        <p>Empresa familiar desde 1963.</p>
      </div>
      <div>
        <h2>Contacto</h2>
        <ul>
          <li>
            <a href={WHATSAPP_V2} target="_blank" rel="noreferrer">
              WhatsApp {siteConfig.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.emails[0]}`}>{contact.emails[0]}</a>
          </li>
          {contact.phones.map((ph) => (
            <li key={ph}>
              <a href={`tel:+54${ph.replace(/\D/g, "")}`}>{ph}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Locales</h2>
        <ul>
          {locations.map((l) => (
            <li key={l.id}>
              {l.name}: {l.address}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Seguinos</h2>
        <ul>
          <li>
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href={contact.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
