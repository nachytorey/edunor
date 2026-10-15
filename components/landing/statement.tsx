import type { ReactNode } from "react"
import { Reveal } from "@/components/landing/reveal"

type StatementProps = {
  id?: string
  children: ReactNode
  aside?: ReactNode
}

export function Statement({ id, children, aside }: StatementProps) {
  return (
    <section id={id} className="px-5 py-32 md:px-10 md:py-56">
      <Reveal>
        <p className="text-statement max-w-[34ch] text-pretty">{children}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <hr className="mt-12 border-foreground/20 md:mt-20" />
      </Reveal>
      {aside && <Reveal delay={0.2}>{aside}</Reveal>}
    </section>
  )
}
