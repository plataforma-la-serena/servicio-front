import Link from "next/link";
import { SEASON_LABEL } from "@/lib/season";

export function SiteFooter() {
  return (
    <footer id="contacto" className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-brand-name">
              <span>La Serena</span>
            </p>
            <p className="footer-copy">
              Departamentos temporarios en La Serena para la temporada de
              verano.
            </p>
          </div>

          <div className="footer-nav">
            <p className="footer-label">Navegación</p>
            <ul className="footer-links">
              <li>
                <Link href="/">Inicio</Link>
              </li>
              <li>
                <Link href="/departamentos">Departamentos</Link>
              </li>
              <li>
                <Link href="/la-serena">La Serena</Link>
              </li>
              <li>
                <Link href="/como-reservar">Cómo reservar</Link>
              </li>
              <li>
                <Link href="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <p className="footer-label">Contacto</p>
            <ul className="footer-links">
              <li>La Serena, Chile</li>
              <li>Temporada {SEASON_LABEL}</li>
              <li>Atención por WhatsApp</li>
              <li>
                <Link href="/creditos">Créditos de imágenes</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>La Serena, Chile</span>
          <span>Temporada {SEASON_LABEL}</span>
        </div>
      </div>
    </footer>
  );
}
