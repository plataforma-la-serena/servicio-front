"use client";

import { useState } from "react";
import { useActionState } from "react";
import { currentSeason } from "@/lib/availability";
import type { ActionResult, BookingRow, BookingStatus } from "@/types/admin";
import { updateBookingAction } from "./actions";

const INITIAL: ActionResult = { ok: false };

const STATUS: Array<{ value: BookingStatus; label: string }> = [
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "CANCELLED", label: "Cancelada" },
];

interface BookingEditFormProps {
  booking: BookingRow;
  apartments: Array<{ id: string; title: string }>;
  onCancel: () => void;
  onSuccess: () => void;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function BookingEditForm({
  booking,
  apartments,
  onCancel,
  onSuccess,
}: BookingEditFormProps) {
  const action = updateBookingAction.bind(null, booking.id);
  const [state, formAction, pending] = useActionState(
    async (prev: ActionResult, formData: FormData) => {
      const result = await action(prev, formData);
      if (result.ok) {
        onSuccess();
      }
      return result;
    },
    INITIAL,
  );

  const season = currentSeason();
  const minDate = season.from.slice(0, 10);
  const maxDate = season.to.slice(0, 10);

  const [phone, setPhone] = useState(booking.customerPhone);
  const [start, setStart] = useState(booking.startDate.slice(0, 10));
  const [end, setEnd] = useState(booking.endDate.slice(0, 10));

  const digits = phone.replace(/\D/g, "");
  const phoneValid = digits.length >= 8 && digits.length <= 15;
  const datesValid =
    start !== "" &&
    end !== "" &&
    start < end &&
    start >= minDate &&
    end <= maxDate;

  return (
    <form className="form" action={formAction}>
      <div className="form-grid">
        <div className="form-field">
          <label className="label" htmlFor={`be-apartment-${booking.id}`}>
            Departamento
          </label>
          <select
            className="input"
            id={`be-apartment-${booking.id}`}
            name="apartmentId"
            defaultValue={booking.apartmentId}
            required
          >
            {apartments.map((apartment) => (
              <option key={apartment.id} value={apartment.id}>
                {apartment.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="label" htmlFor={`be-phone-${booking.id}`}>
            Teléfono del cliente
          </label>
          <input
            className="input"
            id={`be-phone-${booking.id}`}
            name="customerPhone"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            aria-invalid={phone.length > 0 && !phoneValid}
          />
          {phone.length > 0 && !phoneValid && (
            <p className="form-error" role="alert">
              Ingresá entre 8 y 15 dígitos.
            </p>
          )}
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="label" htmlFor={`be-start-${booking.id}`}>
            Inicio
          </label>
          <input
            className="input"
            id={`be-start-${booking.id}`}
            name="startDate"
            type="date"
            min={minDate}
            max={maxDate}
            value={start}
            onChange={(event) => setStart(event.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label className="label" htmlFor={`be-end-${booking.id}`}>
            Fin
          </label>
          <input
            className="input"
            id={`be-end-${booking.id}`}
            name="endDate"
            type="date"
            min={start || minDate}
            max={maxDate}
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label className="label" htmlFor={`be-status-${booking.id}`}>
            Estado
          </label>
          <select
            className="input"
            id={`be-status-${booking.id}`}
            name="status"
            defaultValue={booking.status}
          >
            {STATUS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label className="label" htmlFor={`be-notes-${booking.id}`}>
          Notas (opcional)
        </label>
        <input
          className="input"
          id={`be-notes-${booking.id}`}
          name="notes"
          defaultValue={booking.notes ?? ""}
          maxLength={500}
        />
      </div>

      <p className="form-hint">
        Temporada: {formatDate(minDate)} al {formatDate(maxDate)}. Las fechas
        fuera de temporada no se muestran en el calendario público.
      </p>

      {start !== "" && end !== "" && start >= end && (
        <p className="form-error" role="alert">
          La fecha de fin debe ser posterior a la de inicio.
        </p>
      )}

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}

      <div className="editor-footer-row">
        <button type="button" className="text-link" onClick={onCancel}>
          Cancelar
        </button>
        <button
          className="button-dark"
          type="submit"
          disabled={pending || !phoneValid || !datesValid}
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
