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
import { dropFillersAndRepeats } from './filler-repeats';

/** 'echo' (GDI run 3): the tutor quoting the student's own words back (often
 *  the wrong ones) — never a card, unless the check found the student's
 *  sentence correct and the turn corrects nothing (planSentenceBoard, Task 15
 *  §A): then it is a model card. */
export interface QuotedSentence {
  sentence: string; kind: 'correction' | 'model' | 'echo'; emphasis: string[];
  /** Task 15 §A — why a model card exists when the student's sentence was
   *  checked correct: 'echo' = a quote of the student's own (correct) words,
   *  'checked' = the check's sentence, said unquoted by the tutor. */
  source?: 'echo' | 'checked';
}

export const SENTENCE_BOARD_MAX_PER_TURN = 2;

const MIN_WORDS = 3;
const MAX_EMPHASIS = 4;
const CORRECTION_OVERLAP = 0.5;
/** A quote whose tokens are all the student's is an echo of the student
 *  (Task 18 §D: whatever share of the student's words it covers). */

/** Straight or curly double quotes, Japanese corner brackets 「…」 / 『…』
 *  (GDI run 4: the bilingual tutor quotes corrections that way) and curly
 *  single quotes ‘…’ (an apostrophe ’ followed by a letter — haven’t — does
 *  not close the span); one line at most. */
const QUOTE_RE = /"([^"\n]+)"|“([^”\n]+)”|「([^」\n]+)」|『([^』\n]+)』|‘((?:[^’\n]|’(?=\p{L}))+)’/gu;
/** The inner text of a QUOTE_RE match, whichever quote style matched. */
const quoteInner = (m: RegExpMatchArray): string => m.slice(1).find((g) => g !== undefined) ?? '';
/** Hiragana/katakana, CJK ideographs, Hangul, fullwidth forms. */
const CJK_RE = /[　-ヿ㐀-䶿一-鿿豈-﫿가-힯＀-￯]/;
const LATIN_WORD_RE = /[A-Za-zÀ-ɏ]/;
const TOKEN_RE = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
/** Like TOKEN_RE but a hyphenated compound (front-load) is one word — used
 *  only to pick emphasis words, so "front load" → "front-load" stresses the
 *  compound as a whole. */
const COMPOUND_RE = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;
const lowerTok = (w: string) => w.toLowerCase().replace(/’/g, "'");

/** Task 18 §D (GDI run 6: "3" vs "three" made the student's own sentence
 *  look corrected): digits read as number words — 0–20 and the tens 30…90 —
 *  so "3" ≡ "three" and "30" ≡ "thirty". Other numbers stay digits. */
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const TENS_WORDS: Record<number, string> = { 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety' };
export function numberWordToken(tok: string): string {
  if (!/^\d+$/.test(tok)) return tok;
  const n = Number(tok);
  if (n <= 20) return NUMBER_WORDS[n]!;
  return TENS_WORDS[n] ?? String(n);
}
/** Thousands separators dropped ("1,000" → "1000") before tokenising. */
const dropThousands = (text: string) => (text ?? '').replace(/(\d),(?=\d{3}(?!\d))/g, '$1');

/** Lowercase words, punctuation stripped, apostrophes kept (haven't), digits
 *  as number words (numberWordToken). */
function tokens(text: string): string[] {
  return (dropThousands(text).match(TOKEN_RE) ?? []).map((t) => numberWordToken(t.toLowerCase().replace(/’/g, "'")));
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

/** Quoted spans ("…", “…”, 「…」, 『…』, ‘…’) of ≥ 3 words made of Latin letters; a span ending in "…"/"..." or containing CJK is ignored; trailing ?/!/. inside the quotes kept. */
export function extractQuotedSentences(text: string): string[] {
  if (!text) return [];
  const out: string[] = [];
  for (const m of text.matchAll(QUOTE_RE)) {
    const span = qualifyingSpan(quoteInner(m));
    if (span) out.push(span);
  }
  return out;
}

/** Task 18 §D: how far before / after a quote its introducing words are read. */
const INTRO_WINDOW = 40;
/** "starting with "Last year, I"" — a sentence STARTER, not a sentence. */
const STARTER_INTRO_RE = /\b(?:starting with|beginning with|start with|begin with|that starts with)\s*[:,]?\s*$/i;
const STARTER_AFTER_RE = /^\s*(?:で|から)始め/;
/** "you said "Customer from USA."" — the student's own words quoted back. */
/*  "you say" only as a report — never the ask "Can you say …" / "to you say".
 *  Fix round 2 (I2): the intro must lead straight into the quote — no sentence
 *  or clause break (. ! ? ; :) and no say / try / repeat / like / use between
 *  them ("You said you sold nine machines, so say "…"" is a correction ask).
 *  A colon right after the intro ("You said: "…"") still counts. */
const SAID_INTRO_RE = /\b(?:you said|(?<!\b(?:can|could|would|will|to|please|did|do|does|should|now|then|let)\s+)you say|you just said|you told me)\b[,:]?(?![^"“「『‘]*(?:[.!?;:]|\b(?:say|try|repeat|like|use)\b))[^"“「『‘]*$/i;
const SAID_AFTER_RE = /^\s*(?:と|って)言いました/;
/** A span ending on a bare subject pronoun / article after a comma ("Last week, I"). */
const DANGLING_END_RE = /,\s*(?:I|you|we|they|he|she|it|the|a|an)[.!?]?$/i;

/** Qualifying quoted spans with the text just before (INTRO_WINDOW + 20 chars
 *  of lookbehind context; introWithin) and after each. */
function quotedSpansWithContext(text: string): Array<{ span: string; before: string; after: string }> {
  const out: Array<{ span: string; before: string; after: string }> = [];
  if (!text) return out;
  for (const m of text.matchAll(QUOTE_RE)) {
    const span = qualifyingSpan(quoteInner(m));
    if (!span) continue;
    const at = m.index ?? 0;
    out.push({ span, before: text.slice(Math.max(0, at - INTRO_WINDOW - 20), at), after: text.slice(at + m[0].length, at + m[0].length + INTRO_WINDOW) });
  }
  return out;
}

/** True when `re` matches `before` with the match starting inside its last
 *  INTRO_WINDOW characters — `before` may be longer so a lookbehind sees the
 *  word ahead of the window ("Can| you say"). */
function introWithin(re: RegExp, before: string): boolean {
  const b = before ?? '';
  const m = re.exec(b);
  return !!m && (m.index ?? 0) >= b.length - INTRO_WINDOW;
}

/** Task 18 §D: a quoted sentence STARTER ("starting with "Last year, I"",
 *  「"Last week, I"で始めて」, or any span ending ", I" / ", the" …) is not a
 *  card. */
export function isSentenceStarter(span: string, before: string, after: string): boolean {
  return introWithin(STARTER_INTRO_RE, before) || STARTER_AFTER_RE.test(after ?? '') || DANGLING_END_RE.test((span ?? '').trim());
}

/** Task 18 §D: the quote is introduced as the student's own words ("you
 *  said …", 「…と言いました」) — an echo, never promoted. */
export function isSaidQuote(before: string, after: string): boolean {
  return introWithin(SAID_INTRO_RE, before) || SAID_AFTER_RE.test(after ?? '');
}

/** `needle` occurs in `hay` as one unbroken run. */
function isContiguousRun(needle: readonly string[], hay: readonly string[]): boolean {
  if (needle.length === 0 || needle.length > hay.length) return false;
  outer: for (let i = 0; i + needle.length <= hay.length; i++) {
    for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
    return true;
  }
  return false;
}

/** Fix round 2 (I1): emphasis for a deletion / reorder correction — the quote
 *  words that do not follow, in the student's words, the word before them in
 *  the quote (they neighbour a deletion or moved), max MAX_EMPHASIS. */
function reorderEmphasis(sentence: string, said: readonly string[]): string[] {
  const pairs = new Set<string>();
  for (let i = 1; i < said.length; i++) pairs.add(`${said[i - 1]} ${said[i]}`);
  const words = dropThousands(sentence).match(TOKEN_RE) ?? [];
  const out: string[] = [];
  for (let i = 1; i < words.length && out.length < MAX_EMPHASIS; i++) {
    const a = numberWordToken(lowerTok(words[i - 1]!));
    const b = numberWordToken(lowerTok(words[i]!));
    if (!pairs.has(`${a} ${b}`) && !out.includes(words[i]!)) out.push(words[i]!);
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
  const quoteSet = new Set(tokens(sentence));
  if (quoteSet.size === 0) return model;
  let shared = 0;
  for (const t of quoteSet) if (student.has(t)) shared++;
  const novel = quoteSet.size - shared;
  // Task 18 §D (GDI run 6: "I once had got" — the student's wrong fragment
  // quoted inside a correction turn): a quote that is an unbroken run of the
  // student's own words, in the student's order, is an echo — however little
  // of what the student said it covers. Fix round 2 (I1): every token being
  // the student's is NOT enough — "I am agree" → "I agree", "discussed about"
  // → "discussed", "I yesterday went" → "Yesterday I went" delete or reorder
  // the student's words, and those are corrections.
  if (novel === 0) {
    // Fix round 3 (N1): self-repairs and stutters ("to the, to the office",
    // "worked worked", "like, like") collapse first, on both sides (the
    // filler set includes "like", so the quote is filtered the same way).
    const said = dropFillersAndRepeats(tokens(studentLast));
    const quoted = dropFillersAndRepeats(tokens(sentence));
    if (quoted.length === 0 || isContiguousRun(quoted, said)) return { sentence, kind: 'echo', emphasis: [] };
    const emphasis = reorderEmphasis(sentence, said);
    // nothing moved or neighbours a deletion ⇒ still the student's sentence
    if (emphasis.length === 0) return { sentence, kind: 'echo', emphasis: [] };
    return { sentence, kind: 'correction', emphasis };
  }
  if (shared / quoteSet.size < CORRECTION_OVERLAP) return model;
  const emphasis: string[] = [];
  const seen = new Set<string>();
  const studentCompounds = new Set((dropThousands(studentLast).match(COMPOUND_RE) ?? []).map(lowerTok));
  for (const w of dropThousands(sentence).match(COMPOUND_RE) ?? []) {
    const t = numberWordToken(lowerTok(w));
    if (seen.has(t)) continue;
    if (w.includes('-') ? studentCompounds.has(t) : student.has(t)) continue;
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
/** GDI run 3 (2026-10-29): a quoted ASK ("…?") belongs to the question pin,
 *  and a span starting lowercase is a fragment ("for your current company,") —
 *  neither is ever a card. */
export function isCardCandidate(span: string): boolean {
  const s = span.trim();
  if (/\?["”’)]?$/.test(s)) return false;
  return !/^\p{Ll}/u.test(s);
}

/** Task 19 §D: leading fillers the student opens with ("Okay. Um, …"). */
const LEADING_FILLER_RE = /^\s*(?:uh|um|okay|ok|well|so|hmm)\b[,.]?\s*/i;
/** Hesitations inside the sentence ("I have uh attended") — never words. */
const INNER_HESITATION_RE = /(?<=\s)(?:uh|um|erm|er|hmm)\b[,.]?\s+/gi;
/** A checked card needs at least this many Latin words. */
const CHECKED_CARD_MIN_WORDS = 4;

/** Task 19 §D: the checked student sentence as a card — leading fillers
 *  (uh, um, okay, ok, well, so, hmm, with a following comma / period) and
 *  inner hesitations removed, first letter capitalised, a trailing "." ensured;
 *  null unless it passes qualifyingSpan + isCardCandidate with ≥ 4 Latin words. */
export function cardableStudentSentence(raw: string | null | undefined): string | null {
  let s = (raw ?? '').trim();
  for (let prev = ''; prev !== s;) { prev = s; s = s.replace(LEADING_FILLER_RE, ''); }
  s = s.replace(INNER_HESITATION_RE, '').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  s = s[0]!.toUpperCase() + s.slice(1);
  if (!/[.!?]["”’)]?$/.test(s)) s = s.replace(/[,;:]+$/, '') + '.';
  const span = qualifyingSpan(s);
  if (!span || !isCardCandidate(span)) return null;
  if (span.split(/\s+/).filter((w) => LATIN_WORD_RE.test(w)).length < CHECKED_CARD_MIN_WORDS) return null;
  return span;
}

/**
 * Task 15 §A (GDI run 5): a quote that echoes a sentence the independent check
 * found CORRECT is a model sentence, not the run-3 wrong-words echo — so with
 * `studentCorrect` an 'echo' is kept as a model card (source 'echo'), and the
 * check's own sentence (`checkedSentence`), when the tutor says it word for
 * word without quotes, is added as a model card (source 'checked'). With
 * `studentCorrect` falsy nothing changes.
 */
export function planSentenceBoard(input: {
  tutorText: string; studentLast: string | null | undefined; renderedThisTurn: boolean;
  /** the independent check found the student's last sentence correct (verdict 'correct', precheckDecides) */
  studentCorrect?: boolean;
  /** the check's `proposed` sentence (what the student's message proposes), when studentCorrect */
  checkedSentence?: string | null;
}): QuotedSentence[] {
  if (input.renderedThisTurn) return [];
  const studentCorrect = input.studentCorrect === true;
  const spans = quotedSpansWithContext(input.tutorText)
    .filter((q) => isCardCandidate(q.span) && !isSentenceStarter(q.span, q.before, q.after));
  const distinct: { s: string; n: string; said: boolean }[] = [];
  for (const q of spans) {
    const n = norm(q.span);
    const said = isSaidQuote(q.before, q.after);
    const dup = distinct.find((d) => d.n === n);
    if (dup) { dup.said = dup.said || said; continue; }
    if (!n) continue;
    distinct.push({ s: q.span, n, said });
  }
  const kept = distinct.filter((d) => !distinct.some((o) => o !== d && o.n.length > d.n.length && ` ${o.n} `.includes(` ${d.n} `)));
  // Task 18 §D: a quote introduced as the student's words ("you said …") is
  // an echo whatever its overlap, and is never promoted.
  const raw = kept.map((d, i) => ({
    q: d.said ? { sentence: d.s, kind: 'echo' as const, emphasis: [] } : classifyQuotedSentence(d.s, input.studentLast),
    len: d.n.length, i, said: d.said,
  }));
  // Fix round 1 (I2): a turn that corrects the student's sentence says it was
  // NOT right as it stood (it passed the check "for the task as stated") —
  // no echo promotion, no checked-sentence card; the correction is the card.
  const promote = studentCorrect && !raw.some((c) => c.q.kind === 'correction');
  const classified = raw
    .map((c) => (c.q.kind === 'echo' && promote && !c.said ? { ...c, q: { sentence: c.q.sentence, kind: 'model' as const, emphasis: [], source: 'echo' as const } } : c))
    .filter((c) => c.q.kind !== 'echo');
  // Task 19 §D (GDI run 7): the tutor paraphrased correct sentences ("Creating
  // the slogan was the challenge…") and nothing was carded for six minutes.
  // A correct student sentence goes on the board whether or not the tutor
  // repeats it — no sentenceContains requirement.
  if (promote && input.checkedSentence) {
    const checked = cardableStudentSentence(input.checkedSentence);
    if (checked && !classified.some((c) => sameSentence(c.q.sentence, checked))) {
      classified.push({ q: { sentence: checked, kind: 'model', emphasis: [], source: 'checked' }, len: norm(checked).length, i: kept.length, said: false });
    }
  }
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
  const span = correctionSpan(spokenSentence, studentLast);
  if (!span) return spokenSentence;
  return spokenSentence.slice(0, span.start) + applySpokenEmphasis(span.inner, span.emphasis) + spokenSentence.slice(span.end);
}

/** The quoted correction a spoken sentence stresses (the longest), or null. */
function correctionSpan(spokenSentence: string, studentLast: string | null | undefined): { start: number; end: number; inner: string; emphasis: string[] } | null {
  if (!spokenSentence || !studentLast || !studentLast.trim()) return null;
  let best: { start: number; end: number; inner: string; emphasis: string[]; len: number } | null = null;
  for (const m of spokenSentence.matchAll(QUOTE_RE)) {
    const inner = quoteInner(m);
    if (!qualifyingSpan(inner)) continue;
    // A quoted sentence starter ("starting with "I have been"") is never a
    // correction to stress (Task 18 fix round 2).
    const at = m.index ?? 0;
    if (isSentenceStarter(inner.trim(), spokenSentence.slice(Math.max(0, at - INTRO_WINDOW - 20), at), spokenSentence.slice(at + m[0].length, at + m[0].length + INTRO_WINDOW))) continue;
    const q = classifyQuotedSentence(inner.trim(), studentLast);
    if (q.kind !== 'correction' || q.emphasis.length === 0) continue;
    const len = norm(inner).length;
    if (!best || len > best.len) {
      const start = (m.index ?? 0) + 1;
      best = { start, end: start + inner.length, inner, emphasis: q.emphasis, len };
    }
  }
  if (best) return best;
  // A sentence splitter that cut at the period inside the quotes leaves an
  // unclosed trailing quote ('… say: "I haven't taken leave from work.').
  const quoteChars = (spokenSentence.match(/"/g) ?? []).length;
  const unclosed = (o: string, c: string) => (spokenSentence.lastIndexOf(o) > spokenSentence.lastIndexOf(c) ? spokenSentence.lastIndexOf(o) : -1);
  const open = quoteChars % 2 === 1 ? spokenSentence.lastIndexOf('"') : Math.max(unclosed('“', '”'), unclosed('「', '」'), unclosed('『', '』'));
  if (open < 0) return null;
  const inner = spokenSentence.slice(open + 1);
  if (!qualifyingSpan(inner)) return null;
  const q = classifyQuotedSentence(inner.trim(), studentLast);
  if (q.kind !== 'correction' || q.emphasis.length === 0) return null;
  return { start: open + 1, end: spokenSentence.length, inner, emphasis: q.emphasis };
}

/**
 * The Cartesia transcript for a display sentence: `rewrite` (rewriteForTTS)
 * FIRST, then the stress. The order matters: rewriteForTTS lowercases
 * all-caps words (a sonic-2-era rule) and strips the double quotes, so the
 * stress is decided on the DISPLAY text (quotes intact) and re-applied to the
 * rewritten text — inside the rewritten quote span when it can be found,
 * else across the sentence. `cards` = the turn's brain show_sentence cards:
 * a sentence that contains a card's sentence gets that card's emphasis.
 */
export function composeSpokenText(
  raw: string,
  studentLast: string | null | undefined,
  rewrite: (s: string) => string,
  cards: ReadonlyArray<{ sentence: string; emphasis: string[] }> = [],
): string {
  let out = rewrite(raw);
  const span = correctionSpan(raw, studentLast);
  if (span) {
    const at = locateWords(out, span.inner);
    out = at
      ? out.slice(0, at[0]) + applySpokenEmphasis(out.slice(at[0], at[1]), span.emphasis) + out.slice(at[1])
      : applySpokenEmphasis(out, span.emphasis);
  }
  // A brain show_sentence card: at most MAX_EMPHASIS words of ≥ 2 letters,
  // stressed only inside the card's own sentence where the speech says it.
  for (const c of cards) {
    const words = (c.emphasis ?? []).filter((w) => typeof w === 'string' && (w.match(/\p{L}/gu) ?? []).length >= 2).slice(0, MAX_EMPHASIS);
    if (!words.length || !sentenceContains(raw, c.sentence)) continue;
    const at = locateWords(out, c.sentence);
    if (at) out = out.slice(0, at[0]) + applySpokenEmphasis(out.slice(at[0], at[1]), words) + out.slice(at[1]);
  }
  return out;
}

/** [start, end) of `words`' token run inside `text` (case-insensitive, any
 *  punctuation / spacing between words), or null. */
function locateWords(text: string, words: string): [number, number] | null {
  const toks = (words.match(TOKEN_RE) ?? []).map((t) => escapeRe(t).replace(/['’]/g, "['’]"));
  if (!toks.length) return null;
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${toks.join("[^\\p{L}\\p{N}'’]+")}(?![\\p{L}\\p{N}])`, 'iu');
  const m = re.exec(text);
  return m ? [m.index, m.index + m[0].length] : null;
}

/** Render-sync anchor for an auto card: the number of spoken sentences that
 *  PRECEDE the one saying `sentence` (render-sync paints a command once that
 *  many sentences have played, i.e. as the card's own sentence starts — "the
 *  tutor writes as it speaks"). undefined when no sentence says it (the card
 *  then anchors to the live sentence count). Falls back to the sentence
 *  holding its first three words (a splitter that cut the quote). */
export function sentenceAnchorIndex(narration: readonly string[], sentence: string): number | undefined {
  let i = narration.findIndex((n) => sentenceContains(n, sentence));
  if (i < 0) {
    const head = tokens(sentence).slice(0, 3).join(' ');
    if (head) i = narration.findIndex((n) => ` ${norm(n)} `.includes(` ${head} `));
  }
  return i >= 0 ? i : undefined;
}

/** True when `text` contains `sentence` word for word (case, punctuation and
 *  spacing ignored) — matches a brain show_sentence card to the spoken
 *  sentence that says it. */
export function sentenceContains(text: string, sentence: string): boolean {
  const s = norm(sentence ?? '');
  return !!s && ` ${norm(text ?? '')} `.includes(` ${s} `);
}

/** True when the current page (everything after the last newPage / clear)
 *  already shows `sentence` as a showSentence card or a handwrite line
 *  (case and punctuation ignored). */
export function sentenceOnCurrentPage(commands: ReadonlyArray<{ action: string } & Record<string, unknown>>, sentence: string): boolean {
  const target = norm(sentence ?? '');
  if (!target) return false;
  for (let i = commands.length - 1; i >= 0; i--) {
    const c = commands[i];
    if (c.action === 'newPage' || c.action === 'clear') return false;
    if (c.action === 'showSentence') {
      if (typeof c.sentence === 'string' && sameSentence(c.sentence, sentence)) return true;
      continue;
    }
    if (c.action === 'handwrite' && typeof c.text === 'string' && norm(c.text) === target) return true;
  }
  return false;
}

/** Two sentence cards say the same sentence: one contains the other word for
 *  word (case, punctuation and spacing ignored) — "I am a sales manager at my
 *  company" and "I am a sales manager at my company." are one card. */
export function sameSentence(a: string, b: string): boolean {
  return sentenceContains(a, b) || sentenceContains(b, a);
}

/** GDI trial run 2 (2026-10-29): an auto card and the brain's own
 *  show_sentence of the same sentence both stayed on the board. Ids of the
 *  AUTO cards (`autoIds`) on the current page (after the last newPage / clear
 *  in `commands`) that say `sentence` — the brain's card replaces them. */
export function autoSentenceCardsToReplace(
  commands: ReadonlyArray<{ action: string } & Record<string, unknown>>,
  autoIds: ReadonlySet<string>,
  sentence: string,
): string[] {
  const out: string[] = [];
  if (!autoIds.size || !norm(sentence ?? '')) return out;
  for (let i = commands.length - 1; i >= 0; i--) {
    const c = commands[i];
    if (c.action === 'newPage' || c.action === 'clear') break;
    if (c.action !== 'showSentence' || typeof c.id !== 'string' || !autoIds.has(c.id)) continue;
    if (typeof c.sentence === 'string' && sameSentence(c.sentence, sentence)) out.push(c.id);
  }
  return out;
}

/** Task 14 §I (GDI run 4: the hook sentence rendered on three pages): the
 *  1-based page (pages = newPage boundaries in the session's command log)
 *  where a showSentence card saying the same sentence (case, punctuation and
 *  spacing ignored — word-for-word equal) already stands, or null. `skipIds`
 *  = cards to ignore (an auto card on the current page that the brain's card
 *  replaces). Earliest page wins. */
export function sentenceOnBoardPage(
  commands: ReadonlyArray<{ action: string } & Record<string, unknown>>,
  sentence: string,
  skipIds: ReadonlySet<string> = new Set(),
): number | null {
  const target = norm(sentence ?? '');
  if (!target) return null;
  let page = 1;
  const hits: number[] = [];
  for (const c of commands) {
    if (c.action === 'newPage') { page++; continue; }
    // a clear wipes the current page — its cards are no longer on the board
    if (c.action === 'clear') { while (hits.length && hits[hits.length - 1] === page) hits.pop(); continue; }
    if (c.action !== 'showSentence' || typeof c.sentence !== 'string') continue;
    if (typeof c.id === 'string' && skipIds.has(c.id)) continue;
    if (norm(c.sentence) === target) hits.push(page);
  }
  return hits.length ? hits[0] : null;
}

/** Ids of the AUTO sentence cards on the current page (after the last
 *  newPage / clear) — the brain's card of the same sentence replaces them. */
export function autoCardIdsOnCurrentPage(
  commands: ReadonlyArray<{ action: string } & Record<string, unknown>>,
  autoIds: ReadonlySet<string>,
): Set<string> {
  const out = new Set<string>();
  for (let i = commands.length - 1; i >= 0; i--) {
    const c = commands[i];
    if (c.action === 'newPage' || c.action === 'clear') break;
    if (c.action === 'showSentence' && typeof c.id === 'string' && autoIds.has(c.id)) out.add(c.id);
  }
  return out;
}
