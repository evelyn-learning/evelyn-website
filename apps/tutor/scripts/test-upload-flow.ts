/**
 * Homework/image upload flow — pure decision logic
 * (src/app/tutor/components/session/upload-flow.ts).
 *
 * Bug: on /tutor under the new session UI a `claude-brain` upload went to the
 * page-level legacy handler, which only wrote page state nobody was looking
 * at — nothing boarded, nothing sent to the brain, nothing spoken, nothing
 * saved. These tests pin the contracts the fix depends on, including the two
 * CROSS-MODULE ones a refactor of the strings would silently break:
 *   - the success marker must still be recognised by extractStudentEcho
 *     (else the student's problem never reaches the saved transcript);
 *   - every marker must still match VoiceTutorRealtime's student-board-action
 *     prefix (else an upload before the mic tap never starts the session).
 *
 * Run: cd apps/tutor && npx tsx scripts/test-upload-flow.ts
 */
import { strict as assert } from 'node:assert';
import {
  pageOwnsUpload,
  classifyExtraction,
  buildStudentMediaBrainInput,
  buildUploadedProblemCard,
  studentMediaNotice,
  wrapCardText,
  extractionUsage,
  runWithAbortTimeout,
  EXTRACTION_TIMEOUT_MS,
  splitNumberedProblems,
  extractionRequestBody,
  studentMediaDebugDetail,
} from '../src/app/tutor/components/session/upload-flow';
import { extractStudentEcho } from '../src/lib/tutor/voice/marker-student-echo';

let n = 0;
const ok = (name: string, fn: () => void) => { fn(); n++; console.log(`  ok  ${name}`); };
const pendingAsync: Array<Promise<void>> = [];
const okAsync = (name: string, fn: () => Promise<void>) => {
  pendingAsync.push(fn().then(() => { n++; console.log(`  ok  ${name}`); }));
};

// Copy of the handle's gate in VoiceTutorRealtime.tsx (sendTextMessage):
// a bracketed send only starts the session clock / unlocks audio when it is a
// real student gesture.
const STUDENT_BOARD_ACTION = /^\s*\[(?:The student (?:wrote|drew|uploaded)|Via their review-agenda menu)/i;

// ---- which handler owns an upload ------------------------------------------
ok('only the legacy `realtime` engine keeps the page-level handler', () => {
  assert.equal(pageOwnsUpload('realtime'), true);
});
ok('the production engine (claude-brain) and the other session-UI engines use the session path', () => {
  for (const e of ['claude-brain', 'realtime-2', 'realtime-validated']) {
    assert.equal(pageOwnsUpload(e), false, e);
  }
});
ok('unknown / missing engine never falls into the page handler', () => {
  assert.equal(pageOwnsUpload(undefined), false);
  assert.equal(pageOwnsUpload(''), false);
  assert.equal(pageOwnsUpload('gemini'), false);
});

// ---- extraction outcome -----------------------------------------------------
ok('200 with a problem → extracted (trimmed)', () => {
  assert.deepEqual(
    classifyExtraction({ httpOk: true, body: { extractedProblem: '  A 2 kg block slides…  ' } }),
    { kind: 'extracted', problem: 'A 2 kg block slides…' },
  );
});
ok('200 with no / blank / non-string problem → unreadable (the image arrived, nothing legible in it)', () => {
  assert.deepEqual(classifyExtraction({ httpOk: true, body: { extractedProblem: null } }), { kind: 'unreadable' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: { extractedProblem: '   ' } }), { kind: 'unreadable' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: { extractedProblem: 42 } }), { kind: 'unreadable' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: {} }), { kind: 'unreadable' });
});
ok('server error is a FAILURE, not "unreadable" — even if the error body parses as JSON', () => {
  assert.deepEqual(classifyExtraction({ httpOk: false, body: { error: 'Failed to extract problem' } }), { kind: 'failed' });
  // A 500 must not be treated as success just because a body field is present.
  assert.deepEqual(classifyExtraction({ httpOk: false, body: { extractedProblem: 'x' } }), { kind: 'failed' });
});
ok('network error / non-JSON body (e.g. proxy 413 HTML) → failed', () => {
  assert.deepEqual(classifyExtraction({ threw: true }), { kind: 'failed' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: null }), { kind: 'failed' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: 'oops' }), { kind: 'failed' });
});

// ---- brain input ------------------------------------------------------------
const PROBLEM = 'A 2 kg block is pushed with "F = 10 N" up a 30° incline. Find a.';

ok('success marker carries the problem and survives the transcript-echo extractor', () => {
  const m = buildStudentMediaBrainInput('image', { kind: 'extracted', problem: PROBLEM });
  assert.equal(extractStudentEcho(m), PROBLEM); // quotes inside the problem survive
  const d = buildStudentMediaBrainInput('drawing', { kind: 'extracted', problem: 'x^2 + 1' });
  assert.equal(extractStudentEcho(d), 'x^2 + 1');
});
ok('failure markers never produce a student echo (nothing the student "said")', () => {
  for (const type of ['image', 'drawing'] as const) {
    for (const kind of ['unreadable', 'failed'] as const) {
      assert.equal(extractStudentEcho(buildStudentMediaBrainInput(type, { kind })), null, `${type}/${kind}`);
    }
  }
});
ok('every marker is a bracketed student-board action (starts the session like a real gesture)', () => {
  for (const type of ['image', 'drawing'] as const) {
    for (const o of [{ kind: 'extracted', problem: PROBLEM }, { kind: 'unreadable' }, { kind: 'failed' }] as const) {
      const m = buildStudentMediaBrainInput(type, o);
      assert.match(m, STUDENT_BOARD_ACTION, `${type}/${o.kind}`);
      assert.ok(m.startsWith('[') && m.endsWith(']'), `${type}/${o.kind} bracketed`);
    }
  }
});
ok('an UPLOAD is never described as a drawing, and a drawing never as an upload', () => {
  for (const o of [{ kind: 'extracted', problem: PROBLEM }, { kind: 'unreadable' }, { kind: 'failed' }] as const) {
    const img = buildStudentMediaBrainInput('image', o);
    assert.match(img, /uploaded/i);
    assert.doesNotMatch(img, /\bdrew\b|\bdrawing\b/i, `image/${o.kind}`);
    const drw = buildStudentMediaBrainInput('drawing', o);
    assert.match(drw, /\bdrew\b/i);
    assert.doesNotMatch(drw, /upload/i, `drawing/${o.kind}`);
  }
});
ok('a failed/unreadable upload tells the tutor to say so and ask for another try', () => {
  for (const kind of ['unreadable', 'failed'] as const) {
    const m = buildStudentMediaBrainInput('image', { kind });
    assert.match(m, /try (uploading )?(it )?again/i, kind);
    assert.match(m, /have not seen/i, kind); // tutor must not pretend it read the image
  }
  // The two causes are worded differently: a technical failure is not the student's photo's fault.
  assert.notEqual(
    buildStudentMediaBrainInput('image', { kind: 'failed' }),
    buildStudentMediaBrainInput('image', { kind: 'unreadable' }),
  );
});

// ---- persisted board card ---------------------------------------------------
ok('problem card is a small showSvgDiagram command with the text XML-escaped', () => {
  const card = buildUploadedProblemCard('If a < b & b > c, is "a" < c?') as unknown as { action: string; title: string; svg: string };
  assert.equal(card.action, 'showSvgDiagram');
  assert.equal(card.title, 'Uploaded problem');
  assert.ok(card.svg.includes('a &lt; b &amp; b &gt; c'));
  assert.doesNotMatch(card.svg, /data:image/); // text only — never the image bytes
  // well-formed enough: no raw < or & inside any <text> body
  for (const m of card.svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)) {
    assert.doesNotMatch(m[1].replace(/&(amp|lt|gt|quot);/g, ''), /[<>&]/);
  }
});
ok('card stays bounded for a very long extraction and grows with line count', () => {
  const short = buildUploadedProblemCard('Find x.') as unknown as { svg: string };
  const long = buildUploadedProblemCard('word '.repeat(5000)) as unknown as { svg: string };
  assert.ok(long.svg.length < 6000, `svg length ${long.svg.length}`);
  assert.ok(long.svg.includes('…'), 'truncation is marked');
  const h = (s: string) => Number(/viewBox="0 0 400 (\d+)"/.exec(s)![1]);
  assert.ok(h(long.svg) > h(short.svg));
});
ok('wrapCardText: wraps on words, keeps explicit line breaks, hard-splits an unbroken run', () => {
  assert.deepEqual(wrapCardText('aaa bbb ccc', 7, 10), ['aaa bbb', 'ccc']);
  assert.deepEqual(wrapCardText('one\ntwo', 20, 10), ['one', 'two']);
  assert.deepEqual(wrapCardText('abcdefghij', 4, 10), ['abcd', 'efgh', 'ij']);
  const capped = wrapCardText('a b c d e f', 1, 3);
  assert.equal(capped.length, 3);
  assert.ok(capped[2].endsWith('…'));
  assert.deepEqual(wrapCardText('   ', 10, 10), []);
});

// ---- a worksheet is several problems, not one ------------------------------
// Live: the extraction held ten numbered problems; the brain boarded all ten
// as ONE problem card, so the active "problem" had ten relations (answer and
// step checks stood down) and the student faced a wall of text.
const WORKSHEET = [
  'Solve for the variable.',
  '',
  '1) $v - 29\\frac{4}{5} = \\frac{1}{5}$',
  '2) $-8 = c - 5$',
  '3) $x + 2.5 = 10$',
  '4) $\\frac{n}{3} = 7$',
  '5) $6 = m - 1.2$',
  '6) $4y = 30$',
  '7) $k + \\frac{1}{2} = 3$',
  '8) $-2 = d + 9$',
  '9) $1.5t = 6$',
  '10) $w - 14 = -20$',
].join('\n');
const SINGLE_MARKER = '[The student uploaded an image to the whiteboard. It contains: "A 2 kg block is pushed with "F = 10 N" up a 30° incline. Find a.". Respond to what they shared.]';

ok('single-problem success marker is byte-identical to the shipped wording', () => {
  assert.equal(buildStudentMediaBrainInput('image', { kind: 'extracted', problem: PROBLEM }), SINGLE_MARKER);
  assert.equal(
    buildStudentMediaBrainInput('drawing', { kind: 'extracted', problem: 'x^2 + 1' }),
    '[The student drew on the whiteboard. It contains: "x^2 + 1". Respond to what they shared.]',
  );
});
ok('splitNumberedProblems: ten "N)" lines → ten problems, shared instructions kept apart', () => {
  const split = splitNumberedProblems(WORKSHEET)!;
  assert.equal(split.problems.length, 10);
  assert.deepEqual(split.problems.map((p) => p.n), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(split.preamble, 'Solve for the variable.');
  assert.equal(split.problems[0].text, '$v - 29\\frac{4}{5} = \\frac{1}{5}$');
  assert.equal(split.problems[9].text, '$w - 14 = -20$');
});
ok('splitNumberedProblems: other numbering styles, and printed numbers that do not start at 1', () => {
  assert.deepEqual(splitNumberedProblems('1. Find x if 2x = 6.\n2. Find y if y + 1 = 4.\n3. Simplify 4/8.')!.problems.map((p) => p.text),
    ['Find x if 2x = 6.', 'Find y if y + 1 = 4.', 'Simplify 4/8.']);
  assert.deepEqual(splitNumberedProblems('(1) Factor x^2 - 9.\n(2) Factor x^2 + 5x + 6.\n(3) Factor 4x^2 - 1.')!.problems.map((p) => p.n), [1, 2, 3]);
  assert.deepEqual(splitNumberedProblems('Problem 1: Find the slope.\nProblem 2: Find the intercept.\nProblem 3: Graph the line.')!.problems.map((p) => p.text),
    ['Find the slope.', 'Find the intercept.', 'Graph the line.']);
  assert.equal(splitNumberedProblems('1. Solve 2x = 8\n2. Factor x^2 − 9\n3. Find the slope of y = 3x + 1')!.problems.length, 3);
  // Arithmetic drills: the blank after "=" is the unknown.
  assert.equal(splitNumberedProblems('1) 12 + 7 = ___\n2) 30 - 4 =\n3) 6 × 5 = ?')!.problems.length, 3);
  assert.deepEqual(splitNumberedProblems('7) Solve a + 1 = 2.\n8) Solve b - 3 = 4.\n9) Solve 2c = 8.')!.problems.map((p) => p.n), [7, 8, 9]);
  // All on one line, as a Vision model sometimes returns it.
  assert.deepEqual(splitNumberedProblems('Solve each. 1) b + 5 = 12 2) 3c = 21 3) d - 4 = 9')!.problems.map((p) => p.text),
    ['b + 5 = 12', '3c = 21', 'd - 4 = 9']);
  // A problem that runs over several lines stays one problem.
  const multi = splitNumberedProblems('1) Find how far the train goes.\nIt leaves at 9 and travels 60 km/h.\nHow far by noon?\n2) Find 15% of 80.\nShow your work.\n3) Simplify 4/8.')!;
  assert.equal(multi.problems.length, 3);
  assert.match(multi.problems[0].text, /train goes\.\s+It leaves at 9 and travels 60 km\/h\.\s+How far by noon\?/);
});
// Review 2026-10-04: numbered lines are far more often the PARTS of one
// problem (options, a system, steps, givens, statements, a proof) than a
// worksheet. Telling the brain "N separate problems" there breaks the
// problem, so each of these must get the ordinary single-problem marker.
const REAL_WORKSHEET = [
  'Solve for the variable. Round to the nearest hundredth if needed.', '',
  '1) v − 29 4/5 = 1/5', '2) −8 = c − 5', '3) n + 3 = −9', '4) 4a = 28', '5) x/3 = 7',
  '6) 6 = m − 1.2', '7) k + 1/2 = 3', '8) −2 = d + 9', '9) 1.5t = 6', '10) w − 14 = −20',
].join('\n');
const ONE_PROBLEM_WITH_NUMBERED_PARTS: Array<[string, string]> = [
  ['multiple choice with numbered options', 'What is the value of x in 2x + 6 = 14?\n1) x = 2\n2) x = 4\n3) x = 8\n4) x = 10'],
  ['numbered options, no question mark', 'Pick the value of x.\n1) x = 2\n2) x = 4\n3) x = 8'],
  ['numbered options after "choose"', 'Choose the equation with solution 4.\n1) 2x = 8\n2) 3x = 9\n3) x + 1 = 4'],
  ['system of equations', 'Solve the system:\n(1) 2x + y = 7\n(2) x - y = 2'],
  ['system of equations, inline', 'Solve the system: (1) 2x + y = 7 (2) x - y = 2'],
  ['three-equation system', 'Solve the system:\n(1) x + y + z = 6\n(2) x - y = 1\n(3) 2z = 6'],
  ['three-equation system, bare instruction', 'Solve:\n(1) x + y + z = 6\n(2) x - y + z = 2\n(3) x + y - z = 0'],
  ['numbered steps', 'Solve 3x + 2 = 11 by following these steps:\n1. Subtract 2 from both sides\n2. Divide by 3\n3. Check'],
  ['numbered givens', 'Given:\n1) mass = 1200 kg\n2) force = 3000 N\nFind the acceleration.'],
  ['numbered givens, bare', 'A car.\n1) m = 1200 kg\n2) F = 3000 N\n3) t = 4 s'],
  ['numbered statements', 'Consider the statements: 1. All squares are rectangles. 2. All rectangles are squares. 3. A rhombus has four equal sides. Which statements are true?'],
  ['numbered statements on lines', 'Consider the statements:\n1) x + 1 = 3 has one solution.\n2) x = x + 1 has no solution.\n3) 2x = 2x is always true.\nWhich statements are true?'],
  ['two-column proof', 'Prove that triangle ABC is congruent to triangle DEF.\nStatements and reasons:\n1. AB = DE (Given)\n2. BC = EF (Given)\n3. AC = DF (Given)\n4. ABC ≅ DEF (SSS)'],
  ['proof', 'Proof:\n1) a = b\n2) a + c = b + c\n3) c = c'],
  ['dependent pair', 'Question 3: A rectangle has length 8 and width 5.\nQuestion 4: What is its area?'],
  ['only two items', '1) Solve 2x = 8.\n2) Solve 3x = 9.'],
  ['a task after the list', 'Look at these:\n1) y = 2x + 1\n2) y = 2x - 3\n3) y = -x\nExplain what the first two have in common.'],
  ['text after a blank line', '1) Solve 2x = 8\n2) Solve 3x = 9\n3) Solve x + 1 = 5\n\nNow add your three answers together.'],
  ['numbered facts', 'Notes:\n1) The mitochondria makes ATP.\n2) The nucleus holds DNA.\n3) Ribosomes build proteins.'],
];
ok('splitNumberedProblems: numbered PARTS of one problem are never split', () => {
  for (const [name, one] of ONE_PROBLEM_WITH_NUMBERED_PARTS) {
    assert.equal(splitNumberedProblems(one), null, `${name}: ${one}`);
    assert.equal(buildStudentMediaBrainInput('image', { kind: 'extracted', problem: one }),
      `[The student uploaded an image to the whiteboard. It contains: "${one}". Respond to what they shared.]`, name);
  }
});
ok('splitNumberedProblems: the real worksheet still splits into ten', () => {
  const split = splitNumberedProblems(REAL_WORKSHEET)!;
  assert.deepEqual(split.problems.map((p) => p.n), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(split.preamble, 'Solve for the variable. Round to the nearest hundredth if needed.');
  assert.equal(split.problems[3].text, '4a = 28');
});
// Review 2026-10-04 (round 2): the first cut of the worksheet test refused
// ordinary worksheets — a preamble that merely held "steps" / "given" /
// "following" / "choose", a publisher footer, or items that are expressions
// rather than equations. Each of these is a worksheet and must split.
const THREE_EQ = '1) 2x = 8\n2) x + 3 = 7\n3) 5x = 20';
const REAL_ITEMS = REAL_WORKSHEET.replace(/^\s+|\s+$/g, '');
const WORKSHEETS: Array<[string, string, number]> = [
  ['title line + "Solve each equation."', `One-Step Equations\nSolve each equation.\n${THREE_EQ}`, 3],
  ['another title line', `Two-Step Equations\nSolve each equation.\n1) 2x + 1 = 9\n2) 3x - 2 = 7\n3) 5x + 5 = 20`, 3],
  ['"each of the following"', `Solve each of the following equations.\n${THREE_EQ}`, 3],
  ['"Show your steps."', `Solve each equation. Show your steps.\n${THREE_EQ}`, 3],
  ['"each given equation"', `Find the value of x in each given equation.\n${THREE_EQ}`, 3],
  ['"Choose any method."', `Solve. Choose any method.\n${THREE_EQ}`, 3],
  ['publisher footer', `${REAL_ITEMS}\n\n© Kuta Software LLC`, 10],
  ['publisher footer without the ©', `${REAL_ITEMS}\n\nKuta Software LLC`, 10],
  ['name/date footer', `${REAL_ITEMS}\n\nName: ____ Date: ____`, 10],
  ['page footer', `${REAL_ITEMS}\n\nPage 1`, 10],
  ['several footer lines', `${REAL_ITEMS}\n\nName: ____ Date: ____ Period: ____\n© Kuta Software LLC\nPage 1 of 2`, 10],
  ['footer with no blank line before it', `${REAL_ITEMS}\nPage 1`, 10],
  ['name/date header above the instruction', `Name: ____ Date: ____\nSolve each equation.\n${THREE_EQ}`, 3],
  ['expressions to simplify', 'Simplify each expression.\n1) 3(x+2) − 4x\n2) 2(a − 1) + 5\n3) 4y − (y + 2)', 3],
  ['bare "Evaluate."', 'Evaluate.\n1) 3/4 + 1/2\n2) 5/6 − 1/3\n3) 2/3 × 3/8', 3],
  ['"Factor completely."', 'Factor completely.\n1) x^2 - 9\n2) x^2 + 5x + 6\n3) 2x^2 - 8', 3],
  ['bare "Simplify."', 'Simplify.\n1) 12/18\n2) 15/25\n3) 21/28', 3],
  ['"Graph each line."', 'Graph each line.\n1) y = 2x + 1\n2) y = -x + 4\n3) y = 3x', 3],
  ['"Find the slope of each line."', 'Find the slope of each line.\n1) y = 2x + 1\n2) y = -x + 4\n3) y = 3x', 3],
  ['"Find the derivative."', 'Find the derivative.\n1) f(x) = x^2\n2) f(x) = 3x^3\n3) f(x) = sin x', 3],
];
ok('splitNumberedProblems: realistic worksheets split', () => {
  for (const [name, sheet, count] of WORKSHEETS) {
    const split = splitNumberedProblems(sheet);
    assert.ok(split, `${name}: ${sheet}`);
    assert.equal(split.problems.length, count, name);
    assert.match(buildStudentMediaBrainInput('image', { kind: 'extracted', problem: sheet }),
      new RegExp(`Respond to what they shared\\.\\] \\[This looks like ${count} separate numbered problems`), name);
  }
});
ok('splitNumberedProblems: a footer is not part of the last problem', () => {
  for (const footer of ['\n\n© Kuta Software LLC', '\n\nName: ____ Date: ____', '\n\nPage 1', '\nPage 1']) {
    const split = splitNumberedProblems(REAL_ITEMS + footer)!;
    assert.equal(split.problems[9].text, 'w − 14 = −20', footer);
    assert.equal(split.preamble, 'Solve for the variable. Round to the nearest hundredth if needed.');
  }
  // …and the marker's head still carries the text exactly as extracted.
  assert.ok(buildStudentMediaBrainInput('image', { kind: 'extracted', problem: `${REAL_ITEMS}\n\n© Kuta Software LLC` })
    .startsWith(`[The student uploaded an image to the whiteboard. It contains: "${REAL_ITEMS}\n\n© Kuta Software LLC". Respond to what they shared.]`));
});
// The loosened rules must not let these through.
const STILL_ONE_PROBLEM: Array<[string, string]> = [
  ['options under a verb-led problem (not a bare verb, no "each")', 'Simplify 3(x+2) − 4x.\n1) −x + 6\n2) x + 6\n3) 7x + 6'],
  ['options under "Evaluate 3/4 + 1/2."', 'Evaluate 3/4 + 1/2.\n1) 1 1/4\n2) 4/6 + 0\n3) 3/8 + 0'],
  ['expressions under a non-instruction', 'Look at these:\n1) 3(x+2) − 4x\n2) 2(a − 1) + 5\n3) 4y − (y + 2)'],
  ['expressions with no preamble', '1) 3(x+2) − 4x\n2) 2(a − 1) + 5\n3) 4y − (y + 2)'],
  ['"each" instruction that ends in a question', 'Simplify each expression. Which is largest?\n1) 12/18\n2) 15/25\n3) 21/28'],
  ['"Solve each system."', 'Solve each system.\n1) x + y = 3\n2) x − y = 1\n3) 2x + y = 4'],
  ['simultaneous equations', 'Solve the simultaneous equations.\n1) x + y = 3\n2) x − y = 1\n3) 2x + y = 4'],
  ['"using the following steps"', 'Solve each equation using the following steps.\n1) Subtract 2\n2) Divide by 3\n3) Check 3x + 2 = 11'],
  ['"follow these steps"', 'To solve 3x + 2 = 11, follow these steps.\n1) Subtract 2: 3x = 9\n2) Divide: x = 3\n3) Check: 3(3) + 2 = 11'],
  ['"choose one"', 'Solve. Choose one.\n1) 2x = 8\n2) 3x = 9\n3) x + 1 = 4'],
  ['"select"', 'Select each equation with solution 4.\n1) 2x = 8\n2) 3x = 9\n3) x + 1 = 5'],
  ['all assignments under a bare verb', 'Solve.\n1) x = 2\n2) x = 4\n3) x = 8'],
  ['words under a bare verb', 'Evaluate.\n1) the first claim\n2) the second claim\n3) the third claim'],
  ['a task after the footer-like list', `${THREE_EQ}\n\nName the property you used.`],
  ['text after the list that is not a footer', `Solve each equation.\n${THREE_EQ}\n\nNow add your three answers together.`],
  ['a task after the list that mentions software', `Solve each equation.\n${THREE_EQ}\n\nNow use the software to check all three together.`],
  ['a footer does not hide the task before it', `Solve each equation.\n${THREE_EQ}\n\nNow add your three answers together.\n\n© Kuta Software LLC`],
];
ok('splitNumberedProblems: the loosened worksheet rules still refuse one problem in numbered parts', () => {
  for (const [name, one] of STILL_ONE_PROBLEM) assert.equal(splitNumberedProblems(one), null, `${name}: ${one}`);
});
ok('multi-problem marker is worded as an observation, not an assertion', () => {
  const m = buildStudentMediaBrainInput('image', { kind: 'extracted', problem: REAL_WORKSHEET });
  assert.match(m, /Respond to what they shared\.\] \[This looks like 10 separate numbered problems/);
  assert.match(m, /\nIf so, do not put the whole list on the board as one problem card\. /);
  assert.doesNotMatch(m, /not one problem/);
});
ok('splitNumberedProblems: one problem is never split', () => {
  for (const one of [
    PROBLEM,
    'Find x.',
    'Solve 2x + 3 = 11. Then check your answer.',
    'A recipe needs 2.5 cups of flour and 1.5 cups of sugar. How much in total?', // decimals are not "2." / "1."
    'Use equation (1) and (2) to find x.',                                        // references, not items
    'The meeting is at 1:30 and ends at 2:45. How long is it?',                   // clock times
    '1) Find the area of the rectangle.',                                         // a lone numbered item
    'f(1) + f(2) = 7. Find f(3).',                                                // function arguments
    'In 2019 there were 12. In 2020 there were 15. What is the change?',
  ]) {
    assert.equal(splitNumberedProblems(one), null, one);
  }
});
ok('multi-problem marker: says N separate problems, lists them, and forbids one combined card', () => {
  const m = buildStudentMediaBrainInput('image', { kind: 'extracted', problem: WORKSHEET });
  assert.match(m, /10 separate (numbered )?problems/);
  for (let i = 1; i <= 10; i++) assert.ok(m.includes(`\n${i}. `), `lists problem ${i}`);
  assert.ok(m.includes('10. $w - 14 = -20$'));
  assert.match(m, /Solve for the variable\./);
  assert.match(m, /do NOT put (the whole list|them all)[^.]*one problem card/i);
  assert.match(m, /which problem/i);
  assert.match(m, /ONLY the (one )?problem being worked/);
  assert.match(m, /one at a time/i);
});
ok('multi-problem marker keeps both cross-module contracts (prefix + transcript echo)', () => {
  const m = buildStudentMediaBrainInput('image', { kind: 'extracted', problem: WORKSHEET });
  assert.match(m, STUDENT_BOARD_ACTION);
  assert.ok(m.startsWith('[') && m.endsWith(']'), 'still one bracketed marker for the brain-turn gate');
  assert.ok(m.startsWith(`[The student uploaded an image to the whiteboard. It contains: "${WORKSHEET}". Respond to what they shared.]`),
    'the single-problem wording is the unchanged head of the marker');
  assert.equal(extractStudentEcho(m), WORKSHEET, 'the saved transcript gets the worksheet text, not the instruction');
});
ok('multi-problem marker wording is generic (no subject, no topic, no example problem of its own)', () => {
  const a = buildStudentMediaBrainInput('image', { kind: 'extracted', problem: '1. Name the capital of France.\n2. Name the capital of Peru.\n3. Name the capital of Kenya.' });
  assert.match(a, /3 separate (numbered )?problems/);
  const instruction = a.slice(a.indexOf('Respond to what they shared.]') + 'Respond to what they shared.]'.length);
  assert.doesNotMatch(instruction.replace(/\n\d+\. .*/g, ''), /equation|variable|algebra|math|solve/i);
});
ok('a drawing with numbered lines gets the same treatment', () => {
  const m = buildStudentMediaBrainInput('drawing', { kind: 'extracted', problem: '1) 2 + 2 =\n2) 3 + 5 =\n3) 4 + 4 =' });
  assert.match(m, /^\[The student drew on the whiteboard\. It contains: /);
  assert.match(m, /3 separate (numbered )?problems/);
});
ok('a very long worksheet keeps the marker bounded', () => {
  const big = Array.from({ length: 60 }, (_, i) => `${i + 1}) Explain ${'word '.repeat(200)}`).join('\n');
  const m = buildStudentMediaBrainInput('image', { kind: 'extracted', problem: big });
  const instruction = m.slice(m.indexOf('Respond to what they shared.]'));
  assert.match(instruction, /60 separate (numbered )?problems/);
  assert.ok(instruction.length < 12_000, `instruction length ${instruction.length}`);
});
ok('extraction text: escapes that are content are not rewritten', () => {
  for (const literal of [String.raw`What does print("a\nb") output?`, String.raw`Open C:\new\table`, String.raw`In Python, \n means newline.`]) {
    assert.deepEqual(classifyExtraction({ httpOk: true, body: { extractedProblem: literal } }), { kind: 'extracted', problem: literal });
  }
});
ok('extraction text with literal backslash-n is normalised once, at classification', () => {
  const literal = String.raw`Solve.\n1) $x \neq 2$\n2) $-8 = c - 5$`;
  assert.deepEqual(classifyExtraction({ httpOk: true, body: { extractedProblem: literal } }),
    { kind: 'extracted', problem: 'Solve.\n1) $x \\neq 2$\n2) $-8 = c - 5$' });
});
ok('uploaded-problem card: one line per numbered item', () => {
  const texts = (svg: string) => [...svg.matchAll(/<text x="16" y="\d+" font-size="13"[^>]*>([^<]*)<\/text>/g)].map((t) => t[1]);
  const card = buildUploadedProblemCard(WORKSHEET) as unknown as { svg: string };
  const lines = texts(card.svg);
  assert.equal(lines.length, 11, lines.join(' | '));
  assert.equal(lines[0], 'Solve for the variable.');
  for (let i = 1; i <= 10; i++) assert.ok(lines[i].startsWith(`${i}) `), lines[i]);
  // Items the extraction ran together on one line are still listed one per line.
  const inline = texts((buildUploadedProblemCard('Solve each. 1) b + 5 = 12 2) 3c = 21 3) d - 4 = 9') as unknown as { svg: string }).svg);
  assert.deepEqual(inline, ['Solve each.', '1) b + 5 = 12', '2) 3c = 21', '3) d - 4 = 9']);
});

// ---- request + debug event --------------------------------------------------
ok('the session path asks the route for the extraction only (no tutor-reply model call)', () => {
  const body = extractionRequestBody({ dataUrl: 'data:image/gif;base64,AAAA', subject: 'Math', topic: 'Algebra', level: 'Grade 7' });
  assert.deepEqual(body, { imageData: 'AAAA', mimeType: 'image/gif', subject: 'Math', topic: 'Algebra', level: 'Grade 7', extractOnly: true });
  // A canvas capture with no recognisable prefix is announced as PNG, as before.
  assert.equal(extractionRequestBody({ dataUrl: 'BBBB' }).mimeType, 'image/png');
  assert.equal(extractionRequestBody({ dataUrl: 'BBBB' }).imageData, 'BBBB');
});
ok('image_upload debug detail: same text the embed fallback used to send, for every entry point', () => {
  assert.equal(studentMediaDebugDetail('image', 'data:image/jpeg;base64,AAAA', false), 'Homework upload: image/jpeg');
  assert.equal(studentMediaDebugDetail('image', 'data:image/jpeg;base64,AAAA', true), 'Homework upload (embed): image/jpeg');
  assert.equal(studentMediaDebugDetail('drawing', 'data:image/png;base64,AAAA', false), 'Whiteboard drawing: image/png');
  assert.equal(studentMediaDebugDetail('drawing', 'data:image/png;base64,AAAA', true), 'Whiteboard drawing (embed): image/png');
});

// ---- visible notice ---------------------------------------------------------
ok('in-progress and failure notices exist for both kinds and name the right thing', () => {
  const p = studentMediaNotice('image', 'analyzing');
  assert.equal(p.tone, 'progress');
  assert.match(p.text, /upload/i);
  assert.equal(studentMediaNotice('drawing', 'analyzing').tone, 'progress');
  assert.match(studentMediaNotice('drawing', 'analyzing').text, /drawing/i);
  for (const phase of ['unreadable', 'failed', 'not-ready'] as const) {
    const f = studentMediaNotice('image', phase);
    assert.equal(f.tone, 'error', phase);
    assert.match(f.text, /again/i, phase);
    assert.doesNotMatch(f.text, /drawing|drew/i, phase);
  }
});

// ---- extraction token usage -------------------------------------------------
ok('extraction usage is read from the response body for the session cost channel', () => {
  assert.deepEqual(
    extractionUsage({ extractedProblem: 'x', usage: { inputTokens: 1200, outputTokens: 340 } }),
    { inputTokens: 1200, outputTokens: 340, cacheReadTokens: 0, cacheCreationTokens: 0 },
  );
  // An unreadable image still cost the Vision call.
  assert.deepEqual(
    extractionUsage({ extractedProblem: null, usage: { inputTokens: 900, outputTokens: 0 } }),
    { inputTokens: 900, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 },
  );
});
ok('missing / malformed / all-zero usage reports nothing (never NaN into the cost total)', () => {
  for (const body of [null, 'oops', {}, { usage: null }, { usage: 'x' }, { usage: { inputTokens: 'a', outputTokens: 1 } },
    { usage: { inputTokens: 0, outputTokens: 0 } }, { usage: { inputTokens: -5, outputTokens: 2 } },
    { usage: { inputTokens: Number.NaN, outputTokens: 2 } }]) {
    assert.equal(extractionUsage(body), null, JSON.stringify(body));
  }
});

// ---- extraction timeout -----------------------------------------------------
ok('extraction timeout is 45 s', () => { assert.equal(EXTRACTION_TIMEOUT_MS, 45_000); });
okAsync('a hung extraction is aborted at the timeout and lands on the FAILED path', async () => {
  // A fetch that never settles on its own — only the abort signal ends it.
  const hung = (signal: AbortSignal) => new Promise<never>((_res, rej) => {
    signal.addEventListener('abort', () => rej(new DOMException('aborted', 'AbortError')));
  });
  const t0 = Date.now();
  let outcome;
  try {
    const body = await runWithAbortTimeout(30, hung);
    outcome = classifyExtraction({ httpOk: true, body });
  } catch {
    outcome = classifyExtraction({ threw: true });
  }
  assert.deepEqual(outcome, { kind: 'failed' });
  assert.ok(Date.now() - t0 < 2000, 'did not hang');
  // Same marker / notice as a network error: try again.
  assert.match(buildStudentMediaBrainInput('image', outcome), /try uploading it again/i);
  assert.match(studentMediaNotice('image', outcome.kind).text, /again/i);
});
okAsync('a request that finishes in time returns its value and is not aborted afterwards', async () => {
  let seen: AbortSignal | null = null;
  const v = await runWithAbortTimeout(30, async (signal) => { seen = signal; return 'done'; });
  assert.equal(v, 'done');
  await new Promise((r) => setTimeout(r, 60));
  assert.equal((seen as AbortSignal | null)?.aborted, false, 'timer cleared on completion');
});
okAsync('a request that throws on its own rethrows (network error path unchanged)', async () => {
  await assert.rejects(runWithAbortTimeout(30, async () => { throw new TypeError('Failed to fetch'); }), /Failed to fetch/);
});

Promise.all(pendingAsync).then(
  () => { console.log(`upload-flow: all ${n} checks passed`); },
  (err) => { console.error(err); process.exit(1); },
);
