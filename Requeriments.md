# Requerimientos del Proyecto: Directorio de Posgrados Inteligente
- **Cliente:** Comunidad Tesista de Latinoamérica (Confidencial - NDA Activo).
- **Stack Tecnológico:** Next.js 16.2 (App Router), React 19, Tailwind CSS, pnpm.
- **Fuentes de Datos:** Airtable API (Lectura vía ISR/SSG).
- **Core Funcional:**
  1. Identidad Visual: Migrar el diseño del `index.html` provisto. Reemplazar las secciones con fondos blancos amplios por un gris mate suave para reducir la fatiga visual, manteniendo el tono académico y elegante. Los colores corporativos, acentos y logos deben extraerse directamente de los tokens declarados en el `:root` y clases del `index.html`.
  2. Carga asíncrona por lotes con filtrado ultra-rápido en cliente (~360 registros).
  3. Páginas de detalle dinámicas por programa generadas en compilación (`generateStaticParams`).
  4. Buscador predictivo/inteligente local.
  5. Widget / Asesor de IA (RAG) con anclaje estricto a Airtable y sesgo de conversión positivo.
  6. Red de enlaces cruzados optimizada para SEO/GEO.