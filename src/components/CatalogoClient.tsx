// Archivo: src/components/CatalogoClient.tsx
// Catálogo interactivo con filtros avanzados: país, nivel, modalidad, universidad, rango de precios y buscador inteligente.
// Paginación de 20 programas por bloque. Recibe los datos desde el Server Component page.tsx vía props.

"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Card } from "@/components/ui/Card";
import { normalizar } from "@/lib/utils";
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

        return result;
    }, [
        inicialProgramas,
        searchTerm,
        activeFilter,
        nivelFilter,
        modalidadFilter,
        universidadFilter,
        priceRange,
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

    return (
        <>
            <Header />
            <Hero onSearch={handleSearch} />
            <StatsBarDynamic programas={inicialProgramas} />

            <main className="max-w-[1100px] mx-auto px-10 py-[52px_40px_80px] max-sm:px-5 max-sm:py-9">
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