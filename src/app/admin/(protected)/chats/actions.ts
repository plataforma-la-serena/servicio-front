"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/api/session";
import { apiFetch } from "@/lib/api/client";
import type { ActionResult } from "@/types/admin";

const BOT_URL = (process.env.WHATSAPP_BOT_URL ?? "http://localhost:3003").replace(
  /\/$/,
  "",
);

export async function setBotActiveAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const botActive = formData.get("botActive") === "true";

  if (id) {
    await apiFetch(`/chat-sessions/${id}`, {
      method: "PATCH",
      body: { botActive },
    });
  }

  revalidatePath("/admin/chats");
  revalidatePath(`/admin/chats/${id}`);
}

export async function sendOperatorMessageAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const phone = String(formData.get("phone") ?? "").replace(/[^0-9]/g, "");
  const content = String(formData.get("content") ?? "").trim();

  if (!id || !phone || !content) {
    return { ok: false, error: "Escribí un mensaje." };
  }

  let sent = false;

  try {
    const response = await fetch(`${BOT_URL}/internal/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-token": process.env.INTERNAL_API_TOKEN ?? "",
      },
      body: JSON.stringify({ to: phone, text: content.slice(0, 4000) }),
      cache: "no-store",
    });
    sent = response.ok;
  } catch {
    sent = false;
  }

  if (!sent) {
    return {
      ok: false,
      error:
        "No se pudo enviar por WhatsApp. Revisá la conexión o si pasaron 24 horas desde el último mensaje del cliente.",
    };
  }

  await apiFetch(`/chat-sessions/${id}/messages`, {
    method: "POST",
    body: { content: content.slice(0, 4000) },
  });

  revalidatePath(`/admin/chats/${id}`);
  return { ok: true };
}

export async function setReservationInterestAction(
  formData: FormData,
): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const wantsReservation = formData.get("wantsReservation") === "true";

  if (id) {
    await apiFetch(`/chat-sessions/${id}`, {
      method: "PATCH",
      body: { wantsReservation },
    });
  }

  revalidatePath("/admin/chats");
  revalidatePath(`/admin/chats/${id}`);
}

export async function setHumanInterestAction(
  formData: FormData,
): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const wantsHuman = formData.get("wantsHuman") === "true";

  if (id) {
    await apiFetch(`/chat-sessions/${id}`, {
      method: "PATCH",
      body: { wantsHuman },
    });
  }

  revalidatePath("/admin/chats");
  revalidatePath(`/admin/chats/${id}`);
}
