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
import { applyToModelBoard, boardMisfit, summariseBoardCall, taskOnly, spacedRoman, wordsAsText } from './board';
import { BoardInlineStream, boardBlocksIn, inlineToolCall, insertBlock, stripBoardBlocks, type InlineBlock, type InlinePart } from './board-inline';
import { speaksMaths, unwrittenEquations } from './spoken-maths';
import { saidCovers, unsaidAsk } from './board-timing';
import { V2_CONSTITUTION, v2ModeLines } from './constitution';
import { renderFacts, V2_NO_ASK_RECHECK_S, type V2TurnFacts } from './facts';
import { planGoalIds, renderPlanMap } from './plan-map';
import { stripToolTalk } from './tool-talk';
import { SAY_WITH, V2_CONTROL_TOOL_NAMES, v2Tools } from './tools';
import type { GapStatus, GoalStatus, V2Board, V2BoardOutcome, V2Session, V2State, V2ToolCall, V2TurnResult } from './types';

/** A spoken reply of at least this many words that wrote nothing is put to the board check. */
export const V2_UNWRITTEN_WORDS = 30;
/** Board calls that draw a figure, as opposed to writing words or mathematics. */
const V2_FIGURE_TOOL_NAMES = new Set(['show_free_body_diagram', 'show_number_line', 'show_function_graph', 'show_table', 'show_timeline', 'show_graphic_organizer', 'show_geometry', 'show_venn_diagram', 'show_tree', 'show_stats', 'show_lewis_constructed']);
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
  callModel?: V2ModelCall;
  applyBoard?: V2BoardPort;
  onText?: (delta: string) => void;
  /** Called as each tool call is settled, in order, before the turn returns. */
  onToolCall?: (call: V2ToolCall) => void;
  /** Cancels the model call: the student talked over the tutor, or the page went away. */
  signal?: AbortSignal;
}

export function v2SessionPart(session: V2Session): string {
  const lines = [
    'THIS SESSION',
    `Student: ${session.studentName?.trim() || 'name not given'}. Subject: ${session.subject}${session.topic ? ` (${session.topic})` : ''}. Level: ${session.level}.`,
    v2ModeLines(session.mode),
    session.timeBoxMinutes ? `The session is meant to last about ${session.timeBoxMinutes} minutes.` : '',
    session.plan ? `\n${renderPlanMap(session.plan)}` : '\nThere is no lesson plan: teach what the student asks for.',
  ];
  return lines.filter(Boolean).join('\n');
}

/** What goes in the user turn in place of the student's words when they have not spoken. */
export function v2StudentBlock(studentSaid: string | null, state: V2State, silenceSeconds?: number): string {
  if (studentSaid !== null) return studentSaid;
  if (state.history.length === 0) return '[The session has just begun. The student has not said anything yet.]';
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

export async function runV2Turn(input: V2TurnInput): Promise<V2TurnResult> {
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

  /** Run one tool call: validate it, apply it, tell the client, and return its result for the model. */
  const settle = (block: Anthropic.ToolUseBlock, boardOnly = false, inline = false): Anthropic.ToolResultBlockParam => {
    const { [SAY_WITH]: sayWithRaw, ...args } = (block.input ?? {}) as Record<string, unknown>;
    // A problem card states the task; how-to-begin sentences are cut from it (board.ts taskOnly).
    if (block.name === 'show_problem' && typeof args.statement === 'string') args.statement = taskOnly(args.statement).statement;
    if (block.name === 'show_equation' && typeof args.latex === 'string') args.latex = spacedRoman(wordsAsText(args.latex));
    const sayWith = typeof sayWithRaw === 'string' && sayWithRaw.trim() ? sayWithRaw.trim() : undefined;
    let outcome: string;
    if (V2_CONTROL_TOOL_NAMES.has(block.name)) {
      outcome = boardOnly ? 'not done: only the board was asked for' : applyControlTool(state, session, block.name, args, nowMs);
    } else {
      const valid = validateToolCall(block.name, args);
      const misfit = boardMisfit(block.name, args);
      if (!valid.ok) outcome = `not painted: ${valid.reason}`;
      else if (misfit) outcome = `not painted: ${misfit}`;
      else { const o = applyBoard(state.board, block.id, block.name, args); outcome = o.painted ? o.detail : `not painted: ${o.detail}`; }
    }
    const result: Anthropic.ToolResultBlockParam = { type: 'tool_result', tool_use_id: block.id, content: outcome };
    // The board pass often offers again what the reply already put up; a call of its that did nothing leaves no trace.
    if (boardOnly && /^not /.test(outcome)) return result;
    const call: V2ToolCall = { id: block.id, name: block.name, args, outcome, ...(sayWith ? { sayWith } : {}), ...(inline && !sayWith ? { inline: true } : {}) };
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
    if (name === 'new_page') { const at = state.board.pages.findIndex((pg, i) => i !== state.board.current && pg.title.replace(/\s+/g, '').toLowerCase() === String(args.title ?? '').replace(/\s+/g, '').toLowerCase()); if (at >= 0) { name = 'go_to_page'; args = { pageIndex: at }; } }
    inlineN += 1;
    const r = settle({ type: 'tool_use', id: `inl_${nowMs.toString(36)}_${inlineN}`, name, input: b.attrs.with ? { ...args, [SAY_WITH]: b.attrs.with } : args } as Anthropic.ToolUseBlock, boardOnly, true);
    const failed = /^not /.test(String(r.content));
    if (!failed && !boardOnly) inlinePainted.push({ id: `inl_${nowMs.toString(36)}_${inlineN}`, raw: b.raw, label: `${b.kind}: ${b.body.replace(/\s+/g, ' ').slice(0, 160)}` });
    if (failed && !boardOnly) boardProblems.push(`${b.kind} "${b.body.replace(/\s+/g, ' ').slice(0, 60)}": ${String(r.content).replace(/^not painted: /, '')}`);
    return !failed;
  };
  const rawSpoken: string[] = [];
  const withdrawn: string[] = []; const withdrawnLabels: string[] = [];
  const inlinePainted: Array<{ id: string; raw: string; label: string }> = [];

  const waitingOnTutor = session.mode === 'voice' && input.studentSaid === null && Math.round(input.facts?.silenceSeconds ?? 0) === V2_NO_ASK_RECHECK_S;
  for (; modelCalls < V2_MAX_MODEL_CALLS;) {
    const params = {
      model: '',
      max_tokens: V2_MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: { effort: input.effort ?? V2_DEFAULT_EFFORT },
      system,
      tools,
      // The reply before this one ended on a statement and the student has waited: saying nothing again is not
      // open to the tutor (it stayed silent for 100 s after explaining the encomienda, embed-1794416183291).
      ...(waitingOnTutor ? { tool_choice: { type: 'none' } } : {}),
      messages,
    } as unknown as Anthropic.MessageCreateParamsNonStreaming;
    const inline = new BoardInlineStream();
    const take = (parts: InlinePart[]) => {
      for (const part of parts) {
        if ('opening' in part) { input.onBoardOpen?.(); continue; }
        if ('block' in part) { settleInline(part.block); continue; }
        if (firstTextMs === null && part.text.trim()) firstTextMs = Date.now() - t0;
        input.onText?.(part.text);
      }
    };
    const response = await callModel(params, (delta) => take(inline.push(delta)), input.signal);
    take(inline.flush());
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
    if (response.stop_reason !== 'tool_use' || results.length === 0) break;
    // The model is called again only when it has something to react to: a tool call that
    // did not do what was asked, or a reply with no words yet. When it has spoken and every
    // call worked, the turn is over — a second call tends to say the same thing again, and
    // costs the student a wait.
    const somethingFailed = results.some((r) => /^not /.test(String(r.content)));
    if (spoken.length > 0 && !somethingFailed) break;
    // Silence was the reply.
    if (toolCalls.some((c) => c.name === 'keep_listening')) break;
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
  const drewFigure = () => toolCalls.some((c) => V2_FIGURE_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome));
  const paintedSoFar = () => toolCalls.some((c) => !V2_CONTROL_TOOL_NAMES.has(c.name) && c.name !== 'new_page' && c.name !== 'go_to_page' && !/^not /.test(c.outcome));
  if (session.mode === 'voice' && !state.closed && !input.signal?.aborted && said && (speaksMaths(said) || inlinePainted.some((x) => !x.label.startsWith('problem')) || ((!paintedSoFar() || !drewFigure()) && said.split(/\s+/).length >= V2_UNWRITTEN_WORDS) || (opening && !paintedSoFar())) && modelCalls < V2_MAX_MODEL_CALLS && (input.boardPass ?? true)) {
    // The check has two halves. What was said and not written is added. What was written and should not have
    // been is withdrawn: a block that shows the step the reply asks the student to take (the board did the
    // differentiation the tutor had just asked for, embed-1794349966573). Board items wait for their sentence
    // in the voice client, so a withdrawal usually arrives before the item is shown.
    const others = toolCalls.filter((c) => !V2_CONTROL_TOOL_NAMES.has(c.name) && !/^not /.test(c.outcome) && !inlinePainted.some((x) => x.id === c.id)).map((c) => `${c.name}: ${summariseBoardCall(c.name, c.args)}`);
    const listed = [...inlinePainted.map((x, i) => `  ${i + 1}. ${x.label}`), ...others.map((x) => `  - ${x}`)];
    // What the reply said and the board does not hold is found here, not left to the model's eye: twice in one
    // lesson it spoke a standard form and wrote only the line before it (embed-1794414820031).
    const unwritten = unwrittenEquations(said, state.board.pages.flatMap((pg) => pg.items.map((it) => it.summary))).slice(0, 4);
    const askedOnCard = toolCalls.some((c) => c.name === 'show_problem' && !/^not /.test(c.outcome));
    const check = `[board check — from the system running the session, not from the student]\nYou have just said the reply above aloud. In it you put on the board: ${listed.length ? `\n${listed.join('\n')}` : 'nothing. A reply of this length that leaves the board untouched is a tutor talking at an empty board: unless it was only small talk or a question about what is already up, the heart of what you said belongs there, in the form that fits it.'}\n\nFirst, and rarely: does a numbered item state outright the answer to the very thing this reply asks the student to work out, so that reading the board answers your question for them? Only then, withdraw it by writing "withdraw N" on a line by itself. Everything else stays: an item that sets the question out, leaves a blank or a question mark for them to fill, lists things for them to compare, shows working the student has already given, or shows what you yourself explained. When unsure, it stays.\n\nSecond: what is only heard is lost. If something you said aloud that the student needs to hold on to is not on the board (the working behind a result, a step the student gave, a correction, a hint; a name, a date, a term, the two sides of a question), write it now as board blocks, in whichever kind fits, each with with="the opening words of the sentence in which you say it", for example <board equation with="The derivative of the top">…</board>. Write only what you said: nothing new, nothing already there, and never an answer you left for the student to find.${unwritten.length ? ` These equations were said aloud and no board item holds them: ${unwritten.map((e) => `"${e}"`).join('; ')}. Each goes up now as an equation, unless it is there in another form or is the answer the student is to find.` : ''}${askedOnCard ? '' : ' A question you set that comes with its own numbers, data or expression, none of them on the board, is written as a problem block holding the question as you asked it; a question about what is already on the board needs none.'}\n\nThird, a picture. Name to yourself the one thing in this reply a student could look at rather than read: an equation that is a curve, a function, points on axes, a set of data values or counts, pushes and pulls on a thing, values on a number line, events in order, the stages of a process, two things set side by side. If there is one and no figure of it is on the board, from this reply or still up from an earlier one, draw it now in the figure form that fits (graph, chart, forces, numberline, timeline, steps, cycle, web, map, compare, table), with with="…" as above. A formula written out is not a figure of its curve. Draw the situation as you described it, with the numbers you gave, never the answer the student is to find. What has no shape gets no figure.\n\nAnswer in three lines or groups, in this order. First: "withdraw N" or "1: none". Second: the missing blocks, or "2: none". Third: the figure block itself (saying it is drawn does not draw it), or "3: none" followed by a few words on why nothing here can be drawn.`;
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
      for (const m of passText.replace(/<board\b[\s\S]*?<\/board>/g, ' ').matchAll(/\bwithdraw\s*:?\s*#?(\d+)/gi)) {
        const gone = inlinePainted[Number(m[1]) - 1];
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
      for (const b of boardBlocksIn(passText)) {
        // One card a reply: the check adds a problem only when the reply set a question and put up no card.
        if (b.kind === 'problem' && (toolCalls.some((c) => c.name === 'show_problem' && !/^not /.test(c.outcome)) || !saidCovers(b.body, said))) continue;
        if (!settleInline(b, true)) continue;
        const textBlock = (lastWords?.content as Anthropic.ContentBlockParam[] | undefined)?.find((c): c is Anthropic.TextBlockParam => c.type === 'text');
        if (textBlock) textBlock.text = insertBlock(textBlock.text, b.raw.replace(/\s+with="[^"]*"/, ''), b.attrs.with);
      }
    } catch { /* the reply stands without it */ }
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
