/// <reference types="node" />
/**
 * Replay harness unit suite — no network, no browser.
 *   npm run test:replay-harness
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildStudentSystemPrompt, observerLine, parseStudentReply, scriptedStudentTurn, type Fixture, type ReplayTurn } from './scripted-student';
import { averageScorecards, scoreRun, type RunBundle } from './scorecard';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};

async function main() {
  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'calc-lhopital.json'), 'utf8')) as Fixture;

  console.log('fixture');
  check('names its source sessions', fixture.sourceSessions.length >= 1 && fixture.sourceSessions.every((s) => /^portal-|^embed-/.test(s)));
  check('carries the claims the embed needs', ['subject', 'level', 'curriculum_module', 'input_mode'].every((k) => k in fixture.claims));
  check('every reaction has a known complaint or request tag', fixture.student.reactions.every((r) => ['complaint_reask', 'complaint_ignored', 'move_on', 'verdict_only', 'recap_request', 'end_request'].includes(r.tag)));

  console.log('student prompt');
  const prompt = buildStudentSystemPrompt(fixture.student);
  check('lists every beat and reaction', fixture.student.beats.every((b) => prompt.includes(`[${b.id}`)) && fixture.student.reactions.every((r) => prompt.includes(`tag ${r.tag}`)));
  check('asks for one line of JSON', /ONE line of JSON/.test(prompt));
  check('says a cooperative tutor gets a cooperative reply', /cooperative/.test(prompt));

  console.log('reply parsing');
  check('reads a JSON reply', JSON.stringify(parseStudentReply('{"tag":"move_on","say":"I know this, next."}')) === JSON.stringify({ tag: 'move_on', say: 'I know this, next.' }));
  check('reads JSON wrapped in prose', parseStudentReply('Sure: {"tag":"answer","say":"3"} ok').say === '3');
  check('an unknown tag falls back to answer', parseStudentReply('{"tag":"shrug","say":"hm"}').tag === 'answer');
  check('plain text becomes an answer', JSON.stringify(parseStudentReply('"It is zero."')) === JSON.stringify({ tag: 'answer', say: 'It is zero.' }));

  console.log('turn assembly');
  let seen: { role: string; content: string }[] = [];
  const history: ReplayTurn[] = [
    { role: 'tutor', text: 'Hey.' }, { role: 'tutor', text: 'What is sin 0?' },
    { role: 'student', text: 'Zero.', tag: 'answer' },
  ];
  const r = await scriptedStudentTurn(fixture.student, 'Right. And cos 0?', history, { complete: async (_s, m) => { seen = m; return '{"tag":"answer","say":"One."}'; } });
  check('returns the stubbed reply', r.say === 'One.' && r.tag === 'answer');
  check('roles alternate and start with the tutor', seen.map((m) => m.role).join(',') === 'user,assistant,user');
  check('adjacent tutor turns are merged', seen[0].content.includes('Hey.') && seen[0].content.includes('sin 0'));
  check('the student sees its own earlier tag', seen[1].content.includes('"tag":"answer"'));

  check('the latest tutor turn carries the observer facts', /\[observer\] this tutor turn: 4 words, ends with a question\. Your previous turn was: answer/.test(seen[2].content), seen[2].content);
  check('the observer counts earlier complaints', /asked to move on 1 time/.test(observerLine('Fine.', [{ role: 'student', text: 'next', tag: 'move_on' }])));
  check('the prompt quotes the real student for tone', prompt.includes('Just tell me if I got the 3 parts right'));

  console.log('scorecard');
  const bundle: RunBundle = {
    fixture: 'calc-lhopital', arm: 'v1', startedAt: '2026-11-09T00:00:00Z', minutes: 10, endedBy: 'tutor_close', estimatedCost: 0.5,
    turns: [
      { role: 'tutor', text: 'What is sin 0?' },
      { role: 'student', text: 'Zero.', tag: 'answer' },
      { role: 'tutor', text: 'Right. Why is that?' },
      { role: 'student', text: 'I know this, move on.', tag: 'move_on' },
      { role: 'tutor', text: 'Sure. Try this limit.' },
      { role: 'student', text: 'It is 3.', tag: 'answer' },
      { role: 'tutor', text: 'Let us check the working step by step one two three four five six seven eight.' },
      { role: 'student', text: 'Just tell me if I am right.', tag: 'verdict_only' },
      { role: 'tutor', text: 'Yes, 3 is right.' },
      { role: 'student', text: 'Recap please.', tag: 'recap_request' },
      { role: 'tutor', text: 'Before the recap, one more question?' },
      { role: 'student', text: 'Just the recap.', tag: 'complaint_ignored' },
      { role: 'tutor', text: 'Here is the recap. Three takeaways to hold onto.' },
    ],
    events: [
      { type: 'brain_turn', message: 'Brain 5328ms · 1 tool call(s) · first_sentence=2000ms · in=100 out=20 cr=1000 cc=5' },
      { type: 'brain_turn', message: 'Brain 4000ms · first_sentence=1000ms · in=200 out=30 cr=2000' },
      { type: 'voice_verdict_cut', message: 'praised_incorrect' },
      { type: 'meta_narration_dropped', message: 'x' },
    ],
  };
  const card = scoreRun(bundle);
  check('counts complaints by tag', card.complaints.move_on === 1 && card.complaints.verdict_only === 1 && card.complaints.complaint_ignored === 1 && card.complaintsTotal === 3, card.complaints);
  check('question after an answer: 1 of 2', card.questionAfterAnswerShare === 0.5, card.questionAfterAnswerShare);
  check('words after a verdict-only request', card.wordsAfterVerdictOnly === 4, card.wordsAfterVerdictOnly);
  check('recap arrives on the second tutor turn after the request', card.tutorTurnsAfterRecapRequest === 2, card.tutorTurnsAfterRecapRequest);
  check('reads latency and tokens from brain_turn', card.firstSentenceMsP95 === 2000 && card.inputTokens === 3305 && card.outputTokens === 50, [card.firstSentenceMsP95, card.inputTokens, card.outputTokens]);
  check('counts cuts and narration drops', card.verdictCuts === 1 && card.narrationDrops === 1);
  check('cost per minute', card.costPerMinute === 0.05);
  const avg = averageScorecards([card, { ...card, complaintsTotal: 5 }]);
  check('averages across runs', avg.runs === 2 && avg.complaintsTotal === 4, avg.complaintsTotal);

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main();
