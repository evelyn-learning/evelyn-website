// What "waiting on the owner" means, in one place: the queue page (ownerQueue), the top bar's count and the
// daily email (status.ts waitingOnPraveen) all read it from here, so the three numbers cannot disagree.
// Internal: never shown to the client. No `next/*` imports: this runs from tsx scripts too.

import type { Stage } from "../config";

/** Stages in which a hold comes before any solution exists (received, drafting). */
export const BEFORE_SOLUTION_STAGES: readonly Stage[] = ["received", "drafting"];

type HoldView = { stage: Stage; pipeline?: { heldFor?: string } | null };

/** Any item held for Praveen, whatever its stage: what the top bar counts and the email lists. */
export const needsOwner = (i: HoldView) => i.pipeline?.heldFor === "praveen";
/** "Waiting for you": held with a solution stage (ready, a held send-back at changes_requested, a re-sent question mid-review or after). */
export const waitingOnOwner = (i: HoldView) => needsOwner(i) && !BEFORE_SOLUTION_STAGES.includes(i.stage);
/** "Held before a solution": held while still received or drafting. */
export const heldBeforeSolution = (i: HoldView) => needsOwner(i) && BEFORE_SOLUTION_STAGES.includes(i.stage);

/** Mongo filters for the same three predicates. */
export const NEEDS_OWNER_FILTER = { "pipeline.heldFor": "praveen" } as const;
export const WAITING_ON_OWNER_FILTER = { "pipeline.heldFor": "praveen", stage: { $nin: [...BEFORE_SOLUTION_STAGES] } } as const;
export const HELD_BEFORE_SOLUTION_FILTER = { "pipeline.heldFor": "praveen", stage: { $in: [...BEFORE_SOLUTION_STAGES] } } as const;
