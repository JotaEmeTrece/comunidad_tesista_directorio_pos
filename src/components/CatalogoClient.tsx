"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Card } from "@/components/ui/Card";
import { normalizar } from "@/lib/utils";
import type { Programa } from "@/types";

const PAGE_SIZE = 20;

interface CatalogoClientProps {
    inicialProgramas: Programa[];
    serverError: string | null;
}

export default function CatalogoClient({ inicialProgramas, serverError }: CatalogoClientProps) {
    const [activeFilter, setActiveFilter] = useState("Todos");
    const [nivelFilter, setNivelFilter] = useState("Todos");
    const [modalidadFilter, setModalidadFilter] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Valores únicos dinámicos
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

    // Filtrado combinado
    const filtered = useMemo(() => {
        let result = [...inicialProgramas];

        if (searchTerm.trim()) {
            const q = normalizar(searchTerm);
            result = result.filter(
                (p) =>
                    normalizar(p.nombre).includes(q) ||
                    normalizar(p.universidad).includes(q)
            );
        }

        if (activeFilter !== "Todos") {
            result = result.filter(
                (p) => normalizar(p.pais) === normalizar(activeFilter)
            );
        }

        if (nivelFilter !== "Todos") {
            result = result.filter(
                (p) => normalizar(p.nivel) === normalizar(nivelFilter)
            );
        }

        if (modalidadFilter !== "Todos") {
            result = result.filter(
                (p) => normalizar(p.modalidad) === normalizar(modalidadFilter)
            );
        }

        return result;
    }, [inicialProgramas, searchTerm, activeFilter, nivelFilter, modalidadFilter]);

    const visibleProgramas = useMemo(
        () => filtered.slice(0, visibleCount),
        [filtered, visibleCount]
    );

    const hasMore = visibleCount < filtered.length;

    const handleLoadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setVisibleCount(PAGE_SIZE);
    };

    const handleFilterChange = (setter: (v: string) => void) => (val: string) => {
        setter(val);
        setVisibleCount(PAGE_SIZE);
    };

    return (
        <>
            <Header />
            <Hero onSearch={handleSearch} />
            <StatsBarDynamic programas={inicialProgramas} />

            <main className="max-w-[1100px] mx-auto px-10 py-[52px_40px_80px] max-sm:px-5 max-sm:py-9">
                {/* Filtros superiores */}
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

                        {/* Selects de filtro */}
                        <div className="flex gap-2">
                            <select
                                value={nivelFilter}
                                onChange={(e) => handleFilterChange(setNivelFilter)(e.target.value)}
                                className="font-sans text-[13px] font-medium px-3 py-1.5 border-2 border-black rounded-full bg-black text-yellow cursor-pointer outline-none focus:border-yellow transition-colors"
                            >
                                <option value="Todos">Todos los niveles</option>
                                {nivelesUnicos.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={modalidadFilter}
                                onChange={(e) => handleFilterChange(setModalidadFilter)(e.target.value)}
                                className="font-sans text-[13px] font-medium px-3 py-1.5 border-2 border-black rounded-full bg-black text-yellow cursor-pointer outline-none focus:border-yellow transition-colors"
                            >
                                <option value="Todos">Todas las modalidades</option>
                                {modalidadesUnicas.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contador dinámico con paginación */}
                {!serverError && filtered.length > 0 && (
                    <p className="text-[13px] text-gray-text font-medium mb-5">
                        Mostrando{" "}
                        <strong className="text-black">
                            {visibleCount > filtered.length ? filtered.length : visibleCount}
                        </strong>{" "}
                        de{" "}
                        <strong className="text-black">{filtered.length}</strong> programa
                        {filtered.length !== 1 ? "s" : ""} académico
                        {filtered.length !== 1 ? "s" : ""} encontrado
                        {filtered.length !== 1 ? "s" : ""}
                    </p>
                )}

                {/* Error State */}
                {serverError && (
                    <div className="text-center py-20 text-gray-text">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl mb-2 font-semibold text-black">
                            Error de conexión
                        </h3>
                        <p className="max-w-md mx-auto">{serverError}</p>
                    </div>
                )}

                {/* Grid */}
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

                        {/* Botón "Cargar más programas" — rediseñado */}
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

            {/* Footer */}
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