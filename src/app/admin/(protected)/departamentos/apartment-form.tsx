"use client";

import { useActionState } from "react";
import type { ActionResult, AdminApartment } from "@/types/admin";
import { ImageCropper } from "./image-cropper";
import { ApartmentDetails } from "./apartment-details";
import { ApartmentPhotos } from "./apartment-photos";
import { useApartmentPhotos } from "./use-apartment-photos";
import { useImageEnhance } from "./use-image-enhance";
import { createApartmentAction, updateApartmentAction } from "./actions";

const INITIAL: ActionResult = { ok: false };

interface ApartmentFormProps {
  apartment?: AdminApartment;
  onSuccess?: () => void;
}

export function ApartmentForm({ apartment, onSuccess }: ApartmentFormProps) {
  const photosState = useApartmentPhotos(apartment);
  const { enhancing, enhanceError, enhancePhoto } = useImageEnhance(
    photosState.sources,
    photosState.replaceImage,
  );

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

  const { editingImage, setEditingImage, replaceImage } = photosState;

  return (
    <form className="form apartment-editor" action={formAction}>
      <ApartmentDetails apartment={apartment} />

      <ApartmentPhotos
        photos={photosState.photos}
        safeCover={photosState.safeCover}
        urlValue={photosState.urlValue}
        enhancing={enhancing}
        enhanceError={photosState.saveError ?? enhanceError}
        onCover={photosState.setCoverIndex}
        onEdit={photosState.editPhoto}
        onEnhance={enhancePhoto}
        onUrlChange={photosState.setUrlValue}
        onFiles={photosState.handleFiles}
      />

      <div className="editor-footer">
        {state.error && (
          <p className="form-error" role="alert">
            {state.error}
          </p>
        )}

        <div className="editor-footer-row">
          <p className="form-hint">
            Los cambios se publican en el sitio y en el bot al guardar.
          </p>
          <button className="button-dark" type="submit" disabled={pending}>
            {pending
              ? "Guardando…"
              : apartment
                ? "Guardar cambios"
                : "Crear departamento"}
          </button>
        </div>
      </div>

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
