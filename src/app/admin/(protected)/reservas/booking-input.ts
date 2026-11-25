import { currentSeason } from "@/lib/availability";
import type { BookingStatus } from "@/types/admin";

const VALID_STATUS: BookingStatus[] = ["PENDING", "CONFIRMED", "CANCELLED"];
const PHONE_DIGITS = /^[0-9]{8,15}$/;

export interface BookingValues {
  apartmentId: string;
  startDate: string;
  endDate: string;
  customerPhone: string;
  notes: string;
  status?: BookingStatus;
}

export type BookingParseResult =
  | { ok: true; value: BookingValues }
  | { ok: false; error: string };

export function digitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export function isBookingPhone(value: string): boolean {
  return PHONE_DIGITS.test(digitsOnly(value));
}

export function isBookingStatus(value: string): value is BookingStatus {
  return (VALID_STATUS as string[]).includes(value);
}

export function isDateRangeValid(
  start: string,
  end: string,
  minDate: string,
  maxDate: string,
): boolean {
  return (
    start !== "" &&
    end !== "" &&
    start < end &&
    start >= minDate &&
    end <= maxDate
  );
}

export function parseBookingInput(
  formData: FormData,
  withStatus = false,
): BookingParseResult {
  const apartmentId = String(formData.get("apartmentId") ?? "");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const customerPhone = digitsOnly(
    String(formData.get("customerPhone") ?? "").trim(),
  );
  const notes = String(formData.get("notes") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "");

  if (!apartmentId || !startDate || !endDate) {
    return { ok: false, error: "Completá departamento y fechas." };
  }
  if (!PHONE_DIGITS.test(customerPhone)) {
    return { ok: false, error: "El teléfono debe tener entre 8 y 15 dígitos." };
  }
  if (startDate >= endDate) {
    return {
      ok: false,
      error: "La fecha de inicio debe ser anterior a la de fin.",
    };
  }

  const season = currentSeason();
  const seasonFrom = season.from.slice(0, 10);
  const seasonTo = season.to.slice(0, 10);

  if (startDate < seasonFrom || endDate > seasonTo) {
    return { ok: false, error: "Las reservas van del 15/12 al 15/03." };
  }

  return {
    ok: true,
    value: {
      apartmentId,
      startDate,
      endDate,
      customerPhone,
      notes,
      status:
        withStatus && isBookingStatus(statusRaw) ? statusRaw : undefined,
    },
  };
}
