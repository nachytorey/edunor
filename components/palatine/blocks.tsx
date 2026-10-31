/**
 * Piezas compartidas por las páginas del sitio (portada y empresa):
 * títulos fantasma, citas, carteles indicadores, navegación y pie.
 */
import { EdunorLogo } from "@/components/edunor-logo"
import { Caps } from "@/components/palatine/interactive"
import { CompassRose, QuoteMark, SignPost } from "@/components/palatine/ornaments"
import { brands, contact } from "@/lib/edunor"
import { whatsappLink } from "@/lib/site"

export const WHATSAPP = whatsappLink()

export const NAV = [
  { href: "/#modelos", label: "Modelos" },
  { href: "/empresa", label: "La Empresa" },
  { href: "/#showroom", label: "Showroom" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#contacto", label: "Contacto" },
]

/** Ficha de un modelo (igual a la url del catálogo). */
export const fichaHref = (slug: string) => `/modelos/${slug}`

const allBrands =[...new Set(brands.flatMap((b) => b.names))]

/** Título fantasma de sección, con un pequeño grabado encima. */
export function GhostTitle({ children, ornament, side = "right" }: { children: string; ornament?: React.ReactNode; side?: "left" | "right" }) {
  return (
    <div className={`pal-ghost pal-ghost--${side}`}>
      <h2 className="pal-ghost__title">{children}</h2>
      {ornament ? <div className="pal-ghost__ornament">{ornament}</div> : null}
    </div>
  )
}

export function Quote({ text, source }: { text: string; source: string }) {
  return (
    <figure className="pal-quote">
      <QuoteMark className="pal-quote__mark" />
      <blockquote>{text}</blockquote>
      <figcaption>{source}</figcaption>
      <QuoteMark className="pal-quote__mark pal-quote__mark--close" />
    </figure>
  )
}

/** Cartel indicador: un poste con una o dos tablas que apuntan a izquierda y derecha. */
export function Signs({ items }: { items: { href: string; label: string; external?: boolean }[] }) {
  return (
    <div className="pal-signs">
      <SignPost className="pal-signs__post" />
      {items.map((s, n) => (
        <a
          key={s.label}
          href={s.href}
          className={`pal-sign pal-sign--${n % 2 ? "left" : "right"}`}
          {...(s.external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {s.label}
        </a>
      ))}
    </div>
  )
}

export function PalFooter() {
  return (
    <footer className="pal-footer">
      <div className="pal-footer__brand">
        <div className="pal-footer__emblem" aria-hidden="true">
          <CompassRose />
        </div>
        <EdunorLogo className="pal-footer__logo" title="Edunor Náutica" />
        <p className="pal-footer__copy">© {new Date().getFullYear()} Edunor Náutica</p>
      </div>
      <div>
        <h2 className="pal-footer__title">
          <Caps text="Contacto" />
        </h2>
        <ul>
          <li><a href={`mailto:${contact.emails[0]}`}>email</a></li>
          <li><a href={WHATSAPP} target="_blank" rel="noreferrer">whatsapp</a></li>
          <li><a href={contact.facebook} target="_blank" rel="noreferrer">facebook</a></li>
          <li><a href={`tel:+54${contact.phones[0].replace(/\D/g, "")}`}>teléfono</a></li>
        </ul>
      </div>
      <div>
        <h2 className="pal-footer__title">
          <Caps text="Menú" />
        </h2>
        <ul>
          {NAV.slice(0, 4).map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label.toLowerCase()}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="pal-footer__title">
          <Caps text="Marcas" />
        </h2>
        <p className="pal-footer__brands">{allBrands.join(" · ")}</p>
      </div>
    </footer>
  )
}
