// Archivo: src/types/index.ts

export interface Programa {
  /** ID nativo de Airtable (recXXXXXXXXXXXX) — garantiza unicidad global */
  airtableId: string;
  /** ID de programa definido manualmente en la base (puede tener duplicados) */
  id: string;
  nombre: string;
  universidad: string;
  area: string;
  pais: string;
  /** Costo en USD */
  matricula: number;
  /** Duración en meses */
  duracion: string;
  modalidad: string;
  nivel: string;
  beca: string;
  demanda: string;
  /** URL de la imagen del programa (opcional, usa fallback si no existe) */
  imagen: string;
  url: string;
  /** Slug único generado: nombre-universidad-ultimos4charsAirtableId (kebab-case) */
  slug: string;
}
