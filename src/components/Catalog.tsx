import type { Apartment } from "@/types/apartment";
import { ApartmentRow } from "./ApartmentRow";

interface CatalogProps {
  apartments: Apartment[];
  isSample: boolean;
}

export function Catalog({ apartments, isSample }: CatalogProps) {
  const count = String(apartments.length).padStart(2, "0");

  return (
    <section id="catalogo" className="catalog" aria-labelledby="catalog-title">
      <div className="shell">
        <div className="section-head">
          <h2 id="catalog-title" className="section-title">
            Catálogo
          </h2>
          <span className="section-meta">{count} departamentos</span>
        </div>

        {apartments.length > 0 ? (
          <div className="catalog-list">
            {apartments.map((apartment, index) => (
              <ApartmentRow
                key={apartment.id}
                apartment={apartment}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">No hay departamentos publicados.</p>
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
