/**
 * Piezas compartidas de la v2: barra superior (transparente sobre el hero, negra después), título de sección
 * y pie. El menú (components/v2/menu.tsx) es un panel a pantalla completa: links con foto + contacto.
 */
import { EdunorLogo } from "@/components/edunor-logo"
import { V2Menu, type MenuLink } from "@/components/v2/menu"
import { contact } from "@/lib/edunor"
import { locations, mapsLink, siteConfig, whatsappLink } from "@/lib/site"
import { categories, heroSlides, V2 } from "@/lib/v2"

export const WHATSAPP_V2 = whatsappLink()

/** Links del menú, cada uno con la foto que se muestra al señalarlo. "Contacto" no va: el panel ya lo muestra. */
const slide = (n: number) => heroSlides[n % heroSlides.length]
const MENU: MenuLink[] = [
  ...categories.map((c) => ({ href: `${V2}/${c.slug}`, label: c.label, image: c.image })),
  { href: `${V2}/modelos`, label: "Todos los modelos", image: slide(2) },
  { href: `${V2}#videos`, label: "Videos", image: slide(4) },
  { href: `${V2}#nosotros`, label: "Nosotros", image: slide(0) },
  { href: `${V2}#locales`, label: "Locales", image: { src: "/palatine/portada-1024.webp", alt: "Frente del local de Edunor en Témperley" } },
]

/** Contacto dentro del menú (se arma en el servidor y viaja al panel como `aside`). */
function MenuContact() {
  return (
    <>
      <a href={WHATSAPP_V2} target="_blank" rel="noreferrer" className="v2-btn v2-fullmenu__wa">
        Escribinos por WhatsApp
      </a>
      <ul className="v2-fullmenu__contact">
        <li>
          <a href={`tel:+54${contact.phones[0].replace(/\D/g, "")}`}>{contact.phones.join(" · ")}</a>
        </li>
        <li>
          <a href={`mailto:${contact.emails[0]}`}>{contact.emails[0]}</a>
        </li>
      </ul>
      <ul className="v2-fullmenu__places">
        {locations.map((l) => (
          <li key={l.id}>
            <strong>{l.name}</strong>
            <a href={mapsLink(l.mapsQuery)} target="_blank" rel="noreferrer">
              {l.address}
            </a>
          </li>
        ))}
      </ul>
      <p className="v2-fullmenu__social">
        <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href={contact.facebook} target="_blank" rel="noreferrer">
          Facebook
        </a>
      </p>
    </>
  )
}

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
      <V2Menu links={MENU} aside={<MenuContact />} />
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
