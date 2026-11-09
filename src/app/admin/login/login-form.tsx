"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import type { ActionResult } from "@/types/admin";

const INITIAL: ActionResult = { ok: false };

interface LoginFormProps {
  next: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    INITIAL,
  );

  return (
    <form className="form" action={formAction}>
      <input type="hidden" name="next" value={next} />

      <div className="form-field">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          className="input"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="form-field">
        <label className="label" htmlFor="password">
          Contraseña
        </label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
        />
      </div>

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}

      <button className="button-dark" type="submit" disabled={pending}>
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
