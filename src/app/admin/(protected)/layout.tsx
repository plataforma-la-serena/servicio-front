import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminNav } from "./admin-nav";
import { getSession } from "@/lib/api/session";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="admin">
      <AdminNav email={session.email} />
      <main id="contenido" className="admin-main">
        {children}
      </main>
    </div>
  );
}
