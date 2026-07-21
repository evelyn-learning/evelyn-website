/**
 * Mock-review focus selection: which missed items the tutor opens on.
 * A "miss" = MCQ/numeric with isCorrect === false, or an FRQ scoring
 * < FRQ_MISS_RATIO of its rubric points. Priority: marked-for-review
 * misses (exam order) -> FRQ misses by ascending score ratio -> MCQ
 * misses round-robin across loId groups (unit spread), capped at 8.
 * Pure functions — unit-tested without Mongo or a brain turn.
 */
import type { MockReviewItem } from '@evelyn/portal-contract/v1';

export const FOCUS_CAP = 8;
const FRQ_MISS_RATIO = 0.7;
const PASSAGE_EXCERPT_CHARS = 1197;

export interface MockReviewFocusItem {
  sectionLabel: string;
  problemText: string;
  choices?: string[];
  studentAnswer: string;          // 'no answer' when blank
  correctAnswer?: string;
  solutionText?: string;
  passageExcerpt?: string;
  frqFeedback?: Array<{ criterionId: string; pointsAwarded: number; maxPoints: number; feedback: string }>;
  loId?: string;
}

export interface MockReviewContext {
  formLabel: string;
  composite: number;
  compositeMax: number;
  focusItems: MockReviewFocusItem[];
  remainingMissSummary: Array<{ unitLabel: string; missed: number }>;
  totalMissed: number;
}

function frqRatio(it: MockReviewItem): number {
  const g = it.frqGrade;
  if (!g || g.maxPoints <= 0) return 1;
  return g.totalPoints / g.maxPoints;
}

function isMiss(it: MockReviewItem): boolean {
  if (it.responseFormat === 'frq') return frqRatio(it) < FRQ_MISS_RATIO;
  return it.isCorrect === false;
}

export function selectMockReviewFocus(
  items: MockReviewItem[],
  cap: number = FOCUS_CAP,
): { focus: MockReviewItem[]; remaining: MockReviewItem[] } {
  const misses = items.filter(isMiss);
  const marked = misses.filter((m) => m.markedForReview);
  const frqs = misses
    .filter((m) => !m.markedForReview && m.responseFormat === 'frq')
    .sort((a, b) => frqRatio(a) - frqRatio(b));
  const mcqs = misses.filter((m) => !m.markedForReview && m.responseFormat !== 'frq');

  // Round-robin MCQ misses across loId groups so one weak unit can't
  // monopolize the focus list; stable exam order within each group.
  const byLo = new Map<string, MockReviewItem[]>();
  for (const m of mcqs) {
    const key = m.loId ?? '(none)';
    byLo.set(key, [...(byLo.get(key) ?? []), m]);
  }
  const groups = Array.from(byLo.values());
  const spread: MockReviewItem[] = [];
  for (let round = 0; spread.length < mcqs.length; round++) {
    for (const g of groups) if (g[round]) spread.push(g[round]);
  }

  const ordered = [...marked, ...frqs, ...spread];
  return { focus: ordered.slice(0, cap), remaining: ordered.slice(cap) };
}

export function buildMockReviewContext(args: {
  formLabel: string;
  composite: number;
  compositeMax: number;
  items: MockReviewItem[];
  unitLabelOf?: (loId: string) => string;
}): MockReviewContext {
  const { focus, remaining } = selectMockReviewFocus(args.items);
  const label = args.unitLabelOf ?? ((loId: string) => loId);

  const summary = new Map<string, number>();
  for (const r of remaining) {
    const key = r.loId ? label(r.loId) : '(uncategorized)';
    summary.set(key, (summary.get(key) ?? 0) + 1);
  }

  return {
    formLabel: args.formLabel,
    composite: args.composite,
    compositeMax: args.compositeMax,
    totalMissed: focus.length + remaining.length,
    focusItems: focus.map((it) => ({
      sectionLabel: it.sectionLabel,
      problemText: it.problemText,
      choices: it.choices,
      studentAnswer: it.studentAnswer?.trim() ? it.studentAnswer : 'no answer',
      correctAnswer: it.correctAnswer,
      solutionText: it.solutionText,
      passageExcerpt: it.passage
        ? it.passage.text.slice(0, PASSAGE_EXCERPT_CHARS) +
          (it.passage.text.length > PASSAGE_EXCERPT_CHARS ? ' […truncated]' : '')
        : undefined,
      frqFeedback: it.frqGrade?.parts,
      loId: it.loId,
    })),
    remainingMissSummary: Array.from(summary.entries()).map(([unitLabel, missed]) => ({ unitLabel, missed })),
  };
}
