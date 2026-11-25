import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fetchChatDetail } from "@/lib/api/endpoints";
import { ChatComposer } from "./chat-composer";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";

export const metadata: Metadata = {
  title: "Conversación",
  robots: { index: false, follow: false },
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

      <section className="wa-chat" aria-label="Conversación con el cliente">
        <ChatHeader session={session} />
        <ChatMessages messages={messages} />
        <ChatComposer id={session.id} phone={session.phoneNumber} />
      </section>
    </div>
  );
}
