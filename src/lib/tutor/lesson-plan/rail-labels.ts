import type { LessonPlan, Segment } from './types';
import { isGeneratedPlan, loGroupOf } from './context';

export const RAIL_LABELS_VERSION = 'rail-v1';
const MAX_LABEL_WORDS = 3;

export type SegmentLabels = Record<string, string>;
export interface RailItem { key: string; label: string; segIds: string[]; done: boolean; current: boolean }

/** Kinds that get content labels; hook/recap keep fixed labels (grill-me 2026-08-10). */
const LABELABLE_KINDS = new Set(['concept', 'worked_example', 'try_yourself', 'misconception_check', 'extension']);

const STAGE_WORD: Record<string, string> = {
  hook: 'Hook', concept: 'Concept', worked_example: 'Example',
  try_yourself: 'Try', misconception_check: 'Misconception', recap: 'Recap', extension: 'Extension',
};

/** Stage-name label with occurrence numbering when a kind repeats (Try 1, Try 2). */
export function railStageLabel(segments: { id: string; kind: string }[], segId: string): string {
  const seg = segments.find((s) => s.id === segId);
  if (!seg) return segId;
  const word = STAGE_WORD[seg.kind] ?? seg.kind;
  const sameKind = segments.filter((s) => s.kind === seg.kind);
  if (sameKind.length <= 1) return word;
  return `${word} ${sameKind.findIndex((s) => s.id === segId) + 1}`;
}

function capWords(s: string, n: number): string {
  return s.trim().replace(/[.?!]+$/, '').split(/\s+/).filter(Boolean).slice(0, n).join(' ');
}

/** R46 (a): stopwords that read as a dangling conjunction/preposition when
 *  capWords' hard word-count cut lands right before them — "Limit laws and"
 *  (cut mid "...and direct substitution") or "Explain the causes and" (cut
 *  mid "...and effects"). Case-insensitive. */
const TRAILING_STOPWORDS = new Set(['and', 'or', 'the', 'of', 'plus', 'with', 'vs', 'to', 'for', 'a', 'an']);

/** Iteratively drops trailing stopwords left dangling by a hard word-count
 *  cut. Never empties the label — an all-stopword input keeps its last
 *  word rather than vanishing. */
function stripTrailingStopwords(s: string): string {
  const words = s.split(/\s+/).filter(Boolean);
  while (words.length > 1 && TRAILING_STOPWORDS.has(words[words.length - 1].toLowerCase())) {
    words.pop();
  }
  return words.join(' ');
}

/** capWords, plus the trailing-stopword strip — for output that becomes a
 *  user-facing LABEL (rail pill, LO title). NOT used for capWords' other
 *  call site (buildLabelPrompt's salient-text excerpt fed to the labeling
 *  prompt) — that's raw context text, not a rendered label, and trimming a
 *  trailing "and" out of a prompt excerpt would be pointless. */
function capLabel(s: string, n: number): string {
  return stripTrailingStopwords(capWords(s, n));
}

function loDisplay(plan: LessonPlan, loId: string): string {
  const lo = (plan.los ?? []).find((l) => l.id === loId);
  if (!lo) return loId;
  return lo.shortTitle ?? capLabel(lo.description, 4);
}

/** Exported thin wrapper over the module-private `loDisplay` (Task 1) —
 *  lets VTR and tests share the exact same LO-title derivation
 *  `loBoundaryBeat` uses below, without duplicating the shortTitle-or-
 *  capped-description fallback logic. */
export function railLoTitle(plan: LessonPlan, loId: string): string {
  return loDisplay(plan, loId);
}

export interface RailModel { items: RailItem[]; offPlan: boolean }

export function buildRailModel(
  plan: LessonPlan,
  currentSegmentId: string,
  completedSegmentIds: ReadonlySet<string>,
  labels: SegmentLabels | null,
): RailModel | null {
  if (plan.metadata?.pendingPicker) return null;
  if (!plan.segments.length) return null;

  // Rail-bargein (Task 3): the client releases the cursor to '' when the
  // tutor goes off-plan (barge-in), which naturally leaves every item's
  // `current` false below (no segId ever equals ''). Surface that as an
  // explicit flag so the UI can show an intentional "Off plan" state
  // instead of a rail that just looks broken.
  const offPlan = currentSegmentId === '';

  const flags = (segIds: string[]) => ({
    done: segIds.every((id) => completedSegmentIds.has(id)),
    current: segIds.includes(currentSegmentId),
  });

  const generated = isGeneratedPlan(plan) && (plan.los ?? []).length > 0;

  // Task 1 (single-LO stage labels): count the DISTINCT LOs the plan's
  // segments actually carry identity for. Generated plans mint segment
  // ids as "<loId>-hook" / "-concept" / ... (loGroupOf recovers the
  // loId), so distinct-count = distinct recovered loIds that actually
  // match a plan.los entry. Curated plans carry NO lo id on segments AT
  // ALL — SegmentBase (types.ts) has no such field, and curated segment
  // ids (e.g. "concept-scarcity", "try-billionaire") don't follow the
  // generated-plan suffix convention — so for them the only LO-identity
  // signal available is `plan.los` itself, deduplicated by id. Live
  // failure (session portal-1349716e, evelyn.ap.macro.scarcity.v1): a
  // curated plan with exactly one `los` entry and segments with no lo
  // id at all — that absence of any per-segment LO signal IS the
  // single-LO case here, same as a generated plan whose segments
  // resolve to one distinct group.
  const loCount = generated
    ? new Set(
        plan.segments
          .map((seg) => loGroupOf(seg.id))
          .filter((g) => (plan.los ?? []).some((l) => l.id === g)),
      ).size
    : new Set((plan.los ?? []).map((l) => l.id)).size;

  // ≤1 distinct LO (0 or 1) → topic/stage-level names only, one rail
  // item per segment, via the SAME kind-derived stage machinery used as
  // the curated no-labels fallback below (STAGE_WORD + sameKind
  // numbering: Concept / Example / Try 1 / Try 2 / Misconception /
  // Recap; hook/recap fixed). Praveen's call: a single-LO plan has
  // nothing distinct to name per question — per-question content labels
  // ("Wealth and scarcity", "Scarcity vs. poverty") read as noise, not
  // signal. Bypasses BOTH the LO-grouped generated path and the
  // content-labeled curated path below (and ignores any `labels` cache
  // entirely — a single-LO plan never shows content labels, cached or
  // not).
  if (loCount <= 1) {
    const items: RailItem[] = plan.segments.map((seg) => ({
      key: seg.id,
      label: railStageLabel(plan.segments, seg.id),
      segIds: [seg.id],
      ...flags([seg.id]),
    }));
    return { items, offPlan };
  }

  if (generated) {
    const loIds = new Set((plan.los ?? []).map((l) => l.id));
    const items: RailItem[] = [];
    for (const seg of plan.segments) {
      const group = loGroupOf(seg.id);
      const isLo = loIds.has(group);
      const key = isLo ? group : seg.id;
      const last = items[items.length - 1];
      if (last && last.key === key) { last.segIds.push(seg.id); continue; }
      items.push({
        key,
        label: isLo ? loDisplay(plan, group) : (STAGE_WORD[seg.kind] ?? (seg.id === 'intro' ? 'Intro' : seg.id)),
        segIds: [seg.id], done: false, current: false,
      });
    }
    // 'intro' has no kind-derived word when its kind is hook — force the friendlier label
    for (const it of items) if (it.segIds.length === 1 && it.segIds[0] === 'intro') it.label = 'Intro';
    for (const it of items) Object.assign(it, flags(it.segIds));
    return { items, offPlan };
  }

  // Curated, multi-LO (>1 distinct LO — the ≤1 case returned above):
  // one item per segment, content labels where available.
  const items = plan.segments.map((seg) => {
    const fixed = !LABELABLE_KINDS.has(seg.kind);
    const label = fixed
      ? railStageLabel(plan.segments, seg.id)
      : labels?.[seg.id] ?? railStageLabel(plan.segments, seg.id);
    return { key: seg.id, label, segIds: [seg.id], ...flags([seg.id]) };
  });
  return { items, offPlan };
}

/** Task 2 (VTR rail-bargein wiring) — candidate list for the student-
 *  jump-intent matcher (student-jump-intent.ts), reusing buildRailModel's
 *  exact grouping (LO-grouped on generated plans, one-item-per-segment on
 *  curated ones) so the matcher scores the verbal request against the
 *  SAME labels the rail visually shows the student. currentSegmentId/
 *  completedSegmentIds are irrelevant to candidate identity (only
 *  done/current flags depend on them), so this calls buildRailModel with
 *  neutral values and drops those flags in the mapping. Returns [] when
 *  buildRailModel itself suppresses (pendingPicker / no segments) — the
 *  matcher already no-ops on an empty candidate list. Structurally
 *  compatible with student-jump-intent.ts's `JumpCandidateItem` without
 *  importing it (lesson-plan module stays independent of orchestrator). */
export function railJumpCandidates(
  plan: LessonPlan,
  labels: SegmentLabels | null,
): { segmentIds: string[]; label: string }[] {
  const model = buildRailModel(plan, '', new Set(), labels);
  if (!model) return [];
  return model.items.map((it) => ({ segmentIds: it.segIds, label: it.label }));
}

/** Per-kind salient field for the labeling prompt. */
function salientText(seg: Segment): string {
  switch (seg.kind) {
    case 'concept': return [seg.goal, ...(seg.keyIdeas ?? []).slice(0, 2)].filter(Boolean).join(' — ');
    case 'worked_example': return seg.problem;
    case 'try_yourself': return seg.problem;
    case 'misconception_check': return seg.question;
    case 'extension': return seg.advancedQuestion;
    default: return '';
  }
}

export function buildLabelPrompt(plan: LessonPlan): string {
  const rows = plan.segments
    .filter((s) => LABELABLE_KINDS.has(s.kind))
    .map((s) => ({ id: s.id, kind: s.kind, text: capWords(salientText(s) ?? '', 40) }));
  const los = (plan.los ?? []).map((l) => l.description).join('; ');
  return [
    `Lesson: "${plan.title}" (grade ${plan.grade}). Objectives: ${los || 'n/a'}.`,
    `For each segment below, produce a 1-3 word CONTENT label naming what it covers (noun phrase, no verbs like "learn", no trailing punctuation). Labels must be distinct from each other and must not just repeat the lesson title.`,
    `If this lesson teaches ONE atomic thing and distinct content labels are impossible, reply exactly {"atomic": true}.`,
    `Otherwise reply ONLY JSON: {"labels":[{"id":"<segment id>","label":"<1-3 words>"}]} covering every segment listed.`,
    `Segments: ${JSON.stringify(rows)}`,
  ].join('\n');
}

export function parseLabelResponse(raw: string, plan: LessonPlan): SegmentLabels | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, ''));
  } catch { return null; }
  if (!parsed || typeof parsed !== 'object') return null;
  if ((parsed as { atomic?: unknown }).atomic === true) return null;
  const arr = (parsed as { labels?: unknown }).labels;
  if (!Array.isArray(arr)) return null;
  const validIds = new Set(plan.segments.map((s) => s.id));
  const out: SegmentLabels = {};
  for (const item of arr) {
    if (!item || typeof item !== 'object') return null;
    const id = (item as { id?: unknown }).id;
    const label = (item as { label?: unknown }).label;
    if (typeof id !== 'string' || typeof label !== 'string' || !label.trim()) return null;
    if (!validIds.has(id)) return null;
    out[id] = capLabel(label, MAX_LABEL_WORDS);
  }
  const values = Object.values(out);
  if (values.length === 0) return null;
  if (new Set(values.map((v) => v.toLowerCase())).size < values.length) return null; // duplicates → treat as atomic
  return out;
}

/* ------------------------------------------------------------------ */
/* Task 5 — deterministic LO-boundary spoken beat (generated plans)   */
/* ------------------------------------------------------------------ */

/** Non-null only when `fromSegId` → `toSegId` crosses INTO a different
 *  LO group on a runtime-generated plan (`isGeneratedPlan`) AND that
 *  target group is one of the plan's actual LO ids — crossing into
 *  'intro', 'recap', or an unmatched/singleton id returns null (recap
 *  has its own card flow; there's nothing to announce entering intro).
 *  Curated plans never get a beat — curated sessions get the rail
 *  label named in the brain's context instead (see
 *  `buildLessonPlanContext`'s `currentSegmentRailLabel`). Called from
 *  VoiceTutorRealtime.tsx's `advance_lesson` success path, using the
 *  SAME `loGroupOf` grouping the rail (Task 1) and E6 LO-ordering
 *  (context.ts) both use, so "crossing" here means exactly what the
 *  rail visually shows as a new agenda item. */
export function loBoundaryBeat(
  plan: LessonPlan, fromSegId: string, toSegId: string,
): { loId: string; title: string; index: number; total: number } | null {
  if (!isGeneratedPlan(plan)) return null;
  const los = plan.los ?? [];
  if (los.length === 0) return null;
  const toGroup = loGroupOf(toSegId);
  if (loGroupOf(fromSegId) === toGroup) return null;
  const index = los.findIndex((l) => l.id === toGroup);
  if (index === -1) return null; // intro/recap/unmatched targets: no beat
  return { loId: toGroup, title: railLoTitle(plan, toGroup), index: index + 1, total: los.length };
}

/** Renders a `loBoundaryBeat` result as the extra text appended to the
 *  `advance_lesson` tool-result the brain sees this turn. The CODE
 *  decides deterministically WHEN this fires (exactly on LO crossings,
 *  via `loBoundaryBeat` above); the brain composes the actual spoken
 *  sentence in its own persona voice — this instructs it to, it does
 *  not script the words. */
export function buildAdvanceBeatNote(beat: { title: string; index: number; total: number }): string {
  return `You just crossed into agenda item ${beat.index} of ${beat.total}: "${beat.title}". Before teaching it, say ONE short spoken transition sentence in your own words that closes the previous item and names this one (e.g. "Nice — that's done. Next up: ${beat.title}."). Then teach. Do not skip this sentence.`;
}
