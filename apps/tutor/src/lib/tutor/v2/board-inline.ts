/**
 * Tutor brain v2 — board items written inline in the reply.
 *
 * A model writes its words first and its tool calls after. For the board that order is wrong: the
 * tutor chose what to draw after it had finished talking, so items appeared at the wrong moment,
 * showed things it never said, or were forgotten (Praveen, embed-1794342128162). The everyday board
 * items are therefore written IN the reply, at the point where a tutor would pick up the pen:
 *
 *   <board equation label="…">LaTeX</board>
 *   <board note style="highlight">one point per line, $maths$ inline</board>
 *   <board problem difficulty="medium">the problem, $maths$ inline</board>
 *
 * The runtime lifts the blocks out of the stream: the words go to the student, each block becomes a
 * board call at that position (turn.ts), and the voice client paints it as the sentence before it
 * begins (TutorVoiceV2). The stored reply keeps the blocks, so the history shows a tutor who writes
 * while talking. `with="opening words"` is for the board pass only, whose blocks arrive after the words.
 */
export type InlineKind = 'equation' | 'note' | 'problem';
export interface InlineBlock { kind: InlineKind; attrs: Record<string, string>; body: string; raw: string }
export type InlinePart = { text: string } | { block: InlineBlock };

const OPEN = '<board';
const CLOSE = '</board>';
const BLOCK_RE = /<board\s+(equation|note|problem)((?:\s+[a-z_]+="[^"]*")*)\s*>([\s\S]*?)<\/board>/g;

function parseBlock(raw: string): InlineBlock | null {
  BLOCK_RE.lastIndex = 0;
  const m = BLOCK_RE.exec(raw);
  if (!m) return null;
  const attrs: Record<string, string> = {};
  for (const a of m[2].matchAll(/([a-z_]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
  return { kind: m[1] as InlineKind, attrs, body: m[3].trim(), raw: m[0] };
}

/** The reply as the student gets it: the blocks removed, the gaps closed. */
export function stripBoardBlocks(text: string): string {
  return text.replace(/<board\b[\s\S]*?<\/board>/g, ' ').replace(/<board\b[\s\S]*$/, ' ').replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

/** Every well-formed block in a finished text, in order. */
export function boardBlocksIn(text: string): InlineBlock[] {
  return [...text.matchAll(/<board\b[\s\S]*?<\/board>/g)].map((m) => parseBlock(m[0])).filter((b): b is InlineBlock => !!b);
}

/** The board tool call a block stands for. */
export function inlineToolCall(b: InlineBlock): { name: string; args: Record<string, unknown> } {
  if (b.kind === 'equation') return { name: 'show_equation', args: { latex: b.body, ...(b.attrs.label ? { label: b.attrs.label } : {}) } };
  if (b.kind === 'note') return { name: 'annotate', args: { text: b.body, ...(b.attrs.style ? { style: b.attrs.style } : {}) } };
  return { name: 'show_problem', args: { statement: b.body, format: 'free-response', ...(b.attrs.title ? { title: b.attrs.title } : {}), ...(b.attrs.difficulty ? { difficulty: b.attrs.difficulty } : {}) } };
}

/** Splits streamed text into words and blocks, holding back anything that may be the start of a block. */
export class BoardInlineStream {
  private buf = '';

  push(delta: string): InlinePart[] {
    this.buf += delta;
    return this.drain(false);
  }

  /** The stream has ended: an unfinished block is dropped (it never reaches the student as text). */
  flush(): InlinePart[] {
    return this.drain(true);
  }

  private drain(final: boolean): InlinePart[] {
    const out: InlinePart[] = [];
    for (;;) {
      const open = this.buf.indexOf(OPEN);
      if (open < 0) {
        // Keep back a tail that could be the first characters of "<board".
        let keep = 0;
        if (!final) for (let n = Math.min(OPEN.length - 1, this.buf.length); n > 0; n--) if (OPEN.startsWith(this.buf.slice(-n))) { keep = n; break; }
        const text = this.buf.slice(0, this.buf.length - keep);
        this.buf = this.buf.slice(this.buf.length - keep);
        if (text) out.push({ text });
        return out;
      }
      if (open > 0) { out.push({ text: this.buf.slice(0, open) }); this.buf = this.buf.slice(open); }
      const close = this.buf.indexOf(CLOSE);
      if (close < 0) { if (final) this.buf = ''; return out; }
      const raw = this.buf.slice(0, close + CLOSE.length);
      this.buf = this.buf.slice(close + CLOSE.length);
      const block = parseBlock(raw);
      if (block) out.push({ block });
    }
  }
}

const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

/** Put a block into a finished reply right after the sentence that opens with `withWords`; at the end when
 *  that sentence is not found. Used to store the board pass's blocks where they belong. */
export function insertBlock(text: string, raw: string, withWords?: string): string {
  const want = words(withWords ?? '').slice(0, 4);
  if (want.length >= 2) {
    const re = /[^\s<][^.!?\n<]*(?:[.!?]+|\n|$)/g;
    let m: RegExpExecArray | null;
    let depth = 0; let last = 0;
    // Sentence starts outside existing blocks only.
    const outside = (at: number) => { for (const b of text.slice(last, at).matchAll(/<board\b|<\/board>/g)) depth += b[0] === '</board>' ? -1 : 1; last = at; return depth <= 0; };
    while ((m = re.exec(text))) {
      if (!outside(m.index)) continue;
      const got = words(m[0]).slice(0, want.length);
      if (got.length === want.length && got.every((w, i) => w === want[i])) { const end = m.index + m[0].trimEnd().length; return `${text.slice(0, end)} ${raw}${text.slice(end)}`; }
      if (!m[0]) re.lastIndex += 1;
    }
  }
  return `${text.trimEnd()}\n${raw}`;
}
