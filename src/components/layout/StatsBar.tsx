export function StatsBar() {
  return (
    <div className="bg-yellow px-10 py-3.5 flex gap-10 items-center max-sm:px-5 max-sm:gap-5 max-sm:overflow-x-auto">
      <div className="flex items-center gap-2 text-[13px] font-bold text-black uppercase tracking-[0.5px]">
        <span className="w-2 h-2 bg-black rounded-full" />
        120+ Programas
      </div>
      <div className="flex items-center gap-2 text-[13px] font-bold text-black uppercase tracking-[0.5px]">
        <span className="w-2 h-2 bg-black rounded-full" />
        30+ Países
      </div>
      <div className="flex items-center gap-2 text-[13px] font-bold text-black uppercase tracking-[0.5px]">
        <span className="w-2 h-2 bg-black rounded-full" />
        Datos actualizados 2026
      </div>
    </div>
  );
}