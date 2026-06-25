"use client";

import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gray-bg border-b-2 border-black flex items-center justify-between px-10 h-16 max-sm:px-5">
      <a className="flex items-center no-underline select-none" href="/">
        <img
          src="/images/logo-horizontal-negro.png"
          alt="Comunidad Tesista de Latinoamérica"
          className="h-[52px] w-auto block object-contain"
        />
      </a>

      <button
        className="hidden max-sm:flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1.5"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menú"
      >
        <span className="block w-6 h-[2px] bg-black transition-all" />
        <span className="block w-6 h-[2px] bg-black transition-all" />
        <span className="block w-6 h-[2px] bg-black transition-all" />
      </button>

      <nav
        className={`flex items-center gap-1 max-sm:flex-col max-sm:absolute max-sm:top-16 max-sm:left-0 max-sm:right-0 max-sm:bg-gray-bg max-sm:border-b-2 max-sm:border-black max-sm:p-3 max-sm:gap-1 ${menuOpen ? "max-sm:flex" : "max-sm:hidden"
          }`}
      >
        <a
          href="#"
          className="font-sans font-medium text-[15px] tracking-[-0.2px] no-underline text-yellow px-3.5 py-2 rounded-sm transition-colors hover:bg-yellow hover:text-black leading-tight"
        >
          Programas
        </a>
        <a
          href="#"
          className="font-sans font-medium text-[15px] tracking-[-0.2px] no-underline text-yellow px-3.5 py-2 rounded-sm transition-colors hover:bg-yellow hover:text-black leading-tight"
        >
          Países
        </a>
        <a
          href="#"
          className="font-sans font-medium text-[15px] tracking-[-0.2px] no-underline text-yellow px-3.5 py-2 rounded-sm transition-colors hover:bg-yellow hover:text-black leading-tight"
        >
          Becas
        </a>
        <a
          href="#"
          className="font-sans font-medium text-[15px] tracking-[-0.2px] no-underline text-yellow px-3.5 py-2 rounded-sm transition-colors hover:bg-yellow hover:text-black leading-tight"
        >
          Blog
        </a>
      </nav>
    </header>
  );
}