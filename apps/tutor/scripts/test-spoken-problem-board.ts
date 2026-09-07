/**
 * Spoken-problem board net (live check 6, portal-63ee9f2c). Run:
 *   npm run test:spoken-problem-board
 */
import { detectSpokenProblem, numericTokens, detectSpokenEquationClaim } from '../src/lib/tutor/voice/spoken-problem-board';

let pass = 0, fail = 0;
function check(name: string, ok: boolean, detail?: string) {
  if (ok) pass++; else { fail++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// numericTokens normalizes by value
check('tokens: $3.60 / 3.6 / 3.60 collapse', numericTokens('$3.60 and 3.6 and 3.60').join(',') === '3.6');
check('tokens: 25% → 25, 18 out of 24', numericTokens('25% of 18 out of 24').sort().join(',') === '18,24,25');
check('tokens: latex 25\\% and 0.75 \\times 80', numericTokens('0.75 \\times 80 = 60, 25\\%').sort().join(',') === '0.75,25,60,80');
check('tokens: none', numericTokens('which jar is the better deal').length === 0);

// LC6 T4 — the jar problem: numbers spoken, board carried a numberless template.
{
  const d = detectSpokenProblem(
    [
      'Here we go.',
      'Say a 12-ounce jar of peanut butter costs $3.60 and a 20-ounce jar costs $6.00.',
      'Which jar is the better deal, and how would you set that up as a proportion?',
    ],
    ['\\frac{\\text{price}}{\\text{ounces}} = \\frac{\\text{price}}{\\text{ounces}}', '3x + 5 = 2x + 12'],
  );
  check('LC6 jar: detected', !!d, JSON.stringify(d));
  check('LC6 jar: statement starts at the numbers, no discourse', !!d && d.statement.startsWith('Say a 12-ounce') === false && d.statement.startsWith('a 12-ounce jar') , d?.statement);
  check('LC6 jar: carries all four numbers', !!d && d.numbers.length === 4, d?.numbers.join(','));
}
// LC6 T15 — 18 out of 24 as a percent; board had the generic percent template.
{
  const d = detectSpokenProblem(
    ['Same ratio game, just dressed up.', 'If 18 out of 24 shots hit the target, set up the proportion and tell me the percent.'],
    ['\\text{percent} = \\frac{\\text{part}}{\\text{whole}} \\times 100'],
  );
  check('LC6 shots: detected', !!d, JSON.stringify(d));
  check('LC6 shots: 100 from the template is not enough coverage', !!d && d.covered.length === 0);
}
// LC6 T17 — jacket, board still showed the previous answer.
{
  const d = detectSpokenProblem(
    ['Nice, 75%.', 'Now a jacket is priced at $80 with a 25% discount.', 'How would you set up an equation to find the discount amount?'],
    ['\\frac{18}{24} \\times 100 = 75\\%'],
  );
  check('LC6 jacket: detected', !!d, JSON.stringify(d));
  check('LC6 jacket: window excludes the praise sentence', !!d && !/75/.test(d.statement), d?.statement);
}
// Scaffolding question about numbers already on the board must NOT fire.
{
  const d = detectSpokenProblem(
    ['Right idea on the setup.', 'What is $0.75 \\times 80$?'],
    ['80 - 0.25(80) = 80 - 0.75 \\cdot 80', '0.75 \\times 80 = ?'],
  );
  check('covered scaffold: null', d === null, JSON.stringify(d));
}
// Authored card rendered this turn with the same numbers → covered.
{
  const d = detectSpokenProblem(
    ['A shirt is marked down from $45 to $36.', 'What is the percent decrease?'],
    ['A shirt is marked down from $45 to $36. What is the percent decrease? Type your answer as a number only (no percent sign).'],
  );
  check('authored card covers: null', d === null);
}
// Only one number → not a problem.
check('single number: null', detectSpokenProblem(['What do you get when you divide both sides by 45?'], []) === null);
// No ask → null.
check('no ask: null', detectSpokenProblem(['So 12 times 5 is 60.', 'That settles it.'], []) === null);
// Logistics with numbers and a question → null.
check('logistics: null', detectSpokenProblem(['We have 5 minutes left and 2 problems done.', 'Want to wrap up?'], []) === null);
check('practice pointer: null', detectSpokenProblem(["I've set 3 practice questions on 2 objectives.", 'Ready to see them in your practice tab?'], []) === null);
// Yes/no conceptual questions with numbers are not problems (prod control).
check('yes/no conceptual: null', detectSpokenProblem(['Quick check, does the size of $a$ — like $a = 5$ versus $a = 1$ — change where that vertex sits?'], []) === null);
check('invitation without a cue: null', detectSpokenProblem(['Wednesday the vending machine eats another 6 dollars 75.', 'Want to take a crack at that one?'], []) === null);
// Diagram labels count as board text (numbers may live in a sketch payload).
check('diagram labels cover: null', detectSpokenProblem(['If side AB is 6 and side BC is 4, what is the perimeter?'], ['{"action":"showDiagram","data":{"labels":[{"text":"AB = 6"},{"text":"BC = 4"}]}}']) === null);
// Too long to card.
check('too long: null', detectSpokenProblem([`${'A train leaves at 3 pm going 60 mph. '.repeat(12)}How far by 5 pm?`], []) === null);
// Coverage: two of four numbers on the board is not enough — the student
// still cannot see 20 and 6.00; all four on the board is.
{
  const d = detectSpokenProblem(['A 12-ounce jar costs $3.60 and a 20-ounce jar costs $6.00.', 'Which is cheaper per ounce?'], ['12 / 3.60']);
  check('half covered: fires', !!d && d.covered.join(',') === '12,3.6', JSON.stringify(d));
  const d2 = detectSpokenProblem(['A 12-ounce jar costs $3.60 and a 20-ounce jar costs $6.00.', 'Which is cheaper per ounce?'], ['\\frac{12}{3.60} = \\frac{20}{6.00}']);
  check('fully covered: null', d2 === null, JSON.stringify(d2));
}
// LC6 T15 verbatim: the previous recipe left "3x = 18" on the board and the
// template carried 100 — the ask's own numbers (18, 24) decide, and 24 is missing.
{
  const d = detectSpokenProblem(
    ['Here we go.', 'Same ratio game, just dressed up: percent is really "part over whole," turned into a proportion out of 100 — like a match score expressed as a percentage of shots on target.', "If 18 out of 24 shots hit the target, what's that as a percent — and can you set it up as the proportion first?"],
    ['\\frac{2}{3} = \\frac{x}{9} \\implies 3x = 18 \\implies x = 6', '\\text{percent} = \\frac{\\text{part}}{\\text{whole}} \\times 100'],
  );
  check('LC6 shots verbatim: fires despite the coincidental 18', !!d, JSON.stringify(d));
}
// Setup-sentence context with one uncovered decimal, ask sentence without numbers → null (prod control).
check('setup decimal context: null', detectSpokenProblem(['$x = 0.1$, and since it is small, $e^{0.1}$ should land just a bit above $1.1$.', 'What do you get when you actually add up those four terms?'], ['e^{0.1} \\approx 1 + 0.1 + \\frac{0.1^2}{2}']) === null);
// A small coincidental integer alone does not fire ("2" and "3" are on any algebra board).
check('two small covered ints: null', detectSpokenProblem(['Which is bigger, 2 or 3?'], ['2x + 3']) === null);

// ---- Live check 7: spoken equation claims ----
{
  const hit = detectSpokenEquationClaim(
    ["Right. $5 \\times 3$ is $15$, and with the sign it's $5x - 15$.", 'That matches the board.', "So the full equation now reads $5x - 15 = 2x + 9$.", "What's your move to collect the $x$ terms onto one side?"],
    ['5(x-3) = 5x - 5\\times 3', '5(x-3) = 5x - 15', 'Solve: 5(x − 3) = 2x + 9'],
  );
  check('LC7 equation claim: fires', !!hit && hit.latex === '5x - 15 = 2x + 9', JSON.stringify(hit));
  check('equation on board (spacing differs): null', detectSpokenEquationClaim(["So the full equation now reads $5x - 15 = 2x + 9$."], ['5x - 15 = 2x + 9']) === null);
  check('numeric-only equation: null', detectSpokenEquationClaim(["That leaves $6 \\cdot 3 = 18$."], ['6 \\times 3 = 18']) === null);
  check('no board-claim cue: null', detectSpokenEquationClaim(["Try $5x - 15 = 2x + 9$ on your own."], []) === null);
  check('inequality: null', detectSpokenEquationClaim(["So we have $x \\le -4$."], []) === null);
  check('no equation: null', detectSpokenEquationClaim(["What do you get when you simplify both sides down?"], []) === null);
  check('hypothetical wrong formula: null', detectSpokenEquationClaim(["Say instead the formula reads $P = 2l + 2l w$, weird made-up formula, but l shows up twice."], []) === null);
  check('frac forms match: null', detectSpokenEquationClaim(["Look at that proportion on the board: $\\frac{12}{2.40} = \\frac{20}{x}$."], ['\\dfrac{12}{2.40} = \\dfrac{20}{x}']) === null);
}
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
