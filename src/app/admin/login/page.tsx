import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Acceso",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const safeNext = next?.startsWith("/admin") ? next : "/admin";

  return (
    <section className="login" aria-labelledby="login-title">
      <div className="shell">
        <div className="login-grid">
          <div className="login-copy">
            <p className="eyebrow">Panel de administración</p>
            <h1 id="login-title" className="login-title">
              Acceso restringido.
            </h1>
            <p className="login-lede">
              Solo el administrador de la propiedad puede ingresar. La sesión se
              mantiene con una cookie segura y expira a las 12 horas.
            </p>
          </div>

          <div className="login-panel">
            <LoginForm next={safeNext} />
          </div>
        </div>
      </div>
    </section>
  );
}
