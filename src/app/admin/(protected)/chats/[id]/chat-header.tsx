import Link from "next/link";
import type { ChatDetail } from "@/types/admin";
import {
  setBotActiveAction,
  setHumanInterestAction,
  setReservationInterestAction,
} from "../actions";

interface ChatHeaderProps {
  session: ChatDetail["session"];
}

function LeadDots({ session }: ChatHeaderProps) {
  return (
    <>
      {session.wantsReservation && (
        <span
          className="wa-lead-dot"
          title="Quiere reservar"
          aria-label="Quiere reservar"
        />
      )}
      {session.wantsHuman && (
        <span
          className="wa-human-dot"
          title="Pide atención humana"
          aria-label="Pide atención humana"
        />
      )}
    </>
  );
}

export function ChatHeader({ session }: ChatHeaderProps) {
  return (
    <header className="wa-header">
      <Link href="/admin/chats" className="wa-back" aria-label="Volver a chats">
        ←
      </Link>
      <span className="wa-avatar" aria-hidden="true">
        {session.phoneNumber.slice(-2)}
      </span>
      <div className="wa-contact">
        <strong className="wa-phone">
          {session.customerName ?? session.phoneNumber}
          <LeadDots session={session} />
        </strong>
        <span className="wa-subline">
          {session.customerName && (
            <span className="wa-phone-small">{session.phoneNumber}</span>
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
        <form action={setHumanInterestAction}>
          <input type="hidden" name="id" value={session.id} />
          <input
            type="hidden"
            name="wantsHuman"
            value={String(!session.wantsHuman)}
          />
          <button type="submit" className="wa-toggle-btn">
            {session.wantsHuman ? "Quitar aviso humano" : "Marcar humano"}
          </button>
        </form>
        <form action={setReservationInterestAction}>
          <input type="hidden" name="id" value={session.id} />
          <input
            type="hidden"
            name="wantsReservation"
            value={String(!session.wantsReservation)}
          />
          <button type="submit" className="wa-toggle-btn">
            {session.wantsReservation ? "Quitar aviso" : "Marcar reserva"}
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
  );
}
