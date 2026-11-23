import Image from "next/image";
import { INTERIOR_IMAGES } from "@/lib/reference-images";

interface ApartmentGalleryProps {
  images: string[];
}

export function ApartmentGallery({ images }: ApartmentGalleryProps) {
  const hasPhotos = images.length > 0;
  const photos = hasPhotos
    ? images.map((src, index) => ({
        src,
        alt: `Foto ${index + 1} del departamento`,
      }))
    : INTERIOR_IMAGES.map((image) => ({
        src: image.src,
        alt: `${image.alt} (imagen de referencia)`,
      }));

  return (
    <section className="detail-gallery" aria-labelledby="gallery-title">
      <div className="section-head">
        <div className="section-head-copy">
          <h2 id="gallery-title" className="section-title">
            {hasPhotos ? "Fotos" : "Interiores"}
          </h2>
          <p className="section-lede">
            {hasPhotos
              ? "Fotos del departamento."
              : "Living, dormitorio, cocina y terraza en imágenes de referencia."}
          </p>
        </div>
        <span className="section-meta">
          {hasPhotos ? `${images.length} fotos` : "Imágenes de referencia"}
        </span>
      </div>

      <div className="gallery-grid">
        {photos.map((image) => (
          <div className="gallery-item" key={image.src}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              quality={90}
              sizes="(max-width: 900px) 100vw, 60vw"
            />
          </div>
        ))}
      </div>

      {!hasPhotos && (
        <p className="gallery-caption">
          Las fotos son de referencia y no corresponden necesariamente a este
          departamento.
        </p>
      )}
    </section>
  );
}
