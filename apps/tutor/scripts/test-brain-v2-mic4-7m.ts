/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7m: mic test 4 (embed-1795028886172): corrections heard and seen; no false silence turn; the question
 * card said once. The session's plan (gdi-work-projects-v1), its 20-minute box, and the replies and learner words quoted in
 * task-7m-investigation.md (A, D, E, F, Other 1). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-mic4-7m
 *
 *  1 CARD_STRESS_SPOKEN     a sentence card's stress words set apart in its spoken copy, and in a longer quoted correction
 *  2 NO_FALSE_SILENCE       a reply ending `Try starting with "I have worked with…"` asks; a silence turn after an ask asks for
 *                           one short line, and an owed card waits for the next learner turn
 *  3 QUESTION_ONCE          no "Question:" label in the card; the card's question said where it stands, never again after the hint
 *  4 CORRECTION_CARD_NOW    an owed corrected-sentence card written by the same turn's board check; no "…" fragment card; no
 *                           owed card for a sentence a card already holds
 *  5 WAVE_DASH              a decorative 〜 is not spoken (the voice read it "kara"); a range (words, days, numbers, times) keeps it
 *  fix round 1             I1 a non-language voice lesson keeps the base ask; M1 no stress in an unrelated starter; M3 "Let's try
 *                           starting…" is no ask; M5 ranges; M6 an owed card a board card holds is not asked again; M10 short
 *                           questions; (e) a Japanese reply with nothing owed runs no board check
 *  each switch off alone (a child process per switch): the behaviour at the base commit for that item.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_CARD_STRESS_SPOKEN, TUTOR_V2_CORRECTION_CARD_NOW, TUTOR_V2_NO_FALSE_SILENCE, TUTOR_V2_QUESTION_ONCE, TUTOR_V2_WAVE_DASH } from '../src/lib/tutor/orchestrator/flags';
import { markStressed, withTargetPauses } from '../src/lib/tutor/v2/target-pauses';
import { v2SpeechParts } from '../src/lib/tutor/v2/languages';
import { v2SpeakSounds, v2SpeakWaveDash } from '../src/lib/tutor/v2/spoken-sounds';
import { rewriteForTTS, speakDataRuns, speakLessonNotation, speakNumberPlurals, speakSlashes } from '../src/lib/tutor/voice/tts-pronunciation';
import { SentenceStream } from '../src/lib/tutor/v2/sentences';
import { asksAloud, asksAnywhere, unsaidAsk } from '../src/lib/tutor/v2/board-timing';
import { v2SentencesNotCarded } from '../src/lib/tutor/v2/learner-card';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const CHILD = process.env.MIC4_7M_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Step = { text: string; after?: unknown[] };
function scripted(steps: Step[]) {
  const facts: string[] = []; const prompts: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) { if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text); if (b.type === 'text' && b.text) prompts.push(b.text); }
    const s = steps[Math.min(i, steps.length - 1)]!; i += 1;
    if (onText) for (const piece of s.text.match(/[\s\S]{1,17}/g) ?? []) onText(piece);
    return msg([...(s.text ? [{ type: 'text', text: s.text }] : []), ...(s.after ?? [])], s.after?.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts, prompts, calls: () => i };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const card = (id: string, summary: string) => ({ id, tool: 'show_sentence', summary });
const TODAY: V2BoardPage = { title: 'Today\'s lesson', items: [{ id: 't1', tool: 'annotate', summary: 'present perfect / past simple' }] };
// Page 3 at 9.5 min: the corrected sentence carded at 5.35.
const JOB: V2BoardPage = { title: '仕事について', items: [card('j1', 'I work in sales in the home appliance division.'), card('j2', 'I have worked at Nagoya Corporation for six years.')] };
const PP: V2BoardPage = { title: 'Present perfect', items: [{ id: 'p1', tool: 'annotate', summary: 'have / has + past participle' }] };
const PS: V2BoardPage = { title: 'Past simple', items: [card('s1', 'I attended a robotics exhibition in Beijing two months ago.')] };
const goalsAt = { overview: { status: 'shown' as const, at: 0 }, 'level-check': { status: 'demonstrated' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 } };
const base = (pages: V2BoardPage[], extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), workingLevel: { level: 'beginner', from: 'this_lesson' }, board: { pages: structuredClone(pages), current: pages.length - 1 }, goals: goalsAt, timeFit: { dropped: [], byArrival: true }, practiceSaid: { 'topic-intro': 3 }, ...extra });
const run = (st: V2State, said: string | null, steps: Step[], nowMin: number, more: { silence?: number; boardPass?: boolean } = {}) => {
  const heard: string[] = []; const m = scripted(steps);
  return runV2Turn({ session: lang, state: st, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: !!more.boardPass, mathsCheck: false, nowMs: nowMin * MIN, ...(more.silence ? { facts: { silenceSeconds: more.silence } } : {}) })
    .then((r) => ({ r, heard: heard.join(''), facts: m.facts.join('\n'), prompts: m.prompts, calls: m.calls() }));
};

// ── The session's texts (task-7m-investigation.md) ──
// A (3.65 / 3.68)
const A_REPLY_QUOTE = 'One small thing: we say "in the home appliance division."';
const A_CARD = 'I work in sales in the home appliance division.';
// D (9.51 / 9.57 / 9.94)
const D_SAID = 'Um, I have worked uh, Nagoya Corporation uh, for 6 year.';
const D_REPLY = 'Yes, "I have worked" is right. One small thing: we say "at Nagoya Corporation" and "for six years."\n\nNow, another sentence about you, with "I have…" Try starting with "I have worked with…" or "I have sold…".';
const D_NUDGE_CARD = 'I have worked at Nagoya Corporation for six years.';
// E (14.91 / 14.93)
const E_SAID = 'One more practice past simple.';
const E_REPLY = 'わかりました。もう一問、過去形の練習をしましょう。 <board problem difficulty="easy">Question: What did you do last week at work? Answer with one sentence, using the past simple, with a time word such as last week or yesterday.</board> まず、一文で答えてみてください。Try starting with: "I visited…" or "I met…"';
const E_Q = 'What did you do last week at work?';
// F (17.26 / 17.31)
const F_SAID = 'I sell 35 washing machine to customer from Canada.';
const F_REPLY = 'いいですね。「last week」は終わった時間なので、過去形を使います。「sell」の過去形は「sold」です。もう一度、「I sold…」で始めて言ってみてください。';
const F_CHECK = '1: none\n<board sentence stress="sold" gloss="「sell」の過去形は「sold」です。" with="「sell」の過去形は">I sold 35 washing machines to a customer from Canada.</board>\n3: none, nothing to draw';
// Other 1 (6.76)
const WAVE = '日本語で言うと、「今、〜しています」の「〜しています」の部分です。';

const restOfPath = (s: string) => rewriteForTTS(speakSlashes(speakNumberPlurals(speakDataRuns(speakLessonNotation(v2SpeakSounds(s))))), { studentName: 'Ken' });
const speak = (sentence: string, stress: Array<{ sentence: string; stress: string[] }>) => v2SpeechParts(sentence, ['en', 'ja']).map((part) => withTargetPauses(part, restOfPath, true, true, stress));
const cut = (text: string) => { const s = new SentenceStream(); return [...s.push(text), ...s.flush()]; };

/** Every item's observable outcome, for the parent (all on) and a child per switch off. */
async function probe() {
  const aStress = [{ sentence: A_CARD, stress: ['the'] }];
  const dStress = [{ sentence: D_NUDGE_CARD, stress: ['at', 'for'] }];
  // 2b: the silence turn 2 s after the 9.57 reply, with the card it left owed.
  // (The corrected card of page 3 left out: with it, fix round 1 M6 drops the owed line whatever this switch says.)
  const silenceState = base([TODAY, { ...JOB, items: JOB.items.slice(0, 1) }, PP], { history: [u(D_SAID), a(D_REPLY)], cardsOwed: ['I have worked, Nagoya Corporation, for 6 year.'] });
  const silence = await run(silenceState, null, [{ text: 'Take your time.' }], 9.9, { silence: 2 });
  // 3: the 14.93 reply.
  const eMake = () => base([TODAY, JOB, PP, PS], { history: [u('x'), a('That\'s right, and it\'s clear. Past simple is done. Next is Conversation. Do you have a question before we go on, or are you ready?')], practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 2 }, goals: { ...goalsAt, 'present-perfect': { status: 'demonstrated', at: 0 } } });
  const e = await run(eMake(), E_SAID, [{ text: E_REPLY }], 14.93);
  const problem = e.r.toolCalls.find((c) => c.name === 'show_problem');
  // 4: the 17.31 reply, after the 14.93 ask for one sentence.
  const fState = base([TODAY, JOB, PP, PS], { history: [u(E_SAID), a(E_REPLY)], practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3 }, goals: { ...goalsAt, 'present-perfect': { status: 'demonstrated', at: 0 } } });
  const f = await run(fState, F_SAID, [{ text: F_REPLY }, { text: F_CHECK }], 17.31, { boardPass: true });
  const fCard = f.r.toolCalls.find((c) => c.name === 'show_sentence');
  // 4: the 11.31 fragment card.
  // Fix round 1 (e): the same Japanese reply when its sentence is already on the board, corrected: nothing owed, no check call.
  const fHeld = base([TODAY, JOB, PP, { ...PS, items: [...PS.items, card('s2', F_SAID)] }], { history: [u(E_SAID), a(E_REPLY)], practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 3 }, goals: { ...goalsAt, 'present-perfect': { status: 'demonstrated', at: 0 } } });
  const fh = await run(fHeld, F_SAID, [{ text: F_REPLY }, { text: F_CHECK }], 17.31, { boardPass: true });
  // Fix round 1 (I1): a science voice demo (no languages, no plan): the reviewer's card and reply.
  const sci = await runV2Turn({ session: { studentName: 'Sam', subject: 'Science', level: 'Grade 4', mode: 'voice' }, state: newV2State(0), studentSaid: 'Okay.', callModel: scripted([{ text: 'Does the bulb light up? <board problem>Does the bulb light up? Say yes or no, and say why.</board> Here is the circuit. It has one cell. It has a switch. Look at it.' }]).call, boardPass: false, mathsCheck: false, nowMs: 3 * MIN });
  // M8: the model says the card's question straight after the card: heard once.
  const eSaid = await run(eMake(), E_SAID, [{ text: `わかりました。 <board problem>${E_Q}</board> ${E_Q} Try starting with "I went…"` }], 14.93);
  // M6: an owed card kept across a silence turn, now held by a board card: not asked for again.
  const owedHeld = await run(base([TODAY, JOB, PP], { history: [u(D_SAID), a(D_REPLY)], cardsOwed: ['I have worked, Nagoya Corporation, for 6 year.'] }), 'I have worked with many customers.', [{ text: 'Good.' }], 10.5);
  const frag = await run(base([TODAY, JOB, PP]), null, [{ text: 'Now try one more. <board sentence>I have worked with…</board> Start with that.' }], 11.31);
  return {
    // 1
    aCard: speak(A_CARD, aStress), aQuote: speak(A_REPLY_QUOTE, aStress), dCard: speak(D_NUDGE_CARD, dStress),
    // 2
    dCut: cut(D_REPLY), dAsks: asksAnywhere(cut(D_REPLY)),
    silenceFacts: silence.facts, silenceOwedKept: silence.r.state.cardsOwed ?? null,
    // 3
    eHeard: e.heard, eStatement: String(problem?.args.statement ?? ''), eTitle: String(problem?.args.title ?? ''), eJaAsk: asksAloud(['まず、一文で答えてみてください。']),
    // 4
    fCalls: f.calls, fCheck: f.prompts.find((p) => p.startsWith('[board check')) ?? '', fCard: fCard ? { s: fCard.args.sentence, o: fCard.outcome, e: fCard.args.emphasis } : null, fOwed: f.r.state.cardsOwed ?? null,
    fragOutcome: frag.r.toolCalls.find((c) => c.name === 'show_sentence')?.outcome ?? '',
    dupOwed: v2SentencesNotCarded(['I have worked, Nagoya Corporation, for 6 year.'], [], base([TODAY, JOB, PP]).board),
    // 5
    wave: v2SpeakWaveDash(WAVE),
    waveRanges: ['月曜日〜金曜日', '三〜五人', '〜5人', '9:00〜10:00', '「〜で」は at'].map((x) => v2SpeakWaveDash(x)),
    fHeldCalls: fh.calls, sciSpoken: sci.spoken, eSaidCount: eSaid.heard.split(E_Q).length - 1,
    owedHeldFacts: /not carded in your last reply/.test(owedHeld.facts),
    shortQ: unsaidAsk('Ice floats on water. Why?', ['That\'s why we test it.']),
    letsTry: asksAnywhere(['Good.', 'Let\'s try starting with the chain rule.']),
    starter: speak('Try starting with "I have a meeting…"', [{ sentence: 'I sold 35 washing machines to a customer from Canada.', stress: ['a'] }]),
    jaLed: speak('英語では「in the home appliance division」と言います。', aStress),
  };
}

async function main() {
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(await probe())}`); return; }
  const D = '—';
  const on = await probe();

  console.log('the switches: each on by default');
  check('CARD_STRESS_SPOKEN, NO_FALSE_SILENCE, QUESTION_ONCE, CORRECTION_CARD_NOW, WAVE_DASH default on', TUTOR_V2_CARD_STRESS_SPOKEN && TUTOR_V2_NO_FALSE_SILENCE && TUTOR_V2_QUESTION_ONCE && TUTOR_V2_CORRECTION_CARD_NOW && TUTOR_V2_WAVE_DASH);

  console.log('1  flag 1 (3.9 min): the corrected "the" set apart where the card is spoken, and inside the quoted correction');
  check('the card (stress "the") is spoken with dashes around "the"', JSON.stringify(on.aCard) === JSON.stringify([`I work in sales in ${D} the ${D} home appliance division.`]), on.aCard);
  check('the 4-word quoted correction marks only its stress word, not the whole quote', JSON.stringify(on.aQuote) === JSON.stringify([`One small thing: we say in ${D} the ${D} home appliance division.`]), on.aQuote);
  check('the 9.94 card (stress "at | for"): both stress words set apart', JSON.stringify(on.dCard) === JSON.stringify([`I have worked ${D} at ${D} Nagoya Corporation ${D} for ${D} six years.`]), on.dCard);
  {
    const three = markStressed('I have worked at Nagoya Corporation for six years.', [{ sentence: 'I have worked at Nagoya Corporation for six years.', stress: ['have', 'at', 'for'] }]);
    check('at most two marked targets in one piece of speech', (three.match(//g) ?? []).length === 2, three);
    const other = markStressed('We say "at the office."', [{ sentence: D_NUDGE_CARD, stress: ['for'] }]);
    check('a long quote without a stress word is unchanged', other === 'We say "at the office."', other);
    const plain = markStressed('I work at home.', [{ sentence: A_CARD, stress: ['the'] }]);
    check('a sentence that is not the card and has no quote is unchanged', plain === 'I work at home.', plain);
    check('a Japanese-led sentence quoting a piece of the card: the stress word set apart in the English part it becomes (fix round 1, M8)', JSON.stringify(on.jaLed) === JSON.stringify(['英語では', `in ${D} the ${D} home appliance division.`, 'と言います。']), on.jaLed);
    check('a quoted starter unrelated to the correction is not marked (fix round 1, M1)', !on.starter.join('').includes(D), on.starter);
    const noStress = withTargetPauses(A_CARD, restOfPath, true, true);
    check('no stress list: the card is spoken as before (no marks)', noStress === restOfPath(A_CARD), noStress);
  }
  {
    const hook = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'useV2Turns.ts'), 'utf8');
    const at = hook.indexOf('onToolCall: (call) => {');
    const body = hook.slice(at, at + 1600);
    check('useV2Turns tells the voice client of a card before the sentence kept for it is let go', /onBoardCallArrived\?\.\(call\)/.test(body) && body.indexOf('onBoardCallArrived') < body.indexOf('letGo()'), body.slice(0, 300));
    const voice = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
    check('TutorVoiceV2 passes the turn\'s card stress to withTargetPauses under CARD_STRESS_SPOKEN', /TUTOR_V2_CARD_STRESS_SPOKEN \? cardStressRef\.current/.test(voice) && /cardStressRef\.current = \[\]/.test(voice));
  }

  console.log('2  flag 4 (10.3 min): no false silence turn');
  check('the 9.57 reply is cut after `…"` before "Try starting with"', on.dCut[on.dCut.length - 1]!.startsWith('Try starting with'), on.dCut);
  check('so the reply asks (no 2-second recheck is armed)', on.dAsks === true);
  check('a silence turn after an ask: the facts ask for one short line, no claim, no new card', /asked them for something/.test(on.silenceFacts) && /one short line/.test(on.silenceFacts) && !/ended on a statement/.test(on.silenceFacts), on.silenceFacts.slice(-600));
  check('a silence turn carries no owed-card line', !/not carded in your last reply/.test(on.silenceFacts));
  check('the owed card waits in the state for the next learner turn', JSON.stringify(on.silenceOwedKept) === JSON.stringify(['I have worked, Nagoya Corporation, for 6 year.']), on.silenceOwedKept);

  console.log('3  flag 5a (15.2 min): the question card labelled once and said once');
  check('the card\'s statement has no "Question:" label (the title says it)', on.eStatement.startsWith('What did you do last week at work?') && on.eTitle === 'Question', on.eStatement);
  const qCount = on.eHeard.split(E_Q).length - 1;
  check('the card\'s question is heard exactly once', qCount === 1, on.eHeard);
  check('heard in order: the question, then the hint ("Try starting with…")', on.eHeard.indexOf(E_Q) >= 0 && on.eHeard.indexOf(E_Q) < on.eHeard.indexOf('Try starting with'), on.eHeard);
  check('the whole card (its instruction) is not appended after the hint', !/Answer with one sentence/.test(on.eHeard) && !/Question:/.test(on.eHeard), on.eHeard);
  check('「答えてみてください」 hands the turn over', on.eJaAsk === true);
  check('the model saying the question straight after its card: heard once (the gate drops the runtime\'s)', on.eSaidCount === 1, on.eSaidCount);
  check('fix round 1 (I1): a science voice lesson keeps the base ask: the card\'s ask with its instruction is said at the end', /Look at it\.\s+Does the bulb light up\? Say yes or no, and say why\.$/.test(on.sciSpoken), on.sciSpoken);
  {
    const sciSaid = ['Does the bulb light up?', 'Here is the circuit.', 'It has one cell.', 'It has a switch.', 'Look at it.'];
    const card = 'Does the bulb light up? Say yes or no, and say why.';
    check('… which the question-once rule alone would have dropped (why it is gated to language lessons)', unsaidAsk(card, sciSaid, { questionOnce: true }) === null && unsaidAsk(card, sciSaid, { questionOnce: false }) === card);
  }
  check('fix round 1 (M10): "That\'s why we test it." does not say the card\'s "Why?"', on.shortQ !== null, on.shortQ);
  check('fix round 1 (M3): "Let\'s try starting with the chain rule." is the tutor\'s plan, not an ask', on.letsTry === false);

  console.log('4  flag 6 (17.5 min): every correction on the board in the same reply');
  check('the Japanese correction with no card runs the board check in the same turn', on.fCalls === 2, on.fCalls);
  check('the check names their sentence and asks for its corrected card', on.fCheck.includes(JSON.stringify(F_SAID)) && /sentence card/.test(on.fCheck) && /stressed/.test(on.fCheck), on.fCheck.slice(-900));
  check('the corrected card is painted in this turn, "sold" stressed', !!on.fCard && /^painted/.test(String(on.fCard.o)) && JSON.stringify(on.fCard.e) === '["sold"]', on.fCard);
  check('nothing is owed to the next turn', on.fOwed === null, on.fOwed);
  check('a card of a starter fragment ("I have worked with…") is refused', /^not painted/.test(on.fragOutcome), on.fragOutcome);
  check('a sentence whose corrected card is already on the board is not owed again (no duplicate, 9.94)', on.dupOwed.length === 0, on.dupOwed);
  {
    const fresh = v2SentencesNotCarded(['I have worked at Toyota for three years.'], [], base([TODAY, JOB, PP]).board);
    check('a new practice sentence like the card is still owed', fresh.length === 1, fresh);
  }
  check('fix round 1 (e): a Japanese reply that leaves nothing owed runs no board check (one model call)', on.fHeldCalls === 1, on.fHeldCalls);
  check('fix round 1 (M6): an owed card a board card now holds is not asked for again', on.owedHeldFacts === false);

  console.log('5  Other 1 (6.76 min): 〜 not read "kara"');
  check('a decorative 〜 (after 、 or 「) is not spoken', !on.wave.includes('〜') && on.wave.includes('「今、しています」'), on.wave);
  check('a range keeps it (read "から"): days, kanji numbers, "up to 5", times; 「〜で」 loses it (fix round 1, M5)', JSON.stringify(on.waveRanges) === JSON.stringify(['月曜日〜金曜日', '三〜五人', '〜5人', '9:00〜10:00', '「で」は at']), on.waveRanges);
  {
    const voice = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'v2', 'TutorVoiceV2.tsx'), 'utf8');
    check('the plain-speech chain applies it under WAVE_DASH', /TUTOR_V2_WAVE_DASH \? v2SpeakWaveDash\(/.test(voice));
  }

  console.log('6  each flag off alone (a child process per switch): as at the base commit for that item, the others on');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', MIC4_7M_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    return line ? JSON.parse(line.slice('OFF_JSON '.length)) as typeof on : ({ error: res.stderr } as unknown as typeof on);
  };
  {
    const off = child('CARD_STRESS_SPOKEN');
    check('CARD_STRESS_SPOKEN off: the card and the long quote unmarked (7l alone)', JSON.stringify(off.aCard) === JSON.stringify([restOfPath(A_CARD)]) && !String(off.aQuote).includes(D), [off.aCard, off.aQuote]);
    check('… the other items as on', off.dAsks === true && off.fCalls === 2 && JSON.stringify(off.wave) === JSON.stringify(on.wave));
  }
  {
    const off = child('NO_FALSE_SILENCE');
    check('NO_FALSE_SILENCE off: the 9.57 reply taken for one that asked nothing (as before)', off.dAsks === false, off.dCut);
    check('… the old "ended on a statement" line, with the owed-card line', /ended on a statement/.test(off.silenceFacts) && /not carded in your last reply/.test(off.silenceFacts));
    check('… and the owed card dropped by the silence turn', off.silenceOwedKept === null, off.silenceOwedKept);
    check('… the other items as on', JSON.stringify(off.aCard) === JSON.stringify(on.aCard) && off.fCalls === 2);
  }
  {
    const off = child('QUESTION_ONCE');
    check('QUESTION_ONCE off: the label stays and the whole card is appended after the hint (as before)', off.eStatement.startsWith('Question:') && /Answer with one sentence/.test(off.eHeard) && off.eJaAsk === false, [off.eStatement, off.eHeard]);
    check('… the other items as on', off.dAsks === true && off.fCalls === 2);
    check('… and the science lesson\'s reply is the same with the switch on or off (I1)', off.sciSpoken === on.sciSpoken, [off.sciSpoken, on.sciSpoken]);
  }
  {
    const off = child('CORRECTION_CARD_NOW');
    check('CORRECTION_CARD_NOW off: no check in the same turn, the card owed to the next (as before)', off.fCalls === 1 && JSON.stringify(off.fOwed) === JSON.stringify([F_SAID]), [off.fCalls, off.fOwed]);
    check('… the fragment card painted and the duplicate owed (as before)', /^painted/.test(off.fragOutcome) && off.dupOwed.length === 1, [off.fragOutcome, off.dupOwed]);
    check('… the other items as on', off.dAsks === true && JSON.stringify(off.aCard) === JSON.stringify(on.aCard));
  }
  {
    const off = child('WAVE_DASH');
    check('WAVE_DASH off: 〜 left in the speech (as before)', off.wave === WAVE && off.waveRanges[4] === '「〜で」は at', off.wave);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
