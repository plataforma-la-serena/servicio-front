"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types/admin";
import {
  createApartment,
  deleteApartment,
  updateApartment,
  type ApartmentInput,
} from "@/lib/api/mutations";
import { getSession } from "@/lib/api/session";

function splitList(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readInput(formData: FormData): ApartmentInput | null {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const pricePerNight = Number(formData.get("pricePerNight"));
  const capacity = Number(formData.get("capacity"));

  if (
    title.length < 2 ||
    description.length < 10 ||
    !Number.isInteger(pricePerNight) ||
    pricePerNight < 0 ||
    !Number.isInteger(capacity) ||
    capacity < 1
  ) {
    return null;
  }

  return {
    title,
    description,
    pricePerNight,
    capacity,
    features: splitList(formData.get("features")),
    images: splitList(formData.get("images")),
    isActive: formData.get("isActive") === "on",
  };
}

function fail(error: string): ActionResult {
  return { ok: false, error };
}

function refresh(): void {
  revalidatePath("/admin/departamentos");
  revalidatePath("/");
}

export async function createApartmentAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const input = readInput(formData);
  if (!input) {
    return fail("Revisá los campos: título, descripción, precio y capacidad.");
  }

  const result = await createApartment(input);
  if (!result.ok) {
    return fail("No se pudo crear el departamento.");
  }

  refresh();
  return { ok: true };
}

export async function updateApartmentAction(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const input = readInput(formData);
  if (!input) {
    return fail("Revisá los campos: título, descripción, precio y capacidad.");
  }

  const result = await updateApartment(id, input);
  if (!result.ok) {
    return fail("No se pudo actualizar el departamento.");
  }

  refresh();
  return { ok: true };
}

export async function deleteApartmentAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteApartment(id);
  }

  refresh();
  redirect("/admin/departamentos");
}

export async function toggleActiveAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "true";

  if (id) {
    await updateApartment(id, { isActive: !isActive });
  }

  refresh();
}
