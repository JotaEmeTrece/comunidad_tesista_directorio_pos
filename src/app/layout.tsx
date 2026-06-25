import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "Comunidad Tesista de Latinoamérica — Directorio de Posgrados",
  description:
    "Compara programas de posgrado, costos de matrícula y calidad de vida en más de 30 países. Decisiones inteligentes, futuro brillante.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning className={robotoCondensed.variable}>
      <body>{children}</body>
    </html>
  );
}