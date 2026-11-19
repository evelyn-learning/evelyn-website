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
 *         learner's last words in any way (an article, a preposition or a plural added counts: fix round 2 ruling), in a
 *         reply that has not called their sentence right first (then a quote is the tutor's next model sentence). Stress:
 *         the words not in theirs.
 *     (b) their words as said, framed by a verdict on the whole sentence: right before the quote ("That's right:",
 *         "Correct:"; not "Yes,", "Good:", "Great,") with nothing after it in the sentence, or right after it (""…" is a
 *         clear sentence"). No stress. Dropped when the reply's next sentence holds back or corrects ("Almost there: we need
 *         have worked."; fix round 2, N1).
 *     The card is written after the quote's sentence (an as-said card after the next one) and waits for the next thing in
 *     the reply (the spoken words never wait): a sentence card of the model's for the same sentence right there wins, and
 *     the runtime's is dropped. It is never spoken: its quote was. No gloss (the runtime has none).
 *   - a facts line when their words answered an ask for a sentence, for everything the runtime leaves: a sentence right
 *     first time praised without quoting it ("That's right." may not cover the whole sentence), an ask to say it again.
 * The runtime abstains (a missing card is better than a false one): no quote; a quote of under four words, not starting
 * with a capital, with a gap or "…" in it; a quote after "you said", "not", "instead of" or followed by "is wrong"; a
 * lead-in that only asks them to try or say it ("Now try "…"", "say it with "since": "…""); a quote under half of whose
 * words are theirs; a quote after the reply called their sentence right; quote marks that do not pair ("…」); their words
 * quoted without a whole-sentence verdict framing them, or followed by a sentence that holds back or corrects, praised for how they sounded ("Your pronunciation of "…" was
 * good"), praised in part ("you used the past correctly in "…""), with the praise held back ("almost", "but") or corrected
 * in the same sentence ("Exactly, "…" uses work; we need have worked"); a sentence card of the model's earlier in the reply,
 * or of the same sentence right after the quote; a sentence already on the board as a card, or on the page in view, or
 * among their corrected sentences; the level check running; one card already written in the reply; no words from them.
 *
 * Spoken lessons taught in two languages only (the sentence cards' gate, sentence-cards.ts v2SentenceCardsOn, in a voice
 * session): maths and science, one-language lessons, typed lessons, homework and a discussion are unchanged.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { TUTOR_V2_ANSWER_SIGNAL, TUTOR_V2_BOARD_LEARNER_SENTENCE, TUTOR_V2_CARD_EVERY_SENTENCE, TUTOR_V2_CORRECTION_CARD_NOW, TUTOR_V2_PRACTISED_SENTENCE } from '../orchestrator/flags';
import { languageNameOf } from '../voice/language-request';
import { stripBoardBlocks, type InlineBlock, type InlinePart } from './board-inline';
import { v2IsPracticeAsk } from './languages';
import { v2IsPartAsk, v2PartInHand, v2PartViewed, v2PlanLabelled } from './part-flow';
import { v2PartOf } from './plan-map';
import { v2ReplyInvites } from './close-invite';
import { v2IsCorrectionOf, v2SentenceCardsOn, v2SentenceTokens as tokens } from './sentence-cards';
import type { V2Board, V2Session, V2State } from './types';
import { v2LevelCheckOn, v2LevelCheckOver } from './working-level';
import { v2ScoredTurn } from './pronunciation';

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
  // Task 7s fix round 1 (I3): not on a turn whose words answer an armed pronunciation recording (pronunciation.ts v2ScoredTurn).
  return enabled && session.mode === 'voice' && v2SentenceCardsOn(session) && !state.closed && !levelCheckRunning(session, state, heard) && !v2ScoredTurn(session, state, heard);
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
/** A verdict on the whole sentence right before the quote ("That's right:", "Correct:"). Not an acknowledgement ("Yes,",
 *  "Good:", "Great,", a bare "Exactly,"): "Good: "<their wrong sentence>." Now one change." boarded the mistake (fix round 2,
 *  N1). */
const VERDICT_BEFORE = /(?:\b(?:that's|that is|it's|it is) (?:(?:exactly |perfectly |completely )?(?:right|correct)|perfect)|\b(?:correct|perfect|well done|nicely said|exactly right))\s*[:,!.—–-]?\s*$/i;
/** The sentence after an as-said card's quote holds the praise back or corrects it ("Almost there: we need have worked.",
 *  "Let's fix one thing."): the card is dropped (fix round 2, N1). */
const GOES_ON_TO_CORRECT = /\b(?:almost|nearly|but|however|except|not quite|instead|one (?:small )?(?:thing|change)|small change|fix|change|correct(?:ion|ed)?|mistake|error|wrong|missing|we (?:would |'d )?(?:say|use|need|add)|you (?:need|should)|should be|more natural|better to)\b|直し|訂正/i;
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


/** The card a finished reply sentence carries for the learner's words, or null (see the header for when it abstains).
 *  `afterRight`: an earlier sentence of the reply called their sentence right. */
export function v2LearnerCardIn(sentence: string, learnerSaid: string | null | undefined, opts: { afterRight?: boolean } = {}): V2LearnerCard | null {
  const learner = v2LearnerSentence(learnerSaid);
  if (!learner) return null;
  const theirs = v2SentenceWords(learner);
  let from = 0;
  // Like quote marks with like (fix round 2, N2): "…」 is no quote.
  for (const m of sentence.matchAll(/"([^"]+)"|“([^”]+)”|「([^」]+)」/g)) {
    const q = (m[1] ?? m[2] ?? m[3]!).replace(/\s+/g, ' ').trim().replace(/[,;:]$/, '');
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
    // A correction: an explicit correction lead-in and any change to their words (shared helper, sentence-cards.ts), an
    // article, a preposition or a plural added among them (fix round 2, the controller's ruling: "I went to the Robotics
    // Expo…" for "I went to Robotics Expo…"); never a quote after the reply called their sentence right (the tutor's next
    // model sentence, extended or not: review I3).
    if (opts.afterRight || (!CORRECTS_BEFORE.test(before) && !CORRECTS_AFTER_JA.test(after))) continue;
    if (!v2IsCorrectionOf(qt.join(' '), theirs.join(' '))) continue;
    const have = new Set(theirs);
    // A number in words is one word ("twenty-five", "twenty five"), compared as its digits (fix round 2, N3).
    const words = q.replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[\s-](one|two|three|four|five|six|seven|eight|nine)\b/gi, '$1-$2').match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];
    const stress = [...new Set(words.filter((w) => !v2SentenceWords(w).every((x) => have.has(x))))].slice(0, MAX_STRESS);
    return { sentence: card, stress, kind: 'correction' };
  }
  return null;
}

const SENTENCE_END = /[.!?]+["'”’)]*(?=\s)|[。！？]+[」』"”]*/g;

/**
 * Watches one reply's streamed parts (turn.ts, between the inline stream and the turn's handling of words and blocks) and
 * writes the runtime card after the reply sentence that carries it. One card a reply; none once the model has written a
 * sentence card of its own earlier in the reply. The card waits for the next thing in the reply, white space aside: a
 * sentence card of the model's for the same sentence there wins (review I2). A card of their words as said waits further,
 * to the end of the next sentence, and is dropped when that sentence holds the praise back or corrects it (fix round 2,
 * N1). The words are never held: only the card waits.
 */
export class LearnerCardWatch {
  private cur = '';
  private done = false;
  private afterRight = false;
  /** The decided card, waiting for the next thing in the reply. `check`: an as-said card, which also waits for the end of
   *  the next sentence and is dropped when that sentence holds the praise back or corrects (fix round 2, N1); after that it
   *  waits as a correction card does, so a card of the model's for the same sentence there still wins. `quote`: the quote's
   *  own sentence, which the stored reply puts the card after (fix round 3, N5: stored after the next sentence, the card
   *  stood after the ask in the history the model reads, the shape Task 6e forbids). */
  private pending: { block: InlineBlock; quote: string; check: boolean } | null = null;
  /** The cards written, with the reply sentence each follows (for the stored reply). */
  readonly written: Array<{ after: string; raw: string }> = [];
  constructor(private readonly learnerSaid: string, private readonly onBoard: (sentence: string) => boolean) {}

  /** Whether a block is one of the runtime's own cards (never spoken: its quote was). */
  isOwn(raw: string): boolean { return this.written.some((w) => w.raw === raw); }

  private release(out: InlinePart[]): void {
    if (!this.pending) return;
    this.written.push({ after: this.pending.quote, raw: this.pending.block.raw });
    out.push({ block: this.pending.block });
    this.pending = null;
  }

  /** An as-said card's next sentence (or what there is of it): dropped when it goes on to correct; else it waits for the
   *  next thing, as a correction card does. */
  private settleChecked(next: string): void {
    if (GOES_ON_TO_CORRECT.test(next)) this.pending = null; else this.pending!.check = false;
  }

  /** Text after a waiting card. The words always go out at once; only the card waits. A correction card goes before the
   *  first words (white space passes); an as-said card goes after the next sentence's end, or is dropped there. */
  private textAfterPending(text: string, out: InlinePart[]): void {
    const p = this.pending!;
    if (!p.check) {
      const ws = text.match(/^\s*/)![0];
      if (ws.length === text.length) { out.push({ text }); return; }
      if (ws) out.push({ text: ws });
      this.release(out);
      out.push({ text: text.slice(ws.length) });
      return;
    }
    const before = this.cur.length;
    this.cur += text;
    SENTENCE_END.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = SENTENCE_END.exec(this.cur))) {
      const end = m.index + m[0].length;
      if (!this.cur.slice(0, end).trim()) continue;
      const at = Math.max(0, end - before);
      if (at > 0) out.push({ text: text.slice(0, at) });
      this.settleChecked(this.cur.slice(0, end));
      this.cur = '';
      const rest = text.slice(at);
      if (rest) { if (this.pending) this.textAfterPending(rest, out); else out.push({ text: rest }); }
      return;
    }
    out.push({ text });
  }

  feed(parts: InlinePart[]): InlinePart[] {
    const out: InlinePart[] = [];
    for (const part of parts) {
      if ('opening' in part) { out.push(part); continue; }
      if ('block' in part) {
        // The model's own card of the same sentence right after the quote: the model's card wins (it has the gloss).
        if (this.pending && part.block.kind === 'sentence' && key(part.block.body) === key(this.pending.block.body)) this.pending = null;
        else { if (this.pending?.check) this.settleChecked(this.cur); this.release(out); }
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
    if (this.pending) { if (this.pending.check) this.settleChecked(this.cur); this.release(out); this.cur = ''; return out; }
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
    this.pending = { block: { kind: 'sentence', attrs: card.stress.length ? { stress: card.stress.join(' | ') } : {}, body, raw }, quote: sentence.trim(), check: card.kind === 'as-said' };
    return true;
  }
}

/** The tutor's last reply asked them for a sentence: an ask to say or try one, a request for one ("Tell me in one
 *  sentence", "start with …"), or a question about them (fix round 1, M3: not every answer of four words or more). */
const SENTENCE_REQUEST = /\b(?:tell me|answer with|in (?:one|a|two|full|a full|one or two) (?:or two )?sentences?|start(?:ing)? with|begin(?:ning)? with|make a sentence|describe)\b|文で|言ってみて/i;
const QUESTION_ABOUT_THEM = /^(?:what|how|where|when|why|which|who|have you|has your|did you|do you|are you|were you|can you|could you|would you)\b[^?]*\?["'”’]*$/i;
/** Task 7s (PRACTISED_SENTENCE, `wide`): an ask to answer in given words or to say one after the tutor, in Japanese: 「"Did you
 *  enjoy..." で答えてみてください。」, 「考えて答えてみてください。」, 「私の後に繰り返してください。」 (mic test 5, embed-1795050656326: the
 *  asks before n2 and n5 were read as no ask for a sentence). */
const SENTENCE_REQUEST_JA = /で答えて|答えてみて|繰り返して/;
/** Task 7s fix round 1 (I1): the last reply asked them to PRODUCE a question, or to say / repeat a given sentence (a quoted model
 *  with an instruction to say it or answer with it), not any question about them: "What is one project you are proud of?" then
 *  "What about you? What project are you proud of?" is a question back, answered from the persona card as before. Structural:
 *  what the reply asked for. */
// Fix round 3 (m1): "Could you ask me…", "you can ask me…", "Ask me if I have…" are asks again.
// Fix round 2 (N2): "Feel free to ask me anything", "Don't just repeat my words" and 「よく聞いてみてください」 (listen) ask for nothing to
// be produced; 「質問をしてみてください」, 「質問を作りましょう」, 「…を使って質問して」, "Try asking me…", "Make two questions…" do.
const MAKE_QUESTION = /\b(?:(?<!free to )ask me(?! anything| if you\b)|make (?:a|your own|one|two|three|some|a few) questions?|ask (?:a|the|your own|one) question|form a question|turn (?:it|this|that) into a question|try asking)\b|質問を?作って|質問を?作りましょう|質問を?して(?:みて)?ください|質問してみて|尋ねてみて/i;
const SAY_GIVEN = /と言って|言ってみて|繰り返して|(?<!(?:n['’]t|not|just) )(?<!(?:n['’]t|not) just )\brepeat\b|\bsay after me\b|\bsay (?:it|this|that|the sentence)\b/i;
/** A quoted model in question form ("Did you enjoy...", 「Has the project…」) that the instruction is about: the quote right before
 *  で答えて / で始めて / を使って, or right after "answer / start with". A statement starter given for an answer is no ask to produce a
 *  question, and a quoted question merely discussed next to one ("The question "Have you ever…" is answered with "Yes, I have".
 *  Start with "Yes, I have…".", fix round 2 N2) is none either. */
const QWORD = String.raw`(?:what|how|where|when|why|which|who|did|do|does|have|has|is|are|was|were|can|could|would|will)\b`;
const QUOTED_QUESTION_ASK = new RegExp(String.raw`[「"“]\s*${QWORD}[^」"”]*[」"”]\s*(?:で答え|で始め|を使って|から始め)|\b(?:answer|start|begin)(?:ing)? with:?\s*[「"“]\s*${QWORD}`, 'i');
export function v2AskedToProduce(history: Anthropic.MessageParam[]): boolean {
  const last = [...history].reverse().find((h) => h.role === 'assistant');
  if (!last) return false;
  const text = stripBoardBlocks(typeof last.content === 'string' ? last.content : last.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '));
  const sentences = text.split(/(?<=[.!?。！？]["'”’」)]*)\s+|(?<=[。！？])/).map((x) => x.trim()).filter(Boolean);
  const end = sentences[sentences.length - 1] ?? '';
  if (end && (v2IsPartAsk(end) || v2ReplyInvites(end))) return false;
  // A quote ending in "..." is cut from the instruction after it (「"Did you enjoy..." で答えてみてください。」): read in pairs.
  const tail = sentences.slice(-3);
  const pairs = tail.map((x, i) => (i + 1 < tail.length ? `${x} ${tail[i + 1]}` : x));
  return tail.some((x) => MAKE_QUESTION.test(x) || SAY_GIVEN.test(x)) || pairs.some((x) => QUOTED_QUESTION_ASK.test(x));
}
/** Task 7s: exported for the practised-sentence facts (practice-facts.ts): the same structural test. */
export function v2AskedForSentence(history: Anthropic.MessageParam[], wide: boolean = TUTOR_V2_PRACTISED_SENTENCE): boolean { return askedForSentence(history, wide); }
function askedForSentence(history: Anthropic.MessageParam[], wide: boolean = TUTOR_V2_PRACTISED_SENTENCE): boolean {
  const last = [...history].reverse().find((h) => h.role === 'assistant');
  if (!last) return false;
  const text = stripBoardBlocks(typeof last.content === 'string' ? last.content : last.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '));
  const sentences = text.split(/(?<=[.!?。！？]["'”’」)]*)\s+/).map((x) => x.trim()).filter(Boolean);
  // Final review M1: a reply that ends on a part ask or the close's invitation asked whether to go on or for their questions,
  // not for a sentence ("Yes, let's go on to the present perfect." got the card line).
  const end = sentences[sentences.length - 1] ?? '';
  if (end && (v2IsPartAsk(end) || v2ReplyInvites(end))) return false;
  return sentences.some((x) => v2IsPracticeAsk(x) || SENTENCE_REQUEST.test(x) || (wide && SENTENCE_REQUEST_JA.test(x))) || QUESTION_ABOUT_THEM.test(sentences[sentences.length - 1] ?? '');
}

/** Task 7v (ANSWER_SIGNAL): an ask to fill a gap ("Next, fill the gap in this sentence and say the whole sentence aloud.") and a question
 *  card with a gap in the reply ask for a sentence too; so does the ask of a reply they spoke over (its sentences cut from the record
 *  and kept in state.unheard). Mic test 6 (embed-1795067373124): turns 35 and 44 answered a gap ask, turn 30 an ask cut from the
 *  record by his barge-in, and none gave a practice signal or an owed card. */
const GAP_ASK = /\bfill (?:in )?(?:the|this|each|a|that) (?:gap|blank)s?\b|空欄/i;
const GAP_CARD = /<board\s+problem\b[^>]*>[^<]*_{2,}/i;
const textOf = (m: Anthropic.MessageParam) => (typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '));
function askedForAnswer(state: Pick<V2State, 'history' | 'unheard'>, wide: boolean = TUTOR_V2_PRACTISED_SENTENCE, signal: boolean = TUTOR_V2_ANSWER_SIGNAL): boolean {
  if (askedForSentence(state.history, wide)) return true;
  if (!signal) return false;
  const last = [...state.history].reverse().find((h) => h.role === 'assistant');
  if (!last) return false;
  const raw = textOf(last);
  const heardPart = stripBoardBlocks(raw).replace(/\[cut off[^\]]*\]/gi, ' ');
  const sentences = [...heardPart.split(/(?<=[.!?。！？]["'”’」)]*)\s+/), ...(state.unheard ?? [])].map((x) => x.trim()).filter(Boolean);
  const end = sentences[sentences.length - 1] ?? '';
  if (end && (v2IsPartAsk(end) || v2ReplyInvites(end))) return false;
  const gapCard = GAP_CARD.test(raw) || (Array.isArray(last.content) && last.content.some((c) => c.type === 'tool_use' && c.name === 'show_problem' && /_{2,}/.test(JSON.stringify(c.input ?? ''))));
  return gapCard || sentences.some((x) => GAP_ASK.test(x)) || (state.unheard ?? []).some((x) => v2IsPracticeAsk(x) || SENTENCE_REQUEST.test(x) || (wide && SENTENCE_REQUEST_JA.test(x)));
}

/** Task 7g (CARD_EVERY_SENTENCE), fix round 1 (I1): a sentence that is no practice sentence of theirs is one whose WHOLE shape
 *  is a request to the tutor about the lesson itself: move on, one more, say it again, slower, "I didn't catch that", "I have a
 *  question" (fillers, a yes or a no, a sorry and a "please" around it). Anything with content beyond the ask is theirs ("I want
 *  to go to Canada next year.", "I'd like to try a new job in marketing.", "My customers don't understand Japanese very well.",
 *  "Sorry I was late, I work in sales."): when in doubt it is listed. Bare yeses and questions are left out by v2LearnerSentence. */
const LEAD = String.raw`^(?:(?:uh|um|er|ok(?:ay)?|so|well|and|yes|yeah|no|sorry|oh)[,.!]?\s+)*(?:please\s+)?`;
const TAIL = String.raw`(?:\s+(?:now|then|again|today))?(?:,?\s*(?:please|thank you|thanks))?[.!]*$`;
const LESSON_ASK = new RegExp([
  String.raw`(?:let'?s|let us|can we|could we|shall we|may we|i(?:'d| would) like to|i want to)\s+(?:please\s+)?(?:(?:(?:move|go|carry) on|continue)(?: (?:to|with) the next (?:part|topic|section|one|question|exercise|sentence))?|skip(?: (?:this|it|that|ahead|this part))?|stop(?: here)?|finish(?: here)?|do (?:another|one more|it again|that again|some more|more)(?: (?:one|sentence|exercise|question|practice))?|try (?:again|it again|that again|another(?: one| sentence)?|one more(?: time)?)|go to the next (?:part|topic|one|question|section)|practi[cs]e (?:more|again|some more|a (?:bit|little) more)|take a break)`,
  String.raw`(?:i(?:'d| would) like|i want|give me|can i (?:have|do|try)|could i (?:have|do|try))\s+(?:another|one more|more)(?: (?:practice|exercise|sentence|question|try|one))?`,
  String.raw`(?:one more(?: (?:time|try|one|sentence|exercise|round))?|(?:the )?next (?:part|one|question|topic)|(?:(?:move|go|carry) on|continue)(?: (?:to|with) the next (?:part|topic|section|one|question|exercise))?|again|more slowly|slower)`,
  String.raw`(?:(?:can|could|would) you\s+)?(?:say (?:that|it) again(?: (?:more )?slowly)?|repeat(?: (?:that|it|the question|the sentence|please))?|(?:speak|talk|say (?:that|it)) (?:more )?slowly|speak slower|slow down)`,
  String.raw`i (?:didn'?t|did not|don'?t|do not|can'?t|cannot|couldn'?t) (?:understand|get|catch|hear|follow)(?: (?:that|it|you|this|the question|what you said|very well|well))?`,
  String.raw`i have (?:a|one|another) question(?: (?:for you|about (?:that|this|it)))?`,
].map((x) => `${LEAD}${x}${TAIL}`).join('|'), 'i');
const SPLIT = /(?<=[.!?。！？]["'”’」)]*)\s+/;

/** Task 7g: each sentence of the learner's answer as a sentence of theirs (v2LearnerSentence: fillers out, four words or more,
 *  not a question), in order, once each; requests, questions to the tutor and "I didn't catch that" left out. */
export function v2LearnerSentences(said: string | null | undefined): string[] {
  const out: string[] = []; const seen = new Set<string>();
  for (const raw of (said ?? '').replace(/\s+/g, ' ').trim().split(SPLIT)) {
    const piece = raw.trim();
    if (!piece || piece.startsWith('[') || LESSON_ASK.test(piece)) continue;
    const s = v2LearnerSentence(piece);
    if (!s || seen.has(key(s))) continue;
    seen.add(key(s)); out.push(s);
  }
  return out;
}

/** Task 7g (CARD_EVERY_SENTENCE): the sentences of their answer just now that are owed a card: the 7b rule's sessions (spoken,
 *  two languages, not closed, not during the level check), an answer to an ask for a sentence, not during the overview (the
 *  plan's first part, an opening hook) or the level check, not once their questions before the close were invited, and not a
 *  sentence already up. Empty when the switch is off. */
/** Task 7k (PRACTICE_ON_PART_PAGE): on another part's page (v2PartViewed: practice they asked for), the part is that page's,
 *  and an invitation given before does not stop the cards: the practice is carded on its page. */
export function v2PracticeAnswerSentences(session: V2Session, state: V2State, heard: string | null | undefined, enabled: boolean = TUTOR_V2_CARD_EVERY_SENTENCE): string[] {
  const plan = session.plan;
  const viewed = v2PlanLabelled(plan) ? v2PartViewed(plan, state) : -1;
  if (!enabled || !v2LearnerCardsOn(session, state, heard) || (typeof state.closeInvitedAt === 'number' && viewed < 0) || !askedForAnswer(state)) return [];
  if (v2PlanLabelled(plan)) {
    const seg = plan.segments[viewed >= 0 ? viewed : v2PartInHand(plan, state)];
    if (!seg || seg.kind === 'hook' || v2PartOf(seg).skipWhenLevelKnown) return [];
  }
  return v2LearnerSentences(heard).filter((x) => !v2SentenceCarded(state.board, x, state.correctedSentences ?? []));
}

/** Task 7g fix round 1 (I2, the controller's ruling): a sentence of theirs is up already only as a sentence card (any page) or
 *  among their corrected sentences; the same words in a note or an example on the page do not card it ("I work with
 *  international clients." stood in the "Your job" page's example note and was left off, flag 3). */
export function v2SentenceCarded(board: V2Board, sentence: string, corrected: readonly string[] = []): boolean {
  const k = key(sentence);
  if (!k) return true;
  if (corrected.some((c) => key(c) === k)) return true;
  return board.pages.some((pg) => pg.items.some((it) => it.tool === 'show_sentence' && key(it.summary) === k));
}

/** Whether a card's sentence is this sentence of theirs, as said or corrected: most of the card's words are in it and most of
 *  its words are on the card (numbers in words and digits alike). */
export function v2CardIsOf(card: string, sentence: string): boolean {
  const c = v2SentenceWords(card); const t = v2SentenceWords(sentence);
  if (!c.length || !t.length) return false;
  const inT = new Set(t); const inC = new Set(c);
  return c.filter((w) => inT.has(w)).length / c.length >= 0.5 && t.filter((w) => inC.has(w)).length / t.length >= 0.5;
}

/** Card words beyond the learner's that a card of their sentence may add (the corrected words: "at", "a", "the"). */
const COVER_EXTRA_MAX = 3;
/** Task 7m (CORRECTION_CARD_NOW): a sentence card on the board already holds this sentence of theirs, corrected: every word they
 *  said is on it (a plural or "-es" form counts) and it adds at most COVER_EXTRA_MAX words. Their sentence of how long they had
 *  worked at their company, said without "at" and with "year", was owed again although its corrected card stood on page 3, and
 *  was carded twice (embed-1795028886172, 9.94); a new practice sentence naming another company is not held by it. */
export function v2BoardCardHolds(board: V2Board, sentence: string): boolean {
  const said = v2SentenceWords(sentence);
  if (said.length < 3) return false;
  const same = (w: string, c: string) => c === w || c === `${w}s` || c === `${w}es` || w === `${c}s` || w === `${c}es`;
  return board.pages.some((pg) => pg.items.some((it) => {
    if (it.tool !== 'show_sentence') return false;
    const left = v2SentenceWords(it.summary);
    for (const w of said) { const at = left.findIndex((c) => same(w, c)); if (at < 0) return false; left.splice(at, 1); }
    return left.length <= COVER_EXTRA_MAX;
  }));
}

/** Task 7g: the sentences of theirs that no card of the reply is of (each card counts for one sentence, the closest first), and
 *  that are not up already. Task 7m (CORRECTION_CARD_NOW): nor held, corrected, by a card on the board (v2BoardCardHolds). */
export function v2SentencesNotCarded(sentences: readonly string[], cards: readonly string[], board: V2Board, corrected: readonly string[] = [], held: boolean = TUTOR_V2_CORRECTION_CARD_NOW): string[] {
  const left = [...cards];
  return sentences.filter((s) => {
    const at = left.findIndex((c) => v2CardIsOf(c, s));
    if (at >= 0) { left.splice(at, 1); return false; }
    return !v2SentenceCarded(board, s, corrected) && !(held && v2BoardCardHolds(board, s));
  });
}

/** Task 7m (CORRECTION_CARD_NOW, mic test 4 flag 6): the board check's line when the reply left sentences of their answer with no
 *  card ("「sell」の過去形は「sold」です…" and nothing written: the card came a reply later). */
export function v2OwedCardCheckLine(session: V2Session, owed: readonly string[]): string {
  if (!owed.length) return '';
  const support = session.languages?.[1] ? languageNameOf(session.languages[1].toLowerCase().split(/[-_]/)[0]!) : 'their own language';
  const one = owed.length === 1;
  return `Your reply answered ${one ? 'this sentence' : 'these sentences'} of theirs and put no card of ${one ? 'it' : 'them'} on the board: ${owed.map((x) => JSON.stringify(x)).join('; ')}. Write ${one ? 'it' : 'each'} now as one sentence card, <board sentence stress="the changed words" gloss="a short ${support} note of the point" with="the opening words of the sentence in which you correct it">the sentence</board>: your corrected sentence when the reply says it or it follows plainly from your correction, the changed words stressed; when it does not, their own sentence as they said it (without fillers) with the wrong word stressed and the right form in the gloss. A whole sentence only, never a starter ending in "…", and none already on the board.`;
}

/** A reply that says it did not catch their words, or asks them to say it again: what it heard is not theirs to card. */
export const V2_REPLY_MISHEARD = /\b(?:didn'?t (?:quite )?(?:catch|hear|get)|did not (?:quite )?(?:catch|hear)|couldn'?t (?:hear|catch)|could you (?:say|repeat) (?:that|it)|say (?:that|it) again|repeat (?:that|it))\b|聞き取れ|もう一度言って/i;

/** Task 7g: the facts line for the sentences of their last answer the last reply left off the board (once; those up since
 *  are dropped). */
export function v2CardsOwedFacts(state: V2State, enabled: boolean = TUTOR_V2_CARD_EVERY_SENTENCE): string[] {
  // Task 7m fix round 1 (M6): nor one a card on the board now holds corrected (an owed card kept across a silence turn).
  const owed = enabled ? (state.cardsOwed ?? []).filter((x) => !v2SentenceCarded(state.board, x, state.correctedSentences ?? []) && !(TUTOR_V2_CORRECTION_CARD_NOW && v2BoardCardHolds(state.board, x))) : [];
  if (!owed.length) return [];
  return [`not carded in your last reply: ${owed.length === 1 ? 'this sentence' : 'these sentences'} of their last answer (as heard): ${owed.map((x) => JSON.stringify(x)).join('; ')}. Put ${owed.length === 1 ? 'it' : 'each'} on the board in this reply, as it should be said, one sentence card each (the changed words stressed, a short gloss), where you mention it`];
}

/** The facts line: their words just now answered an ask for a sentence (the rule's sessions only, not after the summary began). */
export function v2LearnerSentenceFacts(session: V2Session, state: V2State, heard: string | null | undefined, enabled: boolean = TUTOR_V2_BOARD_LEARNER_SENTENCE): string[] {
  // Final review M1: not once their questions before the close were invited: the next reply answers and closes.
  // Task 7k (PRACTICE_ON_PART_PAGE): not while practice they asked for runs on another part's page.
  if (!v2LearnerCardsOn(session, state, heard, enabled) || (typeof state.closeInvitedAt === 'number' && !(v2PlanLabelled(session.plan) && v2PartViewed(session.plan, state) >= 0))) return [];
  const support = languageNameOf(session.languages![1]!.toLowerCase().split(/[-_]/)[0]!);
  // Task 7g (CARD_EVERY_SENTENCE, mic test 2 flag 3): every sentence of the answer, one card each, none left off.
  if (TUTOR_V2_CARD_EVERY_SENTENCE && enabled) {
    const all = v2PracticeAnswerSentences(session, state, heard);
    if (!all.length) return [];
    const n = all.length;
    return [`their answer just now had ${n === 1 ? '1 sentence' : `${n} sentences`} of their own: ${all.map((x, k) => `${k + 1}. ${JSON.stringify(x)}`).join(' ')}. Put ${n === 1 ? 'it' : 'every one of them'} on the board, one sentence card per sentence, as it should be said: as they said it (without fillers) when it is right; your corrected sentence, the changed words stressed, with a short ${support} gloss of the point, when you correct it. None left off, and no card for anything not in this list (none of their mistake, none for small talk)`];
  }
  const s = v2LearnerSentence(heard);
  if (!s || !askedForAnswer(state) || v2SentenceOnBoard(state.board, s, state.correctedSentences ?? [])) return [];
  return [`their words just now answered your ask with a sentence of theirs: put it on the board as one sentence card as it should be, where you answer it: as they said it (without fillers) when it is right; your corrected sentence, the changed words stressed, with a short ${support} gloss, when you correct it. One card in this reply at most; none of their mistake, none for small talk, none when the sentence is up already`];
}

/** Task 7s (FRAGMENT_CARD): words that never end a whole sentence card here: a preposition or an article. */
const OPEN_END = new Set(['of', 'to', 'for', 'with', 'at', 'in', 'on', 'from', 'about', 'by', 'into', 'as', 'a', 'an', 'the']);
const FILLER_WORDS = new Set(['uh', 'um', 'er', 'erm', 'ah', 'eh', 'hmm', 'mm']);
/** Task 7s (FRAGMENT_CARD, mic test 5, embed-1795050656326 at 13 min): a card that ends on a preposition or an article ("I am proud
 *  of.") that is the head of ONE sentence of the learner's turn, which goes on past that word ("I proud of uh donations project…"):
 *  not a sentence of its own. Fix round 1 (I2): read within each sentence of their turn, never across the turn; the card's words
 *  before that word stand in that sentence before it (at most one missing, two in a long card: the corrected words), so their whole
 *  question "What city do you live in?" after "I live in Nagoya." and the tutor's own "This is the team I work with." are cards. */
export function v2CardIsFragment(card: string, heard: string | null | undefined): boolean {
  const words = (t: string) => (t.toLowerCase().match(/[a-z]+(?:['’][a-z]+)?/g) ?? []).filter((w) => !FILLER_WORDS.has(w));
  const c = words(card);
  const last = c[c.length - 1]; const prev = c[c.length - 2];
  // Fix round 2 (N6): a question card ending on a preposition is a whole question ("Who did you go with?", "Where are you from?").
  if (!last || !OPEN_END.has(last) || !heard || /\?["'”’)]*\s*$/.test(card)) return false;
  const head = c.slice(0, -1); const allowed = head.length >= 6 ? 2 : 1;
  return heard.split(SPLIT).some((sentence) => {
    const h = words(sentence);
    return h.some((w, i) => {
      if (w !== last || i >= h.length - 1 || (prev && h[i - 1] !== prev)) return false;
      const before = new Set(h.slice(0, i));
      return head.filter((x) => !before.has(x)).length <= allowed;
    });
  });
}
