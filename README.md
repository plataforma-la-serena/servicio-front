# servicio-front

Catálogo público de **La Serena**, la plataforma de departamentos temporarios para la temporada de verano (15.12 — 15.03).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript.
- Renderizado en servidor para el catálogo y las fichas de departamento.
- Sin dependencias de UI externas: el sistema visual es CSS propio.

## Dirección de diseño

Ancla **Swiss**, elegida para presentar los departamentos como una exhibición arquitectónica y no como un catálogo turístico convencional.

- Superficie: `#FFFFFF` y neutro `#F7F7F8`.
- Tipografía: Helvetica Neue / Helvetica / Arial, una sola familia.
- Acento: `#FF4F00`, reservado exclusivamente para los botones de reserva.
- Estructura: cuadrícula visible de 12 columnas con líneas de 1 px, reglas horizontales, alineación a la izquierda y balance asimétrico.
- Números como elemento compositivo: temporada, folios, precios y capacidad en variantes tabulares.

## Scripts

```bash
npm install
npm run dev
npm run build
npm start
npm run typecheck
```

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública para metadata, sitemap y robots. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número internacional sin `+` ni espacios. Si está vacío, los botones de reserva apuntan al bloque de contacto. |
| `API_CENTRAL_URL` | URL interna de `api-central`. Si no está definida, el catálogo usa datos de ejemplo identificados en pantalla. |

## Datos

`src/lib/catalog.ts` es la única capa que consulta `api-central`. Los componentes de React no hacen llamadas HTTP directas.

Si `api-central` no está disponible, el catálogo usa `src/data/sample-apartments.ts` y muestra la leyenda **“Datos de ejemplo”** para no presentar el inventario de muestra como información real.

## Rutas

- `/` — catálogo público.
- `/departamentos/[id]` — ficha del departamento.
- `/sitemap.xml` — sitemap generado desde el catálogo.
- `/robots.txt` — reglas de indexación.
