import { categories, stats } from "@/lib/landing"
import { SiteHeader } from "@/components/landing/site-header"
import { Statement } from "@/components/landing/statement"
import { CategorySection } from "@/components/landing/category-section"
import { LocationsList } from "@/components/landing/locations-list"
import { ContactCta } from "@/components/landing/contact-cta"
import { SiteFooter } from "@/components/landing/site-footer"

export default function HomePage() {
  return (
    <>
      {/* z-10 + fondo opaco para tapar el footer hasta el final del scroll */}
      <main className="relative z-10 bg-background">
        <SiteHeader />

        <Statement id="que-hacemos">
          Somos una empresa familiar fundada en 1963. Representamos a las mejores marcas de
          náutica, off-road y outdoor, y te acompañamos desde la compra hasta el service.
        </Statement>

        <div>
          {categories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>

        <Statement
          aside={
            <dl className="mt-12 grid gap-10 sm:grid-cols-3 md:mt-16">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-sm opacity-60">{stat.label}</dt>
                  <dd className="font-display mt-2 text-6xl md:text-7xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          }
        >
          Más de sesenta años después seguimos atendiendo como el primer día: con tiempo,
          con conocimiento y con la tranquilidad de tener un taller propio detrás.
        </Statement>

        <LocationsList />
        <ContactCta />
      </main>

      <SiteFooter />
    </>
  )
}
