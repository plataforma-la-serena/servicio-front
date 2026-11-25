"use client";

import { useState } from "react";
import { currentSeason } from "@/lib/availability";
import type { BookingStatus } from "@/types/admin";
import {
  isBookingPhone,
  isDateRangeValid,
} from "./booking-input";

export interface ApartmentOption {
  id: string;
  title: string;
}

export interface BookingSeed {
  apartmentId?: string;
  customerPhone?: string;
  startDate?: string;
  endDate?: string;
  status?: BookingStatus;
  notes?: string | null;
}

const STATUS_OPTIONS: Array<{ value: BookingStatus; label: string }> = [
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "CANCELLED", label: "Cancelada" },
];

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function useBookingFields(seed: BookingSeed = {}) {
  const season = currentSeason();
  const minDate = season.from.slice(0, 10);
  const maxDate = season.to.slice(0, 10);

  const [phone, setPhone] = useState(seed.customerPhone ?? "");
  const [start, setStart] = useState(seed.startDate?.slice(0, 10) ?? "");
  const [end, setEnd] = useState(seed.endDate?.slice(0, 10) ?? "");

  const phoneValid = isBookingPhone(phone);
  const datesValid = isDateRangeValid(start, end, minDate, maxDate);

  return {
    minDate,
    maxDate,
    phone,
    setPhone,
    start,
    setStart,
    end,
    setEnd,
    phoneValid,
    phoneError: phone.length > 0 && !phoneValid,
    datesError: start !== "" && end !== "" && start >= end,
    canSubmit: phoneValid && datesValid,
  };
}

export type BookingFieldsState = ReturnType<typeof useBookingFields>;

interface BookingFieldsProps {
  idPrefix: string;
  apartments: ApartmentOption[];
  fields: BookingFieldsState;
  defaultApartmentId?: string;
  defaultStatus?: BookingStatus;
  defaultNotes?: string;
  showStatus?: boolean;
  showPhoneHint?: boolean;
  seasonNote?: string;
}

export function BookingFields({
  idPrefix,
  apartments,
  fields,
  defaultApartmentId,
  defaultStatus = "PENDING",
  defaultNotes = "",
  showStatus = false,
  showPhoneHint = false,
  seasonNote,
}: BookingFieldsProps) {
  const { minDate, maxDate, phone, setPhone, start, setStart, end, setEnd } =
    fields;
  const notesField = (
    <div className="form-field">
      <label className="label" htmlFor={`${idPrefix}-notes`}>
        Notas (opcional)
      </label>
      <input
        className="input"
        id={`${idPrefix}-notes`}
        name="notes"
        defaultValue={defaultNotes}
        maxLength={500}
      />
    </div>
  );

  return (
    <>
      <div className="form-grid">
        <div className="form-field">
          <label className="label" htmlFor={`${idPrefix}-apartment`}>
            Departamento
          </label>
          <select
            className="input"
            id={`${idPrefix}-apartment`}
            name="apartmentId"
            defaultValue={defaultApartmentId}
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
          <label className="label" htmlFor={`${idPrefix}-phone`}>
            Teléfono del cliente
          </label>
          <input
            className="input"
            id={`${idPrefix}-phone`}
            name="customerPhone"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={showPhoneHint ? "+54 9 261 336 8554" : undefined}
            required
            aria-invalid={fields.phoneError}
          />
          {fields.phoneError ? (
            <p className="form-error" role="alert">
              Ingresá entre 8 y 15 dígitos.
            </p>
          ) : (
            showPhoneHint && (
              <p className="form-hint">
                Puede incluir +, espacios o guiones. Se guardan solo los
                números.
              </p>
            )
          )}
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="label" htmlFor={`${idPrefix}-start`}>
            Inicio
          </label>
          <input
            className="input"
            id={`${idPrefix}-start`}
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
          <label className="label" htmlFor={`${idPrefix}-end`}>
            Fin
          </label>
          <input
            className="input"
            id={`${idPrefix}-end`}
            name="endDate"
            type="date"
            min={start || minDate}
            max={maxDate}
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            required
          />
        </div>
        {showStatus ? (
          <div className="form-field">
            <label className="label" htmlFor={`${idPrefix}-status`}>
              Estado
            </label>
            <select
              className="input"
              id={`${idPrefix}-status`}
              name="status"
              defaultValue={defaultStatus}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          notesField
        )}
      </div>

      {showStatus && notesField}

      <p className="form-hint">
        Temporada: {formatDate(minDate)} al {formatDate(maxDate)}.
        {seasonNote ? ` ${seasonNote}` : ""}
      </p>

      {fields.datesError && (
        <p className="form-error" role="alert">
          La fecha de fin debe ser posterior a la de inicio.
        </p>
      )}
    </>
  );
}
