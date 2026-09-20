import { findUngroundedComputation } from '../src/lib/tutor/voice/posed-computation';

let pass = 0, fail = 0;
function check(name: string, ok: boolean, detail = '') { if (ok) pass++; else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); } }
const stmt = 'Simplify: $8 - 3(2x-4) + 5x$';
// live 2026-09-06: the posed -2 does not exist in the problem (2 is a coefficient of x)
const live = findUngroundedComputation("So before anything else — what do you think $-2 \\times (-4)$ comes out to?", [stmt]);
check('live: -2 × (-4) is ungrounded (missing -2)', !!live && live.missing.join(',') === '-2', JSON.stringify(live));
check('-3 × (-4) is grounded', findUngroundedComputation("what's $-3 \\times (-4)$?", [stmt]) === null);
check('3 × 5 grounded in 3(2x+5)', findUngroundedComputation('What does $3 \\times 5$ come out to?', ['Simplify $3(2x+5)+4x-7$']) === null);
check('not a question ⇒ null', findUngroundedComputation('So -2 times -4 is 8.', [stmt]) === null);
check('no grounding text ⇒ null', findUngroundedComputation('what is 6 × 7?', []) === null);
check('student-mentioned number grounds it', findUngroundedComputation('what is -2 × -4?', [stmt, '-2 into -4 is 8, but why are we calculating -2 into -4?']) === null);
check('division: 21 ÷ 7 grounded', findUngroundedComputation('how many groups — what is 21 ÷ 7?', ['21 ÷ 7 =']) === null);
check('division: 64 ÷ 4 ungrounded when the problem is 64 ÷ 16', !!findUngroundedComputation('what is 64 ÷ 4?', ['64 ÷ 16 =']));
check('addition is out of scope', findUngroundedComputation('what is 9 + 6?', [stmt]) === null);
check('board summary grounds derived values', findUngroundedComputation('what is 6 × 4?', [stmt, 'board: 6x + 4x = 10x; 6 and 4 shown']) === null);

// DISTRIBUTE shape (live 2026-09-06 addendum A1)
const P = '10 - 2(x - 3) = 4';
const d1 = findUngroundedComputation('What happens when we distribute that negative 3 across both terms inside?', [P]);
check('distribute: negative 3 ungrounded against 10 - 2(x-3)', !!d1 && d1.op === 'distribute' && d1.a === '-3' && d1.missing.join() === '-3', JSON.stringify(d1));
check('distribute: negative 2 grounded (matches -2(x-3))', findUngroundedComputation('What happens when we distribute that negative 2 across both terms inside?', [P]) === null);
check('distribute: 3 grounded in 3(2x-4)', findUngroundedComputation('What do we get distributing the 3?', ['3(2x - 4) = 4x + 10']) === null);
check('distribute: -3 grounded in -3(x+1)', findUngroundedComputation('What do we get distributing the -3?', ['-3(x + 1) = 9']) === null);
check('distribute: 5 ungrounded (only 3 in problem)', !!findUngroundedComputation('What do we get distributing the 5?', ['3(2x - 4) = 4x + 10']));
check('distribute: not a question ⇒ null', findUngroundedComputation('Distribute the 7 first.', [P]) === null);
check('distribute: coefficient not glued to parenthesis does not ground', !!findUngroundedComputation('What happens when we distribute the 4?', ['4 + 2(x - 3) = 10']));

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
