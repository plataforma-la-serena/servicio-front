import { describe, expect, it } from "vitest";
import {
  currentSeason,
  isoDate,
  monthDays,
  occupiedDates,
  seasonMonths,
  seasonWindow,
} from "./availability";

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe("currentSeason", () => {
  it("en enero usa la temporada que empezó en diciembre anterior", () => {
    const season = currentSeason(utc("2026-01-10"));
    expect(season.from).toBe("2025-12-15T00:00:00.000Z");
    expect(season.to).toBe("2026-03-15T00:00:00.000Z");
  });

  it("en diciembre arranca la temporada del mismo año", () => {
    const season = currentSeason(utc("2026-12-20"));
    expect(season.from).toBe("2026-12-15T00:00:00.000Z");
    expect(season.to).toBe("2027-03-15T00:00:00.000Z");
  });

  it("fuera de temporada apunta a la próxima", () => {
    const season = currentSeason(utc("2026-06-01"));
    expect(season.from).toBe("2026-12-15T00:00:00.000Z");
  });

  it("el 15 de marzo sigue dentro de la temporada", () => {
    const season = currentSeason(utc("2026-03-15"));
    expect(season.from).toBe("2025-12-15T00:00:00.000Z");
  });
});

describe("seasonMonths / seasonWindow", () => {
  it("lista diciembre a marzo", () => {
    const months = seasonMonths(utc("2026-12-20"));
    expect(months.map((month) => month.label)).toEqual([
      "DIC",
      "ENE",
      "FEB",
      "MAR",
    ]);
    expect(months[0]).toMatchObject({ year: 2026, month: 11 });
  });

  it("seasonWindow devuelve el mismo rango que currentSeason", () => {
    const ref = utc("2026-12-20");
    expect(seasonWindow(ref)).toEqual(currentSeason(ref));
  });
});

describe("occupiedDates", () => {
  it("incluye el día de inicio y excluye el checkout", () => {
    const occupied = occupiedDates([
      { type: "booking", startDate: "2026-12-15", endDate: "2026-12-18" },
    ]);

    expect([...occupied]).toEqual([
      "2026-12-15",
      "2026-12-16",
      "2026-12-17",
    ]);
  });

  it("une varios rangos sin duplicados", () => {
    const occupied = occupiedDates([
      { type: "booking", startDate: "2026-12-15", endDate: "2026-12-17" },
      { type: "block", startDate: "2026-12-16", endDate: "2026-12-18" },
    ]);

    expect(occupied.size).toBe(3);
  });

  it("sin rangos devuelve un set vacío", () => {
    expect(occupiedDates([]).size).toBe(0);
  });
});

describe("monthDays", () => {
  it("alinea el mes con semana que empieza el lunes", () => {
    const cells = monthDays(2026, 11);
    expect(cells[0]).toBeNull();
    expect(cells.filter((day) => day !== null)).toHaveLength(31);
    expect(cells[1]).toBe(1);
  });
});

describe("isoDate", () => {
  it("formatea en UTC", () => {
    expect(isoDate(2026, 11, 15)).toBe("2026-12-15");
  });
});
