import type { ITouch } from "@/models/Lead";
import type { LeadStatus } from "@/lib/outreach/enums";

export type IncomingTouch = Omit<ITouch, "externalId"> & { externalId: string };

/** Idempotent append: drop incoming touches whose externalId already exists; keep the list sorted by `at`. */
export function mergeTouches(existing: ITouch[], incoming: IncomingTouch[]): { touches: ITouch[]; added: number } {
  const seen = new Set(existing.map((t) => t.externalId).filter(Boolean) as string[]);
  const fresh: ITouch[] = [];
  for (const t of incoming) {
    if (seen.has(t.externalId)) continue;
    seen.add(t.externalId);
    fresh.push(t);
  }
  const touches = [...existing, ...fresh].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return { touches, added: fresh.length };
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
