/**
 * Tutor brain v2 — the reply's words on their way out, a sentence at a time (Task 6e, fix round 1).
 *
 * The model's words were streamed to the student as they came, so nothing it wrote could be taken back. Three things in
 * the real-voice replays (v2audio-6e/RESULTS.md) needed a sentence held for a moment first:
 *  - the part-change frame ("Shall we go on, or do you have a question first?") the model wrote itself at part changes
 *    where the runtime had already asked it at the one before (C: five times in tester B's run): dropped (F1);
 *  - a sentence card spoken where it stands, which the model then said again in its next sentence (tester B T50): the
 *    card is said only when the next sentence does not say it (F5);
 *  - a goodbye: held until the reply is complete, so a close the runtime refuses leaves no goodbye behind it (gdi-real-james:
 *    "See you next time!Would you like to do something harder…?", F4), and a part not reached can be named before it
 *    (gdi-real-josh's stop goodbye, F3).
 *
 * The client cuts sentences again for speech (sentences.ts); this gate only decides which go out and when. It never
 * changes a sentence's words. Pure apart from its output callback.
 *
 * Task 6g (v2audio-6f): the frame in Japanese is a frame too (tester A heard 「次に進みますか、それとも先に質問がありますか？」
 * at a second change running); a goodbye with no farewell word ("Thank you for today's lesson, and well done!") is held
 * like one; and at the close a practice ask waits for the next sentence, so a reply that goes on into its summary or
 * goodbye does not also ask for a retry no one can give (tester B's last reply).
 */
import { TUTOR_V2_PART_OFFER_ONCE, TUTOR_V2_PASSED_PART_CLOSE } from '../orchestrator/flags';
import { v2HandsOver, v2IsCheckIn } from './one-question';

/** The part-change frame: asking whether to go on, alone or with the question check. Matched on a whole sentence. */
export const V2_PART_FRAME = /^(?:(?:so|okay|ok|now|then|great|good|alright|all right)[,!.]?\s+)*(?:shall we (?:go on|move on|continue|start)|are you ready (?:for (?:that|it|the next part|this)|to (?:go on|move on|start))|ready to (?:go on|move on))\b[^.?!]*\?["'”’]*$|^[^.?!]*\bor do you have (?:a|any) questions? (?:first|before we (?:go on|move on|start))\?["'”’]*$/i;
/** A goodbye: the words that end the lesson for the student. */
/** Fix round 2 (N1): farewells only. "take care", "have a nice weekend", "see you then" and "bye," are also lesson
 *  phrases and lesson talk ("Take care with the sign…"), and holding on them held the rest of a mid-lesson reply. */
export const V2_GOODBYE = /\b(?:see you (?:next time|soon|again)|goodbye|good-bye|bye for now)\b|お疲れ(?:様|さま)でした|またお会いしましょう|また次回お会い/i;
/** Task 6g (PASSED_PART_CLOSE): a lesson's closing thanks is a goodbye too. Tester B's and gdi-real-james's closes had no
 *  farewell word ("Thank you for today's lesson, and well done!"), so the goodbye was never held and the line naming
 *  the part not reached was never said before it (v2audio-6f finding 1). Only thanks for the lesson as a whole, never
 *  "thank you for trying" or a thanks for an answer. Fix round 1 (minor 4): the phrase must end there ("Thank you for
 *  your class project idea." is no goodbye). */
export const V2_GOODBYE_THANKS = /\bthanks?(?: you)?(?: (?:so|very) much)? for (?:today'?s (?:lesson|class|session)|the lesson today|(?:the |this )(?:lesson|class|session)(?: today)?|your time today|today)(?=\s*(?:[.!,]|$|and\b))|今日の(?:レッスン|授業)は(?:ここまで|これで終わり)|今日はここまで(?:です|にしましょう)/i;
/** Whether a sentence (its quoted spans already taken out) is a goodbye. `wide`: the closing thanks counts too. */
export function isGoodbye(sentence: string, wide: boolean = TUTOR_V2_PASSED_PART_CLOSE): boolean {
  return V2_GOODBYE.test(sentence) || (wide && V2_GOODBYE_THANKS.test(sentence));
}

/** Task 6g (PART_OFFER_ONCE): the frame in Japanese. Asking whether to go on (次に進みますか, 先に進んでもいいですか,
 *  次の部分に進みましょうか), or the question check that goes with it (過去形に進みますか、それとも先に質問がありますか,
 *  進む前に何か質問はありますか), in a sentence that ends as a question. "質問はありますか？" alone is a check-in, as "any questions so far?"
 *  is in English; "仕事は順調に進みますか？" asks about their work. */
// Fix round 1 (I1): only the frame's own shape. Any "…に行きますか／進みますか／移りますか" caught ordinary questions
// (「海外出張に行きますか？」, 「次の会議に行きますか？」, 「プロジェクトはスケジュール通りに進みますか？」), which were dropped,
// stripped from the history and counted as frames.
const JA_GO_ON_VERB = '(?:進(?:みますか|みましょうか|んで(?:も)?(?:いい|よい|よろしい|大丈夫)(?:です|でしょう)?か)|行きますか|行きましょうか|移りますか|移りましょうか)';
/** Fix round 2 (I1 residual), round 3 (W1): 次/先 starts a word: not after a kanji or katakana (取引先, 出張先, 目次, 行先,
 *  宛先) or in 行き先. Any hiragana may come before it: 「そろそろ次に進みましょうか？」, 「さあ次に…」, 「では次に…」. */
export const JA_WORD_START = '(?<![\\p{Script=Han}\\p{Script=Katakana}])(?<!行き|いき)';
/** A bare go-on: no object or destination ("次に進みますか", "先へ進みましょうか"). */
const JA_BARE_GO_ON = new RegExp(`${JA_WORD_START}(?:次|先|つぎ|さき)(?:に|へ)${JA_GO_ON_VERB}`, 'u');
/** Going on to the next part of the lesson ("次の部分に進んでもいいですか"). */
const JA_NEXT_PART = new RegExp(`${JA_WORD_START}次の(?:パート|部分|ところ|項目|テーマ|トピック|セクション|ステップ|練習|課題|内容)(?:に|へ)${JA_GO_ON_VERB}`, 'u');
/** Any go-on, only beside the question check ("過去形に進みますか、それとも先に質問がありますか"). */
const JA_ANY_GO_ON = new RegExp(`(?:に|へ)${JA_GO_ON_VERB}`);
const JA_OR_QUESTION = /それとも[^。！？?]*質問/;
/** The question check before moving on ("過去形に進む前に、何か質問はありますか"). */
const JA_QUESTION_BEFORE = /(?:進む|移る)前に[^。！？?]*質問/;
const JA_ASKS = /(?:[?？]|か[。．]?)["'」』）)]*\s*$/;
export const V2_PART_FRAME_JA = { test: (s: string) => JA_ASKS.test(s) && (JA_BARE_GO_ON.test(s) || JA_NEXT_PART.test(s) || JA_QUESTION_BEFORE.test(s) || (JA_ANY_GO_ON.test(s) && JA_OR_QUESTION.test(s))) };
/** Whether a whole sentence is a part-change frame. `ja`: the Japanese forms count too (the kill switch's old matcher
 *  is the English one only). */
export function isPartFrame(sentence: string, ja: boolean = TUTOR_V2_PART_OFFER_ONCE): boolean {
  return V2_PART_FRAME.test(sentence) || (ja && V2_PART_FRAME_JA.test(sentence));
}
/** Quoted words are a phrase being taught ("We say 'Goodbye!'"), not the tutor's own goodbye. */
const QUOTED_SPANS = /"[^"]*"|“[^”]*”|「[^」]*」|『[^』]*』|‘[^’]*’/g;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean).join(' ');

/** A card's sentences (it is English: cut after . ! ?). */
const splitSentences = (text: string) => text.split(/(?<=[.!?]["'”’)]*)\s+/).map((x) => x.trim()).filter(Boolean);

/** Where the first sentence in `buf` ends (index just past it and its trailing white space), or -1. */
function nextCut(buf: string): number {
  let jaQuote = 0;
  for (let i = 0; i < buf.length; i++) {
    const ch = buf[i]!;
    if (ch === '「' || ch === '『') jaQuote += 1;
    else if ((ch === '」' || ch === '』') && jaQuote > 0) jaQuote -= 1;
    if (ch === '\n' && buf[i + 1] === '\n') { let j = i; while (j < buf.length && /\s/.test(buf[j]!)) j++; return j < buf.length ? j : -1; }
    if (jaQuote > 0) continue;
    if (/[.!?]/.test(ch)) {
      let j = i + 1; while (j < buf.length && /["'”’)\]]/.test(buf[j]!)) j++;
      if (j < buf.length && /\s/.test(buf[j]!)) { while (j < buf.length && /\s/.test(buf[j]!)) j++; return j < buf.length ? j : -1; }
    } else if (/[。！？]/.test(ch)) {
      let j = i + 1; while (j < buf.length && /[」』)）"”]/.test(buf[j]!)) j++;
      if (j < buf.length) { while (j < buf.length && /\s/.test(buf[j]!)) j++; return j < buf.length ? j : -1; }
    }
  }
  return -1;
}

export interface ReplyGateOptions {
  /** Drop a part-change frame the model writes (F1: the frame is not due at this part change). */
  dropFrame: boolean;
  /** Task 7a (PART_ASK_EVERY): drop a part-change ask only when this says so (one said before word for word), where
   *  `dropFrame` would drop every frame. */
  dropFrameIf?: ((sentence: string) => boolean) | null;
  /** Hold a goodbye, and everything after it, until the reply is complete (F3, F4). */
  holdGoodbye: boolean;
  /** Task 6g (CLOSE_ONE_QUESTION): in a reply that may close the lesson, a practice ask ("Please say this sentence once
   *  more.") waits until the next sentence: it goes out before a sentence that goes on with the lesson, and is dropped
   *  when what follows begins the summary or says goodbye. Once the summary has begun in the reply, a later practice
   *  ask is dropped. The predicate says which sentences are practice asks; absent: no such hold. */
  closeAsk?: ((sentence: string) => boolean) | null;
  /** Fix round 1 (I3): whether a practice ask is held at all (the summary is due). False: only the drop after a summary begun
   *  in the reply. Absent: held, as in the first version. */
  holdAsk?: boolean;
  /** The words that say the summary has begun (turn.ts V2_SUMMARY_BEGUN), for closeAsk. */
  summaryBegun?: RegExp;
  /** Task 7c (ASK_NO_CHECKIN): drop a check-in ("Does that make sense so far?") that follows an ask handing the turn over
   *  ("Please say that sentence again."): one question per reply. */
  dropCheckIn?: boolean;
  /** Task 7c: the reply handed the turn over before this gate's words (an earlier model call of the same reply). */
  handedOver?: boolean;
}

export class ReplyGate {
  private buf = '';
  private card: string | null = null;
  /** Task 6f: the waiting card goes out only if the next sentence passes this (it points back at the board); else it is dropped. */
  private cardIf: ((sentence: string) => boolean) | null = null;
  private holding = false;
  /** Held goodbye text, in order, as it came (white space kept). */
  private heldParts: string[] = [];
  /** Sentences that did not go out (dropped frames, a dropped goodbye), for removal from the stored reply. */
  readonly removed: string[] = [];
  /** Cards said where they stood (raw text said), for the spoken record. */
  readonly saidCards: string[] = [];
  /** Fix round 1 (minor 3): what a card of several sentences went out as, when some of its sentences were left out because
   *  the model said them itself (card → words said). */
  readonly cardSaidAs = new Map<string, string>();
  /** A card of several sentences checked one sentence at a time (a note's example sentences). */
  private perSentence = false;
  /** The sentences of the card just said, by their words: the model's own repeat of one of them is not said again. */
  private echoes = new Set<string>();
  /** Task 6g: a practice ask waiting for the next sentence (raw text), and whether the summary has begun in this reply. */
  private ask: string | null = null;
  private summaryStarted = false;
  /** Task 7a: asks dropped by dropFrameIf (a repeat, which the runtime's own ask in new words replaces). */
  framesDroppedIf = 0;
  /** Task 7c: an ask handing the turn over has gone out (or waits, held) in this reply. */
  private handedOver: boolean;

  constructor(private readonly out: (text: string) => void, private readonly opts: ReplyGateOptions) { this.handedOver = !!opts.handedOver; }

  /** Nothing to drop or hold: words go out as they come, cut nowhere (fix round 2, N4: with the gate's work off, the
   *  stream is the stream as before it existed). A card waiting for the next sentence still holds them until then. */
  private get passThrough(): boolean { return !this.opts.dropFrame && !this.opts.dropFrameIf && !this.opts.holdGoodbye && !this.opts.closeAsk && !this.opts.dropCheckIn && this.card === null && !this.echoes.size; }

  push(text: string): void {
    if (this.passThrough && !this.buf) { this.emit(text); return; }
    this.buf += text; this.drain(false);
    if (this.passThrough && this.buf) { const rest = this.buf; this.buf = ''; this.emit(rest); }
  }

  /** A board block or the end of a model call: the words so far go out (a goodbye stays held). */
  flush(): void { this.drain(true); this.releaseCard(); }

  /** A sentence card to say where it stands. It goes out before the next sentence, unless that sentence says it. */
  speakCard(sentence: string, opts: { perSentence?: boolean } = {}): void { this.drain(true); this.releaseAsk(); this.releaseCard(); this.card = sentence; this.perSentence = !!opts.perSentence; this.echoes.clear(); }

  /** Words to say where a block stands only if the sentence after it points back at them (Task 6f: "ここにある文を、
   *  ひとつずつ読んでみてください。" after a note of example sentences). Said just before that sentence; dropped when the
   *  next sentence does not point back, or a block or the end comes first. */
  speakCardIf(sentence: string, when: (next: string) => boolean, opts: { perSentence?: boolean } = {}): void { this.drain(true); this.releaseAsk(); this.releaseCard(); this.card = sentence; this.cardIf = when; this.perSentence = !!opts.perSentence; this.echoes.clear(); }

  /** Whether a goodbye is being held. */
  get holdsGoodbye(): boolean { return this.holding; }
  /** The held goodbye text (trimmed), for checks before it is let go. */
  get held(): string { return this.heldParts.join('').trim(); }

  /** Let the held goodbye go, with `before` said first (a line naming a part for next time). */
  releaseHeld(before?: string): void {
    const text = this.heldParts.join(''); this.heldParts = []; this.holding = false;
    // Task 6g: a practice ask before the goodbye cannot be answered: it goes with the close.
    this.dropAsk();
    if (before) this.out(`${before} `);
    if (text) this.out(text);
  }

  /** Drop the held goodbye: the close was refused, so the lesson goes on and no goodbye is said. */
  dropHeld(): void {
    for (const p of this.heldParts) if (p.trim()) this.removed.push(p.trim());
    this.heldParts = []; this.holding = false;
    // Task 6g: the lesson goes on, so a practice ask held before the goodbye stands.
    this.releaseAsk();
  }

  /** Task 6g: a practice ask is waiting for what comes after it. */
  get holdsAsk(): boolean { return this.ask !== null; }
  /** The practice ask waiting, as words (fix round 1, minor 3: a card's lead-in is judged with it). */
  get heldAsk(): string { return this.ask ?? ''; }
  /** Let a waiting practice ask go out: the reply goes on with the lesson, or is complete. */
  releaseAsk(): void { const a = this.ask; this.ask = null; if (a) this.emit(a); }
  /** Drop a waiting practice ask: what follows it closes the lesson. */
  dropAsk(): void { const a = this.ask; this.ask = null; if (a?.trim()) this.removed.push(a.trim()); }
  /** The summary begins here (a closing page opens): a waiting practice ask is dropped, and so is any later one. */
  summaryBegins(): void { if (!this.opts.closeAsk) return; this.drain(true); this.dropAsk(); this.summaryStarted = true; }

  /** `next`: the sentence about to go out after the card (a sentence of the card it already says is left out). */
  private releaseCard(next?: string): void {
    if (this.card === null) return;
    const c = this.card; this.card = null;
    if (this.cardIf) { this.cardIf = null; return; }
    if (!this.perSentence) { this.saidCards.push(c); this.emit(` ${c} `); return; }
    const n = next ? norm(next) : '';
    const keep = splitSentences(c).filter((x) => { const w = norm(x); return !!w && !(n && n.includes(w)); });
    if (!keep.length) return;
    const said = keep.join(' ');
    this.saidCards.push(c); if (said !== c) this.cardSaidAs.set(c, said);
    for (const x of keep) this.echoes.add(norm(x));
    this.emit(` ${said} `);
  }

  private drain(final: boolean): void {
    for (;;) {
      const cut = nextCut(this.buf);
      if (cut < 0) break;
      const s = this.buf.slice(0, cut); this.buf = this.buf.slice(cut);
      this.sentence(s);
    }
    if (final && this.buf) { const s = this.buf; this.buf = ''; this.sentence(s); }
  }

  private sentence(s: string): void {
    const core = s.trim();
    if (!core) { if (this.holding) this.heldParts.push(s); else if (this.ask !== null) this.ask += s; else this.emit(s); return; }
    // Task 7c (ASK_NO_CHECKIN): after an ask that hands the turn over, a check-in is a second question: dropped (a practice
    // ask waiting before it stays waiting).
    if (this.opts.dropCheckIn && this.handedOver && !this.holding && v2IsCheckIn(core)) { this.removed.push(core); return; }
    // Task 6g: what follows a waiting practice ask decides it. The summary beginning or a goodbye closes the lesson, so the
    // ask is dropped (a goodbye keeps it until the close is known: see releaseHeld, dropHeld); anything else, it goes out.
    if (this.opts.closeAsk) {
      // Fix round 1 (I2): summary words begin the summary only when it is due; a closing page always does (summaryBegins).
      const begins = this.opts.holdAsk !== false && !!this.opts.summaryBegun?.test(core);
      if (begins) { this.dropAsk(); this.summaryStarted = true; }
      else if (this.summaryStarted && !this.holding && this.opts.closeAsk(core)) { this.removed.push(core); return; }
      else if (this.ask !== null && !this.holding && !(this.opts.holdGoodbye && isGoodbye(core.replace(QUOTED_SPANS, ' ')))) this.releaseAsk();
    }
    if (this.card !== null && this.cardIf) {
      const when = this.cardIf; this.cardIf = null;
      if (when(core)) this.releaseCard(core); else this.card = null;
    } else if (this.card !== null && this.perSentence) {
      this.releaseCard(core);
    } else if (this.card !== null) {
      // The model said the card's sentence itself, straight after it: said once, in its words.
      const c = norm(this.card); const n = norm(core);
      if (c && n.includes(c)) this.card = null; else this.releaseCard();
    }
    // Fix round 1 (minor 3): a note sentence already said where the note stands, which the model then reads itself.
    if (this.echoes.size && this.echoes.has(norm(core))) { this.removed.push(core); return; }
    if (this.opts.dropFrame && !this.holding && isPartFrame(core)) { this.removed.push(core); return; }
    if (this.opts.dropFrameIf && !this.holding && this.opts.dropFrameIf(core)) { this.removed.push(core); this.framesDroppedIf += 1; return; }
    if (this.holding || (this.opts.holdGoodbye && isGoodbye(core.replace(QUOTED_SPANS, ' ')))) { this.holding = true; this.heldParts.push(s); return; }
    if (this.opts.dropCheckIn && v2HandsOver(core)) this.handedOver = true;
    if (this.opts.closeAsk && this.opts.holdAsk !== false && this.ask === null && this.opts.closeAsk(core)) { this.ask = s; return; }
    this.emit(s);
  }

  private emit(text: string): void { if (text) this.out(text); }
}
