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
const CODE_END = /[{};]\s*(?:(?:\/\/|#).*)?$/;
/** A Python block's opening line. */
const PY_OPEN = /^\s*(?:def|for|while|if|elif|else|class|try|except|with)\b.*:\s*(?:#.*)?$/;
const CODE_START = /^\s*(?:\}|(?:public|private|protected|static|def|class|return|for|while|if|else|int|void|double|boolean|String|let|const|var|function|print|System\.)\b)/;
export function looksLikeCodeLine(line: string): boolean {
  const l = line.trim();
  if (!l || l.includes('$')) return false;
  if (l === '{' || l === '}') return true;
  if (/^(?:\/\/|#\s)/.test(l)) return false;
  // Prose ends in a full stop; "x = 3;" and "f(n) {" do not.
  const bare = l.replace(/(?:\/\/|#).*$/, '');
  if (PY_OPEN.test(l)) return true;
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

// ── Mathematics written in the middle of a sentence ───────────────────────
// "Try it on y = x² from x = 0 to x = 2" arrives as plain characters. Each run of mathematics in a line is
// found and put between dollar signs, so the board typesets it like the equations beside it (Praveen, AP Calc
// BC, 2026-11-11: "wherever there is math it has to look proper"). Words stay words: a token of two or more
// letters is not mathematics unless it is a function name, so "pH", "HA" and units are left alone.
const RELATION = /^(?:=|≠|≈|<|>|≤|≥|\+|−|-|×|·|\/|→|∝|±)$/;
const FUNCTION_NAMES = /^(?:sin|cos|tan|sec|csc|cot|ln|log|exp|lim|sqrt|min|max|dx|dy|dt|dr|du)$/;
const SHORT_WORDS = new Set('is to of in on an as at be by do go he if it me my no or so up us we am oh ok ah ad ax ex hi ha id ie eg lo ma pa re um uh vs ye yo cm km mm kg ml mg ms hz'.split(' '));
const MATHS_CHARS = /[\^_²³¹⁰⁴-⁹⁻⁺₀-₉√∫∑πθωαβγδλμσφτΔ∞\u0302\u0304]/;
function strippedToken(tok: string): { lead: string; core: string; trail: string } {
  const lead = /^["“']*/.exec(tok)![0];
  const trail = /[.,;:!?"”']*$/.exec(tok.slice(lead.length))![0];
  return { lead, core: tok.slice(lead.length, tok.length - trail.length), trail };
}
function mathsToken(core: string): boolean {
  if (!core) return false;
  if (RELATION.test(core)) return true;
  if (/^\d+(?:[.,]\d+)*%?$/.test(core)) return true;
  // Words: two or more letters in a row that are not a function name ("pKa", "radius", "HA").
  const words = core.match(/[A-Za-z]{2,}/g) ?? [];
  // Two small letters can be a product of variables ("kx", "mx"); a two-letter word is not.
  if (words.some((w) => !FUNCTION_NAMES.test(w) && !(/^[a-z]{2}$/.test(w) && !SHORT_WORDS.has(w)))) return false;
  return /^[A-Za-z0-9()[\]{}.,+\-−×·/^_=<>≤≥≈²³¹⁰⁴-⁹⁻⁺₀-₉√∫∑πθωαβγδλμσφτΔ∞|'\u0302\u0304]+$/.test(core);
}
const SUPERS: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+' };
const SUBS: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
function toLatex(run: string): string {
  return run
    .replace(/([A-Za-z])\u0302/g, '\\hat{$1}').replace(/([A-Za-z])\u0304/g, '\\bar{$1}')
    .replace(/[⁰¹²³⁴-⁹⁻⁺]+/g, (m) => `^{${[...m].map((c) => SUPERS[c]).join('')}}`).replace(/[₀-₉]+/g, (m) => `_{${[...m].map((c) => SUBS[c]).join('')}}`)
    .replace(/√\(([^()]*)\)/g, '\\sqrt{$1}').replace(/√([A-Za-z0-9]+)/g, '\\sqrt{$1}')
    .replace(/\bsqrt\(([^()]*)\)/g, '\\sqrt{$1}')
    .replace(/∫_\{([^}]*)\}\^\{([^}]*)\}/g, '\\int_{$1}^{$2}')
    .replace(/\b(sin|cos|tan|sec|csc|cot|ln|log|exp|lim|min|max)\b/g, '\\$1 ')
    .replace(/·/g, ' \\cdot ').replace(/×/g, ' \\times ').replace(/−/g, '-')
    .replace(/\^\(([^()]*)\)/g, '^{$1}').replace(/\^(-?[A-Za-z0-9]{2,})/g, '^{$1}')
    .replace(/%/g, '\\%').replace(/\bd([xytru])\b/g, '\\,d$1');
}
/** Put each run of mathematics in a line between dollar signs. Text already between dollar signs is left as it is. */
/** A matrix, a column and a vector typed on one line are set as what they are: "[[1, 2], [0, 1]]", "[3; 1]" and
 *  "⟨3, 6⟩" stood on the board as brackets and commas beside typeset matrices (AP Precalculus, embed-1794456849622). */
function typesetBrackets(line: string): string {
  const cell = (c: string) => toLatex(c.trim());
  return line.split(/(\$[^$]*\$)/).map((seg) => {
    if (seg.startsWith('$')) return seg;
    return seg
      .replace(/\[\s*(\[[^[\]]*\](?:\s*,\s*\[[^[\]]*\])+)\s*\]/g, (_m, rows: string) => `$\\begin{bmatrix} ${rows.split(/\]\s*,\s*\[/).map((r) => r.replace(/^\s*\[|\]\s*$/g, '').split(',').map(cell).join(' & ')).join(' \\\\ ')} \\end{bmatrix}$`)
      .replace(/\[\s*([^[\];,]+(?:\s*;\s*[^[\];,]+)+)\s*\]/g, (_m, col: string) => `$\\begin{bmatrix} ${col.split(';').map(cell).join(' \\\\ ')} \\end{bmatrix}$`)
      .replace(/⟨([^⟨⟩$]+)⟩/g, (_m, parts: string) => `$\\langle ${parts.split(',').map(cell).join(',\\ ')} \\rangle$`)
      // The name it is given, and a product or an equals sign between two of them, join the same piece of mathematics.
      .replace(/\$\s*(·|=)\s*\$/g, (_m, op: string) => (op === '·' ? ' \\cdot ' : ' = '))
      .replace(/(?<![A-Za-z$\\])((?:\d+)?[A-Za-z]{1,2}(?:\s*[·+−-]\s*[A-Za-z])?)\s*=\s*\$(?=\\(?:begin|langle))/g, (_m, name: string) => `$${toLatex(name)} = `);
  }).join('');
}
export function typesetMaths(text: string): string {
  const line = typesetBrackets(text.replace(/ŷ/g, 'y\u0302').replace(/ȳ/g, 'y\u0304'));
  return line.split(/(\$[^$]*\$)/).map((seg) => {
    if (seg.startsWith('$')) return seg;
    // "∫ from a to b of" is the integral's limits, said in words.
    // "the x-axis", "the y-values": the letter is the variable.
    const pre = seg.replace(/∫\s*from\s+(\S+)\s+to\s+(\S+)\s+of\s+/g, '∫_{$1}^{$2} ').replace(/(?<![A-Za-z$])([xy])-(axis|axes|values?|coordinates?|intercepts?)\b/g, '$$$1$$-$2');
    const toks = pre.split(/(\s+)/);
    const out: string[] = [];
    let i = 0;
    while (i < toks.length) {
      if (!toks[i].trim()) { out.push(toks[i]); i += 1; continue; }
      // Grow a run of mathematics tokens. Only its first token may bring a bracket or quote before it, and only
      // its last may carry sentence punctuation after it.
      let j = i; let after = i; const cores: string[] = []; let lead = ''; let trail = '';
      while (j < toks.length) {
        if (!toks[j].trim()) { j += 1; continue; }
        const t = strippedToken(toks[j]);
        if (!mathsToken(t.core) || (cores.length > 0 && t.lead)) break;
        if (cores.length === 0) lead = t.lead;
        cores.push(t.core); trail = t.trail; j += 1; after = j;
        if (t.trail) break;
      }
      // A bracket the run opens and never closes, or closes and never opened, belongs to the sentence around it:
      // "(the higher curve, y = x)." and "R = x (the higher curve".
      const count = (ch: string) => cores.join(' ').split(ch).length - 1;
      while (cores.length && cores[cores.length - 1].endsWith(')') && count(')') > count('(')) { cores[cores.length - 1] = cores[cores.length - 1].slice(0, -1); trail = `)${trail}`; if (!cores[cores.length - 1]) cores.pop(); }
      while (cores.length && cores[0].startsWith('(') && count('(') > count(')')) { cores[0] = cores[0].slice(1); lead = `${lead}(`; if (!cores[0]) cores.shift(); }
      // An operator at either end belongs to the sentence ("the area - that is, …").
      let start = 0; let end = cores.length;
      while (end > start && RELATION.test(cores[end - 1])) end -= 1;
      while (start < end && RELATION.test(cores[start])) start += 1;
      const run = cores.slice(start, end);
      const joined = run.join(' ');
      const hasVariable = /[A-Za-zπθωαβγδλμσφτΔ]/.test(joined);
      const hasRelation = run.some((c) => RELATION.test(c)) || /[=<>≤≥≈+−×·/]/.test(joined.replace(/^[-−]/, ''));
      // A species with its charge (A⁻, H⁺, OH⁻) is chemistry, set upright by the board already.
      // A lone small letter is a variable ("the constant k", "dogs walked (x)"): set like the x in an equation.
      // Not "a" or "i", not a unit after a number ("5 m", "2 s"), and not the marker of a list ("b. …").
      const before = out.slice().reverse().find((t) => t.trim()) ?? '';
      const loneVariable = run.length === 1 && /^\(?[b-hj-z]\)?$/.test(joined) && !/\d\)?$/.test(before) && !(out.every((t) => !t.trim()) && /^[.)]/.test(trail));
      const single = loneVariable || (run.length === 1 && (MATHS_CHARS.test(joined.replace(/[⁺⁻]/g, '')) || /^[A-Za-z]\([A-Za-z0-9, ]+\)$/.test(joined)) && !/^[\d.,]+$/.test(joined));
      // Symbols side by side are a product: "π r²".
      const product = run.length >= 2 && run.every((c) => !RELATION.test(c)) && run.some((c) => MATHS_CHARS.test(c.replace(/[⁺⁻]/g, '')));
      // Two years with a dash, a score, a ratio of plain numbers: not a formula. A run needs a letter to be one,
      // and the pronoun "I" or the article "a" alone beside an operator is not that letter.
      const onlyWordLetters = !/[b-zB-HJ-Zπθωαβγδλμσφτ]/.test(joined.replace(/\\[a-z]+/g, '')) && !/[=]/.test(joined);
      // A product of letters counts only inside an equation: "y = kx", never two stray letters in a sentence.
      const letterPairs = run.some((c) => /^[a-z]{2}$/.test(c)) && !joined.includes('=');
      const ok = !letterPairs && start === 0 && end === cores.length && (single || (product && hasVariable) || (run.length >= 3 && hasVariable && hasRelation && !onlyWordLetters));
      if (!ok || cores.length === 0) { out.push(toks[i]); i += 1; continue; }
      out.push(`${lead}$${toLatex(joined)}$${trail}`);
      // Keep the white space that followed the run.
      i = after;
    }
    return out.join('');
  }).join('');
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
    // A list written with dashes: each line is already a point of its own.
    const line = typesetMaths(typesetPowers(raw.trim().replace(/^[-•–]\s+/, '')));
    // "Base case: the point where the recursion stops" — the term is set apart from what is said of it.
    const m = /^([A-Z][^:.$?!]{1,40}):\s+(\S.*)$/.exec(line);
    if (m && m[1].trim().split(/\s+/).length <= 5) blocks.push({ kind: 'line', label: m[1].trim(), text: m[2] });
    else blocks.push({ kind: 'line', text: line });
  }
  endCode();
  const first = blocks[0];
  // A heading: a short first line that is not a sentence. "Disc method, the idea:" heads the points under it.
  // A first line that names a thing and says what it is ("s_x: standard deviation of the x values") is the first
  // of the points, not a heading over them: it stood in bold above its two fellows (AP Statistics, embed-1794460149936).
  const heading = first?.kind === 'line' && !first.label && !/:\s+\S/.test(first.text) ? first.text.replace(/:\s*$/, '') : '';
  if (opts.titled && blocks.length >= 2 && heading && !END_PUNCT.test(heading) && heading.split(/\s+/).length <= 9) blocks[0] = { kind: 'title', text: heading };
  return blocks;
}
