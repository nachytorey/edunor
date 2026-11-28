/**
 * Piezas compartidas de la v2: barra superior (transparente sobre el hero, negra después), título de sección
 * y pie. El menú (components/v2/menu.tsx) es un panel simple que entra desde la derecha.
 */
import { EdunorLogo } from "@/components/edunor-logo"
import { V2Menu } from "@/components/v2/menu"
import { contact } from "@/lib/edunor"
import { locations, siteConfig, whatsappLink } from "@/lib/site"
import { categories } from "@/lib/v2"

export const WHATSAPP_V2 = whatsappLink()

const MENU = [
  ...categories.map((c) => ({ href: `/${c.slug}`, label: c.label })),
  { href: `/modelos`, label: "Todos los modelos" },
  { href: `/#videos`, label: "Videos" },
  { href: `/#nosotros`, label: "Nosotros" },
  { href: `/#locales`, label: "Locales" },
  { href: `/#contacto`, label: "Contacto" },
]

export function V2Header() {
  return (
    <header className="v2-bar">
      <a href="/" className="v2-bar__logo" aria-label="Edunor Náutica, inicio">
        <EdunorLogo mono />
      </a>
      <nav className="v2-bar__nav" aria-label="Principal">
        {categories.map((c) => (
          <a key={c.slug} href={`/${c.slug}`}>
            {c.label}
          </a>
        ))}
      </nav>
      <V2Menu links={MENU} whatsapp={WHATSAPP_V2} />
    </header>
  )
}

/**
 * Título de sección: etiqueta chica condensada con una raya ("— PRODUCTOS") y el título en Archivo expandida,
 * con una palabra en itálica (<em>) de acento. Una sola familia (Archivo) en tres anchos: expandida para títulos,
 * normal (itálica pesada, la del logo) para el hero y los nombres de producto, condensada para etiquetas y botones.
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

/* Botón flotante de WhatsApp, fijo abajo a la derecha en todas las páginas. wa.me abre la app en el celular
   y WhatsApp Web (o la app de escritorio, si está instalada) en la compu. */
export function V2WhatsAppFab() {
  return (
    <a className="v2-wa" href={WHATSAPP_V2} target="_blank" rel="noreferrer" aria-label="Escribinos por WhatsApp">
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="currentColor">
        <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.8c-1.98 0-3.92-.53-5.61-1.54l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.77 10.77 0 0 1 5.2 16c0-5.97 4.86-10.83 10.84-10.83 5.97 0 10.8 4.86 10.8 10.83 0 5.98-4.83 10.8-10.8 10.8Zm5.93-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.1-.22.05-.41-.03-.57-.08-.16-.73-1.77-1-2.42-.27-.64-.54-.55-.73-.56h-.63c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.72s1.17 3.15 1.33 3.37c.16.22 2.3 3.5 5.56 4.91.78.34 1.38.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.42.19-1.55-.08-.14-.3-.22-.62-.38Z" />
      </svg>
    </a>
  )
}
