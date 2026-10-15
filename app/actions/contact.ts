"use server"

export type ContactState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const subject = String(formData.get("subject") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()
  const hp = String(formData.get("website") ?? "") // honeypot

  if (hp) {
    // silently drop bots
    return { status: "success", message: "Mensaje recibido. Te contactaremos a la brevedad." }
  }

  const fieldErrors: ContactState["fieldErrors"] = {}
  if (name.length < 2) fieldErrors.name = "Ingresá tu nombre."
  if (!isEmail(email)) fieldErrors.email = "Email inválido."
  if (message.length < 10) fieldErrors.message = "Contanos un poco más (mín. 10 caracteres)."

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Revisá los campos marcados.", fieldErrors }
  }

  // Log on the server. In production, this is where you'd integrate with
  // email (Resend), a CRM, or a database.
  console.log("[v0] contact form submission", { name, email, phone, subject, message })

  return {
    status: "success",
    message: "¡Gracias! Recibimos tu mensaje y te vamos a contactar a la brevedad.",
  }
}
