/**
 * Equation reflow splitter (round-7 item 7 — IMG_7874/7875).
 *
 * EquationRenderer used to fit long equations with `transform: scale()`
 * down to a 0.32 floor — readable equations everywhere else on the board,
 * postage-stamp equations in the equation card. The renderer now REFLOWS:
 * when a rendered equation overflows its container, it re-renders the
 * LaTeX split across lines — the way a person would wrap it on a real
 * whiteboard — and only falls back to horizontal scroll when there is no
 * safe place to break.
 *
 * Split preference order:
 *   1. top-level relations (=, <, >, \le, \approx, …) — one aligned
 *      column, continuation lines lead with the relation;
 *   2. top-level binary +/- inside an over-budget run — continuation
 *      lines lead with `{}+` (the `{}` keeps the operator binary-spaced);
 * "top-level" = outside braces and outside \left…\right groups, so
 * relations inside \frac{…}{…} or parenthesized asides never split.
 *
 * Pure string→string; measured calibration (how many LaTeX chars fit the
 * container) is the caller's job. Returns null when splitting is
 * impossible or pointless: content already fits, an environment or
 * explicit `\\` is present (the aligned auto-wrap owns those), or no
 * top-level split point exists.
 */

const RELATION_COMMANDS = new Set([
  'le', 'leq', 'ge', 'geq', 'approx', 'ne', 'neq', 'sim', 'simeq', 'equiv',
  'propto', 'cong', 'll', 'gg', 'to', 'rightarrow', 'longrightarrow',
  'Rightarrow', 'Longrightarrow', 'implies', 'iff', 'mapsto',
]);

/** Binary infix commands a following +/- would be unary after. */
const OPERATOR_COMMANDS = new Set(['times', 'cdot', 'div', 'pm', 'mp']);

interface SplitPoint {
  index: number;
  /** The relation/operator token as written (e.g. '=', '\\leq', '+'). */
  token: string;
  kind: 'rel' | 'op';
}

function findTopLevelPoints(s: string): SplitPoint[] {
  const points: SplitPoint[] = [];
  let brace = 0;
  let leftRight = 0;
  let prev = ''; // last meaningful token: a single char or a '\command'
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '\\') {
      const m = /^\\([a-zA-Z]+)/.exec(s.slice(i));
      if (m) {
        const name = m[1];
        if (name === 'left') leftRight++;
        else if (name === 'right') leftRight--;
        else if (brace === 0 && leftRight === 0 && i > 0 && RELATION_COMMANDS.has(name)) {
          points.push({ index: i, token: `\\${name}`, kind: 'rel' });
        }
        prev = `\\${name}`;
        i += m[0].length;
        continue;
      }
      prev = s.slice(i, i + 2); // escaped char (\{, \%, …)
      i += 2;
      continue;
    }
    if (ch === '{') { brace++; prev = ch; i++; continue; }
    if (ch === '}') { brace--; prev = ch; i++; continue; }
    if (brace === 0 && leftRight === 0) {
      if (ch === '=' || ch === '<' || ch === '>') {
        if (i > 0) points.push({ index: i, token: ch, kind: 'rel' });
      } else if (ch === '+' || ch === '-') {
        // Binary only: something completes an operand right before it.
        const prevIsCommand = prev.startsWith('\\') && /^\\[a-zA-Z]+$/.test(prev);
        const binary = prevIsCommand
          ? !RELATION_COMMANDS.has(prev.slice(1)) && !OPERATOR_COMMANDS.has(prev.slice(1))
          : /[a-zA-Z0-9)\]}!'.]/.test(prev);
        if (binary) points.push({ index: i, token: ch, kind: 'op' });
      }
    }
    if (!/\s/.test(ch)) prev = ch;
    i++;
  }
  return points;
}

interface Segment {
  /** Leading token this segment attaches with ('' for the first). */
  joiner: string;
  text: string;
}

/** Rough visible width: raw chars, but a \command relation counts as 1. */
function segLen(seg: Segment): number {
  const joinerLen = seg.joiner === '' ? 0 : seg.joiner.startsWith('\\') ? 1 : seg.joiner.length;
  return joinerLen + seg.text.length + (seg.joiner ? 1 : 0);
}

function cutAtPoints(s: string, points: SplitPoint[]): Segment[] {
  const segments: Segment[] = [];
  let joiner = '';
  let from = 0;
  for (const p of points) {
    segments.push({ joiner, text: s.slice(from, p.index).trim() });
    joiner = p.token;
    from = p.index + p.token.length;
  }
  segments.push({ joiner, text: s.slice(from).trim() });
  return segments.filter((seg) => seg.joiner !== '' || seg.text !== '');
}

/** Greedy-pack segments into lines of ≤ budget (first line's segment may
 *  exceed it alone — there is nothing smaller to do with it). */
function pack(segments: Segment[], budget: number): Segment[][] {
  const lines: Segment[][] = [];
  let line: Segment[] = [];
  let len = 0;
  for (const seg of segments) {
    const l = segLen(seg);
    if (line.length > 0 && len + l > budget) {
      lines.push(line);
      line = [];
      len = 0;
    }
    line.push(seg);
    len += l;
  }
  if (line.length) lines.push(line);
  return lines;
}

function lineText(line: Segment[]): string {
  return line
    .map((seg, i) => (i === 0 && seg.joiner === '' ? seg.text : `${seg.joiner} ${seg.text}`.trim()))
    .join(' ')
    .trim();
}

/**
 * Layouts:
 *  - 'columns' (default): rows align on the first top-level relation —
 *    the classic "a &= b" look. Rendered width is (widest LHS)+(widest
 *    RHS), so on a narrow pane continuation rows can start past the
 *    right edge (IMG_7893/7894: clipped continuations).
 *  - 'left': every row starts at a common left margin; continuation rows
 *    get a \quad indent and lead with their joiner ({}-prefixed so the
 *    relation/operator keeps binary spacing). Rendered width is
 *    max(single row) — the renderer's fallback when the columns layout
 *    still overflows.
 */
export type SplitLayout = 'columns' | 'left';

export function splitLatexToLines(latex: string, budget: number, layout: SplitLayout = 'columns'): string | null {
  const s = latex.trim();
  const b = Math.max(4, Math.floor(budget));
  if (s.length <= b) return null;
  // Environments and explicit breaks are handled by the renderer's
  // existing aligned auto-wrap — never restructure those.
  if (/\\begin\{/.test(s) || /\\\\/.test(s)) return null;

  const points = findTopLevelPoints(s);
  if (points.length === 0) return null;

  const relPoints = points.filter((p) => p.kind === 'rel');
  const usingRelations = relPoints.length > 0;
  const primary = usingRelations ? relPoints : points;

  const lines = pack(cutAtPoints(s, primary), b);

  // Sub-split any over-budget line at its own top-level +/- points.
  type OutLine = { text: string; lead: 'first' | 'rel' | 'op' };
  const out: OutLine[] = [];
  lines.forEach((line, lineIdx) => {
    const joined = lineText(line);
    const lead: OutLine['lead'] = lineIdx === 0 ? 'first' : usingRelations ? 'rel' : 'op';
    if (joined.length <= b) {
      out.push({ text: joined, lead });
      return;
    }
    const opPoints = findTopLevelPoints(joined).filter((p) => p.kind === 'op');
    if (opPoints.length === 0) {
      out.push({ text: joined, lead });
      return;
    }
    const pieces = pack(cutAtPoints(joined, opPoints), b);
    pieces.forEach((piece, pieceIdx) => {
      out.push({
        text: lineText(piece),
        lead: pieceIdx === 0 ? lead : 'op',
      });
    });
  });

  if (out.length < 2) return null;

  if (usingRelations && layout === 'left') {
    const rows = out.map((line, i) => {
      if (i === 0) return `&${line.text}`;
      // Reattach the row's leading relation/operator, which cutAtPoints
      // stored as the first segment's joiner and lineText re-emits at the
      // head of the row text. `{}` restores binary/relation spacing at
      // the start of a line; `\quad` is the continuation indent.
      return `&\\quad {}${line.text}`;
    });
    return `\\begin{aligned}${rows.join(' \\\\ ')}\\end{aligned}`;
  }

  if (usingRelations) {
    const rows = out.map((line, i) => {
      if (i === 0) {
        // Align the first row on its first top-level relation when it has
        // one ("a &= b"); otherwise it right-aligns into the relation
        // column, which reads correctly above "&= …" continuations.
        const rel = findTopLevelPoints(line.text).find((p) => p.kind === 'rel');
        if (!rel) return line.text;
        return `${line.text.slice(0, rel.index).trimEnd()} &${line.text.slice(rel.index)}`;
      }
      if (line.lead === 'op') {
        // Continuation of an over-budget run: indent past the relation
        // column; `{}` keeps the leading +/- binary-spaced.
        return `&\\quad {}${line.text}`;
      }
      return `&${line.text}`;
    });
    return `\\begin{aligned}${rows.join(' \\\\ ')}\\end{aligned}`;
  }

  const rows = out.map((line, i) => (i === 0 ? line.text : `{}${line.text}`));
  return `\\begin{gathered}${rows.join(' \\\\ ')}\\end{gathered}`;
}
