/**
 * Tolerant reading of a model's JSON reply. Pure — no model calls, no env.
 *
 * Two faults this exists for, both found live on 2026-10-05:
 *
 *  1. The practice grader's judge was told "Reply ONLY as JSON" and, for hard
 *     maths answers, wrote its working as prose BEFORE the object — or wrote
 *     an object, noticed a slip, and wrote a second, corrected object. A bare
 *     `JSON.parse` of the whole reply threw, the grader swallowed that, and a
 *     correct answer was marked wrong with empty feedback (11 answers).
 *     → `parseJsonObjects` returns every JSON object in the reply, in order;
 *       the caller picks (the judge's verdict is the LAST one).
 *
 *  2. LaTeX inside a JSON string. `\sqrt` is an invalid escape, so the whole
 *     reply fails to parse. Worse, `\frac`, `\times`, `\nabla`, `\beta`,
 *     `\rho` are VALID JSON (`\f`, `\t`, `\n`, `\b`, `\r`) and parse without
 *     error into a form feed / tab / newline / backspace / carriage return
 *     followed by "rac" / "imes" / "abla" / "eta" / "ho" — silently corrupt
 *     maths in generated problem text and feedback.
 *     → `repairJsonStringEscapes` doubles those backslashes before parsing so
 *       the command survives as text.
 */

/** LaTeX commands that begin with a letter JSON treats as an escape. `\b…`
 *  and `\f…` need no list (a backspace or form feed before a letter is never
 *  intended), so only n / r / t are enumerated. */
const LATEX_N = new Set([
  'nabla', 'natural', 'ncong', 'ne', 'nearrow', 'neg', 'neq', 'newline', 'nexists', 'ngeq', 'ngtr', 'ni', 'nleq', 'nless',
  'nmid', 'nolimits', 'nonumber', 'normalsize', 'not', 'notin', 'nparallel', 'nprec', 'nsim', 'nsubseteq',
  'nsucc', 'nsupseteq', 'nu', 'nwarrow',
]);
/** `\ne`, `\nu`, `\ni`: as a line break these leave a bare "e" / "u" / "i" —
 *  a plausible start of a line — so outside `$…$` they need maths on BOTH sides. */
const LATEX_N_AMBIGUOUS = new Set(['ne', 'nu', 'ni']);
const LATEX_R = new Set([
  'raise', 'rangle', 'rbrace', 'rbrack', 'rceil', 'rfloor', 'rho', 'right', 'rightarrow', 'rightarrowtail',
  'rightharpoondown', 'rightharpoonup', 'rightleftarrows', 'rightleftharpoons', 'rightrightarrows', 'rlap',
  'rm', 'rtimes', 'rule', 'rvert', 'rVert',
]);
const LATEX_T = new Set([
  'tag', 'tan', 'tanh', 'tau', 'tbinom', 'tfrac', 'therefore', 'theta', 'thickapprox', 'thicksim', 'thinspace',
  'tilde', 'times', 'tiny', 'to', 'top', 'triangle', 'triangledown', 'triangleleft', 'triangleq', 'triangleright',
  'tt', 'twoheadrightarrow',
]);

/** Where a `\n…` sits inside its JSON string: what is around it. */
interface EscapeContext {
  /** Inside `$…$` (an odd number of unescaped dollars so far in the string). */
  inDollarMaths: boolean;
  /** The last non-space character before the backslash, and the one before it. */
  before: string;
  beforePrev: string;
  /** The character right after the command's letters. */
  next: string;
  /** The first non-space character after the command, and the one after it. */
  after: string;
  afterNext: string;
}

const isLetter = (c: string) => /[A-Za-z]/.test(c);
/** A digit, an operator, a bracket or a maths delimiter — or a one-letter
 *  variable (a letter with no letter on its other side). */
function mathsBefore(ctx: EscapeContext): boolean {
  if (!ctx.before) return false;
  if (/[\d$({[^_=+\-<>|*/\\}]/.test(ctx.before)) return true;
  return isLetter(ctx.before) && !isLetter(ctx.beforePrev);
}
function mathsAfter(ctx: EscapeContext): boolean {
  if (!ctx.after) return false;
  if (/[\d\\{$^_=+<>|(]/.test(ctx.after)) return true;
  return isLetter(ctx.after) && !isLetter(ctx.afterNext);
}

/**
 * Is `\n<letters>` a LaTeX command, or a line break followed by a word?
 *
 * The first version asked only whether the letters spelt a command, and read
 * a real line break before "e.g.", "i)" or "mid-term" as `\ne`, `\ni`,
 * `\nmid` — the sentence lost its line break and gained a stray symbol. A
 * line can begin with what is left of many commands ("e", "i", "u", "eg",
 * "ot", "mid", "less", "exists", "parallel"), so now it is LaTeX only when
 * ALL of these hold:
 *  - the letters are a full known command (the caller passes the whole run of
 *    letters, so the command is followed by a non-letter);
 *  - what follows at once is not sentence punctuation or a hyphen — nobody
 *    writes `\ne.`, `\ni)` or `\nmid-`;
 *  - the position is mathematical: inside `$…$`, or next to maths characters
 *    (for the two-letter `\ne` / `\nu` / `\ni`: maths on both sides).
 * Otherwise it is a newline.
 */
function isLatexN(word: string, ctx: EscapeContext): boolean {
  if (!LATEX_N.has(word)) return false;
  if (/[.):;!?'’-]/.test(ctx.next)) return false;
  if (ctx.inDollarMaths) return true;
  return LATEX_N_AMBIGUOUS.has(word) ? mathsBefore(ctx) && mathsAfter(ctx) : mathsBefore(ctx) || mathsAfter(ctx);
}

function isLatexCommand(esc: string, word: string, ctx: EscapeContext): boolean {
  if (word.length < 2) return false; // a bare \n, \t, \r, \b, \f
  if (esc === 'b' || esc === 'f') return true;
  if (esc === 'n') return isLatexN(word, ctx);
  if (esc === 'r') return LATEX_R.has(word);
  if (esc === 't') return LATEX_T.has(word) || word.startsWith('text');
  return false;
}

/**
 * Make the backslashes inside JSON string literals safe to parse:
 *  - an invalid escape (`\s`, `\p`, `\(`, `\,`, `\u` without four hex digits)
 *    has its backslash doubled;
 *  - `\b` / `\f` / `\n` / `\r` / `\t` that start a LaTeX command have their
 *    backslash doubled, so the command is kept as text;
 *  - a raw control character (a literal newline inside a string) is escaped.
 * Real `\n`, `\"`, `\\`, `\uXXXX` are untouched, so valid JSON without LaTeX
 * comes back byte-for-byte. Text outside string literals is never changed.
 */
export function repairJsonStringEscapes(json: string): string {
  let out = '';
  let inString = false;
  let stringStart = 0; // index of the first character of the current string
  let dollars = 0; // unescaped `$` seen so far in the current string
  for (let i = 0; i < json.length; i++) {
    const c = json[i];
    if (!inString) {
      out += c;
      if (c === '"') { inString = true; stringStart = i + 1; dollars = 0; }
      continue;
    }
    if (c === '$') dollars++;
    if (c === '"') { out += c; inString = false; continue; }
    if (c === '\n') { out += '\\n'; continue; }
    if (c === '\r') { out += '\\r'; continue; }
    if (c === '\t') { out += '\\t'; continue; }
    if (c < ' ') { out += `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`; continue; }
    if (c !== '\\') { out += c; continue; }
    const n = json[i + 1];
    if (n === undefined) { out += '\\\\'; continue; }
    if (n === '"' || n === '\\' || n === '/') { out += c + n; i++; continue; }
    if (n === 'u') {
      if (/^[0-9a-fA-F]{4}$/.test(json.slice(i + 2, i + 6))) { out += json.slice(i, i + 6); i += 5; }
      else out += '\\\\';
      continue;
    }
    if (n === 'b' || n === 'f' || n === 'n' || n === 'r' || n === 't') {
      const word = /^[A-Za-z]+/.exec(json.slice(i + 1))?.[0] ?? n;
      if (isLatexCommand(n, word, escapeContext(json, i, word.length, stringStart, dollars))) out += '\\\\'; // the letters follow as plain text
      else { out += c + n; i++; }
      continue;
    }
    if (n === '$') { out += '\\\\$'; i++; continue; } // an escaped dollar is text, not a maths delimiter
    out += '\\\\'; // not a JSON escape at all
  }
  return out;
}

/** The surroundings of the backslash at `at` (see `EscapeContext`). */
function escapeContext(json: string, at: number, wordLength: number, stringStart: number, dollars: number): EscapeContext {
  let b = at - 1;
  while (b >= stringStart && (json[b] === ' ' || json[b] === ',')) b--;
  let before = b >= stringStart ? json[b] : '';
  let beforePrev = b - 1 >= stringStart ? json[b - 1] : '';
  // The word before it is itself a LaTeX command ("\\theta, \\nu"): maths.
  if (isLetter(before)) {
    let w = b;
    while (w >= stringStart && isLetter(json[w])) w--;
    if (w >= stringStart && json[w] === '\\') { before = '\\'; beforePrev = ''; }
  }
  const end = at + 1 + wordLength; // first character after the command's letters
  const closes = (c: string | undefined) => c === undefined || c === '"';
  const next = closes(json[end]) ? '' : json[end];
  let a = end;
  while (json[a] === ' ' || json[a] === ',') a++;
  const after = closes(json[a]) ? '' : json[a];
  const afterNext = after && !closes(json[a + 1]) ? json[a + 1] : '';
  return { inDollarMaths: dollars % 2 === 1, before, beforePrev, next, after, afterNext };
}

/** End index (inclusive) of the balanced `{…}` that opens at `start`, or -1. */
function balancedEnd(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === '\\') i++;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return i;
  }
  return -1;
}

/**
 * Every JSON object in a model reply, in order of appearance (outermost only
 * — an object nested in another is part of its parent). Tolerates code
 * fences, prose before / between / after the objects, braces in that prose,
 * and LaTeX backslashes inside strings (`repairJsonStringEscapes`). Returns
 * `[]` when the reply holds no parseable object (prose only, an array, or a
 * reply cut off at the token cap).
 */
export function parseJsonObjects(raw: string): Record<string, unknown>[] {
  return parseJsonObjectsWithSource(raw).map((o) => o.value);
}

/** `parseJsonObjects`, each object with the reply text it was read from. */
export function parseJsonObjectsWithSource(raw: string): Array<{ value: Record<string, unknown>; source: string }> {
  const text = (raw ?? '').replace(/```(?:json)?/gi, '');
  const found: Array<{ value: Record<string, unknown>; source: string }> = [];
  let from = 0;
  for (let start = text.indexOf('{', from); start !== -1; start = text.indexOf('{', from)) {
    from = start + 1;
    const end = balancedEnd(text, start);
    if (end < 0) continue;
    try {
      const v: unknown = JSON.parse(repairJsonStringEscapes(text.slice(start, end + 1)));
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        found.push({ value: v as Record<string, unknown>, source: text.slice(start, end + 1) });
        from = end + 1;
      }
    } catch { /* not JSON — try the next `{` */ }
  }
  return found;
}

/** The start of a model reply as ONE quoted line, for a log entry. */
export function replyHead(raw: string, max = 300): string {
  return JSON.stringify((raw ?? '').replace(/\s+/g, ' ').trim().slice(0, max));
}
