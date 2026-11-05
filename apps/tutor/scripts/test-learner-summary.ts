/**
 * Learner summary module (GDI learner home, task 1): pure parsing of the stored
 * session into facts, the generic prompt, reply validation, assembly and the
 * one-retry generator. Run: cd apps/tutor && npx tsx scripts/test-learner-summary.ts
 */
import assert from 'node:assert';
import {
  parseWorkingLevelEvent, parsePronunciationNote, correctionsFromTranscript, buildSessionFacts,
  validateModelReply, assembleSummary, generateLearnerSummary, renderSummaryPrompt, LEARNER_SUMMARY_SCHEMA,
  supportLanguageName, isLearnerSummarySubject,
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
check('profile level (M7: dated)', f1.level.source === 'profile' && f1.level.value === 'intermediate' && f1.level.evidence_en.includes('set in your lesson on 2026-11-01'), f1.level.evidence_en);
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
check('long string clipped (ruling 11-05: clip, never reject)', (validateModelReply({ ...reply(4), grammar_en: 'x'.repeat(401) })?.grammar_en.length ?? 999) <= 400);
check('non-object rejected', validateModelReply(null) === null);
const now = new Date('2026-11-05T00:00:00Z');
const sNone = assembleSummary(f2, validateModelReply(reply(4)), { model: 'm', turnCount: 3, now });
check('assemble not practised', sNone.assessment.pronunciation.comment_en === 'Pronunciation was not practised in this lesson.' && sNone.assessment.pronunciation.practised.length === 0);
// W9-B4 (fix wave 9, run 5): two sentences armed, nothing measured ⇒ "practised, no score" — not "not practised"
const fArmed = buildSessionFacts({ ...base, tutorLanguages: ['en', 'ja'], debugEvents: [
  { type: 'pronunciation_armed', message: `typed "${S}"` },
  { type: 'pronunciation_note_planted', message: 'unavailable · The recording of this sentence was cut short' },
  { type: 'pronunciation_armed', message: 'typed "I was responsible for communicating with our customers."' },
  { type: 'pronunciation_note_planted', message: 'unavailable · The recording of this sentence was cut short' },
] }, null);
check('W9-B4: armed count from events, nothing measured', fArmed.pronunciationArmed === 2 && fArmed.pronunciation.length === 0);
check('W9-B4: prompt says practised but unmeasured', renderSummaryPrompt(fArmed).user.includes('- none measured (2 sentences practised, no score could be measured)'));
const sArmed = assembleSummary(fArmed, validateModelReply(reply(4), { supportLanguage: 'ja' }), { model: 'm', turnCount: 3, now });
check('W9-B4: assemble practised-unmeasured EN', sArmed.assessment.pronunciation.comment_en === 'Two sentences were practised; no score could be measured this time.', sArmed.assessment.pronunciation.comment_en);
check('W9-B4: assemble practised-unmeasured JA', sArmed.assessment.pronunciation.comment_ja === '2つの文を練習しましたが、今回はスコアを測定できませんでした。', sArmed.assessment.pronunciation.comment_ja);
check('W9-B4: practised list stays empty', sArmed.assessment.pronunciation.practised.length === 0);
const fOne = buildSessionFacts({ ...base, debugEvents: [{ type: 'pronunciation_armed', message: 'tool "x"' }] }, null);
check('W9-B4: one armed, no support language', assembleSummary(fOne, validateModelReply(reply(4)), { model: 'm', turnCount: 3, now }).assessment.pronunciation.comment_en === 'One sentence was practised; no score could be measured this time.');
check('W9-B4: no arms ⇒ not practised (unchanged)', f2.pronunciationArmed === 0 && sNone.assessment.pronunciation.comment_en === 'Pronunciation was not practised in this lesson.');
check('assemble copies corrections', eq(sNone.assessment.corrections, f2.corrections) && sNone.version === 1 && sNone.generated_at === now.toISOString());
const sSes = assembleSummary(f3, validateModelReply(reply(4)), { model: 'm', turnCount: 3, now });
check('assemble practised uses model comment', sSes.assessment.pronunciation.comment_en === 'Great' && sSes.level.evidence_en === 'a');
const sProf = assembleSummary(f1, validateModelReply(reply(4)), { model: 'm', turnCount: 3, now });
check('profile evidence fixed (M7: dated)', sProf.level.evidence_en.includes('set in your lesson on 2026-11-01') && sProf.level.evidence_en !== 'a', sProf.level.evidence_en);

// §F generator
async function main() {
async function gen(fn: (n: number) => Record<string, unknown>) {
  const users: string[] = [];
  const r = await generateLearnerSummary(f3, { callJson: async (_s, u) => { users.push(u); return fn(users.length); }, model: 'm', turnCount: 3, now });
  return { r, users };
}
const g1 = await gen((n) => (n === 1 ? {} : reply(4)));
check('retry then ok', g1.r.ok && g1.users.length === 2 && g1.users[1].includes('not valid JSON'));
{
  const { validateModelReply, clipField, renderSummaryPrompt } = await import('../src/lib/tutor/portal/learner-summary');
  const long = Array.from({ length: 12 }, (_, i) => `Sentence number ${i} says something useful about the lesson and its grammar points.`).join(' ');
  const ok = (ja: string) => ({ level_evidence_en: long, level_evidence_ja: ja, grammar_en: long, grammar_ja: ja, pronunciation_comment_en: 'Fine.', pronunciation_comment_ja: ja, recommendations: [{ en: long, ja }, { en: 'b', ja }, { en: 'c', ja }] });
  const v = validateModelReply(ok('はい。'), { supportLanguage: 'ja', levelSource: 'session' });
  check('over-long field is clipped, not rejected', !!v && long.length > 400 && v.level_evidence_en.length <= 400 && v.recommendations[0].en.length <= 400);
  check('clip ends at a sentence boundary', !!v && /\.$/.test(v.level_evidence_en) && clipField('short') === 'short');
  check('prompt caps field length generically', renderSummaryPrompt(f3).system.includes('at most two sentences'));
}
const g2 = await gen(() => ({}));
check('fails after two', !g2.r.ok && g2.users.length === 2);

// §G prompt
const p = renderSummaryPrompt(f3);
check('system generic', !p.system.includes('GDI') && !p.system.includes('Work projects'));
check('user has facts', p.user.includes('94') && p.user.includes('I work as a sales manager in Nagoya.'));
check('schema required all', LEARNER_SUMMARY_SCHEMA.required.length === 7 && LEARNER_SUMMARY_SCHEMA.additionalProperties === false);


// §H I2 — language gate + support language from tutorLanguages[1]
check('subject gate: languages only', isLearnerSummarySubject('languages') && !isLearnerSummarySubject('math') && !isLearnerSummarySubject(undefined));
check('language names', supportLanguageName('ja') === 'Japanese' && supportLanguageName('en') === 'English' && supportLanguageName('pt-BR') === 'pt-BR');
const fJa = buildSessionFacts({ ...base, tutorLanguages: ['en', 'ja'] }, null);
const fEn = buildSessionFacts({ ...base, tutorLanguages: ['en'] }, null);
const fNoLang = buildSessionFacts(base, null);
check('facts: support language = tutorLanguages[1]', fJa.supportLanguage === 'ja' && fEn.supportLanguage === null && fNoLang.supportLanguage === null);
const pJa = renderSummaryPrompt(fJa);
const pEn = renderSummaryPrompt(fEn);
check('prompt [en,ja] names Japanese', /Japanese/.test(pJa.system + pJa.user), pJa.system);
check('prompt [en] says leave _ja empty, no Japanese', /_ja[^.]*empty string/.test(pEn.system) && !/Japanese/.test(pEn.system + pEn.user), pEn.system);
check('prompt has no "language lesson" / partner wording', !/language lesson|GDI|Japan/.test(pEn.system));
const emptyJa = { level_evidence_en: 'a', level_evidence_ja: '', grammar_en: 'g', grammar_ja: '', pronunciation_comment_en: 'c', pronunciation_comment_ja: '', recommendations: [1, 2, 3].map((n) => ({ en: `Do ${n}`, ja: '' })) };
check('validate accepts empty _ja', validateModelReply(emptyJa) !== null);
check('validate with support language requires _ja', validateModelReply(emptyJa, { supportLanguage: 'ja', levelSource: 'session' }) === null);
const sEn = assembleSummary(fEn, validateModelReply(reply(3)), { model: 'm', turnCount: 4, now });
check('no support language: every _ja blank', sEn.level.evidence_ja === '' && sEn.assessment.grammar_ja === '' && sEn.assessment.pronunciation.comment_ja === '' && sEn.recommendations.every((r) => r.ja === ''), JSON.stringify(sEn));
const sJa = assembleSummary(fJa, validateModelReply(reply(3)), { model: 'm', turnCount: 4, now });
check('Japanese support: not-practised JA line kept', sJa.assessment.pronunciation.comment_ja === '今回のレッスンでは発音の練習は行いませんでした。' && sJa.assessment.grammar_ja === 'ぶ');

// §I M8 — level none: no "why this level", fixed text
check('prompt (none) does not ask why this level', !/why this level/.test(renderSummaryPrompt(fEn).user));
check('prompt (session) still asks why this level', /why this level/.test(renderSummaryPrompt(f3).user));
check('validate (none) accepts empty level evidence', validateModelReply({ ...emptyJa, level_evidence_en: '' }, { supportLanguage: null, levelSource: 'none' }) !== null);
check('validate (session) rejects empty level evidence', validateModelReply({ ...emptyJa, level_evidence_en: '' }, { supportLanguage: null, levelSource: 'session' }) === null);
check('assemble (none) fixed EN text, empty JA without Japanese', sEn.level.evidence_en === 'Level not set in this lesson.' && sEn.level.evidence_ja === '');
check('assemble (none) JA line with Japanese', sJa.level.evidence_en === 'Level not set in this lesson.' && sJa.level.evidence_ja === 'このレッスンではレベルを設定していません。');
const fProfJa = buildSessionFacts({ ...base, tutorLanguages: ['en', 'ja'] }, { level: 'beginner', setAt: Date.UTC(2026, 10, 1) });
check('profile JA line dated with Japanese', fProfJa.level.evidence_ja.includes('2026-11-01') && f1.level.evidence_ja === '', fProfJa.level.evidence_ja);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
