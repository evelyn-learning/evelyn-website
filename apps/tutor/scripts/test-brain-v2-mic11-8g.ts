/// <reference types="node" />
/**
 * Tutor brain v2 — Task 8g: mic test 11 (embed-1795220913119, no flags; task-8f-investigation.md). The session's real row (trimmed:
 * scripts/fixtures/mic11-embed-1795220913119.json, read from evelyn.tutorsessions, read only) and its real turns. No network, no model,
 * nothing to the speech vendor (the assess call is a stub).
 *   npm run test:brain-v2-mic11-8g
 *
 *  1 LEARNER_SUMMARY     the summary facts of this session: score 84 for the armed sentence, one sentence practised (not two), its
 *                        corrections ("…for 6 year." → "…for six years.", "He buy it." → "He bought it."), the summary page's card no
 *                        correction of the pronunciation attempt, "He bought it" / "He buy it" not among the sentences said right; the
 *                        prompt and the assembled summary carry them. A v1 session's facts and prompt are unchanged.
 *  2 PRON_ONSET_GRACE    the attempt begun 50 ms before the voice ended is recorded (its clip sent); one begun mid-sentence is not, nor
 *                        one whose speech stopped before the voice ended
 *  3 PAIR_PAINTED_ONLY   T54 (a praised cut-short repeat; the reply points back to T53's card WB34): no correction recorded, the
 *                        "attended" re-test kept
 *  4 ASK_QUESTION_CARD   T28 (a Japanese instruction and a question card only) → T29 "…for 6 year.": a practice signal, the correction and
 *                        its re-test recorded
 *  each switch off alone (a child process per switch): behaviour at HEAD.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Retest, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { V2PronunciationRecorder } from '../src/lib/tutor/v2/pronunciation-recorder';
import { buildSessionFacts, renderSummaryPrompt, assembleSummary, validateModelReply, type SessionFactsInput } from '../src/lib/tutor/portal/learner-summary';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC11_8G_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, JSON.stringify(detail ?? '', null, 1)?.slice(0, 3000)); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function scripted(replies: string[]): V2ModelCall {
  let i = 0;
  return async (_params, onText) => { const r = replies[Math.min(i, replies.length - 1)]!; i += 1; onText?.(r); return msg([{ type: 'text', text: r }], 'end_turn'); };
}

const here = __dirname;
const repoRoot = join(here, '..', '..', '..');
const ROW = JSON.parse(readFileSync(join(here, 'fixtures', 'mic11-embed-1795220913119.json'), 'utf8')) as SessionFactsInput & { sessionId: string };
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Praveen', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI, pronunciation: true,
  teacher: { name: 'Ryota', background: 'I help Japanese professionals speak English at work.' } };
const MIN = 60000;
const START = '[The session has just started. The student has joined and is waiting for you to begin the lesson.]';
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const T = (i: number) => ROW.transcript[i]!.text;
const ids = GDI.segments.map((s) => s.id);
const goalsThrough = (n: number) => Object.fromEntries(ids.slice(0, n).map((id) => [id, { status: 'shown' as const, at: 0 }]));
const base = (extra: Partial<V2State>): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, timeFit: { dropped: [], byArrival: true }, ...extra });
async function turn(state: V2State, said: string, reply: string, atMin: number) {
  const r = await runV2Turn({ session: lang, state: structuredClone(state), studentSaid: said, callModel: scripted([reply, '1: none\n2: none\n3: none (nothing to draw)']), boardPass: false, mathsCheck: false, nowMs: atMin * MIN });
  return { events: (r.events ?? []).map((e) => `${e.type} ${e.message}`), retests: r.state.retests ?? [], corrections: r.state.corrections ?? [], calls: r.toolCalls.map((c) => `${c.name}: ${c.outcome}`) };
}

const offFlag = CHILD ?? '';
const on = (name: string) => offFlag !== name;

// ── 1 LEARNER_SUMMARY ──
async function summary() {
  console.log('1 LEARNER_SUMMARY (the row of embed-1795220913119)');
  const facts = buildSessionFacts(ROW, { level: 'beginner', setAt: Date.UTC(2026, 10, 21) });
  const prompt = renderSummaryPrompt(facts).user;
  const reply = validateModelReply({ level_evidence_en: '', level_evidence_ja: '', grammar_en: 'g', grammar_ja: 'ぶ', pronunciation_comment_en: 'Good.', pronunciation_comment_ja: 'よい', recommendations: [{ en: 'a', ja: 'あ' }, { en: 'b', ja: 'い' }, { en: 'c', ja: 'う' }] }, { supportLanguage: 'ja', levelSource: 'profile' });
  const s = assembleSummary(facts, reply, { model: 'm', turnCount: 92, now: new Date('2026-11-21T00:47:57Z') });
  const lower = (x: string) => x.toLowerCase();
  if (on('TUTOR_V2_LEARNER_SUMMARY')) {
    // pronunciation_armed #1/#2 "I have worked with international customers for several years." (v2); pronunciation_scored #2 measured 84/100 (v2)
    check('score 84 present, for the armed sentence', JSON.stringify(facts.pronunciation) === JSON.stringify([{ sentence: 'I have worked with international customers for several years.', overall: 84, prosody: null, weak: [] }]), facts.pronunciation);
    check('one sentence practised (the re-arm of the same sentence is not a second)', facts.pronunciationArmed === 1, facts.pronunciationArmed);
    check('prompt: 84/100 measured, no "no score"', prompt.includes('"I have worked with international customers for several years." overall 84/100') && !prompt.includes('- none measured'), prompt);
    check('assembled: practised 84, the comment is not the unmeasured line', s.assessment.pronunciation.practised[0]?.overall === 84 && s.assessment.pronunciation.comment_en === 'Good.', s.assessment.pronunciation);
    const all = facts.v2?.corrections ?? [];
    const has = (student: string, corrected: string) => all.some((c) => c.student === student && c.corrected === corrected);
    // T29 "I have been a sales manager for 6 year." → WB21; T70 "… He buy it." → WB52; T13 → WB10 then WB11 (one entry, the whole card)
    check('corrections: T29 6 year → six years', has('I have been a sales manager for 6 year.', 'I have been a sales manager for six years.'), all);
    check('corrections: T70 He buy it. → He bought it.', has('He buy it.', 'He bought it.'), all);
    check('corrections: T13 once, with the whole card WB11', all.filter((c) => c.student === 'I work at home appliance division at Nagoya Corporation.').map((c) => c.corrected).join('|') === 'I work in the home appliance division at Nagoya Corporation.', all);
    check('corrections: the Summary page card WB66 is no correction of the pronunciation attempt T86', !all.some((c) => c.corrected === 'I have worked here for six years.'), all);
    check('corrections: unmarked as-said cards (WB48, WB54, WB57) are none', !all.some((c) => /meeting new people|came back to thank|His wife likes it/.test(c.corrected)), all);
    // The investigation counted 22 wrong sentences (20 recorded live, T29 and T70's "He buy it." not): all 22, each a genuine correction.
    check('corrections: all 22 of the lesson listed for the prompt, the first 6 stored', all.length === 22 && facts.corrections.length === 6 && s.assessment.corrections.length === 6, { n: all.length, stored: facts.corrections });
    check('prompt lists "He buy it." -> "He bought it."', prompt.includes('- "He buy it." -> "He bought it."'), prompt);
    const right = facts.v2?.saidRight ?? [];
    check('"He bought it" / "He buy it" not among the sentences said right', !right.some((x) => /\bhe (?:bought|buy) it\b/i.test(x)), right);
    check('said right = the unmarked as-said cards WB48, WB54, WB57', JSON.stringify(right) === JSON.stringify(['I like meeting new people and helping them.', 'He came back to thank me for it.', 'His wife likes it.']), right);
    check('no corrected sentence of theirs among the sentences said right', !right.some((x) => all.some((c) => lower(c.student) === lower(x))), right);
    check('sentences said right listed, with the rule', right.length > 0 && prompt.includes('Sentences they said right (no correction needed):') && prompt.includes('Call a sentence of theirs correct only if it is listed'), { right, prompt });
  } else {
    check('switch off: as at HEAD (no score, two sentences armed, no corrections)', facts.pronunciation.length === 0 && facts.pronunciationArmed === 2 && facts.corrections.length === 0 && !facts.v2 && !prompt.includes('Sentences they said right'), facts);
  }
  // A v1 session (no start_v2): the same facts and prompt with the switch on and off, and its row board ignored.
  const v1: SessionFactsInput = {
    subject: 'languages', topic: 'Intro', duration: 600, tutorLanguages: ['en', 'ja'],
    transcript: [
      { role: 'student', text: 'I work as sales manager in Nagoya.' },
      { role: 'tutor', text: '…', whiteboardCommands: [{ action: 'showSentence', sentence: 'I work as a sales manager in Nagoya.', emphasis: ['a', 'in'] }] },
      { role: 'student', text: 'He buy it.' },
      { role: 'tutor', text: 'He bought it.' },
    ],
    whiteboardCommands: [{ action: 'showSentence', data: { sentence: 'He bought it.', emphasis: ['bought'] }, sourceMessageIndex: 3 }],
    debugEvents: [
      { type: 'pronunciation_armed', message: 'typed "I work as a sales manager in Nagoya."' },
      { type: 'pronunciation_note_planted', message: 'measured · Measured pronunciation of "I work as a sales manager in Nagoya.": overall 91/100. No word below 70. Prosody 80/100.' },
    ],
  };
  const v1On = buildSessionFacts(v1, null, true); const v1Off = buildSessionFacts(v1, null, false);
  check('v1 session: facts identical with the switch on and off', JSON.stringify(v1On) === JSON.stringify(v1Off), { v1On, v1Off });
  check('v1 session: prompt identical with the switch on and off', renderSummaryPrompt(v1On).user === renderSummaryPrompt(v1Off).user && renderSummaryPrompt(v1On).system === renderSummaryPrompt(v1Off).system);
  check('v1 session: v1 reads as before (score 91, the transcript card, no v2 part)', v1On.pronunciation[0]?.overall === 91 && v1On.corrections.length === 1 && v1On.corrections[0]!.corrected === 'I work as a sales manager in Nagoya.' && !v1On.v2, v1On);
}

// ── 2 PRON_ONSET_GRACE ──
async function onset() {
  console.log('2 PRON_ONSET_GRACE (16:52.59: onset about 50 ms before the voice ended)');
  const REF = 'I have worked with international customers for several years.';
  const run = (onsetBeforeEndMs: number, stopFirst = false) => {
    let t = 1000; const log: string[] = []; let posted = 0;
    const fetchImpl = (async () => { posted += 1; return { ok: true, status: 200, json: async () => ({ status: 'measured', overall: 84 }) }; }) as unknown as typeof fetch;
    const rec = new V2PronunciationRecorder({ sessionId: 's', now: () => t, fetchImpl, log: (type, m) => log.push(`${type} ${m}`) });
    const frame = (ms: number) => { for (let k = 0; k < ms / 20; k += 1) { rec.frame(new Float32Array(480).fill(0.2)); t += 20; } };
    rec.arm(2, REF);
    frame(1000);
    rec.speechStart(true);
    if (stopFirst) { frame(100); rec.speechStop(); }
    frame(onsetBeforeEndMs);
    rec.tutorVoiceEnded();
    frame(3000);
    rec.speechStop();
    return { log, posted };
  };
  const at50 = run(50);
  const mid = run(2000);
  const echo = run(300, true);
  if (on('NEXT_PUBLIC_TUTOR_V2_PRON_ONSET_GRACE')) {
    check('onset 50 ms before the voice end: recorded, the clip sent', at50.log.some((x) => x.startsWith('pronunciation_start_at_voice_end #2')) && at50.log.some((x) => x.startsWith('pronunciation_clip_sent #2')) && at50.posted === 1, at50.log);
  } else {
    check('switch off: the 50 ms onset is not recorded (as at HEAD)', !at50.log.some((x) => x.startsWith('pronunciation_clip_sent')) && at50.posted === 0, at50.log);
  }
  check('onset mid-sentence (2 s before the end): not recorded', !mid.log.some((x) => x.startsWith('pronunciation_clip_sent')) && mid.log.some((x) => x.startsWith('pronunciation_start_ignored_tutor_speaking')), mid.log);
  check('speech stopped before the voice ended (an echo): not recorded', !echo.log.some((x) => x.startsWith('pronunciation_clip_sent') || x.startsWith('pronunciation_start_at_voice_end')), echo.log);
}

// ── 3 PAIR_PAINTED_ONLY: T53 → T54 → T55 (Conversation) ──
const WB34 = 'I have worked at Nagoya Corporation for seven years.';
const CONV: V2BoardPage[] = [{ title: 'Overview', items: [] }, { title: 'Level check', items: [] }, { title: 'Your job', items: [] }, { title: 'Present perfect', items: [] }, { title: 'Past simple', items: [] },
  { title: 'Conversation', items: [{ id: 'inl_mwpok5h0_1', tool: 'show_problem', summary: 'Question — How long have you been at Nagoya Corporation?' }, { id: 'inl_mwpokkv8_1', tool: 'show_sentence', summary: WB34 }] }];
const RETESTS: V2Retest[] = [
  { part: 'topic-intro', said: T(13), right: 'I work in the home appliance division.', target: ['in the home'], turn: 9, offered: 1, in: 'present-perfect', askedAt: 13, outcome: 'not_asked' },
  { part: 'topic-intro', said: T(17), right: 'I sell washing machines at Nagoya Corporation.', target: ['washing machines'], turn: 11, offered: 1, in: 'past-simple', askedAt: 19, outcome: 'missed' },
  { part: 'present-perfect', said: T(23), right: 'I have worked here at Nagoya Corporation for six years.', target: ['i have worked', 'for six'], turn: 14, offered: 1, in: 'open-conversation', askedAt: 27, outcome: 'missed' },
  { part: 'past-simple', said: 'I attend robotics exhibition in Tokyo.', right: 'I attended a robotics exhibition in Tokyo last year.', target: ['attended'], turn: 20 },
  { part: 'past-simple', said: 'I first met uh Canadian customer um 6 month ago.', right: 'I first met a Canadian customer six months ago at the airport.', target: ['months'], turn: 24 },
];
async function t54() {
  console.log('3 PAIR_PAINTED_ONLY (T54 "I have worked at Nagoya Corporation", the reply points back to WB34)');
  const state = base({ board: { pages: structuredClone(CONV), current: 5 }, goals: goalsThrough(5), partStart: { part: 'open-conversation', at: 10.6 * MIN }, support: { step: 'normal', wrong: 1, clean: 0, part: 'open-conversation' },
    retests: structuredClone(RETESTS), correctedSentences: [WB34], corrections: [{ said: 'Um, I work Nagoya Corporation uh 7 year.', sentence: WB34, stress: ['have', 'worked', 'for', 'seven', 'years'] }],
    history: [u(START), a(T(2)), u(T(51 - 1)), a(T(51)), u(T(52)), a(`${T(53)}\n\n<board sentence stress="have | worked | for | seven | years">${WB34}</board>`)] });
  const reply = `そうです、正しく言えました。期間を入れると、さらに分かりやすくなります。\n\n<board sentence stress="have | worked | for | seven | years">${WB34}</board>\n\n仕事で一番好きなことは何ですか。\n\nWhat do you like most about your job?\n\n<board problem gloss="仕事で一番好きなことは何ですか。">What do you like most about your job?</board>`;
  const r = await turn(state, T(54), reply, 11.1);
  check('the reply\'s card points back (not painted again)', r.calls.some((c) => c.startsWith('show_sentence: not painted again')), r.calls);
  if (on('NEXT_PUBLIC_TUTOR_V2_PAIR_PAINTED_ONLY')) {
    check('no correction scored: no wrong signal', !r.events.some((e) => e.startsWith('v2_practice_signal wrong')), r.events);
    check('the "attended" re-test kept, none replaced', !r.events.some((e) => e.startsWith('v2_retest_replaced')) && r.retests.some((x) => x.target.join() === 'attended'), { events: r.events, retests: r.retests });
    check('the 7w record of WB34 keeps what they said at T52', r.corrections.find((c) => c.sentence === WB34)?.said === 'Um, I work Nagoya Corporation uh 7 year.', r.corrections);
  } else {
    check('switch off: scored wrong and "attended" replaced (as at HEAD)', r.events.some((e) => e.startsWith('v2_practice_signal wrong')) && r.events.some((e) => e.startsWith('v2_retest_replaced target="attended"')), r.events);
  }
}

// ── 4 ASK_QUESTION_CARD: T28 → T29 → T30 (Present perfect) ──
const WB20 = 'How long have you been a sales manager?';
const WB21 = 'I have been a sales manager for six years.';
async function t29() {
  console.log('4 ASK_QUESTION_CARD (T28: an instruction and a question card only; T29 "…for 6 year.")');
  const PP: V2BoardPage[] = [{ title: 'Overview', items: [] }, { title: 'Level check', items: [] }, { title: 'Your job', items: [] },
    { title: 'Present perfect', items: [{ id: 'inl_mwpod0do_2', tool: 'show_problem', summary: 'Question — Have you worked for your current company for a long time?' }, { id: 'inl_mwpodm83_1', tool: 'show_sentence', summary: 'I have worked here at Nagoya Corporation for six years.' },
      { id: 'inl_mwpoe0la_1', tool: 'show_problem', summary: 'Question — What is your job at Nagoya Corporation?' }, { id: 'inl_mwpoeoof_1', tool: 'show_sentence', summary: 'I am a sales manager, and I sell washing machines.' }, { id: 'inl_mwpoeoof_2', tool: 'show_problem', summary: `Question — ${WB20}` }] }];
  const T28 = `${T(28)}\n\n<board problem gloss="営業マネージャーになってどのくらいですか。">${WB20}</board>`;
  const state = base({ board: { pages: PP, current: 3 }, goals: goalsThrough(3), partStart: { part: 'present-perfect', at: 5.1 * MIN }, support: { step: 'normal', wrong: 1, clean: 0, part: 'present-perfect' },
    retests: structuredClone(RETESTS.slice(0, 2)),
    history: [u(START), a(T(2)), u(T(21)), a(T(22)), u(T(23)), a(T(24)), u(T(25)), a(T(26)), u(T(27)), a(T28)] });
  const reply = `「have been」と現在完了を正しく使えました。ただ、「6 year」は「6 years」と複数にします。\n\n<board sentence stress="years" gloss="数が一つより多いときは、year に s を付けます。">${WB21}</board>\n\nもう一度、言ってみてください。`;
  const r = await turn(state, T(29), reply, 6.3);
  if (on('NEXT_PUBLIC_TUTOR_V2_ASK_QUESTION_CARD')) {
    check('a practice signal: wrong', r.events.some((e) => e.startsWith('v2_practice_signal wrong part=present-perfect')), r.events);
    check('the re-test recorded', r.events.some((e) => e.startsWith('v2_retest_recorded')) && r.retests.some((x) => x.right === WB21), r.events);
    check('the correction recorded (7w)', r.corrections.some((c) => c.sentence === WB21 && /6 year/.test(c.said)), r.corrections);
  } else {
    check('switch off: no practice signal, nothing recorded (as at HEAD)', !r.events.some((e) => e.startsWith('v2_practice_signal')) && !r.events.some((e) => e.startsWith('v2_retest_recorded')), r.events);
  }
}

async function main() {
  await summary();
  await onset();
  await t54();
  await t29();
  if (!CHILD) {
    for (const flag of ['TUTOR_V2_LEARNER_SUMMARY', 'NEXT_PUBLIC_TUTOR_V2_PRON_ONSET_GRACE', 'NEXT_PUBLIC_TUTOR_V2_PAIR_PAINTED_ONLY', 'NEXT_PUBLIC_TUTOR_V2_ASK_QUESTION_CARD']) {
      console.log(`\n── ${flag}=off ──`);
      const r = spawnSync('npx', ['tsx', __filename], { env: { ...process.env, [flag]: 'off', MIC11_8G_CHILD: flag }, encoding: 'utf8' });
      process.stdout.write(r.stdout);
      check(`${flag}=off child passes`, r.status === 0, r.stderr?.slice(-2000));
    }
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
