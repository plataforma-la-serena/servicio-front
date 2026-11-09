import Link from "next/link";
import { logoutAction } from "../login/actions";

const LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/departamentos", label: "Departamentos" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/chats", label: "Chats" },
];

interface AdminNavProps {
  email: string;
}

export function AdminNav({ email }: AdminNavProps) {
  return (
    <header className="admin-header">
      <div className="shell admin-header-inner">
        <Link href="/admin" className="brand" aria-label="La Serena, panel">
          <span className="brand-mark" aria-hidden="true" />
          <span>La Serena</span>
          <span className="admin-tag">Panel</span>
        </Link>

        <nav className="admin-nav" aria-label="Navegación del panel">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="admin-user">
          <span className="admin-email">{email}</span>
          <form action={logoutAction}>
            <button className="text-link" type="submit">
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
