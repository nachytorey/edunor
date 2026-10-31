import { whatsappLink } from "@/lib/site"

export function ClosingCta() {
  return (
    <section className="cta" data-ink="light" aria-labelledby="cta-title">
      <h2 id="cta-title" className="cta__q" data-lines-scroll>
        <span className="line">
          <span data-line>¿Agua</span>
        </span>
        <span className="line">
          <span data-line>o tierra?</span>
        </span>
      </h2>
      <div className="cta__band" data-rise-group>
        <div className="cta__choice" data-rise>
          <a
            className="btn"
            href={whatsappLink("Hola Edunor! Quiero una lancha. ¿Me ayudan a elegir?")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quiero una lancha
          </a>
          <span className="cta__or">o</span>
          <a
            className="btn"
            href={whatsappLink("Hola Edunor! Quiero un cuatriciclo o UTV. ¿Me ayudan a elegir?")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quiero un cuatriciclo
          </a>
        </div>
        <p className="cta__after" data-rise>
          Las dos abren un chat de WhatsApp con el equipo de ventas.
        </p>
      </div>
    </section>
  )
}
