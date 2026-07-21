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
const PASSAGE_EXCERPT_CHARS = 1197; // + 13-char ' […truncated]' marker = 1210, the context bound

export interface MockReviewFocusItem {
  itemId: string;
  sectionLabel: string;
  responseFormat?: 'mcq' | 'numeric' | 'frq';
  problemText: string;
  choices?: string[];
  studentAnswer: string;          // 'no answer' when blank
  correctAnswer?: string;
  isCorrect?: boolean;            // undefined for FRQ; true for a pinned-but-correct MCQ/numeric
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
  // No grade at all (expired-partial reviews never grade FRQs): treat as a
  // miss — "ungraded" must not read as "perfect" in a review-focus feature.
  if (!g) return 0;
  if (g.maxPoints <= 0) return 1;
  return g.totalPoints / g.maxPoints;
}

function isMiss(it: MockReviewItem): boolean {
  if (it.responseFormat === 'frq') return frqRatio(it) < FRQ_MISS_RATIO;
  return it.isCorrect === false;
}

export function selectMockReviewFocus(
  items: MockReviewItem[],
  cap: number = FOCUS_CAP,
  pinItemIds: string[] = [],
): { focus: MockReviewItem[]; remaining: MockReviewItem[]; totalMissed: number } {
  const misses = items.filter(isMiss);

  // Pinned items come FIRST, in pinItemIds order — any item the student
  // marked (incl. a correct one they want to revisit), matched by itemId.
  // Unknown / duplicate ids are ignored.
  const byId = new Map(items.map((it) => [it.itemId, it] as const));
  const pinnedIds = new Set<string>();
  const pinned: MockReviewItem[] = [];
  for (const id of pinItemIds) {
    const it = byId.get(id);
    if (it && !pinnedIds.has(id)) { pinned.push(it); pinnedIds.add(id); }
  }

  // Miss-priority selection fills the remaining slots — over misses NOT
  // already pinned.
  const pool = misses.filter((m) => !pinnedIds.has(m.itemId));
  const marked = pool.filter((m) => m.markedForReview);
  const frqs = pool
    .filter((m) => !m.markedForReview && m.responseFormat === 'frq')
    .sort((a, b) => frqRatio(a) - frqRatio(b));
  const mcqs = pool.filter((m) => !m.markedForReview && m.responseFormat !== 'frq');

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

  const focus = [...pinned, ...marked, ...frqs, ...spread].slice(0, cap);
  // remaining / summary = MISSES not shown in focus (pinned-correct items
  // never count as misses, so they never appear here). totalMissed counts
  // misses only — a pinned correct item must not inflate it.
  const focusIds = new Set(focus.map((f) => f.itemId));
  const remaining = misses.filter((m) => !focusIds.has(m.itemId));
  return { focus, remaining, totalMissed: misses.length };
}

export function buildMockReviewContext(args: {
  formLabel: string;
  composite: number;
  compositeMax: number;
  items: MockReviewItem[];
  unitLabelOf?: (loId: string) => string;
  /** Item ids the student pinned for review — placed first in focusItems in
   *  this order, regardless of correctness. See selectMockReviewFocus. */
  pinItemIds?: string[];
}): MockReviewContext {
  const { focus, remaining, totalMissed } = selectMockReviewFocus(args.items, FOCUS_CAP, args.pinItemIds ?? []);
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
    totalMissed,
    focusItems: focus.map((it) => ({
      itemId: it.itemId,
      sectionLabel: it.sectionLabel,
      responseFormat: it.responseFormat,
      problemText: it.problemText,
      choices: it.choices,
      studentAnswer: it.studentAnswer?.trim() ? it.studentAnswer : 'no answer',
      correctAnswer: it.correctAnswer,
      isCorrect: it.isCorrect,
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

// ---------------------------------------------------------------------------
// Pre-start "review agenda" — the tappable question list the student sees
// before the session starts. Pure view-model derivation over the context;
// used by the runtime (VoiceTutorRealtime) to render SessionStage's agenda.
// ---------------------------------------------------------------------------

export interface MockReviewAgendaItem {
  /** 1-based position in the agenda list. */
  n: number;
  /** `${sectionLabel} — <first ~56 chars of the plain problem text>`. */
  label: string;
  /** MCQ/numeric: `✗ you: … · correct: …` or `✓ …`; FRQ: `points/max`. */
  result: string;
  /** Synthetic utterance fired when the row is tapped (starts the session on
   *  this item). */
  utterance: string;
}

/** Strip KaTeX `$` delimiters + light markdown so problem text reads as a
 *  plain one-line label; collapse whitespace. */
function stripInlineForLabel(s: string): string {
  return s
    .replace(/\$/g, '')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function agendaResult(it: MockReviewFocusItem): string {
  // FRQ (detected by rubric feedback presence): points/max from part sums.
  if (it.responseFormat === 'frq' || it.frqFeedback) {
    const parts = it.frqFeedback ?? [];
    const points = parts.reduce((s, p) => s + p.pointsAwarded, 0);
    const max = parts.reduce((s, p) => s + p.maxPoints, 0);
    return `${points}/${max}`;
  }
  if (it.isCorrect) return `✓ ${it.studentAnswer}`;
  return `✗ you: ${it.studentAnswer} · correct: ${it.correctAnswer ?? '—'}`;
}

/** Build the pre-start agenda (tappable list + the "+ N more" muted line)
 *  from a review context. Empty agenda when there's no context / no focus. */
export function buildMockReviewAgenda(ctx: MockReviewContext | undefined): {
  agenda: MockReviewAgendaItem[];
  remainingLine: string | null;
} {
  if (!ctx || ctx.focusItems.length === 0) return { agenda: [], remainingLine: null };

  const agenda: MockReviewAgendaItem[] = ctx.focusItems.map((it, i) => {
    const n = i + 1;
    const plain = stripInlineForLabel(it.problemText);
    // Append the ellipsis only when actually truncated (so short stems don't
    // read "2 + 2 = ?…").
    const clipped = plain.length > 56 ? plain.slice(0, 56).trimEnd() + '…' : plain;
    const firstWords = plain.split(' ').slice(0, 8).join(' ');
    return {
      n,
      label: `${it.sectionLabel} — ${clipped}`,
      result: agendaResult(it),
      utterance: `Let's start with item ${n} — the one that begins "${firstWords}"`,
    };
  });

  const remainingMissed = ctx.remainingMissSummary.reduce((s, r) => s + r.missed, 0);
  const units = ctx.remainingMissSummary.map((r) => r.unitLabel).join(', ');
  const remainingLine =
    remainingMissed > 0 ? `+ ${remainingMissed} more missed in ${units} — just ask to include them` : null;

  return { agenda, remainingLine };
}
