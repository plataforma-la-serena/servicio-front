import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchApartments } from "@/lib/api/endpoints";
import { ApartmentForm } from "./apartment-form";
import { ApartmentRowAdmin } from "./apartment-row-admin";

export const metadata: Metadata = {
  title: "Departamentos",
  robots: { index: false, follow: false },
};

export default async function AdminApartmentsPage() {
  const result = await fetchApartments();

  if (!result.ok) {
    if (result.status === 401) {
      redirect("/admin/login");
    }
    return (
      <div className="shell admin-section">
        <p className="empty-state">{result.error}</p>
      </div>
    );
  }

  const apartments = result.data;

  return (
    <div className="shell admin-section">
      <div className="section-head">
        <h1 className="section-title">Departamentos</h1>
        <span className="section-meta">
          {String(apartments.length).padStart(2, "0")} en total
        </span>
      </div>

      <section aria-labelledby="create-title" className="admin-block">
        <h2 id="create-title" className="admin-block-title">
          Nuevo departamento
        </h2>
        <ApartmentForm />
      </section>

      <section aria-labelledby="list-title" className="admin-block">
        <h2 id="list-title" className="admin-block-title">
          Inventario
        </h2>
        {apartments.length === 0 ? (
          <p className="empty-state">Todavía no hay departamentos cargados.</p>
        ) : (
          <ul className="admin-list">
            {apartments.map((apartment, index) => (
              <ApartmentRowAdmin
                key={apartment.id}
                apartment={apartment}
                folio={String(index + 1).padStart(2, "0")}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
