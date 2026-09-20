import { strict as assert } from 'node:assert';
import { buildJudgeUserContent, JUDGE_SYSTEM_PROMPT } from '../src/lib/tutor/judge-prompt';

const withTruth = buildJudgeUserContent({
  boardSummary: 'Eq: 6x - 2x - 12 = 4x - 2x + 10',
  spokenText: 'So x equals 5.5.',
  authoredSolution: 'Problem: 6x - 12 = 4x + 10 · steps: subtract 4x; add 12; divide by 2 · answer: x = 11',
});
assert.match(withTruth, /<authored_solution>[\s\S]*x = 11[\s\S]*<\/authored_solution>/);

const without = buildJudgeUserContent({
  boardSummary: 'Eq: 2x = 4',
  spokenText: 'So x is 2.',
});
assert.doesNotMatch(without, /<authored_solution>/);

assert.match(JUDGE_SYSTEM_PROMPT, /authored_solution/);
assert.match(JUDGE_SYSTEM_PROMPT, /outranks the whiteboard/i);

console.log('judge-authored-solution: all assertions passed');
