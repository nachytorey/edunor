import { formatDate, issue } from "@/lib/stories"

export function UtilityBar() {
  return (
    <div className="bg-navy-900 text-white">
      <div className="container-page flex h-9 items-center justify-between gap-4 sm:h-10">
        <p className="caps flex min-w-0 items-center gap-3 text-kicker font-medium">
          <time dateTime={issue.date} className="whitespace-nowrap">
            {formatDate(issue.date)}
          </time>
          <span aria-hidden="true" className="h-3 w-px bg-white/40" />
          <span className="whitespace-nowrap">{issue.coordinates}</span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-white/40 md:block" />
          <span className="hidden truncate md:inline">{issue.weather}</span>
        </p>
        <nav aria-label="Acceso" className="caps flex items-center gap-4 text-kicker font-medium">
          <a href="#newsletter" className="link-red whitespace-nowrap">
            Suscribite
          </a>
          <a href="#" className="link-red hidden whitespace-nowrap sm:inline">
            Ingresar
          </a>
        </nav>
      </div>
    </div>
  )
}
