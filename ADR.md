## Registro de Decisiones de Arquitectura (Bitácora Cronológica)

## [2026-06-23] ADR-001: Inicialización del Proyecto y Definición de Stack
- **Contexto:** Migración de un prototipo HTML rígido a una plataforma dinámica para ~360 programas académicos.
- **Decisión:** Usar Next.js 16.2.6 con App Router y pnpm. Se define renderizado SSG + ISR para el detalle de programas para maximizar velocidad y SEO.
- **Consecuencias:** Carga inicial instantánea, reducción de costos de API de Airtable y arquitectura desacoplada para inyección de Asesor de IA.

## [2026-06-23] ADR-002: Estructura Modular de Directorios
- **Contexto:** Se requiere una organización escalable y mantenible para el código fuente.
- **Decisión:** Se implementa la siguiente estructura:
  - `/src/app` — páginas y layout principal (App Router)
  - `/src/components/ui` — componentes atómicos reutilizables (Card, botones)
  - `/src/components/layout` — componentes de estructura (Header, Hero, StatsBar, Footer)
  - `/src/lib` — lógica de negocio, tipos, constantes y utilidades
- **Consecuencias:** Separación clara de responsabilidades, facilita el testing y la reutilización de componentes.

## [2026-06-23] ADR-003: Migración de Estilos a Tailwind CSS v4 con Design Tokens
- **Contexto:** El prototipo original usa CSS vanilla con variables `:root` y selectores planos.
- **Decisión:** Se extraen todos los tokens de diseño del `:root` de `index.html` y se configuran en Tailwind CSS v4 mediante `@theme`.
- **Consecuencias:** Tema unificado y tipado, facilidad de mantenimiento, consistencia visual.

## [2026-06-23] ADR-004: Cliente de Datos desde Google Sheets CSV (Deprecado)
- **Contexto:** Los datos de programas residían en Google Sheets.
- **Decisión:** Se implementó consumo directo de CSV público con parser en utils.ts.
- **Consecuencias:** Reemplazado en ADR-006 por mock estático y en ADR-007 por Airtable API.

## [2026-06-23] ADR-005: Componentes del Lado del Cliente para Interactividad
- **Contexto:** La aplicación requiere estado interactivo (filtros, búsqueda, modal ROI, menú hamburguesa).
- **Decisión:** page.tsx principal y componentes Header, Card se marcan como `"use client"`.
- **Consecuencias:** Bundle JS del cliente incluye lógica de filtrado y carga de datos.

## [2026-06-23] ADR-006: Corrección de Hidratación y Desacoplamiento de Google Sheets
- **Contexto:** Error de hidratación por extensiones de navegador y dependencia directa de CSV.
- **Decisión:** suppressHydrationWarning, eliminación de parser CSV, creación de tipos estrictos y mock estático.
- **Consecuencias:** Sin errores de hidratación, cero dependencia de red para renderizado inicial.

## [2026-06-23] ADR-007: Fase 2 — Conexión Real a Airtable, Identidad Visual y Limpieza de UI
- **Contexto:** Se requiere conectar la app directamente a Airtable en producción, aplicar el manual de identidad visual de la marca y eliminar todo el código legacy (mockdata, calculadora ROI).
- **Decisión:**
  - **Airtable:** Se crea `src/lib/services/airtable.ts` con fetch a la REST API de Airtable, mapeo de campos configurable, paginación automática y manejo de errores. Las credenciales se consumen exclusivamente de `process.env.*` (AIRTABLE_API_KEY, AIRTABLE_BASE_ID). Si no están configuradas, la app muestra un estado controlado sin colapsar.
  - **Identidad Visual:** Colores actualizados a los oficiales de la marca: Amarillo #FFDE21, Negro #000000, Blanco #FFFFFF, Gris #898989, Gris Claro #D3D3D3. Tipografía cambiada de Inter a Roboto Condensed. Logos copiados a `/public/images/` con nombres kebab-case.
  - **Limpieza:** Eliminación total de la Calculadora de ROI (componente, funciones, modal) y del mock estático `MOCK_PROGRAMAS`. Footer actualizado a "Desarrollado por Jercol Technologies".
  - **UX:** Se implementan skeletons animados (6 placeholders) durante la carga de datos desde Airtable y manejo de errores con mensajes amigables.
  - **.gitignore:** Archivo robusto que bloquea .env*, node_modules/, .vercel/, .next/, dist/, build/.
- **Consecuencias:** Aplicación lista para producción en Vercel. Sin hardcoding de credenciales. UI alineada al manual de marca. Experiencia de carga fluida con skeletons.

## [2026-06-24] ADR-008: Filtros Dinámicos, Contador Real y Barra de Países Interactiva
- **Contexto:** La interfaz requería pasar de contadores y textos estáticos a un sistema de búsqueda y filtrado en tiempo real basado en la data viva de Airtable.
- **Decisión:** 
  - Se modificó `src/app/page.tsx` para implementar un estado combinado de filtros (*client-side*): buscador por texto (programa/universidad), botones tipo píldora para países únicos dinámicos, y desplegables (`<select>`) para Nivel y Modalidad.
  - Se eliminaron todos los números e indicadores hardcodeados antiguos.
  - Se añadió un contador dinámico superior (`Mostrando X programas académicos encontrados`) y un estado controlado para búsquedas vacías.
- **Consecuencias:** Experiencia de usuario interactiva y fluida, optimización del renderizado y grid completamente reactivo al usuario.

## [2026-06-24] ADR-009: Unificación de Estilos Oscuros en Filtros (Negro + Amarillo)
- **Contexto:** Los `<select>` y botones de países usaban fondo blanco y texto gris, rompiendo la coherencia visual con el botón "Todos" y la paleta oscura de la marca.
- **Decisión:** Se aplicaron las siguientes clases a todos los elementos de filtro:
  - **`<select>` (Nivel y Modalidad):** `bg-black text-yellow border-black focus:border-yellow`
  - **Botones de países (inactivos):** `bg-black border-black text-yellow hover:border-yellow`
  - **Botones de países (activo "Todos"):** `bg-black border-yellow text-yellow`
  - **Header.tsx:** Los 4 enlaces del menú (`Programas`, `Países`, `Becas`, `Blog`) se cambiaron de `text-black` a `text-yellow`, con hover invertido (`hover:bg-yellow hover:text-black`).
- **Consecuencias:** Coherencia visual total entre todos los filtros y la cabecera. No se alteró la lógica de filtrado.

## [2026-06-24] ADR-010: Re-Arquitectura SSG + ISR — Eliminación de API Route y Paso Directo de Datos
- **Contexto:** La app hacía un `fetch("/api/programas")` desde el cliente, lo que forzaba una ronda de red extra, limitaba a 100 registros por paginación nativa de Airtable y retardaba la carga inicial.
- **Decisión:** Se eliminó la totalidad de `src/app/api/programas/route.ts` y se transformó `src/app/page.tsx` en un **Server Component puro** con `export const dynamic = "force-dynamic"` que:
  1. Llama directamente a `fetchProgramas()` del lado del servidor
  2. Obtiene los 350+ registros completos gracias al paginado recursivo (`do...while(offset)`) ya implementado en `src/lib/services/airtable.ts`
  3. Pasa los datos como prop `inicialProgramas` al nuevo componente `CatalogoClient`
  4. El manejo de errores (Airtable no configurado, error de red) se resuelve en el servidor
- **Consecuencias:** Cero peticiones de red en el cliente para la data base. HTML prerenderizado en el servidor. Velocidad de carga instantánea. Arquitectura alineada al plan original SSG/ISR.

## [2026-06-24] ADR-011: Paginación en UI (Bloques de 20) y Contador con Transparencia
- **Contexto:** Mostrar los 350+ programas de golpe saturaba la página y perjudicaba la experiencia de usuario.
- **Decisión:** Se implementó en `CatalogoClient`:
  - `const PAGE_SIZE = 20` — límite inicial de tarjetas visibles
  - Estado `visibleCount` que se incrementa en +20 al hacer clic en "Cargar más programas"
  - Al cambiar cualquier filtro o búsqueda, `visibleCount` se resetea a 20 automáticamente
  - Botón "Cargar más programas" centrado con `max-w-xs mb-12`, oculto automáticamente cuando `visibleCount >= filtered.length`
  - Contador de transparencia: `Mostrando X de Y programas encontrados` donde X es el número visible e Y el total filtrado
- **Consecuencias:** Carga progresiva, rendimiento óptimo, UX limpia. Sin dependencias externas de paginación.

## [2026-06-24] ADR-012: Optimización de Fuente — De Google Fonts CDN a next/font/google
- **Contexto:** Se usaban etiquetas `<link>` en el `<head>` para cargar Roboto Condensed desde Google Fonts CDN, lo que añadía un round-trip de red y causaba un bug de prerenderizado en Turbopack (`workStore`).
- **Decisión:** Se migró a `next/font/google` con `Roboto_Condensed`:
  - Configuración en `src/app/layout.tsx` con subset `latin`, weights 400-700 y `display: "swap"`
  - Se eliminaron las etiquetas `<link>` del layout
  - Se usa la variable CSS `--font-roboto-condensed` en el `@theme` de Tailwind y como fallback
  - El layout se marca como `force-dynamic` para evitar el prerenderizado de rutas del sistema
- **Consecuencias:** Zero round-trips de red para la fuente, optimización de rendimiento, eliminación del bug de build con Turbopack.

## [2026-06-25] ADR-013: Corrección de Desborde Vertical en Cards con Flexbox Rígido
- **Contexto:** Al filtrar por países con pocos registros, las tarjetas inferiores se desbordaban y deformaban la cuadrícula debido a alturas inconsistentes en los elementos hijos.
- **Decisión:** Se reescribió `src/components/ui/Card.tsx` con la siguiente estructura Flexbox:
  - **Contenedor principal:** `bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full min-h-[450px] justify-between border border-gray-200`
  - **Imagen:** `h-40 bg-gray-800 flex items-center justify-center w-full relative` (altura fija)
  - **Cuerpo de texto:** `flex-1 p-5 flex flex-col justify-between` (absorbe espacio sobrante)
  - **Sección inferior:** `w-full bg-gray-100 p-4 mt-auto border-t border-gray-200 flex flex-col gap-2` (rígida, anclada al fondo)
  - Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Consecuencias:** Todas las tarjetas tienen altura idéntica sin importar el contenido. La cuadrícula no se deforma al filtrar.

## [2026-06-25] ADR-014: Blindaje de Keys Únicas con airtableId y Fallback de Imagen
- **Contexto:** Aparecieron IDs duplicados en consola de React porque `key={p.id}` usaba el campo manual "ID Programa" (ej. registros MEX duplicados). Las imágenes rotas mostraban el icono nativo del navegador. El código carecía de comentarios para auditoría.
- **Decisión:**
  - **`src/types/index.ts`:** Se añadió el campo `airtableId: string` (ID nativo de Airtable `recXXXXXXXXXXXX`) al tipo `Programa`, con JSDoc documentando cada campo.
  - **`src/lib/services/airtable.ts`:** En `mapRecord()` se inyecta `item.airtableId = record.id` (el ID del sistema, no el campo manual). Comentario de archivo `// Archivo:`.
  - **`src/components/CatalogoClient.tsx`:** La key del grid pasó de `p.id` a `p.airtableId || \`\${p.id}-\${i}\`` con comentario explicando el motivo (fallback defensivo si airtableId no existe).
  - **`src/components/layout/Hero.tsx`:** Documentación completa con JSDoc en el prop `onSearch`, comentarios en cada sección del JSX, y `type="button"` en el botón.
  - **`src/components/ui/Card.tsx`:** Imagen con fallback: si `programa.imagen` existe, se renderiza un `<img>` con `onError` que oculta la imagen rota y muestra gradiente oscuro con `🎓`. Si no hay URL, se muestra el gradiente directamente. Todo el componente documentado con comentarios de sección (Imagen, Cuerpo, Botones) explicando `flex-1`, `mt-auto`, `overflow-hidden`.
- **Consecuencias:** Cero advertencias de keys duplicadas en React. Imágenes rotas invisibles para el usuario. Código completamente documentado para auditorías externas. Typescript compila limpio.
