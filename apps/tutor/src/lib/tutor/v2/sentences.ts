/**
 * Tutor brain v2 — cutting streamed text into sentences for speech.
 *
 * The model's words arrive in small pieces; speech wants whole sentences, as
 * early as possible (the first one sets how soon the tutor is heard). A
 * sentence ends at . ! ? (or their full-width forms) followed by a space or a
 * line break; a paragraph break always ends one. A full stop inside a number
 * ("3.5") or straight after a single capital ("f. g") or a common abbreviation
 * does not, and neither does anything inside a $…$ span.
 */
const ABBREVIATIONS = /(?:\b(?:e\.g|i\.e|vs|etc|approx|Mr|Mrs|Ms|Dr|St|No|Fig|Eq)\.)$/i;

export class SentenceStream {
  private buf = '';

  /** Words of the next sentence have begun to arrive. */
  hasPending(): boolean { return /\S/.test(this.buf); }

  /** How many sentences have been given out, and which of them began a paragraph (the first always does).
   *  A board item belongs to the paragraph it is written after (TutorVoiceV2). */
  private count = 0;
  private first = true;
  readonly paragraphStarts = new Set<number>();
  private emit(raw: string, out: string[]): void {
    const sentence = raw.replace(/\s+/g, ' ').trim();
    if (!sentence) return;
    if (this.first || /^\s*\n\s*\n/.test(raw)) this.paragraphStarts.add(this.count);
    this.first = false; this.count += 1;
    out.push(sentence);
  }

  /** Add streamed text; returns the sentences it completed, in order. */
  push(delta: string): string[] {
    this.buf += delta;
    const out: string[] = [];
    for (;;) {
      const cut = this.nextCut();
      if (cut < 0) break;
      this.emit(this.buf.slice(0, cut), out);
      // The white space after a sentence stays: a paragraph break in it marks the next sentence.
      this.buf = this.buf.slice(cut);
    }
    return out;
  }

  /** The stream has ended (or a tool call interrupts the words): whatever is left is a sentence. */
  flush(): string[] {
    const out: string[] = [];
    this.emit(this.buf, out);
    // A tool call or a board block between two paragraphs does not hide the break.
    if (!out.length && /\n\s*\n/.test(this.buf)) this.first = true;
    this.buf = '';
    return out;
  }

  private nextCut(): number {
    // White space left in front by the last cut is not a break to cut at.
    const lead = this.buf.length - this.buf.replace(/^\s+/, '').length;
    const at = this.buf.slice(lead).search(/\n\s*\n/);
    const para = at < 0 ? -1 : at + lead;
    const re = /[.!?。！？]+["')\]]*(?=\s)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(this.buf))) {
      const end = m.index + m[0].length;
      if (para >= 0 && para < m.index) break;
      const before = this.buf.slice(0, m.index + 1);
      // Inside a $…$ span (an odd number of dollar signs so far): cutting here leaves each half with a lone
      // "$", which the voice reads as "dollar" (embed-1794339843244).
      if ((before.match(/\$/g) ?? []).length % 2 === 1) continue;
      if (m[0][0] === '.') {
        if (ABBREVIATIONS.test(before)) continue;
        if (/(?:^|\s)[A-Za-z]\.$/.test(before)) continue; // a lone letter: "f." in "f. g"
      }
      return end;
    }
    return para >= 0 ? para : -1;
  }
}
