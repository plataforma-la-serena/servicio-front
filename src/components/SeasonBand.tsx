import { SEASON_LABEL, SEASON_MONTHS } from "@/lib/season";

export function SeasonBand() {
  return (
    <section
      id="temporada"
      className="season-band"
      aria-label="Meses de la temporada"
    >
      <div className="shell season-band-grid">
        <div className="season-intro">
          <span className="eyebrow">Temporada</span>
          <strong>{SEASON_LABEL}</strong>
        </div>

        {SEASON_MONTHS.map((item) => (
          <div className="season-cell" key={item.month}>
            <span className="season-month">{item.month}</span>
            <span className="season-range">{item.range}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
