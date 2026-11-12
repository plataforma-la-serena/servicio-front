import type { Metadata } from "next";
import { ApartmentGrid } from "@/components/ApartmentGrid";
import { PageIntro } from "@/components/PageIntro";
import { getApartments } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Departamentos",
  description:
    "Departamentos amoblados en La Serena para la temporada de verano. Consultá disponibilidad por WhatsApp.",
};

export default async function DepartamentosPage() {
  const { apartments, isSample } = await getApartments();

  return (
    <>
      <PageIntro
        eyebrow="Catálogo"
        title="Departamentos"
        lede="Elegí el departamento que se ajuste a tu grupo y coordiná la reserva por WhatsApp."
      />

      <section className="catalog page-section" aria-label="Departamentos">
        <div className="shell">
          <ApartmentGrid apartments={apartments} />

          {isSample && (
            <p className="sample-note">
              Datos de ejemplo. La información real se carga desde la API
              central.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
