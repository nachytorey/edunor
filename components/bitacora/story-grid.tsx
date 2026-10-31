import { feedStories } from "@/lib/stories"
import { StoryCard } from "./story-card"
import { SectionHeader } from "./ui"

/* Ritmo editorial: cada 6 tarjetas, una ancha (2 columnas) y una en azul marino. */
function variantFor(index: number, hasQuote: boolean) {
  if ((index + 1) % 6 === 0) return "wide" as const
  if ((index + 1) % 6 === 3 && hasQuote) return "navy" as const
  if (hasQuote) return "navy" as const
  return "default" as const
}

export function StoryGrid() {
  return (
    <section id="notas" aria-labelledby="notas-title" className="container-page py-12 lg:py-16">
      <SectionHeader id="notas-title" title="Últimas notas" href="#notas" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {feedStories.map((s, i) => (
          <StoryCard key={s.id} story={s} index={i} variant={variantFor(i, Boolean(s.quote))} />
        ))}
      </div>
    </section>
  )
}
