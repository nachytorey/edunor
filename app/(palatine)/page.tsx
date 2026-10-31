/**
 * / — portada de Edunor Náutica con la composición de ensemblelapalatine.com
 * (hero ilustrado, títulos fantasma gigantes, manchas de color, marcos entintados, carteles
 * indicadores) y la identidad de Edunor: marino, papel y naranja, con grabados náuticos propios.
 * Textos e imágenes son de Edunor; los ornamentos están dibujados en components/palatine/ornaments.tsx.
 */
import { Fragment } from "react"
import { fichaHref, GhostTitle, PalFooter, Quote, Signs, WHATSAPP } from "@/components/palatine/blocks"
import { Caps, Fader, PalNav } from "@/components/palatine/interactive"
import {
  Anchor,
  ChatIcon,
  CompassRose,
  FacebookIcon,
  Fish,
  Gull,
  InstagramIcon,
  LifeRing,
  Lighthouse,
  MailIcon,
  PhoneIcon,
  PinIcon,
  ShipWheel,
  Starfish,
  Sunburst,
  Waves,
  Workshop,
} from "@/components/palatine/ornaments"
import { cuatriciclos, lanchas } from "@/lib/catalog"
import { company, contact, equipment, generators, service } from "@/lib/edunor"
import { locations, siteConfig, whatsappLink } from "@/lib/site"

const NAV = [
  { href: "#modelos", label: "Modelos" },
  { href: "#utv", label: "UTV y Cuatris" },
  { href: "/empresa", label: "La Empresa" },
  { href: "#generadores", label: "Generadores" },
  { href: "#showroom", label: "Showroom" },
  { href: "#galeria", label: "Galería" },
  { href: "#contacto", label: "Contacto" },
]

const featured = lanchas.slice(0, 6)
const gallery = lanchas.filter((_, i) => i % 2 === 0).slice(0, 4)

export default function PalatinePage() {
  return (
    <div id="top" className="pal-page">
      <PalNav links={NAV} whatsapp={WHATSAPP} />

      <main>
        {/* ── Hero ── */}
        <section className="pal-hero" aria-labelledby="pal-hero-title">
          <div className="pal-hero__art">
            <Sunburst className="pal-hero__rays" />
            <div className="pal-hero__porthole">
              <img
                src="/palatine/portada.png"
                alt="Local de Edunor con lanchas en el salón y dos cuatriciclos Polaris en la vereda"
                fetchPriority="high"
              />
            </div>
            <CompassRose className="pal-hero__compass" />
            <Gull className="pal-hero__gull" />
            <Gull className="pal-hero__gull pal-hero__gull--2" />
          </div>
          <div className="pal-hero__text">
            <h1 id="pal-hero-title" className="pal-hero__title">
              <Caps text="Edunor Náutica" />
            </h1>
            <p className="pal-hero__sub">Lanchas, cuatriciclos y service oficial desde {company.founded}</p>
            <Quote
              text="La lancha la elegís vos. El resto del viaje lo hacemos juntos: te asesoramos con la experiencia de toda una vida en el agua, te la entregamos lista para navegar y seguimos a tu lado en cada service."
              source={`Edunor · desde ${company.founded}`}
            />
          </div>
        </section>

        {/* ── Modelos ── */}
        <section id="modelos" className="pal-models">
          <GhostTitle ornament={<ShipWheel className="pal-spin" />} side="left">
            Modelos
          </GhostTitle>
          <Fader label="Modelos de lanchas" className="pal-models__slider">
            {featured.map((p) => (
              <article key={p.slug} className="pal-model">
                <div className="pal-model__story">
                  <Lighthouse className="pal-model__figure" />
                  <div className="pal-bubble">
                    <h3 className="pal-model__name">
                      <Caps text={p.name} />
                    </h3>
                    <p>
                      {p.description ??
                        `${p.kind} ${p.name}, lista en el showroom. Vení a subirte, mirá los acabados y consultanos por motorización, equipamiento y entrega.`}
                    </p>
                  </div>
                </div>
                <Signs
                  items={[
                    { href: p.href, label: "consultar", external: true },
                    { href: fichaHref(p.slug), label: "ver ficha" },
                  ]}
                />
                <a href={fichaHref(p.slug)} className="pal-frame pal-model__image">
                  <img src={p.images[0].src} alt={p.images[0].alt || `Lancha ${p.name}`} loading="lazy" />
                </a>
              </article>
            ))}
          </Fader>
        </section>

        {/* ── UTV y cuatriciclos ── */}
        <section id="utv" className="pal-utv" aria-labelledby="pal-utv-title">
          <GhostTitle ornament={<CompassRose />} side="right">
            Tierra
          </GhostTitle>
          <div className="pal-utv__intro">
            <h2 id="pal-utv-title" className="pal-utv__title">
              <Caps text="UTV · Cuatriciclos" />
            </h2>
            <p>
              Cuatriciclos y UTV para el campo, la arena y el trabajo. Los tenés en el showroom, listos para probar, con
              service oficial y repuestos originales.
            </p>
          </div>
          <ul className="pal-utv__grid">
            {cuatriciclos.map((p) => (
              <li key={p.slug} className="pal-utv__item">
                <a href={fichaHref(p.slug)} className="pal-frame">
                  <img src={p.images[0].src} alt={p.images[0].alt || `${p.kind} ${p.name}`} loading="lazy" />
                </a>
                <p className="pal-plaque">
                  {p.name}
                  <span className="pal-utv__kind">
                    {" "}
                    <span aria-hidden="true">–</span> {p.kind}
                  </span>
                </p>
              </li>
            ))}
          </ul>
          <div className="pal-gen__arrows">
            <a href={whatsappLink("Hola Edunor! Quiero consultar por UTV y cuatriciclos.")} target="_blank" rel="noreferrer">
              Consultar
            </a>
          </div>
        </section>

        {/* ── Generadores ── */}
        <section id="generadores" className="pal-gen">
          <GhostTitle side="right">Generadores</GhostTitle>
          <div className="pal-gen__grid">
            <div className="pal-gen__copy">
              <Waves className="pal-gen__waves" />
              <div className="pal-bubble pal-bubble--right">
                <p className="pal-gen__lead">{generators.lead}</p>
                <p>{generators.dek}</p>
              </div>
            </div>
            <div className="pal-gen__media">
              <img className="pal-gen__product" src={generators.image.src} alt={generators.image.alt} loading="lazy" />
              <div className="pal-gen__arrows">
                <a href={whatsappLink(`Hola Edunor! Quiero consultar por generadores ${generators.brand}.`)} target="_blank" rel="noreferrer">
                  Consultar
                </a>
                <a href={`mailto:${contact.emails[0]}?subject=Generadores%20${generators.brand}`}>Pedir presupuesto</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Showroom (en el lugar del calendario) ── */}
        <section id="showroom" className="pal-show">
          <GhostTitle ornament={<Anchor />} side="left">
            Showroom
          </GhostTitle>
          <div className="pal-show__grid">
            <ul className="pal-show__list">
              {locations.map((l, n) => (
                <li key={l.id} className="pal-place">
                  <div className="pal-place__seal">
                    <span>sede</span>
                    <strong>{String(n + 1).padStart(2, "0")}</strong>
                    <span>{l.name.slice(0, 3)}</span>
                  </div>
                  <div className="pal-place__card">
                    <h3>{l.name}</h3>
                    <p className="pal-place__sub">{l.address}</p>
                    <p className="pal-place__bold">{l.phones.length ? `Tel. ${l.phones.join(" · ")}` : "Consultá horarios por WhatsApp"}</p>
                    <p className="pal-place__where">
                      {l.city} · {l.region}
                    </p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.mapsQuery)}`} target="_blank" rel="noreferrer">
                      <PinIcon /> Cómo llegar
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="pal-callout">
              <LifeRing className="pal-callout__ring" />
              <span className="pal-callout__small">coordiná tu</span>
              <span className="pal-callout__big">Visita</span>
              <span className="pal-callout__small pal-callout__small--right">al showroom</span>
            </a>
          </div>
        </section>

        {/* ── Galería (en el lugar de los videos) ── */}
        <section id="galeria" className="pal-media">
          <GhostTitle ornament={<Gull />} side="right">
            Galería
          </GhostTitle>
          <ul className="pal-media__grid">
            {gallery.map((p, n) => {
              const Engraving = [Fish, Starfish, Waves, Anchor][n % 4]
              return (
                <li key={p.slug} className="pal-media__item">
                  <Engraving className={`pal-media__engraving pal-media__engraving--${n % 4}`} />
                  <a href={fichaHref(p.slug)} className="pal-frame">
                    <img src={p.images[2]?.src ?? p.images[0].src} alt={`Lancha ${p.name}`} loading="lazy" />
                    <span className="pal-play" aria-hidden="true">
                      <ShipWheel />
                    </span>
                  </a>
                  <p className="pal-plaque">
                    {p.name} <span aria-hidden="true">–</span> {p.kind}
                  </p>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ── Taller (en el lugar de las biografías) ── */}
        <section className="pal-shop" aria-labelledby="pal-shop-title">
          <div className="pal-shop__portrait">
            <Fish className="pal-shop__fish" />
            <div className="pal-shop__oval">
              <Workshop />
            </div>
            <Starfish className="pal-shop__star" />
            <Gull className="pal-shop__gull" />
          </div>
          <div className="pal-shop__text">
            <h2 id="pal-shop-title" className="pal-shop__title">
              <Caps text="Taller propio" />
            </h2>
            <p className="pal-shop__role">{service.title}</p>
            <div className="pal-blob pal-blob--square">
              <dl className="pal-shop__list">
                {(
                  [
                    ["Fibra de vidrio", equipment.fiberglass],
                    ["Acero inoxidable", equipment.stainless],
                    ["Tapicería", equipment.upholstery],
                    ["Electrónica y seguridad", equipment.accessories],
                  ] as const
                ).map(([title, items]) => (
                  <Fragment key={title}>
                    <dt>{title}</dt>
                    <dd>{items.join(", ")}.</dd>
                  </Fragment>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ── Contacto ── */}
        <section id="contacto" className="pal-contact" aria-labelledby="pal-contact-title">
          <div className="pal-blob pal-contact__card">
            <h2 id="pal-contact-title" className="pal-contact__title">
              <Caps text="Contacto" />
            </h2>
            <ul>
              <li>
                <MailIcon />
                <a href={`mailto:${contact.emails[0]}`}>{contact.emails[0]}</a>
              </li>
              {contact.phones.map((ph) => (
                <li key={ph}>
                  <PhoneIcon />
                  <a href={`tel:+54${ph.replace(/\D/g, "")}`}>{ph}</a>
                </li>
              ))}
              <li>
                <ChatIcon />
                <a href={WHATSAPP} target="_blank" rel="noreferrer">
                  WhatsApp {siteConfig.phone}
                </a>
              </li>
              <li>
                <InstagramIcon />
                <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <FacebookIcon />
                <a href={contact.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <PinIcon />
                <span>{contact.address}</span>
              </li>
            </ul>
          </div>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="pal-callout pal-callout--contact">
            <LifeRing className="pal-callout__ring" />
            <span className="pal-callout__small">no te olvides del</span>
            <span className="pal-callout__big">WhatsApp</span>
          </a>
        </section>
      </main>

      <PalFooter />
    </div>
  )
}
