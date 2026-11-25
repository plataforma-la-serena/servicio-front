import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

afterEach(() => {
  if (ORIGINAL === undefined) {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  } else {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = ORIGINAL;
  }
  vi.resetModules();
});

describe("whatsappHref", () => {
  it("cae al ancla de contacto si no hay número configurado", async () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    vi.resetModules();

    const { hasWhatsappNumber, whatsappHref } = await import("./whatsapp");
    expect(hasWhatsappNumber).toBe(false);
    expect(whatsappHref("hola")).toBe("#contacto");
  });

  it("arma el enlace wa.me con el mensaje codificado", async () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "5492617193019";
    vi.resetModules();

    const { hasWhatsappNumber, whatsappHref } = await import("./whatsapp");
    expect(hasWhatsappNumber).toBe(true);
    expect(whatsappHref("Hola, quiero reservar")).toBe(
      "https://wa.me/5492617193019?text=Hola%2C%20quiero%20reservar",
    );
  });
});
