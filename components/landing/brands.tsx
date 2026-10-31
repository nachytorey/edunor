import { brandGroups } from "@/lib/products"

export function Brands() {
  return (
    <section className="brands" id="marcas" data-ink="light" aria-labelledby="brands-title">
      <div className="brands__col">
        <h2 id="brands-title" className="display brands__word lines" data-lines-scroll>
          <span className="line">
            <span data-line>Marcas</span>
          </span>
        </h2>
        <p className="brands__lead">
          Representamos a las marcas que vendemos y las reparamos en nuestro taller, con técnicos
          certificados y repuestos originales.
        </p>
        <div className="bars" data-bars>
          {brandGroups.map((group, i) => (
            <details className="bar" key={group.name} open={i === 0}>
              <summary>
                <span>{group.name}</span>
                <span className="bar__plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <ul className="bar__items">
                {group.items.map((item) => (
                  <li className="bar__item" key={item.name}>
                    <span>{item.name}</span>
                    <span className="bar__note">{item.note}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
