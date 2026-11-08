import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Apartment } from "@/types/apartment";
import { ReserveButton } from "./ReserveButton";

interface ApartmentRowProps {
  apartment: Apartment;
  index: number;
}

export function ApartmentRow({ apartment, index }: ApartmentRowProps) {
  const folio = String(index + 1).padStart(2, "0");
  const detailHref = `/departamentos/${apartment.id}`;

  return (
    <article className="apartment-row">
      <div className="folio" aria-hidden="true">
        {folio}
      </div>

      <div className="apartment-main">
        <h3 className="apartment-title">
          <Link href={detailHref}>{apartment.title}</Link>
        </h3>
        <p className="apartment-description">{apartment.description}</p>
        <ul className="features" aria-label="Características">
          {apartment.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="apartment-metrics">
        <div className="metric">
          <span className="metric-label">Capacidad</span>
          <span className="metric-value">{apartment.capacity}</span>
          <span className="metric-unit">personas</span>
        </div>
        <div className="metric">
          <span className="metric-label">Precio</span>
          <span className="metric-value metric-value-price">
            {formatPrice(apartment.pricePerNight)}
          </span>
          <span className="metric-unit">por noche</span>
        </div>
      </div>

      <div className="apartment-action">
        <Link href={detailHref} className="text-link">
          Ver detalle
        </Link>
        <ReserveButton
          label="Reservar"
          message={`Hola, quiero reservar ${apartment.title} en La Serena.`}
        />
      </div>
    </article>
  );
}
