/**
 * Tutor brain v2 — the learner's sentence on the board, as it should be (Task 7b, BOARD_LEARNER_SENTENCE).
 *
 * Mic test 1 (embed-1794882458629): the tutor corrected the learner twice and boarded neither correction ("we say "I have
 * worked at … for five years."" was only spoken), and "Last year I went to … in Beijing" was praised and not boarded. The
 * product owner's decision: every sentence the learner gets right goes on the board, with the corrections if needed.
 *
 * The session part already asks for a card for every sentence the tutor models or corrects (sentence-cards.ts); the model
 * skipped it in those replies (no show_sentence call in the session's debug events: nothing was dropped). Two parts:
 *   - a runtime card where it is safe: the reply quotes a whole sentence that is either the corrected form of the learner's
 *     last words (a lead-in that gives it as the form to use: "we say", "it's", "please say it:") or their words as said,
 *     praised in the same sentence ("That's right: "…""), and the reply writes no card of its own. The card is written
 *     where the quote's sentence ends, so it is painted as that sentence is spoken; the quote is already said, so the card
 *     is never spoken again. Stress: the card's words that are not in the learner's words. No gloss (the runtime has none).
 *   - a facts line when the learner's words were a sentence, for the case no quote shows: a sentence right first time
 *     praised without quoting it. Whether a tutor's "That's right." covers the whole sentence is not something the runtime
 *     can tell, so it does not write that card itself.
 * The runtime abstains (a missing card is better than a false one): no quote; a quote of under four words, not starting
 * with a capital, with a gap or "…" in it; a quote after "you said", "not", "instead of" or followed by "is wrong"; a
 * quote whose words are less than half the learner's (a model sentence of the tutor's own, or a correction of an earlier
 * answer); their words quoted without praise in the same sentence, or covering under four fifths of what they said; a
 * card of the model's earlier in the reply; a sentence already on the board as a card, or on the page in view, or among
 * their corrected sentences; the level check running; a reply that already has its runtime card; no words from them.
 *
 * Spoken lessons taught in two languages only (the sentence cards' gate, sentence-cards.ts v2SentenceCardsOn, in a voice
 * session): maths and science, one-language lessons, typed lessons, homework and a discussion are unchanged.
 */
import { TUTOR_V2_BOARD_LEARNER_SENTENCE } from '../orchestrator/flags';
import { languageNameOf } from '../voice/language-request';
import type { InlineBlock, InlinePart } from './board-inline';
import { v2SentenceCardsOn } from './sentence-cards';
import type { V2Board, V2Session, V2State } from './types';
import { v2LevelCheckOn, v2LevelCheckOver } from './working-level';

const tokens = (text: string) => (text.toLowerCase().replace(/[’‘]/g, "'").match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu) ?? []);
const FILLER = /^(?:u+h+|u+m+|u+hm+|e+r+m*|a+h+|h+m+|m{2,}|eh)$/;
/** Words that open an answer without being part of the sentence ("Yes, we move on." is a yes). */
const OPENERS = new Set(['yes', 'yeah', 'yep', 'no', 'nope', 'ok', 'okay', 'well', 'so', 'oh', 'sorry', 'please', 'thanks', 'right', 'sure']);
/** A sentence of theirs has at least this many words, openers and fillers aside. */
const MIN_WORDS = 4;
const MAX_CARD_CHARS = 200;
const MAX_STRESS = 4;

/** The learner's words as a sentence: fillers and stutters ("I I") out, a yes or a sorry at its head aside; null when what
 *  is left is under four words (a yes, "makes sense") or a question. */
export function v2LearnerSentence(said: string | null | undefined): string | null {
  const text = (said ?? '').replace(/\s+/g, ' ').trim();
  if (!text || /\?\s*$/.test(text)) return null;
  const words = text.split(' ').filter((w) => !FILLER.test(w.toLowerCase().replace(/[^\p{L}]/gu, '')));
  const kept: string[] = [];
  for (const w of words) { const k = w.toLowerCase().replace(/[^\p{L}\p{N}']/gu, ''); if (kept.length && kept[kept.length - 1]!.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '') === k && !/[,.;:]$/.test(kept[kept.length - 1]!)) continue; kept.push(w); }
  while (kept.length && OPENERS.has(kept[0]!.toLowerCase().replace(/[^\p{L}]/gu, ''))) kept.shift();
  if (tokens(kept.join(' ')).length < MIN_WORDS) return null;
  let s = kept.join(' ').replace(/\s+([,.!])/g, '$1').replace(/,(?=[.!]?$)/, '').replace(/^[,;:\s]+/, '').trim();
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return /[.!]$/.test(s) ? s : `${s}.`;
}

/** The level check is running: the lesson has one, no level is set, and it is not over (working-level.ts). */
function levelCheckRunning(session: V2Session, state: V2State, heard: string | null | undefined): boolean {
  return v2LevelCheckOn(session) && !state.workingLevel && !v2LevelCheckOver(session, state, heard);
}

/** The rule runs: the flag, a spoken lesson taught in two languages (the sentence cards' gate), the level check not running,
 *  the lesson not closed. `enabled` is the flag (tests pass it). */
export function v2LearnerCardsOn(session: V2Session, state: V2State, heard: string | null | undefined, enabled: boolean = TUTOR_V2_BOARD_LEARNER_SENTENCE): boolean {
  return enabled && session.mode === 'voice' && v2SentenceCardsOn(session) && !state.closed && !levelCheckRunning(session, state, heard);
}

const key = (s: string) => tokens(s).join(' ');

/** The sentence is up already: a card of it on any page, or its words on the page in view (a note of examples), or among
 *  their corrected sentences (same-sentence de-dup, Task 4c). */
export function v2SentenceOnBoard(board: V2Board, sentence: string, corrected: readonly string[] = []): boolean {
  const k = key(sentence);
  if (!k) return true;
  if (corrected.some((c) => key(c) === k)) return true;
  if (board.pages.some((pg) => pg.items.some((it) => it.tool === 'show_sentence' && key(it.summary) === k))) return true;
  const page = board.pages[board.current];
  return !!page && page.items.some((it) => ` ${key(it.summary)} `.includes(` ${k} `));
}

/** A lead-in right before the quote that gives it as the form to use. */
const GIVES = /(?:\bwe(?: would|'d)? say|\byou (?:can|could|should|would) say|\b(?:please |now |just )?say (?:it|that|this|the (?:whole )?sentence)(?: again| once more| yourself| with "[^"]*")?|\b(?:please )?(?:try|repeat)(?: saying| it| that| after me)?|\bit(?:'s| is| would be| becomes)|\bthe (?:correct|right|natural|better|full) (?:sentence|form|way|version)(?: is| would be)?|\b(?:a )?more natural (?:way|sentence)(?: to say (?:it|that|this))?(?: is| would be)?|\bshould be|\bso it's)\s*[:,]?\s*$/i;
/** Words before the quote that make it their mistake, not the form to use. */
const MISTAKE_BEFORE = /\b(?:you said|you say|instead of|rather than|not|don't say|never say|isn't|wasn't|mistake|wrong)\b/i;
/** Words after the quote, in the same sentence, that take it back. */
const TAKEN_BACK = /^[^.!?]*?\b(?:is|was|sounds) (?:not|wrong|incorrect)\b|^[^.!?]*?\b(?:isn't|wasn't|instead)\b/i;
/** Praise of the quoted sentence in the same sentence. */
const PRAISE = /\b(?:that's|that is|it's|it is|is|was) (?:right|correct|perfect|exactly right|natural|clear|good)\b|\b(?:clear|good|correct|natural|great|nice|perfect) sentence\b|\bwell done\b|\bexactly\b|\bperfect\b|\bnicely (?:said|done)\b|\bcorrectly\b/i;
/** Praise held back: "almost", "but". */
const HEDGED = /\b(?:almost|nearly|but|except|not quite|one (?:small )?(?:thing|change)|small change)\b/i;

/** The card a finished reply sentence carries for the learner's words, or null (see the header for when it abstains). */
export function v2LearnerCardIn(sentence: string, learnerSaid: string | null | undefined): { sentence: string; stress: string[] } | null {
  const learner = v2LearnerSentence(learnerSaid);
  if (!learner) return null;
  const theirs = tokens(learner);
  let from = 0;
  for (const m of sentence.matchAll(/["“]([^"“”]+)["”]/g)) {
    const q = m[1]!.replace(/\s+/g, ' ').trim().replace(/[,;:]$/, '');
    const qt = tokens(q);
    // A quoted word or two ("collected") is part of the lead-in to the next quote.
    if (qt.length < MIN_WORDS || !/^[A-Z]/.test(q) || /…|\.\.\.|_|[<>]/.test(q) || q.length > MAX_CARD_CHARS) continue;
    // The words between the last quoted sentence (or clause) and this one: ""I goed …" is not right; we say "I went …""
    // gives the second.
    const before = sentence.slice(from, m.index).split(/[;—–]/).pop()!;
    from = m.index! + m[0].length;
    const after = sentence.slice(m.index! + m[0].length);
    if (MISTAKE_BEFORE.test(before) || TAKEN_BACK.test(after)) continue;
    const have = new Set(theirs);
    const shared = qt.filter((w) => have.has(w)).length / qt.length;
    if (shared < 0.5) continue;
    const card = /[.!?]$/.test(q) ? q : `${q}.`;
    const echo = ` ${theirs.join(' ')} `.includes(` ${qt.join(' ')} `);
    if (echo) {
      // Their words as said: praised in this sentence, and most of what they said.
      if (qt.length / theirs.length < 0.8 || !PRAISE.test(sentence) || HEDGED.test(sentence)) continue;
      return { sentence: card, stress: [] };
    }
    // A correction: given as the form to use.
    if (!GIVES.test(before)) continue;
    const stress = [...new Set((q.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? []).filter((w) => !have.has(tokens(w)[0] ?? '')))].slice(0, MAX_STRESS);
    return { sentence: card, stress };
  }
  return null;
}

const SENTENCE_END = /[.!?]+["'”’)]*(?=\s)|[。！？]+[」』"”]*/g;

/**
 * Watches one reply's streamed parts (turn.ts, between the inline stream and the turn's handling of words and blocks) and
 * writes the runtime card after the reply sentence that carries it. One card a reply; none once the model has written a
 * sentence card of its own earlier in the reply.
 */
export class LearnerCardWatch {
  private cur = '';
  private done = false;
  /** The cards written, with the reply sentence each follows (for the stored reply). */
  readonly written: Array<{ after: string; raw: string }> = [];
  constructor(private readonly learnerSaid: string, private readonly onBoard: (sentence: string) => boolean) {}

  /** Whether a block is one of the runtime's own cards (never spoken: its quote was). */
  isOwn(raw: string): boolean { return this.written.some((w) => w.raw === raw); }

  feed(parts: InlinePart[]): InlinePart[] {
    const out: InlinePart[] = [];
    for (const part of parts) {
      if ('block' in part) { if (part.block.kind === 'sentence') this.done = true; out.push(part); continue; }
      if (!('text' in part) || this.done) { if ('text' in part) this.cur = ''; out.push(part); continue; }
      let text = part.text;
      this.cur += text;
      SENTENCE_END.lastIndex = 0;
      let m: RegExpExecArray | null;
      let consumed = 0;
      while (!this.done && (m = SENTENCE_END.exec(this.cur))) {
        const end = m.index + m[0].length;
        const block = this.cardAfter(this.cur.slice(consumed, end));
        consumed = end;
        if (!block) continue;
        const at = Math.max(0, end - (this.cur.length - text.length));
        if (at > 0) out.push({ text: text.slice(0, at) });
        out.push({ block });
        text = text.slice(at);
        this.cur = this.cur.slice(end);
        consumed = 0;
        SENTENCE_END.lastIndex = 0;
      }
      if (consumed) this.cur = this.cur.slice(consumed);
      if (text) out.push({ text });
    }
    return out;
  }

  /** The reply's words have ended (this model call): the last sentence, with no white space after it, is read too. */
  end(): InlinePart[] {
    const last = this.cur; this.cur = '';
    if (this.done || !last.trim()) return [];
    const block = this.cardAfter(last);
    return block ? [{ block }] : [];
  }

  private cardAfter(sentence: string): InlineBlock | null {
    if (this.done) return null;
    const card = v2LearnerCardIn(sentence, this.learnerSaid);
    if (!card || this.onBoard(card.sentence)) return null;
    this.done = true;
    const body = card.sentence.replace(/[<>]/g, '');
    const raw = `<board sentence${card.stress.length ? ` stress="${card.stress.join(' | ')}"` : ''}>${body}</board>`;
    this.written.push({ after: sentence.trim(), raw });
    return { kind: 'sentence', attrs: card.stress.length ? { stress: card.stress.join(' | ') } : {}, body, raw };
  }
}

/** The facts line: their words just now were a sentence of theirs (the rule's sessions only, not after the summary began). */
export function v2LearnerSentenceFacts(session: V2Session, state: V2State, heard: string | null | undefined, enabled: boolean = TUTOR_V2_BOARD_LEARNER_SENTENCE): string[] {
  if (!v2LearnerCardsOn(session, state, heard, enabled)) return [];
  const s = v2LearnerSentence(heard);
  if (!s || v2SentenceOnBoard(state.board, s, state.correctedSentences ?? [])) return [];
  const support = languageNameOf(session.languages![1]!.toLowerCase().split(/[-_]/)[0]!);
  return [`their words just now were a sentence of theirs: if it answers the practice, put it on the board as one sentence card as it should be, where you answer it: as they said it (without fillers) when it is right; your corrected sentence, the changed words stressed, with a short ${support} gloss, when you correct it. Not a card of their mistake, and not when the sentence is up already`];
}
