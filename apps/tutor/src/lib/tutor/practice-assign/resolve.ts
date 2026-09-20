/**
 * Homework item resolver (spec §C.3). Pure over an injected PracticeSources:
 * per LO, retrieve `perLo` items at the band's difficulty (falling back to
 * any difficulty when the band-filtered pool is empty), excluding items the
 * student has already seen (evidence itemIds), then cap the whole set at
 * `cap`, weakest LO first (the caller orders `los`).
 *
 * Generate-on-exhaustion is deliberately NOT invoked here: homework must be
 * vetted bank/plan items, never a fresh LLM generation at session close.
 * `retrievePractice`'s shortfall path (practice.ts ~L181-235) only fires
 * generation when it's handed a `genSources` AND the derived-topic lookup
 * succeeds — but that path's own kill switch (`PRACTICE_GEN==='on'`, checked
 * first thing inside `generatePracticeItems`) is an ENVIRONMENT setting, not
 * a structural guarantee available to this pure module. Rather than lean on
 * that external kill switch (which could be 'on' in prod for the live tutor
 * session's brain-gen), this resolver passes a `noGen` stub implementing the
 * real `PracticeGenSources` shape whose `reserve` always grants 0 slots —
 * `generatePracticeItems` returns `[]` the instant `allowed <= 0`, before it
 * ever calls `generateAndVerify` or touches Anthropic/Mongo. That holds
 * regardless of the `PRACTICE_GEN` env var, so homework resolution can never
 * trigger generation no matter how the surrounding environment is configured.
 */
import type { PracticeItem } from '@evelyn/portal-contract/v1';
import { retrievePractice, type PracticeSources } from '@/lib/tutor/portal/practice';
import type { PracticeGenSources } from '@/lib/tutor/portal/practice-gen';
import type { AbilityBand } from '@/lib/tutor/learner-model/hints';

export const ASSIGN_TUNING = { perLo: 4, cap: 8 };

export function difficultyForBand(band: AbilityBand): 1 | 2 | 3 {
  return band === 'building' ? 1 : band === 'strong' ? 3 : 2;
}

/** Never generates: `reserve` grants zero slots, so `generatePracticeItems`
 *  returns `[]` before any Anthropic/Mongo call regardless of the
 *  `PRACTICE_GEN` kill switch's runtime value. */
const noGen: PracticeGenSources = {
  async generateAndVerify() {
    return null;
  },
  async reserve() {
    return 0;
  },
  async persist() {},
};

export async function resolveAssignmentItems(
  input: {
    los: Array<{ loId: string; title: string }>;
    band: AbilityBand;
    seenItemIds: string[];
    studentId: string;
    courseId: string;
  },
  sources: PracticeSources,
  retrieve: typeof retrievePractice = retrievePractice,
): Promise<Array<{ loId: string; title: string; items: PracticeItem[] }>> {
  const out: Array<{ loId: string; title: string; items: PracticeItem[] }> = [];
  let remaining = ASSIGN_TUNING.cap;
  const difficulty = difficultyForBand(input.band);
  for (const lo of input.los) {
    if (remaining <= 0) break;
    const count = Math.min(ASSIGN_TUNING.perLo, remaining);
    const base = {
      studentId: input.studentId,
      courseId: input.courseId,
      scope: { loId: lo.loId } as const,
      count,
      excludeIds: input.seenItemIds.slice(0, 500),
    };
    let res = await retrieve({ ...base, difficulty }, sources, noGen);
    if (res.items.length === 0) res = await retrieve(base, sources, noGen);
    if (res.items.length === 0) continue;
    const items = res.items.slice(0, count);
    out.push({ loId: lo.loId, title: lo.title, items });
    remaining -= items.length;
  }
  return out;
}
