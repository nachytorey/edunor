/**
 * Capítulos de la portada: la historia de comprar una lancha en Edunor, del primer mensaje a la salida al agua.
 * `Chapter` es el encabezado de cada uno (número, nombre, título y texto).
 */
import type { ReactNode } from "react"

export function Chapter({
  n,
  name,
  title,
  children,
}: {
  n: number
  name: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="pal-chapter">
      <p className="pal-chapter__kicker">
        <span className="pal-chapter__num">{String(n).padStart(2, "0")}</span> Capítulo · {name}
      </p>
      <h2 className="pal-chapter__title">{title}</h2>
      {children && <div className="pal-chapter__text">{children}</div>}
    </header>
  )
}
