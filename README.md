# Edunor Náutica — landing

Sitio de [Edunor Náutica](https://edunornautica.com) hecho con **Next.js 16**, React 19, Tailwind 4 y GSAP. La portada cuenta la historia de comprar una lancha con Edunor y muestra el catálogo real de modelos (lanchas, UTV y cuatriciclos) que **se sincroniza desde una carpeta de Google Drive**. Cada modelo tiene además su ficha en `/modelos/<slug>`.

- Portada: `app/(palatine)/page.tsx`
- Ficha de modelo: `app/(palatine)/modelos/[slug]/page.tsx`
- Catálogo que lee el sitio: `lib/catalog.ts` (a partir de `data/catalog.json`)
- Sync con Drive: `scripts/sync-drive.mjs`

## Requisitos

- Node 22 o superior (el script de sync usa `--env-file-if-exists`, que necesita Node 22+).
- npm.

## Correr el proyecto

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. El catálogo que ves es el que está guardado en `data/catalog.json` y en `public/catalog/`, que viajan en el repo: **no hace falta hacer el sync para levantar el sitio**.

Otros comandos:

```bash
npm run build          # build de producción (antes corre el sync en modo opcional, ver abajo)
npm run start          # sirve el build
npm run lint
```

## Sincronizar el catálogo desde Drive

El catálogo vive en una carpeta de Google Drive compartida como **"Cualquier persona con el enlace: Lector"**. El sync la recorre, baja las fotos y los videos a `public/` y escribe `data/catalog.json`. No necesita credenciales.

```bash
npm run sync:drive:check   # muestra qué modelos y piezas encontraría, sin descargar ni escribir nada
npm run sync:drive         # baja las fotos y videos y reescribe data/catalog.json
```

Después del sync, revisá el resultado con `npm run dev`, y commiteá `data/catalog.json` junto con `public/catalog/` y `public/publicidad/`. **Lo que se publica es lo que está en el repo** (ver "Cómo se actualiza la landing").

### Cómo tiene que estar armada la carpeta de Drive

```
CANESTRARI/                      ← carpeta raíz (DRIVE_FOLDER_ID)
├── LANCHAS/
│   ├── CATALOGO/
│   │   ├── 245 DF/              ← un modelo = una carpeta con fotos y/o videos
│   │   │   ├── portada.jpg      ← la foto llamada "portada" va primero (tapa del modelo)
│   │   │   ├── 02.jpg
│   │   │   ├── video-1.mp4
│   │   │   └── descripcion.txt  ← opcional: texto de la ficha
│   │   └── 285 FB/
│   └── PUBLICIDAD/              ← piezas para la portada, NO son modelos
│       ├── Polaris RZR 200/     ← una pieza = una subcarpeta (o un archivo suelto)
│       └── reel-verano.mp4
└── CUATRI/
    ├── Polaris RZR XP 1000 Premium/
    └── Polaris Pro R 2026/
```

Reglas que aplica el script:

- **Un modelo es una carpeta con fotos o videos.** Su nombre es el nombre de la carpeta ("225 CUDDY DF" → slug `225-cuddy-df`). Si una carpeta tiene imágenes sueltas y ninguna subcarpeta con imágenes, cada imagen es un modelo.
- **La categoría sale del camino de carpetas**: algo colgado de `LANCHAS` es lancha; algo colgado de `CUATRI` (o con "cuatri", "atv", "utv", "quad" en el nombre) es cuatriciclo/UTV. Si no hay pista, se asume lancha.
- **`PUBLICIDAD`** (también vale Promo, Promos, Promociones, Marketing, Landing o Redes) no genera modelos. Cada subcarpeta o archivo suelto es una pieza que va a la cinta de videos y al cierre de la galería de la portada. Si una pieza se llama igual que un modelo, enlaza a su ficha; si no, al WhatsApp.
- **Descripción del modelo**: un `descripcion.txt` (o `info.txt` / `ficha.txt`) dentro de la carpeta del modelo. Si no hay en Drive, se usa `data/descripciones/<MODELO>/descripcion.txt` del repo, emparejado por slug.
- **Fotos**: se bajan hasta 6 por modelo (`DRIVE_MAX_IMAGES`), redimensionadas a 1800 px de ancho y recomprimidas. Se guardan como `public/catalog/<slug>/<idDeDrive>.jpg`. Una foto que no cambió no se vuelve a bajar.
- **Videos**: hasta 3 por modelo (`DRIVE_MAX_VIDEOS`), se bajan enteros, con la miniatura de Drive como póster (`<id>.poster.jpg`). Si un modelo solo tiene video, el póster es su portada. Drive tarda un rato en generar la miniatura de un video recién subido: si sale sin póster, volvé a correr el sync más tarde.
- **Limpieza**: las fotos y videos que ya no están en Drive se borran de `public/`, y las carpetas de modelos eliminados también.

### Variables de entorno (opcionales)

Van en `.env.local` (hay un `.env.local.example` de guía; `.env.local` está en `.gitignore`).

| Variable | Para qué |
| --- | --- |
| `DRIVE_FOLDER_ID` | ID de la carpeta raíz. Por defecto, la carpeta CANESTRARI de Edunor. |
| `DRIVE_MAX_IMAGES` | Fotos por modelo (default 6). |
| `DRIVE_MAX_VIDEOS` | Videos por modelo (default 3). |
| `GOOGLE_DRIVE_API_KEY` | Usa la API oficial de Drive en vez de la vista pública. La carpeta sigue teniendo que ser pública. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` o `GOOGLE_APPLICATION_CREDENTIALS` | Cuenta de servicio (JSON inline o ruta al archivo). Permite leer una carpeta **privada** compartida con el email de esa cuenta. |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio para canonical, Open Graph y sitemap. Si no está, se usa el dominio de producción que informa Vercel. |

Sin ninguna de las credenciales el script trabaja en **modo público** (sin clave), que es el modo normal.

### Si el sync falla

- `La carpeta … no es pública (403/404)`: en Drive, Compartir → Acceso general → "Cualquier persona con el enlace" → Lector. O configurá una cuenta de servicio.
- `Drive respondió 400`: la API key no es válida o no tiene habilitada la Google Drive API.
- Un modelo no aparece: corré `npm run sync:drive:check` y fijate si lo lista y con qué categoría. Lo más común es que la carpeta se llame como una categoría ("Lanchas", "Fotos") y el script la trate como contenedor, no como modelo.

## Cómo se actualiza la landing con el sync

Este es el tema: **el sitio no lee Drive en runtime.** Lee `data/catalog.json` y sirve las fotos desde `public/`. Todo se resuelve en el build. Entonces la cadena es:

```
Drive  ──(npm run sync:drive)──▶  data/catalog.json + public/catalog + public/publicidad
                                            │
                                   (git commit + push)
                                            │
                                            ▼
                                 Vercel hace el build ──▶ landing y fichas nuevas
```

1. Alguien sube, cambia o borra fotos, videos o un `descripcion.txt` en Drive.
2. Corrés `npm run sync:drive` en tu máquina. El script reescribe `data/catalog.json` y deja en `public/catalog/<slug>/` y `public/publicidad/<slug>/` solo lo que está hoy en Drive.
3. Levantás `npm run dev` y revisás portada y fichas.
4. Commiteás y pusheás `data/catalog.json` y `public/`. Con el push, Vercel hace el build y publica.

En el build también corre `prebuild`, que ejecuta el sync con `--optional`: si la carpeta es accesible, refresca el catálogo en el servidor de build; si no hay red o la carpeta no está compartida, avisa y sigue con el `data/catalog.json` commiteado. Por eso **el deploy nunca se rompe por Drive**, pero tampoco conviene confiar en que el build "traiga" lo nuevo: la fuente de verdad es lo que commiteaste.

### Qué parte de la portada cambia con cada cosa de Drive

`lib/catalog.ts` convierte `data/catalog.json` en tres listas, `lanchas`, `cuatriciclos` y `publicidad`, y la portada las usa así:

| Sección de la portada | De dónde sale |
| --- | --- |
| **01 · Elegís** (`#modelos`, slider de lanchas) | Las primeras 6 `lanchas`. El orden es por tamaño de casco (348 > 285 > …), con excepciones a mano en `RANK_OVERRIDE` dentro de `lib/catalog.ts` (hoy abre la 245 DF, después la 285 FB). |
| **UTV y cuatriciclos** (`#utv`) | Lista de todos los `cuatriciclos` con link a su ficha, y una pila con la portada de cada uno. Los que solo tienen video no entran en la pila, pero sí en la lista. |
| **02 · Salís a navegar** (`#galeria`) | Fotos 2 a 5 de cada modelo (la portada ya se ve en Modelos y UTV), intercaladas entre modelos, con filtros Todas / Lanchas / UTV y cuatris. Al final, las fotos de `publicidad`. |
| **Videos** (`#videos`) | Primero los videos de `publicidad`, después los de las fichas de los modelos. Cada uno usa su póster para el tamaño de la tarjeta. |
| **Ficha** `/modelos/<slug>` | Nombre, categoría, descripción y galería completa (portada, videos, resto de fotos) del modelo. Se genera una página estática por cada slug del catálogo. |

Entonces, para que algo cambie en la landing:

- **Nuevo modelo**: creás la carpeta en `LANCHAS/CATALOGO` o `CUATRI`, le subís fotos (una llamada `portada`), sync, commit. Aparece en el slider o en UTV, en la galería y con su ficha.
- **Cambiar la foto de tapa**: renombrá la foto buena como `portada.jpg` (o subí una nueva con ese nombre), sync, commit.
- **Cambiar el texto de la ficha**: editá `descripcion.txt` en la carpeta del modelo, sync, commit. Si preferís versionarlo en el repo, usá `data/descripciones/<MODELO>/descripcion.txt`.
- **Sumar un video a la cinta**: subilo a `LANCHAS/PUBLICIDAD/<nombre>/` (va primero en la cinta) o a la carpeta del modelo (va después, y además en su ficha).
- **Sacar un modelo**: borrá o mové la carpeta en Drive, sync, commit. El script elimina sus archivos de `public/`.
- **Cambiar el orden de las lanchas**: eso no es Drive, es `RANK_OVERRIDE` en `lib/catalog.ts`.

Si `data/catalog.json` queda sin productos, `lib/catalog.ts` cae al catálogo de demostración de `lib/products.ts` (fotos de muestra en `public/images/products/`) para que la portada nunca quede vacía. Lo mismo por categoría: si Drive no trae cuatriciclos, esa sección se llena con la demo hasta que aparezcan.

## Estructura del repo

```
app/
  (palatine)/            portada y fichas de modelos (layout, page, palatine.css)
  bitacora/              maqueta de revista, independiente de la landing
  layout.tsx, sitemap.ts, robots.ts, manifest.ts
components/
  palatine/              componentes de la portada (hero, galería, cinta de videos, pila de fotos…)
  landing/, bitacora/    componentes de otras versiones y de la maqueta
data/
  catalog.json           catálogo sincronizado desde Drive (lo escribe el sync)
  descripciones/         descripciones de respaldo por modelo, en el repo
lib/
  catalog.ts             lee catalog.json y arma lanchas / cuatriciclos / publicidad, orden y fichas
  edunor.ts              datos de la empresa (historia, marcas, contacto, generadores)
  site.ts                URL del sitio, WhatsApp, metadatos para compartir, locales
  image-dims.ts          mide las fotos de public/ en el build (galería y videos)
  products.ts            catálogo de demostración, solo si Drive no trajo nada
public/
  catalog/<slug>/        fotos y videos de cada modelo (los escribe el sync)
  publicidad/<slug>/     piezas de la carpeta PUBLICIDAD (los escribe el sync)
  palatine/, images/, og/, brand/   fotos fijas de la portada, imagen para compartir, favicons
scripts/
  sync-drive.mjs         sync con Drive (ver arriba)
  optimize-images.mjs    achica y recomprime fotos; el sync lo usa, y se puede correr a mano
```

### Optimizar fotos a mano

El sync ya optimiza cada foto al bajarla. Para las fotos fijas de la portada o si querés repasar lo que hay en `public/`:

```bash
node scripts/optimize-images.mjs                 # public/catalog y public/palatine
node scripts/optimize-images.mjs public/otra     # otra carpeta
```

Mantiene nombre y extensión, así las rutas de `data/catalog.json` no cambian, y solo pisa el archivo si queda más liviano.

## Deploy

El sitio se publica en Vercel desde este repo. Un push a la rama de producción dispara el build (`prebuild` → sync opcional → `next build`). La URL pública para canonical, Open Graph y sitemap sale de `NEXT_PUBLIC_SITE_URL` o, si no está, del dominio de producción que Vercel informa en el build.

### Sync programado

El catálogo se vuelve a publicar solo, **una vez por día a las 06:00 (hora Argentina)**, sin que nadie corra nada. Lo hace el workflow `.github/workflows/sync-drive.yml`: no sincroniza en GitHub, solo dispara un **Deploy Hook de Vercel**. El build que arranca corre `prebuild` → sync → `next build`, así que publica lo que haya en Drive en ese momento.

Para que funcione hace falta una sola vez:

1. En Vercel: proyecto → **Settings → Git → Deploy Hooks** → Create Hook. Nombre `sync-drive`, rama `main`. Copiá la URL.
2. En GitHub: repo → **Settings → Secrets and variables → Actions** → New repository secret `VERCEL_DEPLOY_HOOK_URL` con esa URL. O desde la terminal: `gh secret set VERCEL_DEPLOY_HOOK_URL`.

Para forzar una corrida ahora mismo: pestaña **Actions** → "Sync Drive (deploy programado)" → Run workflow, o `gh workflow run sync-drive.yml`.

Tené en cuenta:

- Lo que publica este deploy **no queda en el repo**. `data/catalog.json` y `public/` del repo siguen siendo lo último que sincronizaste a mano; si levantás `npm run dev` vas a ver eso, no lo de producción. Para ponerlos al día, `npm run sync:drive` y commit, como siempre.
- Si en el build la carpeta de Drive no está accesible, `--optional` sigue con el catálogo commiteado y el sitio no se rompe.
- Drive tarda en generar la miniatura de un video recién subido: puede salir sin póster hasta la corrida del día siguiente.
- Para cambiar la hora, editá el `cron` del workflow (está en UTC: Argentina es UTC−3).
