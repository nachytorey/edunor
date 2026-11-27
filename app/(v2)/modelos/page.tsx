/**
 * /modelos — índice de todos los modelos (lanchas y Polaris), agrupados por línea. Cada tarjeta abre su ficha v2.
 */
import type { Metadata } from "next"
import { SectionTitle } from "@/components/v2/chrome"
import { cuatriciclos, lanchas } from "@/lib/catalog"
import { imageDims } from "@/lib/image-dims"
import { shareMeta } from "@/lib/site"
import { v2Ficha } from "@/lib/v2"

const title = "Modelos | Edunor Náutica"
const description = "Todos los modelos de lanchas y Polaris de Edunor Náutica, con fotos y consulta directa."

export const metadata: Metadata = { title: { absolute: title }, description, ...shareMeta({ title, description, path: "/modelos" }) }

const LINES = [
  { slug: "embarcaciones", kicker: "Embarcaciones", title: "Lanchas", list: lanchas },
  { slug: "polaris", kicker: "Polaris", title: "Cuatriciclos y UTV", list: cuatriciclos },
]

export default function V2ModelosPage() {
  return (
    <div className="v2-catpage v2-wrap">
      <nav className="v2-tabs" aria-label="Líneas">
        {LINES.map((l) => (
          <a key={l.slug} href={`#${l.slug}`}>
            {l.kicker}
          </a>
        ))}
        <a href={`/generac`}>Generac</a>
      </nav>

      {LINES.map((l) => (
        <section key={l.slug} id={l.slug} className="v2-models-line" aria-labelledby={`v2-line-${l.slug}`}>
          <SectionTitle id={`v2-line-${l.slug}`} kicker={l.kicker}>
            {l.title} <em>({l.list.length})</em>
          </SectionTitle>
          <ul className="v2-grid">
            {l.list.map((p) => {
              const photo = p.images.find((i) => i.src)
              return (
                <li key={p.slug} className="v2-card">
                  <a href={v2Ficha(p.slug)}>
                    <span className="v2-card__photo">
                      {photo && (
                        <img
                          src={photo.src}
                          srcSet={photo.srcSet}
                          sizes={photo.srcSet && "(min-width: 1100px) 33vw, (min-width: 640px) 50vw, 100vw"}
                          alt={photo.alt || `${p.kind} ${p.name}`}
                          loading="lazy"
                          decoding="async"
                          {...imageDims(photo.src)}
                        />
                      )}
                    </span>
                    <span className="v2-card__body">
                      <span className="v2-card__kind">{p.kind}</span>
                      <span className="v2-card__name">{p.name}</span>
                      <span className="v2-card__go">Ver ficha →</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
