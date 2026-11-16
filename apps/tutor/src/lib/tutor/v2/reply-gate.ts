/**
 * Tutor brain v2 — the reply's words on their way out, a sentence at a time (Task 6e, fix round 1).
 *
 * The model's words were streamed to the student as they came, so nothing it wrote could be taken back. Three things in
 * the real-voice replays (v2audio-6e/RESULTS.md) needed a sentence held for a moment first:
 *  - the part-change frame ("Shall we go on, or do you have a question first?") the model wrote itself at part changes
 *    where the runtime had already asked it at the one before (C: five times in tester B's run): dropped (F1);
 *  - a sentence card spoken where it stands, which the model then said again in its next sentence (tester B T50): the
 *    card is said only when the next sentence does not say it (F5);
 *  - a goodbye: held until the reply is complete, so a close the runtime refuses leaves no goodbye behind it (James:
 *    "See you next time!Would you like to do something harder…?", F4), and a part not reached can be named before it
 *    (Josh's stop goodbye, F3).
 *
 * The client cuts sentences again for speech (sentences.ts); this gate only decides which go out and when. It never
 * changes a sentence's words. Pure apart from its output callback.
 */

/** The part-change frame: asking whether to go on, alone or with the question check. Matched on a whole sentence. */
export const V2_PART_FRAME = /^(?:(?:so|okay|ok|now|then|great|good|alright|all right)[,!.]?\s+)*(?:shall we (?:go on|move on|continue|start)|are you ready (?:for (?:that|it|the next part|this)|to (?:go on|move on|start))|ready to (?:go on|move on))\b[^.?!]*\?["'”’]*$|^[^.?!]*\bor do you have (?:a|any) questions? (?:first|before we (?:go on|move on|start))\?["'”’]*$/i;
/** A goodbye: the words that end the lesson for the student. */
export const V2_GOODBYE = /\b(?:see you (?:next time|soon|again|then)|goodbye|good-bye|bye for now|bye[,!.]|have a (?:good|great|nice|lovely) (?:day|evening|night|weekend|week)|take care)\b|お疲れ(?:様|さま)でした|またお会いしましょう|また次回/i;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean).join(' ');

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
  /** Hold a goodbye, and everything after it, until the reply is complete (F3, F4). */
  holdGoodbye: boolean;
}

export class ReplyGate {
  private buf = '';
  private card: string | null = null;
  private holding = false;
  /** Held goodbye text, in order, as it came (white space kept). */
  private heldParts: string[] = [];
  /** Sentences that did not go out (dropped frames, a dropped goodbye), for removal from the stored reply. */
  readonly removed: string[] = [];
  /** Cards said where they stood (raw text said), for the spoken record. */
  readonly saidCards: string[] = [];

  constructor(private readonly out: (text: string) => void, private readonly opts: ReplyGateOptions) {}

  push(text: string): void { this.buf += text; this.drain(false); }

  /** A board block or the end of a model call: the words so far go out (a goodbye stays held). */
  flush(): void { this.drain(true); this.releaseCard(); }

  /** A sentence card to say where it stands. It goes out before the next sentence, unless that sentence says it. */
  speakCard(sentence: string): void { this.drain(true); this.releaseCard(); this.card = sentence; }

  /** Whether a goodbye is being held. */
  get holdsGoodbye(): boolean { return this.holding; }
  /** The held goodbye text (trimmed), for checks before it is let go. */
  get held(): string { return this.heldParts.join('').trim(); }

  /** Let the held goodbye go, with `before` said first (a line naming a part for next time). */
  releaseHeld(before?: string): void {
    const text = this.heldParts.join(''); this.heldParts = []; this.holding = false;
    if (before) this.out(`${before} `);
    if (text) this.out(text);
  }

  /** Drop the held goodbye: the close was refused, so the lesson goes on and no goodbye is said. */
  dropHeld(): void {
    for (const p of this.heldParts) if (p.trim()) this.removed.push(p.trim());
    this.heldParts = []; this.holding = false;
  }

  private releaseCard(): void { if (this.card !== null) { const c = this.card; this.card = null; this.saidCards.push(c); this.emit(` ${c} `); } }

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
    if (!core) { if (this.holding) this.heldParts.push(s); else this.emit(s); return; }
    if (this.card !== null) {
      // The model said the card's sentence itself, straight after it: said once, in its words.
      const c = norm(this.card); const n = norm(core);
      if (c && n.includes(c)) this.card = null; else this.releaseCard();
    }
    if (this.opts.dropFrame && !this.holding && V2_PART_FRAME.test(core)) { this.removed.push(core); return; }
    if (this.holding || (this.opts.holdGoodbye && V2_GOODBYE.test(core))) { this.holding = true; this.heldParts.push(s); return; }
    this.emit(s);
  }

  private emit(text: string): void { if (text) this.out(text); }
}
