import Link from "next/link";
import { ReserveButton } from "./ReserveButton";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="La Serena, inicio">
          <span className="brand-mark" aria-hidden="true" />
          <span>La Serena</span>
        </Link>

        <nav className="site-nav" aria-label="Navegación principal">
          <Link href="/#catalogo">Departamentos</Link>
          <Link href="/#la-serena">La Serena</Link>
          <Link href="/#como-reservar">Cómo reservar</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>

        <ReserveButton label="Reservar" className="header-cta" />
      </div>
    </header>
  );
}
