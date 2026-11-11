import Image from "next/image";
import Link from "next/link";
import { LA_SERENA_PLACES } from "@/lib/reference-images";
import { Reveal } from "./Reveal";

export function LaSerena() {
  return (
    <section
      id="la-serena"
      className="la-serena"
      aria-labelledby="la-serena-title"
    >
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <div className="section-head-copy">
              <p className="eyebrow">La ciudad</p>
              <h2 id="la-serena-title" className="section-title">
                La Serena
              </h2>
              <p className="section-lede">
                Playa, centro histórico y shopping. La ciudad que rodea la
                temporada.
              </p>
            </div>
            <span className="section-meta">Guía breve</span>
          </div>
        </Reveal>

        <div className="places">
          {LA_SERENA_PLACES.map((place, index) => (
            <Reveal
              key={place.name}
              className="place-wrap"
              delay={index * 70}
            >
              <article className="place">
                <Image
                  src={place.image}
                  alt={place.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 55vw"
                />
                <div className="place-copy">
                  <h3 className="place-name">{place.name}</h3>
                  <p className="place-description">{place.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="section-note">
          Imágenes de referencia de La Serena.{" "}
          <Link href="/creditos">Ver créditos</Link>.
        </p>
      </div>
    </section>
  );
}
