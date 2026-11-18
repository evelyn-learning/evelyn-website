/**
 * Tutor brain v2 — Task 7o: the board side of a note's target marks (see note-targets.ts): which spans of a note's line are
 * drawn as targets, and which stress words of the reply's cards a note carries. Imported by the whiteboard
 * (whiteboard/NoteTargetText.tsx), so it imports nothing but the 7h target test. Pure, client-safe.
 */
import { V2_TARGET_TEST } from './target-pauses';

/** A quoted span: straight, curly or 「」 quotes, or markdown bold. */
const QUOTED = /"([^"\n]+)"|“([^“”\n]+)”|「([^「」\n]+)」|\*\*([^*\n]+)\*\*/g;
const isTarget = (inner: string) => V2_TARGET_TEST.test(inner.trim());

/** Whether the note quotes a target (a short quoted span). */
export function v2NoteHasTarget(text: string): boolean {
  return [...String(text ?? '').matchAll(QUOTED)].some((m) => isTarget(m[1] ?? m[2] ?? m[3] ?? m[4] ?? ''));
}

/** The stress words of this reply's sentence cards (painted, or pointed back at) that stand in the note as whole words. */
export function v2NoteStressWords(text: string, calls: ReadonlyArray<{ name: string; args: Record<string, unknown>; outcome: string; pointsAt?: string }>): string[] {
  const out: string[] = [];
  for (const c of calls) {
    if (c.name !== 'show_sentence' || (/^not /.test(c.outcome) && !c.pointsAt) || !Array.isArray(c.args.emphasis)) continue;
    for (const w of c.args.emphasis as unknown[]) {
      const word = typeof w === 'string' ? w.trim() : '';
      if (!word || out.includes(word)) continue;
      if (wholeWord(word, 'u').test(text)) out.push(word);
    }
  }
  return out;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Fix round 1 (I1): a stress word written in lower case matches only in lower case, so the capital that opens a sentence is
 *  never taken for it ("For a period of time, use for + …": the card stresses "for", the opening "For" is no target). A
 *  capitalised stress word ("I", "Monday", or a word that opened the card's sentence) matches in either case. */
const wholeWord = (w: string, flags: 'u' | 'gu') => new RegExp(`(?<![\\p{L}\\p{N}'’])${escape(w).replace(/\s+/g, '\\s+')}(?![\\p{L}\\p{N}'’])`, w === w.toLowerCase() ? flags : `${flags}i`);

export type V2NoteSegment = { text: string; mark?: true };

/** A line of a note as the board draws it: plain runs and marked targets. `quoted`: short quoted spans are targets, drawn
 *  without their quote marks (markdown bold is taken off any span). `stress`: these words are marked where they stand as
 *  whole words, outside the quoted targets. With neither, the line is one plain run. */
export function v2NoteSegments(text: string, opts: { quoted?: boolean; stress?: readonly string[] } = {}): V2NoteSegment[] {
  const s = String(text ?? '');
  // Fix round 1 (minor 5): a $…$ span is never cut: marks are looked for only between the spans.
  const pieces = s.split(/(\$[^$\n]+\$)/);
  const segs: V2NoteSegment[] = pieces.flatMap((piece, i) => (i % 2 ? [{ text: piece }] : markPiece(piece, opts)));
  // Adjacent plain runs joined, empty runs dropped.
  const merged: V2NoteSegment[] = [];
  for (const seg of segs) {
    if (!seg.text) continue;
    const last = merged[merged.length - 1];
    if (last && !last.mark && !seg.mark) last.text += seg.text; else merged.push({ text: seg.text, ...(seg.mark ? { mark: true as const } : {}) });
  }
  return merged;
}

function markPiece(s: string, opts: { quoted?: boolean; stress?: readonly string[] }): V2NoteSegment[] {
  let segs: V2NoteSegment[] = [{ text: s }];
  if (opts.quoted) {
    segs = [];
    let at = 0;
    for (const m of s.matchAll(QUOTED)) {
      const start = m.index ?? 0;
      const inner = m[1] ?? m[2] ?? m[3] ?? m[4] ?? '';
      segs.push({ text: s.slice(at, start) });
      if (isTarget(inner)) {
        // A stop or comma written inside the quotes stays plain after the mark.
        const t = inner.trim(); const p = /[.,;:!?]$/.test(t) ? t.slice(-1) : '';
        segs.push({ text: p ? t.slice(0, -1) : t, mark: true });
        if (p) segs.push({ text: p });
      } else segs.push({ text: m[4] !== undefined ? inner : m[0] });
      at = start + m[0].length;
    }
    segs.push({ text: s.slice(at) });
  }
  const stress = (opts.stress ?? []).map((w) => String(w).trim()).filter(Boolean);
  for (const w of stress) {
    const re = wholeWord(w, 'gu');
    segs = segs.flatMap((seg) => {
      if (seg.mark) return [seg];
      const out: V2NoteSegment[] = []; let at = 0;
      for (const m of seg.text.matchAll(re)) { out.push({ text: seg.text.slice(at, m.index) }, { text: m[0], mark: true }); at = (m.index ?? 0) + m[0].length; }
      out.push({ text: seg.text.slice(at) });
      return out;
    });
  }
  return segs;
}
