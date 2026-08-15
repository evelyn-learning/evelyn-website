/**
 * Engine ↔ contract drift guards (consumer side).
 *
 * Relocated here from the extracted @evelyn/portal-contract package, which must
 * stay self-contained (no engine imports). This is where both the ENGINE
 * interfaces and the contract mirrors are in scope, so it's the right place
 * for the compile-time assertion: if an engine interface stops being
 * assignable to its contract mirror, the build fails HERE — forcing a
 * deliberate contract update + package version bump rather than silent skew.
 *
 * Type-only (erased at runtime, zero cost). Checked by `tsc`/`next build`
 * (it's in src/) and exercised by `test-portal-contract.ts` via a
 * side-effect import.
 */

import type {
  MasteryEntry as EngineMasteryEntry,
  GapEntry as EngineGapEntry,
} from '@/lib/tutor/student-profile/types';
import type {
  RenderedTopicNotes as EngineRenderedTopicNotes,
  RenderedUnitNotes as EngineRenderedUnitNotes,
} from '@/lib/tutor/topic-notes/types';
import type { MasteryEntry, GapEntry, RenderedTopicNotes, RenderedUnitNotes } from '@evelyn/portal-contract/v1';

/** `true` only if A is assignable to B; otherwise a type error. */
type AssertAssignable<A extends B, B> = A;

// The engine's output must always satisfy the contract the portal reads.
type _GuardMastery = AssertAssignable<EngineMasteryEntry, MasteryEntry>;
type _GuardGap = AssertAssignable<EngineGapEntry, GapEntry>;
type _GuardNotes = AssertAssignable<EngineRenderedTopicNotes, RenderedTopicNotes>;
type _GuardUnitNotes = AssertAssignable<EngineRenderedUnitNotes, RenderedUnitNotes>;

export type __ContractDriftGuards = [_GuardMastery, _GuardGap, _GuardNotes, _GuardUnitNotes];

// Taxonomy-generate (contract v1.14.0): no guard needed here. Unlike the
// types above, the engine does NOT re-declare a local Taxonomy/DraftTaxonomy
// shape — taxonomy-generate.ts and its route import TaxonomyGenerateRequest,
// TaxonomyGenerateResponse, and DraftTaxonomy directly from
// @evelyn/portal-contract/v1 and use them as-is. There's no second,
// engine-owned type that could drift out from under the contract's, so
// there's nothing for an AssertAssignable pair to check.
