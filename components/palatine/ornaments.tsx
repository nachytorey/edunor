import type { SVGProps } from "react"

/**
 * Ornamentos de línea para /palatine: grabados náuticos propios (rosa de los vientos, ancla,
 * timón, faro, gaviota…) dibujados en SVG. Usan `currentColor` salvo donde se indica.
 */
type P = SVGProps<SVGSVGElement>
const base = { "aria-hidden": true, focusable: false } as const

/** Rayos del hero: abanico de franjas planas (toma `currentColor`). */
export function Sunburst(props: P) {
  const rays = Array.from({ length: 9 }, (_, i) => -100 + i * 25)
  return (
    <svg viewBox="-200 -200 400 400" {...base} {...props}>
      {rays.map((a) => (
        <polygon key={a} points="0,0 -16,-200 16,-200" transform={`rotate(${a})`} fill="currentColor" />
      ))}
    </svg>
  )
}

/** Rosa de los vientos de 16 puntas, a una tinta. */
export function CompassRose(props: P) {
  const long = [0, 90, 180, 270]
  const mid = [45, 135, 225, 315]
  const short = Array.from({ length: 8 }, (_, i) => 22.5 + i * 45)
  return (
    <svg viewBox="-100 -100 200 200" {...base} {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle r="92" />
        <circle r="86" strokeDasharray="1.5 3.5" />
        <circle r="60" />
        <circle r="22" />
        {Array.from({ length: 72 }, (_, i) => (
          <line key={i} y1="-86" y2={i % 2 ? "-82" : "-78"} transform={`rotate(${i * 5})`} />
        ))}
      </g>
      {short.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <polygon points="0,-58 7,-14 0,0" fill="currentColor" />
          <polygon points="0,-58 -7,-14 0,0" fill="none" stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
      {mid.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <polygon points="0,-72 10,-16 0,0" fill="currentColor" />
          <polygon points="0,-72 -10,-16 0,0" fill="var(--pal-paper, #fff)" stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
      {long.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <polygon points="0,-96 13,-18 0,0" fill="currentColor" />
          <polygon points="0,-96 -13,-18 0,0" fill="var(--pal-paper, #fff)" stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
      <circle r="6" fill="var(--pal-paper, #fff)" stroke="currentColor" strokeWidth="1.2" />
      <circle r="2" fill="currentColor" />
    </svg>
  )
}

export function Anchor(props: P) {
  return (
    <svg viewBox="0 0 100 120" {...base} {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="14" r="9" />
        <line x1="50" y1="23" x2="50" y2="108" />
        <line x1="30" y1="38" x2="70" y2="38" />
        <path d="M12 72 C 14 98, 36 108, 50 108 C 64 108, 86 98, 88 72" />
        <path d="M4 80 L12 70 L22 78" />
        <path d="M96 80 L88 70 L78 78" />
      </g>
    </svg>
  )
}

/** Timón de ocho cabillas. */
export function ShipWheel(props: P) {
  return (
    <svg viewBox="-60 -60 120 120" {...base} {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <circle r="34" strokeWidth="7" />
        <circle r="10" strokeWidth="5" />
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 45})`}>
            <line y1="-10" y2="-56" strokeWidth="5" />
            <line y1="-46" y2="-56" strokeWidth="9" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/** Faro con rayado y haz de luz: el "personaje" junto a los carteles. */
export function Lighthouse(props: P) {
  return (
    <svg viewBox="0 0 120 200" {...base} {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M60 8 L72 22 H48 Z" />
        <rect x="46" y="22" width="28" height="22" />
        <line x1="60" y1="22" x2="60" y2="44" />
        <path d="M40 44 H80 L76 50 H44 Z" />
        <path d="M46 50 L36 176 H84 L74 50 Z" />
        <path d="M44 76 L76 76 M41 112 L79 112 M38 148 L82 148" />
        <path d="M54 160 v16 h12 v-16 a6 6 0 0 0 -12 0 Z" />
        <path d="M14 186 Q 37 176 60 186 T 106 186" />
        <path d="M24 196 Q 42 188 60 196 T 96 196" />
      </g>
      <path d="M44 62 L76 62 L77 76 L43 76 Z M40 94 L80 94 L81 112 L39 112 Z M37 130 L83 130 L84 148 L36 148 Z" fill="currentColor" />
      <path d="M74 30 L118 16 L118 44 Z M46 30 L2 16 L2 44 Z" fill="var(--pal-accent, #fe7141)" opacity=".85" />
    </svg>
  )
}

export function Gull(props: P) {
  return (
    <svg viewBox="0 0 120 60" {...base} {...props}>
      <path
        d="M4 30 C 22 8, 44 10, 58 34 C 72 10, 98 6, 116 26 C 96 20, 78 26, 62 44 L58 50 L54 44 C 40 28, 22 24, 4 30 Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Pez grabado con escamas: decora la galería y el taller. */
export function Fish(props: P) {
  return (
    <svg viewBox="0 0 160 80" {...base} {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 40 C 40 6, 96 4, 124 40 C 96 76, 40 74, 12 40 Z" />
        <path d="M124 40 L154 14 L146 40 L154 66 Z" />
        <circle cx="34" cy="36" r="4" />
        <path d="M50 22 C 58 40, 58 40, 50 58" />
        {[64, 78, 92, 106].map((x) => (
          <path key={x} d={`M${x} 26 q 6 6 0 12 M${x} 42 q 6 6 0 12`} />
        ))}
        <path d="M70 12 C 80 2, 96 4, 100 14" />
        <path d="M74 68 C 82 78, 94 76, 98 66" />
      </g>
    </svg>
  )
}

export function Waves(props: P) {
  return (
    <svg viewBox="0 0 200 60" {...base} {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M0 14 Q 25 0 50 14 T 100 14 T 150 14 T 200 14" />
        <path d="M0 32 Q 25 18 50 32 T 100 32 T 150 32 T 200 32" />
        <path d="M0 50 Q 25 36 50 50 T 100 50 T 150 50 T 200 50" />
      </g>
    </svg>
  )
}

/** Salvavidas a franjas: acompaña los llamados a escribir por WhatsApp. */
export function LifeRing(props: P) {
  return (
    <svg viewBox="-60 -60 120 120" {...base} {...props}>
      <circle r="44" fill="none" stroke="var(--pal-paper, #fff)" strokeWidth="26" />
      {[0, 90, 180, 270].map((a) => (
        <circle
          key={a}
          r="44"
          fill="none"
          stroke="var(--pal-accent, #fe7141)"
          strokeWidth="26"
          strokeDasharray="34.6 241.9"
          transform={`rotate(${a - 22})`}
        />
      ))}
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle r="57" />
        <circle r="31" />
        <path d="M-50 -30 C -64 -10 -64 10 -50 30 M50 -30 C 64 -10 64 10 50 30" strokeDasharray="4 4" />
      </g>
    </svg>
  )
}

export function Starfish(props: P) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 16 : 46
    const a = (i * 36 - 90) * (Math.PI / 180)
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`
  }).join(" ")
  return (
    <svg viewBox="-50 -50 100 100" {...base} {...props}>
      <polygon points={pts} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points={pts} fill="currentColor" transform="scale(.42)" />
    </svg>
  )
}

/** Comillas: la de apertura y la de cierre se pintan de distinto color desde CSS. */
export function QuoteMark(props: P) {
  return (
    <svg viewBox="0 0 60 44" {...base} {...props}>
      <path
        d="M4 40 C 4 22, 10 8, 26 2 L28 8 C 18 12, 16 20, 16 24 C 22 24, 26 28, 26 33 C 26 38, 22 42, 15 42 C 8 42, 4 40, 4 40 Z M34 40 C 34 22, 40 8, 56 2 L58 8 C 48 12, 46 20, 46 24 C 52 24, 56 28, 56 33 C 56 38, 52 42, 45 42 C 38 42, 34 40, 34 40 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Triangle(props: P) {
  return (
    <svg viewBox="0 0 24 28" {...base} {...props}>
      <path d="M2 2 L22 14 L2 26 Z" fill="currentColor" />
    </svg>
  )
}

/** Poste del cartel indicador (los carteles van en HTML encima). */
export function SignPost(props: P) {
  return (
    <svg viewBox="0 0 60 220" {...base} {...props}>
      <g fill="currentColor">
        <circle cx="30" cy="10" r="7" />
        <path d="M24 16 h12 l-2 10 h-8 Z" />
        <path d="M14 30 C 14 20 46 20 46 30 C 40 26 20 26 14 30 Z" />
        <rect x="26" y="26" width="8" height="170" />
        <path d="M18 196 h24 l6 14 h-36 Z" />
        <rect x="6" y="208" width="48" height="8" rx="2" />
      </g>
    </svg>
  )
}

/* Íconos de contacto, trazo fino. */
const icon = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const

export const MailIcon = (p: P) => (
  <svg {...base} {...icon} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
)
export const PhoneIcon = (p: P) => (
  <svg {...base} {...icon} {...p}><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>
)
export const ChatIcon = (p: P) => (
  <svg {...base} {...icon} {...p}><path d="M4 20l1.4-4A8 8 0 1 1 8 19.4Z" /><path d="M9 10.5c.5 2 2 3.5 4 4l1.2-1.2 1.8.8-.4 1.6c-3.6.2-7-3.2-6.8-6.8l1.6-.4.8 1.8Z" /></svg>
)
export const InstagramIcon = (p: P) => (
  <svg {...base} {...icon} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
)
export const FacebookIcon = (p: P) => (
  <svg {...base} {...icon} {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" /></svg>
)
export const PinIcon = (p: P) => (
  <svg {...base} {...icon} {...p}><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
)
