"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import type { Area } from "react-easy-crop";
import type { AdminApartment } from "@/types/admin";
import { resolveImageSources, type CropMeta } from "./crop-actions";
import { saveApartmentImages } from "./actions";

export interface ApartmentPhoto {
  src: string;
  local: boolean;
}

export interface EditingImage {
  src: string;
  sourceUrl: string;
  index: number;
  initialPercentages: Area | null;
}

export function useApartmentPhotos(apartment?: AdminApartment) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [urlValue, setUrlValue] = useState(apartment?.images.join(", ") ?? "");
  const [coverIndex, setCoverIndex] = useState(apartment?.coverIndex ?? 0);
  const [sources, setSources] = useState<Record<string, CropMeta>>({});
  const [editingImage, setEditingImage] = useState<EditingImage | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const urls = (apartment?.images ?? []).filter((url) =>
      url.startsWith("/media/"),
    );

    if (urls.length === 0) {
      return;
    }

    let active = true;
    resolveImageSources(urls)
      .then((map) => {
        if (active) {
          setSources((current) => ({ ...current, ...map }));
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [apartment?.id]);

  const parsedImages = urlValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const photos: ApartmentPhoto[] = [
    ...parsedImages.map((src) => ({ src, local: false })),
    ...previews.map((src) => ({ src, local: true })),
  ];
  const safeCover =
    photos.length > 0 ? Math.min(coverIndex, photos.length - 1) : 0;

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function replaceImage(
    index: number,
    url: string,
    sourceUrl: string,
    cropData: Area | null,
  ) {
    const list = [...parsedImages];
    list[index] = url;
    setUrlValue(list.join(", "));
    setSources((current) => ({
      ...current,
      [url]: { sourceUrl, cropData },
    }));
    setEditingImage(null);

    if (apartment) {
      void saveApartmentImages(apartment.id, list, safeCover).then((result) => {
        if (!result.ok) {
          setSaveError(
            result.error ?? "No se pudieron guardar los cambios en las fotos.",
          );
        }
      });
    }
  }

  function editPhoto(photo: { src: string }, index: number) {
    const meta = sources[photo.src];
    const sourceUrl = meta?.sourceUrl ?? photo.src;
    setEditingImage({
      src: sourceUrl,
      sourceUrl,
      index,
      initialPercentages: (meta?.cropData as Area | null) ?? null,
    });
  }

  return {
    urlValue,
    setUrlValue,
    setCoverIndex,
    sources,
    editingImage,
    setEditingImage,
    saveError,
    setSaveError,
    photos,
    safeCover,
    handleFiles,
    replaceImage,
    editPhoto,
  };
}

export type ApartmentPhotosState = ReturnType<typeof useApartmentPhotos>;
