import Image from "next/image";

interface ApartmentGalleryProps {
  images: string[];
}

export function ApartmentGallery({ images }: ApartmentGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="detail-gallery" aria-labelledby="gallery-title">
      <div className="section-head">
        <div className="section-head-copy">
          <h2 id="gallery-title" className="section-title">
            Fotos
          </h2>
          <p className="section-lede">Fotos del departamento.</p>
        </div>
        <span className="section-meta">{images.length} fotos</span>
      </div>

      <div className="gallery-grid">
        {images.map((src, index) => (
          <div className="gallery-item" key={src}>
            <Image
              src={src}
              alt={`Foto ${index + 1} del departamento`}
              fill
              quality={90}
              sizes="(max-width: 900px) 100vw, 60vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
