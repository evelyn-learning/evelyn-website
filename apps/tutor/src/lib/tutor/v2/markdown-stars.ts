/**
 * Tutor brain v2 — Task 7o (NO_MARKDOWN_STARS): the `**` of markdown bold is taken out of a spoken reply's words as they stream.
 * Mic test 4 (embed-1795028886172, 12.87 min): 「一緒に仕事をする**人**に使います」 showed its asterisks in the transcript bubble.
 * Every run of two or more stars goes (fix round 1: `***x***`, bold italic, leaves no star). The words arrive in pieces, so a run
 * of stars ending a piece waits for the next (a pair split across two pieces is still a pair); `end()` gives back a lone star
 * still waiting when the reply is over, so the caller can drop it from the final text too (captions and transcript the same).
 * A single `*` inside a piece is left as written. Pure, client-safe.
 */
export const v2StripStars = (text: string): string => text.replace(/\*{2,}/g, '');

export class V2StarStrip {
  private held = '';
  push(piece: string): string {
    let s = this.held + piece; this.held = '';
    const tail = /\*+$/.exec(s);
    if (tail) { this.held = tail[0]; s = s.slice(0, tail.index); }
    return v2StripStars(s);
  }
  /** What is still held at the end: '' or a lone '*' (a held run of two or more is markdown, and goes). */
  end(): string {
    const h = this.held; this.held = '';
    return h.length === 1 ? h : '';
  }
}
