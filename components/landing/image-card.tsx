import Image from "next/image"
import type { Card } from "@/lib/landing"

type ImageCardProps = Card & {
  sizes: string
  priority?: boolean
}

export function ImageCard({ title, tag, image, sizes, priority }: ImageCardProps) {
  return (
    <article className="group flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-black/10">
        <Image
          src={image}
          alt={title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-medium leading-tight">{title}</h3>
        <span className="shrink-0 text-sm opacity-60">{tag}</span>
      </div>
    </article>
  )
}
