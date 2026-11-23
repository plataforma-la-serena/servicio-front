"use server";

import { apiFetch } from "@/lib/api/client";
import { uploadImage } from "@/lib/api/mutations";
import { getSession } from "@/lib/api/session";

const MAX_BYTES = 5 * 1024 * 1024;

export interface CropMeta {
  sourceUrl: string;
  cropData: Record<string, number> | null;
}

export type CropUploadResult =
  | { ok: true; url: string; sourceUrl: string; cropData: Record<string, number> | null }
  | { ok: false; error: string };

function parseCropData(raw: FormDataEntryValue | null): Record<string, number> | undefined {
  if (typeof raw !== "string" || !raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, number>;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export async function uploadCroppedImage(
  formData: FormData,
): Promise<CropUploadResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "La sesión expiró. Volvé a iniciar sesión." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No se recibió la imagen recortada." };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, error: "La imagen recortada supera los 5 MB." };
  }

  const sourceUrl = String(formData.get("sourceUrl") ?? "").slice(0, 600);
  const cropData = parseCropData(formData.get("cropData"));
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadImage({
    mimeType: "image/jpeg",
    dataBase64: buffer.toString("base64"),
    sourceUrl: sourceUrl || undefined,
    cropData,
  });

  if (!result.ok) {
    return { ok: false, error: "No se pudo guardar el recorte." };
  }

  return {
    ok: true,
    url: result.data.url,
    sourceUrl,
    cropData: cropData ?? null,
  };
}

export async function resolveImageSources(
  urls: string[],
): Promise<Record<string, CropMeta>> {
  const entries = await Promise.all(
    urls
      .filter((url) => /^\/media\/[a-z0-9-]+$/i.test(url))
      .map(async (url) => {
        const id = url.split("/").pop() ?? "";
        const result = await apiFetch<{
          sourceUrl: string | null;
          cropData: Record<string, number> | null;
        }>(`/media/${id}/source`, { auth: false });

        const data = result.ok ? result.data : null;

        return [
          url,
          {
            sourceUrl: data?.sourceUrl ?? url,
            cropData: data?.cropData ?? null,
          },
        ] as const;
      }),
  );

  return Object.fromEntries(entries);
}
