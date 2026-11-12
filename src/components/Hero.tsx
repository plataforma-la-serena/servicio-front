import Image from "next/image";
import { SEASON_LABEL } from "@/lib/season";
import { ReserveButton } from "./ReserveButton";

interface HeroProps {
  apartmentCount: number;
}

export function Hero({ apartmentCount }: HeroProps) {
  const count = String(apartmentCount).padStart(2, "0");

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true">
        <Image
          src="/images/hero-playa.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>

      <div className="shell hero-inner">
        <p className="eyebrow hero-eyebrow">
          Temporada {SEASON_LABEL} · La Serena, Chile
        </p>
        <h1 id="hero-title" className="hero-title">
          Verano
          <br />
          <em>en La Serena.</em>
        </h1>
        <p className="hero-lede">
          Departamentos amoblados para la temporada de verano. Consultas y
          reservas por WhatsApp.
        </p>

        <div className="hero-actions">
          <ReserveButton label="Reservar por WhatsApp" />
          <a className="hero-link" href="/departamentos">
            Ver departamentos
          </a>
        </div>

        <dl className="hero-facts">
          <div className="hero-fact">
            <dt>Departamentos</dt>
            <dd>{count}</dd>
          </div>
          <div className="hero-fact">
            <dt>Temporada</dt>
            <dd>{SEASON_LABEL}</dd>
          </div>
          <div className="hero-fact">
            <dt>Atención</dt>
            <dd>WhatsApp</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
