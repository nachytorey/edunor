import { UtilityBar } from "@/components/bitacora/utility-bar"
import { Masthead } from "@/components/bitacora/masthead"
import { Hero } from "@/components/bitacora/hero"
import { TrendingStrip } from "@/components/bitacora/trending-strip"
import { StoryGrid } from "@/components/bitacora/story-grid"
import { BarcosBlock, NavegacionBlock, DestinosBlock } from "@/components/bitacora/section-block"
import { FeaturedStrip } from "@/components/bitacora/featured-strip"
import { Newsletter } from "@/components/bitacora/newsletter"
import { SiteFooter } from "@/components/bitacora/site-footer"
import { RevealProvider } from "@/components/bitacora/reveal"

export default function BitacoraPage() {
  return (
    <RevealProvider>
      <a
        href="#contenido"
        className="caps sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-signal-red focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <UtilityBar />
      <Masthead />
      <main id="contenido">
        <Hero />
        <TrendingStrip />
        <StoryGrid />
        <BarcosBlock />
        <NavegacionBlock />
        <FeaturedStrip />
        <DestinosBlock />
        <Newsletter />
      </main>
      <SiteFooter />
    </RevealProvider>
  )
}
