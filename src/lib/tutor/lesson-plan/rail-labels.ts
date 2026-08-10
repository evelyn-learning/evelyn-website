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

function loDisplay(plan: LessonPlan, loId: string): string {
  const lo = (plan.los ?? []).find((l) => l.id === loId);
  if (!lo) return loId;
  return lo.shortTitle ?? capWords(lo.description, 4);
}

export function buildRailModel(
  plan: LessonPlan,
  currentSegmentId: string,
  completedSegmentIds: ReadonlySet<string>,
  labels: SegmentLabels | null,
): RailItem[] | null {
  if (plan.metadata?.pendingPicker) return null;
  if (!plan.segments.length) return null;

  const flags = (segIds: string[]) => ({
    done: segIds.every((id) => completedSegmentIds.has(id)),
    current: segIds.includes(currentSegmentId),
  });

  if (isGeneratedPlan(plan) && (plan.los ?? []).length > 0) {
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
    return items;
  }

  // Curated (any LO count): one item per segment.
  return plan.segments.map((seg) => {
    const fixed = !LABELABLE_KINDS.has(seg.kind);
    const label = fixed
      ? railStageLabel(plan.segments, seg.id)
      : labels?.[seg.id] ?? railStageLabel(plan.segments, seg.id);
    return { key: seg.id, label, segIds: [seg.id], ...flags([seg.id]) };
  });
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
    const id = (item as { id?: unknown }).id;
    const label = (item as { label?: unknown }).label;
    if (typeof id !== 'string' || typeof label !== 'string' || !label.trim()) return null;
    if (!validIds.has(id)) return null;
    out[id] = capWords(label, MAX_LABEL_WORDS);
  }
  const values = Object.values(out);
  if (values.length === 0) return null;
  if (new Set(values.map((v) => v.toLowerCase())).size < values.length) return null; // duplicates → treat as atomic
  return out;
}
