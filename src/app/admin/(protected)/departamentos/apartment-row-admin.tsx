"use client";

import { useState } from "react";
import type { AdminApartment } from "@/types/admin";
import { ApartmentForm } from "./apartment-form";
import { deleteApartmentAction, toggleActiveAction } from "./actions";

interface ApartmentRowAdminProps {
  apartment: AdminApartment;
  folio: string;
}

export function ApartmentRowAdmin({ apartment, folio }: ApartmentRowAdminProps) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="admin-list-row admin-list-row-wrap">
      <span className="admin-folio">{folio}</span>
      <span className="admin-list-title">{apartment.title}</span>
      <span className="admin-list-meta">
        {apartment.capacity} personas
      </span>
      <span className={`status ${apartment.isActive ? "status-CONFIRMED" : "status-muted"}`}>
        {apartment.isActive ? "Publicado" : "Oculto"}
      </span>
      <span className="admin-actions">
        <form action={toggleActiveAction}>
          <input type="hidden" name="id" value={apartment.id} />
          <input
            type="hidden"
            name="isActive"
            value={String(apartment.isActive)}
          />
          <button className="text-link" type="submit">
            {apartment.isActive ? "Ocultar" : "Publicar"}
          </button>
        </form>
        <button
          className="text-link"
          type="button"
          onClick={() => setEditing((value) => !value)}
          aria-expanded={editing}
        >
          {editing ? "Cerrar" : "Editar"}
        </button>
      </span>

      {editing && (
        <div className="admin-edit-panel">
          <ApartmentForm
            apartment={apartment}
            onSuccess={() => setEditing(false)}
          />
          <form action={deleteApartmentAction} className="admin-delete">
            <input type="hidden" name="id" value={apartment.id} />
            <button className="text-link text-link-danger" type="submit">
              Eliminar departamento
            </button>
          </form>
        </div>
      )}
    </li>
  );
}
