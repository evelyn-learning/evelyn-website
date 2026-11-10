/**
 * Tutor brain v2 — the board as the runtime knows it.
 *
 * A plain record of pages and what is on them, kept from the outcome of each
 * tool call. In the browser the outcome comes from the real whiteboard; in the
 * offline harness `applyToModelBoard` stands in for it. Either way the model
 * is told what painted, and the record is what the facts block reports.
 */
import type { V2Board, V2BoardOutcome } from './types';

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** A one-line description of what a board tool call shows. */
export function summariseBoardCall(name: string, args: Record<string, unknown>): string {
  const problem = (args.problem ?? {}) as Record<string, unknown>;
  const parts = [text(args.title), text(problem.title), text(args.label), text(problem.statement), text(args.statement), text(args.problem), text(args.latex), text(args.text), text(args.expression)]
    .filter(Boolean);
  const fns = Array.isArray(args.functions) ? (args.functions as Array<Record<string, unknown>>).map((f) => text(f.expression) || text(f.latex)).filter(Boolean).join(', ') : '';
  const body = [...new Set(parts)].join(' — ') || fns || '(no text)';
  return body.length > 300 ? `${body.slice(0, 297)}…` : body;
}

/** A problem card states the task. Sentences after it that tell the student how to begin ("Rewrite it as one
 *  fraction, then check the form.") take the first step away from them, and the model adds them however it
 *  is asked not to (embed-1794345628228). They are cut from the card: a sentence after the first that opens
 *  with a method verb, outside any maths span. Parts "(a) … (b) …" are tasks and stay. */
const METHOD_LEAD = /^(?:(?:first|start|begin|then|next|now|remember|hint|note|tip)\b[\s,:]*)*(?:rewrite|convert|combine|check|verify|confirm|identify|name|let|take|use|apply|try|recall|think|consider|notice|substitute|plug|factor|rationali[sz]e|simplify|set|write|express|multiply|divide|differentiate|start|begin|remember|hint|note|this (?:is|starts|gives|has)|direct substitution|it (?:is|starts|gives)|you(?:'ll| will| may| can| need| should))\b/i;
export function taskOnly(statement: string): { statement: string; cut: string[] } {
  // Split into sentences without breaking $…$ spans.
  const parts: string[] = []; let cur = ''; let inMath = false;
  for (let i = 0; i < statement.length; i++) {
    const ch = statement[i]; cur += ch;
    if (ch === '$') inMath = !inMath;
    if (!inMath && /[.!?]/.test(ch) && (i + 1 >= statement.length || /\s/.test(statement[i + 1]))) { parts.push(cur); cur = ''; }
  }
  if (cur.trim()) parts.push(cur);
  const keep: string[] = []; const cut: string[] = [];
  parts.forEach((s, i) => { const t = s.trim(); if (i > 0 && !/^\(?[a-e]\)/i.test(t) && !/\?$/.test(t) && !/\byour (?:answer|work|working|reasoning)\b/i.test(t) && METHOD_LEAD.test(t)) cut.push(t); else keep.push(s); });
  return keep.join('').trim() ? { statement: keep.join('').trim(), cut } : { statement, cut: [] };
}

/** Why a board call would not sit well on the board, or null. An equation card is one centred line of
 *  KaTeX: sentences inside \text{} and long unbroken lines run off its edge and are clipped (the
 *  "Hypotheses: f, g differentiable near a…" card, embed-1794336536781). */
export function boardMisfit(name: string, args: Record<string, unknown>): string | null {
  if (name !== 'show_equation') return null;
  const latex = text(args.latex);
  const words = [...latex.matchAll(/\\text(?:rm|bf|it)?\{([^}]*)\}/g)].flatMap((m) => m[1].split(/\s+/).filter((w) => /\p{L}{2,}/u.test(w)));
  if (words.length > 6) return 'that is a sentence, not an equation: put the words in a note (annotate, with the mathematics between dollar signs) and keep show_equation for the mathematics alone';
  const longest = Math.max(...latex.split(/\\\\/).map((line) => line.replace(/\\[a-zA-Z]+|[{}\s&]/g, '').length));
  if (longest > 70) return 'too wide for one line of the board: break it into steps, one per line, in an aligned environment';
  return null;
}

const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();

/** What an item shows, without its label or title, with LaTeX spacing and delimiters ignored. */
function boardCore(args: Record<string, unknown>): string {
  const problem = (args.problem ?? {}) as Record<string, unknown>;
  const body = text(args.latex) || text(args.text) || text(problem.statement) || text(args.statement);
  return norm(body.replace(/\\[,;!: ]|\\(?:left|right|displaystyle|,)|[$]/g, ''));
}

/** Apply a board tool call to the record. Mutates `board`. */
export function applyToModelBoard(board: V2Board, id: string, name: string, args: Record<string, unknown>): V2BoardOutcome {
  if (name === 'new_page') {
    board.pages.push({ title: text(args.title) || `Page ${board.pages.length + 1}`, items: [] });
    board.current = board.pages.length - 1;
    return { painted: true, detail: `new page ${board.current + 1} "${board.pages[board.current].title}"` };
  }
  if (name === 'go_to_page') {
    const want = typeof args.pageIndex === 'number' ? args.pageIndex : board.pages.findIndex((p) => norm(p.title) === norm(text(args.title) || text(args.pageTitle)));
    if (want < 0 || want >= board.pages.length) return { painted: false, detail: 'no such page' };
    board.current = want;
    return { painted: true, detail: `now on page ${want + 1} "${board.pages[want].title}"` };
  }
  if (board.current < 0) { board.pages.push({ title: 'Page 1', items: [] }); board.current = 0; }
  if (name === 'highlight') return { painted: true, detail: 'highlighted' };
  const summary = summariseBoardCall(name, args);
  // The same content under another label, or as part of something already up, is the same item: the board
  // showed one line twice, once bare and once titled "final" (embed-1794345628228).
  const core = boardCore(args) || norm(summary);
  for (let p = 0; p < board.pages.length; p++) {
    if (board.pages[p].items.some((it) => { const have = it.core ?? norm(it.summary); return have === core || (core.length >= 12 && have.includes(core)) || (have.length >= 24 && core.includes(have) && core.length < have.length * 1.15); })) {
      return { painted: false, detail: `already on the board (page ${p + 1})` };
    }
  }
  board.pages[board.current].items.push({ id, tool: name, summary, core });
  return { painted: true, detail: `painted on page ${board.current + 1}` };
}

/** The board, for the facts block: the current page in full, earlier pages by title and item count. */
export function renderBoard(board: V2Board): string {
  if (!board.pages.length) return 'empty';
  return board.pages.map((p, i) => {
    const head = `page ${i + 1} "${p.title}"${i === board.current ? ' (in view)' : ''}`;
    if (i !== board.current && i !== board.current - 1) return `${head}: ${p.items.length} item(s)`;
    return `${head}: ${p.items.length ? p.items.map((it) => `${it.tool.replace(/^show_|^tutor_/, '')} "${it.summary}"`).join('; ') : 'blank'}`;
  }).join('\n  ');
}
