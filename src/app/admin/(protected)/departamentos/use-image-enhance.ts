"use client";

import { useState } from "react";
import type { Area } from "react-easy-crop";
import { enhanceApartmentImage, type CropMeta } from "./crop-actions";

type ReplaceImage = (
  index: number,
  url: string,
  sourceUrl: string,
  cropData: Area | null,
) => void;

function buildEnhanceForm(
  photo: { src: string },
  meta?: CropMeta,
): FormData {
  const formData = new FormData();
  formData.append("src", photo.src);
  formData.append("sourceUrl", meta?.sourceUrl ?? photo.src);
  if (meta?.cropData) {
    formData.append("cropData", JSON.stringify(meta.cropData));
  }
  return formData;
}

export function useImageEnhance(
  sources: Record<string, CropMeta>,
  replaceImage: ReplaceImage,
) {
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);

  async function enhancePhoto(photo: { src: string }, index: number) {
    if (enhancing) {
      return;
    }

    setEnhancing(photo.src);
    setEnhanceError(null);

    try {
      const result = await enhanceApartmentImage(
        buildEnhanceForm(photo, sources[photo.src]),
      );
      if (!result.ok) {
        setEnhanceError(result.error);
        return;
      }
      replaceImage(
        index,
        result.url,
        result.sourceUrl,
        (result.cropData as Area | null) ?? null,
      );
    } finally {
      setEnhancing(null);
    }
  }

  return { enhancing, enhanceError, enhancePhoto };
}
