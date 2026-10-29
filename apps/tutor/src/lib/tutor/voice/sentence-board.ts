/**
 * Sentence cards for language lessons (2026-10-29).
 *
 * The bilingual prompt orders the brain to write every model / corrected
 * sentence on the board, but live run 1 showed it rarely does (3 of 29 turns).
 * So the client does it itself: when a language-session turn rendered nothing
 * and the tutor QUOTED a sentence, the quoted sentence becomes a `showSentence`
 * card. A quote that repeats most of what the student just said but changes
 * something is a correction — its changed words are highlighted on the card
 * and stressed (uppercased) in the string sent to TTS. Capitals are the stress
 * mechanism because, measured on Cartesia sonic-3, they make the word louder
 * and longer without touching the rest of the sentence (SSML-ish tags garble
 * timing). Display text is never uppercased.
 *
 * Pure: no React, no I/O.
 */

export interface QuotedSentence { sentence: string; kind: 'correction' | 'model'; emphasis: string[] }

export const SENTENCE_BOARD_MAX_PER_TURN = 2;

const MIN_WORDS = 3;
const MAX_EMPHASIS = 4;
const CORRECTION_OVERLAP = 0.5;

/** Straight or curly double quotes; one line at most. */
const QUOTE_RE = /"([^"\n]+)"|“([^”\n]+)”/g;
/** Hiragana/katakana, CJK ideographs, Hangul, fullwidth forms. */
const CJK_RE = /[　-ヿ㐀-䶿一-鿿豈-﫿가-힯＀-￯]/;
const LATIN_WORD_RE = /[A-Za-zÀ-ɏ]/;
const TOKEN_RE = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;

/** Lowercase words, punctuation stripped, apostrophes kept (haven't). */
function tokens(text: string): string[] {
  return (text.match(TOKEN_RE) ?? []).map((t) => t.toLowerCase().replace(/’/g, "'"));
}

/** A quoted span that may be a sentence card (trimmed), or null. */
function qualifyingSpan(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (/(…|\.\.\.)$/.test(s)) return null;
  if (CJK_RE.test(s)) return null;
  const words = s.split(/\s+/).filter((w) => LATIN_WORD_RE.test(w));
  return words.length >= MIN_WORDS ? s : null;
}

/** Double-quoted spans ("…" or “…”) of ≥ 3 words made of Latin letters; a span ending in "…"/"..." or containing CJK is ignored; trailing ?/!/. inside the quotes kept. */
export function extractQuotedSentences(text: string): string[] {
  if (!text) return [];
  const out: string[] = [];
  for (const m of text.matchAll(QUOTE_RE)) {
    const span = qualifyingSpan(m[1] ?? m[2] ?? '');
    if (span) out.push(span);
  }
  return out;
}

/**
 * correction ⇔ studentLast present AND |quoteTokens ∩ studentTokens| / |quoteTokens| ≥ 0.5
 * AND at least one quote token is not in studentTokens. emphasis = quote words
 * (original form, deduped, in order) whose token is not in studentTokens, max 4.
 * Otherwise kind 'model', emphasis [].
 */
export function classifyQuotedSentence(sentence: string, studentLast: string | null | undefined): QuotedSentence {
  const model: QuotedSentence = { sentence, kind: 'model', emphasis: [] };
  if (!studentLast || !studentLast.trim()) return model;
  const student = new Set(tokens(studentLast));
  if (student.size === 0) return model;
  const quoteWords = sentence.match(TOKEN_RE) ?? [];
  const quoteSet = new Set(quoteWords.map((w) => w.toLowerCase().replace(/’/g, "'")));
  if (quoteSet.size === 0) return model;
  let shared = 0;
  for (const t of quoteSet) if (student.has(t)) shared++;
  const novel = quoteSet.size - shared;
  if (shared / quoteSet.size < CORRECTION_OVERLAP || novel === 0) return model;
  const emphasis: string[] = [];
  const seen = new Set<string>();
  for (const w of quoteWords) {
    const t = w.toLowerCase().replace(/’/g, "'");
    if (student.has(t) || seen.has(t)) continue;
    seen.add(t);
    emphasis.push(w);
    if (emphasis.length >= MAX_EMPHASIS) break;
  }
  return { sentence, kind: 'correction', emphasis };
}

const norm = (s: string) => tokens(s).join(' ');

/**
 * Distinct quoted sentences (case-insensitive; a sentence contained in a longer
 * one — "I haven't taken leave" in "I haven't taken leave from work" — is
 * dropped), classified; corrections first, longest first; models after in the
 * order spoken; capped at SENTENCE_BOARD_MAX_PER_TURN. [] when the turn
 * already rendered something.
 */
export function planSentenceBoard(input: { tutorText: string; studentLast: string | null | undefined; renderedThisTurn: boolean }): QuotedSentence[] {
  if (input.renderedThisTurn) return [];
  const spans = extractQuotedSentences(input.tutorText);
  const distinct: { s: string; n: string }[] = [];
  for (const s of spans) {
    const n = norm(s);
    if (!n || distinct.some((d) => d.n === n)) continue;
    distinct.push({ s, n });
  }
  const kept = distinct.filter((d) => !distinct.some((o) => o !== d && o.n.length > d.n.length && ` ${o.n} `.includes(` ${d.n} `)));
  const classified = kept.map((d, i) => ({ q: classifyQuotedSentence(d.s, input.studentLast), len: d.n.length, i }));
  classified.sort((a, b) => {
    const ka = a.q.kind === 'correction' ? 0 : 1;
    const kb = b.q.kind === 'correction' ? 0 : 1;
    if (ka !== kb) return ka - kb;
    if (ka === 0 && a.len !== b.len) return b.len - a.len;
    return a.i - b.i;
  });
  return classified.slice(0, SENTENCE_BOARD_MAX_PER_TURN).map((c) => c.q);
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Spoken form: each emphasis word (whole word, case-insensitive, ≥ 2 letters) uppercased inside the sentence. Display text is never changed. */
export function applySpokenEmphasis(sentence: string, emphasis: string[]): string {
  let out = sentence;
  for (const raw of emphasis ?? []) {
    const word = (raw ?? '').trim();
    if ((word.match(/\p{L}/gu) ?? []).length < 2) continue;
    const pattern = escapeRe(word).replace(/['’]/g, "['’]");
    const re = new RegExp(`(?<![\\p{L}\\p{N}'’])${pattern}(?![\\p{L}\\p{N}]|['’][\\p{L}\\p{N}])`, 'giu');
    out = out.replace(re, (m) => m.toUpperCase());
  }
  return out;
}

/**
 * For a spoken tutor sentence: the quoted correction span inside it gets
 * applySpokenEmphasis; everything else untouched (byte-identical). When one
 * sentence quotes several corrections only the LONGEST is stressed — the main
 * correction; stressing every alternative phrasing sounds like shouting.
 */
export function emphasiseSpokenCorrections(spokenSentence: string, studentLast: string | null | undefined): string {
  if (!spokenSentence || !studentLast || !studentLast.trim()) return spokenSentence;
  let best: { start: number; end: number; inner: string; emphasis: string[]; len: number } | null = null;
  for (const m of spokenSentence.matchAll(QUOTE_RE)) {
    const inner = m[1] ?? m[2] ?? '';
    if (!qualifyingSpan(inner)) continue;
    const q = classifyQuotedSentence(inner.trim(), studentLast);
    if (q.kind !== 'correction' || q.emphasis.length === 0) continue;
    const len = norm(inner).length;
    if (!best || len > best.len) {
      const start = (m.index ?? 0) + 1;
      best = { start, end: start + inner.length, inner, emphasis: q.emphasis, len };
    }
  }
  if (!best) return spokenSentence;
  return spokenSentence.slice(0, best.start) + applySpokenEmphasis(best.inner, best.emphasis) + spokenSentence.slice(best.end);
}
