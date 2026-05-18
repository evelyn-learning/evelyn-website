/**
 * STAGE 0 measurement — tutor brain prompt token accounting.
 *
 * Pure measurement. Calls anthropic.messages.countTokens (billed $0, no
 * inference). Reconstructs the EXACT {system, tools, messages} payload the
 * brain SDK call assembles (claude-brain.ts streamBrainTurn) for a
 * representative plan-driven session, and reports per-block token counts +
 * the static (cached-prefix) vs dynamic (per-turn) split.
 *
 * Does NOT touch any voice path. Run:
 *   npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/measure-brain-prompt-tokens.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { WHITEBOARD_TOOLS, toAnthropicTools } from '@/app/tutor/hooks/toolDefinitions';
import {
  formatLessonPlanContext,
  formatSegmentTruth,
  buildWhiteboardSummary,
  type LessonPlanContext,
} from '@/lib/tutor/voice/claude-brain';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-6';

const tools = toAnthropicTools(WHITEBOARD_TOOLS) as Anthropic.MessageCountTokensParams['tools'];

// ---- (a) system text — built exactly as VoiceTutorRealtime does -----------
// buildSystemPrompt(...) then the openAIInstructions voice wrapper appended
// in VoiceTutorRealtime.tsx ~7439. Representative plan-driven session.
const baseSystemPrompt = buildSystemPrompt({
  module: null,
  studentName: 'Alex',
  sessionGoal: 'concept-review',
  timeRemainingMinutes: 30,
  currentState: 'greeting',
  subject: 'math',
  topic: 'slope of a line',
  level: '8',
  studentPreferences: undefined,
});
const voicePersonality =
  'Be upbeat, enthusiastic, and warm. Use an encouraging and energetic tone — like a favorite teacher who genuinely loves the subject. Celebrate small wins ("Nice!", "Exactly!", "You\'re getting it!"). Vary your energy to keep the student engaged.';
const systemPrompt = `${baseSystemPrompt}

## Voice Personality & Tone
${voicePersonality}

## Voice Interaction Guidelines
- You are in a real-time voice conversation. Responses are spoken aloud.
- Keep responses concise: 1-3 sentences for most exchanges.
- Use natural conversational speech patterns.
- React naturally to student responses - you'll hear them in real-time.
- If the student interrupts, acknowledge it and adjust your response.

## Visual Tools

Whiteboard tool rules and the structured-tool catalog are covered in the system prompt above. Two reminders specific to the realtime voice channel:

- **One question, one visual.** Render only the visual that directly answers what the student asked. Do NOT add an unrequested second diagram (e.g. a Lewis structure alongside a reaction-coordinate diagram, a timeline alongside a map). Extra visuals clutter the board.
- **Final-answer equation.** When a problem is solved, close with show_equation whose label is "Final Answer" and whose latex restates the original problem on the left and the result on the right (e.g. "\\\\int_0^2 (4x - x^2)\\\\, dx = \\\\frac{16}{3}"). One-line glanceable summary.

Open with "Hey [name]!" — three words. Wait for the student.`;

// ---- (c) representative per-turn userContent sub-blocks --------------------
const segments = [
  { id: 'intro', kind: 'concept', goal: 'Introduce slope as rise over run.', keyIdeas: ['slope = Δy/Δx', 'positive vs negative slope'] },
  { id: 'lo1-worked', kind: 'worked_example', problem: 'Find the slope of the line through (1, 2) and (4, 11).', goal: 'Model the slope formula on a concrete pair of points.' },
  { id: 'lo1-try', kind: 'try_yourself', problem: 'Find the slope of the line through (2, 3) and (5, 12).', expectedAnswer: '3' },
  { id: 'lo2-misc', kind: 'misconception_check', question: 'A student says a vertical line has slope 0. Is that right?', goal: 'Surface the undefined-slope misconception.' },
  { id: 'lo2-try', kind: 'try_yourself', problem: 'What is the slope of the line x = 4?', expectedAnswer: 'undefined' },
  { id: 'lo3-ext', kind: 'extension', advancedQuestion: 'Two lines are perpendicular. One has slope 2/3. What is the slope of the other?', goal: 'Connect slope to perpendicularity.' },
];
const lessonPlanContext: LessonPlanContext = {
  plan: {
    id: 'math-slope-g8',
    title: 'Slope of a Line',
    grade: '8',
    subject: 'math',
    estimatedMinutes: 30,
    los: [
      { id: 'lo1', description: 'Compute slope from two points using rise over run.' },
      { id: 'lo2', description: 'Recognize zero, undefined, positive, and negative slope.' },
      { id: 'lo3', description: 'Relate slope to parallel and perpendicular lines.' },
    ],
  },
  currentSegmentId: 'lo1-try',
  currentSegment: segments[2],
  segmentIndex: segments.map((s) => ({ id: s.id, kind: s.kind })),
  completedSegmentIds: ['intro', 'lo1-worked'],
};
const lessonBlock = `<lesson_plan>\n${formatLessonPlanContext(lessonPlanContext)}\n</lesson_plan>\n\n`;
const truthBody = formatSegmentTruth(lessonPlanContext.currentSegment);
const truthBlock = truthBody ? `<segment_truth>\n${truthBody}\n</segment_truth>\n\n` : '';

// Representative mid-session whiteboard (a problem card + an equation + a graph).
const wbSnapshot = [
  { id: 'r1', kind: 'showProblem', summary: 'Find the slope of the line through (2, 3) and (5, 12).', segmentId: 'lo1-try' },
  { id: 'r2', kind: 'show_equation', summary: 'm = (12 - 3) / (5 - 2)', segmentId: 'lo1-try' },
  { id: 'r3', kind: 'show_function_graph', summary: 'line through (2,3) and (5,12), slope 3', segmentId: 'lo1-try' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any;
const whiteboardBlock = `<whiteboard_state>\n${buildWhiteboardSummary(wbSnapshot)}\n</whiteboard_state>\n\n`;
const activeProblemBlock =
  `<active_problem>\nThis is the problem the student is currently working on. Verify their answers — and any narration that references "the problem" / numbers / data — against THIS statement only. Earlier problem cards may still be visible in <whiteboard_state> (the runtime keeps them for scroll-back); ignore them when reasoning about the current attempt. If you called generate_problem this session, the canonicalText that came back IS the active problem; the anchor problem you passed in was calibration only and is no longer the focus.\n\nStatement: Find the slope of the line through (2, 3) and (5, 12).\n</active_problem>\n\n`;
const studentSaid = `<student_said>\n(12-3)/(5-2) = 9/3 = 3\n</student_said>`;

const userContentTurnN =
  lessonBlock + truthBlock + activeProblemBlock + whiteboardBlock + studentSaid;

// ---- (d) conversation history at representative session lengths ------------
const oneExchange = (i: number): Anthropic.MessageParam[] => [
  { role: 'user', content: `<whiteboard_state>\n(board state turn ${i})\n</whiteboard_state>\n\n<student_said>\nHere is my work for step ${i}: I used the slope formula and got an intermediate value.\n</student_said>` },
  { role: 'assistant', content: `Nice work on step ${i}. Let's check it together — the rise is the change in y and the run is the change in x, so plug those in and tell me what you get.` },
];
const history = (turns: number): Anthropic.MessageParam[] =>
  Array.from({ length: turns }, (_, i) => oneExchange(i + 1)).flat();

// ---------------------------------------------------------------------------
async function count(label: string, params: Anthropic.MessageCountTokensParams): Promise<number> {
  const r = await anthropic.messages.countTokens(params);
  console.log(`  ${label.padEnd(46)} ${String(r.input_tokens).padStart(8)} tok`);
  return r.input_tokens;
}

async function main() {
  console.log(`\n=== STAGE 0: tutor brain prompt token accounting (${MODEL}) ===\n`);
  console.log('count_tokens billed at $0 (no inference). Numbers are exact.\n');

  const minimalMsg: Anthropic.MessageParam[] = [{ role: 'user', content: 'x' }];

  console.log('--- CACHED PREFIX (static — written once / 5-min TTL, read every turn) ---');
  const sysOnly = await count('(a) system text alone', { model: MODEL, system: systemPrompt, messages: minimalMsg });
  const toolsOnly = await count('(b) tools array alone', { model: MODEL, tools, messages: minimalMsg });
  const prefix = await count('cached prefix = system + tools (+1 tok msg)', { model: MODEL, system: systemPrompt, tools, messages: minimalMsg });
  console.log(`    → cached-prefix overhead read EVERY brain SDK call (per agent-loop iteration).\n`);

  console.log('--- PER-TURN DYNAMIC (uncached — full price every turn, after the breakpoint) ---');
  await count('(c) lesson_plan block', { model: MODEL, messages: [{ role: 'user', content: lessonBlock }] });
  await count('(c) segment_truth block', { model: MODEL, messages: [{ role: 'user', content: truthBlock || '(empty)' }] });
  await count('(c) active_problem block', { model: MODEL, messages: [{ role: 'user', content: activeProblemBlock }] });
  await count('(c) whiteboard_state block (mid-session)', { model: MODEL, messages: [{ role: 'user', content: whiteboardBlock }] });
  await count('(c) student_said block', { model: MODEL, messages: [{ role: 'user', content: studentSaid }] });
  await count('(c) full userContent (last user msg)', { model: MODEL, messages: [{ role: 'user', content: userContentTurnN }] });
  console.log('    NOTE: profile/unrealized_marks/dedup/student_state/pace_pref/topic_notes');
  console.log('    blocks self-suppress on typical turns (~0 tok) — omitted here.\n');

  console.log('--- CONVERSATION HISTORY (uncached — grows unbounded, GAP 1) ---');
  for (const t of [1, 10, 20]) {
    const msgs = [...history(t), { role: 'user' as const, content: userContentTurnN }];
    await count(`history ${String(t).padStart(2)} turns + userContent`, { model: MODEL, messages: msgs });
  }

  console.log('\n--- FULL REQUEST (what the brain actually sends), by session length ---');
  for (const t of [1, 10, 20]) {
    const msgs = [...history(t), { role: 'user' as const, content: userContentTurnN }];
    const total = await count(`turn @ ${String(t).padStart(2)}-turn history (system+tools+msgs)`, { model: MODEL, system: systemPrompt, tools, messages: msgs });
    const dyn = total - prefix + 1; // +1 undoes the placeholder msg in `prefix`
    console.log(`      → cached≈${prefix - 1}  dynamic≈${dyn}  (cached share ${((prefix / total) * 100).toFixed(1)}%)`);
  }

  // Sonnet 4.6 standard pricing, $/MTok.
  const P = { in: 3, out: 15, cacheWrite5m: 3.75, cacheWrite1h: 6, cacheRead: 0.3 };
  const dyn1 = (await anthropic.messages.countTokens({ model: MODEL, messages: [{ role: 'user', content: userContentTurnN }] })).input_tokens;
  console.log('\n--- COST MODEL (Sonnet 4.6 standard $/MTok: in 3 / out 15 / write5m 3.75 / read 0.30) ---');
  const create = ((prefix - 1) / 1e6) * P.cacheWrite5m;
  const read = ((prefix - 1) / 1e6) * P.cacheRead;
  console.log(`  one-time cache CREATE of prefix (turn 1 / post >5min gap): $${create.toFixed(4)}`);
  console.log(`  cache READ of prefix, per agent-loop ITERATION:            $${read.toFixed(4)}`);
  console.log(`  → a 1-tool turn ≈ 2 iterations ≈ $${(read * 2).toFixed(4)} read; a 4-tool turn ≈ 5 ≈ $${(read * 5).toFixed(4)}`);
  console.log(`  uncached userContent (~${dyn1} tok) @ in: $${((dyn1 / 1e6) * P.in).toFixed(4)} / iteration`);
  console.log(`  ttl:'1h' write premium vs 5m: $${(((prefix - 1) / 1e6) * (P.cacheWrite1h - P.cacheWrite5m)).toFixed(4)} once; avoids a full $${create.toFixed(4)} re-create per >5-min gap.`);
  console.log('\n=== done ===\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
