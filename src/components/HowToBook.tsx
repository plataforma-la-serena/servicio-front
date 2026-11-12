import { Reveal } from "./Reveal";

const STEPS = [
  {
    title: "Consulta",
    description: "Elegí un departamento y escribinos por WhatsApp.",
  },
  {
    title: "Verificación",
    description: "Enviá una foto de tu DNI para iniciar la reserva.",
  },
  {
    title: "Confirmación",
    description: "Coordinamos la transferencia y confirmamos las fechas.",
  },
];

export function HowToBook({ headless = false }: { headless?: boolean }) {
  return (
    <section
      id="como-reservar"
      className="how-to-book"
      aria-labelledby={headless ? undefined : "how-to-book-title"}
    >
      <div className="shell">
        <Reveal>
          <div className="how-to-book-panel">
            {!headless && (
              <div className="how-to-book-head">
                <h2 id="how-to-book-title" className="section-title">
                  Cómo reservar
                </h2>
                <p className="how-to-book-intro">
                  El proceso se completa por WhatsApp. La disponibilidad se
                  confirma antes de la transferencia.
                </p>
              </div>
            )}

            <div className="steps">
              {STEPS.map((step, index) => (
                <article className="step" key={step.title}>
                  <span className="step-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
