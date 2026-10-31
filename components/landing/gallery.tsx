import Image from "next/image"
import { more } from "@/lib/products"
import { whatsappLink } from "@/lib/site"

export function Gallery() {
  return (
    <section className="gallery" data-ink="dark" aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="display gallery__title lines" data-lines-scroll>
        <span className="line">
          <span data-line>Pasá a</span>
        </span>
        <span className="line">
          <span data-line>verlos</span>
        </span>
      </h2>

      <div className="gallery__prints" data-prints>
        {more.map((product, i) => (
          <a
            key={product.slug}
            className={`print print--${i + 1}`}
            data-print
            href={whatsappLink(`Hola Edunor! Quiero consultar por ${product.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="print__inner">
              <Image
                src={product.image}
                alt={product.alt}
                width={1024}
                height={1024}
                sizes="(max-width: 767px) 52vw, 26vw"
                loading="lazy"
              />
              {i < 2 && <span className="print__name">{product.name}</span>}
            </span>
          </a>
        ))}
      </div>

      <p className="gallery__note">
        General XP, Outlander 650 y el equipamiento de navegación están en exhibición en Témperley y
        Canning, con entrega inmediata.
      </p>
    </section>
  )
}
