"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { CheckCircle2, AlertCircle, Send } from "lucide-react"
import { sendContact, type ContactState } from "@/app/actions/contact"
import { cn } from "@/lib/utils"

const initialState: ContactState = { status: "idle" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground text-xs uppercase tracking-[0.25em] rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-sm animate-spin" />
          Enviando…
        </>
      ) : (
        <>
          Enviar mensaje
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  )
}

function InputRow({
  label,
  name,
  type = "text",
  required,
  error,
  as = "input",
  ...rest
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
  as?: "input" | "textarea"
  placeholder?: string
}) {
  const id = `field-${name}`
  const common = cn(
    "w-full bg-transparent border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 transition-colors",
    "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
    error && "border-destructive focus:border-destructive focus:ring-destructive/30",
  )

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[11px] uppercase tracking-[0.25em] text-foreground/70"
      >
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea id={id} name={name} rows={5} className={common} {...(rest as object)} />
      ) : (
        <input id={id} name={name} type={type} className={common} {...(rest as object)} />
      )}
      {error && (
        <span className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </span>
      )}
    </div>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(sendContact, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {/* honeypot */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputRow
          label="Nombre"
          name="name"
          required
          placeholder="Juan Pérez"
          error={state.fieldErrors?.name}
        />
        <InputRow
          label="Email"
          name="email"
          type="email"
          required
          placeholder="juan@email.com"
          error={state.fieldErrors?.email}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputRow
          label="Teléfono"
          name="phone"
          type="tel"
          placeholder="+54 11 5555 5555"
          error={state.fieldErrors?.phone}
        />
        <InputRow
          label="Asunto"
          name="subject"
          placeholder="Consulta por embarcación"
          error={state.fieldErrors?.subject}
        />
      </div>
      <InputRow
        as="textarea"
        label="Mensaje"
        name="message"
        required
        placeholder="Contanos qué producto te interesa, cuándo querés visitarnos, etc."
        error={state.fieldErrors?.message}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <SubmitButton />

        {state.status === "success" && (
          <div
            role="status"
            className="flex items-center gap-2 text-sm text-primary"
          >
            <CheckCircle2 className="h-4 w-4" />
            {state.message}
          </div>
        )}
        {state.status === "error" && !state.fieldErrors && (
          <div
            role="alert"
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            {state.message}
          </div>
        )}
      </div>
    </form>
  )
}
