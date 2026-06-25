export const PAISES = [
  "Argentina",
  "Colombia",
  "España",
  "Ecuador",
  "México",
  "Perú",
  "USA",
] as const;
export type Pais = (typeof PAISES)[number];

export const BADGE_COLORS: Record<string, string> = {
  colombia: "bg-[#FCE4A8] text-[#7A5500]",
  españa: "bg-[#FECACA] text-[#7F1D1D]",
  argentina: "bg-[#BAE6FD] text-[#0C4A6E]",
  mexico: "bg-[#BBF7D0] text-[#14532D]",
  usa: "bg-[#C7D2FE] text-[#1E1B4B]",
  ecuador: "bg-[#E8D5F5] text-[#4A1D6A]",
  peru: "bg-[#FDE68A] text-[#7A5C00]",
  default: "bg-yellow text-black",
};

