import { Motion } from "@/components/landing/motion"
import { SiteHeader } from "@/components/landing/site-header"
import { Hero } from "@/components/landing/hero"
import { Showcase } from "@/components/landing/showcase"
import { Gallery } from "@/components/landing/gallery"
import { About } from "@/components/landing/about"
import { Brands } from "@/components/landing/brands"
import { Contact } from "@/components/landing/contact"
import { ClosingCta } from "@/components/landing/closing-cta"
import { SiteFooter } from "@/components/landing/site-footer"

export default function HomePage() {
  return (
    <Motion>
      <SiteHeader />
      <main>
        <Hero />
        <Showcase />
        <Gallery />
        <About />
        <Brands />
        <Contact />
        <ClosingCta />
      </main>
      <SiteFooter />
    </Motion>
  )
}
