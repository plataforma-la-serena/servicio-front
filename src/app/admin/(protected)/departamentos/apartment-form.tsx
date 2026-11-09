"use client";

import { useActionState } from "react";
import type { AdminApartment, ActionResult } from "@/types/admin";
import {
  createApartmentAction,
  updateApartmentAction,
} from "./actions";

const INITIAL: ActionResult = { ok: false };

interface ApartmentFormProps {
  apartment?: AdminApartment;
  onSuccess?: () => void;
}

export function ApartmentForm({ apartment, onSuccess }: ApartmentFormProps) {
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

  return (
    <form className="form" action={formAction}>
      <div className="form-grid">
        <div className="form-field">
          <label className="label" htmlFor="af-title">
            Título
          </label>
          <input
            className="input"
            id="af-title"
            name="title"
            defaultValue={apartment?.title}
            required
            minLength={2}
            maxLength={120}
          />
        </div>

        <div className="form-field form-field-small">
          <label className="label" htmlFor="af-price">
            Precio por noche (CLP)
          </label>
          <input
            className="input"
            id="af-price"
            name="pricePerNight"
            type="number"
            min={0}
            step={1000}
            defaultValue={apartment?.pricePerNight}
            required
          />
        </div>

        <div className="form-field form-field-small">
          <label className="label" htmlFor="af-capacity">
            Capacidad
          </label>
          <input
            className="input"
            id="af-capacity"
            name="capacity"
            type="number"
            min={1}
            max={20}
            defaultValue={apartment?.capacity}
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label className="label" htmlFor="af-description">
          Descripción
        </label>
        <textarea
          className="input"
          id="af-description"
          name="description"
          rows={3}
          defaultValue={apartment?.description}
          required
          minLength={10}
          maxLength={2000}
        />
      </div>

      <div className="form-field">
        <label className="label" htmlFor="af-features">
          Características (separadas por coma)
        </label>
        <input
          className="input"
          id="af-features"
          name="features"
          defaultValue={apartment?.features.join(", ")}
        />
      </div>

      <div className="form-field">
        <label className="label" htmlFor="af-images">
          Imágenes (URLs separadas por coma)
        </label>
        <input
          className="input"
          id="af-images"
          name="images"
          type="url"
          defaultValue={apartment?.images.join(", ")}
        />
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
        {pending ? "Guardando…" : apartment ? "Guardar cambios" : "Crear"}
      </button>
    </form>
  );
}
