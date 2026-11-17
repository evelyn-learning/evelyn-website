/// <reference types="node" />
/**
 * Tutor brain v2 — Task 6f: measured pronunciation from clip to facts, and the small leftovers of the real-voice replays
 * (docs/superpowers/plans/gdi-v2-baseline/v2audio-6e2/RESULTS.md). No network, no model: the assess endpoint is mocked
 * with the answers the real route gave in the 6f probe (Azure, a recorded "responsibilities"; and the route with no
 * vendor configured, as the replays ran).
 *   npm run test:brain-v2-real-voice-6f
 *
 *  1. pronunciation: clip → assess → score in the next turn's facts; no vendor / late / not a try → told once, practice
 *     without a score, never moved to the summary after one word; scored / failed events logged and kept by the embed
 *  2. a lead-in that points at a note or a table of example sentences: the sentences are spoken there
 *  3. the part-change frame names the part that will open (a held page whose part the reply marks done is not named)
 *  4. a reply that has begun the summary is not held for the unreached-part offer: the part is named as next time
 *  5. the mishearing line: a one-word reply that answers nothing is asked again, not given a meaning
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { V2PronunciationRecorder } from '../src/lib/tutor/v2/pronunciation-recorder';
import { v2ApplyPractisePronunciation, v2PronunciationFacts, v2WithPronunciationHeard } from '../src/lib/tutor/v2/pronunciation';
import { CLIP_SAMPLE_RATE } from '../src/lib/tutor/pronunciation/clip-capture';
import { exampleSentencesOf, noteSentencesToSay, pointsBackAtBoard } from '../src/lib/tutor/v2/board-timing';
import { ReplyGate } from '../src/lib/tutor/v2/reply-gate';
import { v2NextTimeAllLine, v2PagePartLabel } from '../src/lib/tutor/v2/plan-map';
import { indexOutsideBlocks, lastSentences } from '../src/lib/tutor/v2/turn';
import { v2LanguagesSection } from '../src/lib/tutor/v2/languages';
import { V2_SUMMARY_BEGUN, runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import {
  TUTOR_V2_FRAME_NAMES_OPENED, TUTOR_V2_PRONUNCIATION_FALLBACK, TUTOR_V2_SAY_NOTE_SENTENCES, TUTOR_V2_SUMMARY_BEGUN_NEXT_TIME,
} from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
/** The reply streamed in small pieces, as the model writes it; extra content blocks (tool calls) after the text. */
function streaming(text: string, after: unknown[] = []) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const call: V2ModelCall = async (params, onText) => { seen.push(structuredClone(params)); for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece); return msg([{ type: 'text', text }, ...after], after.length ? 'tool_use' : 'end_turn'); };
  return { call, seen };
}
const factsSent = (seen: Anthropic.MessageCreateParamsNonStreaming[]) => JSON.stringify(seen[0]?.messages.at(-1));
const src = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
/** Task 7a: a plan whose parts all have names asks every part change (PART_ASK_EVERY, test-brain-v2-part-flow-7a.ts); the
 *  6e budget and frame drop pinned here still hold for plans without part names: the same plan with its names taken away. */
const GDI_6E = { ...GDI, segments: GDI.segments.map((x) => ({ ...x, metadata: { ...(x.metadata ?? {}), label: undefined } })) } as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, languages: ['en', 'ja'] };
const pron: V2Session = { ...lang, plan: GDI, pronunciation: true };
const pagesAt = (titles: string[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), board: { pages: titles.map((title) => ({ title, items: [] })), current: titles.length - 1 }, ...extra });

// What the real route answered in the 6f probe (dev server :3022, local session row, 2026-11-16).
const AZURE_MEASURED = { status: 'ok', measured: true, result: { overall: 95.8, completeness: 100, words: [{ word: 'responsibilities', score: 98, errorType: 'none', phonemes: [{ ipa: 'ɹ', score: 54 }, { ipa: 'ə', score: 99 }, { ipa: 's', score: 100 }] }] } };
const AZURE_NOT_ATTEMPTED = { status: 'ok', measured: false, result: { overall: 0, completeness: 0, words: [{ word: 'responsibilities', score: 0, errorType: 'omission', phonemes: [] }] } };
const NO_VENDOR = { status: 'unavailable', reason: 'no_vendor', measured: false };

const speech = (ms: number, amp = 0.3) => { const n = Math.round((ms / 1000) * CLIP_SAMPLE_RATE); const f = new Float32Array(n); for (let i = 0; i < n; i++) f[i] = amp * Math.sin(i / 7); return f; };
/** A recorder over a mocked assess endpoint. `delayMs`: the answer comes that late. */
function recorderWith(answer: { status: number; body: unknown }, delayMs = 0) {
  const urls: string[] = []; const logs: string[] = [];
  const fetchImpl = (async (u: string) => { urls.push(u); if (delayMs) await new Promise((r) => setTimeout(r, delayMs)); return new Response(JSON.stringify(answer.body), { status: answer.status }); }) as unknown as typeof fetch;
  const rec = new V2PronunciationRecorder({ sessionId: 'sess-6f', fetchImpl, log: (t, m) => logs.push(`${t} ${m}`) });
  return { rec, urls, logs };
}
/** The state after the tutor's reply armed `items`. */
function armed(items: string[], from: V2State = newV2State(1000)): V2State { const s = structuredClone(from); v2ApplyPractisePronunciation(s, { items }); return s; }
/** One spoken reply recorded: arm, speech, stop; then the score the next turn takes. */
async function recordOnce(rec: V2PronunciationRecorder, seq: number, reference: string, waitMs = 1000) {
  rec.arm(seq, reference); rec.speechStart(false); rec.frame(speech(1300)); rec.speechStop();
  return rec.take(waitMs);
}
const lines = (x: string[]) => x.join('\n');

async function main() {
  console.log('1. measured pronunciation: clip → assess → next turn\'s facts');
  {
    const a1 = armed(['responsibilities']);
    const ref = a1.pronunciation!.armed!.reference;
    // Root cause (6f probe): the route answers 200 { status: 'unavailable', reason: 'no_vendor' } with no
    // TUTOR_PRONUNCIATION_VENDOR in the dev server's env, and v2 reads that as "off". The recorder logged it as
    // pronunciation_scored, which the embed's event list did not keep, so the replays showed a clip sent and nothing after.
    const nv = recorderWith({ status: 200, body: NO_VENDOR });
    const off = await recordOnce(nv.rec, 1, ref);
    check('no vendor: the request is made, to the assess route', nv.urls.length === 1 && nv.urls[0] === '/api/tutor/pronunciation/assess', nv.urls);
    check('no vendor: read as off (measuring not available this session)', off?.status === 'off' && off.reason === 'no_vendor', off);
    check('no vendor: logged as pronunciation_failed with its reason', nv.logs.some((l) => /^pronunciation_failed #1 off no_vendor/.test(l)), nv.logs);
    const offFacts = lines(v2PronunciationFacts(pron, v2WithPronunciationHeard(a1, off), 'I said individual words.'));
    check('no vendor: told once, no score claim, practice without a score offered (not moved to the summary)', /cannot give a score today/.test(offFacts) && /never say you cannot hear them/.test(offFacts) && /say the word or sentence yourself and have them say it after you/.test(offFacts) && /Go on to the summary only when they want to or the time is up/.test(offFacts) && !/do not offer pronunciation practice/.test(offFacts), offFacts);
    check('no vendor: a reply that was not a try is answered first', /If what they said was not a try at it/.test(offFacts));
    const offLater = lines(v2PronunciationFacts(pron, { ...newV2State(1000), pronunciation: { seq: 1, off: true } }, 'Okay, again please.'));
    check('later turns: not told again, practice without a score goes on', /do not say it again/.test(offLater) && /without a score/.test(offLater) && /do not call practise_pronunciation/.test(offLater), offLater);
    check('the tool, once off: not armed, practise without a score', /^not armed: pronunciation cannot be measured in this session\. If they want to go on practising, do it without a score/.test(v2ApplyPractisePronunciation({ ...newV2State(1), pronunciation: { seq: 1, off: true } }, { items: ['schedule'] })));

    // With the vendor configured: the real Azure answer for "responsibilities" (95.8, /ɹ/ 54) reaches the facts.
    const ok = recorderWith({ status: 200, body: AZURE_MEASURED }, 400);
    const heard = await recordOnce(ok.rec, 1, ref, 6000);
    check('measured: the score arrives within the next turn\'s wait (route ~0.8 s, wait 6 s)', heard?.status === 'measured' && heard.overall === 96 && heard.words?.[0]?.sound?.ipa === 'ɹ', heard);
    check('measured: logged as pronunciation_scored with the score', ok.logs.some((l) => /^pronunciation_scored #1 measured 96\/100/.test(l)), ok.logs);
    const s = streaming('Very good: 96 out of 100.');
    await runV2Turn({ session: pron, state: v2WithPronunciationHeard(a1, heard), studentSaid: 'Responsibilities.', callModel: s.call, boardPass: false, mathsCheck: false });
    check('measured: the next turn\'s facts carry it', /measured just now for \\"responsibilities\.\\": 96\/100 overall; \\"responsibilities\\" 98\/100/.test(factsSent(s.seen)) && /96 out of 100/.test(factsSent(s.seen)), factsSent(s.seen).slice(0, 600));

    // "I said individual words." (James's reply to the ask): the vendor hears no try at the word.
    const na = recorderWith({ status: 200, body: AZURE_NOT_ATTEMPTED });
    const cut = await recordOnce(na.rec, 1, ref);
    const cutFacts = lines(v2PronunciationFacts(pron, v2WithPronunciationHeard(a1, cut), 'I said individual words.'));
    check('not a try: cut, logged as failed, answered first, then asked once more', cut?.status === 'cut' && na.logs.some((l) => /^pronunciation_failed #1 cut not_attempted/.test(l)) && /If what they said was not a try at it/.test(cutFacts) && /say it once more/.test(cutFacts), { cut, cutFacts });

    // Late: the next turn cannot wait for ever (6 s); the reply goes unmeasured and is asked for once more, once.
    const late = recorderWith({ status: 200, body: AZURE_MEASURED }, 300);
    const none = await recordOnce(late.rec, 1, ref, 20);
    check('late: nothing for this turn, logged as failed (late)', none === null && late.logs.some((l) => /^pronunciation_failed #1 late: no result within 20ms/.test(l)), late.logs);
    const lateFacts = lines(v2PronunciationFacts(pron, a1, 'Responsibilities.'));
    check('late: no comment on the sound, asked once more', /no score came back for this reply/.test(lateFacts) && /say it once more/.test(lateFacts) && /say nothing about how it sounded/.test(lateFacts), lateFacts);
    const s2 = streaming('Sorry, once more please: responsibilities.', [{ type: 'tool_use', id: 'p2', name: 'practise_pronunciation', input: { items: ['responsibilities'] } }]);
    const r2 = await runV2Turn({ session: pron, state: a1, studentSaid: 'Responsibilities.', callModel: s2.call, boardPass: false, mathsCheck: false });
    check('late: the ask again is the one more try (attempt 2), so a result that never comes cannot ask for ever', r2.state.pronunciation?.armed?.attempt === 2, r2.state.pronunciation);
    const late2 = lines(v2PronunciationFacts(pron, r2.state, 'Responsibilities.'));
    check('late again on the one more try: told once, practice without a score', /no score came back for this reply either/.test(late2) && /without a score/.test(late2), late2);

    // Flag off: the lines as before.
    const offOld = lines(v2PronunciationFacts(pron, v2WithPronunciationHeard(a1, off), 'x', false));
    check('PRONUNCIATION_FALLBACK off: the old off line ("do not offer pronunciation practice again")', /do not offer pronunciation practice again/.test(offOld) && !/without a score/.test(offOld), offOld);
    check('the kill switch is on by default', TUTOR_V2_PRONUNCIATION_FALLBACK === true);

    // The embed keeps the events; the client wires the recorder's log to the debug events.
    const embed = src('src/app/tutor-portal/embed/page.tsx');
    check('the embed keeps pronunciation_scored and pronunciation_failed', embed.includes("'pronunciation_scored', 'pronunciation_failed'"));
    check('the client logs the recorder through onDebugEvent', /new V2PronunciationRecorder\(\{ sessionId: props\.sessionId!, log: \(type, message\) => p\.current\.onDebugEvent\?\.\(type, message\) \}\)/.test(src('src/app/tutor/components/v2/TutorVoiceV2.tsx')));
  }

  console.log('2. a lead-in pointing at a note or table of example sentences');
  {
    // The three blocks from the replays (whiteboardCommands of the sessions).
    const jamesNote = 'Present perfect: have / has + past participle\nUse it for experience that started in the past and continues now.\nwork → have worked\nI have worked here for seven years.';
    const aNote = 'I work in accounting.\nI help customers.\nI work with international clients.\nI joined my company three years ago.';
    const bTable = '|Present perfect|Past simple\nForm|have/has + past participle|verb + ed or irregular past\nUse|experience that continues now|finished event at a specific time\nExample|I have worked with international customers for three years.|I worked with a major customer last year.';
    check('the example sentences of a note: full English sentences only (no form line, no arrow)', JSON.stringify(exampleSentencesOf('note', jamesNote)) === JSON.stringify(['Use it for experience that started in the past and continues now.', 'I have worked here for seven years.']), exampleSentencesOf('note', jamesNote));
    check('…of a table: the sentence cells', JSON.stringify(exampleSentencesOf('table', bTable)) === JSON.stringify(['I have worked with international customers for three years.', 'I worked with a major customer last year.']), exampleSentencesOf('table', bTable));
    check('…a gap to fill, Japanese, a gloss in brackets and a numbered menu are not', exampleSentencesOf('note', 'I have ? here for over 10 years.\nhave + 過去分詞\nI have worked here for five years. (今も働いています)').join('|') === 'I have worked here for five years.' && exampleSentencesOf('note', '1. Single words.\n2. A whole sentence.').length === 0);
    check('James T22: "Here is the form, and then I\'ll ask you a question." announces it', noteSentencesToSay('note', jamesNote, 'Present perfect is next. Here is the form, and then I\'ll ask you a question.')?.announced === true);
    check('tester B T16: "Now let\'s look at the two tenses you just used." announces it', noteSentencesToSay('table', bTable, 'That sounds interesting. Now let\'s look at the two tenses you just used.')?.announced === true);
    const a = noteSentencesToSay('note', aNote, 'Let\'s move on to talking about your work. 仕事について話すときは、短い文を使うと分かりやすいです。');
    check('tester A T16: not announced before it, but the next sentence points back at it', a?.announced === false && a.say.split('. ').length === 4 && pointsBackAtBoard('ここにある文を、ひとつずつ読んでみてください。'), a);
    check('a question before it is no lead-in; nothing new: nothing to say', noteSentencesToSay('note', aNote, 'Which of these is true?')?.announced === false && noteSentencesToSay('note', 'I help customers.', 'We say: I help customers.') === null);

    // The gate: a conditional card goes out before a sentence that points back, and is dropped otherwise.
    const out: string[] = []; const g = new ReplyGate((t) => out.push(t), { dropFrame: false, holdGoodbye: false });
    g.speakCardIf('I work in accounting.', pointsBackAtBoard); g.push('ここにある文を、ひとつずつ読んでみてください。 Now, what do you do?'); g.flush();
    check('gate: said just before the sentence that points back', /I work in accounting\.\s+ここにある文/.test(out.join('')) && g.saidCards.length === 1, out.join(''));
    const out2: string[] = []; const g2 = new ReplyGate((t) => out2.push(t), { dropFrame: false, holdGoodbye: false });
    g2.speakCardIf('I work in accounting.', pointsBackAtBoard); g2.push('Now, what do you do at work?'); g2.flush();
    check('gate: dropped when the next sentence does not point back', !/accounting/.test(out2.join('')) && g2.saidCards.length === 0, out2.join(''));
    // Fix round 1 (minor 3): a note sentence the model then reads itself is said once.
    const out3: string[] = []; const g3 = new ReplyGate((t) => out3.push(t), { dropFrame: false, holdGoodbye: false });
    g3.speakCard('I work in accounting. I help customers.', { perSentence: true }); g3.push('I work in accounting. Now you. I help customers. What do you do?'); g3.flush();
    const o3 = out3.join('');
    check('gate: a note sentence the next sentence says is left out of the card, and one read later is dropped', (o3.match(/I work in accounting/g) ?? []).length === 1 && (o3.match(/I help customers/g) ?? []).length === 1 && g3.removed.includes('I help customers.') && g3.cardSaidAs.get('I work in accounting. I help customers.') === 'I help customers.', { o3, removed: g3.removed });

    // Whole turns, as the replays had them.
    const heardJ: string[] = [];
    const tJ = `Present perfect is next. Here is the form, and then I'll ask you a question. <board page>Present perfect</board><board note style="highlight">${jamesNote}</board> Have you worked for your current company for a long time? Try starting with "I have worked…".`;
    const rJ = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(['Lesson overview', 'Level check'], { history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Next is the present perfect. Shall we go on?' }] }), studentSaid: 'Uh, yes.', callModel: streaming(tJ).call, onText: (d) => heardJ.push(d), boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    check('James T22 in a whole turn: the note\'s sentences are heard between the lead-in and the question', /question\.\s+Use it for experience that started in the past and continues now\. I have worked here for seven years\.\s+Have you worked/.test(heardJ.join('')) && /I have worked here for seven years\./.test(rJ.spoken), heardJ.join(''));
    const heardA: string[] = [];
    const tA = `Let's move on to talking about your work. 仕事について話すときは、短い文を使うと分かりやすいです。<board note style="highlight">${aNote}</board>ここにある文を、ひとつずつ読んでみてください。Now, what do you do at work?`;
    await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(['Lesson overview', 'Level check', 'Talking about your work']), studentSaid: 'Yes.', callModel: streaming(tA).call, onText: (d) => heardA.push(d), boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    const heardD: string[] = [];
    const rD = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(['Lesson overview', 'Level check'], { history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Next is the present perfect. Shall we go on?' }] }), studentSaid: 'Uh, yes.', callModel: streaming(tJ.replace('Have you worked', 'I have worked here for seven years. Have you worked')).call, onText: (d) => heardD.push(d), boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    check('a whole turn whose model then reads a note sentence itself: heard once, and once in the spoken record', (heardD.join('').match(/I have worked here for seven years\./g) ?? []).length === 1 && (rD.spoken.match(/I have worked here for seven years\./g) ?? []).length === 1, { heard: heardD.join(''), spoken: rD.spoken });
    // Fix round 2 (E1): the model repeats a note sentence with one sentence in between (the echo path, not the next-sentence
    // check): the repeat is dropped from the speech and the stored reply, and the note's own body keeps the sentence.
    const heardE: string[] = [];
    const tE = `Present perfect is next. Here is the form, and then I'll ask you a question. <board page>Present perfect</board><board note style="highlight">${jamesNote}</board> Look at the board. I have worked here for seven years. Have you worked for your current company for a long time?`;
    const rE = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(['Lesson overview', 'Level check'], { history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'Next is the present perfect. Shall we go on?' }] }), studentSaid: 'Uh, yes.', callModel: streaming(tE).call, onText: (d) => heardE.push(d), boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    const storedE = JSON.stringify(rE.state.history.at(-1));
    check('E1: heard once', (heardE.join('').match(/I have worked here for seven years\./g) ?? []).length === 1, heardE.join(''));
    check('E1: the stored note keeps both its sentences; the spoken repeat is gone from the stored speech', storedE.includes('Use it for experience that started in the past and continues now.\\nwork → have worked\\nI have worked here for seven years.</board>') && !/<\/board> Look at the board\. I have worked here/.test(storedE), storedE);
    check('E1: the spoken record has the note\'s two sentences once each, before "Look at the board."', /question\.\s+Use it for experience that started in the past and continues now\. I have worked here for seven years\.\s+Look at the board\.\s+Have you worked/.test(rE.spoken) && (rE.spoken.match(/I have worked here for seven years\./g) ?? []).length === 1, rE.spoken);
    check('indexOutsideBlocks skips a block body', indexOutsideBlocks('<board note>A b.</board> A b.', 'A b.') === 25 && indexOutsideBlocks('<board note>A b.</board>', 'A b.') === -1);
    check('tester A T16 in a whole turn: the sentences are said before "ここにある文を…"', /I work in accounting\. I help customers\. I work with international clients\. I joined my company three years ago\.\s+ここにある文を/.test(heardA.join('')), heardA.join(''));
    const heardS: string[] = [];
    await runV2Turn({ session: { ...lang, subject: 'Physics', languages: undefined }, state: pagesAt(['Forces']), studentSaid: 'ok', callModel: streaming('Here are the key ideas. <board note>A force is a push or a pull.\nForces are measured in newtons.</board> Which force acts on a falling ball?').call, onText: (d) => heardS.push(d), boardPass: false, mathsCheck: false });
    check('a science lesson (one language, no pronunciation): notes stay on the board, as before', !/push or a pull/.test(heardS.join('')), heardS.join(''));
    check('the kill switch is on by default', TUTOR_V2_SAY_NOTE_SENTENCES === true);
  }

  console.log('3. the frame names the page being held, at once (gdi-real-james T20; fix round 2)');
  {
    const B = ['Lesson overview', 'Level check'];
    const level = { workingLevel: { level: 'beginner', from: 'this_lesson' } } as Partial<V2State>;
    check('a part\'s page is named by the part\'s authored name; another page by its heading', v2PagePartLabel(GDI, 'Present perfect') === 'Present perfect' && v2PagePartLabel(GDI, 'Your job') === 'Your job' && v2PagePartLabel(GDI, 'Some other heading') === undefined && v2PagePartLabel(undefined, 'Your job') === undefined);
    const history = [{ role: 'user' as const, content: 'hi' }, { role: 'assistant' as const, content: 'Good. Can you say that sentence once more?' }];
    /** A model call that records what had been heard when the call ends. */
    const watching = (text: string, after: unknown[] = []) => {
      const heardNow: string[] = []; let atEnd = '';
      const call: V2ModelCall = async (_p, onText) => { for (const piece of text.match(/[\s\S]{1,17}/g) ?? []) onText?.(piece); atEnd = heardNow.join(''); return msg([{ type: 'text', text }, ...after], after.length ? 'tool_use' : 'end_turn'); };
      return { call, heardNow, atEnd: () => atEnd };
    };
    // T20 shape: the job part is marked in the same reply that writes the present perfect page.
    const t20 = 'Yes, that\'s right: "I have worked here for seven years." You started in the past and you still work here now. <board page>Present perfect</board> Now the present perfect.';
    const goalsAfter = [{ type: 'tool_use', id: 'g1', name: 'set_goal_status', input: { goal: 'level-check', status: 'shown' } }, { type: 'tool_use', id: 'g2', name: 'set_goal_status', input: { goal: 'topic-intro', status: 'shown' } }];
    const w1 = watching(t20, goalsAfter);
    const r = await runV2Turn({ session: { ...lang, plan: GDI_6E }, state: pagesAt(B, { goals: { overview: { status: 'shown' as const, at: 0 } }, ...level, history }), studentSaid: 'I have worked here for seven years.', callModel: w1.call, onText: (d) => w1.heardNow.push(d), boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    check('T20 shape: the frame names present perfect, heard before the call ends (no wait)', /Next is present perfect\. Shall we go on, or do you have a question first\?/.test(w1.atEnd()) && r.state.board.pages.length === B.length, w1.atEnd());
    check('…and the stored reply says what was heard', /Next is present perfect\./.test(JSON.stringify(r.state.history)));
    const w2 = watching('Great. <board page>Past simple</board> Now the past simple.');
    await runV2Turn({ session: { ...lang, plan: GDI_6E }, state: pagesAt([...B, 'Present perfect'], { goals: { overview: { status: 'shown' as const, at: 0 } }, ...level, history }), studentSaid: 'I have worked here for seven years.', callModel: w2.call, onText: (d) => w2.heardNow.push(d), boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    check('an ordinary "Great. <page>": the frame goes out at once', /Great\.[\s\S]*Next is past simple\. Shall we go on/.test(w2.atEnd()), w2.atEnd());
    const w3 = watching('Great. <board page>Some other heading</board> Now this.');
    await runV2Turn({ session: { ...lang, plan: GDI_6E }, state: pagesAt(B, { ...level, history }), studentSaid: 'I have worked here for seven years.', callModel: w3.call, onText: (d) => w3.heardNow.push(d), boardPass: false, mathsCheck: false, nowMs: 5 * 60000 });
    check('a page of no plan part: named by its heading, at once', /Next is some other heading\. Shall we go on/.test(w3.atEnd()), w3.atEnd());
    check('the kill switch is on by default', TUTOR_V2_FRAME_NAMES_OPENED === true);
  }

  console.log('4. a summary already begun: the missed part is named as next time (tester B T60)');
  {
    const B = ['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Past simple', 'Conversation'];
    const goals = { overview: { status: 'shown' as const, at: 0 }, 'present-perfect': { status: 'demonstrated' as const, at: 0 }, 'past-simple': { status: 'demonstrated' as const, at: 0 }, 'open-conversation': { status: 'shown' as const, at: 0 } };
    const level = { workingLevel: { level: 'intermediate', from: 'this_lesson' } } as Partial<V2State>;
    check('"Before we finish, here is a quick summary." has begun it; "let\'s finish with a quick summary" announces it', V2_SUMMARY_BEGUN.test('Before we finish, here is a quick summary.') && !V2_SUMMARY_BEGUN.test("so let's finish with a quick summary."));
    check('lastSentences cuts after 。！？ with no space too', lastSentences('一つ目です。二つ目です。三つ目です。', 2) === '二つ目です。 三つ目です。' && lastSentences('One. Two. Three.', 2) === 'Two. Three.', lastSentences('一つ目です。二つ目です。三つ目です。', 2));
    check('the next-time line names the part', v2NextTimeAllLine(GDI, pagesAt(B, { goals, ...level })) === "We didn't get to the pronunciation part today, so that's for next time.");
    const t60 = 'Good work today. Before we finish, here is a quick summary. <board page>Summary</board><board note>You practised the present perfect and the past simple.</board> You used "have worked" well.';
    const heard: string[] = [];
    const r = await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(B, { goals, ...level, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'After "will", use the base verb. Can you say the sentence again?' }] }), studentSaid: 'My responsibility in sales area is contact for our client.', callModel: streaming(t60).call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: 12 * 60000 });
    const h = heard.join('');
    check('not held: no "Before the summary, there is still…" after the summary began', !/Before the summary, there is still/.test(h) && r.state.board.pages.some((p) => p.title === 'Summary'), h);
    check('the part named as next time, where the summary opens', /here is a quick summary\.\s+We didn't get to the pronunciation part today, so that's for next time\./.test(h) && /that's for next time/.test(r.spoken), h);
    const heard2: string[] = [];
    await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(B, { goals, ...level, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'After "will", use the base verb. Can you say the sentence again?' }] }), studentSaid: 'My responsibility in sales area is contact for our client.', callModel: streaming('Good work. Now let us move on. <board page>Summary</board> You used "have worked" well.').call, onText: (d) => heard2.push(d), boardPass: false, mathsCheck: false, nowMs: 12 * 60000 });
    const heard3: string[] = [];
    await runV2Turn({ session: { ...lang, plan: GDI }, state: pagesAt(B, { goals, ...level, history: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'After "will", use the base verb. Can you say the sentence again?' }] }), studentSaid: 'My responsibility in sales area is contact for our client.', callModel: streaming('Here is a quick summary of your sentence: it is clear. You used the verb well. Your answer had good detail. Now we move on. <board page>Summary</board> Great.').call, onText: (d) => heard3.push(d), boardPass: false, mathsCheck: false, nowMs: 12 * 60000 });
    check('"here is a … summary" far before the page does not count (minor 6): held with the offer', /Before the summary, there is still the pronunciation part\./.test(heard3.join('')) && !/that's for next time/.test(heard3.join('')), heard3.join(''));
    check('a summary not begun: held with the offer, as before', /Before the summary, there is still the pronunciation part\./.test(heard2.join('')), heard2.join(''));
    check('the kill switch is on by default', TUTOR_V2_SUMMARY_BEGUN_NEXT_TIME === true);
  }

  console.log('5. the mishearing line (tester A: "Skip and continue." heard as "new.")');
  {
    const section = v2LanguagesSection(['en', 'ja']) ?? '';
    check('a reply of a word or two that answers nothing is asked again, not given a meaning', /A reply of a word or two that does not answer what you asked is the same: ask them to say it again, and do not build a sentence or a meaning from it\./.test(section) && !/"new\."/.test(section));
    check('typed lessons and the kill switch off: no such line', !(v2LanguagesSection(['en', 'ja'], 'text') ?? '').includes('A reply of a word or two') && !(v2LanguagesSection(['en', 'ja'], 'voice', { checkMisheard: false }) ?? '').includes('A reply of a word or two'));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
