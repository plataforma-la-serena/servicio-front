import {
  isoDate,
  monthDays,
  occupiedDates,
  seasonMonths,
  seasonWindow,
  type AvailabilityRange,
} from "@/lib/availability";

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"] as const;

interface AvailabilityCalendarProps {
  apartmentId: string;
}

async function fetchRanges(id: string): Promise<AvailabilityRange[] | null> {
  const base = process.env.API_CENTRAL_URL?.replace(/\/$/, "");
  if (!base) {
    return null;
  }

  const { from, to } = seasonWindow();

  try {
    const response = await fetch(
      `${base}/apartments/${encodeURIComponent(id)}/availability` +
        `?from=${from}&to=${to}`,
      { next: { revalidate: 300 } },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { ranges?: AvailabilityRange[] };
    return payload.ranges ?? [];
  } catch {
    return null;
  }
}

export async function AvailabilityCalendar({
  apartmentId,
}: AvailabilityCalendarProps) {
  const ranges = await fetchRanges(apartmentId);
  const months = seasonMonths();

  if (ranges === null) {
    return null;
  }

  const occupied = occupiedDates(ranges);

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

                return (
                  <span
                    key={date}
                    className={isOccupied ? "day day-occupied" : "day"}
                    title={isOccupied ? "Ocupado" : "Disponible"}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="availability-legend">
        <span className="day day-occupied">00</span> ocupado ·{" "}
        <span className="day">00</span> disponible. La disponibilidad se
        confirma por WhatsApp.
      </p>
    </section>
  );
}
