import "server-only";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ls_admin";

const BASE = (process.env.API_CENTRAL_URL ?? "http://localhost:3001").replace(
  /\/$/,
  "",
);

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

export interface ApiRequestInit {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Usar la cookie de sesión del dashboard; por defecto true. */
  auth?: boolean;
  /** Token JWT explícito (flujo de login, sin cookie previa). */
  token?: string;
}

function headersFrom(init: ApiRequestInit, token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiFetch<T>(
  path: string,
  init: ApiRequestInit = {},
): Promise<ApiResult<T>> {
  const headers = headersFrom(init, init.token);

  if (!init.token && init.auth !== false) {
    const jar = await cookies();
    const cookie = jar.get(ADMIN_COOKIE)?.value;
    if (cookie) {
      headers.Authorization = `Bearer ${cookie}`;
    }
  }

  try {
    const response = await fetch(`${BASE}${path}`, {
      method: init.method ?? "GET",
      headers,
      ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: `api-central respondió ${response.status}`,
      };
    }

    return { ok: true, data: (await response.json()) as T };
  } catch {
    return {
      ok: false,
      status: 503,
      error: "api-central no está disponible",
    };
  }
}

export function apiBaseUrl(): string {
  return BASE;
}
