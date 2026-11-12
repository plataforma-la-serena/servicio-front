import type { Metadata } from "next";
import { LaSerena } from "@/components/LaSerena";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "La Serena",
  description:
    "Playa, centro histórico y shopping: una guía breve de La Serena para la temporada de verano.",
};

export default function LaSerenaPage() {
  return (
    <>
      <PageIntro
        eyebrow="La ciudad"
        title="La Serena"
        lede="Playa, centro histórico y shopping. La ciudad que rodea la temporada."
      />
      <LaSerena headless />
    </>
  );
}
