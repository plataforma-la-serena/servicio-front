import { describe, expect, it } from "vitest";
import { formatPrice, formatShortDate } from "./format";

describe("formatPrice", () => {
  it("formatea CLP sin decimales", () => {
    const value = formatPrice(66000);
    expect(value).toContain("66.000");
    expect(value).toContain("CLP");
  });
});

describe("formatShortDate", () => {
  it("convierte ISO a dd/mm/aaaa", () => {
    expect(formatShortDate("2026-12-15T00:00:00.000Z")).toBe("15/12/2026");
  });

  it("devuelve el valor original si no es ISO", () => {
    expect(formatShortDate("sin fecha")).toBe("sin fecha");
  });
});
