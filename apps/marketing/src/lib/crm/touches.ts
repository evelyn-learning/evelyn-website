import type { ITouch } from "@/models/Lead";
import type { LeadStatus } from "@/lib/outreach/enums";

export type IncomingTouch = Omit<ITouch, "externalId"> & { externalId: string };

/**
 * Idempotent append: drop incoming touches whose externalId already exists;
 * keep the list sorted by `at`. `fresh` carries just the newly-added touches
 * (see applyIngestStatus's `touches` argument, which must reflect only
 * these) without changing the meaning of `touches`/`added`.
 */
export function mergeTouches(
  existing: ITouch[],
  incoming: IncomingTouch[]
): { touches: ITouch[]; added: number; fresh: ITouch[] } {
  // The pre-existing reply watcher writes inbound touches keyed by
  // `gmailMessageId` with no `externalId`, while ingest writes both
  // `externalId: "gmail:<id>"` and `gmailMessageId`. Seed `seen` with both
  // keys for every existing touch so a lead that's been both watched and
  // CRM-labelled doesn't end up with two touches for the same message.
  const seen = new Set<string>();
  for (const t of existing) {
    if (t.externalId) seen.add(t.externalId);
    if (t.gmailMessageId) seen.add(`gmail:${t.gmailMessageId}`);
  }
  const fresh: ITouch[] = [];
  for (const t of incoming) {
    const gmailKey = t.gmailMessageId ? `gmail:${t.gmailMessageId}` : undefined;
    if (seen.has(t.externalId) || (gmailKey && seen.has(gmailKey))) continue;
    seen.add(t.externalId);
    if (gmailKey) seen.add(gmailKey);
    fresh.push(t);
  }
  const touches = [...existing, ...fresh].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return { touches, added: fresh.length, fresh };
}

const FROZEN: LeadStatus[] = ["dead", "replied", "call_booked"];

/** Spec §5 + §8e. Mutates `lead`. */
export function applyIngestStatus(
  lead: { status: LeadStatus; nextActionAt?: Date | null; needsReview: boolean },
  touches: ITouch[],
  opts: { created: boolean; flagReview: boolean }
): void {
  if (FROZEN.includes(lead.status)) return;
  const hasInbound = touches.some((t) => t.direction === "inbound");
  if (hasInbound) {
    lead.status = "replied";
    lead.nextActionAt = null;
    lead.needsReview = false;
    return;
  }
  if (opts.created) {
    if (opts.flagReview) {
      lead.status = "staged";
      lead.needsReview = true;
    } else {
      lead.status = "contacted";
      lead.nextActionAt = null;
    }
  }
}
