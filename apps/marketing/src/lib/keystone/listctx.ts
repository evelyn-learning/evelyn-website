import { STAGES, STAGE_LABEL, SUBJECTS, type Stage } from "./config";

// The list an item was opened from travels in the item URL
// (/item/303439?stage=approved&subject=Mathematics), so the position
// ("1 of 9"), prev/next, J/K, the auto-advance after a verdict and the back
// link all stay inside that list. `from` names a non-filter origin
// (overview, export). No context = all items.

export type ListCtx = { stage?: Stage; subject?: string; from?: "overview" | "export" };

export function parseCtx(sp: Record<string, string | string[] | undefined> | URLSearchParams): ListCtx {
  const get = (k: string) => {
    const v = sp instanceof URLSearchParams ? sp.get(k) : sp[k];
    return Array.isArray(v) ? v[0] : (v ?? undefined);
  };
  const stage = get("stage");
  const subject = get("subject");
  const from = get("from");
  return {
    stage: STAGES.includes(stage as Stage) ? (stage as Stage) : undefined,
    subject: SUBJECTS.includes(subject as (typeof SUBJECTS)[number]) ? subject : undefined,
    from: from === "overview" || from === "export" ? from : undefined,
  };
}

/** "?stage=approved&subject=Physics" (or "" when there is no context). */
export function ctxQuery(c: ListCtx, extra?: Record<string, string>): string {
  const q = new URLSearchParams();
  if (c.stage) q.set("stage", c.stage);
  if (c.subject) q.set("subject", c.subject);
  if (c.from) q.set("from", c.from);
  for (const [k, v] of Object.entries(extra ?? {})) q.set(k, v);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const isFiltered = (c: ListCtx) => !!(c.stage || c.subject);

/** Name of the list, e.g. "Approved · Physics", "All items". */
export function ctxLabel(c: ListCtx): string {
  if (c.from === "overview") return "Overview";
  if (c.from === "export") return "Download for SOLARO";
  return [c.stage ? STAGE_LABEL[c.stage] : c.subject ? "" : "All items", c.subject].filter(Boolean).join(" · ");
}

/** Where "← back" goes for this context. */
export function ctxBackHref(base: string, c: ListCtx): string {
  if (c.from === "overview") return base || "/";
  if (c.from === "export") return `${base}/export`;
  return `${base}/items${ctxQuery({ stage: c.stage, subject: c.subject })}`;
}
