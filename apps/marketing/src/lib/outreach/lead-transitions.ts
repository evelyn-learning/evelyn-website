// The approve / kill state transitions, lifted out of the per-lead PATCH
// route so the bulk route (POST /api/admin/outreach/leads/bulk) applies
// byte-identical rules. Before this existed the transitions lived inline in
// the route's switch; a second caller would have meant a second copy of the
// staged-only guard, the demo-token mint, and the nextActionAt/approvedAt
// writes — three chances to drift on a path that emails real prospects.
//
// Mongoose-free and DB-free: callers pass a loaded document (or a plain
// object in tests) and save it themselves.
import type { LeadStatus } from "./enums";

export interface TransitionLead {
  status: LeadStatus;
  demoToken?: string;
  nextActionAt?: Date | null;
  approvedAt?: Date | null;
}

export type TransitionResult = { ok: true } | { ok: false; reason: string };

/** Fresh per-lead demo token. Injected so tests stay deterministic. */
export type MintToken = () => string;

/**
 * staged -> approved.
 *
 * `nextActionAt = now` is what puts the lead on the Today tab immediately;
 * `approvedAt` is what orders it there (see ./today-order.ts) and is the
 * reason this transition can't just be a status assignment. The demo token
 * is minted once and never re-minted — it's already baked into any link
 * that went out.
 */
export function applyApprove(
  lead: TransitionLead,
  now: Date,
  mintToken: MintToken
): TransitionResult {
  if (lead.status !== "staged") {
    return { ok: false, reason: `only staged leads can be approved (is "${lead.status}")` };
  }
  lead.status = "approved";
  lead.demoToken = lead.demoToken ?? mintToken();
  lead.nextActionAt = now;
  lead.approvedAt = now;
  return { ok: true };
}

/**
 * any -> dead.
 *
 * Deliberately allowed from every status (that's the pre-existing single-lead
 * behaviour): killing a lead that already replied or was parked is a valid
 * owner verdict. Clearing nextActionAt is what drops it off Today.
 * `approvedAt` is left alone — it's a historical fact, and keeping it means
 * an un-kill (setStatus back to approved) lands in the right Today slot.
 */
export function applyKill(lead: TransitionLead): TransitionResult {
  lead.status = "dead";
  lead.nextActionAt = null;
  return { ok: true };
}
