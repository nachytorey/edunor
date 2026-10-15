import { locations, mapsLink } from "@/lib/site"
import { Reveal } from "@/components/landing/reveal"

export function LocationsList() {
  return (
    <section id="sucursales" className="px-5 pb-32 md:px-10 md:pb-56">
      <Reveal>
        <h2 className="font-display text-giant">Sucursales</h2>
      </Reveal>

      <ul className="mt-12 border-t border-foreground/20 md:mt-20">
        {locations.map((location, i) => (
          <li key={location.id} className="border-b border-foreground/20">
            <Reveal delay={i * 0.08}>
              <a
                href={mapsLink(location.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-2 py-8 md:grid-cols-12 md:gap-8 md:py-10"
              >
                <span className="text-sm opacity-60 md:col-span-2">{location.region}</span>
                <span className="text-3xl font-medium tracking-tight transition-opacity group-hover:opacity-70 md:col-span-5 md:text-4xl">
                  {location.name}
                </span>
                <span className="opacity-75 md:col-span-3">
                  {location.address}
                  <br />
                  {location.city}
                </span>
                <span className="opacity-75 md:col-span-2 md:text-right">
                  {location.phones.length > 0 ? location.phones.join(" · ") : "Ver en el mapa"}
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
