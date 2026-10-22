/**
 * Tests for the homework-problem ProblemPanel and its session wiring (GAC
 * per-problem homework, Task 8): source checks on the panel, the stage, the
 * session and the embed; the text-kickoff table; the render-harness fixture.
 *
 * Pure: no DOM, no model call, no database.
 * Run: npx tsx scripts/test-problem-panel.ts  (npm run test:problem-panel)
 */

import { strict as assert } from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

let passed = 0;
let failed = 0;
async function section(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const SRC = path.join(__dirname, '..', 'src');
const readSrc = (rel: string) => { try { return fs.readFileSync(path.join(SRC, rel), 'utf8'); } catch { return ''; } };
const has = (src: string, re: RegExp) => assert.ok(re.test(src), `source does not match ${re}`);
const hasNot = (src: string, re: RegExp) => assert.ok(!re.test(src), `source unexpectedly matches ${re}`);

async function main() {
  console.log('1 ProblemPanel');
  const panel = readSrc('app/tutor/components/session/ProblemPanel.tsx');
  await section('exports ProblemPanel and ProblemPanelProps', () => {
    has(panel, /export function ProblemPanel\(/);
    has(panel, /export interface ProblemPanelProps\s*\{[^}]*n: number;[^}]*text: string;[^}]*figure: FigureCommand \| null;[^}]*verified: boolean;[^}]*collapsed\?: boolean;[^}]*onToggle\?: \(\) => void/);
  });
  await section('the panel holds the text only; the figure is drawn on the board (lead item)', () => {
    hasNot(panel, /CommandRenderer/);
    hasNot(panel, /aspect-\[4\/3\]/);
    has(panel, /InlineMathText/);
  });
  await section('layout: desktop column width, select-text, phone header', () => {
    has(panel, /w-\[min\(38vw,440px\)\]/);
    has(panel, /select-text/);
    has(panel, /Problem \{n\} \{collapsed \? '▾' : '▴'\}/);
  });
  await section('unverified line is the ruled sentence, and there is no checking state', () => {
    has(panel, /No answer check for this one yet — your tutor will work it through with you\./);
    hasNot(panel, /Checking the answer key/);
  });

  console.log('2 SessionStage');
  const stage = readSrc('app/tutor/components/session/SessionStage.tsx');
  await section('has a problemPanel prop and renders ProblemPanel', () => {
    has(stage, /problemPanel\?:/);
    has(stage, /<ProblemPanel\b/);
  });
  await section('the figure is the board\'s lead item on page 1 — not a strip above the pages, not a command the tutor can supersede', () => {
    // GAC acceptance 2026-10-21 (round 5): the owner wants the figure DRAWN
    // on the whiteboard, larger, with the drawer carrying the text only.
    hasNot(stage, /problem-figure-strip/);
    hasNot(stage, /figureStrip/);
    hasNot(stage, /ProblemFigure/);
    has(stage, /\$\{pagerInCard \? 'flex flex-col' : ''\}/);
    const wb = readSrc('app/tutor/components/whiteboard/WhiteboardCanvas.tsx');
    has(wb, /leadItem\?: ReactNode;/);
    has(wb, /if \(pages\.length === 0 && !leadItem\)/);
    has(wb, /const showLead = leadItem != null && currentIndex === 0;/);
    has(wb, /data-wb-lead-item="1"/);
    has(wb, /<BoardItemErrorBoundary action="leadItem" resetKey=\{leadItem\}>\s*\{leadItem\}/);
    has(wb, /renderableCommands\.length === 1 && !showLead \?/);
    const ts = readSrc('app/tutor/components/session/TutorSession.tsx');
    has(ts, /leadItem=\{homeworkProblem\?\.figure \? <ProblemFigure figure=\{homeworkProblem\.figure\} \/> : undefined\}/);
    has(ts, /boardEmpty=\{whiteboardCommands\.length === 0 && !homeworkProblem\?\.figure\}/);
    const pf = readSrc('app/tutor/components/session/ProblemFigure.tsx');
    has(pf, /fit="content"/);
    has(pf, /h-\[280px\] sm:h-\[400px\]/);
    has(pf, /<CommandRenderer command=\{figure as unknown as WhiteboardCommand\} \/>/);
  });
  await section('one-problem session: the question pin sits above the board card, never floating over the figure', () => {
    // GAC acceptance 2026-10-22 (hw-13): the floating Q-pin covered the figure.
    has(stage, /const qpinStatic = problemPanel != null;/);
    has(stage, /\{questionPin && qpinMode === 'expanded' && qpinStatic && \(/);
    has(stage, /data-testid="question-pin-static"/);
    has(stage, /\{questionPin && qpinMode === 'expanded' && !qpinStatic && \(/);
  });
  await section('one-problem session: no Wrap up / Finish lesson / Discard session in the adjust menu', () => {
    const ts = readSrc('app/tutor/components/session/TutorSession.tsx');
    has(ts, /\{!homeworkProblem && \(\s*<button[^]*?Wrap up<\/button>/);
    has(ts, /\{embedded && !isTrial && !homeworkProblem && \(/);
    const vtr = readSrc('app/tutor/components/VoiceTutorRealtime.tsx');
    has(vtr, /buildHomeworkOpenerClause\(\{ \.\.\.openerCtx, oneProblem: homeworkProblemRef\.current != null, hasPriorNote: !!homeworkProblemRef\.current\?\.priorNote \}\)/);
  });
  await section('the stage keeps one tree position: never returned under a conditional wrapper', () => {
    // A plan arrives after the first render; nesting the stage only when
    // problemPanel is set would remount it (and VoiceTutorRealtime with it).
    assert.equal((stage.match(/\{stage\}/g) ?? []).length, 1, '{stage} must appear exactly once');
    hasNot(stage, /return stage;/);
    has(stage, /return \(\s*<>\s*\{problemPanel \? \(\s*<ProblemPanel[^]*?\) : null\}\s*\{stage\}\s*<\/>\s*\);/);
    has(stage, /\[sessionMode, textToolRail, boardColumnTopPadClass, chipRowShown, problemPanel != null\]/);
  });
  await section('the panel uses the display text', () => has(panel, /problemTextForDisplay\(text, !!figure\)/));
  await section('the homework rail is not rendered when problemPanel is set', () => {
    has(stage, /const homeworkRail: ReactNode = !problemPanel && sessionGoal === 'homework-help' && homeworkProgress/);
  });

  console.log('3 TutorSession + VoiceTutorRealtime');
  const ts = readSrc('app/tutor/components/session/TutorSession.tsx');
  const vtr = readSrc('app/tutor/components/VoiceTutorRealtime.tsx');
  await section('VTR derives the problem from the plan and reports it up', () => {
    has(vtr, /homeworkProblemOf\(activePlan\)/);
    has(vtr, /onHomeworkProblem\?: \(meta: HomeworkProblemMeta \| null\) => void/);
    has(vtr, /onHomeworkProblemRef\.current\?\.\(homeworkProblem\)/);
  });
  await section('VTR records the keyed verdict and the done event (once)', () => {
    has(vtr, /type === 'homework-keyed-verdict'/);
    has(vtr, /onDebugEvent\?\.\((?:KEYED_VERDICT_DEBUG_TYPE|'homework_keyed_verdict'), formatKeyedVerdictDebug\(/);
    has(vtr, /type === 'homework-problem-done'/);
    has(vtr, /if \(!homeworkProblemDoneRecordedRef\.current\) \{\s*homeworkProblemDoneRecordedRef\.current = true;\s*onDebugEvent\?\.\('homework_problem_done', 'all key parts confirmed'\)/);
  });
  await section('VTR gates the correction-note volunteer turn and the board-anchor net', () => {
    has(vtr, /if \(homeworkProblemRef\.current\) \{\s*onDebugEvent\?\.\('judge_correction_note_timeout_skipped_homework_problem'/);
    has(vtr, /if \(TUTOR_BOARD_ANCHOR_NET && !homeworkProblemRef\.current\)/);
    has(vtr, /homeworkProblemRef\.current != null/);
  });
  await section('VTR passes homeworkProblem to textKickoffReady', () => {
    has(vtr, /textKickoffReady\(\{[\s\S]{0,300}homeworkProblem: !!homeworkProblem,/);
  });
  await section('TutorSession holds the problem and passes it to the stage', () => {
    has(ts, /onHomeworkProblem=\{setHomeworkProblem\}/);
    has(ts, /problemPanel=\{homeworkProblem\b/);
  });
  await section('VTR boards no synthetic "Question" card in a one-problem session', () => {
    const vtr = readSrc('app/tutor/components/VoiceTutorRealtime.tsx');
    has(vtr, /const oneProblemSession = homeworkProblemRef\.current != null;/);
    has(vtr, /&& !typedHomeworkTurn && !oneProblemSession\) \{/);
  });
  await section('TutorSession hides End/Pause in a one-problem session (the host has finish and back)', () => {
    has(ts, /endControl=\{endControlVisible && !homeworkProblem \? endControlEl : null\}/);
  });

  console.log('4 text kickoff');
  const tk = readSrc('app/tutor/components/session/text-kickoff.ts');
  await section('text-kickoff.ts mentions homeworkProblem', () => has(tk, /homeworkProblem: boolean/));
  await section('textKickoffReady table', async () => {
    const { textKickoffReady } = await import('../src/app/tutor/components/session/text-kickoff');
    const base = { sessionGoal: 'homework-help', tutorOpens: false, homeworkReady: false, hasPlanId: true };
    const call = (i: Record<string, unknown>) => textKickoffReady(i as unknown as Parameters<typeof textKickoffReady>[0]);
    assert.equal(call({ ...base, sessionMode: 'text', homeworkProblem: true, planLoaded: true }), true, 'homework-problem + text + loaded');
    assert.equal(call({ ...base, sessionMode: 'voice', homeworkProblem: true, planLoaded: true }), false, 'voice');
    assert.equal(call({ ...base, sessionMode: 'text', homeworkProblem: true, planLoaded: false }), false, 'not loaded');
    // Unchanged rows.
    assert.equal(call({ ...base, sessionMode: 'text', homeworkProblem: false, planLoaded: true }), false, 'plain homework, not ready');
    assert.equal(call({ ...base, sessionMode: 'text', homeworkProblem: false, homeworkReady: true, planLoaded: true }), true, 'homework ready');
    assert.equal(call({ ...base, sessionGoal: 'learn', sessionMode: 'text', tutorOpens: true, homeworkProblem: false, planLoaded: true }), true, 'tutor_opens');
  });

  console.log('5 embed');
  const embed = readSrc('app/tutor-portal/embed/page.tsx');
  await section('session_ended carries homework_problem; both events are persisted', () => {
    has(embed, /homework_problem: \{ parent_plan_id: [^,]+, n: [^}]+\}/);
    has(embed, /KEYED_VERDICT_DEBUG_TYPE|'homework_keyed_verdict'/);
    has(embed, /'homework_problem_done'/);
  });

  console.log('5b problemTextForDisplay');
  {
    const { problemTextForDisplay } = await import('../src/lib/tutor/lesson-plan/homework-problem-meta');
    const P5 = "In △ABC, DE ∥ BC. Find the values of x and y. [Figure: Triangle with A at the top, B at the bottom left, and C at the bottom right. D is on AB and E is on AC. Segment DE is drawn, and both DE and BC carry a single arrow mark (parallel). Labels: AD = 6, DB = x, AE = 12, EC = y, DE = 9, BC = 15.]";
    const P8 = "The graph of y = a sin(bx) + d is shown. [Graph: The x-axis is marked π/2, π, 3π/2, 2π; the y-axis is marked 4, 2, −2. A horizontal line is drawn at y = 1. The sinusoid starts at x = 0 near y = 1 rising. It peaks at y = 4 near x = π/4, reaches its minimum at y = −2 near x = 3π/4, peaks again at 4 near 5π/4, reaches its minimum at −2 near 7π/4, and rises back to 1 at 2π.]\\n(a) Find the amplitude, period, midline.\\n(b) Find a, b, and d.";
    await section('P5 with a figure → the question only', () => {
      assert.equal(problemTextForDisplay(P5, true), 'In △ABC, DE ∥ BC. Find the values of x and y.');
    });
    await section('P8 with a figure keeps (a)/(b), loses the [Graph: …] block', () => {
      const t = problemTextForDisplay(P8, true);
      assert.ok(t.includes('(a) Find the amplitude, period, midline.'), t);
      assert.ok(t.includes('(b) Find a, b, and d.'), t);
      assert.ok(!/Graph:|peaks|y = 4/.test(t), t);
      assert.ok(t.startsWith('The graph of y = a sin(bx) + d is shown.'), t);
    });
    await section('nested brackets are balanced; other brackets stay', () => {
      const t = 'Solve on [0, 2π]. [Diagram: a curve on [0, 2π] with a mark at [π, 1].]\nThen sketch.';
      assert.equal(problemTextForDisplay(t, true), 'Solve on [0, 2π].\nThen sketch.');
      assert.equal(problemTextForDisplay('A [figure: x] B [Figure : y] C', true), 'A B C');
    });
    await section('a long bracketed "Word:" block is a description too; short brackets and intervals are not', async () => {
      const { hasFigureDescription } = await import('../src/lib/tutor/lesson-plan/homework-problem-meta');
      const P1 = 'Lines p ∥ q. Point A lies on line p. [Angles, one at a time: 55°: its arc is at A, below line p, on the left side of segment AB (outside the triangle). (2x + 15)°: its arc is at A, inside the triangle. Rest of figure: two horizontal lines.] (a) Find x. (b) Find m∠1 and m∠2.';
      assert.equal(problemTextForDisplay(P1, true), 'Lines p ∥ q. Point A lies on line p. (a) Find x. (b) Find m∠1 and m∠2.');
      assert.equal(hasFigureDescription(P1), true);
      const short = 'Solve for x. [Note: see back] Use the interval [0, 2π].';
      assert.equal(problemTextForDisplay(short, true), short);
      assert.equal(hasFigureDescription(short), false);
      assert.equal(hasFigureDescription('Find x. [Graph: y = x]'), true, 'an explicit opener needs no length');
    });
    await section('without a figure the text is unchanged', () => {
      assert.equal(problemTextForDisplay(P5, false), P5);
      assert.equal(problemTextForDisplay(P8, false), P8);
    });
  }

  console.log('6 render-harness fixture');
  await section('fixtures/homework/problem-panel-ws3p5.json parses and names show_geometry_constructed', () => {
    const p = path.join(__dirname, 'tutor-render-harness', 'fixtures', 'homework', 'problem-panel-ws3p5.json');
    const raw = JSON.parse(fs.readFileSync(p, 'utf8')) as Array<{ label: string; tool: string; expect: string; args: { given: unknown[]; steps: Array<{ id: string; label?: string }> } }>;
    assert.ok(Array.isArray(raw) && raw.length === 1);
    assert.equal(raw[0].tool, 'show_geometry_constructed');
    assert.equal(raw[0].expect, 'render');
    assert.equal(raw[0].args.given.length, 3);
    assert.ok(raw[0].args.steps.some((s) => s.label === 'DB = x'));
    assert.ok(!raw[0].args.steps.some((s) => s.label === 'DB = 9'));
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
