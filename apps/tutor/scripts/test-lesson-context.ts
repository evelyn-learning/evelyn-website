/**
 * Host-supplied lesson context (GameClass v1.1): clamp, never reject; render
 * only what is present. Run: npx tsx scripts/test-lesson-context.ts
 */
import {
  parseLessonContext, parseEntry, clampTitle, renderLessonContextBlock, renderQuestionBlock, LESSON_CONTEXT_LIMITS as L,
} from '@/lib/tutor/embed/lesson-context';

const checks: Array<[string, boolean]> = [];
const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// parse: absent → undefined
checks.push(['no fields → undefined', parseLessonContext({ partner_id: 'x', topic: 't' }) === undefined]);
checks.push(['non-object → undefined', parseLessonContext(null) === undefined && parseLessonContext('x') === undefined]);
// parse: happy path
const full = parseLessonContext({
  title: 'Own a Piece or Lend the Money?', description: 'desc', question: 'Q?', student_answer: 'A', correct_answer: 'B',
  context: { summary: 'S', characters: ['Aaron', 'Lori'], transcript: 'T', playhead_seconds: 212 },
});
checks.push(['all fields parsed', eq(full, { title: 'Own a Piece or Lend the Money?', description: 'desc', summary: 'S', characters: ['Aaron', 'Lori'], transcript: 'T', playheadSeconds: 212, question: 'Q?', studentAnswer: 'A', correctAnswer: 'B' })]);
// clamps
const big = parseLessonContext({ title: 'x'.repeat(500), context: { transcript: 'y'.repeat(50_000), characters: Array.from({ length: 30 }, (_, i) => `c${i}`.padEnd(200, 'z')) } })!;
checks.push(['title cut to limit', big.title?.length === L.title]);
checks.push(['transcript cut to limit', big.transcript?.length === L.transcript]);
checks.push(['characters capped at 10 × 80', big.characters?.length === L.characters && big.characters.every((c) => c.length <= L.character)]);
// wrong types drop the field, keep the rest
const wrong = parseLessonContext({ title: 42, question: 'Q', context: { characters: 'Aaron', playhead_seconds: '212', summary: ['no'] } })!;
checks.push(['wrong-typed fields dropped, valid ones kept', eq(wrong, { question: 'Q' })]);
checks.push(['negative/NaN playhead dropped', parseLessonContext({ context: { playhead_seconds: -5 } }) === undefined && parseLessonContext({ context: { playhead_seconds: NaN } }) === undefined]);
checks.push(['blank strings dropped', parseLessonContext({ title: '   ', description: '' }) === undefined]);
checks.push(['strings are trimmed', parseLessonContext({ title: '  Hi  ' })?.title === 'Hi']);
// entry
checks.push(['entry in-flow', parseEntry({ entry: 'in-flow' }) === 'in-flow']);
checks.push(['entry other → undefined', parseEntry({ entry: 'standalone' }) === undefined && parseEntry({}) === undefined]);
// clampTitle
checks.push(['clampTitle short unchanged', clampTitle('Short') === 'Short']);
checks.push(['clampTitle long → 80 incl. ellipsis', clampTitle('a'.repeat(100)).length === 80 && clampTitle('a'.repeat(100)).endsWith('…')]);
// render: lesson context block
const blk = renderLessonContextBlock(full!);
checks.push(['block names the title', blk.includes('Lesson: Own a Piece or Lend the Money?')]);
checks.push(['block has clip, people, position', blk.includes('Clip: S') && blk.includes('People: Aaron, Lori') && blk.includes('3:32 of the clip')]);
checks.push(['block wraps transcript', blk.includes('<clip_transcript>\nT\n</clip_transcript>')]);
checks.push(['block carries the no-invention rule', /Do not add names, numbers, offers or events/.test(blk)]);
checks.push(['block is generic (no partner words)', !/gameclass|shark|scrub/i.test(blk)]);
checks.push(['empty context → empty block', renderLessonContextBlock({}) === '' && renderLessonContextBlock({ question: 'Q' }) === '']);
// render: question block
const qb = renderQuestionBlock(full!);
checks.push(['question block has Q/A/correct', qb.includes('Question: Q?') && qb.includes('Student answered: A') && qb.includes('never state it outright') && qb.includes('B')]);
checks.push(['no question → empty', renderQuestionBlock({ title: 't' }) === '']);
checks.push(['question without answers renders', renderQuestionBlock({ question: 'Only Q' }).includes('Question: Only Q') && !renderQuestionBlock({ question: 'Only Q' }).includes('Student answered')]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
