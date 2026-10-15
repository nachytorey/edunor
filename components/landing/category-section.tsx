import type { CSSProperties } from "react"
import type { Category } from "@/lib/landing"
import { whatsappLink } from "@/lib/site"
import { ImageCard } from "@/components/landing/image-card"
import { Reveal } from "@/components/landing/reveal"

export function CategorySection({ category }: { category: Category }) {
  const style = {
    "--main": category.main,
    "--paired": category.paired,
  } as CSSProperties

  return (
    // Cada sección queda pegada arriba y la siguiente se le apila encima
    <section
      id={category.id}
      style={style}
      className="sticky top-0 flex min-h-svh flex-col bg-(--main) px-5 py-5 text-(--paired) md:px-10 md:py-10"
    >
      <div className="flex items-center justify-between border-b border-current/30 pb-4 text-sm">
        <span>{category.index}</span>
        <span className="opacity-70">Qué hacemos</span>
      </div>

      <Reveal className="pt-10 md:pt-16">
        <h2 className="font-display text-giant text-balance">{category.title}</h2>
      </Reveal>

      <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12">
        <Reveal delay={0.1} className="md:col-span-6 lg:col-span-5">
          <p className="text-lg leading-relaxed text-pretty opacity-85 md:text-xl">
            {category.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappLink(`Hola Edunor! Quiero consultar por ${category.title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-(--paired) px-6 py-3 text-sm font-medium text-(--main) transition-opacity hover:opacity-85"
            >
              Consultar
            </a>
            <a
              href="#sucursales"
              className="rounded-full border border-current/40 px-6 py-3 text-sm font-medium transition-colors hover:bg-current/10"
            >
              Visitanos
            </a>
          </div>
        </Reveal>
      </div>

      <div className="mt-auto pt-16">
        {category.cards && (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 md:gap-8">
            {category.cards.map((card, i) => (
              <Reveal key={card.title} delay={0.1 + i * 0.08}>
                <ImageCard {...card} sizes="(max-width: 1024px) 50vw, 25vw" aspect="aspect-video" />
              </Reveal>
            ))}
          </div>
        )}

        {category.brands && (
          <Reveal delay={0.15}>
            <p className="mb-5 text-sm opacity-70">Marcas</p>
            <ul className="flex flex-wrap gap-3">
              {category.brands.map((brand) => (
                <li
                  key={brand}
                  className="rounded-full border border-current/40 px-5 py-2.5 text-base md:text-lg"
                >
                  {brand}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  )
}
