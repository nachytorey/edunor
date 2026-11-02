/**
 * Datos estructurados (JSON-LD, schema.org) del sitio. Google los lee del HTML del servidor,
 * por eso se imprimen con un <script> común y no con next/script.
 *
 * - organizationJsonLd: la empresa (Organization) con sus dos locales (Store) y el sitio (WebSite). Va en el layout raíz.
 * - productJsonLd + breadcrumbJsonLd: la ficha de cada modelo.
 */
import type { CatalogProduct } from "@/lib/catalog"
import { brands, company, contact } from "@/lib/edunor"
import { locations, siteConfig, SITE_URL } from "@/lib/site"

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`)

/** Teléfono en formato internacional: "011 4231-5663" → "+54 11 4231 5663". */
const intl = (phone: string) => `+54 ${phone.replace(/\D/g, "").replace(/^0/, "").replace(/^(\d{2})(\d{4})(\d{4})$/, "$1 $2 $3")}`

const ORG_ID = `${SITE_URL}/#organization`

export function organizationJsonLd() {
  const stores = locations.map((l) => ({
    "@type": "Store",
    "@id": `${SITE_URL}/#${l.id}`,
    name: `${siteConfig.name} — ${l.name}`,
    image: abs("/og/edunor-portada.jpg"),
    telephone: l.phones.map((p) => intl(`011 ${p}`)),
    email: contact.emails[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: l.address,
      addressLocality: l.city,
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.mapsQuery)}`,
    parentOrganization: { "@id": ORG_ID },
  }))

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: siteConfig.name,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: abs("/images/edunor-logo.png"), width: 2128, height: 770 },
        image: abs("/og/edunor-portada.jpg"),
        description: company.summary,
        foundingDate: String(company.founded),
        telephone: intl(contact.phones[0]),
        email: contact.emails[0],
        sameAs: [siteConfig.social.instagram, contact.facebook, siteConfig.social.youtube],
        brand: [...new Set(brands.flatMap((b) => b.names))].map((name) => ({ "@type": "Brand", name })),
        areaServed: { "@type": "AdministrativeArea", name: "Buenos Aires, Argentina" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: intl(contact.phones[0]),
          email: contact.emails[0],
          availableLanguage: "es",
        },
        location: stores.map((s) => ({ "@id": s["@id"] })),
      },
      ...stores,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: siteConfig.name,
        inLanguage: "es-AR",
        publisher: { "@id": ORG_ID },
      },
    ],
  }
}

/** Marca del modelo cuando su nombre arranca con una de las que representa Edunor ("Polaris RZR…" → Polaris). */
function brandOf(product: CatalogProduct) {
  const names = [...new Set(brands.flatMap((b) => b.names))]
  const hit = names.find((n) => product.name.toLowerCase().startsWith(n.toLowerCase()))
  if (hit) return hit
  // Las lanchas del catálogo son Canestrari salvo que el nombre diga otra marca.
  return product.category === "lanchas" ? "Canestrari" : undefined
}

export function productJsonLd(product: CatalogProduct) {
  const brand = brandOf(product)
  const photos = product.images.filter((i) => i.src && !i.video).map((i) => abs(i.src))
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ??
      `${product.kind} ${product.name}, disponible en el showroom de Edunor Náutica en Témperley y Canning.`,
    image: photos,
    category: product.category === "lanchas" ? "Lanchas" : "Cuatriciclos y UTV",
    url: abs(product.url),
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    // Sin `offers`: no publicamos precio y Google marca como error una Offer sin price. Queda como Product descriptivo.
    manufacturer: brand ? { "@type": "Organization", name: brand } : undefined,
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, n) => ({
      "@type": "ListItem",
      position: n + 1,
      name: it.name,
      item: abs(it.path),
    })),
  }
}

/** Imprime un bloque JSON-LD en el HTML del servidor. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
