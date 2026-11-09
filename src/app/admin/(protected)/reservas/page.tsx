import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { bookingTotal } from "@/lib/api/mutations";
import { fetchApartments, fetchBookings } from "@/lib/api/endpoints";
import { formatPrice } from "@/lib/format";
import type { BookingStatus } from "@/types/admin";
import { BookingForm, BookingStatusButtons } from "./booking-form";
import { deleteBookingAction } from "./actions";

export const metadata: Metadata = {
  title: "Reservas",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

export default async function AdminBookingsPage() {
  const [bookingsResult, apartmentsResult] = await Promise.all([
    fetchBookings(),
    fetchApartments(),
  ]);

  if (!bookingsResult.ok) {
    if (bookingsResult.status === 401) {
      redirect("/admin/login");
    }
    return (
      <div className="shell admin-section">
        <p className="empty-state">{bookingsResult.error}</p>
      </div>
    );
  }

  const bookings = bookingsResult.data;
  const apartments = apartmentsResult.ok ? apartmentsResult.data : [];

  return (
    <div className="shell admin-section">
      <div className="section-head">
        <h1 className="section-title">Reservas</h1>
        <span className="section-meta">
          {String(bookings.length).padStart(2, "0")} registradas
        </span>
      </div>

      <section aria-labelledby="new-booking-title" className="admin-block">
        <h2 id="new-booking-title" className="admin-block-title">
          Nueva reserva
        </h2>
        {apartments.length === 0 ? (
          <p className="empty-state">
            Cargá un departamento antes de crear reservas.
          </p>
        ) : (
          <BookingForm
            apartments={apartments.map((item) => ({
              id: item.id,
              title: item.title,
            }))}
          />
        )}
      </section>

      <section aria-labelledby="bookings-list-title" className="admin-block">
        <h2 id="bookings-list-title" className="admin-block-title">
          Todas las reservas
        </h2>

        {bookings.length === 0 ? (
          <p className="empty-state">No hay reservas registradas.</p>
        ) : (
          <ul className="admin-list">
            {bookings.map((booking) => (
              <li key={booking.id} className="admin-list-row admin-list-row-wrap">
                <span className="admin-list-title">
                  {booking.apartment?.title ?? booking.apartmentId}
                </span>
                <span className="admin-list-meta">
                  {booking.startDate} → {booking.endDate}
                </span>
                <span className="admin-list-meta">{booking.customerPhone}</span>
                <span className="admin-list-meta">
                  {booking.apartment
                    ? bookingTotal(
                        booking.startDate,
                        booking.endDate,
                        booking.apartment.pricePerNight,
                      )
                    : formatPrice(0)}
                </span>
                <span className={`status status-${booking.status}`}>
                  {STATUS_LABEL[booking.status]}
                </span>
                <span className="admin-actions">
                  <BookingStatusButtons id={booking.id} status={booking.status} />
                  <form action={deleteBookingAction}>
                    <input type="hidden" name="id" value={booking.id} />
                    <button className="text-link text-link-danger" type="submit">
                      Eliminar
                    </button>
                  </form>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
