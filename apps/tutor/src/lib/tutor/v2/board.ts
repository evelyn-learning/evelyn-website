/**
 * Tutor brain v2 — the board as the runtime knows it.
 *
 * A plain record of pages and what is on them, kept from the outcome of each
 * tool call. In the browser the outcome comes from the real whiteboard; in the
 * offline harness `applyToModelBoard` stands in for it. Either way the model
 * is told what painted, and the record is what the facts block reports.
 */
import { solveDiagram } from '../diagrams/catalog/manifest';
import type { V2Board, V2BoardOutcome } from './types';

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** A one-line description of what a board tool call shows. */

export function summariseBoardCall(name: string, args: Record<string, unknown>): string {
  const problem = (args.problem ?? {}) as Record<string, unknown>;
  const parts = [text(args.title), text(problem.title), text(args.label), text(problem.statement), text(args.statement), text(args.problem), text(args.latex), text(args.text), text(args.expression), text(args.concept), text(args.code)]
    .filter(Boolean);
  const fns = Array.isArray(args.functions) ? (args.functions as Array<Record<string, unknown>>).map((f) => text(f.expression) || text(f.latex)).filter(Boolean).join(', ') : '';
  // Tables, timelines and organisers: their cells, in reading order.
  const flat = (v: unknown): string[] => (Array.isArray(v) ? v.flatMap(flat) : v && typeof v === 'object' ? Object.values(v as Record<string, unknown>).flatMap(flat) : typeof v === 'string' && v.trim() ? [v.trim()] : []);
  const structured = [args.params, args.leftHeader, args.rightHeader, args.headers, args.rows, args.events, args.leftItems, args.rightItems, args.steps, args.source, args.object, args.forces, args.functions, Array.isArray(args.points) ? (args.points as Array<Record<string, unknown>>).map((p) => String(p.label ?? p.value ?? '')) : []].flatMap(flat).join(' · ');
  // A catalogue figure is its numbers as much as its words: two solids of revolution with different profiles
  // summarised alike, and the second was refused as already on the board (embed-1794446765164).
  const figure = name === 'show_diagram' ? JSON.stringify(args.params ?? {}).replace(/["{}]/g, '').slice(0, 160) : '';
  const body = [[...new Set(parts)].join(' — '), fns, structured, figure].filter(Boolean).join(' — ') || '(no text)';
  return body.length > 300 ? `${body.slice(0, 297)}…` : body;
}

/** A problem card states the task. Sentences after it that tell the student how to begin ("Rewrite it as one
 *  fraction, then check the form.") take the first step away from them, and the model adds them however it
 *  is asked not to (embed-1794345628228). They are cut from the card: a sentence after the first that opens
 *  with a method verb, outside any maths span. Parts "(a) … (b) …" are tasks and stay. */
const METHOD_LEAD = /^(?:(?:first|start|begin|then|next|now|remember|hint|note|tip)\b[\s,:]*)*(?:rewrite|convert|combine|check|verify|confirm|identify|name|let|take|use|apply|try|recall|think|consider|notice|substitute|plug|factor|rationali[sz]e|simplify|set|write|express|multiply|divide|differentiate|start|begin|remember|hint|note|this (?:is|starts|gives|has)|direct substitution|it (?:is|starts|gives)|you(?:'ll| will| may| can| need| should))\b/i;
const TASK_LEAD = /^(?:find|solve|evaluate|compute|calculate|classify|determine|give|state|explain|show|prove|sketch|graph|draw|work out|decide|say|tell|describe|compare|list|complete|fill|estimate|predict|build|construct|match)\b/i;
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
  // A method sentence is cut only once the card has stated its task. "A parabola has focus (0, 1) and directrix
  // y = −1. Write its equation." lost its second sentence, and the card asked nothing (embed-1794374818774).
  let asked = false;
  parts.forEach((s, i) => {
    const t = s.trim();
    const method = i > 0 && !/^\(?[a-e]\)/i.test(t) && !/\?$/.test(t) && !/\byour (?:answer|work|working|reasoning)\b/i.test(t) && METHOD_LEAD.test(t);
    if (method && asked) cut.push(t); else keep.push(s);
    if (/\?$/.test(t) || METHOD_LEAD.test(t) || TASK_LEAD.test(t)) asked = true;
  });
  return keep.join('').trim() ? { statement: keep.join('').trim(), cut } : { statement, cut: [] };
}

/** Ordinary words typed straight into LaTeX are set as a run of italic variables with no spaces: "and at x = 3"
 *  appeared on the board as "andatx = 3" (embed-1794361050464). They are wrapped in \text{}. */
const PLAIN_WORDS = 'and|at|so|then|gives|give|when|if|for|the|is|are|or|to|of|with|which|because|since|that|we|get|you|becomes|means|where|from|into|but|not|both|each|by|on|in|as|now|after|before|times|plus|minus|equals|over|per|total|answer|check|left|right|east|west|north|south|toward|away|net|force';
/** \\mathrm{…} is roman type for symbols and drops the spaces between words: "(usable by plants)" came out
 *  "(usablebyplants)" (embed-1794376956230). Words inside it get their spaces back. */
export function spacedRoman(latex: string): string {
  return latex.replace(/\\mathrm\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_m, body: string) => `\\mathrm{${body.replace(/(?<=[A-Za-z,)])[ ]+(?=[A-Za-z(])/g, '\\ ')}}`);
}
export function wordsAsText(latex: string): string {
  const re = new RegExp(String.raw`(?<![\\A-Za-z])(?:${PLAIN_WORDS})(?![A-Za-z])(?:\s+(?:${PLAIN_WORDS})(?![A-Za-z]))*`, 'gi');
  // Leave what is already inside \text{…} (and its relatives) alone.
  return latex.split(/(\\(?:text|textrm|textbf|textit|mathrm|operatorname)\s*\{[^{}]*\})/).map((part, i) => (i % 2 ? part : part.replace(re, (w) => `\\text{ ${w} }`))).join('');
}

/** Why a board call would not sit well on the board, or null. An equation card is one centred line of
 *  KaTeX: sentences inside \text{} and long unbroken lines run off its edge and are clipped (the
 *  "Hypotheses: f, g differentiable near a…" card, embed-1794336536781). */
export function boardMisfit(name: string, args: Record<string, unknown>): string | null {
  // A figure with nothing in it is worse than no figure (an empty graph grid titled "Tug-of-war" opened a
  // forces lesson, embed-1794363148240).
  const count = (v: unknown) => (Array.isArray(v) ? v.length : 0);
  if (name === 'show_function_graph' && count(args.functions) + count(args.functionsOfY) + count(args.points) + count(args.segments) === 0) return 'a graph needs at least one function or point to plot; for anything else use the form that fits it';
  if (name === 'show_free_body_diagram' && count(args.forces) === 0) return 'a forces diagram needs at least one force: name | direction | size';
  // A figure tool called with nothing in it paints an empty frame (an empty Venn diagram opened a statistics
  // lesson, browser run 2026-11-11).
  if (/^show_/.test(name) && Object.keys(args).filter((k) => k !== 'title').length === 0) return 'it was given nothing to draw';
  // A catalogue figure is drawn from its parameters by a solver; one it cannot solve would paint an error card.
  if (name === 'show_diagram' && args.type !== 'hierarchy_pyramid') {
    const params = (args.params ?? {}) as Record<string, unknown>;
    if (typeof params.unreadable === 'string') return 'the figure\'s parameters must be one JSON object';
    try { solveDiagram(String(args.type ?? ''), params); } catch (err) { return `the figure could not be drawn: ${err instanceof Error ? err.message : String(err)}`.slice(0, 220); }
  }
  if (name === 'show_diagram' && args.type === 'hierarchy_pyramid' && count((args.params as Record<string, unknown> | undefined)?.tiers) < 2) return 'ranks need at least two levels, one per line from the top down';
  if (name === 'show_venn_diagram' && count(args.sets) < 2) return 'a Venn diagram needs its two or three sets';
  if (name === 'show_stats' && (args.type === 'bar' ? count((args.bar as Record<string, unknown> | undefined)?.categories) === 0 : (args.type === 'dotplot' || args.type === 'histogram') && count(args.data) < 2 && count(args.bins) < 1)) return 'a chart needs its data: the values separated by commas, or for a bar chart one bar per line, name | value';
  if (name === 'show_number_line' && count(args.points) + count(args.intervals) + count(args.segments) === 0) return 'a number line needs at least one point or interval';
  if ((name === 'show_table' && count(args.rows) === 0) || (name === 'show_timeline' && count(args.events) === 0)) return 'it has no rows: write one per line, cells separated by |';
  // A sequence, timeline or cycle of one thing is a sentence in a box (a one-step "sequence" appeared in an
  // AP US History lesson, embed-1794376295543).
  const spec = (args.spec ?? args) as Record<string, unknown>;
  if (name === 'show_graphic_organizer' && spec.kind === 'sequence' && count(spec.steps) < 2) return 'steps need at least two, one per line; a single point is a note';
  if (name === 'show_timeline' && count(args.events) < 2) return 'a timeline needs at least two dated events; a single date is a note';
  if (name === 'show_cycle_diagram' && count(args.stages) < 3) return 'a cycle needs at least three stages, one per line';
  if (name === 'show_concept_map' && count(args.edges) < 2) return 'a web needs at least two links, one per line: from | how | to';
  if (name === 'show_map' && count(args.pins) === 0) return 'a map needs at least one place: name | latitude | longitude';
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

const FIGURE_FORMS = new Set(['show_cycle_diagram', 'show_concept_map', 'show_map', 'show_table', 'show_timeline', 'show_graphic_organizer', 'show_function_graph', 'show_free_body_diagram', 'show_number_line']);
/** Apply a board tool call to the record. Mutates `board`. */
export function applyToModelBoard(board: V2Board, id: string, name: string, args: Record<string, unknown>): V2BoardOutcome {
  if (name === 'new_page') {
    // The page just opened, asked for again (a follow-up reply repeated its heading): stay on it.
    const here = board.pages[board.current];
    if (here && norm(here.title) === norm(text(args.title)) && here.items.length < 3) return { painted: false, detail: `already on the page "${here.title}"` };
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
    // The same thing in another form is not a repeat: a cycle drawn from stages already listed as steps was
    // refused, and the tutor said "here is the loop" over nothing (browser run, 2026-11-11).
    const items = board.pages[p].items;
    const at = items.findIndex((it) => { if (FIGURE_FORMS.has(name) && it.tool !== name) return false; const have = it.core ?? norm(it.summary); return have === core || (core.length >= 12 && have.includes(core)) || (have.length >= 24 && core.includes(have) && core.length < have.length * 1.15); });
    if (at < 0) continue;
    // A problem the student is sent back to must be where they can see it. One set many items ago, or on
    // another page, is put up again: "try the problem already on your board" pointed at a card twenty items
    // up the page (AP Calc BC, embed-1794446765164). The old copy leaves the record; the new one is the card.
    if (name === 'show_problem' && items[at].tool === 'show_problem' && p !== board.current) { items.splice(at, 1); break; }
    // On the page in view, writing a thing again points at it: the board scrolls back to it.
    return { painted: false, detail: `already on the board (page ${p + 1})`, ...(p === board.current ? { pointAt: items[at].id } : {}) };
  }
  board.pages[board.current].items.push({ id, tool: name, summary, core, ...(name === 'show_function_graph' ? { args: { functions: args.functions, points: args.points, segments: args.segments, xRange: args.xRange, yRange: args.yRange, title: args.title } } : {}) });
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
