/**
 * Tutor brain v2 — how the words of a card are set out.
 *
 * A note or a problem card arrives as plain lines. Set as one font at one size, a heading reads like the
 * sentence under it, program code loses its shape, and "2^n" stays a caret (Praveen, AP CS A recursion and
 * AP Physics 1 rotation, 2026-11-11). This reads the lines for what they are: a heading, a labelled point
 * ("Base case: …"), a run of program code, or a sentence. Pure, so it is tested without a browser.
 */
export type RichBlock = { kind: 'title'; text: string } | { kind: 'line'; text: string; label?: string } | { kind: 'code'; text: string };

/** A line of program code: it ends a statement or opens or closes a block, perhaps with a comment after it. */
const CODE_END = /(?:[{};]|\)\s*:)\s*(?:(?:\/\/|#).*)?$/;
const CODE_START = /^\s*(?:\}|(?:public|private|protected|static|def|class|return|for|while|if|else|int|void|double|boolean|String|let|const|var|function|print|System\.)\b)/;
export function looksLikeCodeLine(line: string): boolean {
  const l = line.trim();
  if (!l || l.includes('$')) return false;
  if (l === '{' || l === '}') return true;
  if (/^(?:\/\/|#\s)/.test(l)) return false;
  // Prose ends in a full stop; "x = 3;" and "f(n) {" do not.
  const bare = l.replace(/(?:\/\/|#).*$/, '');
  return CODE_END.test(l) && (/[(){}=]/.test(l) || CODE_START.test(l)) && !/[.!?]\s*$/.test(bare);
}

/** Whether the whole of a card is program code (it is then shown as a code listing). */
export function isCodeBody(body: string): boolean {
  const lines = body.split('\n').filter((l) => l.trim());
  return lines.length >= 2 && lines.filter(looksLikeCodeLine).length >= Math.max(2, Math.ceil(lines.length * 0.7));
}

/** Code written on one line ("int g(int n) { if (n <= 0) return 0; return n + g(n - 1); }") set out as it would be typed. */
export function unfoldCode(line: string): string {
  if (line.includes('\n') || !/\{.*;.*\}\s*$/.test(line)) return line;
  let depth = 0; let out = ''; let paren = 0;
  const pad = () => '  '.repeat(Math.max(0, depth));
  const skipSpaces = (i: number) => { let j = i; while (line[j + 1] === ' ') j += 1; return j; };
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '(') paren += 1; else if (ch === ')') paren = Math.max(0, paren - 1);
    if (ch === '{') { depth += 1; out = `${out.trimEnd()} {\n${pad()}`; i = skipSpaces(i); }
    else if (ch === '}') { depth -= 1; out = `${out.trimEnd()}\n${pad()}}`; i = skipSpaces(i); if (i + 1 < line.length) out += `\n${pad()}`; }
    // A semicolon inside brackets belongs to a for-loop's heading.
    else if (ch === ';' && paren === 0) { out += ';'; i = skipSpaces(i); if (line[i + 1] !== '}' && i + 1 < line.length) out += `\n${pad()}`; }
    else out += ch;
  }
  return out.trim();
}

/** "2^n" and "O(2^n)" between dollar signs, so the board typesets them. Lines that already carry maths are left alone. */
export function typesetPowers(line: string): string {
  if (line.includes('$')) return line;
  return line.replace(/(?<![\w\\^])((?:[A-Za-z]\()?[A-Za-z0-9]+\^(?:\{[^}]*\}|\([^)]*\)|[A-Za-z0-9]+)\)?)(?![\w^])/g, (m) => {
    // "O(2^n)" closes its own bracket; in "(x^2)" the bracket belongs to the sentence.
    const open = (m.match(/\(/g) ?? []).length; const close = (m.match(/\)/g) ?? []).length;
    const body = close > open ? m.slice(0, -1) : m;
    return `$${body.replace(/\^([A-Za-z0-9]{2,})/, '^{$1}')}$${close > open ? ')' : ''}`;
  });
}

const END_PUNCT = /[.:;?!,]\s*$/;
/** The card's lines as blocks. `titled`: the first line may be a heading (a note; never a problem's first sentence). */
export function richBlocks(text: string, opts: { titled?: boolean } = {}): RichBlock[] {
  const lines = String(text ?? '').split('\n');
  const blocks: RichBlock[] = [];
  let code: string[] = [];
  const endCode = () => { if (code.length) { blocks.push({ kind: 'code', text: code.length === 1 ? unfoldCode(code[0].trim()) : code.join('\n') }); code = []; } };
  for (const raw of lines) {
    if (!raw.trim()) { endCode(); continue; }
    if (looksLikeCodeLine(raw)) { code.push(raw.replace(/\s+$/, '')); continue; }
    endCode();
    const line = typesetPowers(raw.trim());
    // "Base case: the point where the recursion stops" — the term is set apart from what is said of it.
    const m = /^([A-Z][^:.$?!]{1,40}):\s+(\S.*)$/.exec(line);
    if (m && m[1].trim().split(/\s+/).length <= 5) blocks.push({ kind: 'line', label: m[1].trim(), text: m[2] });
    else blocks.push({ kind: 'line', text: line });
  }
  endCode();
  const first = blocks[0];
  if (opts.titled && blocks.length >= 2 && first.kind === 'line' && !first.label && !END_PUNCT.test(first.text) && !first.text.includes('$') && first.text.split(/\s+/).length <= 9) blocks[0] = { kind: 'title', text: first.text };
  return blocks;
}
