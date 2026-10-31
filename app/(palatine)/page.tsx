/**
 * / — portada de Edunor Náutica con la composición de ensemblelapalatine.com
 * (hero ilustrado, títulos fantasma gigantes, manchas de color, marcos entintados, carteles
 * indicadores) y la identidad de Edunor: marino, papel y naranja, con grabados náuticos propios.
 * Textos e imágenes son de Edunor; los ornamentos están dibujados en components/palatine/ornaments.tsx.
 */
import { Fragment } from "react"
import { fichaHref, GhostTitle, PalFooter, Quote, Signs, WHATSAPP } from "@/components/palatine/blocks"
import { Caps, Fader, PalNav } from "@/components/palatine/interactive"
import { GalleryReel } from "@/components/palatine/gallery-reel"
import { PhotoDeck } from "@/components/palatine/photo-deck"
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

/** Años de Edunor (se recalcula en cada build). */
const YEARS = new Date().getFullYear() - company.founded

/** Cómo acompaña Edunor la compra de una lancha: sale de lo que hacen hoy (lib/edunor.ts). */
const STEPS = [
  {
    title: "Te escuchamos",
    text: "Dónde navegás, con cuánta gente y qué querés hacer en el agua. Con eso te recomendamos casco y motor, sin venderte de más.",
  },
  {
    title: "La ves en persona",
    text: `Más de ${company.showroomM2.toLocaleString("es-AR")} m² de showroom en Témperley y una sede en Canning: te subís, comparás terminaciones y sacás todas las dudas.`,
  },
  {
    title: "La equipamos a medida",
    text: "En el taller propio fabricamos consolas, arcos de radar, guardamancebos y tapizados náuticos para que salga como la querés.",
  },
  {
    title: "Te la entregamos lista",
    text: "Sale de Edunor preparada para navegar, con la garantía oficial de cada marca.",
  },
  {
    title: "Seguimos con vos",
    text: `${service.title}, con repuestos originales en stock y atención en guarderías de Zona Norte.`,
  },
]

const featured = lanchas.slice(0, 6)
/** UTV/cuatris: una foto por modelo (su portada). Los modelos que solo tienen video quedan para la ficha. */
const utvPhotos = cuatriciclos.flatMap((p) => {
  const photo = p.images.find((m) => !m.video && m.src)
  return photo ? [{ href: fichaHref(p.slug), src: photo.src, alt: photo.alt || `${p.kind} ${p.name}`, name: p.name }] : []
})
/** Galería: una foto de cada lancha que no sea la portada (esa ya está en Modelos). */
const gallery = lanchas.slice(0, 12).flatMap((p) => {
  const photos = p.images.filter((m) => !m.video && m.src)
  const photo = photos[2] ?? photos[1] ?? photos[0]
  return photo ? [{ src: photo.src, alt: `Lancha ${p.name}`, name: p.name, kind: p.kind, href: fichaHref(p.slug) }] : []
})

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

        {/* ── UTV y cuatriciclos: pila de fotos sueltas, una por modelo ── */}
        <section id="utv" className="pal-utv" aria-labelledby="pal-utv-title">
          <GhostTitle ornament={<CompassRose />} side="right">
            Tierra
          </GhostTitle>
          <div className="pal-utv__stage">
            <div className="pal-utv__intro">
              <h2 id="pal-utv-title" className="pal-utv__title">
                <Caps text="UTV" />
                <span className="pal-utv__title-sub">
                  y <Caps text="cuatriciclos" />
                </span>
              </h2>
              <p>
                Cuatriciclos y UTV para el campo, la arena y el trabajo. Los tenés en el showroom, listos para probar, con
                service oficial y repuestos originales.
              </p>
              <ul className="pal-utv__models">
                {cuatriciclos.map((p) => (
                  <li key={p.slug}>
                    <a href={fichaHref(p.slug)}>{p.name}</a>
                  </li>
                ))}
              </ul>
              <div className="pal-gen__arrows">
                <a href={whatsappLink("Hola Edunor! Quiero consultar por UTV y cuatriciclos.")} target="_blank" rel="noreferrer">
                  Consultar
                </a>
              </div>
            </div>
            <PhotoDeck photos={utvPhotos} label="Fotos de UTV y cuatriciclos" />
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

        {/* ── Quiénes somos: la familia y cómo acompaña la compra de una lancha ── */}
        <section id="quienes" className="pal-about" aria-labelledby="pal-about-title">
          <GhostTitle ornament={<Anchor />} side="left">
            Familia
          </GhostTitle>
          <div className="pal-about__grid">
            <div className="pal-about__intro">
              <div className="pal-about__seal" aria-hidden="true">
                <span>desde</span>
                <strong>{company.founded}</strong>
                <span>{YEARS} años</span>
              </div>
              <h2 id="pal-about-title" className="pal-about__title">
                <Caps text="Quiénes somos" />
              </h2>
              <p className="pal-about__lead">
                Somos una empresa familiar. Empezamos en {company.founded} entre botes, carpas y motores, y en más de{" "}
                {Math.floor(YEARS / 10) * 10} años aprendimos que comprar una lancha no termina cuando firmás: ahí
                empieza.
              </p>
              <p>
                Por eso no te vendemos un casco y te despedimos en la puerta. Te acompañamos a elegir, la preparamos
                en nuestro taller y seguimos a tu lado en cada service.
              </p>
              <Signs
                items={[
                  { href: "/empresa", label: "conocenos" },
                  { href: whatsappLink("Hola Edunor! Quiero asesoramiento para elegir una lancha."), label: "asesorame", external: true },
                ]}
              />
            </div>
            <div className="pal-blob pal-blob--square pal-about__steps">
              <h3 className="pal-about__steps-title">Así elegís tu lancha con nosotros</h3>
              <ol>
                {STEPS.map((step, n) => (
                  <li key={step.title}>
                    <span className="pal-about__num" aria-hidden="true">
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4>{step.title}</h4>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
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
        <section id="galeria" className="pal-gallery">
          <GhostTitle ornament={<Gull />} side="right">
            Galería
          </GhostTitle>
          <GalleryReel photos={gallery} />
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
