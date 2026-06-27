// Archivo: src/app/programas/[slug]/page.tsx
// Página de detalle individual de programa académico.
// SSG (generateStaticParams) + ISR (revalidate=3600).
// Incluye análisis de mercado del país desde el repositorio local del Word del cliente.

import { notFound } from "next/navigation";
import { fetchProgramas } from "@/lib/services/airtable";
import { obtenerAnalisisPorPais } from "@/lib/constants/paisesData";
import { Header } from "@/components/layout/Header";
import { TesistaActions } from "@/components/ui/TesistaActions";
import type { Programa } from "@/types";

// ── ISR: revalidación cada 1 hora ──
export const revalidate = 3600;

/**
 * Generación estática de rutas (SSG).
 * Obtiene todos los programas desde Airtable en tiempo de compilación
 * y retorna un array de slugs para que Next.js pre-renderice cada página.
 */
export async function generateStaticParams() {
    try {
        const programas = await fetchProgramas();
        return programas.map((p) => ({ slug: p.slug }));
    } catch {
        // Si Airtable falla en build, no se generan rutas estáticas.
        // Las páginas se renderizarán on-demand (ISR fallback).
        return [];
    }
}

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProgramaDetallePage({ params }: Props) {
    const { slug } = await params;

    // Obtener todos los programas desde Airtable
    let programas: Programa[] = [];
    try {
        programas = await fetchProgramas();
    } catch {
        // Si falla en runtime, mostrar estado vacío controlado
        return <ErrorState />;
    }

    // Buscar el programa por slug
    const programa = programas.find((p) => p.slug === slug);

    // Si no existe, 404
    if (!programa) {
        notFound();
    }

    // Obtener análisis del país desde el repositorio local (Word del cliente)
    const analisisPais = obtenerAnalisisPorPais(programa.pais);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-bg">
                {/* ── Hero del programa ── */}
                <section className="bg-black text-white px-10 py-16 max-sm:px-5 max-sm:py-10">
                    <div className="max-w-[900px] mx-auto">
                        <nav className="text-[13px] text-white/50 mb-6">
                            <a href="/" className="hover:text-yellow transition-colors">
                                Inicio
                            </a>
                            <span className="mx-2">/</span>
                            <span className="text-white/80">Programas</span>
                            <span className="mx-2">/</span>
                            <span className="text-yellow">{programa.nombre}</span>
                        </nav>

                        <h1 className="font-sans font-bold text-[clamp(28px,4vw,42px)] leading-[1.1] tracking-[-0.5px] mb-3">
                            {programa.nombre}
                        </h1>

                        <p className="text-base text-white/65 mb-6">
                            {programa.universidad}
                        </p>

                        {/* Badges de clasificación */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide bg-yellow text-black">
                                {programa.pais}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide bg-white/10 text-white">
                                {programa.nivel}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide bg-white/10 text-white">
                                {programa.modalidad}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide bg-white/10 text-white">
                                {programa.duracion} Meses
                            </span>
                        </div>
                    </div>
                </section>

                {/* ── Grid: Datos principales + Análisis del país ── */}
                <div className="max-w-[900px] mx-auto px-10 py-12 max-sm:px-5 max-sm:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna izquierda: Datos del programa */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Datos clave */}
                            <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                                <h2 className="font-sans text-sm font-bold uppercase tracking-[1.5px] text-yellow mb-5">
                                    Detalles del Programa
                                </h2>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-white/40 mb-1">
                                            Inversión Total
                                        </p>
                                        <p className="text-2xl font-bold text-white">
                                            {programa.matricula > 0
                                                ? `$${programa.matricula.toLocaleString("es-MX")}`
                                                : programa.matricula === 1
                                                    ? "$1"
                                                    : "No disponible"}{" "}
                                            <small className="text-sm font-medium text-white/40">USD</small>
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-white/40 mb-1">
                                            Duración
                                        </p>
                                        <p className="text-2xl font-bold text-white">
                                            {programa.duracion}{" "}
                                            <small className="text-sm font-medium text-white/40">Meses</small>
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-white/40 mb-1">
                                            Nivel
                                        </p>
                                        <p className="text-lg font-semibold text-white">{programa.nivel}</p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-white/40 mb-1">
                                            Modalidad
                                        </p>
                                        <p className="text-lg font-semibold text-white">{programa.modalidad}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Universidad */}
                            <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                                <h2 className="font-sans text-sm font-bold uppercase tracking-[1.5px] text-yellow mb-3">
                                    Universidad
                                </h2>
                                <p className="text-lg font-semibold text-white">{programa.universidad}</p>
                                <p className="text-sm text-white/50 mt-1">{programa.pais}</p>
                            </div>

                            {/* Botón de acción externa */}
                            {programa.url && (
                                <a
                                    href={programa.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center font-sans text-sm font-bold tracking-[0.5px] uppercase bg-yellow text-black border-2 border-yellow rounded-full px-8 py-4 cursor-pointer transition-colors hover:bg-yellow-dark hover:border-yellow-dark no-underline"
                                >
                                    Ver Programa Oficial
                                </a>
                            )}

                            {/* ── Checkbox de tesis + Cotizar tesis con CTL ── */}
                            <TesistaActions programa={programa} variant="detalle" />
                        </div>

                        {/* Columna derecha: Análisis del país */}
                        {analisisPais && (
                            <aside className="space-y-5">
                                <div className="bg-black/40 border border-yellow/30 rounded-xl p-6">
                                    <h2 className="font-sans text-sm font-bold uppercase tracking-[1.5px] text-yellow mb-4">
                                        Análisis de Mercado — {programa.pais}
                                    </h2>

                                    <div className="space-y-4 text-white/80 text-sm leading-relaxed">
                                        <p>{analisisPais.introduccion}</p>
                                        <div className="h-px bg-white/10" />
                                        <p className="text-white/70">{analisisPais.conclusion}</p>
                                    </div>

                                    {analisisPais.notaEspecial && (
                                        <>
                                            <div className="h-px bg-yellow/20 my-4" />
                                            <div className="bg-yellow/5 border border-yellow/20 rounded-lg p-4">
                                                <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-yellow mb-2">
                                                    Nota Metodológica
                                                </p>
                                                <p className="text-white/60 text-xs leading-relaxed">
                                                    {analisisPais.notaEspecial}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </aside>
                        )}

                        {/* Si no hay análisis, mostrar placeholder sutil */}
                        {!analisisPais && (
                            <aside>
                                <div className="bg-black/20 border border-white/5 rounded-xl p-6">
                                    <p className="text-white/30 text-xs italic">
                                        Análisis de mercado no disponible para este país.
                                    </p>
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="bg-black text-center px-10 py-7 text-[13px]">
                <p className="text-white/50">
                    ©2026 Desarrollado por{" "}
                    <strong className="text-yellow">Jercol Technologies</strong>
                </p>
            </footer>
        </>
    );
}

/** Estado de error controlado si Airtable falla en runtime */
function ErrorState() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-bg flex items-center justify-center px-10">
                <div className="text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                        Error de conexión
                    </h2>
                    <p className="text-white/50 max-w-md mx-auto">
                        No pudimos cargar la información del programa en este momento.
                        Por favor, intenta de nuevo más tarde.
                    </p>
                </div>
            </main>
            <footer className="bg-black text-center px-10 py-7 text-[13px]">
                <p className="text-white/50">
                    ©2026 Desarrollado por{" "}
                    <strong className="text-yellow">Jercol Technologies</strong>
                </p>
            </footer>
        </>
    );
}