import type { ApartmentInput } from "@/lib/api/mutations";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

function splitList(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isTextValid(title: string, description: string): boolean {
  return title.length >= 2 && description.length >= 10;
}

function isMetricValid(pricePerNight: number, capacity: number): boolean {
  return (
    Number.isInteger(pricePerNight) &&
    pricePerNight >= 0 &&
    Number.isInteger(capacity) &&
    capacity >= 1
  );
}

export function readApartmentInput(formData: FormData): ApartmentInput | null {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const pricePerNight = Number(formData.get("pricePerNight"));
  const capacity = Number(formData.get("capacity"));
  const coverIndex = Number(formData.get("coverIndex") ?? 0);

  if (!isTextValid(title, description)) {
    return null;
  }
  if (!isMetricValid(pricePerNight, capacity)) {
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

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Las fotos deben ser JPG o PNG.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Cada foto debe pesar menos de 5 MB.";
  }
  return null;
}
