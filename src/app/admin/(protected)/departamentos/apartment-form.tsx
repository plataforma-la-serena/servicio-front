"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent } from "react";
import { useActionState } from "react";
import type { Area } from "react-easy-crop";
import type { AdminApartment, ActionResult } from "@/types/admin";
import { INTERIOR_IMAGES } from "@/lib/reference-images";
import { ImageCropper } from "./image-cropper";
import {
  enhanceApartmentImage,
  resolveImageSources,
  type CropMeta,
} from "./crop-actions";
import {
  createApartmentAction,
  saveApartmentImages,
  updateApartmentAction,
} from "./actions";

const INITIAL: ActionResult = { ok: false };
const AI_UPSCALE_ENABLED = process.env.NEXT_PUBLIC_AI_UPSCALE === "true";

interface ApartmentFormProps {
  apartment?: AdminApartment;
  onSuccess?: () => void;
}

export function ApartmentForm({ apartment, onSuccess }: ApartmentFormProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [urlValue, setUrlValue] = useState(apartment?.images.join(", ") ?? "");
  const [coverIndex, setCoverIndex] = useState(apartment?.coverIndex ?? 0);
  const [sources, setSources] = useState<Record<string, CropMeta>>({});
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<{
    src: string;
    sourceUrl: string;
    index: number;
    initialPercentages: Area | null;
  } | null>(null);

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

  const action = apartment
    ? updateApartmentAction.bind(null, apartment.id)
    : createApartmentAction;

  const [state, formAction, pending] = useActionState(
    async (prev: ActionResult, formData: FormData) => {
      const result = await action(prev, formData);
      if (result.ok) {
        onSuccess?.();
      }
      return result;
    },
    INITIAL,
  );

  const parsedImages = urlValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const photos = [
    ...parsedImages.map((src) => ({ src, local: false })),
    ...previews.map((src) => ({ src, local: true })),
  ];
  const hasPhotos = photos.length > 0;
  const safeCover = hasPhotos ? Math.min(coverIndex, photos.length - 1) : 0;

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
          setEnhanceError(
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

  async function enhancePhoto(photo: { src: string }, index: number) {
    if (enhancing) {
      return;
    }

    const meta = sources[photo.src];
    const formData = new FormData();
    formData.append("src", photo.src);
    formData.append("sourceUrl", meta?.sourceUrl ?? photo.src);
    if (meta?.cropData) {
      formData.append("cropData", JSON.stringify(meta.cropData));
    }

    setEnhancing(photo.src);
    setEnhanceError(null);

    try {
      const result = await enhanceApartmentImage(formData);
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

  return (
    <form className="form apartment-editor" action={formAction}>
      <div className="editor-grid">
        <div className="editor-main">
          <p className="eyebrow">
            {apartment ? "Editar departamento" : "Nuevo departamento"}
          </p>

          <label className="editor-label" htmlFor="af-title">
            Título
          </label>
          <input
            className="editor-title"
            id="af-title"
            name="title"
            defaultValue={apartment?.title}
            placeholder="Departamento 04"
            required
            minLength={2}
            maxLength={120}
          />

          <label className="editor-label" htmlFor="af-description">
            Descripción
          </label>
          <textarea
            className="editor-description"
            id="af-description"
            name="description"
            defaultValue={apartment?.description}
            placeholder="Contá cómo es el departamento, para cuántas personas y qué lo hace cómodo."
            rows={4}
            required
            minLength={10}
            maxLength={2000}
          />

          <label className="editor-label" htmlFor="af-features">
            Características
          </label>
          <input
            className="input"
            id="af-features"
            name="features"
            defaultValue={apartment?.features.join(", ")}
            placeholder="Wi-Fi, Balcón, Cocina equipada"
          />
          <p className="form-hint">
            Separadas por coma. Se muestran como etiquetas en la ficha.
          </p>
        </div>

        <aside className="editor-side" aria-label="Datos y publicación">
          <div className="editor-metrics">
            <div className="editor-metric">
              <label className="metric-label" htmlFor="af-capacity">
                Capacidad
              </label>
              <div className="editor-metric-value">
                <input
                  className="editor-metric-input"
                  id="af-capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  max={20}
                  defaultValue={apartment?.capacity}
                  placeholder="2"
                  required
                />
                <span className="editor-metric-unit">personas</span>
              </div>
            </div>

            <div className="editor-metric">
              <label className="metric-label" htmlFor="af-price">
                Precio por noche
              </label>
              <div className="editor-metric-value">
                <span className="editor-metric-currency">$</span>
                <input
                  className="editor-metric-input"
                  id="af-price"
                  name="pricePerNight"
                  type="number"
                  min={0}
                  step={1000}
                  defaultValue={apartment?.pricePerNight}
                  placeholder="38000"
                  required
                />
                <span className="editor-metric-unit">CLP</span>
              </div>
            </div>
          </div>

          <label className="form-check">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={apartment ? apartment.isActive : true}
            />
            <span>Publicado en el catálogo</span>
          </label>

          {state.error && (
            <p className="form-error" role="alert">
              {state.error}
            </p>
          )}

          <button className="button-dark" type="submit" disabled={pending}>
            {pending
              ? "Guardando…"
              : apartment
                ? "Guardar cambios"
                : "Crear departamento"}
          </button>

          <p className="form-hint">
            Los cambios se publican en el sitio y en el bot al guardar.
          </p>
        </aside>
      </div>

      <section className="editor-photos" aria-labelledby="af-photos-title">
        <div className="section-head">
          <div className="section-head-copy">
            <p className="eyebrow">Fotos</p>
            <h2 id="af-photos-title" className="section-title">
              Galería
            </h2>
          </div>
          <span className="section-meta">
            {hasPhotos ? `${photos.length} fotos` : "Imágenes de referencia"}
          </span>
        </div>

        <div className="editor-photo-grid">
          {photos.map((photo, index) => (
            <div
              className={`editor-photo${safeCover === index ? " is-cover" : ""}`}
              key={`${photo.src}-${index}`}
            >
              {photo.local ? (
                <img className="editor-photo-img" src={photo.src} alt="" />
              ) : (
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 50vw, 260px"
                />
              )}
              {photo.local && (
                <span className="editor-photo-tag">Nueva</span>
              )}
              <button
                type="button"
                className="editor-cover"
                onClick={() => setCoverIndex(index)}
                aria-pressed={safeCover === index}
              >
                {safeCover === index ? "Portada" : "Usar como portada"}
              </button>
              {!photo.local && (
                <button
                  type="button"
                  className="editor-photo-edit"
                  onClick={() => editPhoto(photo, index)}
                >
                  Editar
                </button>
              )}
              {AI_UPSCALE_ENABLED && !photo.local && (
                <button
                  type="button"
                  className="editor-photo-enhance"
                  onClick={() => enhancePhoto(photo, index)}
                  disabled={Boolean(enhancing)}
                >
                  {enhancing === photo.src ? "Mejorando…" : "✦ Mejorar"}
                </button>
              )}
            </div>
          ))}

          {!hasPhotos &&
            INTERIOR_IMAGES.map((image) => (
              <div className="editor-photo" key={image.src}>
                <Image src={image.src} alt="" fill sizes="(max-width: 900px) 50vw, 260px" />
                <span className="editor-photo-tag">Referencia</span>
              </div>
            ))}
        </div>

        <input type="hidden" name="coverIndex" value={safeCover} />

        {!hasPhotos && (
          <p className="form-hint">
            Se usarán estas imágenes de referencia hasta que subas fotos
            propias.
          </p>
        )}

        {hasPhotos && (
          <p className="form-hint">
            Tocá “Usar como portada” en la foto que querés mostrar en el
            catálogo. La portada también es la primera foto que envía el bot.
          </p>
        )}

        {enhanceError && (
          <p className="form-error" role="alert">
            {enhanceError}
          </p>
        )}

        <div className="editor-upload-row">
          <div className="form-field">
            <label className="label" htmlFor="af-image-files">
              Subir fotos
            </label>
            <input
              className="input"
              id="af-image-files"
              name="imageFiles"
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleFiles}
            />
            <p className="form-hint">
              JPG o PNG, hasta 5 MB cada una. Se agregan al guardar.
            </p>
          </div>

          <div className="form-field">
            <label className="label" htmlFor="af-images">
              Imágenes por URL (opcional)
            </label>
            <input
              className="input"
              id="af-images"
              name="images"
              type="text"
              inputMode="url"
              placeholder="https://ejemplo.com/living.jpg"
              value={urlValue}
              onChange={(event) => setUrlValue(event.target.value)}
            />
            <p className="form-hint">
              Enlaces directos, separados por coma. Si no tenés, dejalo vacío.
            </p>
          </div>
        </div>
      </section>

      {editingImage && (
        <ImageCropper
          src={editingImage.src}
          sourceUrl={editingImage.sourceUrl}
          initialPercentages={editingImage.initialPercentages}
          onCancel={() => setEditingImage(null)}
          onSaved={(url, sourceUrl, cropData) =>
            replaceImage(editingImage.index, url, sourceUrl, cropData)
          }
        />
      )}
    </form>
  );
}
