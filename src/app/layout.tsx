import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GridLines } from "@/components/GridLines";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "La Serena — Departamentos temporarios",
    template: "%s — La Serena",
  },
  description:
    "Alquiler de departamentos amoblados en La Serena para la temporada de verano. Consultas y reservas por WhatsApp.",
  openGraph: {
    title: "La Serena — Departamentos temporarios",
    description:
      "Alquiler de departamentos amoblados en La Serena para la temporada de verano.",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <GridLines />
        <div className="site">{children}</div>
      </body>
    </html>
  );
}
