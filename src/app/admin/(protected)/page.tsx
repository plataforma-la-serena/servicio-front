import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchMetrics } from "@/lib/api/endpoints";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Resumen",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

export default async function AdminSummaryPage() {
  const result = await fetchMetrics();

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

  const data = result.data;

  return (
    <div className="shell admin-section">
      <div className="section-head">
        <h1 className="section-title">Resumen</h1>
        <span className="section-meta">Temporada 15.12 — 15.03</span>
      </div>

      <dl className="metrics-grid">
        <div className="metric-card">
          <dt className="metric-label">Departamentos activos</dt>
          <dd className="metric-value">{data.apartmentsActive}</dd>
        </div>
        <div className="metric-card">
          <dt className="metric-label">Reservas pendientes</dt>
          <dd className="metric-value">{data.bookingsPending}</dd>
        </div>
        <div className="metric-card">
          <dt className="metric-label">Reservas confirmadas</dt>
          <dd className="metric-value">{data.bookingsConfirmed}</dd>
        </div>
        <div className="metric-card">
          <dt className="metric-label">Ingreso confirmado</dt>
          <dd className="metric-value metric-value-price">
            {formatPrice(data.confirmedRevenue)}
          </dd>
        </div>
        <div className="metric-card">
          <dt className="metric-label">Conversaciones</dt>
          <dd className="metric-value">{data.sessionsTotal}</dd>
        </div>
        <div className="metric-card">
          <dt className="metric-label">Chats con bot pausado</dt>
          <dd className="metric-value">{data.sessionsPaused}</dd>
        </div>
      </dl>

      <section aria-labelledby="upcoming-title">
        <div className="section-head">
          <h2 id="upcoming-title" className="section-title">
            Próximas reservas
          </h2>
          <Link href="/admin/reservas" className="text-link">
            Ver todas
          </Link>
        </div>

        {data.upcoming.length === 0 ? (
          <p className="empty-state">No hay reservas próximas.</p>
        ) : (
          <ul className="admin-list">
            {data.upcoming.map((booking) => (
              <li key={booking.id} className="admin-list-row">
                <span className="admin-list-title">
                  {booking.apartment.title}
                </span>
                <span className="admin-list-meta">
                  {booking.startDate} → {booking.endDate}
                </span>
                <span className="admin-list-meta">{booking.customerPhone}</span>
                <span className={`status status-${booking.status}`}>
                  {STATUS_LABEL[booking.status] ?? booking.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
