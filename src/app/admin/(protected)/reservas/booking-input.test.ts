import { describe, expect, it } from "vitest";
import { currentSeason } from "@/lib/availability";
import {
  digitsOnly,
  isBookingPhone,
  isBookingStatus,
  isDateRangeValid,
  parseBookingInput,
} from "./booking-input";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

function seasonDates(offset = 1): { start: string; end: string } {
  const { from } = currentSeason();
  const start = new Date(from);
  start.setUTCDate(start.getUTCDate() + offset);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 2);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

describe("helpers de reservas", () => {
  it("deja solo dígitos en el teléfono", () => {
    expect(digitsOnly("+54 9 261-555-5555")).toBe("5492615555555");
  });

  it("valida teléfonos de 8 a 15 dígitos", () => {
    expect(isBookingPhone("5492615555555")).toBe(true);
    expect(isBookingPhone("123")).toBe(false);
  });

  it("valida el rango de fechas dentro de temporada", () => {
    const { start, end } = seasonDates();
    expect(isDateRangeValid(start, end, "2026-12-15", "2027-03-15")).toBe(true);
    expect(isDateRangeValid(end, start, "2026-12-15", "2027-03-15")).toBe(false);
  });

  it("reconoce estados válidos", () => {
    expect(isBookingStatus("CONFIRMED")).toBe(true);
    expect(isBookingStatus("OTRO")).toBe(false);
  });
});

describe("parseBookingInput", () => {
  it("acepta una reserva válida y normaliza el teléfono", () => {
    const { start, end } = seasonDates();
    const result = parseBookingInput(
      form({
        apartmentId: "apt-1",
        startDate: start,
        endDate: end,
        customerPhone: "+54 9 261 555 5555",
        notes: "  llegar tarde  ",
      }),
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.customerPhone).toBe("5492615555555");
      expect(result.value.notes).toBe("llegar tarde");
    }
  });

  it("exige departamento y fechas", () => {
    const result = parseBookingInput(form({ customerPhone: "5492615555555" }));
    expect(result).toEqual({
      ok: false,
      error: "Completá departamento y fechas.",
    });
  });

  it("rechaza teléfonos inválidos", () => {
    const { start, end } = seasonDates();
    const result = parseBookingInput(
      form({
        apartmentId: "apt-1",
        startDate: start,
        endDate: end,
        customerPhone: "123",
      }),
    );
    expect(result.ok).toBe(false);
  });

  it("rechaza fechas invertidas", () => {
    const { start, end } = seasonDates();
    const result = parseBookingInput(
      form({
        apartmentId: "apt-1",
        startDate: end,
        endDate: start,
        customerPhone: "5492615555555",
      }),
    );
    expect(result).toEqual({
      ok: false,
      error: "La fecha de inicio debe ser anterior a la de fin.",
    });
  });

  it("rechaza fechas fuera de temporada", () => {
    const result = parseBookingInput(
      form({
        apartmentId: "apt-1",
        startDate: "2030-06-10",
        endDate: "2030-06-12",
        customerPhone: "5492615555555",
      }),
    );
    expect(result).toEqual({
      ok: false,
      error: "Las reservas van del 15/12 al 15/03.",
    });
  });

  it("solo toma el estado cuando se lo pide explícitamente", () => {
    const { start, end } = seasonDates();
    const base = {
      apartmentId: "apt-1",
      startDate: start,
      endDate: end,
      customerPhone: "5492615555555",
      status: "CONFIRMED",
    };

    const withStatus = parseBookingInput(form(base), true);
    const withoutStatus = parseBookingInput(form(base));

    expect(withStatus.ok && withStatus.value.status).toBe("CONFIRMED");
    expect(withoutStatus.ok && withoutStatus.value.status).toBeUndefined();
  });
});
