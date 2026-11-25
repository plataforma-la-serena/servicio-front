"use client";

import { useActionState } from "react";
import type { ActionResult, BookingStatus } from "@/types/admin";
import { createBookingAction, setBookingStatusAction } from "./actions";
import {
  BookingFields,
  useBookingFields,
  type ApartmentOption,
} from "./booking-fields";

const INITIAL: ActionResult = { ok: false };

interface BookingFormProps {
  apartments: ApartmentOption[];
}

export function BookingForm({ apartments }: BookingFormProps) {
  const [state, formAction, pending] = useActionState(
    createBookingAction,
    INITIAL,
  );
  const fields = useBookingFields();

  return (
    <form className="form" action={formAction}>
      <BookingFields
        idPrefix="bk"
        apartments={apartments}
        fields={fields}
        showPhoneHint
      />

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
        disabled={pending || !fields.canSubmit}
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
