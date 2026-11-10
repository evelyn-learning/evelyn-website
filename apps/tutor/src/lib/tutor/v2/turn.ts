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
import { applyToModelBoard } from './board';
import { V2_CONSTITUTION, v2ModeLines } from './constitution';
import { renderFacts, type V2TurnFacts } from './facts';
import { planGoalIds, renderPlanMap } from './plan-map';
import { V2_CONTROL_TOOL_NAMES, v2Tools } from './tools';
import type { GapStatus, GoalStatus, V2Board, V2BoardOutcome, V2Session, V2State, V2ToolCall, V2TurnResult } from './types';

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

export type V2ModelCall = (params: Anthropic.MessageCreateParamsNonStreaming, onText?: (delta: string) => void) => Promise<Anthropic.Message>;
export type V2BoardPort = (board: V2Board, id: string, name: string, args: Record<string, unknown>) => V2BoardOutcome;

export interface V2TurnInput {
  session: V2Session;
  state: V2State;
  /** The student's words. `null` when the tutor speaks unprompted: the start of the session, or a silence. */
  studentSaid: string | null;
  facts?: Omit<V2TurnFacts, 'nowMs'>;
  nowMs?: number;
  effort?: 'low' | 'medium' | 'high';
  callModel?: V2ModelCall;
  applyBoard?: V2BoardPort;
  onText?: (delta: string) => void;
  /** Called as each tool call is settled, in order, before the turn returns. */
  onToolCall?: (call: V2ToolCall) => void;
}

export function v2SessionPart(session: V2Session): string {
  const lines = [
    'THIS SESSION',
    `Student: ${session.studentName?.trim() || 'name not given'}. Subject: ${session.subject}. Level: ${session.level}.`,
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

const defaultModelCall: V2ModelCall = async (params, onText) => {
  const { client, model } = getModelClient('brain');
  const stream = client.messages.stream({ ...params, model: params.model || model });
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

function applyControlTool(state: V2State, session: V2Session, name: string, args: Record<string, unknown>): string {
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
  const tools = v2Tools(session.subject);
  let messages: Anthropic.MessageParam[] = [...withCacheMark(state.history), userNow];

  const stored: Anthropic.MessageParam[] = [{ role: 'user', content: [{ type: 'text', text: studentText }] }];
  const spoken: string[] = [];
  const toolCalls: V2ToolCall[] = [];
  const usage = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };
  const t0 = Date.now();
  let firstTextMs: number | null = null;
  let modelCalls = 0;

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
    const response = await callModel(params, (delta) => {
      if (firstTextMs === null && delta.trim()) firstTextMs = Date.now() - t0;
      input.onText?.(delta);
    });
    modelCalls += 1;
    usage.inputTokens += response.usage.input_tokens;
    usage.outputTokens += response.usage.output_tokens;
    usage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0;
    usage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === 'text') { if (block.text.trim()) spoken.push(block.text.trim()); continue; }
      if (block.type !== 'tool_use') continue;
      const args = (block.input ?? {}) as Record<string, unknown>;
      let outcome: string;
      if (V2_CONTROL_TOOL_NAMES.has(block.name)) {
        outcome = applyControlTool(state, session, block.name, args);
      } else {
        const valid = validateToolCall(block.name, args);
        if (!valid.ok) outcome = `not painted: ${valid.reason}`;
        else { const o = applyBoard(state.board, block.id, block.name, args); outcome = o.painted ? o.detail : `not painted: ${o.detail}`; }
      }
      const call: V2ToolCall = { id: block.id, name: block.name, args, outcome };
      toolCalls.push(call);
      input.onToolCall?.(call);
      results.push({ type: 'tool_result', tool_use_id: block.id, content: outcome });
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
    // Within the turn the model's own content goes back whole (thinking included).
    messages = [...messages, { role: 'assistant', content: response.content as unknown as Anthropic.ContentBlockParam[] }, { role: 'user', content: results }];
  }

  state.history = [...state.history, ...stored];
  return { spoken: spoken.join('\n\n'), toolCalls, state, usage, firstTextMs, totalMs: Date.now() - t0, modelCalls };
}
