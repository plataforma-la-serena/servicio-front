import "server-only";
import { cookies } from "next/headers";
import type { AdminSession } from "@/types/admin";
import { apiFetch, ADMIN_COOKIE } from "./client";

export interface SessionResult {
  session: AdminSession | null;
}

export async function getSession(): Promise<AdminSession | null> {
  const result = await apiFetch<AdminSession>("/auth/me");

  if (!result.ok) {
    return null;
  }

  return result.data;
}

export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}
