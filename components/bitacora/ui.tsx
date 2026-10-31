import Image from "next/image"
import { preload } from "react-dom"
import type { CSSProperties, ReactNode } from "react"
import { formatDate, formatLongDate, sectionLabel, type SectionSlug, type Story } from "@/lib/stories"

/* Etiqueta de sección tipo bandera de señales: rectángulo sólido, caps. */
export function SectionTag({
  section,
  tone = "red",
  className = "",
  children,
}: {
  section?: SectionSlug
  tone?: "red" | "navy" | "white" | "outline"
  className?: string
  children?: ReactNode
}) {
  const tones = {
    red: "bg-signal-red text-white",
    navy: "bg-navy-900 text-white",
    white: "bg-white text-navy-900",
    outline: "border border-navy-900 text-navy-900",
  }
  return (
    <span className={`caps inline-block px-2 py-1 text-kicker leading-none ${tones[tone]} ${className}`}>
      {children ?? (section ? sectionLabel(section) : null)}
    </span>
  )
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`caps text-kicker text-signal-red-ink ${className}`}>{children}</p>
}

/* Autor · fecha · tiempo de lectura. */
export function Byline({ story, className = "", light = false }: { story: Story; className?: string; light?: boolean }) {
  return (
    <p className={`caps text-meta font-medium ${light ? "text-sky-100/80" : "text-navy-900/70"} ${className}`}>
      <span className={light ? "text-white" : "text-navy-900"}>{story.author}</span>
      <span aria-hidden="true"> · </span>
      <time dateTime={story.date} title={formatLongDate(story.date)}>
        {formatDate(story.date)}
      </time>
      <span aria-hidden="true"> · </span>
      <span>{story.readingTime} min</span>
    </p>
  )
}

type Ratio = "16/9" | "4/3" | "4/5" | "1/1" | "21/9"
const ratioClass: Record<Ratio, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
}

/* Imagen con proporción fija, object-cover y tinte azulado. */
export function StoryImage({
  story,
  ratio = "4/3",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className = "",
  width = 1200,
}: {
  story: Story
  ratio?: Ratio
  priority?: boolean
  sizes?: string
  className?: string
  /** Ancho pedido a Unsplash. Con images.unoptimized no hay srcset, así que se fija por uso. */
  width?: number
}) {
  return (
    <div className={`photo-tint relative overflow-hidden bg-sky-100 ${ratioClass[ratio]} ${className}`} data-ratio={ratio}>
      <Image
        src={`${story.image.src}&w=${width}&q=${priority ? 80 : 72}`}
        alt={story.image.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="object-cover"
      />
    </div>
  )
}

/* Imagen del hero (LCP): img con srcset manual + preload. Con images.unoptimized
   next/image no genera srcset, y en mobile bajaría 1600px de más. */
const HERO_WIDTHS = [480, 768, 1024, 1400, 1800]
export function HeroImage({ story, sizes, className = "" }: { story: Story; sizes: string; className?: string }) {
  const srcSet = HERO_WIDTHS.map((w) => `${story.image.src}&w=${w}&q=78 ${w}w`).join(", ")
  const src = `${story.image.src}&w=1400&q=78`
  preload(src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" })
  return (
    <div className={`photo-tint relative overflow-hidden bg-sky-100 aspect-[16/9] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={story.image.alt}
        width={1600}
        height={900}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}

/* Encabezado de bloque: título caps + filete grueso + "Ver todo →". */
export function SectionHeader({
  id,
  title,
  href = "#",
  light = false,
}: {
  id?: string
  title: string
  href?: string
  light?: boolean
}) {
  const ink = light ? "text-white" : "text-navy-900"
  return (
    <div className={`flex items-end gap-4 ${ink}`}>
      <h2 id={id} className="caps text-[1.75rem] leading-none font-bold tracking-[0.1em] sm:text-[2.25rem]">
        {title}
      </h2>
      <span aria-hidden="true" className="mb-[0.35rem] h-[3px] flex-1 bg-current" />
      <a href={href} className="link-red caps mb-[0.1rem] whitespace-nowrap text-meta font-semibold">
        Ver todo <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: "div" | "article" | "li" | "section"
}) {
  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined
  return (
    <Tag className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  )
}
