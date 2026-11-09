"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/api/session";
import { apiFetch } from "@/lib/api/client";

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
  formData: FormData,
): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!id || !content) {
    return;
  }

  await apiFetch(`/chat-sessions/${id}/messages`, {
    method: "POST",
    body: { content: content.slice(0, 4000) },
  });

  revalidatePath(`/admin/chats/${id}`);
}
