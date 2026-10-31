import { featuredSpecial, issue } from "@/lib/stories"
import { Reveal, SectionTag, StoryImage } from "./ui"

export function FeaturedStrip() {
  const s = featuredSpecial
  return (
    <section aria-labelledby="especial-title" className="border-y border-brass bg-navy-900 text-white">
      <div className="grid lg:grid-cols-2">
          <div className="relative">
            <StoryImage
              story={s}
              ratio="16/9"
              width={1600}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="lg:absolute lg:inset-0 lg:aspect-auto"
            />
          </div>
          <Reveal className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-14 lg:py-20 xl:px-20">
            <div className="flex flex-wrap items-center gap-3">
              <SectionTag tone="red">{s.kicker}</SectionTag>
              <span className="caps text-kicker text-sky-100/80">
                Nº {issue.number} · {issue.season}
              </span>
            </div>
            <h2 id="especial-title" className="headline mt-5 text-[clamp(2rem,4vw,3.5rem)] text-white">
              {s.title}
            </h2>
            <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-sky-100/90 sm:text-[1.125rem]">{s.dek}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={`#${s.slug}`}
                className="caps inline-flex h-12 items-center bg-white px-6 text-meta font-semibold text-navy-900 transition-colors hover:bg-sky-100 focus-visible:outline-white"
              >
                Leer el especial
              </a>
              <span className="caps text-kicker text-brass">{s.readingTime} min de lectura · 40 páginas</span>
            </div>
          </Reveal>
      </div>
    </section>
  )
}
