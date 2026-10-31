import { heroSecondary, heroStory } from "@/lib/stories"
import { Byline, HeroImage, Kicker, Reveal, SectionTag, StoryImage } from "./ui"

export function Hero() {
  const main = heroStory
  return (
    <section aria-labelledby="hero-title" className="container-page pt-6 pb-10 sm:pt-8 lg:pb-14">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-0">
        {/* Nota principal */}
        <article className="lg:col-span-8 lg:border-r lg:border-navy-900 lg:pr-8">
          <a href={`#${main.slug}`} className="group block">
            <HeroImage
              story={main}
              sizes="(min-width: 1280px) 820px, (min-width: 1024px) 66vw, 100vw"
              className="border border-navy-900"
            />
            {/* Recuadro azul marino superpuesto, tipo tapa */}
            <div className="relative z-10 -mt-10 ml-0 max-w-[92%] bg-navy-900 p-5 text-white sm:-mt-16 sm:p-7 lg:max-w-[85%] lg:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <SectionTag section={main.section} tone="red" />
                {main.isNew && <SectionTag tone="white">Nuevo</SectionTag>}
                <span className="caps text-kicker text-sky-100/80">{main.kicker}</span>
              </div>
              <h2
                id="hero-title"
                className="headline text-[clamp(2rem,4.6vw,3.9rem)] text-white decoration-signal-red decoration-[3px] underline-offset-[6px] group-hover:underline"
              >
                {main.title}
              </h2>
            </div>
          </a>
          <p className="mt-5 max-w-[60ch] text-[1.125rem] leading-[1.6] text-navy-900/90 sm:text-[1.1875rem]">{main.dek}</p>
          <Byline story={main} className="mt-4" />
        </article>

        {/* Columna secundaria */}
        <div className="lg:col-span-4 lg:pl-8">
          <p className="caps border-b-[3px] border-navy-900 pb-2 text-meta font-bold tracking-[0.2em]">En esta edición</p>
          <ul>
            {heroSecondary.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 60} className="border-b border-navy-900 py-5 last:border-b-0">
                <article className="group flex gap-4">
                  <a href={`#${s.slug}`} className="shrink-0" tabIndex={-1} aria-hidden="true">
                    <StoryImage
                      story={s}
                      ratio="1/1"
                      width={320}
                      sizes="96px"
                      className="h-20 w-20 border border-navy-900 sm:h-24 sm:w-24"
                    />
                  </a>
                  <div className="min-w-0">
                    <Kicker>{s.kicker}</Kicker>
                    <h3 className="headline mt-1 text-[1.25rem] sm:text-[1.375rem]">
                      <a
                        href={`#${s.slug}`}
                        className="decoration-signal-red decoration-[3px] underline-offset-4 group-hover:underline"
                      >
                        {s.title}
                      </a>
                    </h3>
                    <Byline story={s} className="mt-2" />
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
