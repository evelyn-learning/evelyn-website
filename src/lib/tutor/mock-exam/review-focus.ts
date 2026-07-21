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
  /** The item's REAL exam question number — its CONTINUOUS 1-based position
   *  over the FULL served exam (all sections in exam order, every item counted
   *  correct or not), NOT its position in the focus/agenda list and NOT reset
   *  per section. Students remember "Q18", not "the 3rd row of my review
   *  agenda". Derived in buildMockReviewContext. */
  qNum: number;
  responseFormat?: 'mcq' | 'numeric' | 'frq';
  problemText: string;
  choices?: string[];
  studentAnswer: string;          // 'no answer' when blank
  correctAnswer?: string;
  isCorrect?: boolean;            // undefined for FRQ; true for a pinned-but-correct MCQ/numeric
  solutionText?: string;
  passageExcerpt?: string;
  frqFeedback?: Array<{ criterionId: string; pointsAwarded: number; maxPoints: number; feedback: string }>;
  /** FRQ score straight off frqGrade.totalPoints/maxPoints — NOT the part sum.
   *  A skipped FRQ grades as totalPoints/maxPoints = 0/9 with EMPTY parts, so
   *  summing parts wrongly reads "0/0". Present only for graded FRQs. */
  frqScore?: { points: number; max: number };
  loId?: string;
  /** True when the student explicitly pinned this item for review (it appears
   *  in pinItemIds). Pinned items are ordered first, so pinned focus items are
   *  always Items 1..pinnedCount. Drives the "student just selected this" brain
   *  directive; absent/false for naturally-selected misses. */
  pinned?: boolean;
}

/** One missed item, condensed for the in-session Agenda drawer. Every miss
 *  (not just the focus cap) becomes one of these — see MockReviewContext.allMisses.
 *  `snippet` is a math-safe truncation of the problem text (keeps `$…$`). */
export interface MockReviewMiss {
  itemId: string;
  sectionLabel: string;
  /** Real exam question number (continuous 1-based position over the full
   *  served exam) — see MockReviewFocusItem.qNum. */
  qNum: number;
  snippet: string;
  responseFormat: 'mcq' | 'numeric' | 'frq';
  studentAnswer?: string;
  correctAnswer?: string;
  frqScore?: { points: number; max: number };
}

export interface MockReviewContext {
  formLabel: string;
  composite: number;
  compositeMax: number;
  focusItems: MockReviewFocusItem[];
  remainingMissSummary: Array<{ unitLabel: string; missed: number }>;
  totalMissed: number;
  /** How many focus items the student explicitly pinned (0 when none). Pinned
   *  items lead the focus list, so these are Items 1..pinnedCount — the brain
   *  block uses this to tell the tutor a selection just happened. */
  pinnedCount: number;
  /** EVERY miss (focus first, then remaining, stable order) — the data source
   *  for the mid-session Agenda drawer. NOT rendered into the brain block
   *  (formatMockReviewBlock stays capped at the focus items). */
  allMisses: MockReviewMiss[];
  /** EVERY served item that is NOT a miss (the complement of `isMiss` over the
   *  full items array, exam order) — the data source for the drawer's optional
   *  "show correct questions too" disclosure. Same condensed shape as allMisses;
   *  a client renders each as a ✓ result. NOT rendered into the brain block. */
  correctItems: MockReviewMiss[];
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

  // Real exam question numbers: args.items arrives in served exam order
  // (getReview builds it module-by-module), so the item's CONTINUOUS 1-based
  // position over the FULL list — all sections, exam order, every item counted
  // correct or not — is its authentic "Qn". Continuous (not per-section) so the
  // drawer never shows several "Q1"s: section II's first item follows on from
  // section I's last, matching how the printed exam numbers questions.
  const qNumById = new Map<string, number>();
  args.items.forEach((it, i) => qNumById.set(it.itemId, i + 1));
  const qNumOf = (itemId: string): number => qNumById.get(itemId) ?? 0;

  // Resolve the valid, unique pinned ids (same rules as selectMockReviewFocus:
  // an id must match a real item; duplicates/unknowns are dropped). A focus
  // item is "pinned" iff its id is in this set; pinnedCount is how many of the
  // focus items are pinned — since pins lead the list, that's Items 1..count.
  const knownIds = new Set(args.items.map((it) => it.itemId));
  const pinnedIdSet = new Set<string>();
  for (const id of args.pinItemIds ?? []) if (knownIds.has(id)) pinnedIdSet.add(id);
  const pinnedCount = focus.reduce((n, it) => n + (pinnedIdSet.has(it.itemId) ? 1 : 0), 0);

  const summary = new Map<string, number>();
  for (const r of remaining) {
    const key = r.loId ? label(r.loId) : '(uncategorized)';
    summary.set(key, (summary.get(key) ?? 0) + 1);
  }

  // allMisses = every MISS, focus-first then the remainder, stable order. A
  // pinned-but-correct focus item is not a miss, so it never appears here.
  const allMisses: MockReviewMiss[] = [...focus.filter(isMiss), ...remaining].map((it) => toMiss(it, qNumOf(it.itemId)));
  // correctItems = the complement of isMiss over the FULL served array, in exam
  // order (skip nothing). A pinned-correct item is not a miss, so it lands here.
  const correctItems: MockReviewMiss[] = args.items.filter((it) => !isMiss(it)).map((it) => toMiss(it, qNumOf(it.itemId)));

  return {
    formLabel: args.formLabel,
    composite: args.composite,
    compositeMax: args.compositeMax,
    totalMissed,
    pinnedCount,
    focusItems: focus.map((it) => ({
      itemId: it.itemId,
      pinned: pinnedIdSet.has(it.itemId) || undefined,
      sectionLabel: it.sectionLabel,
      qNum: qNumOf(it.itemId),
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
      frqScore: frqScoreOf(it),
      loId: it.loId,
    })),
    remainingMissSummary: Array.from(summary.entries()).map(([unitLabel, missed]) => ({ unitLabel, missed })),
    allMisses,
    correctItems,
  };
}

/** FRQ points off the grade header (NOT the part sum), for graded FRQs only. */
function frqScoreOf(it: MockReviewItem): { points: number; max: number } | undefined {
  if (it.responseFormat !== 'frq') return undefined;
  const g = it.frqGrade;
  return g ? { points: g.totalPoints, max: g.maxPoints } : undefined;
}

/** Narrow a portal response-format to the three the review UI distinguishes. */
function missFormat(rf: MockReviewItem['responseFormat']): 'mcq' | 'numeric' | 'frq' {
  if (rf === 'frq') return 'frq';
  if (rf === 'numeric') return 'numeric';
  return 'mcq';
}

function toMiss(it: MockReviewItem, qNum: number): MockReviewMiss {
  return {
    itemId: it.itemId,
    sectionLabel: it.sectionLabel,
    qNum,
    snippet: mathSafeSnippet(it.problemText, 90),
    responseFormat: missFormat(it.responseFormat),
    studentAnswer: it.studentAnswer?.trim() ? it.studentAnswer : 'no answer',
    correctAnswer: it.correctAnswer,
    frqScore: frqScoreOf(it),
  };
}

// ---------------------------------------------------------------------------
// Pre-start "review agenda" — the tappable question list the student sees
// before the session starts. Pure view-model derivation over the context;
// used by the runtime (VoiceTutorRealtime) to render SessionStage's agenda.
// ---------------------------------------------------------------------------

export interface MockReviewAgendaItem {
  /** 1-based position in the agenda list (drives the brain-block "Item N"
   *  marker on tap — NOT what the student sees). */
  n: number;
  /** Real exam question number for display (see MockReviewFocusItem.qNum). */
  qNum: number;
  /** `${sectionLabel} — <first ~56 chars of the plain problem text>`. */
  label: string;
  /** MCQ/numeric: `✗ you: … · correct: …` or `✓ …`; FRQ: `points/max`. */
  result: string;
}

/** Truncate `text` to ~`maxLen` visible chars WITHOUT ever cutting inside a
 *  `$…$` math span (an unbalanced `$` renders as raw LaTeX — Image evidence).
 *  Whitespace is collapsed first. If the cut point falls inside a span, back up
 *  to just before that span opens; a leading span that alone exceeds `maxLen`
 *  is kept whole (never split). Appends `…` only when actually truncated. */
export function mathSafeSnippet(text: string, maxLen: number): string {
  const s = text.replace(/\s+/g, ' ').trim();
  if (s.length <= maxLen) return s;

  // Pair up `$` delimiters into [openIdx, closeIdx] span ranges. `\$` is
  // escaped currency (Macro/EnvSci stems), not a delimiter — mirror
  // InlineMathText's escape semantics or currency pairs into phantom spans.
  const spans: Array<[number, number]> = [];
  let open = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '$' && s[i - 1] !== '\\') {
      if (open === -1) open = i;
      else { spans.push([open, i]); open = -1; }
    }
  }

  // A span that CONTAINS the intended cut (strictly past its opening `$`, up to
  // and including its closing `$`) — cutting here would split the math.
  const hit = spans.find(([a, b]) => maxLen > a && maxLen <= b);
  let cut = maxLen;
  if (hit) cut = hit[0] > 0 ? hit[0] : hit[1] + 1; // before it, or keep whole if it leads
  const head = s.slice(0, cut).trimEnd();
  return cut < s.length ? head + '…' : head;
}

function agendaResult(it: MockReviewFocusItem): string {
  // FRQ: use the grade header (frqScore) so a skipped FRQ reads 0/9, not the
  // empty-parts sum of 0/0. Fall back to the part sum only when frqScore is
  // absent (e.g. an ungraded FRQ).
  if (it.responseFormat === 'frq' || it.frqScore || it.frqFeedback) {
    if (it.frqScore) return `${it.frqScore.points}/${it.frqScore.max}`;
    const parts = it.frqFeedback ?? [];
    const points = parts.reduce((s, p) => s + p.pointsAwarded, 0);
    const max = parts.reduce((s, p) => s + p.maxPoints, 0);
    return `${points}/${max}`;
  }
  if (it.isCorrect) return `✓ ${it.studentAnswer}`;
  return `✗ you: ${it.studentAnswer} · correct: ${it.correctAnswer ?? '—'}`;
}

/** Build the pre-start agenda (tappable list + the "+ N more" muted line)
 *  from a review context. Empty agenda when there's no context / no focus.
 *  Labels KEEP `$…$` spans (math-safely truncated) so the UI renders them via
 *  InlineMathText instead of showing raw LaTeX. */
export function buildMockReviewAgenda(ctx: MockReviewContext | undefined): {
  agenda: MockReviewAgendaItem[];
  remainingLine: string | null;
} {
  if (!ctx || ctx.focusItems.length === 0) return { agenda: [], remainingLine: null };

  const agenda: MockReviewAgendaItem[] = ctx.focusItems.map((it, i) => {
    const n = i + 1;
    return {
      n,
      qNum: it.qNum,
      label: `${it.sectionLabel} — ${mathSafeSnippet(it.problemText, 56)}`,
      result: agendaResult(it),
    };
  });

  // Condensed footer: a count only — the old per-loId list overflowed under
  // the mic bar. count = misses NOT in the focus list.
  const remainingMissed = ctx.totalMissed - ctx.focusItems.length;
  const remainingLine =
    remainingMissed > 0
      ? `+ ${remainingMissed} more missed — open the agenda (top right) to jump to any of them.`
      : null;

  return { agenda, remainingLine };
}

// ---------------------------------------------------------------------------
// Mid-session "Agenda drawer" — every miss as a tappable numbered row. Same
// idiom as the pre-start list, but over ALL misses (not just the focus cap),
// with the focus items flagged so the drawer can badge them "up next".
// ---------------------------------------------------------------------------

export interface MockReviewDrawerRow {
  /** 1-based position over ALL misses. */
  n: number;
  /** Real exam question number for display (see MockReviewFocusItem.qNum). */
  qNum: number;
  /** Item id — passed to the pick handler on tap. */
  itemId: string;
  /** `${sectionLabel} — <math-safe snippet>` (keeps `$…$`). */
  label: string;
  /** MCQ/numeric: `✗ you: … · correct: …`; FRQ: `points/max`. */
  result: string;
  /** In the current focus list ⇒ show an "up next" badge. */
  isFocus: boolean;
}

function missResult(m: MockReviewMiss): string {
  if (m.responseFormat === 'frq' || m.frqScore) {
    return m.frqScore ? `${m.frqScore.points}/${m.frqScore.max}` : '—';
  }
  return `✗ you: ${m.studentAnswer ?? 'no answer'} · correct: ${m.correctAnswer ?? '—'}`;
}

/** Build the mid-session drawer rows (all misses) from a review context. */
export function buildMockReviewDrawer(ctx: MockReviewContext | undefined): MockReviewDrawerRow[] {
  if (!ctx) return [];
  const focusIds = new Set(ctx.focusItems.map((f) => f.itemId));
  return ctx.allMisses.map((m, i) => ({
    n: i + 1,
    qNum: m.qNum,
    itemId: m.itemId,
    label: `${m.sectionLabel} — ${m.snippet}`,
    result: missResult(m),
    isFocus: focusIds.has(m.itemId),
  }));
}

/** Result line for a CORRECT drawer row — MCQ/numeric shows a ✓ with the
 *  student's answer; a "correct" FRQ (scored at/above the miss ratio) shows its
 *  points/max. Sibling of missResult for the drawer's correct-questions list. */
function correctResult(m: MockReviewMiss): string {
  if (m.responseFormat === 'frq' || m.frqScore) {
    return m.frqScore ? `${m.frqScore.points}/${m.frqScore.max}` : '✓';
  }
  return `✓ ${m.studentAnswer ?? '—'}`;
}

/** Build the drawer's "correct questions too" rows (every non-miss served item)
 *  from a review context. Same row shape as buildMockReviewDrawer; a
 *  pinned-correct item is flagged isFocus so it can badge "up next". */
export function buildMockReviewCorrectRows(ctx: MockReviewContext | undefined): MockReviewDrawerRow[] {
  if (!ctx) return [];
  const focusIds = new Set(ctx.focusItems.map((f) => f.itemId));
  return ctx.correctItems.map((m, i) => ({
    n: i + 1,
    qNum: m.qNum,
    itemId: m.itemId,
    label: `${m.sectionLabel} — ${m.snippet}`,
    result: correctResult(m),
    isFocus: focusIds.has(m.itemId),
  }));
}
