import type { Apartment } from "@/types/apartment";
import { ApartmentCard } from "./ApartmentCard";
import { Reveal } from "./Reveal";

interface CatalogProps {
  apartments: Apartment[];
  isSample: boolean;
}

export function Catalog({ apartments, isSample }: CatalogProps) {
  const count = String(apartments.length).padStart(2, "0");

  return (
    <section id="catalogo" className="catalog" aria-labelledby="catalog-title">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <div className="section-head-copy">
              <h2 id="catalog-title" className="section-title">
                Departamentos
              </h2>
              <p className="section-lede">
                Elegí el departamento que se ajuste a tu grupo y coordiná la
                reserva por WhatsApp.
              </p>
            </div>
            <span className="section-meta">{count} departamentos</span>
          </div>
        </Reveal>

        {apartments.length > 0 ? (
          <div className="catalog-list">
            {apartments.map((apartment, index) => (
              <Reveal
                key={apartment.id}
                className="catalog-item"
                delay={index * 80}
              >
                <ApartmentCard apartment={apartment} index={index} />
              </Reveal>
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
