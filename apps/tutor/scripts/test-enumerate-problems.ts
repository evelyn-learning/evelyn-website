/**
 * Problem enumeration + homework plan helpers.
 *
 * Usage: npx tsx scripts/test-enumerate-problems.ts
 *        (npm run test:enumerate-problems)
 */
import { parseEnumeration, enumerateProblems, HOMEWORK_MAX_PROBLEMS } from '../src/lib/tutor/lesson-plan/enumerate-problems';
import { homeworkProblemsOf, buildHomeworkPlanFields } from '../src/lib/tutor/lesson-plan/homework';
let passed = 0, failed = 0; const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };
(async () => {
  assert(JSON.stringify(parseEnumeration({ problems: [{ n: 1, text: 'Solve b + 5 = 12' }, { n: 2, text: '2b + x = 10' }] }))
    === JSON.stringify([{ n: 1, text: 'Solve b + 5 = 12' }, { n: 2, text: '2b + x = 10' }]), 'parse: numbered list kept in order');
  assert(parseEnumeration({ problems: [{ text: 'a' }, { text: 'b' }] })?.map((p) => p.n).join(',') === '1,2', 'parse: missing n → 1-based order');
  assert(parseEnumeration({ problems: [] }) === null, 'parse: empty → null');
  assert(parseEnumeration('nope') === null, 'parse: garbage → null');
  assert(parseEnumeration({ problems: Array.from({ length: 40 }, (_, i) => ({ text: `q${i}` })) })?.length === HOMEWORK_MAX_PROBLEMS, 'parse: capped at 25');
  const fake = { complete: async () => '```json\n{"problems":[{"n":1,"text":"x + 2 = 5"}]}\n```' };
  assert((await enumerateProblems('1) x + 2 = 5', fake))[0].text === 'x + 2 = 5', 'enumerate: fenced JSON parsed');
  const failing = { complete: async () => { throw new Error('boom'); } };
  const fo = await enumerateProblems('whole worksheet text', failing);
  assert(fo.length === 1 && fo[0].text === 'whole worksheet text', 'enumerate: fail-open → one problem holding the text');
  const fields = buildHomeworkPlanFields([{ n: 1, text: 'x + 2 = 5' }], 'Linear equations');
  assert(fields.metadata.kind === 'homework-help' && fields.los.length === 1 && fields.los[0].shortTitle === 'Linear equations', 'plan fields: wrapper LO + metadata');
  assert(homeworkProblemsOf({ metadata: fields.metadata })?.[0].n === 1, 'accessor reads metadata.problems');
  assert(homeworkProblemsOf({ metadata: { materialKind: 'problem_set' } }) === null, 'accessor null when absent');
  console.log(`${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
