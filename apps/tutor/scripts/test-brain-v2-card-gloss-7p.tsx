/// <reference types="node" />
/**
 * Tutor brain v2 — Task 7p: mic test 4 (embed-1795028886172, flag 5c at 15.2 min): a short line in the learner's language under
 * question cards and rule notes, for a beginner. The session's plan (gdi-work-projects-v1) and the replies quoted in
 * task-7m-investigation.md (E 14.93, B 5.45). No network, no model, nothing to the speech vendor.
 *   npm run test:brain-v2-card-gloss-7p
 *
 *  1 CARD_GLOSS_ASK     a spoken language lesson at the beginner level (or the level not known yet): the facts ask for gloss="…" on
 *                        question cards and rule notes; intermediate / advanced, a maths lesson, a typed lesson: no line; the
 *                        session part is unchanged everywhere (no new section, no tool field)
 *  2 CARD_GLOSS_SHOW    the gloss rides on the card (show_problem / annotate `gloss`) and is drawn under it in the sentence card's
 *                        small grey style; dropped above the beginner level and in every other lesson
 *  3 (no switch)        the gloss is never heard, never the card's ask, never in the board record the model reads
 *  4 CARD_GLOSS_REMIND  a question card the last reply put up without a gloss: the facts say so once
 *  each switch off alone (a child process per switch): the behaviour at the base commit for that item.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { TUTOR_V2_CARD_GLOSS_ASK, TUTOR_V2_CARD_GLOSS_SHOW, TUTOR_V2_CARD_GLOSS_REMIND } from '../src/lib/tutor/orchestrator/flags';
import { v2CardGlossOn, v2CleanGloss, v2GlossLevelOn, v2LastQuestionUnglossed } from '../src/lib/tutor/v2/card-gloss';
import { boardBlocksIn, inlineToolCall } from '../src/lib/tutor/v2/board-inline';
import { runV2Turn, type V2ModelCall } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2BoardPage, type V2Session, type V2State } from '../src/lib/tutor/v2/types';
import { mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';
import { CardGloss } from '../src/app/tutor/components/whiteboard/CardGloss';

let passed = 0; let failed = 0;
const CHILD = process.env.GLOSS_7P_CHILD;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};
const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } as Anthropic.Usage;
const msg = (content: unknown[], stop: string): Anthropic.Message => ({ id: 'm', type: 'message', role: 'assistant', model: 'x', content, stop_reason: stop, stop_sequence: null, usage } as unknown as Anthropic.Message);
type Step = { text: string; after?: unknown[] };
function scripted(steps: Step[]) {
  const facts: string[] = []; const systems: string[] = []; const tools: string[] = []; let i = 0;
  const call: V2ModelCall = async (params, onText) => {
    systems.push(JSON.stringify(params.system)); tools.push(JSON.stringify(params.tools ?? []));
    const last = params.messages[params.messages.length - 1];
    if (Array.isArray(last?.content)) for (const b of last.content as Array<{ type: string; text?: string }>) if (b.type === 'text' && b.text?.startsWith('<facts>')) facts.push(b.text);
    const s = steps[Math.min(i, steps.length - 1)]!; i += 1;
    if (onText) for (const piece of s.text.match(/[\s\S]{1,17}/g) ?? []) onText(piece);
    return msg([...(s.text ? [{ type: 'text', text: s.text }] : []), ...(s.after ?? [])], s.after?.length ? 'tool_use' : 'end_turn');
  };
  return { call, facts, systems, tools };
}

const repoRoot = join(__dirname, '..', '..', '..');
const GDI = parseLessonPlan(JSON.parse(readFileSync(join(repoRoot, 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8'))) as LessonPlan;
const lang: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 20, wrapMinutes: 18, languages: ['en', 'ja'], levelCheck: true, plan: GDI };
const typed: V2Session = { ...lang, mode: 'text' };
const maths: V2Session = { studentName: 'Sam', subject: 'Math', level: 'Grade 8', mode: 'voice' };
const MIN = 60000;
const u = (content: string) => ({ role: 'user' as const, content });
const a = (content: string) => ({ role: 'assistant' as const, content });
const TODAY: V2BoardPage = { title: 'Today\'s lesson', items: [{ id: 't1', tool: 'annotate', summary: 'present perfect / past simple' }] };
const PS: V2BoardPage = { title: 'Past simple', items: [{ id: 's1', tool: 'show_sentence', summary: 'I attended a robotics exhibition in Beijing two months ago.' }] };
const goalsAt = { overview: { status: 'shown' as const, at: 0 }, 'level-check': { status: 'demonstrated' as const, at: 0 }, 'topic-intro': { status: 'shown' as const, at: 0 }, 'present-perfect': { status: 'demonstrated' as const, at: 0 } };
type Level = 'beginner' | 'intermediate' | 'advanced' | null;
const at = (level: Level, extra: Partial<V2State> = {}): V2State => ({ ...newV2State(0), ...(level ? { workingLevel: { level, from: 'this_lesson' as const } } : {}), board: { pages: structuredClone([TODAY, PS]), current: 1 }, goals: goalsAt, timeFit: { dropped: [], byArrival: true }, practiceSaid: { 'topic-intro': 3, 'present-perfect': 3, 'past-simple': 2 }, history: [u('x'), a('Good. Next, the past simple.')], ...extra });
const run = (session: V2Session, st: V2State, said: string | null, steps: Step[], nowMin: number) => {
  const heard: string[] = []; const m = scripted(steps);
  return runV2Turn({ session, state: st, studentSaid: said, callModel: m.call, onText: (d) => heard.push(d), boardPass: false, mathsCheck: false, nowMs: nowMin * MIN })
    .then((r) => ({ r, heard: heard.join(''), facts: m.facts.join('\n'), system: m.systems[0] ?? '', tools: m.tools[0] ?? '' }));
};

// ── The session's texts (task-7m-investigation.md E 14.91 / 14.93, B 5.45) ──
const E_SAID = 'One more practice past simple.';
const E_REPLY = 'わかりました。もう一問、過去形の練習をしましょう。 <board problem difficulty="easy">Question: What did you do last week at work? Answer with one sentence, using the past simple, with a time word such as last week or yesterday.</board> まず、一文で答えてみてください。Try starting with: "I visited…" or "I met…"';
const E_GLOSS = '先週、仕事で何をしましたか？';
// The same reply as the facts now ask for it: the card carries its gloss.
const E_REPLY_GLOSSED = E_REPLY.replace('<board problem difficulty="easy">', `<board problem difficulty="easy" gloss="${E_GLOSS}">`);
const B_NOTE = 'For a period of time, use for + the number of years: for six years.';
const B_GLOSS = '期間は「for + 年数」で言います。';
const noteReply = (gloss: string | null) => `ここがポイントです。 <board note style="highlight"${gloss ? ` gloss="${gloss}"` : ''}>${B_NOTE}</board> では、もう一度言ってみてください。`;

async function probe() {
  const glossLine = (r: { facts: string }) => r.facts.split('\n').find((l) => /\bgloss=/.test(l)) ?? null;
  const remindLine = (r: { facts: string }) => r.facts.split('\n').find((l) => /no gloss/.test(l)) ?? null;
  // 1: the facts by level, and in other lessons.
  const beg = await run(lang, at('beginner'), E_SAID, [{ text: E_REPLY_GLOSSED }], 14.93);
  const unknown = await run(lang, at(null, { history: [], goals: {} }), 'Hello.', [{ text: E_REPLY_GLOSSED }], 1);
  // A level check that ended without a level: the facts pitch at intermediate, and so does the gloss rule.
  const over = await run(lang, at(null, { history: Array.from({ length: 7 }, (_, i) => [u(`answer ${i}`), a('Okay.')]).flat() }), 'Sure.', [{ text: 'Good.' }], 6);
  const inter = await run(lang, at('intermediate'), E_SAID, [{ text: E_REPLY_GLOSSED }], 14.93);
  const adv = await run(lang, at('advanced'), E_SAID, [{ text: E_REPLY_GLOSSED }], 14.93);
  const typedRun = await run(typed, at('beginner'), E_SAID, [{ text: E_REPLY_GLOSSED }], 14.93);
  const mathsRun = await run(maths, newV2State(0), 'ok', [{ text: 'Try this. <board problem gloss="x">Solve $2x = 6$.</board>' }], 3);
  // 2: the note, glossed and not.
  const note = await run(lang, at('beginner'), 'I have worked Nagoya Corporation 6 years.', [{ text: noteReply(B_GLOSS) }], 5.45);
  const notePlain = await run(lang, at('beginner'), 'I have worked Nagoya Corporation 6 years.', [{ text: noteReply(null) }], 5.45);
  const noteInter = await run(lang, at('intermediate'), 'I have worked Nagoya Corporation 6 years.', [{ text: noteReply(B_GLOSS) }], 5.45);
  // The level set in this very reply (set_working_level, then the card): the card follows the level at that turn.
  const setNow = await run(lang, at(null, { history: Array.from({ length: 3 }, (_, i) => [u(`I work in sales number ${i}.`), a('Okay.')]).flat(), goals: {} }), 'I sell washing machines to customers.', [{ text: '', after: [{ type: 'tool_use', id: 'lv', name: 'set_working_level', input: { level: 'intermediate', evidence: 'full sentences' } }] }, { text: E_REPLY_GLOSSED }], 3.0);
  // 3: the 14.93 reply as it was (no gloss) beside the glossed one: heard the same.
  const ePlain = await run(lang, at('beginner'), E_SAID, [{ text: E_REPLY }], 14.93);
  // 4: the turn after the 14.93 reply (its card had no gloss), and after a glossed one.
  const after = await run(lang, at('beginner', { history: [u(E_SAID), a(E_REPLY)] }), 'I visited a customer last week.', [{ text: 'Good.' }], 15.2);
  const afterGlossed = await run(lang, at('beginner', { history: [u(E_SAID), a(E_REPLY_GLOSSED)] }), 'I visited a customer last week.', [{ text: 'Good.' }], 15.2);
  const afterInter = await run(lang, at('intermediate', { history: [u(E_SAID), a(E_REPLY)] }), 'I visited a customer last week.', [{ text: 'Good.' }], 15.2);
  const prob = (r: Awaited<ReturnType<typeof run>>) => r.r.toolCalls.find((c) => c.name === 'show_problem')?.args ?? null;
  const ann = (r: Awaited<ReturnType<typeof run>>) => r.r.toolCalls.find((c) => c.name === 'annotate')?.args ?? null;
  const summaries = (r: Awaited<ReturnType<typeof run>>) => r.r.state.board.pages.flatMap((pg) => pg.items.map((it) => it.summary)).join(' | ');
  return {
    begLine: glossLine(beg), unknownLine: glossLine(unknown), overLine: glossLine(over), interLine: glossLine(inter), advLine: glossLine(adv), typedLine: glossLine(typedRun), mathsLine: glossLine(mathsRun),
    begSystem: beg.system, interSystem: inter.system, begTools: beg.tools, mathsFacts: mathsRun.facts,
    begProblem: prob(beg), unknownProblem: prob(unknown), interProblem: prob(inter), typedProblem: prob(typedRun), mathsProblem: prob(mathsRun), setNowProblem: prob(setNow), setNowLevel: setNow.r.state.workingLevel?.level ?? null,
    noteArgs: ann(note), noteInterArgs: ann(noteInter),
    eHeard: beg.heard, ePlainHeard: ePlain.heard, noteHeard: note.heard, notePlainHeard: notePlain.heard,
    boardSummaries: summaries(beg) + ' | ' + summaries(note), spoken: beg.r.spoken,
    remind: remindLine(after), remindGlossed: remindLine(afterGlossed), remindInter: remindLine(afterInter),
  };
}

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

async function main() {
  if (CHILD) { console.log(`OFF_JSON ${JSON.stringify(await probe())}`); return; }
  const on = await probe();

  console.log('the switches: each on by default');
  check('CARD_GLOSS_ASK, CARD_GLOSS_SHOW, CARD_GLOSS_REMIND default on', TUTOR_V2_CARD_GLOSS_ASK && TUTOR_V2_CARD_GLOSS_SHOW && TUTOR_V2_CARD_GLOSS_REMIND);

  console.log('the gate: spoken lessons taught through the learner\'s language; beginner (or not known yet)');
  check('v2CardGlossOn: the spoken language lesson yes; typed, maths, one language, homework, discussion no', v2CardGlossOn(lang) && !v2CardGlossOn(typed) && !v2CardGlossOn(maths) && !v2CardGlossOn({ ...lang, languages: ['en'] }) && !v2CardGlossOn({ ...lang, languages: ['en', 'en-US'] }) && !v2CardGlossOn({ ...lang, homework: { problem: 'x' } as unknown as V2Session['homework'] }));
  check('v2GlossLevelOn: beginner yes, not known yes, intermediate / advanced no', v2GlossLevelOn(lang, at('beginner'), null) && v2GlossLevelOn(lang, at(null, { history: [], goals: {} }), null) && !v2GlossLevelOn(lang, at('intermediate'), null) && !v2GlossLevelOn(lang, at('advanced'), null));

  console.log('1  the facts ask for the gloss at the beginner level only');
  check('beginner: the facts ask for gloss="…" on the question card and the rule note, in Japanese, one short line', !!on.begLine && /<board problem gloss=/.test(on.begLine) && /<board note gloss=/.test(on.begLine) && /Japanese/.test(on.begLine) && /40 characters/.test(on.begLine) && /never said aloud|never say/i.test(on.begLine), on.begLine);
  check('level not known yet (the opening): asked too, and a card then keeps its gloss', !!on.unknownLine && on.unknownProblem?.gloss === E_GLOSS, [on.unknownLine, on.unknownProblem]);
  check('a level check over without a level (pitched at intermediate): not asked', on.overLine === null, on.overLine);
  check('intermediate and advanced: not asked', on.interLine === null && on.advLine === null, [on.interLine, on.advLine]);
  check('a typed language lesson and a maths voice lesson: not asked', on.typedLine === null && on.mathsLine === null && !/gloss/.test(on.mathsFacts));
  check('the session part is the same at every level (no new section), and no tool carries a gloss field', on.begSystem === on.interSystem && !/gloss="the question/.test(on.begSystem) && !/"gloss"/.test(on.begTools), on.begTools.slice(0, 300));

  console.log('2  the gloss rides on the card and is drawn under it');
  check('the 14.93 card, glossed: show_problem carries the gloss; title "Question", statement without it', on.begProblem?.gloss === E_GLOSS && on.begProblem?.title === 'Question' && String(on.begProblem?.statement).startsWith('What did you do last week at work?') && !String(on.begProblem?.statement).includes(E_GLOSS), on.begProblem);
  check('the rule note, glossed: annotate carries the gloss beside its 7o marker; text unchanged', on.noteArgs?.gloss === B_GLOSS && on.noteArgs?.targets === true && on.noteArgs?.text === B_NOTE, on.noteArgs);
  check('intermediate: a gloss the model wrote anyway is dropped (card and note)', on.interProblem !== null && on.interProblem.gloss === undefined && on.noteInterArgs !== null && on.noteInterArgs.gloss === undefined, [on.interProblem, on.noteInterArgs]);
  check('the level set to intermediate in this very reply: the card after it carries no gloss', on.setNowLevel === 'intermediate' && on.setNowProblem !== null && on.setNowProblem.gloss === undefined, [on.setNowLevel, on.setNowProblem]);
  check('a typed language lesson and a maths lesson: dropped', on.typedProblem !== null && on.typedProblem.gloss === undefined && on.mathsProblem !== null && on.mathsProblem.gloss === undefined, [on.typedProblem, on.mathsProblem]);
  check('v2CleanGloss: one line, spaces closed; empty or over 100 characters dropped', v2CleanGloss(`  ${E_GLOSS}\nmore `) === E_GLOSS && v2CleanGloss('  ') === null && v2CleanGloss('x'.repeat(101)) === null && v2CleanGloss(7) === null);
  {
    const [p] = boardBlocksIn(`<board problem gloss="${E_GLOSS}">What did you do last week at work?</board>`);
    check('inlineToolCall: a problem block\'s gloss attribute becomes the call\'s gloss', inlineToolCall(p!).args.gloss === E_GLOSS);
    const cmd = mapFunctionCallToCommand('show_problem', { title: 'Question', statement: 'What did you do?', rich: true, gloss: E_GLOSS }) as unknown as { problem: Record<string, unknown> };
    const plainCmd = mapFunctionCallToCommand('show_problem', { title: 'Question', statement: 'What did you do?', rich: true }) as unknown as { problem: Record<string, unknown> };
    check('the problem command carries the gloss; without one its keys are as before', cmd.problem.gloss === E_GLOSS && !('gloss' in plainCmd.problem) && JSON.stringify(Object.keys(plainCmd.problem)) === '["title","statement","format","answerChoices","sourceTag","difficultyLabel","givenValues","rich"]', [cmd, plainCmd]);
    const nCmd = mapFunctionCallToCommand('annotate', { text: B_NOTE, style: 'highlight', rich: true, targets: true, gloss: B_GLOSS }) as unknown as Record<string, unknown>;
    const nPlain = mapFunctionCallToCommand('annotate', { text: 'x', style: 'highlight', rich: true }) as unknown as Record<string, unknown>;
    check('the note command carries the gloss; without one its keys are as before', nCmd.gloss === B_GLOSS && nCmd.targets === true && JSON.stringify(Object.keys(nPlain)) === '["action","text","style","rich"]', [nCmd, nPlain]);
    const g = html(<CardGloss text={E_GLOSS} />);
    check('CardGloss draws the line in the sentence card\'s gloss style (small, grey, under the text)', g === `<p class="text-sm text-gray-500 mt-1 break-words" data-feature="gloss">${E_GLOSS}</p>`, g);
    const canvas = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'whiteboard', 'WhiteboardCanvas.tsx'), 'utf8');
    const noteAt = canvas.indexOf("case 'annotate': {"); const probAt = canvas.indexOf("case 'showProblem': {");
    check('WhiteboardCanvas draws the gloss under a note and under a problem\'s statement (title untouched)', /<CardGloss /.test(canvas.slice(noteAt, noteAt + 3600)) && /data-feature="statement"[\s\S]{0,900}<CardGloss /.test(canvas.slice(probAt, probAt + 5000)));
    const sentenceCard = canvas.slice(canvas.indexOf('function SentenceCard'), canvas.indexOf('function SentenceCard') + 1600);
    check('… the same classes as the sentence card\'s gloss', sentenceCard.includes('<p className="text-sm text-gray-500 mt-1 break-words">{gloss}</p>'));
  }

  console.log('3  the gloss is never heard, never the ask, never in the board record');
  check('the 14.93 reply with a glossed card is heard exactly as without the gloss (the question once, no Japanese line added)', on.eHeard === on.ePlainHeard && !on.eHeard.includes(E_GLOSS) && (on.eHeard.match(/What did you do last week at work\?/g) ?? []).length === 1, [on.eHeard, on.ePlainHeard]);
  check('the glossed note is heard exactly as the plain one', on.noteHeard === on.notePlainHeard && !on.noteHeard.includes(B_GLOSS), [on.noteHeard, on.notePlainHeard]);
  check('the turn\'s spoken text (the transcript) has no gloss', !on.spoken.includes(E_GLOSS));
  check('the board record the model and the duplicate checks read holds no gloss', !on.boardSummaries.includes(E_GLOSS) && !on.boardSummaries.includes(B_GLOSS), on.boardSummaries);

  console.log('4  a question card left without a gloss: the next facts say so, once');
  check('after the 14.93 reply (no gloss), at the beginner level: reminded', !!on.remind && /question card/.test(on.remind), on.remind);
  check('after a glossed card: no reminder; at intermediate: none', on.remindGlossed === null && on.remindInter === null, [on.remindGlossed, on.remindInter]);
  check('v2LastQuestionUnglossed reads the last reply only', v2LastQuestionUnglossed([u(E_SAID), a(E_REPLY)]) && !v2LastQuestionUnglossed([u(E_SAID), a(E_REPLY), u('x'), a('Good.')]) && !v2LastQuestionUnglossed([a(E_REPLY_GLOSSED)]));

  console.log('5  each flag off alone (a child process per switch): as at the base commit for that item, the others on');
  const child = (flag: string) => {
    const res = spawnSync(process.execPath, [...process.execArgv, __filename], { env: { ...process.env, [`NEXT_PUBLIC_TUTOR_V2_${flag}`]: 'off', GLOSS_7P_CHILD: '1' }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const line = (res.stdout ?? '').split('\n').find((l) => l.startsWith('OFF_JSON '));
    return line ? JSON.parse(line.slice('OFF_JSON '.length)) as typeof on : ({ error: res.stderr } as unknown as typeof on);
  };
  {
    const off = child('CARD_GLOSS_ASK');
    check('CARD_GLOSS_ASK off: no gloss line and no reminder in the facts (as before)', off.begLine === null && off.unknownLine === null && off.remind === null, off);
    check('… the card still carries a gloss the model wrote (SHOW on)', off.begProblem?.gloss === E_GLOSS);
  }
  {
    const off = child('CARD_GLOSS_SHOW');
    check('CARD_GLOSS_SHOW off: no gloss on the card or the note (as before)', off.begProblem !== null && off.begProblem.gloss === undefined && off.noteArgs !== null && off.noteArgs.gloss === undefined, [off.begProblem, off.noteArgs]);
    check('… heard the same; the facts as on', off.eHeard === on.eHeard && off.begLine === on.begLine);
  }
  {
    const off = child('CARD_GLOSS_REMIND');
    check('CARD_GLOSS_REMIND off: no reminder (as before)', off.remind === null, off.remind);
    check('… the other items as on', off.begLine === on.begLine && off.begProblem?.gloss === E_GLOSS);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
