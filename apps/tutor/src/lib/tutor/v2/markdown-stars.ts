/**
 * Tutor brain v2 — Task 7o (NO_MARKDOWN_STARS): the `**` of markdown bold is taken out of a spoken reply's words as they stream.
 * Mic test 4 (embed-1795028886172, 12.87 min): 「一緒に仕事をする**人**に使います」 showed its asterisks in the transcript bubble.
 * The words arrive in pieces, so a single `*` ending a piece waits for the next (a pair split across two pieces is still a pair).
 * A lone `*` left at the very end of a reply is dropped. A single `*` inside a piece is left as written. Pure, client-safe.
 */
export class V2StarStrip {
  private held = '';
  push(piece: string): string {
    let s = this.held + piece; this.held = '';
    if (/(?:^|[^*])\*$/.test(s)) { this.held = '*'; s = s.slice(0, -1); }
    return s.replace(/\*\*/g, '');
  }
}
