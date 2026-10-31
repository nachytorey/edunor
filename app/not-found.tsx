/**
 * 404 global: las urls que no existen no pasan por el layout del grupo (palatine),
 * así que lo envolvemos acá para tener la misma tipografía, colores y filtro entintado.
 */
import type { Metadata } from "next"
import PalatineLayout from "./(palatine)/layout"
import PalatineNotFound from "./(palatine)/not-found"

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada | Edunor Náutica" },
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <PalatineLayout>
      <PalatineNotFound />
    </PalatineLayout>
  )
}
