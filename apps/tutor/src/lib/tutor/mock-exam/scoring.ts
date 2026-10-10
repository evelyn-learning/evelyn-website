import type { ExamBlueprint, CurveAnchor } from './blueprints';
import type { SeedableItem } from './fixtures';
import {
  numericRuleVerdict,
  parseNumericKey,
  readAnswerNumber,
  readSingleNumber,
  type NumberForm,
} from '../portal/numeric-answer-rule';

/** Structural subset scoring needs to check an answer against an item. */
export interface AnswerCheckItem {
  responseFormat?: string;
  answer: string;
}

/**
 * A numeric KEY as the shared rule reads it. A plain number (integer, decimal,
 * fraction — the only forms scripts/seed-mock-form.ts's lint lets in) goes
 * through the shared key parser; any other single number ("1,200", "1.2e3",
 * "25%", "42 cm") through the shared reader, taken at its written value.
 * `null` = the key is not one number.
 */
function numericKeyForm(answer: string): NumberForm | null {
  const plain = parseNumericKey(answer);
  if (plain) return { value: plain.value, kind: plain.form, places: plain.places };
  const read = readSingleNumber(answer);
  return read ? { value: read.value, kind: read.kind, places: read.places } : null;
}

/**
 * Numeric item: the shared numeric rule (../portal/numeric-answer-rule.ts) —
 * the answer must EQUAL the key at the precision the key is written to. No
 * tolerance band: until 2026-10-10 this was `parseFloat` on both sides with a
 * 1% relative tolerance, which read only the leading number ("3/2" was 3,
 * "1,200" was 1) and accepted 42.2 for a key of 42. Do not add one back.
 *
 * Exam-specific, because a mock exam has no model judge to hand an undecided
 * answer to (practice grading does):
 *   - an answer that is not ONE number ("2 or 3", "1 1/2", words) is wrong;
 *   - a unit after the number is ignored — the item asks for a number and
 *     nothing here can check a unit; a percent sign leaves the value as
 *     written ("25%" is 25);
 *   - one key per item; a key that is not a number falls back to trimmed,
 *     case-insensitive text equality.
 */
function numericAnswerMatches(answer: string, given: string): boolean {
  const key = numericKeyForm(answer);
  if (!key) return given.toLowerCase() === answer.toLowerCase();
  const ans = readAnswerNumber(given);
  if (!ans) return false;
  return numericRuleVerdict(key, { value: ans.value, kind: ans.kind, places: ans.places });
}

/**
 * MCQ: letter compare, case-insensitive, matches on the leading letter of
 * `given` (so 'b' or 'B) foo' both match answer 'B'). Numeric: the shared
 * numeric rule, see `numericAnswerMatches`. Everything else: trimmed,
 * case-insensitive equality. `undefined`/empty `given` always fails to match.
 */
export function answersMatch(item: AnswerCheckItem, given: string | undefined): boolean {
  if (given === undefined) return false;
  const trimmedGiven = given.trim();
  if (trimmedGiven === '') return false;
  const answer = item.answer.trim();

  if (item.responseFormat === 'mcq') {
    const givenLetter = trimmedGiven[0]?.toUpperCase();
    const answerLetter = answer[0]?.toUpperCase();
    return !!givenLetter && givenLetter === answerLetter;
  }

  if (item.responseFormat === 'numeric') return numericAnswerMatches(answer, trimmedGiven);

  return trimmedGiven.toLowerCase() === answer.toLowerCase();
}

/**
 * Piecewise-linear interpolation between raw-score anchors, clamped to the
 * first/last anchor, rounded to the nearest `roundTo` (default 10 for
 * SAT-style 200-800 scales; callers pass 1 for tighter 1-36 / 10-40 scales).
 */
export function curveScaled(anchors: CurveAnchor[], raw: number, roundTo = 10): number {
  if (!anchors.length) return 0;
  const first = anchors[0];
  const last = anchors[anchors.length - 1];

  let value: number;
  if (raw <= first[0]) {
    value = first[1];
  } else if (raw >= last[0]) {
    value = last[1];
  } else {
    let lo = first, hi = last;
    for (let i = 1; i < anchors.length; i++) {
      if (raw <= anchors[i][0]) {
        lo = anchors[i - 1];
        hi = anchors[i];
        break;
      }
    }
    const frac = (raw - lo[0]) / (hi[0] - lo[0]);
    value = lo[1] + frac * (hi[1] - lo[1]);
  }
  return Math.round(value / roundTo) * roundTo;
}

/**
 * Tallies raw MCQ/numeric correctness per blueprint section (summed across
 * that section's served modules) and per LO, across all served modules.
 * FRQ items are excluded entirely — their raw points come from the grading
 * pass (Task 8's report path) and are folded in later by `applyCurves` via
 * `frqPointsBySection`.
 */
export function scoreMcqSections(
  blueprint: ExamBlueprint,
  servedModules: Array<{ sectionIdx: number; moduleId: string; itemIds: string[] }>,
  responses: Array<{ itemId: string; answer?: string }>,
  items: SeedableItem[]
): {
  rawSections: Array<{ sectionId: string; rawCorrect: number; rawTotal: number }>;
  loBreakdown: Array<{ loId: string; correct: number; total: number; sectionId?: string }>;
} {
  const itemById = new Map(items.map((it) => [it.id, it]));
  const responseByItem = new Map(responses.map((r) => [r.itemId, r.answer]));
  const rawSections: Array<{ sectionId: string; rawCorrect: number; rawTotal: number }> = [];
  const loMap = new Map<string, { correct: number; total: number; sectionId: string }>();

  blueprint.sections.forEach((section, sectionIdx) => {
    const modulesForSection = servedModules.filter((m) => m.sectionIdx === sectionIdx);
    if (!modulesForSection.length) return;

    let rawCorrect = 0;
    let rawTotal = 0;
    for (const mod of modulesForSection) {
      for (const itemId of mod.itemIds) {
        const item = itemById.get(itemId);
        if (!item || item.responseFormat === 'frq') continue;

        rawTotal += 1;
        const correct = answersMatch(item, responseByItem.get(itemId));
        if (correct) rawCorrect += 1;

        const lo = loMap.get(item.loId) ?? { correct: 0, total: 0, sectionId: section.sectionId };
        lo.total += 1;
        if (correct) lo.correct += 1;
        loMap.set(item.loId, lo);
      }
    }
    rawSections.push({ sectionId: section.sectionId, rawCorrect, rawTotal });
  });

  const loBreakdown = Array.from(loMap.entries()).map(([loId, v]) => ({
    loId, correct: v.correct, total: v.total, sectionId: v.sectionId,
  }));

  return { rawSections, loBreakdown };
}

export interface ScaledScores {
  composite: number;
  compositeMax: number;
  sections: Array<{
    sectionId: string;
    label: string;
    scaled: number;
    scaledMax: number;
    inComposite?: boolean;
  }>;
}

/**
 * Curves each section's raw score (folding in FRQ points for FRQ-based
 * sections) via the blueprint's curve anchors, then rolls sections up into
 * a composite per `scoring.kind`.
 */
export function applyCurves(
  blueprint: ExamBlueprint,
  rawSections: Array<{ sectionId: string; rawCorrect: number; rawTotal: number }>,
  moduleRouting: Array<{ sectionId: string; variant: 'easy' | 'hard' }>,
  frqPointsBySection: Record<string, { points: number; max: number }>
): { scaled: ScaledScores; composite: number } {
  const { scoring } = blueprint;
  const roundTo = scoring.sectionScaledMax <= 50 ? 1 : 10;

  const rawBySectionId = new Map(rawSections.map((rs) => [rs.sectionId, rs]));
  const sectionIdSet = new Set<string>([
    ...rawSections.map((rs) => rs.sectionId),
    ...Object.keys(frqPointsBySection),
  ]);
  const orderedSectionIds = blueprint.sections
    .map((s) => s.sectionId)
    .filter((sid) => sectionIdSet.has(sid));

  const sections: ScaledScores['sections'] = [];

  for (const sectionId of orderedSectionIds) {
    const blueprintSection = blueprint.sections.find((s) => s.sectionId === sectionId);
    if (!blueprintSection) continue;

    const rawEntry = rawBySectionId.get(sectionId);
    let raw = rawEntry ? rawEntry.rawCorrect : 0;
    const frq = frqPointsBySection[sectionId];
    if (frq) raw += frq.points;

    const variant = blueprintSection.adaptive
      ? moduleRouting.find((r) => r.sectionId === sectionId)?.variant ?? 'default'
      : 'default';
    const curveSet = scoring.curves[sectionId] ?? {};
    const anchors = curveSet[variant] ?? curveSet.default ?? [];
    const scaledValue = curveScaled(anchors, raw, roundTo);

    sections.push({
      sectionId,
      label: blueprintSection.label,
      scaled: scaledValue,
      scaledMax: scoring.sectionScaledMax,
      inComposite: blueprintSection.inComposite,
    });
  }

  let composite: number;
  if (scoring.kind === 'ap-composite') {
    let mcqCorrect = 0, mcqTotal = 0;
    for (const rs of rawSections) { mcqCorrect += rs.rawCorrect; mcqTotal += rs.rawTotal; }
    let frqPoints = 0, frqMax = 0;
    for (const key of Object.keys(frqPointsBySection)) {
      frqPoints += frqPointsBySection[key].points;
      frqMax += frqPointsBySection[key].max;
    }
    const mcqFraction = mcqTotal ? mcqCorrect / mcqTotal : 0;
    const frqFraction = frqMax ? frqPoints / frqMax : 0;
    composite = apCompositeScore(mcqFraction, frqFraction, scoring.ap!);
  } else if (scoring.kind === 'act-composite') {
    const counted = sections.filter((s) => s.inComposite !== false);
    const sum = counted.reduce((acc, s) => acc + s.scaled, 0);
    composite = counted.length ? Math.round(sum / counted.length) : 0;
  } else {
    composite = sections.reduce((acc, s) => acc + s.scaled, 0);
  }

  return {
    scaled: { composite, compositeMax: scoring.compositeMax, sections },
    composite,
  };
}

/**
 * AP composite: weight the MCQ and FRQ fractions, then find the highest
 * score in {2,3,4,5} whose cutPoint is <= the weighted fraction; below the
 * lowest cutPoint (score 2's), the result is 1.
 */
export function apCompositeScore(
  mcqFraction: number,
  frqFraction: number,
  ap: { mcqWeight: number; frqWeight: number; cutPoints: [number, number, number, number] }
): 1 | 2 | 3 | 4 | 5 {
  const fraction = ap.mcqWeight * mcqFraction + ap.frqWeight * frqFraction;
  const tiers: Array<{ score: 2 | 3 | 4 | 5; cutPoint: number }> = [
    { score: 5, cutPoint: ap.cutPoints[3] },
    { score: 4, cutPoint: ap.cutPoints[2] },
    { score: 3, cutPoint: ap.cutPoints[1] },
    { score: 2, cutPoint: ap.cutPoints[0] },
  ];
  for (const tier of tiers) {
    if (fraction >= tier.cutPoint) return tier.score;
  }
  return 1;
}
