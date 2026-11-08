import { SEASON_MONTHS } from "@/lib/season";

export function SeasonBand() {
  return (
    <section
      id="temporada"
      className="season-band"
      aria-label="Meses de la temporada"
    >
      <div className="shell">
        <div className="season-band-grid">
          {SEASON_MONTHS.map((item) => (
            <div className="season-cell" key={item.month}>
              <span className="season-month">{item.month}</span>
              <span className="season-range">{item.range}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
