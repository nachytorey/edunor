import type { CSSProperties } from "react"
import Image from "next/image"
import { featured, type Product } from "@/lib/products"
import { whatsappLink } from "@/lib/site"

function ProductChapter({ product, id, first }: { product: Product; id?: string; first: boolean }) {
  const style = { "--ch-ground": product.ground, "--ch-ink": product.ink } as CSSProperties
  const titleId = `chapter-${product.slug}`

  return (
    <section className="chapter" id={id} data-chapter data-ink="light" style={style} aria-labelledby={titleId}>
      <div className="chapter__field" data-field />

      <h2 id={titleId} className="display chapter__title lines">
        {product.nameLines.map((line) => (
          <span className="line" key={line}>
            <span data-line>{line}</span>
          </span>
        ))}
      </h2>

      <ul className="chapter__facts" aria-label={`Datos de ${product.name}`}>
        {product.facts.map((fact) => (
          <li key={fact} data-rise>
            {fact}
          </li>
        ))}
      </ul>

      <figure className="chapter__portrait" data-portrait>
        <Image
          src={product.image}
          alt={product.alt}
          width={1024}
          height={1024}
          sizes="(max-width: 767px) 80vw, 56vh"
          priority={first}
        />
      </figure>

      <p className="chapter__lede" data-rise>
        {product.kind}. {product.line}
      </p>

      <a
        className="chapter__link"
        data-rise
        href={whatsappLink(`Hola Edunor! Quiero consultar por ${product.name} (${product.kind}).`)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Consultar por {product.name}
      </a>
    </section>
  )
}

export function Showcase() {
  return (
    <>
      {featured.map((product, i) => {
        const firstOfWorld = featured.findIndex((p) => p.world === product.world) === i
        const id = firstOfWorld ? (product.world === "agua" ? "lanchas" : "cuatriciclos") : undefined
        return <ProductChapter key={product.slug} product={product} id={id} first={i === 0} />
      })}
    </>
  )
}
