"use client";

import { useActionState } from "react";
import type { ActionResult, BookingRow } from "@/types/admin";
import { updateBookingAction } from "./actions";
import {
  BookingFields,
  useBookingFields,
  type ApartmentOption,
} from "./booking-fields";

const INITIAL: ActionResult = { ok: false };

interface BookingEditFormProps {
  booking: BookingRow;
  apartments: ApartmentOption[];
  onCancel: () => void;
  onSuccess: () => void;
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

  const fields = useBookingFields({
    apartmentId: booking.apartmentId,
    customerPhone: booking.customerPhone,
    startDate: booking.startDate,
    endDate: booking.endDate,
    status: booking.status,
    notes: booking.notes,
  });

  return (
    <form className="form" action={formAction}>
      <BookingFields
        idPrefix={`be-${booking.id}`}
        apartments={apartments}
        fields={fields}
        defaultApartmentId={booking.apartmentId}
        defaultStatus={booking.status}
        defaultNotes={booking.notes ?? ""}
        showStatus
        seasonNote="Las fechas fuera de temporada no se muestran en el calendario público."
      />

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
          disabled={pending || !fields.canSubmit}
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
