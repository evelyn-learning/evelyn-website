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
  show_table: 'Put a small table on the board: a comparison, or values side by side.',
  show_timeline: 'Put a timeline of dated events on the board.',
  show_number_line: 'Draw a number line with marked points or intervals.',
  show_geometry: 'Draw a geometric figure.',
  show_venn_diagram: 'Draw a two- or three-set Venn diagram, with a value or items in each region.',
  show_tree: 'Draw a tree diagram: a probability tree with a probability on each branch, or a factor or decision tree.',
  show_stats: 'Draw a statistical plot: a boxplot, dot plot, histogram or bar chart of data.',
  show_free_body_diagram: 'Draw a free-body diagram: one object and the forces on it as labelled arrows, each with a direction and, when known, a size.',
  show_lewis_constructed: 'Draw a Lewis structure from its atoms and bonds; lone pairs are worked out for you.',
  highlight: 'Draw attention to something already on the board.',
  new_page: 'Start a new board page with a title. Use when the subject changes.',
  go_to_page: 'Go back to an earlier board page.',
};

/** Board tools every session gets, then extras by subject. */
/** Equations, notes and problems are written inline in the reply (board-inline.ts), not called as tools. */
/** A new page is an inline block too (<board page>): as a tool it cost a second model call, and a reply that
 *  called it stopped there, with a promise and a blank page, or with no words at all (browser runs, 2026-11-11). */
const CORE: string[] = [];
/** Which structured figures a lesson can draw, by what it is about. Graphs, number lines, force diagrams,
 *  tables and the rest are inline forms open to every lesson (board-inline.ts); a tool is kept only for a
 *  figure that needs structured arguments, and only in a lesson where it can belong (a function-graph tool
 *  in a grade 8 forces lesson produced an empty grid). */
function figureTools(subject: string, topic: string): string[] {
  const t = `${subject} ${topic}`.toLowerCase();
  const out: string[] = [];
  // Shapes, angles and constructions only. In a lesson about curves it was used for a parabola and drew points
  // and a line with no curve (embed-1794374818774); curves and points on axes are the inline graph.
  if (/geometr|trig/.test(t)) out.push('show_geometry');
  if (/statistic|probab|\bstats\b|data/.test(t)) out.push('show_venn_diagram', 'show_tree', 'show_stats');
  if (/chem/.test(t)) out.push('show_lewis_constructed');
  return out;
}

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
    input_schema: { type: 'object', properties: { because: { type: 'string', enum: ['student_asked', 'time_nearly_used'], description: 'Why the session is ending.' }, summary: { type: 'string', description: 'One or two sentences on what the student did and what to look at next.' }, needs_practice: { type: 'array', items: { type: 'integer' }, description: 'In a lesson with a plan: the numbers of the plan\'s objectives ("What the student should be able to do afterwards") the student has not yet shown they can do alone. Practice on those is set for them after the session, where their course keeps it. Leave it out when there are none.' } }, required: ['because', 'summary'] },
  },
];

export { V2_CONTROL_TOOL_NAMES } from './tool-names';

export function v2BoardToolNames(subject: string, topic = ''): string[] {
  return [...CORE, ...figureTools(subject, topic)];
}

/** When, within the spoken reply, a board item appears. The reply is generated in a second or two and
 *  spoken over twenty: without this everything is painted at once, and the student is looking at the next
 *  problem while still hearing about the last one (Praveen, embed-1794336536781). The runtime takes the
 *  argument off before the tool runs (turn.ts) and the voice client holds the item until that sentence
 *  starts playing (TutorVoiceV2). */
export const SAY_WITH = 'say_with';
const SAY_WITH_SCHEMA = { type: 'string', description: 'Spoken lessons: the first few words, copied exactly, of the sentence in this reply that this belongs with. It appears on the board as you begin saying that sentence. Leave it out and it appears as you start speaking.' };

/** The tools for a session, in a stable order (the list is part of the cached prefix). */
export function v2Tools(subject: string, topic = ''): Anthropic.Tool[] {
  const byName = new Map((WHITEBOARD_TOOLS as Array<{ name: string; parameters: unknown }>).map((t) => [t.name, t]));
  const board: Anthropic.Tool[] = [];
  for (const name of v2BoardToolNames(subject, topic)) {
    const def = byName.get(name);
    if (!def) continue;
    const schema = def.parameters as { properties?: Record<string, unknown> };
    board.push({ name, description: BOARD_DESCRIPTIONS[name] ?? name, input_schema: { ...schema, properties: { ...(schema.properties ?? {}), [SAY_WITH]: SAY_WITH_SCHEMA } } as Anthropic.Tool.InputSchema });
  }
  return [...board, ...V2_CONTROL_TOOLS];
}
