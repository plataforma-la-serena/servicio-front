import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { ReserveButton } from "@/components/ReserveButton";
import { SEASON_LABEL } from "@/lib/season";
import { hasWhatsappNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Consultas y reservas de departamentos en La Serena durante la temporada de verano.",
};

export default function ContactoPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contacto"
        title="Hablemos"
        lede="Las consultas y reservas se atienden por WhatsApp durante la temporada."
      />

      <section className="contact-page" aria-label="Datos de contacto">
        <div className="shell">
          <div className="contact-panel">
            <div className="contact-copy">
              <h2 className="section-title">Consultas y reservas</h2>
              <p className="section-lede">
                Escribinos con las fechas que tenés en mente y la cantidad de
                personas. Confirmamos disponibilidad antes de la transferencia.
              </p>
              {hasWhatsappNumber && (
                <ReserveButton
                  label="Abrir WhatsApp"
                  message="Hola, quiero consultar por los departamentos en La Serena."
                />
              )}
            </div>

            <dl className="contact-facts">
              <div className="contact-fact">
                <dt>Ubicación</dt>
                <dd>La Serena, Chile</dd>
              </div>
              <div className="contact-fact">
                <dt>Temporada</dt>
                <dd>{SEASON_LABEL}</dd>
              </div>
              <div className="contact-fact">
                <dt>Atención</dt>
                <dd>WhatsApp</dd>
              </div>
              <div className="contact-fact">
                <dt>Imágenes</dt>
                <dd>
                  <Link className="text-link" href="/creditos">
                    Ver créditos
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
