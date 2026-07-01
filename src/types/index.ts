// Archivo: src/types/index.ts

export interface Programa {
  /** ID nativo de Airtable (recXXXXXXXXXXXX) — solo presente en datos legacy */
  airtableId?: string;
  /** ID interno de Supabase */
  id: string;
  /** ID de programa original (puede tener duplicados — solo referencia) */
  id_programa: string;
  nombre: string;
  universidad: string;
  pais: string;
  /** Costo en USD */
  matricula: number;
  /** Duración en meses */
  duracion: number | null;
  modalidad: string;
  nivel: string;
  url: string;
  /** Slug único generado durante migración (kebab-case) */
  slug: string;
  /** Tipo de institución: Pública o Privada */
  tipo_institucion?: string;
  /** Enfoque del programa: Investigación o Profundización */
  enfoque_programa?: string;
  /** Requisito de grado: Tesis, Proyecto, Artículo o combinaciones */
  requisito_grado?: string;
  /** Convalidable internacionalmente */
  convalidable?: string;
  /** URL de imagen opcional — en deliberación por el cliente */
  imagen?: string;
}