import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchChatSessions } from "@/lib/api/endpoints";

export const metadata: Metadata = {
  title: "Chats",
  robots: { index: false, follow: false },
};

export default async function AdminChatsPage() {
  const result = await fetchChatSessions();

  if (!result.ok) {
    if (result.status === 401) {
      redirect("/admin/login");
    }
    return (
      <div className="shell admin-section">
        <p className="empty-state">{result.error}</p>
      </div>
    );
  }

  const sessions = result.data;

  return (
    <div className="shell admin-section">
      <div className="section-head">
        <h1 className="section-title">Chats</h1>
        <span className="section-meta">
          {String(sessions.length).padStart(2, "0")} conversaciones
        </span>
      </div>

      {sessions.length === 0 ? (
        <p className="empty-state">
          No hay conversaciones todavía. Aparecen cuando alguien escribe al bot.
        </p>
      ) : (
        <ul className="admin-list">
          {sessions.map((session) => {
            const last = session.messages[0];

            return (
              <li key={session.id} className="admin-list-row admin-list-row-wrap">
                <span className="admin-list-title">
                  <Link
                    href={`/admin/chats/${session.id}`}
                    className="chat-link"
                  >
                    {session.phoneNumber}
                  </Link>
                </span>
                <span className={`status ${session.botActive ? "status-muted" : "status-PENDING"}`}>
                  {session.botActive ? "Bot activo" : "Atención humana"}
                </span>
                <span className="admin-list-meta chat-preview">
                  {last ? last.content : "Sin mensajes"}
                </span>
                <span className="admin-list-meta">
                  {session.lastInteraction.slice(0, 16).replace("T", " ")}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
