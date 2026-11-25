"use client";

import type { AdminApartment } from "@/types/admin";

interface ApartmentDetailsProps {
  apartment?: AdminApartment;
}

export function ApartmentDetails({ apartment }: ApartmentDetailsProps) {
  return (
    <>
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
        </aside>
      </div>
    </>
  );
}
