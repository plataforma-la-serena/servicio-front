import Link from "next/link";
import type { Apartment } from "@/types/apartment";
import { ApartmentGrid } from "./ApartmentGrid";
import { Reveal } from "./Reveal";

interface CatalogProps {
  apartments: Apartment[];
  isSample: boolean;
  title?: string;
  lede?: string;
  meta?: string;
  moreHref?: string;
  moreLabel?: string;
}

export function Catalog({
  apartments,
  isSample,
  title = "Departamentos",
  lede = "Elegí el departamento que se ajuste a tu grupo y coordiná la reserva por WhatsApp.",
  meta,
  moreHref,
  moreLabel,
}: CatalogProps) {
  const count = String(apartments.length).padStart(2, "0");

  return (
    <section id="catalogo" className="catalog" aria-labelledby="catalog-title">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <div className="section-head-copy">
              <h2 id="catalog-title" className="section-title">
                {title}
              </h2>
              <p className="section-lede">{lede}</p>
            </div>
            <span className="section-meta">
              {meta ?? `${count} departamentos`}
            </span>
          </div>
        </Reveal>

        <ApartmentGrid apartments={apartments} />

        {moreHref && moreLabel && (
          <p className="catalog-more">
            <Link className="text-link" href={moreHref}>
              {moreLabel}
            </Link>
          </p>
        )}

        {isSample && (
          <p className="sample-note">
            Datos de ejemplo. La información real se carga desde la API central.
          </p>
        )}
      </div>
    </section>
  );
}
