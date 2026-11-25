"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types/admin";
import {
  createApartment,
  deleteApartment,
  updateApartment,
  uploadImage,
  type ApartmentInput,
} from "@/lib/api/mutations";
import { getSession } from "@/lib/api/session";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

type UploadResult =
  | { ok: true; urls: string[] }
  | { ok: false; error: string };

async function uploadImages(formData: FormData): Promise<UploadResult> {
  const files = formData
    .getAll("imageFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const urls: string[] = [];

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { ok: false, error: "Las fotos deben ser JPG o PNG." };
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return { ok: false, error: "Cada foto debe pesar menos de 5 MB." };
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
  const coverIndex = Number(formData.get("coverIndex") ?? 0);

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
    coverIndex:
      Number.isInteger(coverIndex) && coverIndex >= 0 ? coverIndex : 0,
    isActive: formData.get("isActive") === "on",
  };
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

  const input = readInput(formData);
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

  const input = readInput(formData);
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
