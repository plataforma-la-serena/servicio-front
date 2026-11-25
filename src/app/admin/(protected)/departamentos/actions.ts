"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types/admin";
import {
  createApartment,
  deleteApartment,
  updateApartment,
  uploadImage,
} from "@/lib/api/mutations";
import { getSession } from "@/lib/api/session";
import { readApartmentInput, validateImageFile } from "./apartment-input";

type UploadResult =
  | { ok: true; urls: string[] }
  | { ok: false; error: string };

async function uploadImages(formData: FormData): Promise<UploadResult> {
  const files = formData
    .getAll("imageFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const urls: string[] = [];

  for (const file of files) {
    const invalid = validateImageFile(file);
    if (invalid) {
      return { ok: false, error: invalid };
    }

    const data = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage({
      mimeType: file.type,
      dataBase64: data.toString("base64"),
    });

    if (!result.ok) {
      return { ok: false, error: "No se pudieron subir las fotos." };
    }

    urls.push(result.data.url);
  }

  return { ok: true, urls };
}

function fail(error: string): ActionResult {
  return { ok: false, error };
}

function refresh(): void {
  revalidatePath("/admin/departamentos");
  // Invalida el sitio público completo: portada, catálogo y fichas.
  revalidatePath("/", "layout");
}

export async function createApartmentAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const input = readApartmentInput(formData);
  if (!input) {
    return fail("Revisá los campos: título, descripción, precio y capacidad.");
  }

  const uploaded = await uploadImages(formData);
  if (!uploaded.ok) {
    return fail(uploaded.error);
  }

  input.images = [...input.images, ...uploaded.urls];

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

  const input = readApartmentInput(formData);
  if (!input) {
    return fail("Revisá los campos: título, descripción, precio y capacidad.");
  }

  const uploaded = await uploadImages(formData);
  if (!uploaded.ok) {
    return fail(uploaded.error);
  }

  input.images = [...input.images, ...uploaded.urls];

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

export async function saveApartmentImages(
  id: string,
  images: string[],
  coverIndex: number,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "La sesión expiró. Volvé a iniciar sesión." };
  }

  const result = await updateApartment(id, { images, coverIndex });
  if (!result.ok) {
    return { ok: false, error: "No se pudieron guardar las fotos." };
  }

  refresh();
  return { ok: true };
}
