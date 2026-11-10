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
  show_equation: 'Put one equation or expression on the board, in LaTeX. Optional short label.',
  show_problem: 'Put a problem for the student on the board. Use this whenever you pose a problem.',
  show_worked_example: 'Put a worked example on the board: the problem and its steps.',
  show_function_graph: 'Draw the graph of one or more functions.',
  show_table: 'Put a small table on the board.',
  show_number_line: 'Draw a number line with marked points or intervals.',
  show_geometry: 'Draw a geometric figure.',
  tutor_handwrite: 'Write a short line of plain text on the board.',
  highlight: 'Draw attention to something already on the board.',
  new_page: 'Start a new board page with a title. Use when the subject changes.',
  go_to_page: 'Go back to an earlier board page.',
};

/** Board tools every session gets, then extras by subject. */
const CORE = ['show_equation', 'show_problem', 'show_worked_example', 'tutor_handwrite', 'highlight', 'new_page', 'go_to_page'];
const BY_SUBJECT: Record<string, string[]> = {
  math: ['show_function_graph', 'show_table', 'show_number_line', 'show_geometry'],
  science: ['show_function_graph', 'show_table'],
};

export const V2_CONTROL_TOOLS: Anthropic.Tool[] = [
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
    input_schema: { type: 'object', properties: { summary: { type: 'string', description: 'One or two sentences on what the student did and what to look at next.' } }, required: ['summary'] },
  },
];

export { V2_CONTROL_TOOL_NAMES } from './tool-names';

export function v2BoardToolNames(subject: string): string[] {
  return [...CORE, ...(BY_SUBJECT[subject] ?? [])];
}

/** The tools for a session, in a stable order (the list is part of the cached prefix). */
export function v2Tools(subject: string): Anthropic.Tool[] {
  const byName = new Map((WHITEBOARD_TOOLS as Array<{ name: string; parameters: unknown }>).map((t) => [t.name, t]));
  const board: Anthropic.Tool[] = [];
  for (const name of v2BoardToolNames(subject)) {
    const def = byName.get(name);
    if (!def) continue;
    board.push({ name, description: BOARD_DESCRIPTIONS[name] ?? name, input_schema: def.parameters as Anthropic.Tool.InputSchema });
  }
  return [...board, ...V2_CONTROL_TOOLS];
}
