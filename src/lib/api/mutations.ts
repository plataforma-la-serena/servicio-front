import "server-only";
import { formatPrice } from "@/lib/format";
import type {
  AdminApartment,
  BookingRow,
  BookingStatus,
} from "@/types/admin";
import { apiFetch } from "./client";

export interface ApartmentInput {
  title: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  features: string[];
  images: string[];
  isActive: boolean;
}

export function createApartment(input: ApartmentInput) {
  return apiFetch<AdminApartment>("/apartments", {
    method: "POST",
    body: input,
  });
}

export function updateApartment(id: string, input: Partial<ApartmentInput>) {
  return apiFetch<AdminApartment>(`/apartments/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteApartment(id: string) {
  return apiFetch<{ ok: true }>(`/apartments/${id}`, { method: "DELETE" });
}

export function createBooking(input: {
  apartmentId: string;
  startDate: string;
  endDate: string;
  customerPhone: string;
  notes?: string;
  status?: BookingStatus;
}) {
  return apiFetch<BookingRow>("/bookings", { method: "POST", body: input });
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  return apiFetch<BookingRow>(`/bookings/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteBooking(id: string) {
  return apiFetch<{ ok: true }>(`/bookings/${id}`, { method: "DELETE" });
}

export function formatBookingRange(start: string, end: string): string {
  const nights = Math.max(
    0,
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000,
    ),
  );
  return `${start} → ${end} · ${nights} noches`;
}

export function bookingTotal(
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
