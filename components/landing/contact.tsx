"use client"

import { useState, type FormEvent } from "react"
import { locations, siteConfig, whatsappLink } from "@/lib/site"

export function Contact() {
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get("name") ?? "").trim()
    const phone = String(data.get("phone") ?? "").trim()
    const interest = String(data.get("interest") ?? "").trim()
    const message = String(data.get("message") ?? "").trim()
    const text = [
      `Hola Edunor! Soy ${name || "..."}.`,
      interest ? `Me interesa: ${interest}.` : "",
      message,
      phone ? `Mi teléfono: ${phone}.` : "",
    ]
      .filter(Boolean)
      .join(" ")
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer")
    setSent(true)
  }

  return (
    <section className="contact" id="contacto" data-ink="dark" aria-labelledby="contact-title">
      <div className="coupon" data-rise-group>
        <span className="coupon__notch coupon__notch--top" aria-hidden="true" />
        <span className="coupon__notch coupon__notch--bottom" aria-hidden="true" />

        <div className="coupon__left">
          <h2 id="contact-title" className="display coupon__title lines" data-lines-scroll>
            <span className="line">
              <span data-line>Contanos</span>
            </span>
            <span className="line">
              <span data-line>qué buscás</span>
            </span>
          </h2>
          <p className="coupon__note" data-rise>
            Te respondemos por WhatsApp en horario de showroom. Si preferís, escribinos a{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> o llamá al{" "}
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>.{" "}
            {locations.map((l) => `${l.name}: ${l.address}`).join(". ")}.
          </p>
        </div>

        <form className="coupon__form" onSubmit={onSubmit} data-rise>
          <label className="sr-only" htmlFor="contact-name">
            Nombre
          </label>
          <input id="contact-name" name="name" placeholder="Nombre" autoComplete="name" required />

          <label className="sr-only" htmlFor="contact-phone">
            Teléfono
          </label>
          <input id="contact-phone" name="phone" type="tel" placeholder="Teléfono" autoComplete="tel" />

          <label className="sr-only" htmlFor="contact-interest">
            Qué te interesa
          </label>
          <input
            id="contact-interest"
            name="interest"
            placeholder="¿Lancha, cuatriciclo, service?"
            list="contact-options"
          />
          <datalist id="contact-options">
            <option value="Una lancha" />
            <option value="Un cuatriciclo o UTV" />
            <option value="Service de mi motor" />
            <option value="Un semirrígido" />
          </datalist>

          <label className="sr-only" htmlFor="contact-message">
            Mensaje
          </label>
          <textarea id="contact-message" name="message" placeholder="Contanos un poco más" rows={3} />

          <button className="coupon__submit" type="submit">
            {sent ? "Abrir WhatsApp de nuevo" : "Enviar por WhatsApp"}
          </button>
          {sent && (
            <p className="coupon__sent" role="status">
              Se abrió WhatsApp con tu mensaje. Si no lo ves, revisá las ventanas bloqueadas.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
