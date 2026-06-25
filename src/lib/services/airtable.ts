// Archivo: src/lib/services/airtable.ts

import type { Programa } from "@/types";

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

/**
 * Mapeo de columnas de Airtable → interfaz Programa.
 * Ajusta los nombres de campo según la nomenclatura exacta de tu base de Airtable.
 */
const FIELD_MAP: Record<string, keyof Programa> = {
  "ID Programa": "id",
  "Nombre del Programa": "nombre",
  Universidad: "universidad",
  País: "pais",
  "Costo Total USD": "matricula",
  "Duración (Meses)": "duracion",
  Modalidad: "modalidad",
  Nivel: "nivel",
  "URL del Programa": "url",
};

function mapRecord(record: AirtableRecord): Programa {
  const raw = record.fields;
  const item: Record<string, unknown> = {};

  // Inyectar ID nativo de Airtable (recXXXXXXXXXXXX) como airtableId
  // Este campo garantiza unicidad global, a diferencia del "ID Programa" manual
  item.airtableId = record.id;

  for (const [airField, progField] of Object.entries(FIELD_MAP)) {
    item[progField] = raw[airField] ?? "";
  }

  item.matricula = Number(item.matricula) || 0;
  item.duracion = String(item.duracion ?? "");

  return item as unknown as Programa;
}

/**
 * Obtiene todos los programas desde Airtable.
 * Esta función se ejecuta del lado del servidor (API Route o Server Component).
 */
export async function fetchProgramas(): Promise<Programa[]> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE || "Programas";

  if (!apiKey || !baseId) {
    console.warn(
      "[Airtable] Variables de entorno no configuradas. API_KEY:",
      !!apiKey,
      "BASE_ID:",
      !!baseId
    );
    throw new Error("AIRTABLE_NOT_CONFIGURED");
  }

  const baseUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
  const allRecords: Programa[] = [];
  let offset: string | undefined;

  try {
    do {
      const params = new URLSearchParams();
      if (offset) params.set("offset", offset);

      const res = await fetch(`${baseUrl}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Airtable respondió con ${res.status}: ${res.statusText}`);
      }

      const data: AirtableResponse = await res.json();

      const mapped = data.records.map(mapRecord);
      allRecords.push(...mapped);
      offset = data.offset;
    } while (offset);

    return allRecords;
  } catch (err) {
    console.error("[Airtable] Error:", err);
    throw err;
  }
}