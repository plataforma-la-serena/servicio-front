import Link from "next/link";
import { ReserveButton } from "./ReserveButton";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          href="/"
          className="brand brand-lockup"
          aria-label="Alquileres 4 Esquinas, inicio"
        >
          <img
            src="/logo-alquileres-4-esquinas.svg"
            alt=""
            className="brand-logo"
            width={72}
            height={40}
          />
          <span className="brand-copy">
            <span className="brand-name">Alquileres 4 Esquinas</span>
            <span className="brand-place">La Serena</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Navegación principal">
          <Link href="/">Inicio</Link>
          <Link href="/departamentos">Departamentos</Link>
          <Link href="/como-reservar">Cómo reservar</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>

        <ReserveButton label="Reservar" className="header-cta" />
      </div>
    </header>
  );
}
