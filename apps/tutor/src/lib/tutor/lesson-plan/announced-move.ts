/**
 * Task 16 (GDI live, embed-1793326847152): in a fixed-script lesson the brain
 * said `Yes, that's correct. … Now let's move on to the open conversation.`
 * with no tool call (it never calls advance_lesson) and no question. The
 * pointer stayed on the old part, 37 s of silence followed, and the idle
 * nudge re-asked the OLD part's question. A sentence that announces a move
 * into the NEXT segment — named by that segment's own authored label /
 * localized label / title / id — moves the pointer like the turn-budget rule.
 *
 * Generic: keyed only on the plan's own segment metadata; any fixed-script
 * plan gets it, every other plan returns null. Never a jump — only the
 * segment `nextSegmentId` returns. The caller skips it when the brain's own
 * advance_lesson ran this turn.
 */
import type { LessonPlan, Segment } from './types';
import { isFixedScriptPlan, nextSegmentId } from './fixed-script';

/** A sentence that announces moving on (EN + JA). The keyword gate in
 *  announcedMoveTarget is required too — the phrase alone never moves. */
export const MOVE_PHRASE_RE = new RegExp(
  [
    String.raw`\b(?:let['’]?s|we['’]?ll|we will|now|time to)\s+(?:move|go)\s+(?:on\s+)?to\b`,
    String.raw`\bmove\s+on\s+to\b`,
    String.raw`\bmoving\s+on\s+to\b`,
    String.raw`\blet['’]?s\s+(?:start|begin|turn\s+to|do)\s+(?:the|our|your)\b`,
    String.raw`\bnext\s+(?:is|comes|up\s+is)\b`,
    '次に進みましょう', 'に進みましょう', 'に移りましょう', 'に移ります', '次は', 'を始めましょう',
  ].join('|'),
  'i',
);

/** Words too generic to name a part. `open` is deliberately NOT here ("open
 *  conversation" is the live case; the phrase gate keeps it safe). */
const STOPWORDS = new Set([
  'the', 'and', 'for', 'your', 'our', 'part', 'lesson', 'next', 'now', 'let', 'lets', 'with', 'about', 'you', 'this', 'that',
]);
const CJK_RUN_RE = /[぀-ヿ㐀-鿿豈-﫿ｦ-ﾟ]+/g;
const LATIN_WORD_RE = /[a-z]+/g;

/** Lower-cased Latin words (≥ 3 letters, no stopwords) and whole Japanese
 *  runs of the segment's `metadata.label`, every `metadata.labelLocalized`
 *  value, `title`, and `id` split on `-`/`_`. De-duplicated. */
export function segmentKeywords(seg: Segment): string[] {
  const md = (seg.metadata ?? {}) as Record<string, unknown>;
  const sources: string[] = [];
  if (typeof md.label === 'string') sources.push(md.label);
  if (md.labelLocalized && typeof md.labelLocalized === 'object') {
    for (const v of Object.values(md.labelLocalized as Record<string, unknown>)) if (typeof v === 'string') sources.push(v);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const title = (seg as any).title;
  if (typeof title === 'string') sources.push(title);
  if (typeof seg.id === 'string') sources.push(seg.id.replace(/[-_]+/g, ' '));
  const out = new Set<string>();
  for (const src of sources) {
    const lower = src.toLowerCase();
    for (const w of lower.match(LATIN_WORD_RE) ?? []) if (w.length >= 3 && !STOPWORDS.has(w)) out.add(w);
    for (const run of src.match(CJK_RUN_RE) ?? []) out.add(run);
  }
  return [...out];
}

function isCjk(keyword: string): boolean {
  return /^[぀-ヿ㐀-鿿豈-﫿ｦ-ﾟ]+$/.test(keyword);
}
/** Whole word for Latin keywords, substring for Japanese ones. */
function sentenceHas(sentence: string, keyword: string): boolean {
  if (isCjk(keyword)) return sentence.includes(keyword);
  return new RegExp(`\\b${keyword}\\b`, 'i').test(sentence);
}

/** The id of the NEXT segment when `tutorText` announces a move into it, else null. */
export function announcedMoveTarget(input: {
  tutorText: string; plan: LessonPlan; currentSegmentId: string; levelKnown: boolean;
}): string | null {
  const { tutorText, plan, currentSegmentId, levelKnown } = input;
  if (!tutorText || !plan || !isFixedScriptPlan(plan)) return null;
  const nextId = nextSegmentId(plan, currentSegmentId, levelKnown);
  if (!nextId) return null;
  const nextSeg = plan.segments.find((s) => s.id === nextId);
  if (!nextSeg) return null;
  const nextKeys = segmentKeywords(nextSeg);
  if (!nextKeys.length) return null;
  const nextSet = new Set(nextKeys);
  // Keywords that belong ONLY to some other segment (the current one included).
  const otherOnly = new Set<string>();
  for (const s of plan.segments) {
    if (s.id === nextId) continue;
    for (const k of segmentKeywords(s)) if (!nextSet.has(k)) otherOnly.add(k);
  }
  const sentences = tutorText.split(/(?<=[。！？.!?])\s*|\n+/).map((x) => x.trim()).filter(Boolean);
  for (const sentence of sentences) {
    if (!MOVE_PHRASE_RE.test(sentence)) continue;
    if (!nextKeys.some((k) => sentenceHas(sentence, k))) continue;
    if ([...otherOnly].some((k) => sentenceHas(sentence, k))) continue;
    return nextId;
  }
  return null;
}
