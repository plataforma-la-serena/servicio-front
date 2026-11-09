"use client";

import { useActionState } from "react";
import type { ActionResult, BookingStatus } from "@/types/admin";
import { createBookingAction, setBookingStatusAction } from "./actions";

const INITIAL: ActionResult = { ok: false };

interface BookingFormProps {
  apartments: Array<{ id: string; title: string }>;
}

export function BookingForm({ apartments }: BookingFormProps) {
  const [state, formAction, pending] = useActionState(
    createBookingAction,
    INITIAL,
  );

  return (
    <form className="form" action={formAction}>
      <div className="form-grid">
        <div className="form-field">
          <label className="label" htmlFor="bk-apartment">
            Departamento
          </label>
          <select
            className="input"
            id="bk-apartment"
            name="apartmentId"
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
          <label className="label" htmlFor="bk-phone">
            Teléfono del cliente
          </label>
          <input
            className="input"
            id="bk-phone"
            name="customerPhone"
            inputMode="tel"
            pattern="^\+?[0-9]{8,15}$"
            placeholder="56912345678"
            required
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="label" htmlFor="bk-start">
            Inicio
          </label>
          <input
            className="input"
            id="bk-start"
            name="startDate"
            type="date"
            required
          />
        </div>
        <div className="form-field">
          <label className="label" htmlFor="bk-end">
            Fin
          </label>
          <input
            className="input"
            id="bk-end"
            name="endDate"
            type="date"
            required
          />
        </div>
        <div className="form-field">
          <label className="label" htmlFor="bk-notes">
            Notas (opcional)
          </label>
          <input
            className="input"
            id="bk-notes"
            name="notes"
            maxLength={500}
          />
        </div>
      </div>

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}

      <button className="button-dark" type="submit" disabled={pending}>
        {pending ? "Creando…" : "Crear reserva"}
      </button>
    </form>
  );
}

export function BookingStatusButtons({
  id,
  status,
}: {
  id: string;
  status: BookingStatus;
}) {
  return (
    <span className="admin-actions">
      {(["CONFIRMED", "CANCELLED"] as BookingStatus[])
        .filter((next) => next !== status)
        .map((next) => (
          <form key={next} action={setBookingStatusAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="status" value={next} />
            <button className="text-link" type="submit">
              {next === "CONFIRMED" ? "Confirmar" : "Cancelar"}
            </button>
          </form>
        ))}
    </span>
  );
}

