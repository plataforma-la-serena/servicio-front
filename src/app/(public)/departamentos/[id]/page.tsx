import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApartmentGallery } from "@/components/ApartmentGallery";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { ReserveButton } from "@/components/ReserveButton";
import { getApartmentById, getApartments } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { SEASON_LABEL } from "@/lib/season";

interface ApartmentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { apartments } = await getApartments();
  return apartments.map((apartment) => ({ id: apartment.id }));
}

export async function generateMetadata({
  params,
}: ApartmentPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getApartmentById(id);

  if (!result) {
    return { title: "Departamento no encontrado" };
  }

  return {
    title: result.apartment.title,
    description: result.apartment.description,
  };
}

export default async function ApartmentPage({ params }: ApartmentPageProps) {
  const { id } = await params;
  const result = await getApartmentById(id);

  if (!result) {
    notFound();
  }

  const { apartment, isSample } = result;

  return (
    <section className="detail" aria-labelledby="detail-title">
      <div className="shell">
        <nav className="breadcrumb" aria-label="Migas de pan">
          <Link href="/departamentos">Departamentos</Link>
          <span aria-hidden="true">/</span>
          <span>{apartment.title}</span>
        </nav>

        <div className="detail-grid">
          <div className="detail-main">
            <p className="eyebrow">Temporada {SEASON_LABEL}</p>
            <h1 id="detail-title" className="detail-title">
              {apartment.title}
            </h1>
            <p className="detail-description">{apartment.description}</p>

            <ul className="detail-features" aria-label="Características">
              {apartment.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <aside className="detail-panel" aria-label="Datos de la reserva">
            <div className="detail-metrics">
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

            <dl className="fact-list">
              <div className="fact">
                <dt className="metric-label">Temporada</dt>
                <dd className="fact-value">{SEASON_LABEL}</dd>
              </div>
              <div className="fact">
                <dt className="metric-label">Ubicación</dt>
                <dd className="fact-value">La Serena, Chile</dd>
              </div>
            </dl>

            <ReserveButton
              label="Reservar por WhatsApp"
              message={`Hola, quiero reservar ${apartment.title} en La Serena.`}
            />

            <p className="detail-note">
              La disponibilidad se confirma por WhatsApp.
            </p>
          </aside>
        </div>

        <ApartmentGallery />

        <AvailabilityCalendar apartmentId={apartment.id} />

        <Link href="/" className="back-link">
          Volver a los departamentos
        </Link>

        {isSample && (
          <p className="sample-note">
            Datos de ejemplo. La información real se carga desde la API central.
          </p>
        )}
      </div>
    </section>
  );
}
