/**
 * Tutor brain v2 — the tool set.
 *
 * A session gets the few board tools its subject needs plus three control
 * tools. Board tools reuse the v1 input schemas (so the existing renderer and
 * validateToolCall accept them unchanged) under short descriptions: how to use
 * the board is said once, in the constitution.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { WHITEBOARD_TOOLS } from '@/app/tutor/hooks/toolDefinitions';

const BOARD_DESCRIPTIONS: Record<string, string> = {
  show_equation: 'Put mathematics on the board, in LaTeX: one equation, or several lines of working in an aligned environment, one step per line. Mathematics only: words and sentences go in a note (annotate), never inside \\text{}. Optional short label.',
  annotate: 'Put a note in words on the board: a rule or its conditions stated in words, the steps of a method, a name or spelling, a recap. One point per line, lines separated by a newline. Mathematics inside it goes between single dollar signs. Style: highlight for a key idea, warning for a trap.',
  show_problem: 'Put a problem for the student on the board. Use this whenever you pose a problem.',
  show_worked_example: 'Put a worked example on the board: the problem and its steps.',
  show_function_graph: 'Draw the graph of one or more functions.',
  show_table: 'Put a small table on the board.',
  show_number_line: 'Draw a number line with marked points or intervals.',
  show_geometry: 'Draw a geometric figure.',
  highlight: 'Draw attention to something already on the board.',
  new_page: 'Start a new board page with a title. Use when the subject changes.',
  go_to_page: 'Go back to an earlier board page.',
};

/** Board tools every session gets, then extras by subject. */
/** Equations, notes and problems are written inline in the reply (board-inline.ts), not called as tools. */
const CORE = ['highlight', 'new_page', 'go_to_page'];
const BY_SUBJECT: Record<string, string[]> = {
  math: ['show_function_graph', 'show_table', 'show_number_line', 'show_geometry'],
  science: ['show_function_graph', 'show_table'],
};

export const V2_CONTROL_TOOLS: Anthropic.Tool[] = [
  {
    name: 'keep_listening',
    description: 'Say nothing this turn and keep listening. For when the student is thinking aloud, working, or has not finished what they were saying. Call it alone, with no words.',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'update_session_note',
    description: 'Replace your private session note. Call it whenever what you know about the student, what has been covered, what is open or what you plan next has changed.',
    input_schema: { type: 'object', properties: { note: { type: 'string', description: 'The whole note, rewritten. A few short lines.' } }, required: ['note'] },
  },
  {
    name: 'set_goal_status',
    description: 'Record progress on one goal of the lesson plan.',
    input_schema: {
      type: 'object',
      properties: {
        goal: { type: 'string', description: 'The goal id from the plan, as written in square brackets.' },
        status: { type: 'string', enum: ['shown', 'demonstrated', 'skipped'] },
        why: { type: 'string', description: 'A few words. Required for skipped.' },
      },
      required: ['goal', 'status'],
    },
  },
  {
    name: 'track_gap',
    description: 'Record a gap in what the student knows (a forgotten rule, an unknown word, a wrong idea), or update how far it has been worked on. The list is shown back to you every turn.',
    input_schema: {
      type: 'object',
      properties: {
        what: { type: 'string', description: 'The gap, in a few words. Use the same words when you update it.' },
        status: { type: 'string', enum: ['found', 'explained', 'done_with_help', 'done_alone'], description: 'found: you have seen it. explained: you told or showed them. done_with_help: they did one with a hint or a prompt. done_alone: they did one unprompted.' },
      },
      required: ['what', 'status'],
    },
  },
  {
    name: 'end_lesson',
    description: 'End the session. Call it in the same reply as your closing words.',
    input_schema: { type: 'object', properties: { because: { type: 'string', enum: ['student_asked', 'time_nearly_used'], description: 'Why the session is ending.' }, summary: { type: 'string', description: 'One or two sentences on what the student did and what to look at next.' } }, required: ['because', 'summary'] },
  },
];

export { V2_CONTROL_TOOL_NAMES } from './tool-names';

export function v2BoardToolNames(subject: string): string[] {
  return [...CORE, ...(BY_SUBJECT[subject] ?? [])];
}

/** When, within the spoken reply, a board item appears. The reply is generated in a second or two and
 *  spoken over twenty: without this everything is painted at once, and the student is looking at the next
 *  problem while still hearing about the last one (Praveen, embed-1794336536781). The runtime takes the
 *  argument off before the tool runs (turn.ts) and the voice client holds the item until that sentence
 *  starts playing (TutorVoiceV2). */
export const SAY_WITH = 'say_with';
const SAY_WITH_SCHEMA = { type: 'string', description: 'Spoken lessons: the first few words, copied exactly, of the sentence in this reply that this belongs with. It appears on the board as you begin saying that sentence. Leave it out and it appears as you start speaking.' };

/** The tools for a session, in a stable order (the list is part of the cached prefix). */
export function v2Tools(subject: string): Anthropic.Tool[] {
  const byName = new Map((WHITEBOARD_TOOLS as Array<{ name: string; parameters: unknown }>).map((t) => [t.name, t]));
  const board: Anthropic.Tool[] = [];
  for (const name of v2BoardToolNames(subject)) {
    const def = byName.get(name);
    if (!def) continue;
    const schema = def.parameters as { properties?: Record<string, unknown> };
    board.push({ name, description: BOARD_DESCRIPTIONS[name] ?? name, input_schema: { ...schema, properties: { ...(schema.properties ?? {}), [SAY_WITH]: SAY_WITH_SCHEMA } } as Anthropic.Tool.InputSchema });
  }
  return [...board, ...V2_CONTROL_TOOLS];
}
