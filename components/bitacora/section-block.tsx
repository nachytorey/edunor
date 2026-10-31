import { barcosBlock, destinosBlock, navegacionBlock } from "@/lib/stories"
import { Byline, Kicker, Reveal, SectionHeader, SectionTag, StoryImage } from "./ui"

/* BARCOS: 1 grande + 4 pequeñas. Fondo paper. */
export function BarcosBlock() {
  const { lead, list } = barcosBlock
  return (
    <section id="barcos" aria-labelledby="barcos-title" className="border-t border-navy-900 bg-paper">
      <div className="container-page py-12 lg:py-16">
        <SectionHeader id="barcos-title" title="Barcos" href="#barcos" />
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-0">
          <Reveal as="article" className="group lg:col-span-7 lg:border-r lg:border-navy-900 lg:pr-8">
            <a href={`#${lead.slug}`} tabIndex={-1} aria-hidden="true">
              <StoryImage story={lead} ratio="4/3" width={1400} sizes="(min-width: 1024px) 58vw, 100vw" className="border border-navy-900" />
            </a>
            <div className="mt-5 flex items-center gap-2">
              <SectionTag tone="navy">{lead.kicker}</SectionTag>
            </div>
            <h3 className="headline mt-3 text-[1.75rem] sm:text-[2.25rem]">
              <a href={`#${lead.slug}`} className="decoration-signal-red decoration-[3px] underline-offset-[6px] group-hover:underline">
                {lead.title}
              </a>
            </h3>
            <p className="mt-3 max-w-[60ch] leading-[1.6] text-navy-900/85">{lead.dek}</p>
            <Byline story={lead} className="mt-4" />
          </Reveal>
          <ul className="lg:col-span-5 lg:pl-8">
            {list.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 60} className="border-b border-navy-900 py-5 first:pt-0 last:border-b-0 lg:first:pt-0">
                <article className="group flex gap-4">
                  <a href={`#${s.slug}`} tabIndex={-1} aria-hidden="true" className="shrink-0">
                    <StoryImage story={s} ratio="1/1" width={320} sizes="96px" className="h-20 w-20 border border-navy-900 sm:h-24 sm:w-24" />
                  </a>
                  <div className="min-w-0">
                    <Kicker>{s.kicker}</Kicker>
                    <h3 className="headline mt-1 text-[1.1875rem] sm:text-[1.3125rem]">
                      <a href={`#${s.slug}`} className="decoration-signal-red decoration-[3px] underline-offset-4 group-hover:underline">
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

/* NAVEGACIÓN: lista horizontal con miniaturas. Fondo sky-100. */
export function NavegacionBlock() {
  return (
    <section id="navegacion" aria-labelledby="navegacion-title" className="border-t border-navy-900 bg-sky-100">
      <div className="container-page py-12 lg:py-16">
        <SectionHeader id="navegacion-title" title="Navegación" href="#navegacion" />
        <ol className="mt-8 grid border border-navy-900 bg-white sm:grid-cols-2 lg:grid-cols-4">
          {navegacionBlock.map((s, i) => (
            <Reveal
              as="li"
              key={s.id}
              delay={i * 70}
              className="group border-b border-navy-900 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
            >
              <article className="flex h-full flex-col">
                <a href={`#${s.slug}`} tabIndex={-1} aria-hidden="true">
                  <StoryImage story={s} ratio="4/3" width={800} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="border-b border-navy-900" />
                </a>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Kicker>{s.kicker}</Kicker>
                    <span aria-hidden="true" className="font-display text-[1.5rem] font-black leading-none text-navy-900/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="headline mt-2 text-[1.25rem]">
                    <a href={`#${s.slug}`} className="decoration-signal-red decoration-[3px] underline-offset-4 group-hover:underline">
                      {s.title}
                    </a>
                  </h3>
                  <Byline story={s} className="mt-auto pt-4" />
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* DESTINOS: 3 tarjetas verticales 4:5 con titular sobre la imagen. Fondo paper. */
export function DestinosBlock() {
  return (
    <section id="destinos" aria-labelledby="destinos-title" className="border-t border-navy-900 bg-paper">
      <div className="container-page py-12 lg:py-16">
        <SectionHeader id="destinos-title" title="Destinos" href="#destinos" />
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinosBlock.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 80} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <article className="card-lift group relative border border-navy-900">
                <a href={`#${s.slug}`} className="block">
                  <StoryImage story={s} ratio="4/5" width={1000} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  <div className="absolute top-4 left-4">
                    <SectionTag tone="red">{s.kicker}</SectionTag>
                  </div>
                  <div className="absolute bottom-0 left-0 max-w-[88%] bg-navy-900 p-5 text-white">
                    <h3 className="headline text-[1.375rem] text-white decoration-signal-red decoration-[3px] underline-offset-4 group-hover:underline sm:text-[1.5rem]">
                      {s.title}
                    </h3>
                    <Byline story={s} light className="mt-3" />
                  </div>
                </a>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
