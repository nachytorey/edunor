import { issue, sections } from "@/lib/stories"

function CompassRose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="60" cy="60" r="56" />
      <circle cx="60" cy="60" r="40" strokeDasharray="2 4" />
      <path d="M60 6v108M6 60h108" />
      <path d="M60 18 66 60 60 102 54 60Z" />
      <path d="M18 60 60 54l42 6-42 6Z" />
      <path d="M60 60 70 50M60 60 50 70M60 60 70 70M60 60 50 50" strokeWidth="0.75" />
      <path d="M60 18 66 60H54Z" fill="currentColor" />
      <text x="60" y="14" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" fontFamily="var(--font-caps)">
        N
      </text>
    </svg>
  )
}

const social = [
  { label: "Instagram", path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" },
  { label: "YouTube", path: "M3 8.5c0-1.4 1.1-2.5 2.5-2.5h13C19.9 6 21 7.1 21 8.5v7c0 1.4-1.1 2.5-2.5 2.5h-13A2.5 2.5 0 0 1 3 15.5v-7ZM10 9v6l5-3-5-3Z" },
  { label: "X", path: "M4 4h4l4.5 6.2L17.5 4H20l-6.3 7.4L20.5 20h-4l-4.8-6.6L5.8 20H3.4l6.9-8L4 4Z" },
  { label: "Facebook", path: "M14 8h2V5h-2.5A3.5 3.5 0 0 0 10 8.5V10H8v3h2v7h3v-7h2.3l.7-3h-3V9a1 1 0 0 1 1-1Z" },
]

const columns: { title: string; links: string[] }[] = [
  { title: "Secciones", links: sections.map((s) => s.label) },
  { title: "Revista", links: ["Edición impresa", "Archivo de números", "Suscripciones", "Publicidad", "Quiénes somos"] },
  { title: "Contacto", links: ["redaccion@bitacora.example", "+54 11 4000 0000", "Av. Costanera 1200, CABA", "Prensa"] },
  { title: "Legal", links: ["Términos y condiciones", "Política de privacidad", "Cookies", "Defensa del consumidor"] },
]

export function SiteFooter() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-page">
        <div className="rule-double text-white" aria-hidden="true" />
        <div className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-4">
            <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase leading-none tracking-[-0.03em]">
              {issue.name}
            </p>
            <p className="caps mt-3 text-kicker tracking-[0.3em] text-sky-100/80">{issue.tagline}</p>
            <p className="mt-6 max-w-[36ch] text-[0.9375rem] leading-[1.6] text-sky-100/80">
              Veinticinco años contando el agua: barcos, gente y rutas del Río de la Plata al mundo. Edición impresa trimestral y portada digital semanal.
            </p>
            <ul className="mt-6 flex gap-2" aria-label="Redes sociales">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href="#"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center border border-white/60 text-white transition-colors hover:bg-white hover:text-navy-900 focus-visible:outline-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Mapa del sitio" className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-7 lg:col-start-6">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="caps border-b border-white/40 pb-2 text-kicker font-bold tracking-[0.2em] text-sky-100">
                  {col.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-[0.9375rem] text-white/85 underline-offset-4 hover:text-white hover:underline">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/30 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="caps text-kicker text-sky-100/80">
            © 2026 {issue.name} — Todos los derechos reservados · Nº {issue.number} · Año {issue.year}
          </p>
          <div className="flex items-center gap-4">
            <p className="caps text-kicker text-sky-100/60">{issue.coordinates}</p>
            <CompassRose className="h-12 w-12 text-brass" />
          </div>
        </div>
      </div>
    </footer>
  )
}
