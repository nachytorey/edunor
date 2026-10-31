import type { Story } from "@/lib/stories"
import { Byline, Reveal, SectionTag, StoryImage } from "./ui"

type Variant = "default" | "wide" | "navy"

export function StoryCard({ story, variant = "default", index = 0 }: { story: Story; variant?: Variant; index?: number }) {
  const delay = (index % 3) * 70

  if (variant === "navy") {
    return (
      <Reveal as="article" delay={delay} className="card-lift flex h-full flex-col justify-between border border-navy-900 bg-navy-900 p-6 text-white sm:p-7">
        <div>
          <div className="flex items-center gap-2">
            <SectionTag section={story.section} tone="red" />
            <span className="caps text-kicker text-sky-100/80">{story.kicker}</span>
          </div>
          <blockquote className="mt-6">
            <p className="font-display text-[1.75rem] font-bold italic leading-[1.15] text-white sm:text-[2rem]">
              “{story.quote ?? story.dek}”
            </p>
          </blockquote>
        </div>
        <div className="mt-8">
          <h3 className="headline text-[1.125rem] text-sky-100">
            <a href={`#${story.slug}`} className="decoration-signal-red decoration-[3px] underline-offset-4 hover:underline">
              {story.title}
            </a>
          </h3>
          <Byline story={story} light className="mt-3" />
        </div>
      </Reveal>
    )
  }

  const wide = variant === "wide"
  return (
    <Reveal
      as="article"
      delay={delay}
      className={`card-lift group flex h-full flex-col border border-navy-900 bg-white ${wide ? "sm:col-span-2 sm:flex-row" : ""}`}
    >
      <a href={`#${story.slug}`} tabIndex={-1} aria-hidden="true" className={wide ? "relative sm:w-[58%] sm:shrink-0 sm:min-h-[340px]" : ""}>
        <StoryImage
          story={story}
          ratio={wide ? "16/9" : "4/3"}
          width={wide ? 1400 : 900}
          sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : undefined}
          className={`border-b border-navy-900 ${wide ? "sm:absolute sm:inset-0 sm:aspect-auto sm:border-r sm:border-b-0" : ""}`}
        />
      </a>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <SectionTag section={story.section} tone={index % 2 === 0 ? "red" : "navy"} />
          {story.isNew && <SectionTag tone="outline">Nuevo</SectionTag>}
        </div>
        <h3 className={`headline mt-4 ${wide ? "text-[1.5rem] sm:text-[1.9rem]" : "text-[1.3125rem] sm:text-[1.4375rem]"}`}>
          <a href={`#${story.slug}`} className="decoration-signal-red decoration-[3px] underline-offset-4 group-hover:underline">
            {story.title}
          </a>
        </h3>
        <p className="mt-3 line-clamp-2 text-[1rem] leading-[1.6] text-navy-900/80">{story.dek}</p>
        <Byline story={story} className="mt-auto pt-5" />
      </div>
    </Reveal>
  )
}
