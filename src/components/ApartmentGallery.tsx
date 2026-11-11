import Image from "next/image";
import { INTERIOR_IMAGES } from "@/lib/reference-images";

export function ApartmentGallery() {
  return (
    <section className="detail-gallery" aria-labelledby="gallery-title">
      <div className="section-head">
        <div className="section-head-copy">
          <h2 id="gallery-title" className="section-title">
            Interiores
          </h2>
          <p className="section-lede">
            Living, dormitorio, cocina y terraza en imágenes de referencia.
          </p>
        </div>
        <span className="section-meta">Imágenes de referencia</span>
      </div>

      <div className="gallery-grid">
        {INTERIOR_IMAGES.map((image) => (
          <div className="gallery-item" key={image.src}>
            <Image
              src={image.src}
              alt={`${image.alt} (imagen de referencia)`}
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
            />
          </div>
        ))}
      </div>

      <p className="gallery-caption">
        Las fotos son de referencia y no corresponden necesariamente a este
        departamento.
      </p>
    </section>
  );
}
