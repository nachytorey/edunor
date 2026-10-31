import Image from "next/image"

const facts = [
  { label: "Fundada en", value: "1963" },
  { label: "Showroom", value: "1500 m²" },
  { label: "Sucursales", value: "Témperley y Canning" },
  { label: "Service", value: "Taller propio" },
]

export function About() {
  return (
    <section className="about" id="showroom" data-ink="dark" aria-labelledby="about-title">
      <h2 id="about-title" className="display about__title lines" data-lines-scroll>
        <span className="line">
          <span data-line>Un mismo</span>
        </span>
        <span className="line">
          <span data-line>techo</span>
        </span>
      </h2>

      <div data-rise-group>
        <p className="about__lead" data-rise>
          En el showroom de Témperley un crucero duerme al lado de un UTV. Hace más de sesenta años que la
          misma familia vende, entrega y repara las dos cosas, y por eso te podemos decir cuál te conviene.
        </p>

        <div className="about__tiles">
          <figure className="about__photo" data-rise data-open>
            <Image
              src="/images/about.jpg"
              alt="Showroom de Edunor con un crucero y dos UTVs en exhibición"
              width={1024}
              height={1024}
              sizes="(max-width: 767px) 100vw, 60vw"
              loading="lazy"
            />
            <figcaption className="about__caption">
              1500 metros cuadrados bajo techo, con unidades listas para probar, financiación y entrega
              inmediata.
            </figcaption>
          </figure>

          <div data-rise>
            <div className="about__tile" aria-hidden="true">
              <svg viewBox="0 0 400 300" role="img">
                <title>Mapa del sur del conurbano con Témperley y Canning</title>
                <path
                  fill="#154a6c"
                  d="M0 300V96c38-14 74-6 104-30 26-20 44-48 84-56 40-8 72 14 112 4 36-9 62-26 100-14v300Z"
                />
                <path
                  fill="#0b3550"
                  d="M400 0c-38-12-64 5-100 14-40 10-72-12-112-4-40 8-58 36-84 56C74 90 38 82 0 96V0Z"
                />
                <circle cx="176" cy="150" r="9" fill="#fe7141" />
                <text x="192" y="156" fill="#f4f4f4" fontSize="13" fontFamily="var(--font-text), system-ui">
                  Témperley
                </text>
                <circle cx="254" cy="214" r="9" fill="#fe7141" />
                <text x="270" y="220" fill="#f4f4f4" fontSize="13" fontFamily="var(--font-text), system-ui">
                  Canning
                </text>
              </svg>
            </div>
            <dl className="about__facts">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
