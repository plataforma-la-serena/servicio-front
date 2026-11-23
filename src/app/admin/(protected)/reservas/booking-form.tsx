"use client";

import { useState } from "react";
import { useActionState } from "react";
import { currentSeason } from "@/lib/availability";
import type { ActionResult, BookingStatus } from "@/types/admin";
import { createBookingAction, setBookingStatusAction } from "./actions";

const INITIAL: ActionResult = { ok: false };

interface BookingFormProps {
  apartments: Array<{ id: string; title: string }>;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function BookingForm({ apartments }: BookingFormProps) {
  const [state, formAction, pending] = useActionState(
    createBookingAction,
    INITIAL,
  );

  const season = currentSeason();
  const minDate = season.from.slice(0, 10);
  const maxDate = season.to.slice(0, 10);

  const [phone, setPhone] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const digits = phone.replace(/\D/g, "");
  const phoneValid = digits.length >= 8 && digits.length <= 15;
  const datesValid =
    start !== "" &&
    end !== "" &&
    start < end &&
    start >= minDate &&
    end <= maxDate;
  const phoneError = phone.length > 0 && !phoneValid;
  const datesError = start !== "" && end !== "" && start >= end;
  const canSubmit = phoneValid && datesValid;

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
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+54 9 261 336 8554"
            required
            aria-invalid={phoneError}
          />
          {phoneError ? (
            <p className="form-error" role="alert">
              Ingresá entre 8 y 15 dígitos.
            </p>
          ) : (
            <p className="form-hint">
              Puede incluir +, espacios o guiones. Se guardan solo los números.
            </p>
          )}
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
            min={minDate}
            max={maxDate}
            value={start}
            onChange={(event) => setStart(event.target.value)}
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
            min={start || minDate}
            max={maxDate}
            value={end}
            onChange={(event) => setEnd(event.target.value)}
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

      <p className="form-hint">
        Temporada: {formatDate(minDate)} al {formatDate(maxDate)}.
      </p>

      {datesError && (
        <p className="form-error" role="alert">
          La fecha de fin debe ser posterior a la de inicio.
        </p>
      )}

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}

      {state.ok && (
        <p className="form-success" role="status">
          Reserva creada. Ya figura en la lista y en la disponibilidad.
        </p>
      )}

      <button
        className="button-dark"
        type="submit"
        disabled={pending || !canSubmit}
      >
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
  const actions: Array<{ status: BookingStatus; label: string }> =
    status === "CONFIRMED"
      ? [
          { status: "PENDING", label: "Desconfirmar" },
          { status: "CANCELLED", label: "Cancelar" },
        ]
      : status === "PENDING"
        ? [
            { status: "CONFIRMED", label: "Confirmar" },
            { status: "CANCELLED", label: "Cancelar" },
          ]
        : [{ status: "CONFIRMED", label: "Confirmar" }];

  return (
    <span className="admin-actions">
      {actions.map((action) => (
        <form key={action.status} action={setBookingStatusAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={action.status} />
          <button className="text-link" type="submit">
            {action.label}
          </button>
        </form>
      ))}
    </span>
  );
}
