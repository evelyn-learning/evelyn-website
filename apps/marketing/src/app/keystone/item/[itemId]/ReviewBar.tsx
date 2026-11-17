"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import type { Stage } from "@/lib/keystone/config";
import { reviewAction, type ReviewResult } from "../../actions";

/**
 * Fixed bar at the bottom of every item: comment box, Approve, the three ways
 * to send an item back, and next / previous. Sending back names whose job it
 * is: Fix solution → Evelyn; Item data → Castle Rock technical (the question
 * as exported is incomplete or wrong); Reject → the item is withdrawn.
 * Keys (when not typing): A approve, C fix solution, D item data, X reject,
 * J next, K previous. After a verdict the server moves on to the next item
 * waiting for review.
 *
 * A key query (stage key_query) is not a solution: the bar offers The key is
 * right (R), Item data, Reject item and Comment; no Approve, no Fix solution.
 */
const SEND_BACK = [
  { intent: "changes", key: "c", label: "Fix solution", needsSolution: true, title: "The solution needs changes. Goes back to Evelyn." },
  { intent: "item_data", key: "d", label: "Item data", needsSolution: false, title: "The question is incomplete or wrong as exported. Goes to Castle Rock technical to re-send; then back to Evelyn." },
  { intent: "rejected", key: "x", label: "Reject item", needsSolution: false, title: "The item itself is wrong or withdrawn. No solution needed." },
] as const;

const KEY_RIGHT = {
  intent: "key_right",
  key: "r",
  label: "The key is right",
  needsSolution: false,
  title: "Our working is wrong and the key stands. Goes back to Evelyn to write the solution.",
} as const;

/** The decisions after Approve: on a key query, confirming the key replaces the solution ones. */
const decisionsFor = (stage: Stage) => (stage === "key_query" ? [KEY_RIGHT, ...SEND_BACK.filter((b) => !b.needsSolution)] : SEND_BACK);

export function ReviewBar(props: {
  itemId: string;
  base: string;
  /** The list being browsed ("?stage=approved…"), so the next item after a verdict comes from the same list. */
  ctx: string;
  canReview: boolean;
  /** Approve and Fix solution need a solution; an item can be flagged or rejected without one. */
  hasSolution: boolean;
  stage: Stage;
  position: string;
  nextHref: string | null;
  prevHref: string | null;
}) {
  const [state, action, pending] = useActionState<ReviewResult, FormData>(reviewAction, {});
  const form = useRef<HTMLFormElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const keyQuery = props.stage === "key_query";

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
      else if (k === "a" && props.canReview) {
        if (props.stage !== "key_query") submit("approve");
      } else if (props.canReview) {
        const back = decisionsFor(props.stage).find((b) => b.key === k);
        if (!back) return;
        // Sending back needs its reason: with an empty box the key puts the cursor there.
        if (box.current && !box.current.value.trim()) {
          e.preventDefault();
          box.current.focus();
        } else submit(back.intent);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props.nextHref, props.prevHref, props.canReview, props.stage, router]);

  return (
    <div className="ks-bar">
      <form ref={form} action={action} className="ks-bar-in">
        <input type="hidden" name="itemId" value={props.itemId} />
        <input type="hidden" name="ctx" value={props.ctx} />
        <textarea
          ref={box}
          name="comment"
          placeholder={props.canReview ? "Comment, or the reason (required to send an item back)" : "Add a comment"}
          disabled={pending}
        />
        {props.canReview && (
          <>
            {!keyQuery && (
              <button className="ks-btn ok" name="intent" value="approve" disabled={pending || !props.hasSolution}>
                Approve <kbd>A</kbd>
              </button>
            )}
            {decisionsFor(props.stage).map((b) => (
              <button
                key={b.intent}
                className={`ks-btn ${b.intent === "rejected" ? "bad" : b.intent === "key_right" ? "ok" : "warn"}`}
                name="intent"
                value={b.intent}
                title={b.title}
                disabled={pending || (b.needsSolution && !props.hasSolution)}
              >
                {b.label} <kbd>{b.key.toUpperCase()}</kbd>
              </button>
            ))}
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
