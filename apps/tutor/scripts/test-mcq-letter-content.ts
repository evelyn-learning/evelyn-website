import { reconcileMcqLetterWithContent, extractChoiceOptions } from '../src/lib/tutor/voice/mcq-letter-content';

let pass = 0, fail = 0;
function check(name: string, ok: boolean, detail = '') { if (ok) pass++; else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); } }
const sampling = extractChoiceOptions([{ id: 'A', text: 'Simple random sample' }, { id: 'B', text: 'Systematic sample' }, { id: 'C', text: 'Cluster sample' }, { id: 'D', text: 'Stratified sample' }]);
// live 2026-09-05: STT heard B for D
const live = reconcileMcqLetterWithContent('Oh, this is definitely a stratified sampling, so option B.', sampling);
check('live: B → D by content', live?.to === 'D' && live?.from === 'B', JSON.stringify(live));
check('live: rewritten keeps the sentence', live?.rewritten === 'Oh, this is definitely a stratified sampling, so option D.', live?.rewritten);
check('letter matches content ⇒ nothing', reconcileMcqLetterWithContent('stratified, so option D', sampling) === null);
check('letter only ⇒ nothing', reconcileMcqLetterWithContent('option B', sampling) === null);
check('content only ⇒ nothing', reconcileMcqLetterWithContent('I think it is cluster sampling', sampling) === null);
check('ambiguous content (two choices named) ⇒ nothing', reconcileMcqLetterWithContent('cluster or stratified, I will say B', sampling) === null);
check('a bare trailing letter counts as spoken', reconcileMcqLetterWithContent('systematic sampling. C', sampling)?.to === 'B');
check('shared word alone is not a match ("sample" in every choice)', reconcileMcqLetterWithContent('the sample thing, option A', sampling) === null);
const math = extractChoiceOptions([{ id: 'A', text: '$x = 3$' }, { id: 'B', text: '$x = -3$' }, { id: 'C', text: 'No solution' }, { id: 'D', text: 'Infinitely many solutions' }]);
check('math: "no solution, so C" — letter agrees ⇒ nothing', reconcileMcqLetterWithContent('there is no solution, so C', math) === null);
check('math: "infinitely many solutions, answer is C" ⇒ D', reconcileMcqLetterWithContent('infinitely many solutions, answer is C', math)?.to === 'D');
check('positional letters when choices are strings', extractChoiceOptions(['red', 'blue']).map((o) => o.letter).join('') === 'AB');
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
