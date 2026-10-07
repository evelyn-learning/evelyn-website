/**
 * Computed facts of a system / inequality problem, and a tutor sentence held
 * to them (src/lib/tutor/whiteboard/inequality-facts.ts) — plus where the
 * facts are delivered: the graph's board description, the brain's per-turn
 * content, the verdict pre-check, the judge.
 *
 * Fixtures: the owner's two live sessions of 2026-10-06 (build
 * nSxYU92obl4HOXChKRkXx) — portal-2de3c6c8 (text) and portal-10beb4f5 (voice).
 * Problem: solve 2x + y < 4 and x − 3y > 2 by graphing. Truth: y < −2x + 4 and
 * y < (x − 2)/3, both dashed, the solution BELOW BOTH lines, crossing (2, 0);
 * (0, 0) is not a solution, (0, −5) is.
 *
 * No model is called: the brain client is stubbed.
 *
 * Run: npx tsx scripts/test-inequality-facts.ts
 */
import { strict as assert } from 'node:assert';
import {
  boardInequalityFacts,
  buildInequalityFacts,
  colorName,
  formatFactNumber,
  formatInequalityFactsBlock,
  formatInequalityFactsText,
  graphRegionFactParts,
  INEQUALITY_FACTS_LEAD,
  problemInequalityFacts,
  spokenRegionContradiction,
  spokenRegionFeedback,
  GRAPH_COLORS,
} from '../src/lib/tutor/whiteboard/inequality-facts';
import { parseXYRelation } from '../src/lib/tutor/whiteboard/graph-inequalities';
import { graphCurveFeatures } from '../src/lib/tutor/whiteboard/graph-features';
import { buildManifestForCommand } from '../src/lib/tutor/diagrams/manifests';
import { WhiteboardCatalog } from '../src/lib/tutor/whiteboard/catalog';
import { buildWhiteboardSummary } from '../src/lib/tutor/whiteboard/summary';
import { buildJudgeUserContent, JUDGE_SYSTEM_PROMPT } from '../src/lib/tutor/judge-prompt';
import {
  AMBIGUOUS_READING_RULE,
  buildVerdictPrecheckUser,
  runVerdictPrecheck,
  verdictPrecheckSystem,
  VERDICT_PRECHECK_SYSTEM,
  type VerdictPrecheckLlm,
} from '../src/lib/tutor/voice/verdict-precheck';
import { AMBIGUOUS_READING_TEXT_RULE, formatWorkThenMatchBlock } from '../src/lib/tutor/voice/work-then-match';
import { AMBIGUOUS_READING_VOICE_RULE, formatVoiceWorkThenMatchBlock } from '../src/lib/tutor/voice/voice-judging';
import { classifyTurnShape } from '../src/lib/tutor/voice/turn-shape-signal';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.error(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 3).join(' | ')}`); }
}

// ── fixtures, verbatim from the session documents ───────────────────────────
const TEXT_STATEMENT = 'Solve the system of inequalities $2x + y < 4$ and $x - 3y > 2$ using graphs.';
const VOICE_STATEMENT = 'Solve the system of inequalities graphically: $2x + y < 4$ and $x - 3y > 2$.';
/** Text session, showGraph-1: the two boundary lines, no colours given. */
const TEXT_GRAPH_LINES = {
  title: 'Boundary lines for both inequalities', xRange: [-6, 6], yRange: [-6, 6],
  functions: [
    { latex: '-2x+4', fn: '-2x+4', label: 'y = -2x + 4', lineStyle: 'dashed' },
    { latex: '(x-2)/3', fn: '(x-2)/3', label: 'y = (x-2)/3', lineStyle: 'dashed' },
  ],
  functionsOfY: [], points: [{ x: 0, y: 0, label: '(0, 0)' }],
};
/** Text session, showGraph-2: the shaded solution. */
const TEXT_GRAPH_REGION = {
  title: 'Solution region for the system', xRange: [-5, 5], yRange: [-5, 5], functions: [], functionsOfY: [], points: [],
  inequalities: [
    { expr: 'y < -2x + 4', latex: 'y<\\left(-2\\right)\\cdot x+4', strict: true, color: '#2563eb', label: '2x+y<4' },
    { expr: 'y < (x-2)/3', latex: 'y<\\frac{x-2}{3}', strict: true, color: '#dc2626', label: 'x-3y>2' },
  ],
};
/** Voice session, showGraph-1: lines AND shading, blue and green. */
const VOICE_GRAPH = {
  title: 'System: $2x+y<4$ and $x-3y>2$', xRange: [-6, 6], yRange: [-6, 6],
  functions: [
    { latex: '-2x+4', fn: '-2x+4', color: 'blue', label: 'y = -2x + 4', lineStyle: 'dashed' },
    { latex: '(1/3)x - 2/3', fn: '(1/3)x - 2/3', color: 'green', label: 'y = (1/3)x - 2/3', lineStyle: 'dashed' },
  ],
  functionsOfY: [], points: [],
  inequalities: [
    { expr: 'y < -2x + 4', strict: true, color: 'blue', label: '2x+y<4' },
    { expr: 'y < (1/3)x - 2/3', strict: true, color: 'green', label: 'x-3y>2' },
  ],
};

/** The four sentences of the text session that stated the wrong region. */
const WRONG_SENTENCES: Array<[string, RegExp]> = [
  ['Since (0,0) makes the first inequality true and the second false, the solution region is below the first line but above the second — the overlapping wedge between them.', /above the second/],
  ['The darker overlapping wedge below the blue line and above the red line is your solution — the region satisfying both inequalities at once.', /above the red line/],
  ['Since (0,0) fails $y<\\frac{x-2}{3}$ (0 isn\'t less than -2/3), the solution region must be *above* that red line, not below it — that\'s where our values part ways.', /above that red line/],
  ['So the solution region sits below the blue line and above the red line, which is exactly that darker wedge shown on the board.', /above the red line/],
];
/** Correct sentences (both sessions) — none may fire. */
const RIGHT_SENTENCES = [
  // text session: true statements about a POINT
  'So $(0,0)$ sits *above* this second line, not below it.',
  'So (0,0) sits above this second line.',
  'At x=0, the red line sits at y=-2/3.',
  // voice session
  "Working it from $y < \\frac{1}{3}x - \\frac{2}{3}$: the inequality says $y$ is *less than* that line's values, so the shaded region sits below the line, not above it.",
  "That's the opposite of what you said — the region for $x - 3y > 2$ is below the dashed line.",
  'Picture a point like $(0,-5)$, well below that line — plugging into $y < \\frac{1}{3}x - \\frac{2}{3}$ should hold true.',
  'Right — below the line.',
  "Look at the overlapping wedge — it's the region that sits *below* the first dashed line, $y < -2x + 4$, *and also* below the second dashed line, $y < \\frac{1}{3}x - \\frac{2}{3}$.",
  'That double-below region, the darkest patch, is the one satisfying both inequalities at once.',
  'The darkest wedge sits below both dashed lines — below $y < -2x + 4$ and below $y < \\frac{1}{3}x - \\frac{2}{3}$ at the same time.',
  "That's exactly what you said: below both lines.",
  'Good — checking (0,-5) against both lines confirms it sits in the region below both dashed boundaries, matching the double-shaded overlap we expected.',
  'Since the test point makes $x - 3y > 2$ false, we shade the side *away* from the origin for this one.',
  // questions, alternatives, negations, conditionals, quotes
  'Is the solution region above or below the blue line?',
  'Is the shaded region above the red line?',
  "The solution region isn't above the red line.",
  'If the solution region were above the red line, the origin would be in it.',
  'You said the shaded region is above the red line — the working gives the other side.',
  'The solution region is below the blue line and below the red line.',
  'The shaded region is below the green line.', // no green line on the text graph: not ours to judge
];

async function main() {
  const facts = problemInequalityFacts(TEXT_STATEMENT, TEXT_GRAPH_REGION)!;

  console.log('\nthe facts');
  await test('both statements parse to the same facts', () => {
    const a = problemInequalityFacts(TEXT_STATEMENT)!;
    const b = problemInequalityFacts(VOICE_STATEMENT)!;
    assert.ok(a && b);
    assert.equal(formatInequalityFactsText(a), formatInequalityFactsText(b));
  });
  await test('solved forms, sides, boundary style', () => {
    const [f1, f2] = facts.inequalities;
    assert.deepEqual([f1.source, f1.solved, f1.boundary, f1.side, f1.strict], ['2x + y < 4', 'y < -2x + 4', 'y = -2x + 4', 'below', true]);
    assert.deepEqual([f2.source, f2.solved, f2.boundary, f2.side, f2.strict], ['x - 3y > 2', 'y < (1/3)x - 2/3', 'y = (1/3)x - 2/3', 'below', true]);
  });
  await test('the boundaries cross at (2, 0), which is not a solution (dashed)', () => {
    assert.equal(facts.crossings.length, 1);
    assert.ok(Math.abs(facts.crossings[0].x - 2) < 1e-9 && Math.abs(facts.crossings[0].y) < 1e-9);
    assert.equal(facts.crossings[0].inSolution, false);
  });
  await test('outside point is the ORIGIN (off both boundaries) with per-inequality truth; inside point is a solution', () => {
    assert.deepEqual([facts.outside!.x, facts.outside!.y, facts.outside!.inSolution], [0, 0, false]);
    assert.deepEqual(facts.outside!.truths.map((t) => [t.values, t.holds]), [['0 < 4', true], ['0 > 2', false]]);
    assert.equal(facts.inside!.inSolution, true);
    assert.ok(facts.inside!.truths.every((t) => t.holds));
    // …and the owner's own check point is a solution by the same relations.
    assert.ok(facts.inequalities.every((f) => f.relation.holds(0, -5)));
    assert.ok(!facts.inequalities.every((f) => f.relation.holds(0, 0)));
  });
  await test('lines as DRAWN: colour and legend label, per graph', () => {
    assert.deepEqual(facts.inequalities.map((f) => [f.drawn?.color, f.drawn?.label]), [['blue', '2x+y<4'], ['red', 'x-3y>2']]);
    // Functions only, no colours given: the renderer's palette order.
    const lines = problemInequalityFacts(TEXT_STATEMENT, TEXT_GRAPH_LINES)!;
    assert.deepEqual(lines.inequalities.map((f) => f.drawn?.color), ['blue', 'red']);
    const voice = problemInequalityFacts(VOICE_STATEMENT, VOICE_GRAPH)!;
    assert.deepEqual(voice.inequalities.map((f) => f.drawn?.color), ['blue', 'green']);
    assert.equal(problemInequalityFacts(TEXT_STATEMENT)!.hasGraph, false);
  });
  await test('the newest graph on the board that draws the problem supplies the colours', () => {
    const cmds = [
      { action: 'showProblem', problem: { statement: TEXT_STATEMENT } },
      { action: 'showGraph', data: VOICE_GRAPH },
      { action: 'showGraph', data: { title: 'something else', xRange: [-5, 5], yRange: [-5, 5], functions: [{ fn: 'x^2' }] } },
    ];
    const r = boardInequalityFacts(TEXT_STATEMENT, cmds)!;
    assert.equal(r.graph, VOICE_GRAPH);
    assert.deepEqual(r.facts.inequalities.map((f) => f.drawn?.color), ['blue', 'green']);
    assert.equal(boardInequalityFacts('Find the limit of the sequence.', cmds), null);
    assert.equal(boardInequalityFacts(TEXT_STATEMENT, [])!.facts.hasGraph, false);
  });
  await test('the block for THIS problem, exactly', () => {
    const block = formatInequalityFactsBlock(facts);
    assert.equal(block,
      '<problem_facts>\n'
      + 'Computed facts about the problem on the board — rely on these, do not re-derive the region differently:\n'
      + '- Inequality 1: 2x + y < 4 is the same as y < -2x + 4. Its solutions are BELOW the line y = -2x + 4 (the first line; drawn blue, labelled "2x+y<4" on the graph). That line is DASHED: points on it are not solutions.\n'
      + '- Inequality 2: x - 3y > 2 is the same as y < (1/3)x - 2/3. Its solutions are BELOW the line y = (1/3)x - 2/3 (the second line; drawn red, labelled "x-3y>2" on the graph). That line is DASHED: points on it are not solutions.\n'
      + '- The first and second boundary lines cross at (2, 0). That point is on both lines and is not a solution.\n'
      + '- The solution of the system is the region BELOW both lines.\n'
      + '- (0, 0) is NOT a solution: 2x + y < 4 gives 0 < 4, true; x - 3y > 2 gives 0 > 2, false.\n'
      + '- (0, -1) IS a solution: 2x + y < 4 gives -1 < 4, true; x - 3y > 2 gives 3 > 2, true.\n'
      + 'These were computed from the problem\'s own inequalities, not read from the conversation. Whenever you say which side of a line is shaded, where the solution lies, whether a point is a solution, or name a line by its position or colour, it must agree with them. If something said earlier in this session disagrees with them — by you or by the student — the earlier statement was wrong: say so plainly in one short sentence and continue from these facts. A student whose reading agrees with these facts is right.\n'
      + '</problem_facts>\n\n');
    console.log('\n' + block);
  });
  await test('the fixed wording is generic: only the lead and the closing rule are ours, and they name no topic', () => {
    const fixed = INEQUALITY_FACTS_LEAD + ' ' + formatInequalityFactsBlock(facts).split('\n').slice(-3).join(' ');
    assert.ok(!/\d/.test(fixed), 'no numbers in the fixed text');
    assert.ok(!/\b(?:blue|red|green|origin|slope|intercept)\b/i.test(fixed));
    assert.equal(INEQUALITY_FACTS_LEAD, 'Computed facts about the problem on the board — rely on these, do not re-derive the region differently:');
  });
  await test('other shapes: above / left / right, solid, one inequality, a curve, nothing to say', () => {
    const rel = (t: string) => { const p = parseXYRelation(t); assert.ok(p.ok, t); return (p as { relation: Parameters<typeof buildInequalityFacts>[0][number] }).relation; };
    const f = buildInequalityFacts([rel('y >= 2x - 1'), rel('x < 3'), rel('x + 2 >= 0')])!;
    assert.deepEqual(f.inequalities.map((i) => [i.solved, i.side, i.strict]), [['y ≥ 2x - 1', 'above', false], ['x < 3', 'left', true], ['x ≥ -2', 'right', false]]);
    const one = buildInequalityFacts([rel('y > x^2 - 1')])!;
    assert.equal(one.inequalities[0].side, 'above');
    assert.equal(one.inequalities[0].solved, undefined, 'a curve has no straight-line form');
    assert.match(formatInequalityFactsText(one), /The inequality: y > x\^2 - 1\./);
    assert.equal(one.crossings.length, 0);
    // A closed curve has no single "above / below".
    assert.equal(buildInequalityFacts([rel('x^2 + y^2 < 9')])!.inequalities[0].side, undefined);
    assert.equal(buildInequalityFacts([]), null);
    assert.equal(problemInequalityFacts('What is 3 + 4?'), null);
    assert.equal(problemInequalityFacts('Solve $2x + 1 < 7$.'), null, 'one variable: not a region in the plane');
    // Two solid lines: the crossing IS a solution.
    const solid = buildInequalityFacts([rel('y <= x'), rel('y >= -x')])!;
    assert.equal(solid.crossings[0].inSolution, true);
    assert.match(formatInequalityFactsText(solid), /cross at \(0, 0\)\. That point is on both lines and is a solution\./);
    // The origin is on a boundary here, so it is not offered as a check point.
    assert.ok(!(solid.outside && solid.outside.x === 0 && solid.outside.y === 0));
    assert.ok(!(solid.inside && solid.inside.x === 0 && solid.inside.y === 0));
  });
  await test('numbers and colours', () => {
    assert.deepEqual([1 / 3, -2 / 3, 4, -0, 2.5, 0.1].map(formatFactNumber), ['1/3', '-2/3', '4', '0', '5/2', '1/10']);
    assert.deepEqual(GRAPH_COLORS.map((c) => colorName(c)), ['blue', 'red', 'green', 'purple', 'orange', 'teal']);
    assert.deepEqual(['Blue', 'cyan', 'gray', '#000', 'not-a-colour', 7].map((c) => colorName(c)), ['blue', 'teal', 'grey', 'black', undefined, undefined]);
  });

  console.log('\n(a) the graph\'s board description');
  await test('says which side of which coloured line is shaded, the crossing and two check points', () => {
    const parts = graphRegionFactParts(TEXT_GRAPH_REGION).join(' · ');
    assert.match(parts, /y < -2x \+ 4 is shaded BELOW the blue dashed line, legend "2x\+y<4"/);
    assert.match(parts, /y < \(x-2\)\/3 is shaded BELOW the red dashed line y = \(1\/3\)x - 2\/3, legend "x-3y>2"/);
    assert.match(parts, /darkest region \(the solution\): BELOW both lines/);
    assert.match(parts, /lines cross at \(2, 0\) \(not a solution\)/);
    assert.match(parts, /\(0, 0\) is NOT in it \(y < -2x \+ 4: true, y < \(x-2\)\/3: false\)/);
    assert.match(parts, /\(0, -1\) is in it/);
    assert.deepEqual(graphRegionFactParts(TEXT_GRAPH_LINES), [], 'a graph that shades nothing claims no side');
  });
  await test('…and it reaches the brain\'s board summary, not truncated away', () => {
    const cat = new WhiteboardCatalog();
    cat.append({ itemId: 'showGraph-2', action: 'showGraph', title: 'Solution region for the system', features: buildManifestForCommand({ action: 'showGraph', type: 'generic-xy', data: TEXT_GRAPH_REGION } as never) ?? [] });
    const summary = buildWhiteboardSummary(cat.getSnapshot());
    assert.match(summary, /inequalities shaded: y < -2x \+ 4 \(dashed boundary/);
    assert.match(summary, /shaded BELOW the red dashed line/);
    assert.match(summary, /\(0, 0\) is NOT in it/);
  });

  console.log('\n(c) the verdict pre-check and (d) the judge');
  await test('pre-check user content carries the facts, with their authority', () => {
    const text = formatInequalityFactsText(facts);
    const user = buildVerdictPrecheckUser({ history: [], openQuestion: 'Is the darker wedge above or below the origin?', studentMessage: 'the darker common shade is below the orign and its below the red dashed line', problemFacts: text });
    assert.match(user, /<computed_facts>\nComputed facts about the problem on the board/);
    assert.match(user, /Its solutions are BELOW the line y = \(1\/3\)x - 2\/3 \(the second line; drawn red/);
    assert.match(user, /are certain: use them as given/);
    assert.ok(user.indexOf('<computed_facts>') < user.indexOf('<open_question>'));
    assert.ok(!buildVerdictPrecheckUser({ history: [], openQuestion: null, studentMessage: 'x' }).includes('computed_facts'));
  });
  await test('judge user content carries the facts; the cached judge system prompt is untouched', () => {
    const content = buildJudgeUserContent({ boardSummary: 'board', spokenText: 'the shaded region sits below the line', computedFacts: formatInequalityFactsText(facts) });
    assert.match(content, /<computed_facts>\nComputed facts about the problem on the board/);
    assert.match(content, /A statement by the tutor that agrees with them is correct — do not flag it/);
    assert.ok(content.indexOf('<whiteboard_state>') < content.indexOf('<computed_facts>') && content.indexOf('<computed_facts>') < content.indexOf('<tutor_said>'));
    assert.ok(!buildJudgeUserContent({ boardSummary: 'board', spokenText: 'x' }).includes('computed_facts'));
    assert.ok(!JUDGE_SYSTEM_PROMPT.includes('computed_facts'));
  });

  console.log('\n(b) the brain\'s per-turn content (stubbed client — no model call)');
  {
    const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
    const brain = await import('../src/lib/tutor/voice/claude-brain');
    const { WHITEBOARD_TOOLS } = await import('../src/app/tutor/hooks/toolDefinitions');
    type Req = { messages: Array<{ role: string; content: unknown }>; system?: unknown; tools?: unknown };
    const requests: Req[] = [];
    const client = getModelClient('brain').client as unknown as { messages: { stream: (p: Req) => unknown } };
    client.messages.stream = (params: Req) => {
      requests.push(JSON.parse(JSON.stringify(params)) as Req);
      const events = [
        { type: 'message_start' },
        { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
        { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Let us look. ' } },
        { type: 'content_block_stop', index: 0 },
      ];
      return {
        abort() {},
        async finalMessage() { return { content: [{ type: 'text', text: 'Let us look.' }], stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1 } }; },
        [Symbol.asyncIterator]() { let i = 0; return { async next() { return i < events.length ? { done: false as const, value: events[i++] } : { done: true as const, value: undefined }; }, async return() { return { done: true as const, value: undefined }; } }; },
      };
    };
    const base = {
      systemPrompt: 'CORE PROMPT. SESSION PART.',
      systemPromptCore: 'CORE PROMPT. ',
      conversationHistory: [
        { role: 'user' as const, content: 'Yes' },
        { role: 'assistant' as const, content: 'Is the darker wedge above or below the origin, between the two dashed lines?' },
      ],
      studentTranscript: 'the darker common shade is below the orign and its below the red dashed line',
      whiteboardSnapshot: [],
      tools: WHITEBOARD_TOOLS.filter((t) => t.name === 'show_equation'),
    };
    const run = async (input: Record<string, unknown>) => {
      requests.length = 0;
      const l = console.log, w = console.warn; console.log = () => {}; console.warn = () => {};
      try { for await (const ev of brain.streamBrainTurn(input as never)) void ev; }
      finally { console.log = l; console.warn = w; }
      return { content: String(requests[0]?.messages[requests[0].messages.length - 1]?.content ?? ''), request: requests[0] };
    };
    const plain = await run({ ...base, activeProblem: { statement: 'Find the limit.', source: 'student' } });
    await test('a problem that is not a system / inequality: no block, request unchanged', () => {
      assert.ok(!plain.content.includes('<problem_facts>'));
    });
    for (const mode of ['voice', 'text'] as const) {
      await test(`${mode}: <problem_facts> sits in the uncached user content, after the board, before <student_said>`, async () => {
        const r = await run({ ...base, ...(mode === 'text' ? { textTurnShape: true } : {}), activeProblem: { statement: TEXT_STATEMENT, source: 'student' }, problemGraph: TEXT_GRAPH_REGION });
        assert.ok(r.content.includes(formatInequalityFactsBlock(facts)), 'the exact block for this problem');
        assert.ok(r.content.indexOf('</whiteboard_state>') < r.content.indexOf('<problem_facts>'));
        assert.ok(r.content.indexOf('</problem_facts>') < r.content.indexOf('<student_said>'));
        // The cached parts — system prompt and tools — are byte-identical.
        assert.equal(JSON.stringify(r.request.system), JSON.stringify(plain.request.system));
        assert.equal(JSON.stringify(r.request.tools), JSON.stringify(plain.request.tools));
        assert.ok(!JSON.stringify(r.request.system).includes('problem_facts'));
      });
    }
    await test('no tracked problem: the student\'s current homework problem is read', async () => {
      const r = await run({ ...base, homework: { problems: [{ n: 1, text: 'Find 3 + 4.' }, { n: 2, text: TEXT_STATEMENT }], current: 2 } });
      assert.match(r.content, /<problem_facts>[\s\S]*BELOW both lines/);
    });
    await test('without a graph the facts name no colour; a malformed graph is ignored', async () => {
      const r = await run({ ...base, activeProblem: { statement: TEXT_STATEMENT, source: 'student' }, problemGraph: 'not a graph' });
      assert.match(r.content, /<problem_facts>/);
      assert.ok(!/drawn (?:blue|red)/.test(r.content));
    });
    await test('the pre-check called from the brain turn is handed the same facts', async () => {
      const seen: Array<{ system: string; user: string }> = [];
      const llm: VerdictPrecheckLlm = async (req) => { seen.push({ system: req.system, user: req.user }); return { text: JSON.stringify({ proposed_value: 'below', problem_final_answer: '', proposed_equals_final_answer: false, answers: 'open_question', target: 't', correct_value: 'below both', verdict: 'correct', confidence: 'high' }), model: 'fake', inputTokens: 1, outputTokens: 1 }; };
      await run({ ...base, textTurnShape: true, textVerdictPrecheck: true, activeProblem: { statement: TEXT_STATEMENT, source: 'student' }, problemGraph: TEXT_GRAPH_REGION, verdictPrecheckDeps: { llm } });
      assert.equal(seen.length, 1);
      assert.match(seen[0].user, /<computed_facts>[\s\S]*drawn red[\s\S]*<\/computed_facts>/);
      assert.equal(seen[0].system, verdictPrecheckSystem());
    });
  }

  console.log('\nthe spoken-region check');
  for (const [s, phrase] of WRONG_SENTENCES) {
    await test(`fires: "${s.slice(0, 70)}…"`, () => {
      const hit = spokenRegionContradiction(s, facts);
      assert.ok(hit, 'no hit');
      assert.match(hit!.phrase, phrase);
      assert.equal(hit!.stated, 'above');
      assert.ok(hit!.about !== 'all' && hit!.about.n === 2);
      assert.match(hit!.fact, /x - 3y > 2 is the same as y < \(1\/3\)x - 2\/3: its solutions are BELOW the line/);
    });
  }
  for (const s of RIGHT_SENTENCES) {
    await test(`does not fire: "${s.slice(0, 70)}"`, () => {
      assert.equal(spokenRegionContradiction(s, facts), null);
    });
  }
  await test('"above both lines" contradicts a system that is below both', () => {
    const hit = spokenRegionContradiction('The shaded region is above both lines.', facts);
    assert.ok(hit && hit.about === 'all');
    assert.equal(spokenRegionContradiction('The shaded region is below both lines.', facts), null);
  });
  await test('colours follow the graph in view (voice graph: blue and green)', () => {
    const voice = problemInequalityFacts(VOICE_STATEMENT, VOICE_GRAPH)!;
    assert.ok(spokenRegionContradiction('So the solution region sits above the green line.', voice));
    assert.equal(spokenRegionContradiction('So the solution region sits above the red line.', voice), null, 'no red line on this graph');
    // No graph at all: a colour names nothing, a position still does.
    const bare = problemInequalityFacts(TEXT_STATEMENT)!;
    assert.equal(spokenRegionContradiction('So the solution region sits above the red line.', bare), null);
    assert.ok(spokenRegionContradiction('So the solution region sits above the second line.', bare));
  });
  await test('no facts ⇒ never fires; never throws on junk', () => {
    assert.equal(spokenRegionContradiction('the solution region is above the red line', null), null);
    assert.equal(spokenRegionContradiction('', facts), null);
    assert.equal(spokenRegionContradiction(undefined as unknown as string, facts), null);
  });
  await test('the retry is told the fact, and nothing topic-specific is hard-coded', () => {
    const hit = spokenRegionContradiction(WRONG_SENTENCES[3][0], facts)!;
    const fb = spokenRegionFeedback(hit, facts, WRONG_SENTENCES[3][0]);
    assert.match(fb, /puts the solution "above the red line"/);
    assert.match(fb, /its solutions are BELOW the line y = \(1\/3\)x - 2\/3/);
    assert.match(fb, /The solution of the system is the region BELOW both lines\./);
    assert.match(fb, /the student doesn't see this message/);
  });

  console.log('\nitem 6 — an expression with more than one reading (prompt content only)');
  await test('pre-check system prompt: the rule sits in step 4, generic wording, switchable', () => {
    const sys = verdictPrecheckSystem();
    assert.ok(sys.includes(AMBIGUOUS_READING_RULE));
    assert.ok(sys.indexOf('4. COMPARE') < sys.indexOf('AMBIGUOUS WRITING OR SPEECH') && sys.indexOf('AMBIGUOUS WRITING OR SPEECH') < sys.indexOf('5. CONFIDENCE'));
    assert.match(sys, /If ANY reasonable reading is the right answer to that question, the verdict is "correct"/);
    assert.match(sys, /Never return "incorrect" on the strength of one reading while another reasonable reading is right/);
    assert.ok(!/\d\s*[+\-*/=<>]|\b\d{2,}\b/.test(AMBIGUOUS_READING_RULE), 'no worked example');
    assert.ok(!/\b(?:equation|fraction|limit|inequality|algebra|calculus|physics|chemistry|slope|line)\b/i.test(AMBIGUOUS_READING_RULE));
    assert.equal(verdictPrecheckSystem({ ambiguousReadingRule: false }), VERDICT_PRECHECK_SYSTEM);
  });
  await test('the pre-check is SENT that prompt', async () => {
    const seen: string[] = [];
    await runVerdictPrecheck({ history: [], openQuestion: 'q?', studentMessage: 'y less than 1/3 of x - 2' }, { llm: async (req) => { seen.push(req.system); return { text: '{}', model: 'm', inputTokens: 0, outputTokens: 0 }; } });
    assert.ok(seen[0].includes('AMBIGUOUS WRITING OR SPEECH'));
  });
  await test('per-turn rule, voice and text: never deny on one reading; restate the intended form on the board, or ask', () => {
    const prior = 'How would you isolate $y$ in $x - 3y > 2$ to get slope-intercept form?';
    const said = "Yeah, so you'll get y less than 1/3 of x -2.";
    const voice = formatVoiceWorkThenMatchBlock(said, classifyTurnShape(said, prior));
    const text = formatWorkThenMatchBlock('y<1/3x-2', classifyTurnShape('y<1/3x-2', prior));
    assert.ok(voice.includes(AMBIGUOUS_READING_VOICE_RULE));
    assert.ok(text.includes(AMBIGUOUS_READING_TEXT_RULE));
    for (const rule of [AMBIGUOUS_READING_VOICE_RULE, AMBIGUOUS_READING_TEXT_RULE]) {
      assert.match(rule, /one reasonable reading is what your working gives, it IS the value they gave/);
      assert.match(rule, /put the intended form on the board written out in full/);
      assert.match(rule, /ask which one they meant/);
      assert.match(rule, /Never tell a student they are wrong on the strength of one reading/);
      assert.ok(!/\d/.test(rule), 'no example values');
    }
    assert.match(AMBIGUOUS_READING_VOICE_RULE, /speech carries no brackets/);
    assert.match(AMBIGUOUS_READING_TEXT_RULE, /typed without brackets/);
  });

  console.log('\nitem 8 — a graph\'s plots and inequalities are features of that graph');
  await test('curve features carry the strings the board description prints', () => {
    const cf = graphCurveFeatures(VOICE_GRAPH);
    assert.deepEqual(cf.map((c) => c.name), ['plot-1', 'plot-2', 'inequality-1', 'inequality-2']);
    assert.ok(cf[1].labels.includes('(1/3)x - 2/3 (y = (1/3)x - 2/3)'));
    assert.ok(cf[0].labels.includes('y = -2x + 4'));
    // A point ON each curve, inside the window, and not the same point twice.
    const win = { left: -6, right: 6, bottom: -6, top: 6 };
    const at = cf.map((c) => c.anchor(win));
    assert.ok(at.every((p) => p && p.x >= -6 && p.x <= 6 && p.y >= -6 && p.y <= 6));
    assert.ok(Math.abs(at[0]!.y - (-2 * at[0]!.x + 4)) < 1e-9);
    assert.ok(Math.abs(at[1]!.y - (at[1]!.x / 3 - 2 / 3)) < 1e-9);
    assert.ok(new Set(at.map((p) => `${p!.x.toFixed(3)},${p!.y.toFixed(3)}`)).size === at.length, 'marks do not coincide');
    assert.equal(cf[0].anchor({ left: 50, right: 60, bottom: 50, top: 60 }), null, 'a curve out of view has no mark');
  });
  await test('LIVE: the two recorded scribble targets resolve to the GRAPH, not to the older equation card', () => {
    const cat = new WhiteboardCatalog();
    const add = (cmd: Record<string, unknown>, itemId: string) => cat.append({ itemId, action: String(cmd.action), title: String((cmd as { label?: string }).label ?? ''), features: buildManifestForCommand(cmd as never) ?? [] });
    add({ action: 'showEquation', latex: 'y < -2x + 4', id: 'showEquation-3' }, 'showEquation-3');
    add({ action: 'showEquation', latex: 'x - 3y > 2 \\;\\Rightarrow\\; y < \\frac{1}{3}x - \\frac{2}{3}', label: 'Rewriting the second inequality', id: 'showEquation-7' }, 'showEquation-7');
    add({ action: 'showGraph', type: 'generic-xy', data: VOICE_GRAPH, id: 'showGraph-1' }, 'showGraph-1');
    for (const [target, feature] of [['(1/3)x - 2/3 (y = (1/3)x - 2/3)', 'plot-2'], ['y = -2x + 4', 'plot-1'], ['2x+y<4', 'inequality-1']] as const) {
      const r = cat.resolveTarget(target);
      assert.ok(r.ok, `${target}: ${JSON.stringify(r).slice(0, 120)}`);
      if (r.ok) {
        assert.equal(r.itemId, 'showGraph-1', target);
        assert.equal(r.canonical, feature, target);
        assert.notEqual(r.scribbleable, false, `${target} is markable`);
      }
    }
    // The whole-graph feature and its labelled points keep working.
    const whole = cat.resolveTarget('the graph');
    assert.ok(whole.ok && whole.itemId === 'showGraph-1' && whole.scribbleable === false);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}
void main();
