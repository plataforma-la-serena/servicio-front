"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/api/session";
import {
  createBooking,
  deleteBooking,
  updateBookingStatus,
} from "@/lib/api/mutations";
import type { ActionResult, BookingStatus } from "@/types/admin";

const VALID_STATUS: BookingStatus[] = ["PENDING", "CONFIRMED", "CANCELLED"];

function fail(error: string): ActionResult {
  return { ok: false, error };
}

function refresh(): void {
  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
}

function isStatus(value: string): value is BookingStatus {
  return (VALID_STATUS as string[]).includes(value);
}

export async function createBookingAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const apartmentId = String(formData.get("apartmentId") ?? "");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const customerPhone = String(formData.get("customerPhone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!apartmentId || !startDate || !endDate) {
    return fail("Completá departamento y fechas.");
  }
  if (!/^\+?[0-9]{8,15}$/.test(customerPhone)) {
    return fail("El teléfono debe tener entre 8 y 15 dígitos.");
  }
  if (startDate >= endDate) {
    return fail("La fecha de inicio debe ser anterior a la de fin.");
  }

  const result = await createBooking({
    apartmentId,
    startDate,
    endDate,
    customerPhone,
    notes: notes || undefined,
  });

  if (!result.ok) {
    return fail(
      result.status === 409
        ? "El departamento no está disponible en esas fechas."
        : "No se pudo crear la reserva.",
    );
  }

  refresh();
  return { ok: true };
}

export async function setBookingStatusAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (id && isStatus(status)) {
    await updateBookingStatus(id, status);
  }

  refresh();
}

export async function deleteBookingAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteBooking(id);
  }

  refresh();
}
