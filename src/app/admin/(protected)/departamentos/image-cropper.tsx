"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, {
  getInitialCropFromCroppedAreaPercentages,
  type Area,
  type MediaSize,
} from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { cropToJpeg } from "@/lib/crop-image";
import { uploadCroppedImage } from "./crop-actions";

interface ImageCropperProps {
  src: string;
  sourceUrl: string;
  initialPercentages?: Area | null;
  onCancel: () => void;
  onSaved: (url: string, sourceUrl: string, cropData: Area | null) => void;
}

export function ImageCropper({
  src,
  sourceUrl,
  initialPercentages,
  onCancel,
  onSaved,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [percentages, setPercentages] = useState<Area | null>(null);
  const [mediaSize, setMediaSize] = useState<MediaSize | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const appliedRef = useRef(false);

  const onCropComplete = useCallback((percent: Area, pixels: Area) => {
    setArea(pixels);
    setPercentages(percent);
  }, []);

  useEffect(() => {
    if (
      appliedRef.current ||
      !initialPercentages ||
      !mediaSize ||
      !containerRef.current
    ) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const initial = getInitialCropFromCroppedAreaPercentages(
      initialPercentages,
      mediaSize,
      0,
      { width: rect.width, height: rect.height },
      1,
      3,
    );

    setCrop(initial.crop);
    setZoom(initial.zoom);
    appliedRef.current = true;
  }, [initialPercentages, mediaSize]);

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
      if (percentages) {
        formData.append("cropData", JSON.stringify(percentages));
      }
      const result = await uploadCroppedImage(formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onSaved(result.url, result.sourceUrl, percentages);
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

        <div className="crop-area" ref={containerRef}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onMediaLoaded={setMediaSize}
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
