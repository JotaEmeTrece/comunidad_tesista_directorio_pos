import { BADGE_COLORS } from "./constants";

export function normalizar(texto: string): string {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function badgeClass(pais: string): string {
  if (!pais) return BADGE_COLORS["default"];
  const key = normalizar(pais);
  return BADGE_COLORS[key] || BADGE_COLORS["default"];
}

export function fmtUSD(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}