/**
 * A part-by-part rubric read from a written answer key (2026-11-08).
 *
 * Most curated multi-part FRQs carry no `rubric`, only an `expectedAnswer`
 * written AP-style with its points in it:
 *
 *   (a) P(both red) = (5/8)(4/7) = 5/14. (1.5)
 *   (b) P(R then B) = 15/56. (1.5)
 *   (c) NOT INDEPENDENT … (2)
 *   Total: 5 points.
 *
 * Graded as one answer, such an item scored 0 or 1 of 1 (no partial credit)
 * while the shown answer still read "(1.5) … Total: 5 points". When the key
 * has this shape, grade each part against its own slice of the key instead.
 *
 * Strict on purpose: every part must be labelled in order (a), (b), … at the
 * start of a line, and every part must end with its points. Anything else
 * returns null and the item keeps the single-answer judge.
 */

import type { FrqRubric } from '@evelyn/portal-contract/v1';

const TOTAL_RE = /\n\s*Total:\s*(\d+(?:\.\d+)?)\s*(?:points?|pts?)?\.?\s*$/i;
const PART_START_RE = /(?:^|\n)\s*\(([a-h])\)\s*/g;
/** A part's closing points marker: "(2)", "(1.5 points)", "(2 points: 1 for setup, 1 for the number)",
 *  "(1 point for each schedule = 2 points)". Group 1 = the whole marker's inside. */
const POINTS_RE = /\s*\(([^()]*\d[^()]*)\)\.?\s*$/;
/** A marker on the same line as the next part ("… (1 point) (b) …"): break the line there. */
const INLINE_NEXT_RE = /(\(\s*\d+(?:\.\d+)?\s*(?:points?|pts?)?(?:\s*[:;,][^()]*)?\))[ \t]+(?=\([b-h]\)\s)/gi;

/** The points a marker's inside gives, or null when it is not a points marker. */
function markerPoints(inside: string): { points: number; note: string } | null {
  const s = inside.trim();
  let m = /^(\d+(?:\.\d+)?)\s*(?:points?|pts?)?$/i.exec(s);
  if (m) return { points: Number(m[1]), note: '' };
  m = /^(\d+(?:\.\d+)?)\s*(?:points?|pts?)\s*[:;,]\s*(.+)$/i.exec(s);
  if (m) return { points: Number(m[1]), note: m[2].trim() };
  m = /=\s*(\d+(?:\.\d+)?)\s*(?:points?|pts?)\s*$/i.exec(s);
  if (m && /\bpoints?\b/i.test(s.slice(0, m.index))) return { points: Number(m[1]), note: s.slice(0, m.index).trim() };
  return null;
}

export function rubricFromPointedKey(key: string | undefined | null): FrqRubric | null {
  if (!key) return null;
  let body = key.trim().replace(INLINE_NEXT_RE, '$1\n');
  let total: number | null = null;
  const t = TOTAL_RE.exec(body);
  if (t) {
    total = Number(t[1]);
    body = body.slice(0, t.index);
  }

  const starts: Array<{ label: string; at: number; textAt: number }> = [];
  for (const m of body.matchAll(PART_START_RE)) {
    starts.push({ label: m[1], at: m.index ?? 0, textAt: (m.index ?? 0) + m[0].length });
  }
  if (starts.length < 2) return null;
  // Nothing but whitespace before (a); labels run a, b, c … with no gaps.
  if (body.slice(0, starts[0].at).trim() !== '') return null;
  if (starts.some((s, i) => s.label !== String.fromCharCode(97 + i))) return null;

  const parts: FrqRubric['parts'] = [];
  for (let i = 0; i < starts.length; i++) {
    const raw = body.slice(starts[i].textAt, i + 1 < starts.length ? starts[i + 1].at : body.length).trim();
    const p = POINTS_RE.exec(raw);
    const marker = p ? markerPoints(p[1]) : null;
    if (!p || !marker) return null;
    const maxPoints = marker.points;
    const answer = raw.slice(0, p.index).trim();
    if (!(maxPoints > 0) || !answer) return null;
    parts.push({
      criterionId: starts[i].label,
      maxPoints,
      scoringCriteria: `Part (${starts[i].label}) only, worth ${maxPoints} point${maxPoints === 1 ? '' : 's'}. Full credit when the response's part (${starts[i].label}) matches this key in substance (an equivalent method or wording is fine): ${answer}${marker.note ? `\nHow the points split: ${marker.note}` : ''}`,
      modelResponse: answer,
    });
  }
  const sum = parts.reduce((s, p) => s + p.maxPoints, 0);
  if (total !== null && Math.abs(sum - total) > 1e-9) return null;
  return { parts };
}
