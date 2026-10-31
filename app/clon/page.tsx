import { chunks, site } from "@/lib/clon"
import { Chunk } from "@/components/clon/chunks"
import { NavMenu } from "@/components/clon/nav-menu"

export default function ClonPage() {
  return (
    <>
      <main className="cl-page">
        <h1 className="logo home__logo">
          <a className="logo__link" href="#">
            {site.name}
          </a>
        </h1>
        <div className="home__chunks">
          {chunks.map((chunk, i) => (
            <Chunk key={i} chunk={chunk} index={i} />
          ))}
        </div>
        <footer className="cl-footer">
          <nav aria-label="Pie de página">
            {site.footer.map((label) => (
              <a key={label} className="cl-footer__item" href="#">
                {label}
              </a>
            ))}
          </nav>
        </footer>
      </main>
      <NavMenu />
    </>
  )
}
