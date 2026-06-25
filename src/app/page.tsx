import { fetchProgramas } from "@/lib/services/airtable";
import CatalogoClient from "@/components/CatalogoClient";
import type { Programa } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    let programas: Programa[] = [];
    let error: string | null = null;

    try {
        programas = await fetchProgramas();
    } catch (err) {
        error =
            err instanceof Error
                ? err.message === "AIRTABLE_NOT_CONFIGURED"
                    ? "Airtable no está configurado. Verifica AIRTABLE_API_KEY y AIRTABLE_BASE_ID."
                    : "No pudimos cargar los programas en este momento."
                : "Error inesperado al cargar los datos.";
    }

    return <CatalogoClient inicialProgramas={programas} serverError={error} />;
}