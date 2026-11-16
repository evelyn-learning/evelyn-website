/// <reference types="node" />
/**
 * Tutor brain v2 — measured pronunciation practice (v2/pronunciation.ts, v2/pronunciation-recorder.ts): the
 * `practise_pronunciation` control tool and its gate, the score in the next turn's facts (one more try below 60, a cut
 * recording asked for once), nothing said on pronunciation without a measurement, the route's reading of the state,
 * the recorder from microphone frames to the assess request, and the clip pipeline on real learner audio.
 *   npm run test:brain-v2-pronunciation
 *
 * Real audio (Ruling F): a few seconds of ~/.evelyn/gdi-audio/josh/student.pcm16 (laptop only; skipped when absent) go
 * through the recorder into the assess request body. With TUTOR_TEST_LIVE=1 that clip is also scored by the
 * pronunciation vendor (needs TUTOR_PRONUNCIATION_VENDOR and its key); never by default.
 *
 * Learner lines are paraphrased from the v1 live sessions (docs/superpowers/plans/2026-11-15-gdi-v1-live-sessions-findings.md).
 */
import type Anthropic from '@anthropic-ai/sdk';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { v2LanguagesSection } from '../src/lib/tutor/v2/languages';
import { V2_CONTROL_TOOL_NAMES } from '../src/lib/tutor/v2/tool-names';
import { runV2Turn, v2SessionPart, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { streamV2Turn } from '../src/lib/tutor/v2/client';
import {
  PRONUNCIATION_LOW_SCORE, V2_PRACTISE_PRONUNCIATION_TOOL, v2ApplyPractisePronunciation, v2PronunciationHeardOf, v2PronunciationSection,
  v2ReadPronunciation, v2TextSoundFacts, v2WithPronunciationHeard, type V2PronunciationHeard,
} from '../src/lib/tutor/v2/pronunciation';
import { V2PronunciationRecorder } from '../src/lib/tutor/v2/pronunciation-recorder';
import { parseAssessBody } from '../src/lib/tutor/pronunciation/assess-request';
import { CLIP_MAX_MS, CLIP_SAMPLE_RATE, PRONUNCIATION_ARM_MAX_MS } from '../src/lib/tutor/pronunciation/clip-capture';
import { V2_CONSTITUTION } from '../src/lib/tutor/v2/constitution';
import { TUTOR_V2_TEXT_NO_SOUND } from '../src/lib/tutor/orchestrator/flags';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
function stub(replies: Anthropic.Message[]) {
  const seen: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const call: V2ModelCall = async (params) => { seen.push(structuredClone(params)); const r = replies.shift(); if (!r) throw new Error('stub: no reply queued'); return r; };
  return { call, seen };
}
const practise = (items: string[], id = 'p1', say = 'Listen: schedule. Now you say it.') => msg([{ type: 'text', text: say }, { type: 'tool_use', id, name: 'practise_pronunciation', input: { items } }], 'tool_use');
const words = (text: string) => msg([{ type: 'text', text }], 'end_turn');
const factsSent = (seen: Anthropic.MessageCreateParamsNonStreaming[]) => JSON.stringify(seen[0]?.messages.at(-1));

const PLAN = {
  id: 'test.language.work.v1', title: 'Talking about your work', curriculum: 'test', grade: 'Adult', subject: 'languages', schemaVersion: 1, estimatedMinutes: 25,
  los: [{ id: 'lo.pp', description: 'Say work words clearly.' }],
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2 },
    { id: 'pron', kind: 'try_yourself', problem: 'Practise saying work words.', responseFormat: 'free', estimatedMinutes: 5, metadata: { pronunciation: { words: ['schedule', 'colleague'], sentences: ['I schedule classes for my team.'] } } },
  ],
} as unknown as LessonPlan;

const base: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 25, plan: PLAN, languages: ['en', 'ja'] };
const on: V2Session = { ...base, pronunciation: true };
const factsOf = (session: V2Session, state: V2State, heard: string | null = null) => renderFacts(session, state, { nowMs: state.startedAtMs + 60000, heard });
/** A state whose last tutor reply armed `items` (through the tool itself). */
function armed(items: string[], from: V2State = newV2State(1000)): V2State {
  const s = structuredClone(from); v2ApplyPractisePronunciation(s, { items }); return s;
}
const measured = (seq: number, overall: number, w: V2PronunciationHeard['words']): V2PronunciationHeard => ({ seq, status: 'measured', overall, words: w });
const NO_SOUND_TALK = /say nothing about how it sounded/;

async function main() {
  console.log('the gate: the partner option, spoken lessons only');
  const plain = v2SessionPart(base);
  check('without the option the session part has no pronunciation section', !/PRONUNCIATION PRACTICE/.test(plain));
  check('the option off is byte-identical to the option missing', v2SessionPart({ ...base, pronunciation: false }) === plain);
  check('without the option the bilingual line still says the tutor cannot hear pronunciation', /You cannot hear their pronunciation/.test(plain));
  const part = v2SessionPart(on);
  check('with it the session part carries the section', part.includes(v2PronunciationSection()));
  check('with it the bilingual line says: comment only on measured scores (Task 2 carry-over)', /only as a measured score in the facts/.test(part) && !/You cannot hear their pronunciation/.test(part), part);
  check('the bilingual section with the option off is unchanged', v2LanguagesSection(['en', 'ja'], 'voice') === v2LanguagesSection(['en', 'ja'], 'voice', { pronunciationMeasured: false }));
  const typed: V2Session = { ...on, mode: 'text' };
  check('a typed lesson of the same partner: no section, no facts (nothing can be recorded)', v2SessionPart(typed) === v2SessionPart({ ...typed, pronunciation: undefined }) && !/pronunciation:/.test(factsOf(typed, armed(['schedule']), 'schedule')));
  const hw: V2Session = { ...on, homework: { text: 'Solve 2x = 6.', verified: false, hasFigure: false } };
  check('a homework session of the same partner: no section', !/PRONUNCIATION PRACTICE/.test(v2SessionPart(hw)));
  check('a control tool: never painted on the board', V2_CONTROL_TOOL_NAMES.has('practise_pronunciation'));
  {
    const s = stub([words('Hello.')]); const s2 = stub([words('Hello.')]);
    await runV2Turn({ session: base, state: newV2State(), studentSaid: null, callModel: s.call, boardPass: false, mathsCheck: false });
    await runV2Turn({ session: { ...base, pronunciation: false }, state: newV2State(), studentSaid: null, callModel: s2.call, boardPass: false, mathsCheck: false });
    check('without the option the tool is not offered, and the tools are byte-identical to option off', !(s.seen[0].tools ?? []).some((t) => (t as Anthropic.Tool).name === 'practise_pronunciation') && JSON.stringify(s.seen[0].tools) === JSON.stringify(s2.seen[0].tools));
    const s3 = stub([words('Hello.')]);
    await runV2Turn({ session: on, state: newV2State(), studentSaid: null, callModel: s3.call, boardPass: false, mathsCheck: false });
    check('with it the tool is offered, after the same base tools', (s3.seen[0].tools ?? []).some((t) => (t as Anthropic.Tool).name === 'practise_pronunciation') && JSON.stringify(s3.seen[0].tools?.slice(0, s.seen[0].tools?.length)) === JSON.stringify(s.seen[0].tools));
    const s4 = stub([words('Hello.')]);
    await runV2Turn({ session: { ...on, levelCheck: true }, state: newV2State(), studentSaid: null, callModel: s4.call, boardPass: false, mathsCheck: false });
    const names = (s4.seen[0].tools ?? []).map((t) => (t as Anthropic.Tool).name);
    check('with the level check too, both partner tools are offered', names.includes('set_working_level') && names.includes('practise_pronunciation'), names);
  }
  check('the constitution and the section name no partner', !/gdi|nagoya|josh|james/i.test(V2_CONSTITUTION + v2PronunciationSection()));

  console.log('a typed language lesson: nothing is heard (D4/D8)');
  {
    const typedOn: V2Session = { ...on, mode: 'text' };
    const f = factsOf(typedOn, newV2State(1000), 'I want to expand our business internationally.');
    check('typed, with the option: the facts say nothing is heard or measured, and no word on how it sounded (beginner-ja t71, t75)', /sound: this lesson is typed: nothing they say reaches you as sound and nothing is measured/.test(f) && /never "you said it clearly"/.test(f), f);
    check('…and a pronunciation pick is the sentence to say aloud, not a grammar drill (upper-int t61–t69)', /say aloud on their own/.test(f) && /not a grammar or meaning drill/.test(f), f);
    check('typed, two languages, no option: the same line', v2TextSoundFacts({ ...base, mode: 'text' }).length === 1);
    check('typed, one language, no option (a maths lesson): no line', v2TextSoundFacts({ ...base, mode: 'text', languages: undefined }).length === 0 && !/sound:/.test(factsOf({ ...base, mode: 'text', languages: undefined }, newV2State(1000))));
    check('spoken: no line (the measured path speaks for it)', v2TextSoundFacts(on).length === 0 && !/sound: this lesson is typed/.test(factsOf(on, newV2State(1000))));
    check('typed homework: no line', v2TextSoundFacts({ ...typedOn, homework: { text: 'Solve 2x = 6.', verified: false, hasFigure: false } }).length === 0);
    check('the kill switch: on by default, off gives no line', TUTOR_V2_TEXT_NO_SOUND === true && v2TextSoundFacts(typedOn, false).length === 0);
  }

  console.log('the session part section');
  const sec = v2PronunciationSection();
  check('a comment on pronunciation only from a score in the facts', /only from a score in the facts/.test(sec) && /say nothing about how they sounded/.test(sec));
  check('offered at the plan\'s pronunciation part and on request', /plan's pronunciation part/.test(sec) && /whenever they ask/.test(sec));
  check('items: the part\'s words and sentences, or their own corrected sentences', /pronunciation words and sentences/.test(sec) && /that you corrected this lesson/.test(sec));
  check('the way to practise is asked in plain speech, never a numbered menu (real-run-B: "just a little bit of individual words")', /plain spoken question, never a numbered list/.test(sec) && /however they put it/.test(sec));
  check('the plan map shows the part\'s pronunciation items', part.includes('pronunciation words: schedule, colleague') && part.includes('I schedule classes for my team.'));

  console.log('the tool');
  {
    const s = stub([practise(['schedule', 'colleague'])]);
    const r = await runV2Turn({ session: on, state: newV2State(), studentSaid: 'Uh, just a little bit of individual words.', callModel: s.call, boardPass: false, mathsCheck: false });
    const a = r.state.pronunciation?.armed;
    check('it arms the next reply against the items, in order', a?.reference === 'schedule. colleague.' && a.attempt === 1 && a.seq === 1, r.state.pronunciation);
    check('its result tells the tutor to stop and say nothing about the sound yet', /recorded and scored/.test(r.toolCalls[0]?.outcome ?? '') && /say nothing about how it sounds/.test(r.toolCalls[0]?.outcome ?? ''), r.toolCalls[0]?.outcome);
    check('the learner\'s choice reaches the tutor as their own words: no menu parsing', JSON.stringify(s.seen[0].messages.at(-1)).includes('Uh, just a little bit of individual words.'));
    const st = newV2State(1);
    check('no items: not armed', /^not armed/.test(v2ApplyPractisePronunciation(st, { items: [] })) && !st.pronunciation?.armed);
    check('too many at once: not armed', /^not armed/.test(v2ApplyPractisePronunciation(st, { items: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] })));
    const s2 = stub([practise(['schedule'])]);
    const r2 = await runV2Turn({ session: base, state: newV2State(), studentSaid: 'Hi', callModel: s2.call, boardPass: false, mathsCheck: false });
    check('without the option the tool does nothing', !r2.state.pronunciation && /unknown tool/.test(r2.toolCalls[0]?.outcome ?? ''));
    const off: V2State = { ...newV2State(1), pronunciation: { seq: 2, off: true } };
    check('a session that cannot be measured is not armed again', /^not armed: pronunciation cannot be measured/.test(v2ApplyPractisePronunciation(off, { items: ['schedule'] })) && !off.pronunciation?.armed);
  }

  console.log('the facts: no measurement, no comment');
  const a1 = armed(['schedule']);
  check('armed, while they have not spoken yet: what is being recorded', /their next spoken reply is recorded and scored against "schedule\."/.test(factsOf(on, a1, null)));
  const unmeasured = factsOf(on, a1, 'schedule');
  check('they spoke but nothing came back (typed, talked over the tutor, too slow): not measured, say nothing about it', /this reply was not measured/.test(unmeasured) && NO_SOUND_TALK.test(unmeasured), unmeasured);
  check('nothing armed: no pronunciation line at all', !/pronunciation/.test(factsOf(on, newV2State(1000), 'I work in a bank.')));

  console.log('the facts: a measured score');
  const good = factsOf(on, v2WithPronunciationHeard(a1, measured(1, 86, [{ word: 'schedule', score: 86, sound: { ipa: 'ʃ', score: 70 } }])), 'schedule');
  check('the score is in the next turn\'s facts, and is to be said as "N out of 100"', /measured just now for "schedule\.": 86\/100 overall; "schedule" 86\/100/.test(good) && /"86 out of 100"/.test(good), good);
  check('at or above 60: no further try asked for', !/one more try/.test(good));
  const lowHeard = measured(1, 54, [{ word: 'schedule', score: 54, sound: { ipa: 'ʃ', score: 20 } }]);
  const low = factsOf(on, v2WithPronunciationHeard(a1, lowHeard), 'skedule');
  check(`below ${PRONUNCIATION_LOW_SCORE}: the weak word with its weakest sound, and one more try (the brief's example: 'schedule' 54/100, /ʃ/)`, /"schedule" 54\/100, weakest sound \/ʃ\/ 20\/100/.test(low) && /below 60: one more try/.test(low) && /call practise_pronunciation/.test(low), low);
  const lowWord = factsOf(on, v2WithPronunciationHeard(armed(['I schedule classes for my team.']), measured(1, 72, [{ word: 'I', score: 95 }, { word: 'schedule', score: 41, sound: { ipa: 'ʃ', score: 12 } }, { word: 'classes', score: 80 }, { word: 'for', score: 90 }, { word: 'my', score: 92 }, { word: 'team', score: 88 }])), 'I schedule classes for my team.');
  check('a good overall with one word below 60 still asks one more try, at that word', /one more try\. Say "schedule" once more/.test(lowWord), lowWord);
  const cutLast = factsOf(on, v2WithPronunciationHeard(armed(['I schedule classes for my team.']), measured(1, 78, [{ word: 'I', score: 95 }, { word: 'schedule', score: 80 }, { word: 'classes', score: 82 }, { word: 'for', score: 90 }, { word: 'my', score: 90 }, { word: 'team', score: 0, omitted: true }])), 'I schedule classes for my');
  check('a last word missing because the recording ended is not their mistake and does not force a retry (v1 W9-B2)', /recording ended before "team"/.test(cutLast) && !/one more try/.test(cutLast) && !/"team" not said/.test(cutLast), cutLast);

  console.log('one more try, once');
  {
    // Turn A: they said it; the score (54) is in the facts; the tutor models it again and re-arms the same word.
    const s = stub([practise(['schedule'], 'p2', 'Nearly. Listen again: schedule. Your turn.')]);
    const r = await runV2Turn({ session: on, state: v2WithPronunciationHeard(a1, lowHeard), studentSaid: 'skedule', callModel: s.call, boardPass: false, mathsCheck: false });
    check('the score reached the model in this turn\'s facts', /54\/100 overall/.test(factsSent(s.seen)));
    check('the score is used up: it is not in the state for the turn after', !r.state.pronunciation?.heard);
    check('the re-arm of the same word is the one more try', r.state.pronunciation?.armed?.attempt === 2 && r.state.pronunciation.armed.seq === 2, r.state.pronunciation);
    const again = factsOf(on, v2WithPronunciationHeard(r.state, measured(2, 50, [{ word: 'schedule', score: 50, sound: { ipa: 'ʃ', score: 30 } }])), 'skedule');
    check('below 60 again on the one more try: no further repeat, go on', /that was their one more try/.test(again) && !/below 60: one more try/.test(again), again);
    // The weak word of a sentence on its own is the one more try too.
    const st = armed(['I schedule classes for my team.']);
    const s2 = stub([practise(['schedule'], 'p3')]);
    const r2 = await runV2Turn({ session: on, state: v2WithPronunciationHeard(st, measured(1, 72, [{ word: 'I', score: 95 }, { word: 'schedule', score: 41 }, { word: 'classes', score: 80 }])), studentSaid: 'I schedule classes', callModel: s2.call, boardPass: false, mathsCheck: false });
    check('an arm of the sentence\'s weak word alone is its one more try', r2.state.pronunciation?.armed?.attempt === 2);
    const s3 = stub([practise(['colleague'], 'p4')]);
    const r3 = await runV2Turn({ session: on, state: v2WithPronunciationHeard(a1, lowHeard), studentSaid: 'skedule', callModel: s3.call, boardPass: false, mathsCheck: false });
    check('a new item after a low score is a first try of its own', r3.state.pronunciation?.armed?.attempt === 1);
    const s4 = stub([words('Good effort. Let us talk about your week.')]);
    const r4 = await runV2Turn({ session: on, state: v2WithPronunciationHeard(a1, lowHeard), studentSaid: 'skedule', callModel: s4.call, boardPass: false, mathsCheck: false });
    const s5 = stub([practise(['schedule'], 'p5')]);
    const r5 = await runV2Turn({ session: on, state: r4.state, studentSaid: 'I went to Osaka.', callModel: s5.call, boardPass: false, mathsCheck: false });
    check('the try is owed only to the reply right after: later, the same word is a first try again', r5.state.pronunciation?.armed?.attempt === 1, r5.state.pronunciation);
  }

  console.log('a recording that could not be measured: asked for once more, once');
  {
    const cut = factsOf(on, v2WithPronunciationHeard(a1, { seq: 1, status: 'cut', reason: 'not_attempted' }), 'sche');
    check('cut: ask once more and re-arm; never "I cannot hear you"', /cut short and could not be measured/.test(cut) && /say it once more/.test(cut) && /never say you cannot hear them/.test(cut) && NO_SOUND_TALK.test(cut), cut);
    const silent = factsOf(on, v2WithPronunciationHeard(a1, { seq: 1, status: 'unavailable', reason: 'clip_silent' }), 'schedule');
    check('unavailable (a silent clip, a vendor error): the same once-more', /say it once more/.test(silent) && /never say you cannot hear them/.test(silent));
    const s = stub([practise(['schedule'], 'p2', 'Let us try that once more: schedule.')]);
    const r = await runV2Turn({ session: on, state: v2WithPronunciationHeard(a1, { seq: 1, status: 'cut' }), studentSaid: 'sche', callModel: s.call, boardPass: false, mathsCheck: false });
    const second = factsOf(on, v2WithPronunciationHeard(r.state, { seq: 2, status: 'cut' }), 'sche');
    check('cut again on the repeat: leave it, still no comment on the sound', r.state.pronunciation?.armed?.attempt === 2 && /second recording .* could not be measured either/.test(second) && !/say it once more/.test(second) && NO_SOUND_TALK.test(second), second);
  }

  console.log('a session the route will not measure');
  {
    const off = factsOf(on, v2WithPronunciationHeard(a1, { seq: 1, status: 'off', reason: 'http_404' }), 'schedule');
    check('off: not measured, and no more practice offered', /cannot be measured in this session/.test(off) && /do not offer pronunciation practice again/.test(off) && NO_SOUND_TALK.test(off), off);
    const s = stub([words('Thanks. Next, tell me about your week.')]);
    const r = await runV2Turn({ session: on, state: v2WithPronunciationHeard(a1, { seq: 1, status: 'off' }), studentSaid: 'schedule', callModel: s.call, boardPass: false, mathsCheck: false });
    check('it is remembered for the rest of the session', r.state.pronunciation?.off === true && /cannot be measured in this session/.test(factsOf(on, r.state, 'ok')));
  }

  console.log('the browser puts the score in the state, the route reads it');
  check('a score for another arm is dropped', v2WithPronunciationHeard(a1, measured(7, 90, [])) === a1);
  check('a score with nothing armed is dropped', v2WithPronunciationHeard(newV2State(1), measured(1, 90, [])).pronunciation === undefined);
  const withScore = v2WithPronunciationHeard(a1, lowHeard);
  check('the route keeps a well-formed state', JSON.stringify(v2ReadPronunciation(JSON.parse(JSON.stringify(withScore.pronunciation)))) === JSON.stringify(withScore.pronunciation), v2ReadPronunciation(withScore.pronunciation));
  check('the route drops a bad seq, a score for another arm and junk', v2ReadPronunciation({ seq: -1 }) === undefined && v2ReadPronunciation('x') === undefined && !v2ReadPronunciation({ ...withScore.pronunciation, heard: { ...lowHeard, seq: 9 } })?.heard);
  check('the route clamps scores to 0–100', v2ReadPronunciation({ seq: 1, armed: { seq: 1, items: ['a'] }, heard: { seq: 1, status: 'measured', overall: 400, words: [{ word: 'a', score: -5 }] } })?.heard?.overall === 100);

  console.log('the assess route\'s answer as a score');
  check('404 (the route is closed to this session): off', v2PronunciationHeardOf(3, 404, null).status === 'off');
  check('429 (the per-session cap) and 500: unavailable', v2PronunciationHeardOf(3, 429, {}).status === 'unavailable' && v2PronunciationHeardOf(3, 500, {}).status === 'unavailable');
  check('no vendor or no key: off; a vendor error: unavailable', v2PronunciationHeardOf(3, 200, { status: 'unavailable', reason: 'no_vendor' }).status === 'off' && v2PronunciationHeardOf(3, 200, { status: 'unavailable', reason: 'vendor_error' }).status === 'unavailable');
  check('an ok answer that is not an attempt (fewer than 3/4 of the words): cut', v2PronunciationHeardOf(3, 200, { status: 'ok', measured: false, result: { overall: 20, words: [] } }).status === 'cut');
  const h = v2PronunciationHeardOf(3, 200, { status: 'ok', measured: true, result: { overall: 61.6, words: [
    { word: 'schedule', score: 54.2, errorType: 'mispronunciation', phonemes: [{ ipa: 'k', score: 90 }, { ipa: 'ʃ', score: 20 }], stress: 'wrong' },
    { word: 'uh', score: 0, errorType: 'insertion', phonemes: [] },
  ] } });
  check('measured: rounded scores, the weakest sound, stress; insertions left out', h.status === 'measured' && h.seq === 3 && h.overall === 62 && h.words?.length === 1 && h.words[0]!.score === 54 && h.words[0]!.sound?.ipa === 'ʃ' && h.words[0]!.stressWrong === true, h);

  console.log('the browser sends the option and the state');
  {
    let sent: Record<string, unknown> = {};
    const fetchImpl = (async (_u: string, init: RequestInit) => { sent = JSON.parse(String(init.body)); const body = `data: ${JSON.stringify({ type: 'done', spoken: '', state: newV2State(1), usage: {}, firstTextMs: 1, totalMs: 1 })}\n\n`; return new Response(body, { status: 200 }); }) as unknown as typeof fetch;
    await streamV2Turn({ session: { subject: 'English', level: 'adult', mode: 'voice', pronunciation: true }, state: withScore, studentSaid: 'skedule', fetchImpl });
    check('the session carries pronunciation and the state carries the score', (sent.session as { pronunciation?: boolean }).pronunciation === true && (sent.state as V2State).pronunciation?.heard?.overall === 54, sent.session);
  }

  console.log('the recorder: microphone frames to the assess request');
  const speech = (ms: number, amp = 0.3) => { const n = Math.round((ms / 1000) * CLIP_SAMPLE_RATE); const f = new Float32Array(n); for (let i = 0; i < n; i++) f[i] = amp * Math.sin(i / 7); return f; };
  function recorderWith(answer: { status: number; body: unknown }, clock = { t: 0 }) {
    const bodies: Array<Record<string, unknown>> = []; const logs: string[] = [];
    const fetchImpl = (async (_u: string, init: RequestInit) => { bodies.push(JSON.parse(String(init.body))); return new Response(JSON.stringify(answer.body), { status: answer.status }); }) as unknown as typeof fetch;
    const rec = new V2PronunciationRecorder({ sessionId: 'sess-1', fetchImpl, now: () => clock.t, log: (t, m) => logs.push(`${t} ${m}`) });
    return { rec, bodies, logs, clock };
  }
  {
    const { rec, bodies } = recorderWith({ status: 200, body: { status: 'ok', measured: true, result: { overall: 80, words: [{ word: 'schedule', score: 80, errorType: 'none', phonemes: [] }] } } });
    check('not armed: nothing is recorded or sent', (rec.speechStart(false), rec.frame(speech(800)), rec.speechStop(), bodies.length === 0));
    check('nothing in flight: take is null at once', (await rec.take(10)) === null);
    rec.arm(4, 'schedule.');
    rec.speechStart(true); rec.frame(speech(500)); rec.speechStop();
    check('speech while the tutor\'s voice plays is its echo: not recorded, still armed', bodies.length === 0 && rec.isArmed());
    rec.frame(speech(300)); rec.speechStart(false); rec.frame(speech(900)); rec.speechStop();
    const heard = await rec.take(1000);
    const parsed = parseAssessBody(bodies[0]);
    check('the student\'s utterance is one clip, posted as the assess route parses it', bodies.length === 1 && parsed.ok && parsed.sessionId === 'sess-1' && parsed.referenceText === 'schedule.', parsed);
    check('with the pre-roll from before the speech start (v1: the first consonant)', parsed.ok && parsed.pcm16.length / 2 >= 0.9 * CLIP_SAMPLE_RATE + 0.25 * CLIP_SAMPLE_RATE);
    check('take returns the score for that arm, once', heard?.status === 'measured' && heard.seq === 4 && heard.overall === 80 && (await rec.take(10)) === null, heard);
    check('one clip per arm: the capture is idle after it', !rec.isArmed());
  }
  {
    const { rec, bodies } = recorderWith({ status: 200, body: {} });
    rec.arm(1, 'schedule.'); rec.speechStart(false); rec.frame(new Float32Array(24000)); rec.speechStop();
    const heard = await rec.take(10);
    check('an all-silent clip is not posted: unavailable (v1 Task 24 §A2)', bodies.length === 0 && heard?.status === 'unavailable' && heard.reason === 'clip_silent', heard);
  }
  {
    const { rec, bodies, clock } = recorderWith({ status: 200, body: {} });
    rec.arm(1, 'schedule.'); clock.t = PRONUNCIATION_ARM_MAX_MS + 1; rec.speechStart(false); rec.frame(speech(900)); rec.speechStop();
    check('an arm past its lifetime scores nothing later', bodies.length === 0 && !rec.isArmed());
  }
  {
    const { rec } = recorderWith({ status: 404, body: { error: 'not found' } });
    rec.arm(2, 'schedule.'); rec.speechStart(false); rec.frame(speech(900)); rec.speechStop();
    check('a route closed to the session reads as off', (await rec.take(1000))?.status === 'off');
  }
  {
    const { rec, bodies } = recorderWith({ status: 200, body: {} });
    rec.arm(1, 'a.'); rec.speechStart(false); rec.frame(speech(600)); rec.arm(2, 'b.'); rec.speechStart(false); rec.frame(speech(600)); rec.speechStop(); await rec.take(1000);
    const p = parseAssessBody(bodies[0]);
    check('a new arm starts a new clip: nothing of the old item\'s audio', p.ok && p.referenceText === 'b.' && p.pcm16.length / 2 <= 0.6 * CLIP_SAMPLE_RATE + 1, p.ok ? p.pcm16.length / 2 : p);
  }

  console.log('real learner audio (Ruling F)');
  const file = join(homedir(), '.evelyn/gdi-audio/josh/student.pcm16');
  if (!existsSync(file)) console.log('  - skipped: no learner audio on this machine');
  else {
    // The learner's "I schedule class for many teachers and teach." (the transcript has it at 367 s; the speech runs ~359.5–365 s).
    const all = readFileSync(file);
    const slice = (fromS: number, toS: number) => { const b = all.subarray(Math.round(fromS * CLIP_SAMPLE_RATE) * 2, Math.round(toS * CLIP_SAMPLE_RATE) * 2); const f = new Float32Array(b.length / 2); for (let i = 0; i < f.length; i++) f[i] = b.readInt16LE(i * 2) / 32768; return { b, f }; };
    const feed = (rec: V2PronunciationRecorder, f: Float32Array) => { for (let i = 0; i < f.length; i += 4096) rec.frame(f.subarray(i, i + 4096)); };
    const reference = 'I schedule classes for many teachers and I teach.';
    {
      const { rec, bodies } = recorderWith({ status: 200, body: { status: 'ok', measured: true, result: { overall: 70, words: [] } } });
      const { b, f } = slice(359.0, 366.0);
      rec.arm(1, reference); rec.speechStart(false); feed(rec, f); rec.speechStop(); await rec.take(1000);
      const p = parseAssessBody(bodies[0]);
      const same = p.ok && p.pcm16.length === b.length && (() => { for (let i = 0; i < b.length / 2; i++) if (Math.abs(p.pcm16.readInt16LE(i * 2) - b.readInt16LE(i * 2)) > 1) return false; return true; })();
      check('a 7 s slice of the learner\'s speech becomes one clip whose request body carries the same samples (±1 LSB)', same, p.ok ? { got: p.pcm16.length, want: b.length } : p);
      const peak = (() => { let m = 0; for (let i = 0; i < b.length / 2; i++) m = Math.max(m, Math.abs(b.readInt16LE(i * 2))); return 20 * Math.log10(m / 32768); })();
      check('it is real speech, not silence (it would be posted)', peak > -30, peak.toFixed(1));
    }
    {
      const { rec, bodies } = recorderWith({ status: 200, body: { status: 'ok', measured: true, result: { overall: 70, words: [] } } });
      const { f } = slice(350.0, 370.0);
      rec.arm(1, reference); rec.speechStart(false); feed(rec, f); rec.speechStop(); await rec.take(1000);
      const p = parseAssessBody(bodies[0]);
      check('a 20 s stretch is cut at the 15 s clip cap and sent once', bodies.length === 1 && p.ok && p.pcm16.length / 2 === (CLIP_MAX_MS / 1000) * CLIP_SAMPLE_RATE, p.ok ? p.pcm16.length / 2 : p);
    }
    if (process.env.TUTOR_TEST_LIVE === '1') {
      // Calls the pronunciation vendor (not Cartesia): never by default.
      const { assessPronunciation, isMeasuredResult } = await import('../src/lib/tutor/pronunciation/assessor');
      const { b } = slice(359.0, 366.0);
      const out = await assessPronunciation({ pcm16: Buffer.from(b), sampleRate: 24000, referenceText: reference });
      console.log('  live result:', JSON.stringify(out).slice(0, 600));
      check('LIVE: the vendor scores the learner\'s clip as an attempt', out.status === 'ok' && isMeasuredResult(out), out);
      const heard = v2PronunciationHeardOf(1, 200, { ...out, measured: isMeasuredResult(out) });
      console.log('  facts:', factsOf(on, v2WithPronunciationHeard(armed([reference]), heard), 'I schedule class for many teachers and teach.').split('\n').filter((l) => /pronunciation|below|tell them/.test(l)).join(' | '));
    } else console.log('  - live vendor call skipped (TUTOR_TEST_LIVE=1 to run it)');
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main();
