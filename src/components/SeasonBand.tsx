import { SEASON_LABEL } from "@/lib/season";

export function SeasonBand() {
  return (
    <section id="temporada" className="season-band" aria-label="Temporada">
      <div className="shell season-band-grid">
        <span className="eyebrow">Temporada</span>
        <strong className="season-dates">{SEASON_LABEL}</strong>
      </div>
    </section>
  );
}
