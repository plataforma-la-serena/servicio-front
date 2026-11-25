import {
  isoDate,
  monthDays,
  occupiedDates,
  seasonMonths,
  seasonWindow,
} from "@/lib/availability";
import { fetchAvailabilityRanges } from "@/lib/availability-api";

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"] as const;

interface AvailabilityCalendarProps {
  apartmentId: string;
}

export async function AvailabilityCalendar({
  apartmentId,
}: AvailabilityCalendarProps) {
  const ranges = await fetchAvailabilityRanges(apartmentId);
  const months = seasonMonths();

  if (ranges === null) {
    return null;
  }

  const occupied = occupiedDates(ranges);
  const season = seasonWindow();
  const seasonFrom = season.from.slice(0, 10);
  const seasonTo = season.to.slice(0, 10);
  const now = new Date();
  const today = isoDate(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <section className="availability" aria-labelledby="availability-title">
      <div className="section-head">
        <h2 id="availability-title" className="section-title">
          Disponibilidad
        </h2>
        <span className="section-meta">Temporada 15.12 — 15.03</span>
      </div>

      <div className="availability-grid">
        {months.map((month) => (
          <div className="availability-month" key={month.label}>
            <p className="availability-month-label">{month.label}</p>
            <div className="availability-weekdays" aria-hidden="true">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="availability-days">
              {monthDays(month.year, month.month).map((day, index) => {
                if (day === null) {
                  return <span key={`pad-${index}`} />;
                }

                const date = isoDate(month.year, month.month, day);
                const isOccupied = occupied.has(date);
                const isBookable =
                  date >= seasonFrom && date <= seasonTo && date >= today;
                const className = isOccupied
                  ? "day day-occupied"
                  : isBookable
                    ? "day"
                    : "day day-unavailable";
                const label = isOccupied
                  ? "Reservado"
                  : isBookable
                    ? "Disponible"
                    : "No reservable";

                return (
                  <span key={date} className={className} title={label}>
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="availability-legend">
        <span className="day day-occupied">00</span> reservado ·{" "}
        <span className="day day-unavailable">00</span> no reservable ·{" "}
        <span className="day">00</span> disponible. La disponibilidad se
        confirma por WhatsApp.
      </p>
    </section>
  );
}
