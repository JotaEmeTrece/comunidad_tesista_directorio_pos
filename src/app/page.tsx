import { fetchProgramas } from "@/lib/services/supabase";
import CatalogoClient from "@/components/CatalogoClient";
import type { Programa } from "@/types";

export const revalidate = 3600;
export const maxDuration = 180;

export default async function HomePage() {
    let programas: Programa[] = [];
    let error: string | null = null;

    try {
        programas = await fetchProgramas();
    } catch (err) {
        error =
            err instanceof Error
                ? err.message === "SUPABASE_NOT_CONFIGURED"
                    ? "Supabase no está configurado. Verifica SUPABASE_URL y SUPABASE_ANON_KEY."
                    : "No pudimos cargar los programas en este momento."
                : "Error inesperado al cargar los datos.";
    }

    return <CatalogoClient inicialProgramas={programas} serverError={error} />;
}