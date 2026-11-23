"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import type { ActionResult } from "@/types/admin";
import { sendOperatorMessageAction } from "../actions";

interface ChatComposerProps {
  id: string;
  phone: string;
}

export function ChatComposer({ id, phone }: ChatComposerProps) {
  const [state, action, pending] = useActionState(
    sendOperatorMessageAction,
    { ok: false } as ActionResult,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="wa-composer">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="phone" value={phone} />
      <div className="wa-composer-row">
        <textarea
          className="wa-input"
          id="reply-content"
          name="content"
          rows={1}
          maxLength={4000}
          placeholder="Escribí un mensaje…"
          aria-label="Mensaje para el cliente"
          required
        />
        <button className="wa-send" type="submit" aria-label="Enviar" disabled={pending}>
          {pending ? "…" : "➤"}
        </button>
      </div>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="form-success" role="status">
          Mensaje enviado.
        </p>
      )}
      <p className="wa-composer-note">
        Se envía al cliente por WhatsApp y queda registrado en la conversación.
      </p>
    </form>
  );
}
