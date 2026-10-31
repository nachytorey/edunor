"use client"

import { useId, useState, type FormEvent } from "react"

type Status = "idle" | "loading" | "success" | "error"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function Newsletter() {
  const id = useId()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setStatus("error")
      setMessage("Revisá el correo: tiene que tener el formato nombre@dominio.com.")
      return
    }
    setStatus("loading")
    setMessage("")
    try {
      // Reemplazar por el POST real a tu proveedor (Mailchimp, Resend, Supabase, etc.).
      await new Promise((r) => setTimeout(r, 700))
      setStatus("success")
      setMessage(`Listo. Te enviamos un correo a ${value} para confirmar la suscripción.`)
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("No pudimos registrar tu correo. Probá de nuevo en unos minutos.")
    }
  }

  const invalid = status === "error"

  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="border-t border-navy-900 bg-paper">
      <div className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-3xl border-2 border-navy-900 bg-sky-100 p-6 sm:p-10">
          <p className="caps text-kicker text-signal-red-ink">Newsletter semanal</p>
          <h2 id="newsletter-title" className="headline mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)]">
            Recibí la marea de noticias cada semana
          </h2>
          <p className="mt-3 max-w-[52ch] leading-[1.6] text-navy-900/85">
            Pruebas, guías de navegación, regatas y destinos. Un correo los viernes, sin spam.
          </p>

          {status === "success" ? (
            <div role="status" aria-live="polite" className="mt-6 border-l-4 border-navy-900 bg-white p-4">
              <p className="caps text-kicker text-navy-900">Suscripción enviada</p>
              <p className="mt-1 text-navy-900">{message}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
                <label htmlFor={`${id}-email`} className="sr-only">
                  Correo electrónico
                </label>
                <input
                  id={`${id}-email`}
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === "error") setStatus("idle")
                  }}
                  aria-invalid={invalid || undefined}
                  aria-describedby={`${id}-legal ${invalid ? `${id}-msg` : ""}`.trim()}
                  className="h-12 flex-1 border-2 border-navy-900 bg-white px-4 font-body text-[1rem] text-navy-900 placeholder:text-navy-900/50 focus-visible:outline-offset-[-3px] sm:border-r-0"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="caps h-12 bg-signal-red px-6 text-meta font-semibold text-white transition-colors hover:bg-signal-red-ink disabled:opacity-70"
                >
                  {status === "loading" ? "Enviando…" : "Suscribirme"}
                </button>
              </div>
              <p id={`${id}-msg`} role="alert" aria-live="assertive" className="caps mt-3 min-h-[1.25rem] text-kicker text-signal-red-ink">
                {invalid ? message : ""}
              </p>
              <p id={`${id}-legal`} className="mt-1 text-[0.8125rem] leading-[1.5] text-navy-900/70">
                Al suscribirte aceptás la{" "}
                <a href="#" className="underline underline-offset-2">
                  política de privacidad
                </a>
                . Podés darte de baja cuando quieras desde el pie de cada correo.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
