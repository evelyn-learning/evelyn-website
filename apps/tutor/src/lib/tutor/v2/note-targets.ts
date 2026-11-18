/**
 * Tutor brain v2 — Task 7o: the target word of a rule / correction note is marked on the board.
 *
 * Mic test 4 (embed-1795028886172, flag 2): the note read "For a period of time, use for + the number of years: for six years."
 * in one plain line, with nothing to show which word was the corrected one. The sentence card above it marked its stress word
 * ("for") amber and underlined; a note had no emphasis at all.
 *
 * In a spoken lesson that teaches a language (the 7h gate: two teaching languages or measured pronunciation):
 *  1. the session part asks for the target word or short phrase in double quotes (v2NoteTargetsSection);
 *  2. the note carries `targets: true`, and the board draws each short quoted span (the 7h target test: at most three Latin
 *     words) as a sentence card draws a stress word, without its quote marks (v2NoteSegments; the renderer is
 *     whiteboard/NoteTargetText.tsx). A longer quoted span is a sentence and is left as written;
 *  3. a note that quotes no target, written in a reply whose sentence card has stress words, carries those of them that
 *     stand in it as whole words (`stress`, v2NoteStressWords), and the board marks them there.
 * The marks are the board's only: the note's text (its record) is unchanged, and its spoken copy loses the quotes the prompt
 * asked for (v2UnquoteNoteTargets), so it is said as before. Pure, client-safe.
 */
import { discussionOf } from './discussion';
import { V2_TARGET_TEST } from './target-pauses';
import type { V2Session } from './types';

/** Spoken lessons that teach a language, as taught lessons (not a discussion, not homework). */
export function v2NoteTargetsOn(session: V2Session): boolean {
  return session.mode === 'voice' && !discussionOf(session.plan) && !session.homework && !session.homeworkSheet && ((session.languages?.length ?? 0) >= 2 || !!session.pronunciation);
}

/** The session part's section (such lessons only, under NOTE_TARGET_QUOTES). Stable for the whole session. */
export function v2NoteTargetsSection(): string {
  return [
    'TARGET WORDS IN NOTES',
    'In a note that states a rule or a correction (a <board note> block, or annotate), put the target word or short phrase (at most three words) in double quotes every time it stands as the target, in the rule and in its example: use "for" + the number of years: "for" six years. The board marks the quoted words. Quote only the target, never a whole sentence, and write no ** or other markdown in a note.',
  ].join('\n');
}

/** A quoted span: straight, curly or 「」 quotes, or markdown bold. */
const QUOTED = /"([^"\n]+)"|“([^“”\n]+)”|「([^「」\n]+)」|\*\*([^*\n]+)\*\*/g;
/** The quotes of a spoken copy (markdown bold is not a quote the prompt asks for). */
const SPOKEN_QUOTED = /"([^"\n]+)"|“([^“”\n]+)”|「([^「」\n]+)」/g;
const isTarget = (inner: string) => V2_TARGET_TEST.test(inner.trim());

/** Whether the note quotes a target (a short quoted span). */
export function v2NoteHasTarget(text: string): boolean {
  return [...String(text ?? '').matchAll(QUOTED)].some((m) => isTarget(m[1] ?? m[2] ?? m[3] ?? m[4] ?? ''));
}

/** A note's spoken copy: the quote marks around its short targets taken off, the rest as written. */
export function v2UnquoteNoteTargets(text: string): string {
  return text.replace(SPOKEN_QUOTED, (whole, a?: string, b?: string, c?: string) => { const inner = a ?? b ?? c ?? ''; return isTarget(inner) ? inner : whole; });
}

/** The stress words of this reply's sentence cards (painted, or pointed back at) that stand in the note as whole words. */
export function v2NoteStressWords(text: string, calls: ReadonlyArray<{ name: string; args: Record<string, unknown>; outcome: string; pointsAt?: string }>): string[] {
  const out: string[] = [];
  for (const c of calls) {
    if (c.name !== 'show_sentence' || (/^not /.test(c.outcome) && !c.pointsAt) || !Array.isArray(c.args.emphasis)) continue;
    for (const w of c.args.emphasis as unknown[]) {
      const word = typeof w === 'string' ? w.trim() : '';
      if (!word || out.some((x) => x.toLowerCase() === word.toLowerCase())) continue;
      if (wholeWord(word).test(text)) out.push(word);
    }
  }
  return out;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wholeWord = (w: string, flags = 'iu') => new RegExp(`(?<![\\p{L}\\p{N}'’])${escape(w).replace(/\s+/g, '\\s+')}(?![\\p{L}\\p{N}'’])`, flags);

export type V2NoteSegment = { text: string; mark?: true };

/** A line of a note as the board draws it: plain runs and marked targets. `quoted`: short quoted spans are targets, drawn
 *  without their quote marks (markdown bold is taken off any span). `stress`: these words are marked where they stand as
 *  whole words, outside the quoted targets. With neither, the line is one plain run. */
export function v2NoteSegments(text: string, opts: { quoted?: boolean; stress?: readonly string[] } = {}): V2NoteSegment[] {
  const s = String(text ?? '');
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
  if (stress.length) {
    const re = new RegExp(stress.map((w) => wholeWord(w, 'iu').source).join('|'), 'giu');
    segs = segs.flatMap((seg) => {
      if (seg.mark) return [seg];
      const out: V2NoteSegment[] = []; let at = 0;
      for (const m of seg.text.matchAll(re)) { out.push({ text: seg.text.slice(at, m.index) }, { text: m[0], mark: true }); at = (m.index ?? 0) + m[0].length; }
      out.push({ text: seg.text.slice(at) });
      return out;
    });
  }
  // Adjacent plain runs joined, empty runs dropped.
  const merged: V2NoteSegment[] = [];
  for (const seg of segs) {
    if (!seg.text) continue;
    const last = merged[merged.length - 1];
    if (last && !last.mark && !seg.mark) last.text += seg.text; else merged.push({ ...seg });
  }
  return merged;
}
