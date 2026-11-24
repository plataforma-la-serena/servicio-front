"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="admin-header">
      <div className="shell admin-header-inner">
        <Link href="/admin" className="brand" aria-label="Alquileres 4 Esquinas, panel">
          <img
            src="/logo-alquileres-4-esquinas.svg"
            alt=""
            className="brand-logo brand-logo--admin"
            width={48}
            height={27}
          />
          <span>Alquileres 4 Esquinas</span>
          <span className="admin-tag">Panel</span>
        </Link>

        <nav className="admin-nav" aria-label="Navegación del panel">
          {LINKS.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
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
