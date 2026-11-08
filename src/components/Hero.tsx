import { SEASON_LABEL } from "@/lib/season";
import { ReserveButton } from "./ReserveButton";

interface HeroProps {
  apartmentCount: number;
}

export function Hero({ apartmentCount }: HeroProps) {
  const count = String(apartmentCount).padStart(2, "0");

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Temporada {SEASON_LABEL}</p>
            <h1 id="hero-title" className="hero-title">
              <span>Departamentos</span>
              <span>temporarios</span>
              <span>en La Serena.</span>
            </h1>
            <p className="hero-lede">
              Alquiler de departamentos amoblados para la temporada de verano.
              Consultas y reservas por WhatsApp.
            </p>
            <ReserveButton label="Reservar por WhatsApp" />
          </div>

          <aside className="hero-index" aria-label="Resumen de la temporada">
            <div className="hero-index-count">
              <span className="metric-label">Departamentos</span>
              <span className="metric-value metric-value-xl">{count}</span>
            </div>

            <dl className="fact-list">
              <div className="fact">
                <dt className="metric-label">Temporada</dt>
                <dd className="fact-value">{SEASON_LABEL}</dd>
              </div>
              <div className="fact">
                <dt className="metric-label">Ubicación</dt>
                <dd className="fact-value">La Serena, Chile</dd>
              </div>
              <div className="fact">
                <dt className="metric-label">Atención</dt>
                <dd className="fact-value">WhatsApp</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
