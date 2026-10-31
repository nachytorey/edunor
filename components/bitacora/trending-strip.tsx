import { sectionLabel, trending } from "@/lib/stories"

export function TrendingStrip() {
  return (
    <section aria-labelledby="trending-title" className="border-y border-navy-900 bg-sky-100">
      <div className="container-page">
        <h2 id="trending-title" className="caps border-b border-navy-900 py-2 text-meta font-bold tracking-[0.2em]">
          Lo más leído
        </h2>
      </div>
      <div className="container-page !px-0 sm:!px-6">
        <ol className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:grid lg:grid-cols-5 lg:overflow-visible">
          {trending.map((s, i) => (
            <li
              key={s.id}
              className="w-[72%] shrink-0 snap-start border-r border-navy-900 last:border-r-0 sm:w-[45%] lg:w-auto"
            >
              <a href={`#${s.slug}`} className="group flex h-full gap-3 px-4 py-5 hover:bg-white sm:px-5 lg:flex-col lg:gap-2">
                <span
                  aria-hidden="true"
                  className="text-outline font-display text-[clamp(3rem,5vw,4.5rem)] font-black leading-[0.9] group-hover:text-navy-900"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block min-w-0">
                  <span className="caps block text-kicker text-signal-red-ink">{sectionLabel(s.section)}</span>
                  <span className="headline mt-1 block text-[1.0625rem] font-bold decoration-signal-red decoration-[3px] underline-offset-4 group-hover:underline sm:text-[1.125rem]">
                    {s.title}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
