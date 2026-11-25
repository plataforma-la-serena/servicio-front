import { Fragment } from "react";
import type { ChatMessage } from "@/types/admin";
import { ChatScroller } from "./chat-scroller";
import { ROLE_LABEL, dayKey, dayLabel, timeLabel } from "./chat-format";

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  let lastDay = "";

  return (
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
  );
}
