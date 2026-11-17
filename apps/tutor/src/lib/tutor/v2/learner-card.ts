/**
 * Tutor brain v2 — the learner's sentence on the board, as it should be (Task 7b, BOARD_LEARNER_SENTENCE).
 *
 * Mic test 1 (embed-1794882458629): the tutor corrected the learner twice and boarded neither correction ("we say "I have
 * worked at … for five years."" was only spoken), and "Last year I went to … in Beijing" was praised and not boarded. The
 * product owner's decision: every sentence the learner gets right goes on the board, with the corrections if needed.
 *
 * The session part already asks for a card for every sentence the tutor models or corrects (sentence-cards.ts); the model
 * skipped it in those replies (no show_sentence call in the session's debug events: nothing was dropped). Two parts:
 *   - a runtime card only where it cannot be false (fix round 1, the controller's ruling):
 *     (a) a correction: an explicit correction lead-in right before the quote ("we say", "the correct sentence is", "it
 *         should be", "a more natural way to say it is"; after it in Japanese: 「…」と言います), whose quote changes the
 *         learner's last words by a real edit (not their words with more added), in a reply that has not called their
 *         sentence right first (then a quote is the tutor's next model sentence). Stress: the words not in theirs.
 *     (b) their words as said, framed by a verdict on the whole sentence: right before the quote ("That's right:",
 *         "Exactly:") with nothing after it in the sentence, or right after it (""…" is a clear sentence"). No stress.
 *     The card is written after the quote's sentence and waits only for the next thing in the reply (the spoken words never
 *     wait): a sentence card of the model's for the same sentence right there wins, and the runtime's is dropped. It is
 *     never spoken: its quote was. No gloss (the runtime has none).
 *   - a facts line when their words answered an ask for a sentence, for everything the runtime leaves: a sentence right
 *     first time praised without quoting it ("That's right." may not cover the whole sentence), an ask to say it again.
 * The runtime abstains (a missing card is better than a false one): no quote; a quote of under four words, not starting
 * with a capital, with a gap or "…" in it; a quote after "you said", "not", "instead of" or followed by "is wrong"; a
 * lead-in that only asks them to try or say it ("Now try "…"", "say it with "since": "…""); a quote that keeps all their
 * words and adds others, or under half of whose words are theirs; a quote after the reply called their sentence right; their
 * words quoted without a whole-sentence verdict framing them, praised for how they sounded ("Your pronunciation of "…" was
 * good"), praised in part ("you used the past correctly in "…""), with the praise held back ("almost", "but") or corrected
 * in the same sentence ("Exactly, "…" uses work; we need have worked"); a sentence card of the model's earlier in the reply,
 * or of the same sentence right after the quote; a sentence already on the board as a card, or on the page in view, or
 * among their corrected sentences; the level check running; one card already written in the reply; no words from them.
 *
 * Spoken lessons taught in two languages only (the sentence cards' gate, sentence-cards.ts v2SentenceCardsOn, in a voice
 * session): maths and science, one-language lessons, typed lessons, homework and a discussion are unchanged.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { TUTOR_V2_BOARD_LEARNER_SENTENCE } from '../orchestrator/flags';
import { languageNameOf } from '../voice/language-request';
import { stripBoardBlocks, type InlineBlock, type InlinePart } from './board-inline';
import { v2IsPracticeAsk } from './languages';
import { v2IsCorrectionOf, v2SentenceCardsOn, v2SentenceTokens as tokens } from './sentence-cards';
import type { V2Board, V2Session, V2State } from './types';
import { v2LevelCheckOn, v2LevelCheckOver } from './working-level';

/** Numbers said or written alike ("5" and "five", "25" and "twenty-five"), so one sentence is one key (fix round 1, M5). */
const UNITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
/** A sentence's words with number words as digits. */
export function v2SentenceWords(text: string): string[] {
  const ws = tokens(text); const out: string[] = [];
  for (let i = 0; i < ws.length; i++) {
    const t = TENS.indexOf(ws[i]!); const u = UNITS.indexOf(ws[i]!);
    if (t >= 2) { const next = UNITS.indexOf(ws[i + 1] ?? ''); if (next >= 1 && next <= 9) { out.push(String(t * 10 + next)); i += 1; } else out.push(String(t * 10)); continue; }
    out.push(u >= 0 ? String(u) : ws[i]!);
  }
  return out;
}

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

const key = (s: string) => v2SentenceWords(s).join(' ');

/** The sentence is up already: a card of it on any page, or its words on the page in view (a note of examples), or among
 *  their corrected sentences (same-sentence de-dup, Task 4c). Numbers in words and digits count as one (M5). */
export function v2SentenceOnBoard(board: V2Board, sentence: string, corrected: readonly string[] = []): boolean {
  const k = key(sentence);
  if (!k) return true;
  if (corrected.some((c) => key(c) === k)) return true;
  if (board.pages.some((pg) => pg.items.some((it) => it.tool === 'show_sentence' && key(it.summary) === k))) return true;
  const page = board.pages[board.current];
  return !!page && page.items.some((it) => ` ${key(it.summary)} `.includes(` ${k} `));
}

/** An explicit correction lead-in right before the quote (fix round 1, the controller's ruling). Not "try", "say it", "say
 *  it with "…"", "you could say": those hand them the tutor's next model sentence as often as a correction (review I3). */
const CORRECTS_BEFORE = /(?:\bwe(?: would|'d)? (?:say|use)|\bthe (?:correct|right|natural|better) (?:sentence|form|version|way to say (?:it|that|this)) (?:is|would be)|\b(?:it|that|this|the sentence) should be|\b(?:a |the )?more natural (?:way|sentence)(?: to say (?:it|that|this))? (?:is|would be))\s*[:,]?\s*$/i;
/** The same, after the quote, in Japanese: 「…」と言います, 「…」が正しい文です. */
const CORRECTS_AFTER_JA = /^\s*(?:と言います|と言いましょう|と言うのが自然です|が正しい(?:文|言い方)?です|が自然(?:な言い方)?です|となります)/;
/** Words before the quote that make it their mistake, not the form to use. */
const MISTAKE_BEFORE = /\b(?:you said|you say|instead of|rather than|not|don't say|never say|isn't|wasn't|mistake|wrong)\b/i;
/** Words after the quote, in the same sentence, that take it back or go on to correct it. */
const TAKEN_BACK = /\b(?:is|was|sounds) (?:not|wrong|incorrect)\b|\b(?:isn't|wasn't|instead|but|however)\b|\b(?:we|you) (?:need|say|use|would say|should say)\b|\bshould be\b|\bchange\b/i;
/** A verdict on the whole sentence right before the quote ("That's right:", "Yes, exactly:"). */
const VERDICT_BEFORE = /(?:\b(?:that's|that is|it's|it is) (?:right|correct|perfect|exactly right)|\b(?:exactly|correct|perfect|well done|great|good|nicely said|yes))\s*[:,!.—–-]?\s*$/i;
/** A verdict on the quote right after it (""…" is a clear sentence"). */
const VERDICT_AFTER = /^\s*,?\s*(?:is|was)\s+(?:a\s+|an\s+)?(?:(?:very|really|perfectly|completely)\s+)?(?:(?:clear|good|correct|natural|great|nice|perfect|grammatical|right)\b(?:\s+(?:sentence|english))?|exactly right)/i;
/** The quote is the object of a phrase, not the subject of the verdict ("Your pronunciation of "…" was good"). */
const PREP_END = /\b(?:of|in|on|for|with|about|from|than|like|at)\s*$/i;
/** Praise for how it sounded, not what it said (review I1). */
const SOUND_TALK = /\b(?:pronunciation|pronounc\w*|sound(?:s|ed)?|accent|intonation|fluent(?:ly)?|said it|stress(?:ed)?)\b|発音/i;
/** Praise held back: "almost", "but". */
const HEDGED = /\b(?:almost|nearly|but|except|not quite|one (?:small )?(?:thing|change)|small change)\b/i;
/** A reply sentence that calls their sentence right ("That's right.", "Perfect."): a correction quote after it in the same
 *  reply is the tutor's next model sentence, not theirs corrected (review I3). */
const RIGHT_VERDICT = /^\s*(?:(?:yes|yeah)[,!.]?\s+)?(?:(?:that's|that is|it's|it is) (?:right|correct|perfect|exactly right)|perfect|exactly|correct|well done)\b/i;

export interface V2LearnerCard { sentence: string; stress: string[]; kind: 'correction' | 'as-said' }

/** `ws` keeps every word of `of` in order, with more besides: their sentence with words added (review I3). */
const extends_ = (ws: string[], of: string[]) => { let i = 0; for (const w of ws) if (w === of[i]) i += 1; return i === of.length && ws.length > of.length; };

/** The card a finished reply sentence carries for the learner's words, or null (see the header for when it abstains).
 *  `afterRight`: an earlier sentence of the reply called their sentence right. */
export function v2LearnerCardIn(sentence: string, learnerSaid: string | null | undefined, opts: { afterRight?: boolean } = {}): V2LearnerCard | null {
  const learner = v2LearnerSentence(learnerSaid);
  if (!learner) return null;
  const theirs = v2SentenceWords(learner);
  let from = 0;
  for (const m of sentence.matchAll(/["“「]([^"“”「」]+)["”」]/g)) {
    const q = m[1]!.replace(/\s+/g, ' ').trim().replace(/[,;:]$/, '');
    const qt = v2SentenceWords(q);
    // A quoted word or two ("collected") is part of the lead-in to the next quote.
    if (qt.length < MIN_WORDS || !/^[A-Z]/.test(q) || /…|\.\.\.|_|[<>]/.test(q) || q.length > MAX_CARD_CHARS) continue;
    // The words between the last quoted sentence (or clause) and this one: ""I goed …" is not right; we say "I went …""
    // gives the second.
    const before = sentence.slice(from, m.index).split(/[;—–]/).pop()!;
    from = m.index! + m[0].length;
    const after = sentence.slice(m.index! + m[0].length);
    if (MISTAKE_BEFORE.test(before) || TAKEN_BACK.test(after)) continue;
    const card = /[.!?]$/.test(q) ? q : `${q}.`;
    const echo = ` ${theirs.join(' ')} `.includes(` ${qt.join(' ')} `);
    if (echo) {
      // Their words as said: most of what they said, framed by a verdict on the whole sentence, about what it says.
      if (qt.length / theirs.length < 0.8 || SOUND_TALK.test(sentence) || HEDGED.test(sentence)) continue;
      const framedBefore = VERDICT_BEFORE.test(before) && /^\s*[.!。！]?\s*$/.test(after);
      const framedAfter = VERDICT_AFTER.test(after) && !PREP_END.test(before);
      if (!framedBefore && !framedAfter) continue;
      return { sentence: card, stress: [], kind: 'as-said' };
    }
    // A correction: an explicit correction lead-in, a real edit of their words (shared helper, sentence-cards.ts), and not
    // their words with more added, nor a quote after the reply called their sentence right (the tutor's next model).
    if (opts.afterRight || (!CORRECTS_BEFORE.test(before) && !CORRECTS_AFTER_JA.test(after))) continue;
    if (!v2IsCorrectionOf(qt.join(' '), theirs.join(' ')) || extends_(qt, theirs)) continue;
    const have = new Set(theirs);
    const stress = [...new Set((q.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? []).filter((w) => !have.has(v2SentenceWords(w)[0] ?? '')))].slice(0, MAX_STRESS);
    return { sentence: card, stress, kind: 'correction' };
  }
  return null;
}

const SENTENCE_END = /[.!?]+["'”’)]*(?=\s)|[。！？]+[」』"”]*/g;

/**
 * Watches one reply's streamed parts (turn.ts, between the inline stream and the turn's handling of words and blocks) and
 * writes the runtime card after the reply sentence that carries it. One card a reply; none once the model has written a
 * sentence card of its own earlier in the reply. The card waits for the next thing in the reply, white space aside: a
 * sentence card of the model's for the same sentence there wins (review I2). The words are never held: the card goes out
 * before the next words in the same part.
 */
export class LearnerCardWatch {
  private cur = '';
  private done = false;
  private afterRight = false;
  private pending: { block: InlineBlock; after: string } | null = null;
  /** The cards written, with the reply sentence each follows (for the stored reply). */
  readonly written: Array<{ after: string; raw: string }> = [];
  constructor(private readonly learnerSaid: string, private readonly onBoard: (sentence: string) => boolean) {}

  /** Whether a block is one of the runtime's own cards (never spoken: its quote was). */
  isOwn(raw: string): boolean { return this.written.some((w) => w.raw === raw); }

  private release(out: InlinePart[]): void {
    if (!this.pending) return;
    this.written.push({ after: this.pending.after, raw: this.pending.block.raw });
    out.push({ block: this.pending.block });
    this.pending = null;
  }

  /** Text after a waiting card: white space passes, the card goes before the first words. */
  private textAfterPending(text: string, out: InlinePart[]): void {
    const ws = text.match(/^\s*/)![0];
    if (ws.length === text.length) { out.push({ text }); return; }
    if (ws) out.push({ text: ws });
    this.release(out);
    out.push({ text: text.slice(ws.length) });
  }

  feed(parts: InlinePart[]): InlinePart[] {
    const out: InlinePart[] = [];
    for (const part of parts) {
      if ('opening' in part) { out.push(part); continue; }
      if ('block' in part) {
        // The model's own card of the same sentence right after the quote: the model's card wins (it has the gloss).
        if (this.pending && part.block.kind === 'sentence' && key(part.block.body) === key(this.pending.block.body)) this.pending = null;
        else this.release(out);
        if (part.block.kind === 'sentence') this.done = true;
        // Fix round 1 (M1): a sentence is read only within one run of words, so the one a card follows is in the stored text.
        this.cur = '';
        out.push(part); continue;
      }
      if (this.pending) { this.textAfterPending(part.text, out); continue; }
      if (this.done) { this.cur = ''; out.push(part); continue; }
      let text = part.text;
      this.cur += text;
      SENTENCE_END.lastIndex = 0;
      let m: RegExpExecArray | null;
      let consumed = 0;
      while (!this.done && (m = SENTENCE_END.exec(this.cur))) {
        const end = m.index + m[0].length;
        const sentence = this.cur.slice(consumed, end);
        consumed = end;
        if (!this.decide(sentence)) continue;
        const at = Math.max(0, end - (this.cur.length - text.length));
        if (at > 0) out.push({ text: text.slice(0, at) });
        text = text.slice(at);
        break;
      }
      if (this.pending) { this.cur = ''; if (text) this.textAfterPending(text, out); continue; }
      if (consumed) this.cur = this.cur.slice(consumed);
      if (text) out.push({ text });
    }
    return out;
  }

  /** The reply's words have ended (this model call): a waiting card goes out; the last sentence, with no white space after
   *  it, is read too. */
  end(): InlinePart[] {
    const out: InlinePart[] = [];
    if (this.pending) { this.release(out); this.cur = ''; return out; }
    const last = this.cur; this.cur = '';
    if (!this.done && last.trim() && this.decide(last)) this.release(out);
    return out;
  }

  /** Reads one finished sentence of the reply; true when it carries the runtime card (now waiting). */
  private decide(sentence: string): boolean {
    if (this.done) return false;
    const card = v2LearnerCardIn(sentence, this.learnerSaid, { afterRight: this.afterRight });
    if (RIGHT_VERDICT.test(sentence) && !HEDGED.test(sentence)) this.afterRight = true;
    if (!card || this.onBoard(card.sentence)) return false;
    this.done = true;
    const body = card.sentence.replace(/[<>]/g, '');
    const raw = `<board sentence${card.stress.length ? ` stress="${card.stress.join(' | ')}"` : ''}>${body}</board>`;
    this.pending = { block: { kind: 'sentence', attrs: card.stress.length ? { stress: card.stress.join(' | ') } : {}, body, raw }, after: sentence.trim() };
    return true;
  }
}

/** The tutor's last reply asked them for a sentence: an ask to say or try one, a request for one ("Tell me in one
 *  sentence", "start with …"), or a question about them (fix round 1, M3: not every answer of four words or more). */
const SENTENCE_REQUEST = /\b(?:tell me|answer with|in (?:one|a|two|full|a full|one or two) (?:or two )?sentences?|start(?:ing)? with|begin(?:ning)? with|make a sentence|describe)\b|文で|言ってみて/i;
const QUESTION_ABOUT_THEM = /^(?:what|how|where|when|why|which|who|have you|has your|did you|do you|are you|were you|can you|could you|would you)\b[^?]*\?["'”’]*$/i;
function askedForSentence(history: Anthropic.MessageParam[]): boolean {
  const last = [...history].reverse().find((h) => h.role === 'assistant');
  if (!last) return false;
  const text = stripBoardBlocks(typeof last.content === 'string' ? last.content : last.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '));
  const sentences = text.split(/(?<=[.!?。！？]["'”’」)]*)\s+/).map((x) => x.trim()).filter(Boolean);
  return sentences.some((x) => v2IsPracticeAsk(x) || SENTENCE_REQUEST.test(x)) || QUESTION_ABOUT_THEM.test(sentences[sentences.length - 1] ?? '');
}

/** The facts line: their words just now answered an ask for a sentence (the rule's sessions only, not after the summary began). */
export function v2LearnerSentenceFacts(session: V2Session, state: V2State, heard: string | null | undefined, enabled: boolean = TUTOR_V2_BOARD_LEARNER_SENTENCE): string[] {
  if (!v2LearnerCardsOn(session, state, heard, enabled)) return [];
  const s = v2LearnerSentence(heard);
  if (!s || !askedForSentence(state.history) || v2SentenceOnBoard(state.board, s, state.correctedSentences ?? [])) return [];
  const support = languageNameOf(session.languages![1]!.toLowerCase().split(/[-_]/)[0]!);
  return [`their words just now answered your ask with a sentence of theirs: put it on the board as one sentence card as it should be, where you answer it: as they said it (without fillers) when it is right; your corrected sentence, the changed words stressed, with a short ${support} gloss, when you correct it. One card in this reply at most; none of their mistake, none for small talk, none when the sentence is up already`];
}
