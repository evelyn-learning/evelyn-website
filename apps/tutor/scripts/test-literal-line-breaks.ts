/**
 * A literal backslash-n used as a LINE SEPARATOR never reaches the board (live: an uploaded-worksheet
 * session's `show_problem` statement held the two CHARACTERS backslash + n
 * between items and the card printed them).
 *
 * The helper itself is covered in scripts/test-inline-math.ts. This script
 * pins the two places it is wired in:
 *   - ingestion: mapFunctionCallToCommand fixes every display string of a
 *     whiteboard tool call before it is stored;
 *   - render: InlineMathText fixes a string that was stored before that
 *     (replay of an old session);
 *   - PDF: only tutor-authored board prose is fixed, never transcript text,
 *     table cells or code lines.
 * Review 2026-10-04: escapes that are CONTENT (string literals, paths,
 * answer choices, table cells) must come through every one of these
 * byte-identical.
 *
 * Run: cd apps/tutor && npx tsx scripts/test-literal-line-breaks.ts
 */
import { strict as assert } from 'node:assert';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mapFunctionCallToCommand, WHITEBOARD_TOOLS } from '../src/app/tutor/hooks/toolDefinitions';
import { InlineMathText } from '../src/app/tutor/components/whiteboard/InlineMathText';
import { sanitizeForPDF } from '../src/lib/utils/export/pdf-tutor-session';

let n = 0;
const ok = (name: string, fn: () => void) => { fn(); n++; console.log(`  ok  ${name}`); };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const map = (name: string, args: Record<string, unknown>) => mapFunctionCallToCommand(name, args) as any;

const STORED = String.raw`Solve for the variable.\n\n1) $v - 29\frac{4}{5} = \frac{1}{5}$\n2) $-8 = c - 5$`;
const WANT = 'Solve for the variable.\n\n1) $v - 29\\frac{4}{5} = \\frac{1}{5}$\n2) $-8 = c - 5$';

ok('show_problem: statement gets real line breaks, maths untouched', () => {
  const cmd = map('show_problem', { statement: STORED, format: 'free-response' });
  assert.equal(cmd.action, 'showProblem');
  assert.equal(cmd.problem.statement, WANT);
});
ok('show_problem: title converted, answer choices byte-identical', () => {
  const cmd = map('show_problem', {
    title: String.raw`Set A\nPage 2`,
    statement: 'Pick one.',
    format: 'multiple-choice',
    answerChoices: [{ letter: 'A', text: String.raw`$x \neq 3$\nfor every x` }, { letter: 'B', text: String.raw`\theta = 0` }],
  });
  assert.equal(cmd.problem.title, 'Set A\nPage 2');
  assert.equal(cmd.problem.answerChoices[0].text, String.raw`$x \neq 3$\nfor every x`);
  assert.equal(cmd.problem.answerChoices[1].text, String.raw`\theta = 0`);
});
ok('show_try_yourself: problem, hints and choices', () => {
  const cmd = map('show_try_yourself', {
    problem: String.raw`Your turn.\nSolve $2x = 6$.`,
    hints: [String.raw`Divide both sides.\nBy what?`],
    expectedAnswer: String.raw`x\n=3`,
  });
  assert.equal(cmd.problem, 'Your turn.\nSolve $2x = 6$.');
  assert.equal(cmd.hints[0], 'Divide both sides.\nBy what?');
  assert.equal(cmd.expectedAnswer, String.raw`x\n=3`, 'answer-matching key is never rewritten');
});
ok('code is content, not prose', () => {
  const code = String.raw`print("a\nb")`;
  assert.equal(map('show_code', { code, language: 'python', label: String.raw`Run it.\nThen read` }).code, code);
  assert.equal(map('show_code', { code, language: 'python', label: String.raw`Run it.\nThen read` }).label, 'Run it.\nThen read');
});
// Every string anywhere in a mapped command, for byte-identity checks.
const strings = (v: unknown, acc: string[] = []): string[] => {
  if (typeof v === 'string') acc.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, acc));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, acc));
  return acc;
};
const noRealBreaks = (cmd: unknown) => assert.ok(!strings(cmd).some((s) => /[\n\t]/.test(s)), JSON.stringify(cmd));
ok('computer-science show_problem: string literal and choices byte-identical', () => {
  const choices = [String.raw`a\nb`, 'a b', String.raw`\n`, 'ab'];
  const cmd = map('show_problem', {
    statement: String.raw`What does print("a\nb") output?`,
    format: 'multiple-choice',
    answerChoices: choices.map((text, i) => ({ letter: 'ABCD'[i], text })),
    expectedAnswer: String.raw`a\nb`,
  });
  assert.equal(cmd.problem.statement, String.raw`What does print("a\nb") output?`);
  assert.deepEqual(cmd.problem.answerChoices.map((c: { text: string }) => c.text), choices);
  noRealBreaks(cmd);
});
ok('computer-science show_table: escape cells are content', () => {
  const rows = [[String.raw`\n`, 'newline'], [String.raw`\t`, 'tab']];
  const cmd = map('show_table', { title: 'Escapes', headers: ['escape', 'meaning'], rows });
  assert.deepEqual(cmd.rows, rows);
  noRealBreaks(cmd);
});
ok('computer-science show_quiz / show_try_yourself: choices stay equal to the answer key', () => {
  for (const tool of ['show_quiz', 'show_try_yourself']) {
    const cmd = map(tool, {
      question: 'Which one is the line feed?', problem: 'Which one is the line feed?',
      options: [String.raw`\n`, String.raw`\t`], answer: String.raw`\n`,
      choices: [{ id: 'a', text: String.raw`\n`, correct: true }, { id: 'b', text: String.raw`\t` }],
      expectedAnswer: String.raw`\n`,
    });
    noRealBreaks(cmd);
    const all = strings(cmd);
    assert.ok(all.includes(String.raw`\n`), `${tool}: ${JSON.stringify(cmd)}`);
  }
});
ok('prose about escapes and paths is stored as written', () => {
  for (const s of [
    String.raw`In Python, \n means newline and \t means tab.`,
    String.raw`Open C:\new\table and C:\Users\tom\notes.txt`,
    String.raw`Water boils at 100\textcelsius, about \num{373} K`,
    'Call `s.split(\'\\n\')` first',
  ]) {
    assert.equal(map('show_problem', { statement: s, format: 'free-response' }).problem.statement, s);
    assert.equal(map('annotate', { text: s }).text ?? s, s);
  }
});
ok('lettered items convert even when one spells a LaTeX command', () => {
  const cmd = map('show_problem', { statement: String.raw`Pick one.\nd) four\ne) five`, format: 'free-response' });
  assert.equal(cmd.problem.statement, 'Pick one.\nd) four\ne) five');
});
ok('the caller\'s args object is not mutated', () => {
  const args = { statement: STORED, format: 'free-response' };
  map('show_problem', args);
  assert.equal(args.statement, STORED);
});
ok('show_problem.statement description tells the model to use real line breaks', () => {
  const tool = WHITEBOARD_TOOLS.find((t) => t.name === 'show_problem')!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const desc = String((tool.parameters as any).properties.statement.description);
  assert.match(desc, /real line breaks/);
  assert.match(desc, /backslash-n/);
});

ok('render: a string stored with literal backslash-n replays with real line breaks', () => {
  const html = renderToStaticMarkup(createElement(InlineMathText, { text: STORED }));
  assert.ok(!html.includes('\\n'), html);
  assert.ok(html.includes('Solve for the variable.\n\n1) '), html);
  assert.ok(html.includes('\n2) '), html);
});
ok('render: LaTeX commands in prose are not broken up', () => {
  const html = renderToStaticMarkup(createElement(InlineMathText, { text: String.raw`Note that \text{no} line breaks here` }));
  assert.ok(!html.includes('\n'), html);
});

const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
ok('render: escapes that are content are printed as written', () => {
  for (const s of [
    String.raw`What does print("a\nb") output?`, String.raw`a\nb`, String.raw`\n`,
    String.raw`In Python, \n means newline and \t means tab.`,
  ]) {
    const html = renderToStaticMarkup(createElement(InlineMathText, { text: s }));
    assert.ok(!/[\n\t]/.test(html), html);
    assert.ok(text(html).includes(s), html);
  }
});
ok('render: literalLineBreaks={false} opts a call site out entirely', () => {
  const html = renderToStaticMarkup(createElement(InlineMathText, { text: String.raw`One.\n1) Two`, literalLineBreaks: false }));
  assert.ok(!html.includes('\n'), html);
});
ok('render: a lone $…$ span (what the transcript bubbles pass) is never rewritten', () => {
  // TranscriptView / inline-emphasis hand InlineMathText one maths segment
  // wrapped in dollars; student-typed text must come through as typed.
  const html = renderToStaticMarkup(createElement(InlineMathText, { text: String.raw`$5.\n1) x$` }));
  assert.ok(!html.includes('\n'), html);
});

ok('pdf: board prose opts in, everything else is left as typed', () => {
  assert.equal(sanitizeForPDF(String.raw`Solve.\n1) Find x\n2) Find y`, { literalLineBreaks: true }), 'Solve.\n1) Find x\n2) Find y');
  // default (transcript bubbles — typed STUDENT text — table cells, code lines, labels)
  assert.equal(sanitizeForPDF(String.raw`Solve.\n1) Find x`), String.raw`Solve.\n1) Find x`);
  assert.equal(sanitizeForPDF(String.raw`print("a\nb")`), String.raw`print("a\nb")`);
  assert.equal(sanitizeForPDF(String.raw`\n`), String.raw`\n`);
  // and even when opted in, content escapes survive
  assert.equal(sanitizeForPDF(String.raw`What does print("a\nb") output?`, { literalLineBreaks: true }), String.raw`What does print("a\nb") output?`);
});

console.log(`\nAll ${n} literal-line-break wiring tests passed.`);
