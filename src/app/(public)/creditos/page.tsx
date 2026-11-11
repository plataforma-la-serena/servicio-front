import type { Metadata } from "next";
import Link from "next/link";
import { IMAGE_CREDITS } from "@/lib/reference-images";

export const metadata: Metadata = {
  title: "Créditos de imágenes",
  description:
    "Autoría, licencia y fuente de las imágenes utilizadas en el sitio de La Serena.",
};

export default function CreditsPage() {
  return (
    <section className="credits" aria-labelledby="credits-title">
      <div className="shell">
        <p className="eyebrow">Créditos</p>
        <h1 id="credits-title" className="credits-title">
          Imágenes
        </h1>
        <p className="credits-lede">
          Las fotografías de La Serena provienen de Wikimedia Commons. Los
          interiores son imágenes de referencia y no corresponden
          necesariamente a los departamentos publicados.
        </p>

        <ul className="credits-list">
          {IMAGE_CREDITS.map((credit) => (
            <li className="credit-row" key={credit.src}>
              <div>
                <p className="credit-title">{credit.title}</p>
                <p className="credit-meta">
                  {credit.author} · {credit.license}
                </p>
              </div>
              <div className="credit-links">
                <a
                  href={credit.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fuente
                </a>
                <a
                  href={credit.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Licencia
                </a>
              </div>
            </li>
          ))}
        </ul>

        <Link href="/" className="back-link">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
