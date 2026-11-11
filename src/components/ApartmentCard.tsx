import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { referenceInterior } from "@/lib/reference-images";
import type { Apartment } from "@/types/apartment";
import { ReserveButton } from "./ReserveButton";

interface ApartmentCardProps {
  apartment: Apartment;
  index: number;
}

export function ApartmentCard({ apartment, index }: ApartmentCardProps) {
  const folio = String(index + 1).padStart(2, "0");
  const detailHref = `/departamentos/${apartment.id}`;
  const image = referenceInterior(index);

  return (
    <article className="apartment-card">
      <Link
        href={detailHref}
        className="apartment-media"
        aria-label={`Ver ${apartment.title}`}
      >
        <Image
          src={image.src}
          alt={`${image.alt} (imagen de referencia)`}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
        />
        <span className="apartment-folio" aria-hidden="true">
          {folio}
        </span>
        <span className="apartment-reference">Imagen de referencia</span>
      </Link>

      <div className="apartment-body">
        <h3 className="apartment-title">
          <Link href={detailHref}>{apartment.title}</Link>
        </h3>
        <p className="apartment-description">{apartment.description}</p>

        <ul className="features" aria-label="Características">
          {apartment.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

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
      </div>
    </article>
  );
}
