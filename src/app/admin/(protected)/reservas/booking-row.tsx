"use client";

import { useState } from "react";
import { formatPrice, formatShortDate } from "@/lib/format";
import type { BookingRow, BookingStatus } from "@/types/admin";
import { deleteBookingAction } from "./actions";
import { BookingEditForm } from "./booking-edit-form";
import { BookingStatusButtons } from "./booking-form";

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

function bookingTotal(
  start: string,
  end: string,
  pricePerNight: number,
): string {
  const nights = Math.max(
    0,
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000,
    ),
  );
  return formatPrice(nights * pricePerNight);
}

interface BookingRowAdminProps {
  booking: BookingRow;
  apartments: Array<{ id: string; title: string }>;
}

export function BookingRowAdmin({
  booking,
  apartments,
}: BookingRowAdminProps) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="admin-list-row admin-list-row-wrap">
      <span className="admin-list-title">
        {booking.apartment?.title ?? booking.apartmentId}
      </span>
      <span className="admin-list-meta">
        {formatShortDate(booking.startDate)} →{" "}
        {formatShortDate(booking.endDate)}
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
        <button
          className="text-link"
          type="button"
          onClick={() => setEditing((value) => !value)}
          aria-expanded={editing}
        >
          {editing ? "Cerrar" : "Editar"}
        </button>
        <form action={deleteBookingAction}>
          <input type="hidden" name="id" value={booking.id} />
          <button className="text-link text-link-danger" type="submit">
            Eliminar
          </button>
        </form>
      </span>

      {editing && (
        <div className="admin-edit-panel">
          <BookingEditForm
            booking={booking}
            apartments={apartments}
            onCancel={() => setEditing(false)}
            onSuccess={() => setEditing(false)}
          />
        </div>
      )}
    </li>
  );
}
