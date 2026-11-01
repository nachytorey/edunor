/**
 * / — portada de Edunor Náutica. Cuenta la historia de comprar con Edunor en dos capítulos, del
 * primer mensaje a la salida al agua. Vestida con el logo: negro con malla hexagonal, blanco,
 * itálica pesada, cortes de velocidad y todo en ángulo recto.
 *
 * Orden: Hero → Nosotros (manifiesto) → 01 Elegís (modelos) → 02 Salís a navegar (galería +
 * testimonios) → También (UTV, videos, generadores) → Showroom → Contacto.
 *
 * Los testimonios son inventados (relleno realista) hasta tener los reales. Se reemplazan y listo.
 */
import { Fragment } from "react"
import { fichaHref, GhostTitle, PalFooter, Quote, Signs, WHATSAPP } from "@/components/palatine/blocks"
import { Chapter } from "@/components/palatine/chapter"
import { Caps, Fader, PalNav } from "@/components/palatine/interactive"
import { PhotoGallery, type GalleryPhoto } from "@/components/palatine/photo-gallery"
import { HeroMotion } from "@/components/palatine/hero-motion"
import { PhotoDeck } from "@/components/palatine/photo-deck"
import { SectionMotion } from "@/components/palatine/section-motion"
import { VideoReel, type ReelVideo } from "@/components/palatine/video-reel"
import { imageDims } from "@/lib/image-dims"
import {
  ChatIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
} from "@/components/palatine/ornaments"
import { catalog, cuatriciclos, lanchas, publicidad } from "@/lib/catalog"
import { company, contact, generators } from "@/lib/edunor"
import { locations, siteConfig, whatsappLink } from "@/lib/site"

const NAV = [
  { href: "#modelos", label: "Modelos" },
  { href: "#utv", label: "UTV y Cuatris" },
  { href: "#videos", label: "Videos" },
  { href: "#generadores", label: "Generadores" },
  { href: "#showroom", label: "Showroom" },
  { href: "#contacto", label: "Contacto" },
]

/** Años de Edunor (se recalcula en cada build). */
const YEARS = new Date().getFullYear() - company.founded

/** Testimonios: INVENTADOS como relleno realista. Reemplazar por los reales (nombre, lancha, año) cuando lleguen. */
const TESTIMONIALS: { text: string; source: string }[] = [
  {
    text: "Fui a mirar una 208 y salí con una 225 Cuddy, pero porque me convencieron de que para dormir en el Delta con los chicos la otra me iba a quedar chica. Tenían razón. Cuatro temporadas después el service lo sigo haciendo ahí: la conocen mejor que yo.",
    source: "Martín R. · Canestrari 225 Cuddy DF · Compró en 2022",
  },
  {
    text: "Me la entregaron con el motor instalado, el trailer armado y los papeles en mano. La bajé al agua ese mismo fin de semana. Un sábado de enero se me cortó el combustible en Tigre, mandé un WhatsApp y a la media hora me estaban diciendo qué revisar. Eso no se paga.",
    source: "Soledad y Javier P. · Canestrari 178 · Guardería en Tigre",
  },
  {
    text: "Era mi primera lancha y no tenía idea de nada. Nunca sentí que me quisieran vender la más cara. Me explicaron qué motor le iba, por qué, y hasta me enseñaron a enganchar el trailer en el estacionamiento. Hoy salgo a pescar todos los fines de semana a Punta Lara.",
    source: "Gustavo L. · Canestrari 168 · Compró en 2024",
  },
]

const featured = lanchas.slice(0, 6)
/** UTV/cuatris: una foto por modelo (su portada). Solo fotos: los modelos que solo tienen video quedan para la ficha. */
const utvPhotos = cuatriciclos.flatMap((p) => {
  const photo = p.images.find((m) => !m.video && m.src)
  return photo ? [{ href: fichaHref(p.slug), src: photo.src, alt: photo.alt || `${p.kind} ${p.name}`, name: p.name }] : []
})
/** En la galería, el RZR XP 1000 Premium abre la tanda de UTV y cuatris. */
const GALLERY_LEAD = "polaris-rzr-xp-1000-premium"
const galleryCuatris = [...cuatriciclos].sort((a, b) => Number(b.slug === GALLERY_LEAD) - Number(a.slug === GALLERY_LEAD))
/**
 * Galería: hasta 4 fotos por modelo (sin la portada, que ya está en Modelos y UTV), intercaladas
 * para que no queden juntas las del mismo modelo. Las medidas se leen del archivo en el build.
 */
const galleryByModel = [...lanchas, ...galleryCuatris].map((p) =>
  p.images
    .filter((m) => !m.video && m.src)
    .slice(1, 5)
    .flatMap((m): GalleryPhoto[] => {
      const dims = imageDims(m.src)
      if (!dims) return []
      return [{ src: m.src, ...dims, alt: m.alt || `${p.kind} ${p.name}`, name: p.name, kind: p.kind, ficha: fichaHref(p.slug), category: p.category }]
    }),
)
/** Fotos de campaña (carpeta PUBLICIDAD de Drive) cierran la galería, en su categoría. */
const adPhotos = publicidad.flatMap((p) =>
  p.images
    .filter((m) => !m.video && m.src)
    .flatMap((m): GalleryPhoto[] => {
      const dims = imageDims(m.src)
      if (!dims) return []
      return [{ src: m.src, ...dims, alt: m.alt || `${p.kind} ${p.name}`, name: p.name, kind: p.kind, ficha: p.url, category: p.category }]
    }),
)
const gallery = [...Array.from({ length: 4 }, (_, i) => galleryByModel.flatMap((photos) => photos[i] ?? [])).flat(), ...adPhotos]
/** Cinta de videos: primero los de publicidad (hechos para mostrar), después los de las fichas de los modelos. */
const toReel = (images: { src: string; video?: string }[], name: string, kind: string, ficha: string, cta?: string): ReelVideo[] =>
  images
    .filter((m) => m.video && m.src)
    .flatMap((m) => {
      const dims = imageDims(m.src)
      if (!dims) return []
      return [{ src: m.video!, poster: m.src, ratio: dims.width / dims.height, name, kind, ficha, cta }]
    })
const reel: ReelVideo[] = [
  ...publicidad.flatMap((p) => toReel(p.images, p.name, p.kind, p.url, p.cta)),
  ...catalog.flatMap((p) => toReel(p.images, p.name, p.kind, fichaHref(p.slug))),
]

export default function PalatinePage() {
  return (
    <div id="top" className="pal-page">
      <PalNav links={NAV} whatsapp={WHATSAPP} />

      <main>
        {/* ── Hero: la relación, no el stock. Foto ideal: gente navegando o el río, no el local. ── */}
        <HeroMotion labelledBy="pal-hero-title">
          <div className="pal-hero__art">
            <div className="pal-hero__porthole">
              <img
                src="/palatine/portada.webp"
                alt="Local de Edunor con lanchas en el salón y dos cuatriciclos Polaris en la vereda"
                fetchPriority="high"
              />
              <span className="pal-hero__flash" aria-hidden="true" />
            </div>
          </div>
          <div className="pal-hero__text">
            <h1 id="pal-hero-title" className="pal-hero__title">
              {/* Palabras sueltas (no <Caps>): la entrada las anima una por una. */}
              {"La lancha es solo el principio".split(" ").map((w, n) => (
                <Fragment key={n}>
                  {n > 0 && " "}
                  <span className="pal-hero__word">{w}</span>
                </Fragment>
              ))}
            </h1>
            <p className="pal-hero__sub">
              Elegila con quien la conoce de verdad, llevátela lista para navegar y volvé al agua cada fin de semana sin
              dolores de cabeza.
            </p>
          </div>
        </HeroMotion>

        {/* ── Historia: el manifiesto que ordena todo lo que sigue (solo texto, sin foto) ── */}
        <section id="historia" className="pal-about pal-about--text" aria-labelledby="pal-about-title">
          <GhostTitle side="left">
            Nosotros
          </GhostTitle>
          <div className="pal-about__grid">
            <div className="pal-about__intro">
              <div className="pal-about__seal" aria-hidden="true">
                <span>hace</span>
                <strong>{YEARS}</strong>
                <span>años</span>
              </div>
              <h2 id="pal-about-title" className="pal-about__title">
                <Caps text={`Una empresa familiar desde ${company.founded}`} />
              </h2>
              <p className="pal-about__lead">Para nosotros lo importante empieza cuando firmás. Antes, durante y mucho después.</p>
              <p>
                Arrancamos entre botes, carpas y motores, y hoy nos acompañan lanchas, UTV, cuatriciclos y generadores.
                Lo que no cambió en más de {Math.floor(YEARS / 10) * 10} años es lo que nos importa: que elegir sea
                fácil, que te lleves exactamente lo que necesitás y que después sigas teniendo a quién llamar.
              </p>
              <Signs
                items={[
                  { href: "#modelos", label: "empezar" },
                  { href: whatsappLink("Hola Edunor! Quiero asesoramiento para elegir."), label: "escribinos", external: true },
                ]}
              />
            </div>
          </div>
        </section>

        {/* ── 01 · Elegís: te escuchamos y la ves en persona ── */}
        <section id="modelos" className="pal-models pal-story" aria-labelledby="pal-ch1">
          <GhostTitle side="left">
            Elegís
          </GhostTitle>
          <Chapter n={1} name="Elegís" title={<span id="pal-ch1"><Caps text="Elegís con alguien que te escucha" /></span>}>
            <p>
              Dónde navegás, con cuánta gente y qué querés hacer en el agua. Con eso te recomendamos casco y motor, sin
              venderte de más. Después la ves en persona: más de {company.showroomM2.toLocaleString("es-AR")} m² de
              showroom en Témperley y una sede en Canning para subirte, comparar terminaciones y sacar todas las dudas.
            </p>
          </Chapter>
          <Fader label="Modelos de lanchas" className="pal-models__slider">
            {featured.map((p) => (
              <article key={p.slug} className="pal-model">
                {/* La foto manda: ancho completo; el texto va en un panel encima de su esquina. */}
                <a href={fichaHref(p.slug)} className="pal-frame pal-model__image">
                  <span className="pal-model__photo">
                    <img src={p.images[0].src} alt={p.images[0].alt || `Lancha ${p.name}`} loading="lazy" />
                  </span>
                </a>
                <div className="pal-bubble pal-model__story">
                  <h3 className="pal-model__name">
                    <Caps text={p.name} />
                  </h3>
                  <p>
                    {p.description ??
                      `${p.kind} ${p.name}, lista en el showroom. Vení a subirte, mirá los acabados y consultanos por motorización, equipamiento y entrega.`}
                  </p>
                  <Signs
                    items={[
                      { href: p.href, label: "consultar" , external: true },
                      { href: fichaHref(p.slug), label: "ver ficha" },
                    ]}
                  />
                </div>
              </article>
            ))}
          </Fader>
        </section>

        {/* ── 02 · Salís a navegar: la entrega, los clientes y las lanchas en el agua ── */}
        <section id="galeria" className="pal-gallery pal-story" aria-labelledby="pal-ch2">
          <GhostTitle side="left">
            Agua
          </GhostTitle>
          <Chapter n={2} name="Salís a navegar" title={<span id="pal-ch2"><Caps text="Te la entregamos lista para el agua" /></span>}>
            <p>
              Sale de Edunor preparada para navegar, con la garantía oficial de cada marca. Y lo que viene después es
              lo mejor: estas son lanchas nuestras, de clientes nuestros, en el río.
            </p>
          </Chapter>
          <div className="pal-story__voices">
            {TESTIMONIALS.map((t) => (
              <Quote key={t.source} text={t.text} source={t.source} />
            ))}
          </div>
          {/* Hoy son fotos de showroom. La idea es que este bloque sea solo lanchas navegando, con gente arriba. */}
          <PhotoGallery photos={gallery} />
        </section>

        {/* ── También: lo que vendemos además de lanchas ── */}
        <div className="pal-also" role="presentation">
          <span>También</span>
        </div>

        {/* ── UTV y cuatriciclos: pila de fotos sueltas, una por modelo ── */}
        <section id="utv" className="pal-utv" aria-labelledby="pal-utv-title">
          <GhostTitle side="right">
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

        {/* ── Videos: publicidad primero, después los de los modelos, en una cinta ── */}
        {reel.length > 0 && (
          <section id="videos" className="pal-video" aria-labelledby="pal-video-title">
            <GhostTitle side="left">
              Video
            </GhostTitle>
            <div className="pal-video__head">
              <h2 id="pal-video-title" className="pal-video__title">
                <Caps text="En movimiento" />
              </h2>
              <p>Fotos están bien, pero esto se entiende andando. Tocá un video para pausarlo y el botón para escucharlo.</p>
            </div>
            <VideoReel videos={reel} label="Videos de modelos" />
          </section>
        )}

        {/* ── Generadores ── */}
        <section id="generadores" className="pal-gen">
          <GhostTitle side="right">Generadores</GhostTitle>
          <div className="pal-gen__grid">
            <div className="pal-gen__copy">
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

        {/* ── Showroom ── */}
        <section id="showroom" className="pal-show">
          <GhostTitle side="left">
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
              <span className="pal-callout__small">coordiná tu</span>
              <span className="pal-callout__big">Visita</span>
              <span className="pal-callout__small pal-callout__small--right">al showroom</span>
            </a>
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
            <span className="pal-callout__small">no te olvides del</span>
            <span className="pal-callout__big">WhatsApp</span>
          </a>
        </section>
      </main>
      <SectionMotion />

      <PalFooter />
    </div>
  )
}
