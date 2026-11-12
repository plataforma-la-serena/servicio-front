import Link from "next/link";
import { Reveal } from "./Reveal";

const LINKS = [
  {
    href: "/la-serena",
    label: "La Serena",
    description: "Playa, centro histórico y shopping.",
  },
  {
    href: "/como-reservar",
    label: "Cómo reservar",
    description: "Consulta, verificación y confirmación por WhatsApp.",
  },
  {
    href: "/contacto",
    label: "Contacto",
    description: "Fechas, disponibilidad y consultas.",
  },
];

export function ExploreLinks() {
  return (
    <section className="explore" aria-labelledby="explore-title">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <div className="section-head-copy">
              <p className="eyebrow">Seguí explorando</p>
              <h2 id="explore-title" className="section-title">
                Más sobre la estadía
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="explore-grid">
          {LINKS.map((link, index) => (
            <Reveal key={link.href} delay={index * 70}>
              <Link className="explore-card" href={link.href}>
                <span className="explore-label">{link.label}</span>
                <span className="explore-description">{link.description}</span>
                <span className="explore-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
