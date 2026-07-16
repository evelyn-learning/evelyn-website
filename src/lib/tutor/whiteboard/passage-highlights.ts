/**
 * Pure substring-highlight segmenter for `show_passage`.
 *
 * `show_passage`'s `highlights` field is a flat array of exact substrings
 * to emphasize within `text` (unlike `show_annotated_passage`, which
 * addresses highlights by line number + substring). This module splits
 * `text` into an ordered list of plain / highlighted segments so the
 * renderer can wrap each highlighted run in a `<mark>` — same algorithm
 * as AnnotatedPassageRenderer's per-line `segmentLine` (first occurrence
 * wins, overlapping ranges merge), scoped to the whole passage instead of
 * one line.
 *
 * Kept dependency-free (no React/JSX) so it's importable from a plain
 * tsx test script, matching inline-math.ts's split between the pure
 * segmenter and the KaTeX-rendering component.
 */

export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

/** Split `text` into plain/highlighted segments for each highlight
 *  substring's FIRST occurrence. Highlights not found in `text` are
 *  silently ignored (no error — the brain may over-supply). Overlapping
 *  ranges merge into one highlighted segment. Empty `text` returns `[]`;
 *  `text` with no (matching) highlights returns a single non-highlighted
 *  segment. */
export function splitHighlights(text: string, highlights: string[] = []): HighlightSegment[] {
  if (!text) return [];
  const clean = highlights.filter((h) => typeof h === 'string' && h.length > 0);
  if (clean.length === 0) return [{ text, highlighted: false }];

  type Range = { start: number; end: number };
  const ranges: Range[] = [];
  for (const h of clean) {
    const idx = text.indexOf(h);
    if (idx >= 0) ranges.push({ start: idx, end: idx + h.length });
  }
  if (ranges.length === 0) return [{ text, highlighted: false }];

  ranges.sort((a, b) => a.start - b.start);
  const merged: Range[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r.start <= last.end) {
      last.end = Math.max(last.end, r.end);
    } else {
      merged.push({ ...r });
    }
  }

  const segs: HighlightSegment[] = [];
  let cursor = 0;
  for (const r of merged) {
    if (cursor < r.start) segs.push({ text: text.slice(cursor, r.start), highlighted: false });
    segs.push({ text: text.slice(r.start, r.end), highlighted: true });
    cursor = r.end;
  }
  if (cursor < text.length) segs.push({ text: text.slice(cursor), highlighted: false });
  return segs;
}
