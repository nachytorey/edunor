import type { CSSProperties } from "react"
import { schemes, type Card, type Chunk as ChunkData, type SchemeName } from "@/lib/clon"

const vars = (name: SchemeName, extra: Record<string, string> = {}) => {
  const s = schemes[name]
  return { "--a": s.a, "--b": s.b, "--c": s.c, "--h": s[s.headline], ...extra } as CSSProperties
}

/* Línea ondulada como background (la oración la necesita repetida por renglón). */
const squiggleUrl = (color: string) =>
  `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'><path fill='none' stroke='${color}' stroke-width='1' d='M0,3.5 c 5,0, 5,-3, 10,-3 s 5,3, 10,3'/></svg>`,
  )}")`

export function Chunk({ chunk, index }: { chunk: ChunkData; index: number }) {
  switch (chunk.type) {
    case "feature":
      return <Feature chunk={chunk} />
    case "card-image":
      return (
        <section className="card-chunk card-chunk--image" aria-label="Nota destacada">
          <a className="card-chunk__link" href={chunk.href}>
            <div className="card-chunk__bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={chunk.image} alt="" loading="lazy" />
            </div>
            <span className="cl-cta">Leer más</span>
          </a>
        </section>
      )
    case "card-headline":
      return (
        <section className="card-chunk card-chunk--headline" aria-labelledby={`cc-${index}`}>
          <a className="card-chunk__link" href={chunk.href}>
            <div className="card-chunk__bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={chunk.image} alt="" loading="lazy" />
            </div>
            <div className="card-chunk__content">
              <p className="card-chunk__eyebrow">{chunk.eyebrow}</p>
              <span className="card-chunk__line squiggle-v" aria-hidden="true" />
              <h2 id={`cc-${index}`} className="card-chunk__title">
                {chunk.title}
              </h2>
              <p className="card-chunk__dek">{chunk.dek}</p>
              <span className="card-chunk__line squiggle-v" aria-hidden="true" />
            </div>
            <span className="cl-cta">Leer más</span>
          </a>
        </section>
      )
    case "card-grid": {
      const [first, ...rest] = chunk.label.split(" ")
      // Con dos palabras de "tipo titular" el original parte el rótulo: una arriba y otra abajo de la grilla.
      const split = chunk.split && rest.length > 0
      return (
        <section className="chunk-pad card-grid" style={vars(chunk.scheme)} aria-label={chunk.label}>
          <h2 className="card-grid__headline card-grid__headline--before">{split ? first : chunk.label}</h2>
          <div className="card-grid__stack">
            <ul className="card-grid__list">
              {chunk.cards.map((c) => (
                <li key={c.id} className="card-grid__item">
                  <CardView card={c} />
                </li>
              ))}
            </ul>
          </div>
          {split && (
            <p className="card-grid__headline card-grid__headline--after" aria-hidden="true">
              {rest.join(" ")}
            </p>
          )}
        </section>
      )
    }
    case "sentence":
      return (
        <section
          className="chunk-pad sentence"
          style={vars(chunk.scheme, { "--sq-url": squiggleUrl(schemes[chunk.scheme].c) })}
          aria-label="Más notas"
        >
          <div className="sentence__elements">
            <span className="sentence__inner">
              {chunk.items.map((item, i) => (
                <a key={i} className="sentence__item" href={item.href}>
                  <span className="sentence__taxonomy">{item.taxonomy}</span>
                  <span className="sentence__title">{item.title}</span>
                  <span className="sentence__emoji" aria-hidden="true">
                    {item.emoji}
                  </span>{" "}
                </a>
              ))}
            </span>
          </div>
        </section>
      )
  }
}

function Feature({ chunk }: { chunk: Extract<ChunkData, { type: "feature" }> }) {
  const { hero, posts } = chunk
  return (
    <section className="chunk-pad feature" style={vars(chunk.scheme)} aria-labelledby="feature-title">
      <div className="feature__background">
        <a className="feature__hero" href={hero.href}>
          <div className="feature__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.image} alt="" fetchPriority="high" />
          </div>
          <div className="feature__hero-content">
            <p className="feature__details">
              <span className="feature__eyebrow">{hero.eyebrow}</span>
              <span className="feature__date">{hero.date}</span>
            </p>
            <h2 id="feature-title" className="feature__title">
              {hero.title}
            </h2>
            <p className="feature__description">{hero.description}</p>
          </div>
        </a>
        <div className="feature__posts">
          <ul className="posts">
            {posts.map((p) => (
              <li key={p.id} className="post">
                <a href={p.href} className="post__link">
                  <p className="post__details">
                    <span className="post__eyebrow">{p.eyebrow}</span>
                    <span className="post__date">{p.date}</span>
                  </p>
                </a>
                <a href={p.href} className="post__content" tabIndex={-1}>
                  <h3 className="post__title">{p.title}</h3>
                  <span className="post__asset" aria-hidden="true">
                    <span className="post__line squiggle-h" />
                    <span className="post__emoji">{p.emoji}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function CardView({ card }: { card: Card }) {
  const c = card.content
  const kindClass = c.kind === "cardicle" ? "card--cardicle" : c.kind === "outline" ? "card--outline" : ""
  const label =
    c.kind === "headline-sans" ? `${c.strong ?? ""}${c.text}` : c.kind === "cardicle" ? c.text : "text" in c ? c.text : ""
  return (
    <a
      href={card.href}
      className={`card ${kindClass}`}
      data-tone={card.tone}
      style={vars(card.scheme)}
      aria-label={label || "Ver nota"}
    >
      <div className="card__bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.image} alt="" loading="lazy" />
      </div>
      <div className="card__content" aria-hidden="true">
        {c.kind === "headline-serif" && c.text && <h3 className="card__serif">{c.text}</h3>}
        {c.kind === "headline-sans" && (
          <h3 className="card__sans">
            {c.strong && <strong>{c.strong}</strong>}
            {c.text}
          </h3>
        )}
        {c.kind === "headline-serif-caps" && <h3 className="card__serif-caps">{c.text}</h3>}
        {c.kind === "cardicle" && (
          <>
            <h3 className="card__cardicle-title">{c.text}</h3>
            <p className="card__cardicle-dek">{c.dek}</p>
          </>
        )}
        {c.kind === "outline" && <h3 className="card__outline">{c.text}</h3>}
      </div>
    </a>
  )
}
