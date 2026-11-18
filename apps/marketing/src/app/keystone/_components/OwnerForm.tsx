"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import type { ReviewResult } from "../actions";

/**
 * ActionForm for the owner's queue actions. It navigates from inside the action, not from an effect:
 * Send to review and Hold this one move the row out of its section, so the refreshed page unmounts this
 * form in the same update that carries the result, and an effect would never run.
 */
export function OwnerForm({
  action,
  className,
  children,
}: {
  action: (prev: ReviewResult, form: FormData) => Promise<ReviewResult>;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, run, pending] = useActionState(async (prev: ReviewResult, form: FormData) => {
    const r = await action(prev, form);
    if (r.go) router.push(r.go);
    return r;
  }, {});
  return (
    <form action={run} className={className} aria-busy={pending}>
      <fieldset disabled={pending} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        {children}
      </fieldset>
      {state.error && <div className="ks-err">{state.error}</div>}
    </form>
  );
}
