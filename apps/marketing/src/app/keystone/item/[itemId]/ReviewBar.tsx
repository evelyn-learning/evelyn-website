"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import type { Stage } from "@/lib/keystone/config";
import { reviewAction, type ReviewResult } from "../../actions";

/**
 * Fixed bar at the bottom of every item: comment box, Approve / Needs changes,
 * and next / previous. Keys (when not typing): A approve, C needs changes,
 * J next, K previous. After a verdict the server moves on to the next item
 * waiting for review.
 */
export function ReviewBar(props: {
  itemId: string;
  base: string;
  canReview: boolean;
  stage: Stage;
  position: string;
  nextHref: string | null;
  prevHref: string | null;
}) {
  const [state, action, pending] = useActionState<ReviewResult, FormData>(reviewAction, {});
  const form = useRef<HTMLFormElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.go) router.push(state.go);
  }, [state.go, router]);
  useEffect(() => {
    if (state.ok && box.current) box.current.value = "";
  }, [state.ok]);

  useEffect(() => {
    const submit = (intent: string) => {
      const f = form.current;
      if (!f) return;
      const btn = f.querySelector<HTMLButtonElement>(`button[value="${intent}"]`);
      if (btn && !btn.disabled) f.requestSubmit(btn);
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector("dialog[open]")) return; // the player is open: keys belong to it
      if (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.tagName === "SELECT") {
        if (e.key === "Escape") t.blur();
        return;
      }
      const k = e.key.toLowerCase();
      if (k === "j" && props.nextHref) router.push(props.nextHref);
      else if (k === "k" && props.prevHref) router.push(props.prevHref);
      else if (k === "a" && props.canReview) submit("approve");
      else if (k === "c" && props.canReview) {
        if (box.current && !box.current.value.trim()) {
          e.preventDefault();
          box.current.focus();
        } else submit("changes");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props.nextHref, props.prevHref, props.canReview, router]);

  return (
    <div className="ks-bar">
      <form ref={form} action={action} className="ks-bar-in">
        <input type="hidden" name="itemId" value={props.itemId} />
        <textarea
          ref={box}
          name="comment"
          placeholder={props.canReview ? "Comment, or what needs to change (required for Needs changes)" : "Add a comment"}
          disabled={pending}
        />
        {props.canReview && (
          <>
            <button className="ks-btn ok" name="intent" value="approve" disabled={pending}>
              Approve <kbd>A</kbd>
            </button>
            <button className="ks-btn warn" name="intent" value="changes" disabled={pending}>
              Needs changes <kbd>C</kbd>
            </button>
          </>
        )}
        <button className="ks-btn" name="intent" value="comment" disabled={pending}>
          Comment
        </button>
        <span className="pos">
          {props.prevHref && (
            <Link href={props.prevHref} className="ks-btn" style={{ padding: "4px 10px" }}>
              ‹ <kbd>K</kbd>
            </Link>
          )}{" "}
          {props.position}{" "}
          {props.nextHref && (
            <Link href={props.nextHref} className="ks-btn" style={{ padding: "4px 10px" }}>
              <kbd>J</kbd> ›
            </Link>
          )}
        </span>
        {state.error && <div className="msg">{state.error}</div>}
      </form>
    </div>
  );
}
