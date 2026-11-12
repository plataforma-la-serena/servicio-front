import type { Metadata } from "next";
import { HowToBook } from "@/components/HowToBook";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Cómo reservar",
  description:
    "Consulta, verificación y confirmación: el proceso de reserva se completa por WhatsApp.",
};

export default function ComoReservarPage() {
  return (
    <>
      <PageIntro
        eyebrow="Reservas"
        title="Cómo reservar"
        lede="El proceso se completa por WhatsApp. La disponibilidad se confirma antes de la transferencia."
      />
      <HowToBook headless />
    </>
  );
}
