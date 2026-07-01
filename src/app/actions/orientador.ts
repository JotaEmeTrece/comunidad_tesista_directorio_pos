// Archivo: src/app/actions/orientador.ts
// Server Action: Orientador Vocacional con IA.
// Sistema de redundancia con failover: Gemini → DeepSeek → Fallback manual.
// Candado de caducidad: 11 de julio de 2026.

"use server";

import { fetchProgramas } from "@/lib/services/supabase";
import type { Programa } from "@/types";

/** Perfil del usuario para el orientador vocacional */
export interface PerfilOrientador {
    area: string;
    objetivo: string;
    modalidad: string;
    pais: string;
    presupuesto: number | null;
}

/** Respuesta del orientador vocacional */
export interface RespuestaOrientador {
    mensaje: string;
    recomendaciones: Programa[];
}

/** System prompt comercial unificado (usado por todos los proveedores y el fallback) */
const SYSTEM_PROMPT = `Eres un orientador vocacional premium de Comunidad Tesista en Latinoamérica. Tu misión es analizar el perfil del usuario y los 5 programas adjuntos para persuadirlo de dar el siguiente paso en su crecimiento profesional.

Redacta un análisis profesional, cálido y motivador en español que siga de forma estricta estas pautas:

1. Estructura de la Respuesta:
- Comienza con un saludo personalizado resumiendo de forma amigable su perfil (Área, Objetivo y Modalidad).
- Redacta de 2 a 3 párrafos fluidos y conectados analizando globalmente por qué los programas seleccionados representan su mejor camino para ascender en el escalafón o lograr sus metas.
- Menciona las universidades o países de forma natural dentro del texto para dar contexto, pero EVITA por completo el uso de listas con viñetas (bullet points) o repetir en fila los nombres de los programas, ya que estos ya se muestran gráficamente abajo en la interfaz.

2. Manejo de Precios y Beneficios:
- Jamás escribas textualmente montos de "$0 USD" o precios vacíos. Si un programa viene con valor 0 en la base de datos, tradúcelo comercialmente como un "Programa con opción de Beca Completa", "Convenio Pro Bono" o "Financiamiento Especial con la institución".
- Cierre comercial sutil: Concluye tu texto recordando que el verdadero reto de estos posgrados es la investigación de grado, y que Comunidad Tesista cuenta con planes especiales para asegurar la redacción de su tesis por un costo preferencial ($3.450.000 COP para Maestrías y $6.000.000 COP para Doctorados) para que puedan estudiar sin preocupaciones.

3. Formato y Extensión:
- Usa negritas de Markdown (**texto**) de forma selectiva para resaltar conceptos clave en cada párrafo (como las universidades, palabras como 'beca completa' o 'convenio pro bono', y los precios de las tesis). Esto romperá la densidad visual y facilitará el escaneo rápido sin perder profundidad.
- Usa saltos de línea dobles entre párrafos para que la lectura sea sumamente limpia.
- Mantén el texto directo, ejecutivo y con un límite máximo de 350 palabras.`;

/**
 * Orienta al usuario con IA analizando su perfil y recomendando los 5 mejores programas.
 * Estrategia de failover: Gemini → DeepSeek → Fallback manual.
 */
export async function orientarUsuarioConIA(perfil: PerfilOrientador): Promise<RespuestaOrientador> {
    // ── 1. Candado de caducidad ──
    const fechaLimite = new Date("2026-07-11T23:59:59-05:00");
    if (new Date() > fechaLimite) {
        throw new Error(
            "Período de prueba de IA finalizado. Contacte a Jercol Technologies para reactivar el servicio Premium."
        );
    }

    // ── Obtener y filtrar programas desde Airtable ──
    const programas = await fetchProgramas();
    const recomendaciones = filtrarRecomendaciones(programas, perfil);

    // ── Construir user prompt ──
    const userPrompt = buildUserPrompt(perfil, recomendaciones);

    // ── 2. Intentar Gemini como proveedor principal ──
    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (geminiKey) {
        try {
            console.log("[Orientador IA] Intentando Gemini...");
            const mensaje = await callGemini(geminiKey, SYSTEM_PROMPT, userPrompt);
            if (mensaje) return { mensaje, recomendaciones };
        } catch (err) {
            console.warn("[Orientador IA] Gemini falló:", err instanceof Error ? err.message : err);
        }
    }

    // ── 3. Failover: DeepSeek como proveedor de respaldo ──
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (deepseekKey) {
        try {
            console.log("[Orientador IA] Failover → DeepSeek...");
            const mensaje = await callDeepSeek(deepseekKey, SYSTEM_PROMPT, userPrompt);
            if (mensaje) return { mensaje, recomendaciones };
        } catch (err) {
            console.warn("[Orientador IA] DeepSeek falló:", err instanceof Error ? err.message : err);
        }
    }

    // ── 4. Caída segura al fallback ──
    console.log("[Orientador IA] Sin proveedores disponibles → fallback manual");
    return {
        mensaje: generarRespuestaFallback(perfil),
        recomendaciones,
    };
}

// ═══════════════════════════════════════════════
//  PROVEEDORES DE IA
// ═══════════════════════════════════════════════

/** Intenta generar respuesta con Google Gemini */
async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string | null> {
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
            }),
        }
    );

    if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Gemini ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return texto || null;
}

/** Intenta generar respuesta con DeepSeek (API compatible con OpenAI) */
async function callDeepSeek(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string | null> {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1024,
        }),
    });

    if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`DeepSeek ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
}

// ═══════════════════════════════════════════════
//  UTILIDADES
// ═══════════════════════════════════════════════

/** Filtra y ordena los programas según el perfil del usuario */
function filtrarRecomendaciones(programas: Programa[], perfil: PerfilOrientador): Programa[] {
    let candidatos = [...programas];

    // Filtrar por modalidad (si no es "Todas")
    if (perfil.modalidad && perfil.modalidad !== "Todas") {
        const m = perfil.modalidad.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        candidatos = candidatos.filter((p) => {
            const pMod = p.modalidad.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return pMod.includes(m) || m.includes(pMod);
        });
    }

    // Filtrar por país (si no es vacío)
    if (perfil.pais) {
        const paisNorm = perfil.pais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const filtradosPais = candidatos.filter((p) => {
            const pPais = p.pais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return pPais.includes(paisNorm) || paisNorm.includes(pPais);
        });
        if (filtradosPais.length >= 3) {
            candidatos = filtradosPais;
        }
    }

    // Filtrar por presupuesto máximo en USD
    if (perfil.presupuesto !== null && perfil.presupuesto > 0) {
        candidatos = candidatos.filter((p) => p.matricula > 0 && p.matricula <= perfil.presupuesto!);
    }

    // Relajar filtros si hay menos de 5 resultados
    if (candidatos.length < 5) {
        candidatos = [...programas];
        if (perfil.presupuesto !== null && perfil.presupuesto > 0) {
            candidatos = candidatos.filter((p) => p.matricula > 0 && p.matricula <= perfil.presupuesto!);
        }
        if (candidatos.length < 5) {
            candidatos = [...programas];
        }
    }

    return candidatos.sort((a, b) => a.matricula - b.matricula).slice(0, 5);
}

/** Construye el user prompt con el perfil y los programas recomendados */
function buildUserPrompt(perfil: PerfilOrientador, recomendaciones: Programa[]): string {
    const presupuestoStr = perfil.presupuesto !== null && perfil.presupuesto > 0
        ? `$${perfil.presupuesto.toLocaleString("es-MX")} USD`
        : "Sin límite definido";

    const paisStr = perfil.pais || "Sin preferencia específica";

    const programasTexto = recomendaciones
        .map(
            (p, i) =>
                `${i + 1}. "${p.nombre}" — ${p.universidad} (${p.pais}). Nivel: ${p.nivel}. Modalidad: ${p.modalidad}. Inversión: $${p.matricula.toLocaleString("es-MX")} USD. Duración: ${p.duracion} meses.`
        )
        .join("\n");

    return `Perfil del usuario:
- Área de interés: ${perfil.area}
- Objetivo principal: ${perfil.objetivo}
- Modalidad preferida: ${perfil.modalidad}
- País preferido: ${paisStr}
- Presupuesto máximo: ${presupuestoStr}

Programas recomendados:
${programasTexto}

Por favor, oriéntame sobre cuál de estos programas es el mejor para mi perfil y por qué.`;
}

/** Fallback manual cuando ningún proveedor de IA está disponible */
function generarRespuestaFallback(perfil: PerfilOrientador): string {
    const modalidadTexto = perfil.modalidad.toLowerCase() === 'todas'
        ? 'flexible (virtual o presencial)'
        : perfil.modalidad;

    return `¡Hola! Con base en tu perfil enfocado en el área de ${perfil.area}, veo que tu meta principal es lograr tu ${perfil.objetivo} mediante una modalidad de estudio ${modalidadTexto}. Para los profesionales de la educación en Latinoamérica, dar este paso estratégico es la llave definitiva para abrir nuevas puertas y ascender con solidez en el escalafón docente.

Las opciones seleccionadas a continuación destacan por su alta adaptabilidad y prestigio institucional. Es importante resaltar que algunas de estas alternativas cuentan con convenios Pro Bono o beneficios de Beca Completa, lo que representa una oportunidad financiera inmejorable para alcanzar tus metas académicas sin comprometer tu presupuesto actual.

Recuerda que el verdadero desafío de estos posgrados de alto nivel radica en la etapa de investigación de grado. Para que puedas enfocarte plenamente en tu aprendizaje, Comunidad Tesista cuenta con planes de acompañamiento preferenciales en pesos colombianos para la redacción de tu tesis ($3,450,000 COP para Maestrías y $6,000,000 COP para Doctorados), garantizando tu titulación con éxito y permitiéndote avanzar sin preocupaciones académicas.`;
}