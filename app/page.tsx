import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { FeaturedProducts } from "@/components/featured-products"
import { Testimonials } from "@/components/testimonials"
import { Locations } from "@/components/locations"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        <Hero />
        <About />
        <FeaturedProducts />
        <Testimonials />
        <Locations />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
