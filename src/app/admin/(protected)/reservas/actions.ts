"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/api/session";
import {
  createBooking,
  deleteBooking,
  updateBooking,
  updateBookingStatus,
} from "@/lib/api/mutations";
import type { ActionResult } from "@/types/admin";
import { isBookingStatus, parseBookingInput } from "./booking-input";

function fail(error: string): ActionResult {
  return { ok: false, error };
}

function refresh(): void {
  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
  // La disponibilidad pública también depende de las reservas.
  revalidatePath("/", "layout");
}

async function requireSession(): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
}

function bookingError(
  status: number,
  action: "crear" | "actualizar",
): ActionResult {
  return fail(
    status === 409
      ? "El departamento no está disponible en esas fechas."
      : `No se pudo ${action} la reserva.`,
  );
}

export async function createBookingAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();

  const parsed = parseBookingInput(formData);
  if (!parsed.ok) {
    return fail(parsed.error);
  }

  const { apartmentId, startDate, endDate, customerPhone, notes } =
    parsed.value;
  const result = await createBooking({
    apartmentId,
    startDate,
    endDate,
    customerPhone,
    notes: notes || undefined,
  });

  if (!result.ok) {
    return bookingError(result.status, "crear");
  }

  refresh();
  return { ok: true };
}

export async function setBookingStatusAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (id && isBookingStatus(status)) {
    await updateBookingStatus(id, status);
  }

  refresh();
}

export async function deleteBookingAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteBooking(id);
  }

  refresh();
}

export async function updateBookingAction(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();

  const parsed = parseBookingInput(formData, true);
  if (!parsed.ok) {
    return fail(parsed.error);
  }

  const { apartmentId, startDate, endDate, customerPhone, notes, status } =
    parsed.value;
  const result = await updateBooking(id, {
    apartmentId,
    startDate,
    endDate,
    customerPhone,
    notes,
    status,
  });

  if (!result.ok) {
    return bookingError(result.status, "actualizar");
  }

  refresh();
  return { ok: true };
}
