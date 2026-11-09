"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { clearSessionCookie, setSessionCookie } from "@/lib/api/session";
import type { ActionResult } from "@/types/admin";

interface LoginPayload {
  token: string;
}

function safeNext(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw : "";
  return value.startsWith("/admin") ? value : "/admin";
}

export async function loginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    return { ok: false, error: "Completá email y contraseña." };
  }

  const result = await apiFetch<LoginPayload>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });

  if (!result.ok) {
    return {
      ok: false,
      error:
        result.status === 401
          ? "Credenciales inválidas."
          : "No se pudo iniciar sesión. Intentá de nuevo.",
    };
  }

  await setSessionCookie(result.data.token);
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" }).catch(() => undefined);
  await clearSessionCookie();
  redirect("/admin/login");
}
