"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePasswordAction, type PasswordResult } from "../actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordResult, FormData>(changePasswordAction, {});
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.done) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="ks-form">
      <label htmlFor="current">Current password</label>
      <input id="current" name="current" type="password" autoComplete="current-password" required />
      <label htmlFor="next">New password (at least 10 characters)</label>
      <input id="next" name="next" type="password" autoComplete="new-password" minLength={10} required />
      <label htmlFor="confirm">New password again</label>
      <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      {state.error && <div className="ks-err">{state.error}</div>}
      {state.done && <div className="ks-note info" style={{ marginTop: 10 }}>Password changed. Use the new one next time you sign in.</div>}
      <div style={{ marginTop: 14 }}>
        <button className="ks-btn primary" disabled={pending}>
          {pending ? "Saving…" : "Change password"}
        </button>
      </div>
    </form>
  );
}
