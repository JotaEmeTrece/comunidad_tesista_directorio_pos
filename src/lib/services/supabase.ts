// Archivo: src/lib/services/supabase.ts

import { createClient } from '@supabase/supabase-js'
import type { Programa } from '@/types'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

function getSupabaseClient() {
    return createClient(supabaseUrl, supabaseKey)
}

function mapRow(row: Record<string, unknown>): Programa {
    return {
        airtableId: undefined,
        id: String(row.id ?? ''),
        id_programa: String(row.id_programa ?? ''),
        nombre: String(row.nombre ?? ''),
        universidad: String(row.universidad ?? ''),
        pais: String(row.pais ?? ''),
        matricula: Number(row.costo_usd) || 0,
        duracion: row.duracion != null ? Number(row.duracion) : null,
        modalidad: String(row.modalidad ?? ''),
        nivel: String(row.nivel ?? ''),
        url: String(row.url_programa ?? ''),
        slug: String(row.slug ?? ''),
        tipo_institucion: row.tipo_institucion ? String(row.tipo_institucion) : undefined,
        enfoque_programa: row.enfoque_programa ? String(row.enfoque_programa) : undefined,
        requisito_grado: row.requisito_grado ? String(row.requisito_grado) : undefined,
        convalidable: row.convalidable ? String(row.convalidable) : undefined,
    }
}

export async function fetchProgramas(): Promise<Programa[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
        .from('directorio_posgrados')
        .select('*')
        .order('nombre', { ascending: true })

    if (error) {
        console.error('[Supabase] Error:', error.message)
        throw new Error(error.code === 'PGRST301'
            ? 'SUPABASE_NOT_CONFIGURED'
            : error.message
        )
    }

    return (data ?? []).map(mapRow)
}