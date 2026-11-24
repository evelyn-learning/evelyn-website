import Link from "next/link";
import { clearHoldAction, holdAction, keepHoldingAction, sendBackAction, sendToReviewAction } from "../actions";
import { OwnerForm as ActionForm } from "./OwnerForm";

// Evelyn only: rendered by pages that have already checked the role on the server; each action checks it again.

type Where = "queue" | "item";

// `ctx` is the list the item page was opened from ("?stage=ready"): kept on the way back so prev/next stay in that list.
const Hidden = ({ itemId, back, ctx }: { itemId: string; back: Where; ctx?: string }) => (
  <>
    <input type="hidden" name="itemId" value={itemId} />
    <input type="hidden" name="back" value={back} />
    {ctx && <input type="hidden" name="ctx" value={ctx} />}
  </>
);

/**
 * Send to review / Keep holding / Send back (with the note the author must address) / Seen: clear the hold.
 * `ids` marks the controls the S / B keys use. `canSend`, `canSendBack`, `canClear` come from the queue row
 * (queries.ts ownerQueue); the item page shows a held ready version (send and send back).
 */
export function HeldControls({
  itemId, back, ctx, openHref, ids = false, canSend = true, canSendBack = true, canClear = false,
}: { itemId: string; back: Where; ctx?: string; openHref?: string; ids?: boolean; canSend?: boolean; canSendBack?: boolean; canClear?: boolean }) {
  return (
    <div className="ks-q-ctl">
      {openHref && (
        <Link className="ks-btn" href={openHref}>
          Open
        </Link>
      )}
      {canSend && (
        <ActionForm action={sendToReviewAction} className="ks-q-form">
          <Hidden itemId={itemId} back={back} ctx={ctx} />
          <button className="ks-btn ok" id={ids ? "ks-owner-send" : undefined}>
            Send to review{ids && <kbd>S</kbd>}
          </button>
        </ActionForm>
      )}
      <ActionForm action={keepHoldingAction} className="ks-q-form">
        <Hidden itemId={itemId} back={back} ctx={ctx} />
        <button className="ks-btn">Keep holding</button>
      </ActionForm>
      {canClear && (
        <ActionForm action={clearHoldAction} className="ks-q-form">
          <Hidden itemId={itemId} back={back} ctx={ctx} />
          <button className="ks-btn">Seen: clear the hold</button>
        </ActionForm>
      )}
      {canSendBack && <details className="ks-q-back" id={ids ? "ks-owner-back" : undefined}>
        <summary className="ks-btn warn">Send back{ids && <kbd>B</kbd>}</summary>
        <ActionForm action={sendBackAction} className="ks-q-backform">
          <Hidden itemId={itemId} back={back} ctx={ctx} />
          <textarea
            name="note"
            id={ids ? "ks-owner-note" : undefined}
            required
            maxLength={2000}
            aria-label="What the author must change"
            placeholder="What the author must change (required)"
          />
          <button className="ks-btn warn">Send back to the pipeline</button>
        </ActionForm>
      </details>}
    </div>
  );
}

export function HoldControl({ itemId, back, ctx, openHref }: { itemId: string; back: Where; ctx?: string; openHref?: string }) {
  return (
    <div className="ks-q-ctl">
      {openHref && (
        <Link className="ks-btn" href={openHref}>
          Open
        </Link>
      )}
      <ActionForm action={holdAction} className="ks-q-form">
        <Hidden itemId={itemId} back={back} ctx={ctx} />
        <button className="ks-btn warn">Hold this one</button>
      </ActionForm>
    </div>
  );
}

const DONE: Record<string, string> = {
  sent: "Sent to review. Castle Rock can see it now.",
  already: "That was already done; nothing changed.",
  sentback: "Sent back to the pipeline with your note. It stays hidden from Castle Rock until it is rewritten and you send it.",
  seen: "Marked as seen; still held.",
  held: "Held for you. It will not go out by itself.",
  cleared: "Hold cleared; the flag stays in the item's history.",
};

export function DoneNote({ done }: { done?: string }) {
  const text = done ? DONE[done] : undefined;
  return text ? <div className="ks-note info ks-q-done">{text}</div> : null;
}
