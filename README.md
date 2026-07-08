# Natural Stone Fabricators (NSF)

## Stack
- **Framework:** Astro ^5.0.0
- **Styling:** Tailwind CSS v4
- **Node:** >= 22.12.0
- **Package Manager:** pnpm
- **Mailing:** Resend (Serverless API)

## Routes
| Route | Purpose |
|-------|---------|
| `/`   | Landing page inicial |
| `/gallery` | Galería de proyectos recientes (Masonry layout, Lightbox) |
| `/about` | Historia, experiencia y valores de NSF |
| `/contact` | Formulario de contacto integrado con Resend |

## Design System
Referirse al archivo [design-system.md](./design-system.md) para los tokens de diseño (tipografías, colores, animaciones).

## Project Structure
```text
/
├── public/         # Assets estáticos (favicon, etc.)
├── src/            # Código fuente
│   ├── assets/     # Imágenes optimizadas para Astro (<Image />)
│   ├── components/ # Componentes UI (Hero, Header, Footer, GalleryPreview, etc.)
│   ├── data/       # Data estática (gallery.ts)
│   ├── layouts/    # BaseLayout.astro
│   ├── pages/      # Rutas de Astro (incluye api/contact.ts)
│   └── styles/     # global.css (Variables de Tailwind V4 y utilidades)
└── package.json
```

## Environment Variables
Copiar `.env.example` a `.env` o `.env.local` para configurar.
Variables requeridas:
- `RESEND_API_KEY`: API Key de Resend.
- `RESEND_FROM`: Correo verificado de envío.
- `RESEND_TO`: Destinatario (ej. email del cliente).

## Scripts
- `pnpm dev`: Inicia el servidor de desarrollo en background (`localhost:4321`)
- `pnpm build`: Construye para producción (Node adapter para API routes)
- `pnpm preview`: Previsualiza el build de producción

## Deployment
*El sitio requiere Node.js hosting (Vercel, Netlify, o VPS tradicional) debido al uso de SSR (`output: "server"`) para procesar el formulario de contacto con Resend.*

## Pending Client Inputs
- Dominio personalizado para producción.
- Verificación del dominio en Resend para configurar el `RESEND_FROM` oficial.
