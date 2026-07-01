// Archivo: src/components/CatalogoClient.tsx
// Catálogo interactivo con filtros avanzados: país, nivel, modalidad, universidad, rango de precios y buscador inteligente.
// Paginación de 20 programas por bloque. Recibe los datos desde el Server Component page.tsx vía props.

"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { PresentacionInvestigacion } from "@/components/layout/PresentacionInvestigacion";
import { Card } from "@/components/ui/Card";
import { normalizar } from "@/lib/utils";
import { obtenerAnalisisPorPais } from "@/lib/constants/paisesData";
import { INSIGHTS_POR_PAIS } from "@/lib/constants/insightsMexico";
import { OrientadorModal } from "@/components/ui/OrientadorModal";
import type { Programa } from "@/types";

const PAGE_SIZE = 20;

/** Rangos de precio estáticos para el filtro por matrícula */
const PRICE_RANGES = [
    { label: "Todos los precios", min: -1, max: Infinity },
    { label: "Hasta $1,000 USD", min: 0, max: 1000 },
    { label: "Entre $1,000 y $3,000 USD", min: 1000, max: 3000 },
    { label: "Entre $3,000 y $5,000 USD", min: 3000, max: 5000 },
    { label: "Más de $5,000 USD", min: 5000, max: Infinity },
] as const;

interface CatalogoClientProps {
    inicialProgramas: Programa[];
    serverError: string | null;
}

export default function CatalogoClient({ inicialProgramas, serverError }: CatalogoClientProps) {
    // ── Estados de filtro ──
    const [activeFilter, setActiveFilter] = useState("Todos");       // País
    const [nivelFilter, setNivelFilter] = useState("Todos");         // Nivel
    const [modalidadFilter, setModalidadFilter] = useState("Todos"); // Modalidad
    const [universidadFilter, setUniversidadFilter] = useState("Todos"); // Universidad (nuevo)
    const [priceRange, setPriceRange] = useState(0);                 // Índice en PRICE_RANGES (nuevo)
    const [searchTerm, setSearchTerm] = useState("");                // Búsqueda por texto / precio
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);     // Paginación
    const [orientadorAbierto, setOrientadorAbierto] = useState(false); // Modal del orientador IA
    const [nivelPaisActivo, setNivelPaisActivo] = useState<"maestria" | "doctorado" | null>(null); // Tab de nivel dentro del panorama

    // ── Valores únicos dinámicos deducidos de la data real ──
    const paisesUnicos = useMemo(() => {
        const set = new Set(inicialProgramas.map((p) => p.pais).filter(Boolean));
        return Array.from(set).sort();
    }, [inicialProgramas]);

    const nivelesUnicos = useMemo(() => {
        const set = new Set(inicialProgramas.map((p) => p.nivel).filter(Boolean));
        return Array.from(set).sort();
    }, [inicialProgramas]);

    const modalidadesUnicas = useMemo(() => {
        const set = new Set(inicialProgramas.map((p) => p.modalidad).filter(Boolean));
        return Array.from(set).sort();
    }, [inicialProgramas]);

    // Universidades únicas (nuevo filtro)
    const universidadesUnicas = useMemo(() => {
        const set = new Set(inicialProgramas.map((p) => p.universidad).filter(Boolean));
        return Array.from(set).sort((a, b) => a.localeCompare(b)); // orden alfabético A-Z
    }, [inicialProgramas]);

    // ── Filtrado combinado (todos los filtros se cruzan) ──
    const filtered = useMemo(() => {
        let result = [...inicialProgramas];

        // --- Búsqueda inteligente por texto / precio ---
        if (searchTerm.trim()) {
            const q = normalizar(searchTerm);
            const raw = searchTerm.trim();

            // Detectar si el usuario escribió un número (ej. "3000")
            const priceQuery = Number(raw);
            const isNumericSearch = !isNaN(priceQuery) && raw !== "";

            result = result.filter((p) => {
                // Búsqueda textual defensiva: nombre, universidad, país, nivel y modalidad
                const matchesText =
                    normalizar(p.nombre || "").includes(q) ||
                    normalizar(p.universidad || "").includes(q) ||
                    normalizar(p.pais || "").includes(q) ||
                    normalizar(p.nivel || "").includes(q) ||
                    normalizar(p.modalidad || "").includes(q);

                if (isNumericSearch) {
                    // Blindaje defensivo: si matrícula es 0 o 1 y el usuario NO buscó "0" o "1",
                    // no debe aparecer como falso positivo de gratuidad.
                    const explicitZeroSearch = raw === "0" || raw === "0.0";
                    const explicitOneSearch = raw === "1" || raw === "1.0";

                    // Si busca un número > 1, excluir programas con matrícula 0 o 1
                    // porque no son relevantes para una búsqueda de presupuesto realista.
                    if (priceQuery > 1 && p.matricula <= 1 && !explicitZeroSearch && !explicitOneSearch) {
                        return matchesText; // solo si coincide por texto
                    }

                    // Coincidencia por precio: matrícula ≤ número buscado
                    const matchesPrice = p.matricula > 0 && p.matricula <= priceQuery;
                    return matchesText || matchesPrice;
                }

                return matchesText;
            });
        }

        // --- Filtro por país ---
        if (activeFilter !== "Todos") {
            result = result.filter(
                (p) => normalizar(p.pais) === normalizar(activeFilter)
            );
        }

        // --- Filtro por nivel ---
        if (nivelFilter !== "Todos") {
            result = result.filter(
                (p) => normalizar(p.nivel) === normalizar(nivelFilter)
            );
        }

        // --- Filtro por modalidad ---
        if (modalidadFilter !== "Todos") {
            result = result.filter(
                (p) => normalizar(p.modalidad) === normalizar(modalidadFilter)
            );
        }

        // --- Filtro por universidad (nuevo) ---
        if (universidadFilter !== "Todos") {
            result = result.filter(
                (p) => normalizar(p.universidad) === normalizar(universidadFilter)
            );
        }

        // --- Filtro por rango de precios (nuevo) ---
        if (priceRange > 0) {
            const range = PRICE_RANGES[priceRange];
            result = result.filter(
                (p) => p.matricula >= range.min && p.matricula <= range.max
            );
        }

        // --- Filtro por nivel de país activo (tabs del panorama) ---
        if (nivelPaisActivo) {
            const nivelBuscado = nivelPaisActivo === "maestria" ? "maestria" : "doctorado";
            result = result.filter((p) =>
                p.nivel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(nivelBuscado)
            );
        }

        return result;
    }, [
        inicialProgramas,
        searchTerm,
        activeFilter,
        nivelFilter,
        modalidadFilter,
        universidadFilter,
        priceRange,
        nivelPaisActivo,
    ]);

    // ── Slice de paginación ──
    const visibleProgramas = useMemo(
        () => filtered.slice(0, visibleCount),
        [filtered, visibleCount]
    );

    const hasMore = visibleCount < filtered.length;

    // ── Handlers ──
    const handleLoadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE);

    // El buscador y todos los filtros resetean la paginación a 20
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setVisibleCount(PAGE_SIZE);
    };

    const handleFilterChange = (setter: (v: string) => void) => (val: string) => {
        setter(val);
        setVisibleCount(PAGE_SIZE);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPriceRange(Number(e.target.value));
        setVisibleCount(PAGE_SIZE);
    };

    // ── Números visibles para el contador ──
    const currentVisible = visibleCount > filtered.length ? filtered.length : visibleCount;
    const totalFiltered = filtered.length;

    // ── Detectar país activo (filtro o búsqueda) y obtener su análisis ──
    const paisActivo = useMemo(() => {
        // Prioridad 1: filtro de país seleccionado
        if (activeFilter !== "Todos") return activeFilter;

        // Prioridad 2: si el texto del buscador coincide con un país del repositorio
        if (searchTerm.trim()) {
            const analisis = obtenerAnalisisPorPais(searchTerm.trim());
            if (analisis) {
                // Devolver el nombre del país tal como está en el repositorio (con tildes)
                for (const key of Object.keys(
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    { México: 1, Honduras: 1, "El Salvador": 1, Nicaragua: 1, "Costa Rica": 1, Panamá: 1, "República Dominicana": 1, Cuba: 1, "Puerto Rico": 1, Venezuela: 1, Colombia: 1, Ecuador: 1, Perú: 1, Bolivia: 1, Chile: 1, Uruguay: 1, Paraguay: 1, Argentina: 1 }
                )) {
                    if (key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === searchTerm.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) {
                        return key;
                    }
                }
            }
        }

        return null;
    }, [activeFilter, searchTerm]);

    const analisisPais = useMemo(
        () => (paisActivo ? obtenerAnalisisPorPais(paisActivo) : null),
        [paisActivo]
    );

    return (
        <>
            <Header />
            <Hero onSearch={handleSearch} />
            <PresentacionInvestigacion />
            <StatsBarDynamic programas={inicialProgramas} />

            {/* ── Botón Orientador Vocacional IA ── */}
            <div className="max-w-[1100px] mx-auto px-10 mt-8 max-sm:px-5">
                <button
                    onClick={() => setOrientadorAbierto(true)}
                    className="w-full font-sans text-sm font-bold tracking-[0.5px] uppercase bg-gradient-to-r from-black to-gray-bg border-2 border-yellow text-yellow rounded-xl px-8 py-4 cursor-pointer transition-all hover:bg-yellow hover:text-black flex items-center justify-center gap-2"
                >
                    <span className="text-lg">🧠</span>
                    Orientador Vocacional de IA — Descubre tu posgrado ideal en 3 preguntas
                </button>
            </div>

            <main id="catalogo" className="max-w-[1100px] mx-auto px-10 py-[52px_40px_80px] max-sm:px-5 max-sm:py-9">
                {/* ── Filtros superiores ── */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3 mt-8">
                        {/* Botones de país */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                className={`font-sans text-[13px] font-medium px-3.5 py-1.5 border-2 rounded-full cursor-pointer transition-all ${activeFilter === "Todos"
                                    ? "bg-black border-yellow text-yellow"
                                    : "bg-black border-black text-yellow hover:border-yellow"
                                    }`}
                                onClick={() => handleFilterChange(setActiveFilter)("Todos")}
                            >
                                Todos
                            </button>
                            {paisesUnicos.map((pais) => (
                                <button
                                    key={pais}
                                    className={`font-sans text-[13px] font-medium px-3.5 py-1.5 border-2 rounded-full cursor-pointer transition-all ${activeFilter === pais
                                        ? "bg-black border-yellow text-yellow"
                                        : "bg-black border-black text-yellow hover:border-yellow"
                                        }`}
                                    onClick={() => handleFilterChange(setActiveFilter)(pais)}
                                >
                                    {pais}
                                </button>
                            ))}
                        </div>

                        {/* Selects de filtro: Nivel, Modalidad, Universidad, Precio */}
                        <div className="flex gap-2 flex-wrap">
                            {/* Nivel */}
                            <select
                                value={nivelFilter}
                                onChange={(e) => handleFilterChange(setNivelFilter)(e.target.value)}
                                className="font-sans text-[13px] font-medium px-3 py-1.5 border-2 border-black rounded-full bg-black text-yellow cursor-pointer outline-none focus:border-yellow transition-colors"
                            >
                                <option value="Todos">Todos los niveles</option>
                                {nivelesUnicos.map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>

                            {/* Modalidad */}
                            <select
                                value={modalidadFilter}
                                onChange={(e) => handleFilterChange(setModalidadFilter)(e.target.value)}
                                className="font-sans text-[13px] font-medium px-3 py-1.5 border-2 border-black rounded-full bg-black text-yellow cursor-pointer outline-none focus:border-yellow transition-colors"
                            >
                                <option value="Todos">Todas las modalidades</option>
                                {modalidadesUnicas.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>

                            {/* Universidad (nuevo) */}
                            <select
                                value={universidadFilter}
                                onChange={(e) => handleFilterChange(setUniversidadFilter)(e.target.value)}
                                className="font-sans text-[13px] font-medium px-3 py-1.5 border-2 border-black rounded-full bg-black text-yellow cursor-pointer outline-none focus:border-yellow transition-colors"
                            >
                                <option value="Todos">Todas las universidades</option>
                                {universidadesUnicas.map((u) => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>

                            {/* Rango de precios (nuevo) */}
                            <select
                                value={priceRange}
                                onChange={handlePriceChange}
                                className="font-sans text-[13px] font-medium px-3 py-1.5 border-2 border-black rounded-full bg-black text-yellow cursor-pointer outline-none focus:border-yellow transition-colors"
                            >
                                {PRICE_RANGES.map((r, i) => (
                                    <option key={i} value={i}>{r.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Contador dinámico con accesibilidad mejorada ── */}
                {!serverError && filtered.length > 0 && (
                    <p className="text-[13px] text-gray-text font-medium mb-5">
                        Mostrando{" "}
                        <strong className="text-yellow font-bold">
                            {currentVisible}
                        </strong>{" "}
                        de{" "}
                        <strong className="text-yellow font-bold">{totalFiltered}</strong>{" "}
                        programa
                        {totalFiltered !== 1 ? "s" : ""} académico
                        {totalFiltered !== 1 ? "s" : ""} encontrado
                        {totalFiltered !== 1 ? "s" : ""}
                    </p>
                )}

                {/* ── Banner contextual del país activo con tabs de nivel ── */}
                {analisisPais && paisActivo && (
                    <div className="bg-black/70 border border-yellow/30 rounded-xl p-5 mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-yellow text-black mb-3">
                            Panorama en {paisActivo}
                        </span>
                        <p className="text-white/75 text-sm leading-relaxed mb-4">
                            {analisisPais.introduccion}
                        </p>

                        {/* ── Pestañas de nivel (Maestría / Doctorado) — selección exclusiva, default maestría ── */}
                        <div className="flex gap-2 flex-wrap mb-4">
                            <button
                                onClick={() => {
                                    setNivelPaisActivo("maestria");
                                    setVisibleCount(PAGE_SIZE);
                                }}
                                className={`font-sans text-[12px] font-medium px-4 py-1.5 rounded-full cursor-pointer transition-all border-2 ${nivelPaisActivo === "maestria"
                                    ? "bg-yellow border-yellow text-black"
                                    : "bg-transparent border-white/20 text-white/70 hover:border-yellow/50"
                                    }`}
                            >
                                🎓 Oferta Maestrías
                            </button>
                            <button
                                onClick={() => {
                                    setNivelPaisActivo("doctorado");
                                    setVisibleCount(PAGE_SIZE);
                                }}
                                className={`font-sans text-[12px] font-medium px-4 py-1.5 rounded-full cursor-pointer transition-all border-2 ${nivelPaisActivo === "doctorado"
                                    ? "bg-yellow border-yellow text-black"
                                    : "bg-transparent border-white/20 text-white/70 hover:border-yellow/50"
                                    }`}
                            >
                                🏛️ Oferta Doctorados
                            </button>
                        </div>

                        {/* ── Insights de Oro (solo para países con datos) ── */}
                        {INSIGHTS_POR_PAIS[paisActivo] && nivelPaisActivo && (
                            <div className="bg-black/40 border border-yellow/20 rounded-lg p-4 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-yellow">
                                    💡 Insights de Oro — {nivelPaisActivo === "maestria" ? "Maestrías" : "Doctorados"} {paisActivo}
                                </h4>
                                {INSIGHTS_POR_PAIS[paisActivo][nivelPaisActivo].map((insight, i) => (
                                    <div key={i} className="text-white/75 text-xs leading-relaxed">
                                        <strong className="text-white font-semibold">{insight.titulo}:</strong>{" "}
                                        {insight.contenido}
                                    </div>
                                ))}
                            </div>
                        )}
                        {analisisPais.conclusion && (
                            <div className="mt-3 pt-3 border-t border-yellow/20">
                                <p className="text-white/60 text-xs leading-relaxed italic">
                                    {analisisPais.conclusion}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Error State ── */}
                {serverError && (
                    <div className="text-center py-20 text-gray-text">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl mb-2 font-semibold text-black">
                            Error de conexión
                        </h3>
                        <p className="max-w-md mx-auto">{serverError}</p>
                    </div>
                )}

                {/* ── Grid de resultados ── */}
                {!serverError && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visibleProgramas.map((p, i) => (
                                // airtableId es el ID nativo de Airtable (recXXXXXXXXXXXX), garantiza unicidad global.
                                // No usar p.id porque es el "ID Programa" manual y puede tener duplicados.
                                <Card key={p.airtableId || `${p.id}-${i}`} programa={p} index={i} />
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-text">
                                <div className="text-3xl mb-2">🔍</div>
                                <h3 className="text-xl mb-1">Sin resultados</h3>
                                <p className="max-w-md mx-auto">
                                    No se encontraron programas con los filtros seleccionados.
                                </p>
                            </div>
                        )}

                        {/* ── Botón "Cargar más programas" ── */}
                        {hasMore && (
                            <div className="flex justify-center mt-8 mb-12">
                                <button
                                    onClick={handleLoadMore}
                                    className="mx-auto block w-full max-w-xs py-3 px-6 text-sm font-semibold uppercase tracking-[0.5px] bg-yellow text-black border-2 border-yellow rounded-md cursor-pointer transition-colors hover:bg-yellow-dark hover:border-yellow-dark"
                                >
                                    Cargar más programas
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* ── Modal del Orientador Vocacional IA ── */}
            <OrientadorModal
                abierto={orientadorAbierto}
                onCerrar={() => setOrientadorAbierto(false)}
            />

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

/** Barra de estadísticas dinámica basada en datos reales */
function StatsBarDynamic({ programas }: { programas: Programa[] }) {
    const total = programas.length;
    const universidades = new Set(programas.map((p) => p.universidad).filter(Boolean)).size;
    const paises = new Set(programas.map((p) => p.pais).filter(Boolean)).size;

    return (
        <div className="bg-yellow px-10 py-3.5 flex gap-10 items-center max-sm:px-5 max-sm:gap-5 max-sm:overflow-x-auto">
            <div className="flex items-center gap-2 text-[13px] font-bold text-black uppercase tracking-[0.5px]">
                <span className="w-2 h-2 bg-black rounded-full" />
                {total}+ Programas
            </div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-black uppercase tracking-[0.5px]">
                <span className="w-2 h-2 bg-black rounded-full" />
                {universidades}+ Universidades
            </div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-black uppercase tracking-[0.5px]">
                <span className="w-2 h-2 bg-black rounded-full" />
                {paises}+ Países
            </div>
        </div>
    );
}