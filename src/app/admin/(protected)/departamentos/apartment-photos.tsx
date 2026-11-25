"use client";

import Image from "next/image";
import type { ChangeEvent } from "react";
import type { ApartmentPhoto } from "./use-apartment-photos";

const AI_UPSCALE_ENABLED = process.env.NEXT_PUBLIC_AI_UPSCALE === "true";

interface ApartmentPhotosProps {
  photos: ApartmentPhoto[];
  safeCover: number;
  urlValue: string;
  enhancing: string | null;
  enhanceError: string | null;
  onCover: (index: number) => void;
  onEdit: (photo: ApartmentPhoto, index: number) => void;
  onEnhance: (photo: ApartmentPhoto, index: number) => void;
  onUrlChange: (value: string) => void;
  onFiles: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ApartmentPhotos({
  photos,
  safeCover,
  urlValue,
  enhancing,
  enhanceError,
  onCover,
  onEdit,
  onEnhance,
  onUrlChange,
  onFiles,
}: ApartmentPhotosProps) {
  const hasPhotos = photos.length > 0;

  return (
    <section className="editor-photos" aria-labelledby="af-photos-title">
      <div className="section-head">
        <div className="section-head-copy">
          <p className="eyebrow">Fotos</p>
          <h2 id="af-photos-title" className="section-title">
            Galería
          </h2>
        </div>
        <span className="section-meta">
          {hasPhotos ? `${photos.length} fotos` : "Sin fotos"}
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
            {photo.local && <span className="editor-photo-tag">Nueva</span>}
            <button
              type="button"
              className="editor-cover"
              onClick={() => onCover(index)}
              aria-pressed={safeCover === index}
            >
              {safeCover === index ? "Portada" : "Usar como portada"}
            </button>
            {!photo.local && (
              <button
                type="button"
                className="editor-photo-edit"
                onClick={() => onEdit(photo, index)}
              >
                Editar
              </button>
            )}
            {AI_UPSCALE_ENABLED && !photo.local && (
              <button
                type="button"
                className="editor-photo-enhance"
                onClick={() => onEnhance(photo, index)}
                disabled={Boolean(enhancing)}
              >
                {enhancing === photo.src ? "Mejorando…" : "✦ Mejorar"}
              </button>
            )}
          </div>
        ))}
      </div>

      <input type="hidden" name="coverIndex" value={safeCover} />

      {!hasPhotos && (
        <p className="form-hint">
          Todavía no hay fotos. Subí una o pegá una URL.
        </p>
      )}

      {hasPhotos && (
        <p className="form-hint">
          Tocá “Usar como portada” en la foto que querés mostrar en el catálogo.
          La portada también es la primera foto que envía el bot.
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
            onChange={onFiles}
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
            onChange={(event) => onUrlChange(event.target.value)}
          />
          <p className="form-hint">
            Enlaces directos, separados por coma. Si no tenés, dejalo vacío.
          </p>
        </div>
      </div>
    </section>
  );
}
