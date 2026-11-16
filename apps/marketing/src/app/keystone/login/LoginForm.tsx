"use client";

import { useActionState, useEffect } from "react";
import { signInAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, {});
  const error = state.error;
  // Full load so the request passes the host rewrite (see actions.ts).
  useEffect(() => {
    if (state.go) window.location.assign(state.go);
  }, [state.go]);
  return (
    <form action={action} className="ks-form">
      <label htmlFor="u">Username</label>
      <input id="u" name="username" type="text" autoComplete="username" autoFocus required />
      <label htmlFor="p">Password</label>
      <input id="p" name="password" type="password" autoComplete="current-password" required />
      {error && <div className="ks-err">{error}</div>}
      <div style={{ marginTop: 14 }}>
        <button className="ks-btn primary" disabled={pending || !!state.go}>
          {pending || state.go ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </form>
  );
}
