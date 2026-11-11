import type { Metadata } from "next";
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
  metadataBase: new URL(siteUrl),
  title: {
    default: "La Serena — Departamentos temporarios",
    template: "%s — La Serena",
  },
  description:
    "Departamentos amoblados en La Serena para la temporada de verano. Consultas y reservas por WhatsApp.",
  openGraph: {
    title: "La Serena — Departamentos temporarios",
    description:
      "Departamentos amoblados en La Serena para la temporada de verano.",
    locale: "es_CL",
    type: "website",
  },
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
