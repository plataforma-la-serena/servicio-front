import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchApartments, fetchBookings } from "@/lib/api/endpoints";
import { BookingForm } from "./booking-form";
import { BookingRowAdmin } from "./booking-row";

export const metadata: Metadata = {
  title: "Reservas",
  robots: { index: false, follow: false },
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

      <p className="section-lede">
        Las reservas bloquean las fechas en la disponibilidad pública de cada
        departamento y actualizan los contadores del resumen. Son internas: no
        aparecen en el menú del sitio.
      </p>

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
              <BookingRowAdmin
                key={booking.id}
                booking={booking}
                apartments={apartments.map((item) => ({
                  id: item.id,
                  title: item.title,
                }))}
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="bookings-help-title" className="admin-help">
        <h2 id="bookings-help-title" className="admin-block-title">
          Qué hace cada opción
        </h2>
        <dl className="admin-help-list">
          <div>
            <dt>Confirmar</dt>
            <dd>
              Pasa la reserva a confirmada. Bloquea las fechas y suma al
              “Ingreso confirmado” del resumen.
            </dd>
          </div>
          <div>
            <dt>Desconfirmar</dt>
            <dd>
              Vuelve la reserva a pendiente. Las fechas siguen bloqueadas y deja
              de sumar al ingreso confirmado.
            </dd>
          </div>
          <div>
            <dt>Cancelar</dt>
            <dd>
              Libera las fechas en el calendario y deja la reserva como
              cancelada.
            </dd>
          </div>
          <div>
            <dt>Editar</dt>
            <dd>
              Cambia departamento, fechas, teléfono, estado y notas. Verifica
              que no se superponga con otra reserva.
            </dd>
          </div>
          <div>
            <dt>Eliminar</dt>
            <dd>Borra la reserva definitivamente. No se puede deshacer.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
