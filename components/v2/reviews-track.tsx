"use client"

/**
 * Reseñas en una cinta horizontal: scroll nativo con encastre (trackpad de costado, dedo en el celular, Shift+rueda)
 * y flechas para quien usa mouse. Las flechas se apagan en las puntas. Cada tarjeta: estrellas, nombre, fecha,
 * local y el comentario completo (los largos se cortan y se abren con "Leer más").
 */
import { useEffect, useRef, useState } from "react"
import type { Review } from "@/lib/v2"

const PLACE = { temperley: "Témperley", canning: "Canning" }

export function ReviewsTrack({ reviews }: { reviews: Review[] }) {
  const track = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = track.current
    if (!el) return
    const update = () => setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
    update()
    el.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      el.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const move = (dir: 1 | -1) => {
    const el = track.current
    const card = el?.querySelector("li")
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.clientWidth + 16), behavior: "smooth" })
  }

  return (
    <div className="v2-reviews__wrap">
      <ul ref={track} className="v2-reviews__track" aria-label="Reseñas de clientes en Google">
        {reviews.map((r) => (
          <li key={`${r.author}-${r.date}`} className="v2-review">
            <p className="v2-review__stars" aria-label={`${r.rating} de 5 estrellas`}>
              {"★".repeat(r.rating)}
              <span aria-hidden="true">{"★".repeat(5 - r.rating)}</span>
            </p>
            <blockquote className="v2-review__text">
              {r.text.split("\n").filter(Boolean).map((line, n) => (
                <p key={n}>{line}</p>
              ))}
            </blockquote>
            {r.text.length > 260 && (
              <button
                type="button"
                className="v2-review__more"
                onClick={(e) => {
                  const card = e.currentTarget.closest(".v2-review")
                  const open = card?.classList.toggle("is-open")
                  e.currentTarget.textContent = open ? "Leer menos" : "Leer más"
                }}
              >
                Leer más
              </button>
            )}
            <footer className="v2-review__by">
              <span className="v2-review__avatar" aria-hidden="true">
                {r.author.trim()[0]?.toUpperCase()}
              </span>
              <span>
                <strong>{r.author}</strong>
                <small>
                  {PLACE[r.location]} · {r.date}
                </small>
              </span>
              <GoogleG />
            </footer>
          </li>
        ))}
      </ul>
      <div className="v2-reviews__arrows">
        <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label="Reseñas anteriores">
          ←
        </button>
        <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label="Más reseñas">
          →
        </button>
      </div>
    </div>
  )
}

/** "G" de Google: indica de dónde sale la reseña. */
function GoogleG() {
  return (
    <svg className="v2-review__g" viewBox="0 0 48 48" width="20" height="20" aria-label="Reseña de Google" role="img">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  )
}
