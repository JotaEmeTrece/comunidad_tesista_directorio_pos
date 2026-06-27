// Archivo: src/components/layout/Hero.tsx
// Componente de presentación: Barra de búsqueda y hero visual de la landing page.
// Recibe onSearch como prop para transmitir el texto del input hacia CatalogoClient.

interface HeroProps {
  /** Callback que recibe el evento onChange del input de búsqueda */
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Hero({ onSearch }: HeroProps) {
  return (
    <section className="bg-black text-white px-10 py-[72px_40px_60px] max-sm:px-5 max-sm:py-12 relative overflow-hidden">
      {/* Círculo decorativo de fondo */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-yellow rounded-full opacity-[0.07] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto">
        {/* Badge superior */}
        <span className="inline-block bg-yellow text-black text-[11px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-sm mb-5">
          ✦ COMUNIDAD TESISTA DE LATINOAMÉRICA
        </span>

        {/* Título principal */}
        <h1 className="font-sans font-bold text-[clamp(32px,5vw,56px)] leading-[1.05] tracking-[-1px] max-w-[680px] mb-4">
          Directorio de{" "}
          <em className="not-italic text-yellow">Posgrados en Educación</em>{" "}
          2026
        </h1>

        {/* Subtítulo descriptivo */}
        <p className="text-base text-white/65 max-w-[500px] mb-9 leading-relaxed">
          Compara programas, costos, duración, y requisitos de grado de 18 países.
        </p>

        {/* Input de búsqueda — conectado vía onChange a CatalogoClient.handleSearch */}
        <div className="flex max-w-[560px] max-sm:max-w-full">
          <input
            type="text"
            placeholder="Busca por programa o país... ej: MBA, Colombia"
            autoComplete="off"
            onChange={onSearch}
            className="flex-1 font-sans text-[15px] font-medium px-5 py-3.5 border-2 border-white/20 border-r-0 rounded-l-md bg-white/6 text-white outline-none transition-colors placeholder:text-white/40 focus:border-yellow focus:bg-white/10"
          />
          <button
            type="button"
            className="font-sans text-sm font-bold tracking-[0.5px] uppercase bg-yellow text-black border-2 border-yellow rounded-r-md px-6 py-3.5 cursor-pointer transition-colors hover:bg-yellow-dark hover:border-yellow-dark"
          >
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
}