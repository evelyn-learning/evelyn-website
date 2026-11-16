"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import type { ReviewResult } from "../actions";

/** A form bound to a server action that returns { go } instead of redirecting (see actions.ts). */
export function ActionForm({
  action,
  className,
  children,
}: {
  action: (prev: ReviewResult, form: FormData) => Promise<ReviewResult>;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, run, pending] = useActionState(action, {});
  const router = useRouter();
  useEffect(() => {
    if (state.go) router.push(state.go);
  }, [state.go, router]);
  return (
    <form action={run} className={className} aria-busy={pending}>
      <fieldset disabled={pending} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        {children}
      </fieldset>
      {state.error && <div className="ks-err">{state.error}</div>}
    </form>
  );
}
