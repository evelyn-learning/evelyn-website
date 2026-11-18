import Link from "next/link";
import { holdAction, keepHoldingAction, sendBackAction, sendToReviewAction } from "../actions";
import { OwnerForm as ActionForm } from "./OwnerForm";

// Evelyn only: rendered by pages that have already checked the role on the server; each action checks it again.

type Where = "queue" | "item";

const Hidden = ({ itemId, back }: { itemId: string; back: Where }) => (
  <>
    <input type="hidden" name="itemId" value={itemId} />
    <input type="hidden" name="back" value={back} />
  </>
);

/** Send to review / Keep holding / Send back (with the note the author must address). `ids` marks the controls the S / B keys use. */
export function HeldControls({ itemId, back, openHref, ids = false }: { itemId: string; back: Where; openHref?: string; ids?: boolean }) {
  return (
    <div className="ks-q-ctl">
      {openHref && (
        <Link className="ks-btn" href={openHref}>
          Open
        </Link>
      )}
      <ActionForm action={sendToReviewAction} className="ks-q-form">
        <Hidden itemId={itemId} back={back} />
        <button className="ks-btn ok" id={ids ? "ks-owner-send" : undefined}>
          Send to review{ids && <kbd>S</kbd>}
        </button>
      </ActionForm>
      <ActionForm action={keepHoldingAction} className="ks-q-form">
        <Hidden itemId={itemId} back={back} />
        <button className="ks-btn">Keep holding</button>
      </ActionForm>
      <details className="ks-q-back" id={ids ? "ks-owner-back" : undefined}>
        <summary className="ks-btn warn">Send back{ids && <kbd>B</kbd>}</summary>
        <ActionForm action={sendBackAction} className="ks-q-backform">
          <Hidden itemId={itemId} back={back} />
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
      </details>
    </div>
  );
}

export function HoldControl({ itemId, back, openHref }: { itemId: string; back: Where; openHref?: string }) {
  return (
    <div className="ks-q-ctl">
      {openHref && (
        <Link className="ks-btn" href={openHref}>
          Open
        </Link>
      )}
      <ActionForm action={holdAction} className="ks-q-form">
        <Hidden itemId={itemId} back={back} />
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
};

export function DoneNote({ done }: { done?: string }) {
  const text = done ? DONE[done] : undefined;
  return text ? <div className="ks-note info ks-q-done">{text}</div> : null;
}
