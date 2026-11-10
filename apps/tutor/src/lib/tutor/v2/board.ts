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

const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();

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
  for (let p = 0; p < board.pages.length; p++) {
    if (board.pages[p].items.some((it) => it.tool === name && norm(it.summary) === norm(summary))) {
      return { painted: false, detail: `already on the board (page ${p + 1})` };
    }
  }
  board.pages[board.current].items.push({ id, tool: name, summary });
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
