import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

const fraunces = localFont({
  src: [
    {
      path: "./fonts/fraunces-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/fraunces-italic-latin.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const epilogue = localFont({
  src: "./fonts/epilogue-latin.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  applicationName: "Alquileres 4 Esquinas",
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alquileres 4 Esquinas — Departamentos temporarios en La Serena",
    template: "%s — Alquileres 4 Esquinas",
  },
  description:
    "Alquileres 4 Esquinas: departamentos amoblados en La Serena para la temporada de verano. Consultas y reservas por WhatsApp.",
  other: {
    "supported-color-schemes": "light",
  },
  openGraph: {
    title: "Alquileres 4 Esquinas — Departamentos temporarios en La Serena",
    description:
      "Alquileres 4 Esquinas: departamentos amoblados en La Serena para la temporada de verano.",
    locale: "es_CL",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f0dfcf",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${epilogue.variable}`}>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <div className="site">{children}</div>
      </body>
    </html>
  );
}
