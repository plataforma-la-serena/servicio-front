import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fetchChatDetail } from "@/lib/api/endpoints";
import { ChatComposer } from "./chat-composer";
import { ChatScroller } from "./chat-scroller";
import {
  setBotActiveAction,
  setReservationInterestAction,
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

const TIME_ZONE = "America/Santiago";

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    timeZone: TIME_ZONE,
  });
}

function dayLabel(iso: string): string {
  const key = dayKey(iso);
  const today = dayKey(new Date().toISOString());
  const yesterday = dayKey(new Date(Date.now() - 86_400_000).toISOString());

  if (key === today) {
    return "Hoy";
  }
  if (key === yesterday) {
    return "Ayer";
  }

  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

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
  let lastDay = "";

  return (
    <div className="shell admin-section">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link href="/admin/chats">Chats</Link>
        <span aria-hidden="true">/</span>
        <span>{session.phoneNumber}</span>
      </nav>

      <section className="wa-chat" aria-label="Conversación con el cliente">
        <header className="wa-header">
          <Link
            href="/admin/chats"
            className="wa-back"
            aria-label="Volver a chats"
          >
            ←
          </Link>
          <span className="wa-avatar" aria-hidden="true">
            {session.phoneNumber.slice(-2)}
          </span>
          <div className="wa-contact">
            <strong className="wa-phone">
              {session.customerName ?? session.phoneNumber}
              {session.wantsReservation && (
                <span
                  className="wa-lead-dot"
                  title="Quiere reservar"
                  aria-label="Quiere reservar"
                />
              )}
            </strong>
            <span className="wa-subline">
              {session.customerName && (
                <span className="wa-phone-small">
                  {session.phoneNumber}
                </span>
              )}
              <span
                className={`wa-status ${session.botActive ? "is-bot" : "is-human"}`}
              >
                <span className="wa-dot" aria-hidden="true" />
                {session.botActive ? "Bot activo" : "Atención humana"}
              </span>
            </span>
          </div>
          <div className="wa-header-actions">
            <form action={setReservationInterestAction}>
              <input type="hidden" name="id" value={session.id} />
              <input
                type="hidden"
                name="wantsReservation"
                value={String(!session.wantsReservation)}
              />
              <button type="submit" className="wa-toggle-btn">
                {session.wantsReservation
                  ? "Quitar aviso"
                  : "Marcar reserva"}
              </button>
            </form>
            <form action={setBotActiveAction}>
              <input type="hidden" name="id" value={session.id} />
              <input
                type="hidden"
                name="botActive"
                value={String(!session.botActive)}
              />
              <button type="submit" className="wa-toggle-btn">
                {session.botActive ? "Pausar bot" : "Reactivar bot"}
              </button>
            </form>
          </div>
        </header>

        <ChatScroller>
          {messages.length === 0 ? (
            <p className="wa-empty">Sin mensajes todavía.</p>
          ) : (
            messages.map((message) => {
              const day = dayKey(message.createdAt);
              const showDay = day !== lastDay;
              lastDay = day;

              return (
                <Fragment key={message.id}>
                  {showDay && (
                    <div className="wa-day">{dayLabel(message.createdAt)}</div>
                  )}
                  <div className={`wa-msg wa-${message.role.toLowerCase()}`}>
                    <span className="wa-msg-meta">
                      <span>{ROLE_LABEL[message.role] ?? message.role}</span>
                      <span>{timeLabel(message.createdAt)}</span>
                    </span>
                    <p className="wa-msg-text">{message.content}</p>
                  </div>
                </Fragment>
              );
            })
          )}
        </ChatScroller>

        <ChatComposer id={session.id} phone={session.phoneNumber} />
      </section>
    </div>
  );
}
