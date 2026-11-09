export interface AvailabilityRange {
  type: "booking" | "block";
  startDate: string;
  endDate: string;
  status?: string;
  reason?: string;
}

export interface AvailabilityPayload {
  from: string;
  to: string;
  ranges: AvailabilityRange[];
}

export interface SeasonMonth {
  label: string;
  year: number;
  month: number;
}

/** Temporada de verano: 15 de diciembre al 15 de marzo. */
export function seasonMonths(reference = new Date()): SeasonMonth[] {
  const year = reference.getFullYear();
  const december = reference.getMonth() >= 11 ? year + 1 : year;
  return [
    { label: "DIC", year: december, month: 11 },
    { label: "ENE", year: december + 1, month: 0 },
    { label: "FEB", year: december + 1, month: 1 },
    { label: "MAR", year: december + 1, month: 2 },
  ];
}

export function seasonWindow(reference = new Date()): {
  from: string;
  to: string;
} {
  const year = reference.getFullYear();
  const from = new Date(Date.UTC(year, 11, 15));
  const to = new Date(Date.UTC(year + 1, 2, 15));
  return { from: from.toISOString(), to: to.toISOString() };
}

/** Fechas ocupadas (checkout incluido como día libre). */
export function occupiedDates(ranges: AvailabilityRange[]): Set<string> {
  const occupied = new Set<string>();

  for (const range of ranges) {
    const cursor = new Date(`${range.startDate}T00:00:00Z`);
    const end = new Date(`${range.endDate}T00:00:00Z`);

    while (cursor < end) {
      occupied.add(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }

  return occupied;
}

/** Días de un mes, alineados con semana que arranca el lunes. */
export function monthDays(year: number, month: number): (number | null)[] {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const cells: (number | null)[] = Array.from(
    { length: firstWeekday },
    () => null,
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  return cells;
}

export function isoDate(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}
