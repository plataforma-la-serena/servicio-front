import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fetchChatDetail } from "@/lib/api/endpoints";
import {
  sendOperatorMessageAction,
  setBotActiveAction,
} from "../actions";

export const metadata: Metadata = {
  title: "Conversación",
  robots: { index: false, follow: false },
};

const ROLE_LABEL: Record<string, string> = {
  USER: "Cliente",
  ASSISTANT: "Bot",
  OPERATOR: "Operador",
  SYSTEM: "Sistema",
};

interface ChatDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatDetailPage({ params }: ChatDetailPageProps) {
  const { id } = await params;
  const result = await fetchChatDetail(id);

  if (!result.ok) {
    if (result.status === 401) {
      redirect("/admin/login");
    }
    if (result.status === 404) {
      notFound();
    }
    return (
      <div className="shell admin-section">
        <p className="empty-state">{result.error}</p>
      </div>
    );
  }

  const { session, messages } = result.data;

  return (
    <div className="shell admin-section">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link href="/admin/chats">Chats</Link>
        <span aria-hidden="true">/</span>
        <span>{session.phoneNumber}</span>
      </nav>

      <div className="section-head">
        <h1 className="section-title">{session.phoneNumber}</h1>
        <span className={`status ${session.botActive ? "status-muted" : "status-PENDING"}`}>
          {session.botActive ? "Bot activo" : "Atención humana"}
        </span>
      </div>

      <div className="chat-controls">
        <form action={setBotActiveAction}>
          <input type="hidden" name="id" value={session.id} />
          <input type="hidden" name="botActive" value={String(session.botActive)} />
          <button className="button-dark" type="submit">
            {session.botActive ? "Pausar bot" : "Reactivar bot"}
          </button>
        </form>
        <p className="chat-controls-note">
          {session.botActive
            ? "El bot responde automáticamente. Pausalo para atender vos."
            : "El bot está pausado: los mensajes quedan guardados para vos."}
        </p>
      </div>

      <section aria-label="Mensajes" className="admin-block">
        {messages.length === 0 ? (
          <p className="empty-state">Sin mensajes.</p>
        ) : (
          <ol className="chat-log">
            {messages.map((message) => (
              <li key={message.id} className={`chat-msg chat-msg-${message.role}`}>
                <span className="chat-msg-meta">
                  {ROLE_LABEL[message.role] ?? message.role}
                  {" · "}
                  {message.createdAt.slice(11, 16)}
                </span>
                <p className="chat-msg-body">{message.content}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <form action={sendOperatorMessageAction} className="form chat-reply">
        <input type="hidden" name="id" value={session.id} />
        <div className="form-field">
          <label className="label" htmlFor="reply-content">
            Mensaje del operador (queda registrado en la conversación)
          </label>
          <textarea
            className="input"
            id="reply-content"
            name="content"
            rows={2}
            maxLength={4000}
            required
          />
        </div>
        <button className="button-dark" type="submit">
          Registrar mensaje
        </button>
      </form>
    </div>
  );
}
