"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { RowsPhotoAlbum } from "react-photo-album"
import "react-photo-album/rows.css"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/captions.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"

export type GalleryPhoto = {
  src: string
  width: number
  height: number
  alt: string
  name: string
  kind: string
  /** Ficha del modelo. No se llama `href`: con ese campo react-photo-album hace de la foto un link. */
  ficha: string
  category: "lanchas" | "cuatriciclos"
}

const FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "lanchas", label: "Lanchas" },
  { id: "cuatriciclos", label: "UTV y cuatris" },
] as const
type Filter = (typeof FILTERS)[number]["id"]

/** Fotos visibles de entrada; "Ver más" suma otra tanda. */
const PAGE = 15
const pad = (n: number) => String(n).padStart(2, "0")

/**
 * Galería de la portada: filas justificadas (react-photo-album, las fotos conservan su
 * proporción y cada fila llena el ancho) + visor con zoom, miniaturas y swipe
 * (yet-another-react-lightbox). Filtro por tipo y carga de a tandas.
 */
export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [filter, setFilter] = useState<Filter>("todas")
  const [shown, setShown] = useState(PAGE)
  const [index, setIndex] = useState(-1)
  const root = useRef<HTMLDivElement>(null)
  /** El visor se monta en .pal-page: así hereda colores y tipografías, y queda arriba del menú. */
  const [host, setHost] = useState<HTMLElement | null>(null)
  useEffect(() => setHost(root.current?.closest<HTMLElement>(".pal-page") ?? null), [])

  const list = useMemo(
    () => (filter === "todas" ? photos : photos.filter((p) => p.category === filter)),
    [photos, filter],
  )
  const visible = list.slice(0, shown)

  return (
    <div ref={root} className="pal-album">
      <div className="pal-album__filters" role="tablist" aria-label="Filtrar fotos">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className="pal-album__filter"
            onClick={() => {
              setFilter(f.id)
              setShown(PAGE)
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <RowsPhotoAlbum
        key={filter}
        photos={visible}
        spacing={(w) => (w < 600 ? 6 : 12)}
        targetRowHeight={(w) => (w < 600 ? 150 : w < 1100 ? 210 : 250)}
        rowConstraints={{ singleRowMaxHeight: 360 }}
        defaultContainerWidth={1200}
        sizes={{ size: "calc(100vw - 2 * var(--pal-gutter))" }}
        onClick={({ index }) => setIndex(index)}
        componentsProps={{ image: { loading: "lazy", decoding: "async" } }}
        render={{
          extras: (_, { photo }) => (
            <span className="pal-album__label">
              <strong>{photo.name}</strong>
              <span>{photo.kind}</span>
            </span>
          ),
        }}
      />

      {shown < list.length && (
        <button type="button" className="pal-album__more" onClick={() => setShown((n) => n + PAGE)}>
          Ver más fotos <span>({list.length - shown})</span>
        </button>
      )}

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={visible.map((p, n) => ({
          src: p.src,
          width: p.width,
          height: p.height,
          alt: p.alt,
          title: p.name,
          description: (
            <>
              {pad(n + 1)} / {pad(visible.length)} · {p.kind} · <a href={p.ficha}>Ver el modelo</a>
            </>
          ),
        }))}
        plugins={[Captions, Fullscreen, Thumbnails, Zoom]}
        className="pal-yarl"
        portal={{ root: host }}
        carousel={{ finite: false, preload: 2 }}
        controller={{ closeOnBackdropClick: true }}
        zoom={{ maxZoomPixelRatio: 2.5, scrollToZoom: true }}
        thumbnails={{ width: 110, height: 72, border: 0, borderRadius: 2, gap: 10, vignette: true }}
        captions={{ descriptionTextAlign: "center" }}
        labels={{
          Previous: "Foto anterior",
          Next: "Foto siguiente",
          Close: "Cerrar",
          "Zoom in": "Acercar",
          "Zoom out": "Alejar",
          "Enter Fullscreen": "Pantalla completa",
          "Exit Fullscreen": "Salir de pantalla completa",
          "Show thumbnails": "Mostrar miniaturas",
          "Hide thumbnails": "Ocultar miniaturas",
          "Show captions": "Mostrar textos",
          "Hide captions": "Ocultar textos",
        }}
      />
    </div>
  )
}
