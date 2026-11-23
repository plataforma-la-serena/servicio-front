"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { cropToJpeg } from "@/lib/crop-image";
import { uploadCroppedImage } from "./crop-actions";

interface ImageCropperProps {
  src: string;
  sourceUrl: string;
  onCancel: () => void;
  onSaved: (url: string, sourceUrl: string) => void;
}

export function ImageCropper({
  src,
  sourceUrl,
  onCancel,
  onSaved,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setArea(pixels);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  async function save() {
    if (!area) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const blob = await cropToJpeg(src, area);
      const formData = new FormData();
      formData.append("file", new File([blob], "recorte.jpg", { type: "image/jpeg" }));
      formData.append("sourceUrl", sourceUrl);
      const result = await uploadCroppedImage(formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onSaved(result.url, result.sourceUrl);
    } catch {
      setError(
        "No se pudo recortar esta imagen. Si es un enlace externo, probá subirla de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="crop-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Recortar foto"
    >
      <div className="crop-panel">
        <div className="crop-head">
          <h2 className="crop-title">Recortar foto</h2>
          <button type="button" className="text-link" onClick={onCancel}>
            Cerrar
          </button>
        </div>

        <div className="crop-area">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
          />
        </div>

        <label className="crop-zoom">
          <span>Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="crop-actions">
          <button type="button" className="text-link" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="button-dark"
            onClick={save}
            disabled={saving || !area}
          >
            {saving ? "Guardando…" : "Guardar recorte"}
          </button>
        </div>
      </div>
    </div>
  );
}
