"use server";

import { uploadImage } from "@/lib/api/mutations";
import { getSession } from "@/lib/api/session";

const MAX_BYTES = 5 * 1024 * 1024;

export type CropUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

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

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadImage({
    mimeType: "image/jpeg",
    dataBase64: buffer.toString("base64"),
  });

  if (!result.ok) {
    return { ok: false, error: "No se pudo guardar el recorte." };
  }

  return { ok: true, url: result.data.url };
}
