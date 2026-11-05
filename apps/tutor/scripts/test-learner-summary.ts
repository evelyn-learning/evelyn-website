/**
 * Learner summary module (GDI learner home, task 1): pure parsing of the stored
 * session into facts, the generic prompt, reply validation, assembly and the
 * one-retry generator. Run: cd apps/tutor && npx tsx scripts/test-learner-summary.ts
 */
import assert from 'node:assert';
import {
  parseWorkingLevelEvent, parsePronunciationNote, correctionsFromTranscript, buildSessionFacts,
  validateModelReply, assembleSummary, generateLearnerSummary, renderSummaryPrompt, LEARNER_SUMMARY_SCHEMA,
  type SessionFacts,
} from '../src/lib/tutor/portal/learner-summary';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ok  ${name}`); }
  else { failed++; console.log(`  FAIL ${name}${detail ? `  — ${detail}` : ''}`); }
}
const eq = (a: unknown, b: unknown) => { try { assert.deepStrictEqual(a, b); return true; } catch { return false; } };

// §A working level
check('level event parsed', eq(parseWorkingLevelEvent('intermediate source=estimate evidence=Connected sentences with mostly correct grammar'),
  { level: 'intermediate', evidence: 'Connected sentences with mostly correct grammar' }));
check('known: line is not a level event', parseWorkingLevelEvent('known: intermediate') === null);

// §B pronunciation note
const S = 'I have worked with international customers for several years.';
check('note, none weak', eq(parsePronunciationNote(`measured · Measured pronunciation of "${S}": overall 94/100. No word below 70. Prosody 88/100. Feed back only on t`),
  { sentence: S, overall: 94, prosody: 88, weak: [] }));
check('note, two weak (brief format)', eq(parsePronunciationNote(`measured · Measured pronunciation of "${S}": overall 80/100. "international" 62, weakest sound /ʃ/ 40; "with" 66, weakest sound /ð/ 51. Prosody 71/100.`),
  { sentence: S, overall: 80, prosody: 71, weak: ['international', 'with'] }));
check('note, real format with Weakest:', eq(parsePronunciationNote(`measured · Measured pronunciation of "${S}": overall 80/100. Weakest: "international" 62, weakest sound /ʃ/ 40; "with" omitted. Prosody 71/100.`)?.weak, ['international', 'with']));
check('note truncated before prosody', eq(parsePronunciationNote(`measured · Measured pronunciation of "${S}": overall 80/100. No word below 70.`)?.prosody, null));
check('unavailable note is null', parsePronunciationNote('unavailable · Pronunciation could not be measured') === null);

// §C corrections
const tr = [
  { role: 'student', text: 'I work as sales manager in Nagoya.' },
  { role: 'tutor', text: '…', whiteboardCommands: [{ action: 'showSentence', sentence: 'I work as a sales manager in Nagoya.', emphasis: ['a', 'in'] }] },
  { role: 'tutor', text: '…', whiteboardCommands: [{ action: 'showSentence', sentence: 'It helps me.' }] },
];
check('corrections from emphasis only', eq(correctionsFromTranscript(tr), [{ student: 'I work as sales manager in Nagoya.', corrected: 'I work as a sales manager in Nagoya.' }]));
const many = Array.from({ length: 9 }, (_, i) => [
  { role: 'student', text: `s${i}` },
  { role: 'tutor', text: '', whiteboardCommands: [{ action: 'showSentence', sentence: `c${i}`, emphasis: ['x'] }] },
]).flat();
check('corrections max 6', correctionsFromTranscript(many).length === 6);
check('corrections dedupe', correctionsFromTranscript([...tr, ...tr]).length === 1);

// §D facts
const base = { subject: 'English', topic: 'Intro', duration: 600, transcript: tr };
const f1 = buildSessionFacts(base, { level: 'intermediate', setAt: Date.UTC(2026, 10, 1) });
check('profile level', f1.level.source === 'profile' && f1.level.value === 'intermediate' && f1.level.evidence_en.includes('earlier lesson'));
const f2 = buildSessionFacts(base, null);
check('no level', f2.level.source === 'none' && f2.level.value === null);
check('no pronunciation events', eq(f2.pronunciation, []));
const f3 = buildSessionFacts({ ...base, debugEvents: [
  { type: 'working_level_set', message: 'advanced source=estimate evidence=Fluent' },
  { type: 'pronunciation_note_planted', message: `measured · Measured pronunciation of "${S}": overall 94/100. No word below 70. Prosody 88/100.` },
  { type: 'pronunciation_note_planted', message: 'unavailable · x' },
] }, { level: 'beginner', setAt: 1 });
check('session level wins', f3.level.source === 'session' && f3.level.value === 'advanced');
check('pronunciation from events', f3.pronunciation.length === 1 && f3.pronunciation[0].overall === 94);

// §E reply validation / assembly
const rec = (n: number) => Array.from({ length: n }, (_, i) => ({ en: `Do ${i}`, ja: `やる${i}` }));
const reply = (n: number) => ({ level_evidence_en: 'a', level_evidence_ja: 'あ', grammar_en: 'g', grammar_ja: 'ぶ', pronunciation_comment_en: 'Great', pronunciation_comment_ja: 'よい', recommendations: rec(n) });
check('2 recs rejected', validateModelReply(reply(2)) === null);
check('4 recs accepted', validateModelReply(reply(4)) !== null);
check('empty string rejected', validateModelReply({ ...reply(4), grammar_en: '' }) === null);
check('long string rejected', validateModelReply({ ...reply(4), grammar_en: 'x'.repeat(401) }) === null);
check('non-object rejected', validateModelReply(null) === null);
const now = new Date('2026-11-05T00:00:00Z');
const sNone = assembleSummary(f2, validateModelReply(reply(4)), { model: 'm', turnCount: 3, now });
check('assemble not practised', sNone.assessment.pronunciation.comment_en === 'Pronunciation was not practised in this lesson.' && sNone.assessment.pronunciation.practised.length === 0);
check('assemble copies corrections', eq(sNone.assessment.corrections, f2.corrections) && sNone.version === 1 && sNone.generated_at === now.toISOString());
const sSes = assembleSummary(f3, validateModelReply(reply(4)), { model: 'm', turnCount: 3, now });
check('assemble practised uses model comment', sSes.assessment.pronunciation.comment_en === 'Great' && sSes.level.evidence_en === 'a');
const sProf = assembleSummary(f1, validateModelReply(reply(4)), { model: 'm', turnCount: 3, now });
check('profile evidence fixed', sProf.level.evidence_en.includes('earlier lesson') && sProf.level.evidence_en !== 'a');

// §F generator
async function main() {
async function gen(fn: (n: number) => Record<string, unknown>) {
  const users: string[] = [];
  const r = await generateLearnerSummary(f3, { callJson: async (_s, u) => { users.push(u); return fn(users.length); }, model: 'm', turnCount: 3, now });
  return { r, users };
}
const g1 = await gen((n) => (n === 1 ? {} : reply(4)));
check('retry then ok', g1.r.ok && g1.users.length === 2 && g1.users[1].includes('not valid JSON'));
const g2 = await gen(() => ({}));
check('fails after two', !g2.r.ok && g2.users.length === 2);

// §G prompt
const p = renderSummaryPrompt(f3);
check('system generic', !p.system.includes('GDI') && !p.system.includes('Work projects'));
check('user has facts', p.user.includes('94') && p.user.includes('I work as a sales manager in Nagoya.'));
check('schema required all', LEARNER_SUMMARY_SCHEMA.required.length === 7 && LEARNER_SUMMARY_SCHEMA.additionalProperties === false);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
