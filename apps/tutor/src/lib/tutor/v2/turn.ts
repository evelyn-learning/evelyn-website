/**
 * Tutor brain v2 — one turn (design §4.2).
 *
 * What the model is sent:
 *   system   the constitution (shared by every session) + the session part
 *            (student, mode, time box, the plan as a map)
 *   tools    a few board tools for the subject + three control tools
 *   messages the real history — the tutor's words, its tool calls and what
 *            each one did — then the student's words, then one facts block
 *
 * There are no instruction blocks, no notes planted in the student's words and
 * no checks that cut a reply after the fact. The model thinks before it speaks
 * (adaptive thinking, in voice as in text); thinking is never stored.
 *
 * The model call and the board are injectable, so the unit suite runs without
 * a network and the offline harness runs without a browser.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { getModelClient } from '../ai/model-registry';
import { validateToolCall } from '../whiteboard/validate-tool-call';
import { catalogueSubjects, figureCatalogueFor, tutorFigureLines } from './figure-catalogue';
import { applyToModelBoard, boardMisfit, renderBoard, summariseBoardCall, taskOnly, spacedRoman, wordsAsText } from './board';
import { BoardInlineStream, boardBlocksIn, inlineToolCall, insertBlock, stripBoardBlocks, type InlineBlock, type InlinePart } from './board-inline';
import { speaksMaths, unwrittenEquations } from './spoken-maths';
import { saidCovers, unsaidAsk, asksAnywhere } from './board-timing';
import { V2_CONSTITUTION, v2ModeLines } from './constitution';
import { renderFacts, V2_NO_ASK_RECHECK_S, V2_WAITED_RECHECK_S, type V2TurnFacts } from './facts';
import { planGoalIds, renderPlanMap } from './plan-map';
import { stripToolTalk } from './tool-talk';
import { leftOpen, mayOpenPart, namesPart, partOffer } from './part-close';
import { heardAsWords } from './heard';
import { SAY_WITH, V2_CONTROL_TOOL_NAMES, v2Tools } from './tools';
import type { GapStatus, GoalStatus, V2Board, V2BoardOutcome, V2Session, V2State, V2ToolCall, V2TurnResult } from './types';

/** A spoken reply of at least this many words that wrote nothing is put to the board check. */
export const V2_UNWRITTEN_WORDS = 30;
/** Board calls that draw a figure, as opposed to writing words or mathematics. */
/** How a reply that asked nothing hands the turn to the student. Rotated, so it is not one phrase every time. */
export const V2_CHECK_INS = ['Does that make sense so far?', 'Are you with me so far?', 'Is that clear, or shall I go over it again?', 'Does that make sense?'];
const V2_FIGURE_TOOL_NAMES = new Set(['show_free_body_diagram', 'show_number_line', 'show_function_graph', 'show_table', 'show_timeline', 'show_graphic_organizer', 'show_geometry', 'show_venn_diagram', 'show_tree', 'show_stats', 'show_lewis_constructed', 'show_cycle_diagram', 'show_concept_map', 'show_map', 'show_diagram', 'show_sketch', 'show_circuit']);
export const V2_MAX_MODEL_CALLS = 5;
export const V2_MAX_TOKENS = 8000;
export const V2_NOTE_MAX_CHARS = 1500;
export const V2_MAX_GAPS = 12;
/** Thinking effort. Medium, not low: in blind reviews (2026-11-09, two reviewers, two weaker-student
 *  fixtures) medium scored 5.2 and 7.5 against 3.0 and 4.7 for low — low is where the wrong verdicts,
 *  the narration and the answers handed over came from. It costs about half a second more before the
 *  first words. TUTOR_V2_EFFORT overrides it on the server. */
export const V2_DEFAULT_EFFORT: 'low' | 'medium' | 'high' =
  process.env.TUTOR_V2_EFFORT === 'low' || process.env.TUTOR_V2_EFFORT === 'high' ? process.env.TUTOR_V2_EFFORT : 'medium';
const GAP_STATUSES: GapStatus[] = ['found', 'explained', 'done_with_help', 'done_alone'];
const CACHE = { type: 'ephemeral' as const, ttl: '1h' as const };

/** The maths check's question (see runV2Turn). Narrow on purpose: asked to judge the whole reply it "corrected"
 *  sound verdicts and informal wording; asked only for a slip of calculation it does not. */
export const V2_MATHS_CHECK = `[check — from the system running the session, not from the student]\nYou have just said the reply above aloud. Look only for a slip of calculation in it: an operation you named ("dividing by", "multiplying by", "adding") or a value you gave that, carried out on what is on the board, does not give what you said. A point, value or label on a figure you drew with this reply counts too, when it is false for the thing it is drawn on (a point marked as on a curve that it is not on). A statement that is true on any ordinary reading stands: counting both ends of a range, rounding, or a different but equal form is not a slip. Be certain before you correct. Nothing else is in question: not your verdict on the student's answer, not which shape or case something is, not loose or informal wording, not anything you left unsaid. If there is such a slip, write "correction:" and one short sentence of at most twenty words, as you would say it aloud straight after, naming only the right operation or value. Otherwise write "maths: ok". Write only that one line.`;

export type V2ModelCall = (params: Anthropic.MessageCreateParamsNonStreaming, onText?: (delta: string) => void, signal?: AbortSignal) => Promise<Anthropic.Message>;
export type V2BoardPort = (board: V2Board, id: string, name: string, args: Record<string, unknown>) => V2BoardOutcome;

export interface V2TurnInput {
  session: V2Session;
  state: V2State;
  /** The student's words. `null` when the tutor speaks unprompted: the start of the session, or a silence. */
  studentSaid: string | null;
  facts?: Omit<V2TurnFacts, 'nowMs'>;
  nowMs?: number;
  effort?: 'low' | 'medium' | 'high';
  /** An inline board block has begun; its board call follows when it is complete. */
  onBoardOpen?: () => void;
  /** The board check withdrew an item of this reply (it did the student's step for them). */
  onBoardWithdraw?: (id: string) => void;
  /** The board pass after a spoken reply that says mathematics (default on). */
  boardPass?: boolean;
  /** Run the maths check after a reply that spoke mathematics. Default: on for real model calls, off for a stubbed one. */
  mathsCheck?: boolean;
  callModel?: V2ModelCall;
  applyBoard?: V2BoardPort;
  onText?: (delta: string) => void;
  /** Called as each tool call is settled, in order, before the turn returns. */
  onToolCall?: (call: V2ToolCall) => void;
  /** Cancels the model call: the student talked over the tutor, or the page went away. */
  signal?: AbortSignal;
}

/** What the student's grade asks of the tutor's pace. The constitution says to teach at their level; a grade 7
 *  lesson still moved at a senior's pace, a new kind of problem every reply (Praveen, embed-1794453532197). */
export function v2LevelLine(level: string): string {
  const grade = /^\s*k/i.test(level) ? 0 : Number.parseInt(level, 10);
  if (!Number.isFinite(grade) || grade > 8) return '';
  return grade <= 5
    ? `A child in grade ${grade || 'K'}: one small idea at a time, in short sentences and everyday words. Show a thing with objects or a picture before any symbol, do an example together before asking for one alone, and stay with one kind of problem until it is easy.`
    : `A student in grade ${grade}: go slower than you would with an older student. One new idea per reply, in short sentences and everyday words. Work an example together before they try one alone, and give a second problem of the same kind before moving to a new kind.`;
}

export function v2SessionPart(session: V2Session): string {
  const lines = [
    'THIS SESSION',
    `Student: ${session.studentName?.trim() || 'name not given'}. Subject: ${session.subject}${session.topic ? ` (${session.topic})` : ''}. Level: ${session.level}.`,
    v2LevelLine(session.level),
    v2ModeLines(session.mode),
    session.timeBoxMinutes ? `The session is meant to last about ${session.timeBoxMinutes} minutes.` : '',
    tutorFigureLines(session),
    session.plan ? `\n${renderPlanMap(session.plan)}` : '\nThere is no lesson plan: teach what the student asks for.',
  ];
  return lines.filter(Boolean).join('\n');
}

/** What goes in the user turn in place of the student's words when they have not spoken. */
export function v2StudentBlock(studentSaid: string | null, state: V2State, silenceSeconds?: number): string {
  if (studentSaid !== null) return studentSaid;
  if (state.history.length === 0) return '[The session has just started. The student has joined and is waiting for you to begin the lesson. Greet them, then tell them what this lesson is about and what it will cover, and ask whether that sounds good. Keep all of it short: three sentences at most, the plan as two or three plain things and not a list of every step. Wait for their answer before teaching.]';
  return silenceSeconds ? '[The student has not replied.]' : '[The student sent nothing.]';
}

const defaultModelCall: V2ModelCall = async (params, onText, signal) => {
  const { client, model } = getModelClient('brain');
  const stream = client.messages.stream({ ...params, model: params.model || model }, signal ? { signal } : undefined);
  if (onText) stream.on('text', (delta) => onText(delta));
  return stream.finalMessage();
};

function withCacheMark(history: Anthropic.MessageParam[]): Anthropic.MessageParam[] {
  if (!history.length) return [];
  const out = history.slice();
  const last = out[out.length - 1];
  const blocks = typeof last.content === 'string' ? [{ type: 'text' as const, text: last.content }] : last.content.map((b) => ({ ...b }));
  const tail = blocks[blocks.length - 1] as { cache_control?: typeof CACHE };
  if (tail) tail.cache_control = CACHE;
  out[out.length - 1] = { role: last.role, content: blocks as Anthropic.ContentBlockParam[] };
  return out;
}

/** What is kept of an assistant message: its words and its tool calls. Thinking is never stored. */
function storable(content: Anthropic.ContentBlock[]): Anthropic.ContentBlockParam[] {
  const out: Anthropic.ContentBlockParam[] = [];
  for (const b of content) {
    if (b.type === 'text' && b.text.trim()) out.push({ type: 'text', text: b.text });
    else if (b.type === 'tool_use') out.push({ type: 'tool_use', id: b.id, name: b.name, input: b.input });
  }
  return out;
}

function applyControlTool(state: V2State, session: V2Session, name: string, args: Record<string, unknown>, nowMs: number): string {
  if (name === 'keep_listening') return 'listening';
  if (name === 'update_session_note') {
    const note = typeof args.note === 'string' ? args.note.trim() : '';
    if (!note) return 'not saved: the note was empty';
    state.note = note.slice(0, V2_NOTE_MAX_CHARS);
    return note.length > V2_NOTE_MAX_CHARS ? `saved, cut to ${V2_NOTE_MAX_CHARS} characters` : 'saved';
  }
  if (name === 'set_goal_status') {
    const goal = typeof args.goal === 'string' ? args.goal.replace(/^\[|\]$/g, '').trim() : '';
    const status = args.status as GoalStatus;
    const known = session.plan ? planGoalIds(session.plan) : [];
    if (!known.includes(goal)) return `not recorded: no goal "${goal}" in the plan (goals: ${known.join(', ') || 'none'})`;
    if (!['shown', 'demonstrated', 'skipped'].includes(status)) return 'not recorded: status must be shown, demonstrated or skipped';
    state.goals[goal] = { status, ...(typeof args.why === 'string' && args.why.trim() ? { why: args.why.trim().slice(0, 120) } : {}) };
    return 'recorded';
  }
  if (name === 'track_gap') {
    const what = typeof args.what === 'string' ? args.what.trim().slice(0, 80) : '';
    const status = args.status as GapStatus;
    if (!what) return 'not recorded: say what the gap is';
    if (!GAP_STATUSES.includes(status)) return `not recorded: status must be one of ${GAP_STATUSES.join(', ')}`;
    const gaps = state.gaps ?? [];
    const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const at = gaps.findIndex((g) => key(g.what) === key(what));
    if (at >= 0) gaps[at] = { what: gaps[at].what, status }; else gaps.push({ what, status });
    state.gaps = gaps.slice(-V2_MAX_GAPS);
    return 'recorded';
  }
  if (name === 'end_lesson') {
    // Ending is the student's decision or the clock's. With time left and no request to stop, the tutor
    // twice closed the lesson by itself after the last planned problem (embed-1794336536781, -1794339843244).
    const left = session.timeBoxMinutes ? session.timeBoxMinutes - (nowMs - state.startedAtMs) / 60000 : 0;
    if (args.because !== 'student_asked' && session.timeBoxMinutes && left > session.timeBoxMinutes * 0.2) {
      return `not ended: about ${Math.round(left)} minutes remain and the student has not asked to stop. Tell them what is open to them now (something harder, more practice, a question of their own, or stopping) and let them choose.`;
    }
    state.closed = true;
    state.closeSummary = typeof args.summary === 'string' ? args.summary.trim().slice(0, 600) : '';
    return 'the session is ending';
  }
  return `unknown tool ${name}`;
}

export async function runV2Turn(given: V2TurnInput): Promise<V2TurnResult> {
  // Spoken words come through a recogniser that writes "this one" as "this 1" (heard.ts).
  const input: V2TurnInput = given.session.mode === 'voice' && given.studentSaid ? { ...given, studentSaid: heardAsWords(given.studentSaid) } : given;
  const { session } = input;
  const nowMs = input.nowMs ?? Date.now();
  const callModel = input.callModel ?? defaultModelCall;
  const applyBoard = input.applyBoard ?? applyToModelBoard;
  // The turn works on a copy: a failed model call leaves the caller's state as it was.
  const state: V2State = structuredClone(input.state);

  /** The first reply of the session: nothing has been said by either side. */
  const opening = !state.history.length && input.studentSaid === null;
  const studentText = v2StudentBlock(input.studentSaid, state, input.facts?.silenceSeconds);
  const facts = renderFacts(session, state, { ...input.facts, nowMs });
  // The student's words come first and carry the cache mark; the facts follow and are
  // never stored, so next turn's request shares this one's prefix up to the words.
  const userNow: Anthropic.MessageParam = {
    role: 'user',
    content: [{ type: 'text', text: studentText, cache_control: CACHE }, { type: 'text', text: facts }],
  };
  const system: Anthropic.TextBlockParam[] = [
    { type: 'text', text: V2_CONSTITUTION, cache_control: CACHE },
    { type: 'text', text: v2SessionPart(session), cache_control: CACHE },
  ];
  const tools = v2Tools(session.subject, session.topic ?? '');
  let messages: Anthropic.MessageParam[] = [...withCacheMark(state.history), userNow];

  const stored: Anthropic.MessageParam[] = [{ role: 'user', content: [{ type: 'text', text: studentText }] }];
  const spoken: string[] = [];
  const toolCalls: V2ToolCall[] = [];
  const usage: V2TurnResult['usage'] = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };
  const t0 = Date.now();
  let firstTextMs: number | null = null;
  let modelCalls = 0;

  const waitingOnTutor = session.mode === 'voice' && input.studentSaid === null && [V2_NO_ASK_RECHECK_S, V2_WAITED_RECHECK_S].includes(Math.round(input.facts?.silenceSeconds ?? 0));
  const mustSpeak = waitingOnTutor || opening;
  /** Run one tool call: validate it, apply it, tell the client, and return its result for the model. */
  const settle = (blockIn: Anthropic.ToolUseBlock, boardOnly = false, inline = false): Anthropic.ToolResultBlockParam => {
    let block = blockIn;
    const { [SAY_WITH]: sayWithRaw, ...args } = (block.input ?? {}) as Record<string, unknown>;
    // A problem card states the task; how-to-begin sentences are cut from it (board.ts taskOnly).
    if (block.name === 'show_problem' && typeof args.statement === 'string') args.statement = taskOnly(args.statement).statement;
    // Dollar signs inside an equation block are a sentence with maths in it, and render as raw red source
    // ("$r^2 = 25$, \\text{ so } $r = 5$", conic sections, 2026-11-11): it goes up as a note, which reads them.
    if (block.name === 'show_equation' && typeof args.latex === 'string' && /\$[^$]+\$/.test(args.latex)) {
      block = { ...block, name: 'annotate' } as Anthropic.ToolUseBlock;
      const text = args.latex.replace(/\\text\{([^{}]*)\}/g, '$1').replace(/\s+/g, ' ').trim();
      for (const k of Object.keys(args)) delete args[k];
      args.text = text;
    }
    if (block.name === 'show_equation' && typeof args.latex === 'string') args.latex = spacedRoman(wordsAsText(args.latex));
    // A graph drawn on a page that already has one is the same picture with more on it: a circle went up, and
    // then the point on it as a second, empty-looking graph (conic sections, 2026-11-11). A graph of points
    // alone, or one that repeats a curve already drawn, is drawn together with the earlier one and takes its place.
    let replaces: string | undefined;
    if (block.name === 'show_function_graph' && state.board.current >= 0) {
      const page = state.board.pages[state.board.current];
      // Only within one piece of work: a graph for a new problem is its own picture. Merged with the last
      // problem's graph, a snowfall line came up with the dog-walking line y = 8x still on it, and by the third
      // problem the graph had three lines (grade 7, embed-1794453532197).
      const lastGraphAt = page.items.map((it) => it.tool === 'show_function_graph' && !!it.args).lastIndexOf(true);
      const old = lastGraphAt >= 0 && !page.items.slice(lastGraphAt + 1).some((it) => it.tool === 'show_problem') ? page.items[lastGraphAt] : undefined;
      const fns = (v: unknown) => (Array.isArray(v) ? (v as Array<Record<string, unknown>>) : []);
      const key = (f: Record<string, unknown>) => String(f.expr ?? f.expression ?? f.latex ?? '').replace(/\s+/g, '');
      if (old?.args) {
        const mine = fns(args.functions); const theirs = fns(old.args.functions);
        if (!mine.length || mine.some((f) => theirs.some((g) => key(g) === key(f)))) {
          const pts = (v: unknown) => fns(v);
          args.functions = [...theirs, ...mine.filter((f) => !theirs.some((g) => key(g) === key(f)))];
          const points = [...pts(old.args.points), ...pts(args.points).filter((q) => !pts(old.args!.points).some((o) => o.x === q.x && o.y === q.y))];
          if (points.length) args.points = points;
          const segs = [...pts(old.args.segments), ...pts(args.segments)];
          if (segs.length) args.segments = segs;
          for (const k of ['xRange', 'yRange', 'title'] as const) if (args[k] === undefined && old.args[k] !== undefined) args[k] = old.args[k];
          replaces = old.id;
        }
      }
    }
    // A note that says again what a note from this same reply says is its second draft, and takes its place:
    // "Walking around the loop" went up with the answers in it and again, under it, with question marks
    // (AP Physics, embed-1794493438983).
    if (block.name === 'annotate' && state.board.current >= 0 && typeof args.text === 'string') {
      const wordsOf = (t: unknown) => new Set(String(t ?? '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3));
      const mine = wordsOf(args.text);
      const page = state.board.pages[state.board.current];
      const draft = mine.size >= 4 ? toolCalls.find((c) => c.name === 'annotate' && !/^not /.test(c.outcome) && page.items.some((it) => it.id === c.id) && (() => { const theirs = wordsOf(c.args.text); const both = [...mine].filter((w) => theirs.has(w)).length; return both / Math.min(mine.size, theirs.size) >= 0.7; })()) : undefined;
      if (draft) replaces = draft.id;
    }
    const sayWith = typeof sayWithRaw === 'string' && sayWithRaw.trim() ? sayWithRaw.trim() : undefined;
    let outcome: string; let pointsAt: string | undefined;
    if (V2_CONTROL_TOOL_NAMES.has(block.name)) {
      // At the opening, and when the last reply ended on a statement and the student has waited, silence is
      // not open to the tutor: a session sat on a blank screen until the student spoke, and a tutor went quiet
      // for 100 s after an explanation (embed-1794426544316, embed-1794416183291). Taking the tools away
      // instead (tool_choice none) made half the openings come back with no words at all.
      outcome = boardOnly ? 'not done: only the board was asked for'
        // Once this reply has words, the call is only the tutor handing the floor over: refusing it then made the
        // opening say itself twice (AP Physics 1, embed-1794441323503).
        : block.name === 'keep_listening' && mustSpeak && !spoken.length ? 'not done: the student is waiting for you to speak. Say the next thing now.'
        : applyControlTool(state, session, block.name, args, nowMs);
    } else {
      // An object written as its JSON text is the object: a tree's root arrived as a string and the board drew
      // the text itself in one box (data structures, embed-1794458110435).
      for (const [k, v] of Object.entries(args)) if (typeof v === 'string' && /^\s*[[{]/.test(v) && k !== 'code' && k !== 'text' && k !== 'latex') { try { const o: unknown = JSON.parse(v); if (o && typeof o === 'object') args[k] = o; } catch { /* a string after all */ } }
      const valid = validateToolCall(block.name, args);
      // A force diagram is for pushes and pulls on a physical thing. Offered a pull between two ideas, the board
      // drew "the lovely woods" and "the promises to keep" as forces on a box (AP Lit, embed-1794448513359).
      const misfit = block.name === 'show_free_body_diagram' && !catalogueSubjects(session).includes('physics') ? 'a force diagram is for physical forces on an object, and this lesson has none; use compare, steps or a note' : boardMisfit(block.name, args);
      if (!valid.ok) outcome = `not painted: ${valid.reason}`;
      else if (misfit) outcome = `not painted: ${misfit}`;
      else {
        // The earlier graph leaves the tutor's record first, so the fuller one is not refused as a repeat.
        const page = replaces ? state.board.pages[state.board.current] : undefined;
        const was = page?.items.find((it) => it.id === replaces);
        if (page && was) page.items = page.items.filter((it) => it !== was);
        const o = applyBoard(state.board, block.id, block.name, args); outcome = o.painted ? o.detail : `not painted: ${o.detail}`;
        if (!o.painted) { if (page && was) page.items.push(was); replaces = undefined; }
        if (!o.painted && o.pointAt && !boardOnly) { pointsAt = o.pointAt; outcome = `not painted again: ${o.detail}; the board has scrolled back to it`; }
      }
    }
    const result: Anthropic.ToolResultBlockParam = { type: 'tool_result', tool_use_id: block.id, content: outcome };
    // The board pass often offers again what the reply already put up; a call of its that did nothing leaves no trace.
    if (boardOnly && /^not /.test(outcome)) return result;
    const call: V2ToolCall = { id: block.id, name: block.name, args, outcome, ...(sayWith ? { sayWith } : {}), ...(inline && !sayWith ? { inline: true } : {}), ...(replaces && !/^not /.test(outcome) ? { replaces } : {}), ...(markBeforeTurn ? { beforeTurn: true } : {}), ...(placeAbove && !/^not /.test(outcome) ? { before: placeAbove } : {}), ...(pointsAt ? { pointsAt } : {}), ...(block.name === 'new_page' && inline && !/^not /.test(outcome) && pageAgreed ? { agreed: true } : {}), ...(carryNow.length && block.name === 'new_page' && !/^not /.test(outcome) ? { carries: carryNow } : {}) };
    toolCalls.push(call);
    input.onToolCall?.(call);
    return result;
  };
  // Board blocks written inline in the reply (board-inline.ts): each becomes a board call where it stands.
  let inlineN = 0;
  const boardProblems: string[] = [];
  const settleInline = (b: InlineBlock, boardOnly = false): boolean => {
    let { name, args } = inlineToolCall(b);
    // A page block naming a page that exists turns back to it.
    if (name === 'new_page') { const at = state.board.pages.findIndex((pg, i) => i !== state.board.current && pg.title.replace(/\s+/g, '').toLowerCase() === String(args.title ?? '').replace(/\s+/g, '').toLowerCase()); if (at >= 0) { name = 'go_to_page'; args = { pageIndex: at, page: at + 1, title: state.board.pages[at].title }; } }
    inlineN += 1;
    const r = settle({ type: 'tool_use', id: `inl_${nowMs.toString(36)}_${inlineN}`, name, input: b.attrs.with ? { ...args, [SAY_WITH]: b.attrs.with } : args } as Anthropic.ToolUseBlock, boardOnly, true);
    let failed = /^not /.test(String(r.content));
    // Working refused as an equation (a list of outcomes with words, too wide for one line) is still working the
    // tutor is talking through: it goes up as a note, one outcome a line. Refused, the four children of a cross
    // were said aloud over an unchanged board (biology, embed-1794520770137).
    if (failed && b.kind === 'equation' && /too wide for one line|a sentence, not an equation/.test(String(r.content)) && !/\\[a-zA-Z]/.test(b.body)) {
      const lines = b.body.split(/\n+|,\s+(?=[^)]*(?:\(|$))|;\s+/).map((x) => x.trim()).filter(Boolean);
      const again = settle({ type: 'tool_use', id: `inl_${nowMs.toString(36)}_${inlineN}`, name: 'annotate', input: { text: [b.attrs.label ? `${b.attrs.label}:` : '', ...lines].filter(Boolean).join('\n'), rich: true, ...(b.attrs.with ? { [SAY_WITH]: b.attrs.with } : {}) } } as Anthropic.ToolUseBlock, boardOnly, true);
      if (!/^not /.test(String(again.content))) failed = false;
    }
    if (!failed && !boardOnly) inlinePainted.push({ id: `inl_${nowMs.toString(36)}_${inlineN}`, raw: b.raw, label: `${b.kind}: ${b.body.replace(/\s+/g, ' ').slice(0, 160)}` });
    if (failed && !boardOnly && !/scrolled back/.test(String(r.content))) boardProblems.push(`${b.kind} "${b.body.replace(/\s+/g, ' ').slice(0, 60)}": ${String(r.content).replace(/^not painted: /, '')}`);
    return !failed;
  };
  // How much had been said when the reply turned to a new page (-1: it did not).
  let saidChars = 0; let pageTurnAt = -1; let pageBefore = -1; let markBeforeTurn = false;
  // The item of this reply that a check addition belongs above (see the check's additions, below).
  let placeAbove: string | undefined;
  // The student was asked whether to go on and has answered: the page for the next part turns as the reply
  // begins. Turned where the tutor reached the block, the pedigree page came up after the whole description of
  // squares and circles had been spoken over the old page (biology, embed-1794520770137).
  const pageAgreed = leftOpen((() => { const m = [...state.history].reverse().find((h) => h.role === 'assistant' && (typeof h.content === 'string' || h.content.some((c) => c.type === 'text'))); return !m ? '' : typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '); })(), input.studentSaid ?? null);
  // Inline items settled since the last spoken words. A tutor who writes a figure and THEN turns the page, with
  // nothing said between, meant the figure for the new page: the washer solid went up at the foot of the disc
  // page and the page turned at once (AP Calc BC, embed-1794446765164). The page turn carries them over.
  let sinceWords: string[] = []; let carryNow: string[] = [];
  const rawSpoken: string[] = [];
  const withdrawn: string[] = []; const withdrawnLabels: string[] = [];
  const inlinePainted: Array<{ id: string; raw: string; label: string }> = [];

  let heldAt: { raw: string; offer: string } | null = null; let saidNow = '';
  const lastTutorText = (() => { const m = [...state.history].reverse().find((h) => h.role === 'assistant' && (typeof h.content === 'string' || h.content.some((c) => c.type === 'text'))); return !m ? '' : typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '); })();
  const boardHasPage = (title: string) => state.board.pages.some((pg) => pg.title.replace(/\s+/g, '').toLowerCase() === title.replace(/\s+/g, '').toLowerCase());
  for (; modelCalls < V2_MAX_MODEL_CALLS;) {
    const params = {
      model: '',
      max_tokens: V2_MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: { effort: input.effort ?? V2_DEFAULT_EFFORT },
      system,
      tools,
      messages,
    } as unknown as Anthropic.MessageCreateParamsNonStreaming;
    const inline = new BoardInlineStream();
    const take = (parts: InlinePart[]) => {
      for (const part of parts) {
        if (heldAt) continue;
        if ('opening' in part) { input.onBoardOpen?.(); continue; }
        if ('block' in part) {
          // A new part the student has not been asked about is not opened in this reply (part-close.ts): the
          // reply ends here, with the offer in place of the page and all that followed it.
          if (part.block.kind === 'page' && !boardHasPage(part.block.body) && !state.closed && !mayOpenPart({ title: part.block.body, studentSaid: input.studentSaid, lastTutor: lastTutorText, pagesOpen: state.board.pages.length })) {
            const offer = /\?\s*$/.test(saidNow) ? '' : partOffer(part.block.body.trim(), namesPart(part.block.body, saidNow));
            heldAt = { raw: part.block.raw, offer };
            if (offer) { input.onText?.(`\n\n${offer}`); saidChars += offer.length + 2; }
            input.onToolCall?.({ id: `held_${nowMs.toString(36)}`, name: 'new_page', args: { title: part.block.body.trim() }, outcome: 'not opened yet: the student is asked first' });
            continue;
          }
          if (part.block.kind === 'page' && pageTurnAt < 0) { pageTurnAt = saidChars; pageBefore = state.board.current; }
          if (part.block.kind === 'page') {
            const from = state.board.current; // A line of working is not carried: written just before the turn, it closes what came
            // before it: the count of domains for the molecule just answered was moved onto the next part's page
            // (chemistry, embed-1794459147431).
            const moving = from >= 0 ? state.board.pages[from].items.filter((it) => sinceWords.includes(it.id) && !['show_equation', 'show_problem'].includes(it.tool)) : [];
            carryNow = moving.map((it) => it.id);
            const turned = settleInline(part.block);
            if (turned && moving.length && state.board.current !== from) { state.board.pages[from].items = state.board.pages[from].items.filter((it) => !moving.includes(it)); state.board.pages[state.board.current].items.push(...moving); }
            carryNow = []; sinceWords = [];
          } else { const before = inlineN; if (settleInline(part.block)) sinceWords.push(`inl_${nowMs.toString(36)}_${before + 1}`); }
          continue;
        }
        if (part.text.trim()) sinceWords = [];
        if (firstTextMs === null && part.text.trim()) firstTextMs = Date.now() - t0;
        saidChars += part.text.length; saidNow += part.text;
        input.onText?.(part.text);
      }
    };
    const response = await callModel(params, (delta) => take(inline.push(delta)), input.signal);
    take(inline.flush());
    const held = heldAt as { raw: string; offer: string } | null;
    if (held) {
      // The history keeps what was said: the reply up to the held page, then the offer.
      let cut = false;
      for (const b of response.content) {
        if (b.type !== 'text') continue;
        if (cut) { b.text = ''; continue; }
        const at = b.text.indexOf(held.raw);
        if (at >= 0) { b.text = `${b.text.slice(0, at).trimEnd()}${held.offer ? `\n\n${held.offer}` : ''}`.trim(); cut = true; }
      }
    }
    modelCalls += 1;
    if (response.model) usage.model = response.model;
    usage.inputTokens += response.usage.input_tokens;
    usage.outputTokens += response.usage.output_tokens;
    usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0;
    usage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === 'text') { const words = stripBoardBlocks(block.text); if (words) { spoken.push(words); rawSpoken.push(block.text.trim()); } continue; }
      if (block.type !== 'tool_use') continue;
      results.push(settle(block));
    }

    const keep = storable(response.content);
    if (keep.length) stored.push({ role: 'assistant', content: keep });
    // Every stored tool call is followed by its result, whatever the stop reason was
    // (a reply cut at the token limit can carry finished tool calls): the API refuses
    // a history in which one is missing.
    if (results.length) stored.push({ role: 'user', content: results });
    if (heldAt) break;
    // No words and no call where words are owed: ask once more.
    if (mustSpeak && !spoken.length && results.length === 0 && modelCalls < 3 && !input.signal?.aborted) continue;
    if (response.stop_reason !== 'tool_use' || results.length === 0) break;
    // The model is called again only when it has something to react to: a tool call that
    // did not do what was asked, or a reply with no words yet. When it has spoken and every
    // call worked, the turn is over — a second call tends to say the same thing again, and
    // costs the student a wait.
    const somethingFailed = results.some((r) => /^not /.test(String(r.content)));
    if (spoken.length > 0 && !somethingFailed) break;
    // Silence was the reply.
    if (toolCalls.some((c) => c.name === 'keep_listening' && !/^not /.test(c.outcome))) break;
    // Within the turn the model's own content goes back whole (thinking included).
    messages = [...messages, { role: 'assistant', content: response.content as unknown as Anthropic.ContentBlockParam[] }, { role: 'user', content: results }];
  }

  // A problem card put up in a spoken reply is also asked aloud (board-timing.ts unsaidAsk).
  if (session.mode === 'voice' && !state.closed && !input.signal?.aborted && spoken.length) {
    const card = [...toolCalls].reverse().find((c) => c.name === 'show_problem' && !/^not /.test(c.outcome));
    const more = card ? unsaidAsk(String(card.args.statement ?? ''), spoken.join(' ').split(/(?<=[.!?？])\s+/).filter(Boolean)) : null;
    if (more) {
      input.onText?.(`\n\n${more}`);
      spoken.push(more);
      const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
      const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
      if (textBlock) textBlock.text = `${textBlock.text}\n\n${more}`;
    }
  }

  // The maths check. The model slips on a named operation or a value about one reply in four on some turns
  // ("Dividing by 4 gives x² + y² = 4" for x²/4 + y²/4 = 1, embed-1794414820031), and more thinking does not
  // cure it: the same turn replayed eight times each gave 2 slips at medium effort and 2 at high, 1.3 s slower.
  // Asked afterwards, at medium effort, to look for exactly that kind of slip, it finds it (12 of 12, one
  // pedantic alarm in 24 sound replies; at low effort it waved the slip through). So a reply that spoke mathematics is checked while it is being said, and a slip is put right in
  // the tutor's own voice at the end of the same reply. Runs beside the board pass. OFF unless TUTOR_V2_MATHS_CHECK=on (Praveen 11-11: slips seen only in conics; one live false correction).
  const saidSoFar = spoken.join('\n\n');
  // What the reply drew is checked with what it said: a "point on the parabola" went up that was not on it.
  const drawnNow = toolCalls.filter((c) => V2_FIGURE_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome)).map((c) => `${c.name.replace(/^show_/, '')}: ${JSON.stringify(c.args).slice(0, 400)}`);
  const mathsCheck: Promise<string | null> = (input.mathsCheck ?? (!input.callModel && process.env.TUTOR_V2_MATHS_CHECK === 'on')) && !state.closed && !input.signal?.aborted && speaksMaths(saidSoFar) && modelCalls < V2_MAX_MODEL_CALLS
    ? Promise.all([0, 1].map(() => callModel({
      // On a clean page: the board, the student's words, the reply. With the whole lesson in front of it the
      // model waved its own slip through six times out of six; shown only these three it catches it.
      model: '', max_tokens: 2500, thinking: { type: 'adaptive' }, output_config: { effort: 'medium' },
      messages: [{ role: 'user', content: `The board shows:\n${renderBoard(state.board)}\n\n${input.studentSaid ? `The student said: "${input.studentSaid}"` : 'The student has not spoken.'}` }, { role: 'assistant', content: `${saidSoFar}${drawnNow.length ? `\n\n[drawn on the board with this reply: ${drawnNow.join(' | ')}]` : ''}` }, { role: 'user', content: V2_MATHS_CHECK }],
    } as unknown as Anthropic.MessageCreateParamsNonStreaming, undefined, input.signal).then((response) => {
      usage.inputTokens += response.usage.input_tokens; usage.outputTokens += response.usage.output_tokens;
      usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0; usage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;
      const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join(' ');
      const fix = text.match(/\bcorrection:\s*([^\n]+)/i)?.[1]?.replace(/<board\b[\s\S]*$/, '').trim() ?? '';
      // One short sentence or two; anything longer is the check thinking aloud, not a correction.
      return fix && fix.split(/\s+/).length <= 40 ? fix : null;
    }).catch(() => null)))
      // Two readings, made apart, must both find a slip: one alone corrected a statement that was right
      // ("165 to 170 has width 5, not 6", embed-1794425631023).
      .then(([a, b]) => (a && b ? a : null))
    : Promise.resolve(null);

  // The board pass. Speech and the board are the two halves of a spoken reply, and the model often
  // writes only the first: it says the working and puts up nothing, or only the next problem. When the
  // reply spoke mathematics, the model is shown its own words and asked what of them is missing from the
  // board. Its words are already on their way to the student; only board calls are taken from this call.
  // They are stored as part of the reply, so the history reads as a tutor who wrote while talking.
  const said = spoken.join('\n\n');
  // A long spoken reply with nothing written is checked too, whatever the subject: names, dates and terms
  // that are only heard are lost as surely as mathematics (two replies of an AP Government lesson went by
  // with an empty board, embed-1794355900794).
  // A reply of that length that drew no figure is checked as well: a scenario of pushes and pulls, a curve,
  // a sequence was being told in words and problem cards alone (a Grade 8 forces lesson, embed-1794371869806).
  const NEXT_PART = /\bpart \(?[b-h]\)?(?=[\s:,.])|\b(?:next|second|third|fourth|last|final) (?:part|question)\b/i;
  const drewFigure = () => toolCalls.some((c) => V2_FIGURE_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome));
  const paintedSoFar = () => toolCalls.some((c) => !V2_CONTROL_TOOL_NAMES.has(c.name) && c.name !== 'new_page' && c.name !== 'go_to_page' && !/^not /.test(c.outcome));
  // A reply that ended on the offer of the next part is checked only for mathematics it said: asked to look at
  // "Let's start with the chromosomes", the check wrote the next part's first note before the student had said yes
  // (biology, embed-1794520770137).
  const endedOnOffer = !!(heldAt as { raw: string } | null);
  if (session.mode === 'voice' && !state.closed && !input.signal?.aborted && said && (!endedOnOffer || speaksMaths(said)) && (speaksMaths(said) || inlinePainted.some((x) => !x.label.startsWith('problem')) || ((!paintedSoFar() || !drewFigure()) && said.split(/\s+/).length >= V2_UNWRITTEN_WORDS) || (opening && !paintedSoFar())
    // Values said and nothing written: a student's set-up was confirmed aloud ("A⁻ is 0.05, HA is 0.1, pKa is 4.74")
    // and never put on the board (chemistry, embed-1794447993778).
    || (!paintedSoFar() && new Set(said.match(/\d+(?:\.\d+)?/g) ?? []).size >= 3)
    // The next part of a question set aloud with nothing written: "Now part (b): how did…" was asked under a card
    // that still showed part (a) (AP World History, embed-1794536181149).
    || (!paintedSoFar() && NEXT_PART.test(said) && /\?/.test(said))) && modelCalls < V2_MAX_MODEL_CALLS && (input.boardPass ?? true)) {
    // The check has two halves. What was said and not written is added. What was written and should not have
    // been is withdrawn: a block that shows the step the reply asks the student to take (the board did the
    // differentiation the tutor had just asked for, embed-1794349966573). Board items wait for their sentence
    // in the voice client, so a withdrawal usually arrives before the item is shown.
    const others = toolCalls.filter((c) => !V2_CONTROL_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome) && !inlinePainted.some((x) => x.id === c.id)).map((c) => `${c.name}: ${summariseBoardCall(c.name, c.args)}`);
    const listed = [...inlinePainted.map((x, i) => `  ${i + 1}. ${x.label}`), ...others.map((x) => `  - ${x}`)];
    // What the reply said and the board does not hold is found here, not left to the model's eye: twice in one
    // lesson it spoke a standard form and wrote only the line before it (embed-1794414820031).
    const unwritten = unwrittenEquations(said, state.board.pages.flatMap((pg) => pg.items.map((it) => it.summary))).slice(0, 4);
    const catalogue = figureCatalogueFor(session);
    const askedOnCard0 = () => toolCalls.some((c) => c.name === 'show_problem' && !/^not /.test(c.outcome));
    const askedOnCard = askedOnCard0();
    // Three things the reply shows by itself to be missing, said to the check outright (AP Physics,
    // embed-1794496967839): "let's look at the picture" over no picture; a problem about a circuit with no
    // circuit; "Yes, 8 volts" with the working that gives it left unwritten.
    const drewNow = drewFigure();
    const promised = !drewNow && /\b(?:picture|diagram|figure|drawing|sketch|drawn out|draw (?:it|this|that))\b/i.test(said);
    const cardNoFigure = !drewNow && askedOnCard0();
    const confirmedBare = /^\s*(?:yes|right|correct|exactly|that'?s (?:right|correct|it))\b/i.test(said) && /\d/.test(said.split(/(?<=[.?!])\s+/).slice(0, 2).join(' ')) && !toolCalls.some((c) => (c.name === 'show_equation' || c.name === 'annotate') && !/^not /.test(c.outcome));
    const missing = [
      promised ? 'You spoke of a picture, and this reply drew none: draw it now, as the third step.' : '',
      cardNoFigure ? 'This reply put up a problem and no figure with it: if the problem describes something that can be drawn (a circuit, a shape, a set-up, a graph), draw it now as the third step, with what the student is to find left out.' : '',
      confirmedBare ? 'You confirmed the student\'s answer and wrote nothing for it: in the second step, write the one line of working that gives it, with with="the opening words of the sentence that confirms it".' : '',
    ].filter(Boolean).join(' ');
    const check = `[board check — from the system running the session, not from the student]\nYou have just said the reply above aloud. In it you put on the board: ${listed.length ? `\n${listed.join('\n')}` : 'nothing. A reply of this length that leaves the board untouched is a tutor talking at an empty board: unless it was only small talk or a question about what is already up, the heart of what you said belongs there, in the form that fits it.'}\n\nFirst, and rarely: does a numbered item state outright the answer to the very thing this reply asks the student to work out, so that reading the board answers your question for them? Only then, withdraw it by writing "withdraw N" on a line by itself, followed by that question as you asked it, in quotation marks; and if the reply points the student at that item ("the table below"), write it again in the second step with the part they are to find left as a question mark. Everything else stays: an item that sets the question out, leaves a blank or a question mark for them to fill, lists things for them to compare, shows working the student has already given, or shows what you yourself explained. When unsure, it stays.\n\nSecond: what is only heard is lost. If something you said aloud that the student needs to hold on to is not on the board (the working behind a result, a step the student gave, a correction, a hint; a name, a date, a term, the two sides of a question), write it now as board blocks, in whichever kind fits, each with with="the opening words of the sentence in which you say it", for example <board equation with="The derivative of the top">…</board>. Write only what you said: nothing new, nothing already there, and never an answer you left for the student to find.${unwritten.length ? ` These equations were said aloud and no board item holds them: ${unwritten.map((e) => `"${e}"`).join('; ')}. Each goes up now as an equation, unless it is there in another form or is the answer the student is to find.` : ''}${askedOnCard ? '' : ' A question you set that comes with its own numbers, data or expression, none of them on the board, is written as a problem block holding the question as you asked it; a question about what is already on the board needs none.'}\n\nThird, a picture. Name to yourself the one thing in this reply a student could look at rather than read: an equation that is a curve, a function, points on axes, an arrangement of things a problem or an explanation describes (a circuit, an apparatus, a shape, a set-up), a set of data values or counts, pushes and pulls on a thing, values on a number line, events in order, the stages of a process, two things set side by side. If there is one and no figure of that very thing is on the board (a figure of something else, an earlier circuit or an earlier graph, does not count), draw it now in the figure form that fits (${catalogueSubjects(session).includes('physics') ? 'graph, chart, forces' : 'graph, chart'}, numberline, timeline, steps, cycle, ranks, web, map, compare, table)${catalogue ? ', or as an exact figure from the catalogue below when one of them shows it better' : ''}, with with="…" as above. A formula written out is not a figure of its curve. A general case told in letters (a circle of radius r about a centre) is drawn with plain numbers standing in for the letters, so there is something to see. Draw the situation as you described it, with the numbers you gave, never the answer the student is to find. What has no shape gets no figure.${missing ? `\n\nIn this reply: ${missing}` : ''}\n\nAnswer in three lines or groups, in this order. First: "withdraw N" with the question it answers in quotation marks, or "1: none". Second: the missing blocks, or "2: none". Third: the figure block itself (saying it is drawn does not draw it), or "3: none" followed by a few words on why nothing here can be drawn.${catalogue ? `\n\nThe catalogue of exact figures for this lesson. One is written <board figure kind="its kind" with="…">its parameters as one JSON object</board>. Give the values the reply gave, as they were said; leave out whatever the student is to find.\n${catalogue}` : ''}`;
    try {
      const response = await callModel({
        model: '', max_tokens: 1500, thinking: { type: 'adaptive' }, output_config: { effort: 'low' }, system, tools,
        messages: [...withCacheMark(state.history), userNow, { role: 'assistant', content: [{ type: 'text', text: rawSpoken.join('\n\n') || said }] }, { role: 'user', content: [{ type: 'text', text: check }] }],
      } as unknown as Anthropic.MessageCreateParamsNonStreaming, undefined, input.signal);
      modelCalls += 1;
      usage.inputTokens += response.usage.input_tokens;
      usage.outputTokens += response.usage.output_tokens;
      usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0;
      usage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;
      const passText = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('\n');
      // A block that paints is stored inside the reply, before its sentence: the history then shows the reply as it should have been written.
      const lastWords = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
      for (const m of passText.replace(/<board\b[\s\S]*?<\/board>/g, ' ').matchAll(/\bwithdraw\s*:?\s*#?(\d+)([^\n]*)/gi)) {
        const gone = inlinePainted[Number(m[1]) - 1];
        // A withdrawal names the question the item answers, and that question must be one this reply asked, about
        // the subject and not a check-in: a "common mistake" note was withdrawn under "Does that make sense so
        // far?", after it had been shown (AP Physics, embed-1794493438983).
        const quoted = (m[2].match(/["“]([^"”]{6,})["”]/)?.[1] ?? '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
        const asked = said.split(/(?<=[.?!])\s+/).filter((q) => q.trim().endsWith('?')).map((q) => q.toLowerCase().replace(/[^a-z0-9 ]+/g, ' '));
        const names = quoted.length >= 2 && asked.some((q) => { const qw = new Set(q.split(/\s+/)); return quoted.filter((w) => qw.has(w)).length >= Math.ceil(quoted.length * 0.7); });
        if (!names || /\b(?:make sense|is that clear|go over it again|sound good|any questions|ready to|shall (?:i|we)|would you like|want (?:me )?to)\b/i.test(m[2])) continue;
        // An item with a blank in it is a question set out for the student, never the answer (the check withdrew
        // "1/2 = ?/6" from a grade 6 lesson in replay).
        // The opening reply is painted at once (a session never starts on a bare board), so a withdrawal there
        // would empty the board in front of the student (browser run, conic sections, 2026-11-11). It stays.
        if (opening) continue;
        if (!gone || withdrawn.includes(gone.id) || /\?|\\square|\\boxed\{\s*\}|_{3,}/.test(gone.label)) continue;
        withdrawn.push(gone.id); withdrawnLabels.push(gone.label);
        for (const page of state.board.pages) page.items = page.items.filter((it) => it.id !== gone.id);
        const at = toolCalls.findIndex((c) => c.id === gone.id);
        if (at >= 0) toolCalls.splice(at, 1);
        const holder = (lastWords?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text' && c.text.includes(gone.raw));
        if (holder) holder.text = holder.text.replace(gone.raw, '').replace(/[ \t]{2,}/g, ' ');
        input.onBoardWithdraw?.(gone.id);
      }
      // Several graph blocks from one check are one picture: a circle went up as two graphs, the curve on one
      // and its centre alone on the other (browser run, conic sections, 2026-11-11).
      const passBlocks = boardBlocksIn(passText);
      const graphs = passBlocks.filter((b) => b.kind === 'graph');
      if (graphs.length > 1) {
        const body = graphs.map((g) => g.body).join('\n');
        const merged = boardBlocksIn(graphs[0].raw.replace(graphs[0].body, () => body))[0];
        if (merged) { passBlocks[passBlocks.indexOf(graphs[0])] = merged; for (const g of graphs.slice(1)) passBlocks.splice(passBlocks.indexOf(g), 1); }
      }
      // When the reply itself turned the page, what the check adds for words said BEFORE the turn belongs on
      // the page before: put on the new one, the working for x² = −12y and its graph sat under a heading about
      // something else, around the next problem (conic sections, twice, 2026-11-11). The voice client holds a
      // page turn until the reply is complete, so these still go up on the old page, ahead of the turn.
      const letters = (x: string) => x.toLowerCase().replace(/\$[^$]*\$/g, ' ').split(/[^a-z]+/).filter((w) => w.length >= 2);
      const saidLetters = letters(said);
      // A reply that turns the page closes one part and opens the next. When more than one paragraph was said
      // before the turn, the last of them is already about the new part ("Next are two structures… A stack is
      // last-in, first-out"): a figure for it went up at the foot of the linked-list page (embed-1794458110435).
      const beforeTurnText = pageTurnAt < 0 ? '' : said.slice(0, pageTurnAt); const leadBreak = beforeTurnText.trimEnd().lastIndexOf('\n\n');
      const leadAtWord = pageTurnAt < 0 ? -1 : letters(leadBreak > 0 ? beforeTurnText.slice(0, leadBreak) : beforeTurnText).length;
      const overlap = (body: string, text: string) => { const nums = new Set(text.match(/\d+(?:\.\d+)?/g) ?? []); const words = new Set(letters(text).filter((w) => w.length >= 4)); return (body.match(/\d+(?:\.\d+)?/g) ?? []).filter((n) => nums.has(n)).length + letters(body).filter((w) => w.length >= 4 && words.has(w)).length; };
      // The new part begins where the reply first names it, which is often a sentence or two before the page
      // block itself ("Now Kirchhoff's voltage law: go once around any closed loop…", then the page of that name;
      // "Here's one with a 6 ohm resistor in series with a parallel pair", then "Mixed series and parallel").
      // What the check adds for those sentences belongs on the new page: put on the one before, a note and then
      // a circuit were hidden by the turn the moment they went up (AP Physics, embed-1794493438983, and a probe).
      const newTitle = [...new Set(letters(state.board.pages[pageBefore + 1]?.title ?? '').filter((w) => w.length >= 4))];
      const partBeginsAtWord = (() => {
        if (!newTitle.length) return Infinity;
        let seen = 0;
        for (const sentence of beforeTurnText.split(/(?<=[.?!:])\s+/)) {
          const ws = letters(sentence);
          if (newTitle.filter((w) => ws.some((x) => x === w || (w.length >= 5 && x.startsWith(w.slice(0, 5))))).length >= Math.ceil(newTitle.length / 2)) return seen;
          seen += ws.length;
        }
        return Infinity;
      })();
      const namesNewPage = (atWord: number) => atWord >= partBeginsAtWord;
      const beforeTurn = (b: InlineBlock) => {
        if (pageTurnAt < 0 || pageBefore < 0 || b.kind === 'page') return false;
        const want = letters(b.attrs.with ?? '').slice(0, 3);
        if (want.length >= 2) for (let at = 0; at + want.length <= saidLetters.length; at++) if (want.every((w, k) => saidLetters[at + k] === w)) return at < leadAtWord && !namesNewPage(at);
        // The check sometimes quotes the problem card rather than a sentence ("Two 6 Ω resistors are connected in
        // series"): what this reply put on the new page counts as that side of the turn. The circuit for a card
        // went up on the page before it, and the tutor said "look at the circuit" over a page without one
        // (AP Physics, embed-1794500923861).
        const onNewPage = state.board.pages.slice(pageBefore + 1).flatMap((pg) => pg.items.filter((it) => toolCalls.some((c) => c.id === it.id)).map((it) => it.summary)).join(' ');
        const newLetters = letters(onNewPage);
        if (want.length >= 2) for (let at = 0; at + want.length <= newLetters.length; at++) if (want.every((w, k) => newLetters[at + k] === w)) return false;
        // No sentence to go by: which side of the turn is it about?
        const lead = leadBreak > 0 ? leadBreak : pageTurnAt;
        return overlap(b.body, said.slice(0, lead)) > overlap(b.body, `${said.slice(lead)} ${onNewPage}`);
      };
      for (const b of passBlocks) {
        if (beforeTurn(b)) {
          if (b.kind === 'problem') continue;
          const now = state.board.current; state.board.current = pageBefore; markBeforeTurn = true;
          let ok = false; try { ok = settleInline(b, true); } finally { state.board.current = now; markBeforeTurn = false; }
          if (ok) { const textBlock = (lastWords?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text'); if (textBlock) textBlock.text = insertBlock(textBlock.text, b.raw.replace(/\s+with="[^"]*"/, ''), b.attrs.with); }
          continue;
        }
        // One card a reply: the check adds a problem only when the reply set a question and put up no card.
        if (b.kind === 'problem' && (toolCalls.some((c) => c.name === 'show_problem' && !/^not /.test(c.outcome)) || !saidCovers(b.body, said))) continue;
        // The check writes for a sentence said earlier in the reply, after items for later sentences are already
        // up. It goes where its sentence is: "du = dx, v = −cos x" came up underneath the formula those two had
        // just been put into (AP Calc BC, embed-1794511321049). The reply's own text, with the block put in at
        // its sentence, says which item follows it.
        const textBlock = (lastWords?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text');
        const bare = b.raw.replace(/\s+with="[^"]*"/, '');
        const withIt = textBlock ? insertBlock(textBlock.text, bare, b.attrs.with) : '';
        const after = withIt ? withIt.slice(withIt.indexOf(bare) + bare.length) : '';
        const onPage = new Set(state.board.pages[state.board.current]?.items.map((it) => it.id));
        const nextAny = b.kind === 'problem' || b.kind === 'page' ? undefined : inlinePainted.map((x) => ({ id: x.id, at: after.indexOf(x.raw), card: x.label.startsWith('problem') })).filter((x) => x.at >= 0 && onPage.has(x.id)).sort((x, y) => x.at - y.at)[0];
        // A figure drawn for a problem stands under its card, as in a book: put above, it pushed the card down two
        // seconds after the student had begun to read it (biology, embed-1794520770137).
        const next = nextAny && b.kind === 'figure' && nextAny.card ? undefined : nextAny;
        placeAbove = next?.id;
        let ok = false; try { ok = settleInline(b, true); } finally { placeAbove = undefined; }
        if (!ok) continue;
        if (next) { const items = state.board.pages[state.board.current].items; const mine = items.pop(); const at = items.findIndex((it) => it.id === next.id); if (mine) items.splice(at < 0 ? items.length : at, 0, mine); }
        if (textBlock) textBlock.text = withIt;
      }
    } catch { /* the reply stands without it */ }
  }

  const fix = await mathsCheck;
  if (fix && !state.closed && !input.signal?.aborted) {
    const words = `One correction: ${fix}`;
    input.onText?.(`\n\n${words}`);
    spoken.push(words);
    const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
    const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
    if (textBlock) textBlock.text = `${textBlock.text}\n\n${words}`;
  }

  // A spoken reply that asks the student nothing leaves them not knowing whose move it is. Going on unasked a
  // moment later turned a page the student was still reading and talked over their answer (AP Lit and AP Calc BC,
  // 2026-11-11: "give the student the chance to say yes, I get this"). The reply ends by handing over instead.
  if (session.mode === 'voice' && !state.closed && !input.signal?.aborted && spoken.length && !toolCalls.some((c) => c.name === 'keep_listening' || c.name === 'end_lesson') && !asksAnywhere(spoken.join(' ').split(/(?<=[.?!])\s+/))) {
    const words = V2_CHECK_INS[state.history.length % V2_CHECK_INS.length];
    input.onText?.(`\n\n${words}`);
    spoken.push(words);
    const holder = [...stored].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
    const textBlock = [...((holder?.content as Anthropic.ContentBlockParam[] | undefined) ?? [])].reverse().find((c): c is Anthropic.TextBlockParam => c.type === 'text');
    if (textBlock) textBlock.text = `${textBlock.text}\n\n${words}`;
  }

  // A session never begins on a bare board (embed-1794362141944, embed-1794376295543). When the opening reply
  // and the check after it both wrote nothing, the lesson's heading and what it is for go up.
  if (session.mode === 'voice' && opening && !state.closed && spoken.length && !paintedSoFar()) {
    const body = [session.plan?.title ?? session.topic ?? '', ...(session.plan?.los ?? []).slice(0, 3).map((lo) => lo.description)].map((x) => String(x).trim()).filter(Boolean).join('\n');
    const b = body ? boardBlocksIn(`<board note style="highlight">${body}</board>`)[0] : undefined;
    if (b && settleInline(b, true)) {
      const holder = stored.find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((c) => c.type === 'text'));
      const textBlock = (holder?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text');
      if (textBlock) textBlock.text = `${b.raw}\n${textBlock.text}`;
    }
  }

  state.history = [...state.history, ...stored];
  // Fed back as a fact next turn: how long the tutor has been talking without writing.
  const painted = toolCalls.some((c) => !V2_CONTROL_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome));
  state.repliesSinceBoard = painted ? 0 : (state.repliesSinceBoard ?? 0) + 1;
  if (boardProblems.length) state.boardProblems = boardProblems; else delete state.boardProblems;
  return { spoken: stripToolTalk(spoken.join('\n\n')), toolCalls, ...(withdrawnLabels.length ? { withdrawn: withdrawnLabels } : {}), state, usage, firstTextMs, totalMs: Date.now() - t0, modelCalls };
}
