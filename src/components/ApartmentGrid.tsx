import type { Apartment } from "@/types/apartment";
import { ApartmentCard } from "./ApartmentCard";
import { Reveal } from "./Reveal";

interface ApartmentGridProps {
  apartments: Apartment[];
}

export function ApartmentGrid({ apartments }: ApartmentGridProps) {
  if (apartments.length === 0) {
    return <p className="empty-state">No hay departamentos publicados.</p>;
  }

  return (
    <div className="catalog-list">
      {apartments.map((apartment, index) => (
        <Reveal key={apartment.id} className="catalog-item" delay={index * 80}>
          <ApartmentCard apartment={apartment} index={index} />
        </Reveal>
      ))}
    </div>
  );
}
