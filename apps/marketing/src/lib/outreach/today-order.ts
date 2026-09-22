// Ordering for the Today tab's due list.
//
// Before this, Today rendered whatever order the leads API returned
// (`nextActionAt: 1, updatedAt: -1`) — oldest-due first, which buried a lead
// you'd just approved under every stale follow-up in the queue. The owner's
// working order is:
//
//   1. newly approved  — approved and never actually contacted
//   2. verified email  — anything else we can reach at a confirmed address
//   3. the rest
//
// ...each tier newest-approved first, so today's batch sits at the top of
// its tier and the queue reads like a worklist rather than a backlog.
//
// Tier 1 is defined by "no outbound touch yet" rather than by a clock: a
// lead you approved on Monday and haven't emailed is still un-started work
// on Thursday, and a 48h window would silently drop it to the bottom
// mid-job. Sending the first touch is what graduates it.
//
// Pure and DB-free so both the client tab and any future server-side
// ordering can share it.

import { isCadenceTouch } from "./cadence";
import type { TouchOrigin } from "./enums";

export const TODAY_TIERS = ["newly_approved", "verified_email", "rest"] as const;
export type TodayTier = (typeof TODAY_TIERS)[number];

export interface TodayOrderLead {
  status: string;
  touches: Array<{ direction: string; origin?: TouchOrigin }>;
  decisionMaker?: { emailVerified?: boolean } | null;
  approvedAt?: string | Date | null;
  createdAt: string | Date;
}

export function todayTier(lead: TodayOrderLead): TodayTier {
  // An imported touch (a real historical thread, a LinkedIn/contact-form
  // message) isn't outreach the operator actually sent — a lead whose only
  // touches came in via import has never been worked and still belongs in
  // newly_approved, same as isCadenceTouch's use in cadence.ts/TodayTab.
  const contacted = lead.touches.some((t) => t.direction === "outbound" && isCadenceTouch(t));
  if (lead.status === "approved" && !contacted) return "newly_approved";
  if (lead.decisionMaker?.emailVerified) return "verified_email";
  return "rest";
}

/**
 * The lead's position in time within its tier.
 *
 * `approvedAt` only exists on leads approved after it shipped, so the whole
 * pre-existing pipeline would otherwise sort as one undifferentiated blob.
 * `createdAt` is the fallback rather than `updatedAt`: it's stable, and
 * roughly tracks approval order for a backlog that was approved as it came
 * in — whereas `updatedAt` churns on every draft generation and would
 * reshuffle the queue underneath the operator as they work it.
 */
export function todayOrderTime(lead: TodayOrderLead): number {
  const raw = lead.approvedAt ?? lead.createdAt;
  const ms = new Date(raw).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

/** Tier ascending, then approval time descending. Does not mutate `leads`. */
export function sortTodayLeads<T extends TodayOrderLead>(leads: readonly T[]): T[] {
  const rank = (l: T) => TODAY_TIERS.indexOf(todayTier(l));
  // Array.prototype.sort is stable, so leads that tie on both keys keep the
  // order the API returned instead of jittering between refreshes.
  return [...leads].sort(
    (a, b) => rank(a) - rank(b) || todayOrderTime(b) - todayOrderTime(a)
  );
}
