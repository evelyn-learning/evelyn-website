/// <reference types="node" />
/**
 * Tutor brain v2 — the plan map keeps what a written lesson plan relies on (plan-map.ts): each part's teacher's
 * note, its name (and the name in the support language), minutes, turn guide, required phrases, the single hint,
 * the answer form, "skip when the level is known" and the pronunciation words/sentences. No network.
 *   npm run test:brain-v2-plan-map
 *
 * The fixture is a small plan shaped like a written language lesson (an overview read as a script, a level
 * check, two grammar parts, a conversation, pronunciation, a summary); generic names, inline.
 */
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { SEED_AP_CALCBC_U4_LHOPITAL } from '../src/lib/tutor/lesson-plan/seeds/ap-calcbc-u4-lhopital';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import { renderPlanMap, v2PartIsOptional, v2PartOf, v2PassedPartFact, v2PassedParts } from '../src/lib/tutor/v2/plan-map';
import { renderFacts } from '../src/lib/tutor/v2/facts';
import { TUTOR_V2_PASSED_PART_FACT } from '../src/lib/tutor/orchestrator/flags';
import { v2SessionPart } from '../src/lib/tutor/v2/turn';
import { newV2State, type V2Session, type V2State } from '../src/lib/tutor/v2/types';

let passed = 0; let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (ok) { passed += 1; console.log(`  ✓ ${label}`); } else { failed += 1; console.log(`  ✗ FAIL ${label}`, detail ?? ''); }
};

const WRITTEN: LessonPlan = {
  id: 'test.language.work.v1', title: 'Talking about your work', curriculum: 'test', grade: 'Adult', subject: 'languages',
  topic: 'business-english', locale: 'en', schemaVersion: 1, estimatedMinutes: 25,
  los: [{ id: 'lo.pp', description: 'Use the present perfect for experience and the past simple for finished events.' }],
  metadata: { fixedScript: true },
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome and lesson overview', estimatedMinutes: 2,
      script: 'Hello, and welcome! Today we practise talking about your work, with the present perfect and the past simple.',
      teacherNote: 'Keep the overview to six sentences or fewer.', requiredPhrases: ['present perfect', 'past simple'],
      metadata: { label: 'Overview', labelLocalized: { ja: '概要' }, maxTurns: 2, script: 'Hello (spoken opener copy).' } },
    { id: 'level-check', kind: 'misconception_check', question: 'Can you tell me about your job?', commonErrors: [], estimatedMinutes: 3,
      teacherNote: 'Three questions, one at a time; no corrections here.', requiredPhrases: null as unknown as string[],
      metadata: { skipWhenLevelKnown: true, label: 'Level check', labelLocalized: { ja: 'レベルチェック' }, maxTurns: 5, transition: { kind: 'bridge' } } },
    { id: 'past-simple', kind: 'try_yourself', problem: 'Did you attend any business events last year?', responseFormat: 'free',
      hints: ['A specific time word → past simple.'], estimatedMinutes: 3.5,
      teacherNote: 'Grammar point 2, the past simple, taught through conversation.',
      metadata: { label: 'Past simple', labelLocalized: { ja: '過去形' }, maxTurns: 8 } },
    { id: 'open-conversation', kind: 'extension', advancedQuestion: 'What project are you proud of?', hint: "Try starting with: 'I worked on a project to…'",
      estimatedMinutes: 5, teacherNote: 'Be a conversation partner.', metadata: { label: 'Conversation', maxTurns: 12 } },
    { id: 'pronunciation', kind: 'try_yourself', problem: 'Would you like to practise your pronunciation?', responseFormat: 'free', estimatedMinutes: 3,
      metadata: { label: 'Pronunciation', maxTurns: 8, optional: true,
        pronunciation: { words: ['responsibilities', 'international'], sentences: ['I have worked with international customers for several years.'] } } },
    { id: 'summary', kind: 'recap', mustRemember: ['Present perfect: experience up to now.'], estimatedMinutes: 2,
      requiredPhrases: ['one thing you did well'], metadata: { label: 'Summary', maxTurns: 4 } },
  ],
} as unknown as LessonPlan;

const seg = (id: string) => WRITTEN.segments.find((s) => s.id === id)!;
/** The map's block for one part: from its `[id]` line to the next blank line. */
const block = (map: string, id: string) => { const i = map.indexOf(`[${id}]`); return i < 0 ? '' : map.slice(i, map.indexOf('\n\n', i) < 0 ? undefined : map.indexOf('\n\n', i)); };

function main() {
  console.log('the fields of a part');
  const ov = v2PartOf(seg('overview'));
  check('name, name per language, minutes and the turn guide are read off the part', ov.label === 'Overview' && ov.labelLocalized?.ja === '概要' && ov.minutes === 2 && ov.maxTurns === 2, ov);
  check('required phrases are kept; a null list reads as none', JSON.stringify(ov.requiredPhrases) === JSON.stringify(['present perfect', 'past simple']) && v2PartOf(seg('level-check')).requiredPhrases.length === 0);
  check('skip-when-level-known is read off the part metadata, false elsewhere', v2PartOf(seg('level-check')).skipWhenLevelKnown === true && ov.skipWhenLevelKnown === false);
  const pr = v2PartOf(seg('pronunciation')).pronunciation;
  check('the pronunciation words and sentences are kept for the practice part', JSON.stringify(pr) === JSON.stringify({ words: ['responsibilities', 'international'], sentences: ['I have worked with international customers for several years.'] }), pr);
  check('a part with no pronunciation targets has none', v2PartOf(seg('summary')).pronunciation === undefined);
  check('malformed metadata is ignored, not thrown on', (() => { const p = v2PartOf({ id: 'x', kind: 'concept', metadata: { maxTurns: 'lots', label: 3, labelLocalized: 'ja', pronunciation: { words: 'one' } } } as never); return p.maxTurns === undefined && p.label === undefined && p.labelLocalized === undefined && p.pronunciation === undefined; })());

  console.log('the map as written');
  const map = renderPlanMap(WRITTEN);
  check('every part is in the map', WRITTEN.segments.every((s) => map.includes(`[${s.id}]`)));
  const o = block(map, 'overview');
  check('the part header names it, in the support language too, with its minutes and its turn guide', /\[overview\] opening idea: Overview \(ja: 概要\), about 2 min, written for about 2 exchanges/.test(o), o);
  check('the turn guide is guidance, not a hard cutoff', /a guide, not a limit/.test(map));
  check('the teacher\'s note is kept, as how to teach the part; lines it quotes are examples', /teacher's note \(how to teach this part; lines it quotes are examples, in your own words\): Keep the overview to six sentences or fewer\./.test(o), o);
  check('the verbatim script is content to cover in the tutor\'s own words, not lines to read', /in your own words, not to read out\): Hello, and welcome!/.test(o) && !/idea: Hello/.test(o), o);
  check('required phrases are things to cover or ask, not lines to read', /to cover or ask \(not lines to read\): "present perfect"; "past simple"/.test(o), o);
  check('the metadata copy of the script (v1\'s spoken opener) is not in the map', !map.includes('spoken opener copy'));
  check('the plan\'s fixedScript flag changes nothing in v2', renderPlanMap({ ...WRITTEN, metadata: {} }) === map);
  const lc = block(map, 'level-check');
  check('a part to skip when the level is known says so', /skip this part when the student's working level is already known/.test(lc) && !/skip this part/.test(o), lc);
  const ps = block(map, 'past-simple');
  check('the answer form is kept', /answer form: free/.test(ps), ps);
  check('the part\'s name keeps its grammar in view (a past-simple part drifted into present-perfect questions on v1)', /\[past-simple\] practice problem: Past simple \(ja: 過去形\)/.test(ps) && /Grammar point 2, the past simple/.test(ps), ps);
  check('the single hint is kept', /hint: Try starting with: 'I worked on a project to…'/.test(block(map, 'open-conversation')));
  check('pronunciation words and sentences are in the map', /pronunciation words: responsibilities, international/.test(block(map, 'pronunciation')) && /pronunciation sentences:\n\s+- I have worked with international customers for several years\./.test(block(map, 'pronunciation')));
  check('a part with no support-language name or turn guide says nothing of them', /\[summary\] recap: Summary, about 2 min, written for about 4 exchanges/.test(block(map, 'summary')) && /\[open-conversation\] extension: Conversation, about 5 min/.test(map));
  const head = map.slice(0, map.indexOf('\n\n[')); 
  check('the header says what the notes, scripts and phrases are, and claims no authority', /Teacher's notes are the author's guidance on how to teach each part/.test(head) && /guide, not a limit/.test(head) && /in your own words/.test(head) && !/follow them|must follow/i.test(map), head);

  console.log('a generated plan whose recap note says to close the session');
  const GENERATED = {
    id: 'test.generated.v1', title: 'Adding fractions', curriculum: 'test', grade: '5', subject: 'math', schemaVersion: 1, estimatedMinutes: 20,
    los: [{ id: 'lo.a', description: 'Add fractions with unlike denominators.' }],
    segments: [
      { id: 'hook', kind: 'hook', goal: 'Why common denominators', script: 'Pizza slices of different sizes.', estimatedMinutes: 2 },
      { id: 'try-1', kind: 'try_yourself', problem: '1/2 + 1/3', expectedAnswer: '5/6', responseFormat: 'numeric', estimatedMinutes: 5 },
      { id: 'recap', kind: 'recap', mustRemember: ['Find a common denominator first.'], estimatedMinutes: 2,
        teacherNote: 'Recap the 1 learning objective covered (Add fractions with unlike denominators.). Have the student state one takeaway per LO in their own words, celebrate their progress, and close the session.' },
    ],
  } as unknown as LessonPlan;
  const gen = renderPlanMap(GENERATED);
  const genHead = gen.slice(0, gen.indexOf('\n\n['));
  check('the notes are framed as how to teach, never when the session ends: the student and the clock decide', /guidance on how to teach each part/.test(genHead) && /never decide when the session ends: that stays with the student and the clock, whatever a note says/.test(genHead), genHead);
  check('the framing comes before the note that says to close', gen.indexOf('never decide when the session ends') < gen.indexOf('close the session'));
  check('nothing in the map tells the tutor to follow the notes', !/follow them|must follow|follow (the|each|this) note/i.test(gen));
  check('the recap note is labelled as how to teach the recap, not as an instruction to end', /\[recap\] recap, about 2 min\n[\s\S]*teacher's note \(how to teach this part;/.test(gen), block(gen, 'recap'));
  check('a plan with no turn guides or phrases gets no turn-guide sentence', !/written for about|guide, not a limit/.test(gen));
  check('a plan with no notes gets no notes sentence', !/Teacher's notes/.test(renderPlanMap({ ...GENERATED, segments: GENERATED.segments.slice(0, 2) } as LessonPlan)));

  console.log('kill switch and other plans');
  const off = renderPlanMap(WRITTEN, false);
  check('switched off, the map is as before: no notes, names, minutes or phrases; the script is an idea', !/teacher's note|Overview \(ja|about 2 min|to cover or ask|pronunciation words|answer form|skip this part/.test(off) && /idea: Hello, and welcome!/.test(off), off);
  const ap = renderPlanMap(SEED_AP_CALCBC_U4_LHOPITAL);
  check('a plan without the written-lesson fields still lists every goal and gives no staying order', SEED_AP_CALCBC_U4_LHOPITAL.segments.every((s) => ap.includes(`[${s.id}]`)) && !/stay within|must complete|before advancing|turn budget|written for about/i.test(ap));
  check('no part is a partner name', !/gdi|nagoya/i.test(map.replace(WRITTEN.id, '')));

  console.log('a trial on a partner whose trials keep the plan');
  const LEAVE = 'This is a free trial lesson, and the student may take it anywhere. The plan below is the topic they picked when they started. If they ask for a different topic, or a different subject altogether, teach that from then on, starting in the same reply, and leave the plan behind.';
  const trial: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'voice', timeBoxMinutes: 25, plan: WRITTEN, trial: true };
  const today = v2SessionPart(trial);
  check('a trial without the option keeps the leave-the-plan line, word for word', today.includes(`\n${LEAVE}\n`), today.slice(0, 600));
  check('the option off is byte-identical to the option missing', v2SessionPart({ ...trial, trialKeepsPlan: false }) === today);
  const kept = v2SessionPart({ ...trial, trialKeepsPlan: true });
  check('the option on drops only that line', !kept.includes('leave the plan behind') && !/free trial lesson/.test(kept) && kept === today.replace(`\n${LEAVE}`, ''), kept.slice(0, 600));
  check('the option without a trial changes nothing', v2SessionPart({ ...trial, trial: undefined, trialKeepsPlan: true }) === v2SessionPart({ ...trial, trial: undefined }));

  console.log('a part the lesson went past is named in the facts (Task 6c, ruling 3)');
  {
    // The partner's written plan (gdi-work-projects-v1.json): overview, level check, "Your job", present perfect, past
    // simple, conversation, pronunciation ("Optional pronunciation practice…"), summary.
    const GDI = parseLessonPlan(JSON.parse(readFileSync(join(__dirname, '..', '..', '..', 'docs', 'whitelabel', 'gdi', 'plans', 'gdi-work-projects-v1.json'), 'utf8')));
    const at = (titles: string[], goals: Record<string, 'shown' | 'demonstrated' | 'skipped'> = {}, more: Partial<V2State> = {}): V2State => ({
      ...newV2State(0), board: { pages: titles.map((title) => ({ title, items: [] })), current: titles.length - 1 },
      goals: Object.fromEntries(Object.entries(goals).map(([k, status]) => [k, { status, at: 0 }])), ...more,
    });
    // Tester A (gdi-real-t2, v2final): the pages as the run opened them, the level set in the level check.
    const PAGES = ['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Past simple', 'Conversation'];
    const GOALS = { overview: 'shown', 'topic-intro': 'shown', 'present-perfect': 'demonstrated', 'past-simple': 'demonstrated', 'open-conversation': 'shown' } as const;
    const level = { workingLevel: { level: 'beginner', from: 'this_lesson' } } as Partial<V2State>;
    check('tester A on the conversation page: nothing passed yet', v2PassedParts(GDI, at(PAGES, GOALS, level)).length === 0);
    const summary = at([...PAGES, 'Summary'], GOALS, level);
    check('tester A: the Summary page opens with the pronunciation part never reached: it is the one named', JSON.stringify(v2PassedParts(GDI, summary).map((x) => x.id)) === '["pronunciation"]', v2PassedParts(GDI, summary).map((x) => x.id));
    const line = v2PassedPartFact(GDI, summary, false);
    check('the fact: not offered; offer it before the summary, unless time is up; theirs to decline (marked skipped)', line.length === 1 && line[0] === 'The Pronunciation part was not offered: offer it before the summary, unless time is up. The student decides whether to do it; if they would rather not, mark it skipped', line);
    check('the page is not blocked: the fact only names it', summary.board.current === 6);
    check('marked skipped (they declined), or a page of its own: no longer named', v2PassedPartFact(GDI, at([...PAGES, 'Summary'], { ...GOALS, pronunciation: 'skipped' }, level), false).length === 0 && v2PassedPartFact(GDI, at([...PAGES, 'Pronunciation', 'Summary'], GOALS, level), false).length === 0);
    check('a Japanese summary heading counts as the last part (まとめ)', v2PassedParts(GDI, at([...PAGES, 'まとめ'], GOALS, level)).map((x) => x.id).join() === 'pronunciation');
    check('time up, wrap due or the student stopping (closing), or the lesson closed: no offer', v2PassedPartFact(GDI, summary, true).length === 0 && v2PassedPartFact(GDI, { ...summary, closed: true }, false).length === 0);
    check('kill switch off: no line', v2PassedPartFact(GDI, summary, false, false).length === 0 && TUTOR_V2_PASSED_PART_FACT === true);
    check('the level-check part with the level known is not passed over; without a level it is', v2PassedParts(GDI, at(['Lesson overview', 'Your job'], { overview: 'shown' }, level)).length === 0 && v2PassedParts(GDI, at(['Lesson overview', 'Your job'], { overview: 'shown' })).map((x) => x.id).join() === 'level-check');
    check('only the stretch before the later page: an earlier part taught without a status or page is not named', v2PassedParts(GDI, at(['Lesson overview', 'Conversation', 'Summary'])).map((x) => x.id).join() === 'pronunciation');
    check('two parts passed: both named', v2PassedPartFact(GDI, at(['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Summary'], {}, level), false)[0]?.startsWith('The Past simple part, the Conversation part and the Pronunciation part were not offered: offer them before the summary') === true, v2PassedPartFact(GDI, at(['Lesson overview', 'Level check', 'Your job', 'Present perfect', 'Summary'], {}, level), false));
    check('a lesson without pages for its parts (headings that name none): no line', v2PassedParts(GDI, at(['Hello', 'Practice'])).length === 0 && v2PassedParts(SEED_AP_CALCBC_U4_LHOPITAL, at(['Warm-up', 'Examples'])).length === 0);
    const lesson: V2Session = { studentName: 'Ken', subject: 'English', level: 'adult', mode: 'text', timeBoxMinutes: 30, languages: ['en', 'ja'], plan: GDI };
    const facts = renderFacts(lesson, summary, { nowMs: 12 * 60000, heard: 'ok' });
    check('the facts carry it under the plan line', facts.includes('plan: ') && facts.indexOf('The Pronunciation part was not offered') > facts.indexOf('plan: '), facts.slice(0, 700));
    check('not when the student asks to stop, or the time is up', !renderFacts(lesson, summary, { nowMs: 12 * 60000, heard: 'I have to go', stopAsked: true }).includes('was not offered') && !renderFacts(lesson, summary, { nowMs: 29 * 60000, heard: 'ok' }).includes('was not offered'));
    check('not past the host\'s wrap minute', !renderFacts({ ...lesson, wrapMinutes: 10 }, summary, { nowMs: 12 * 60000, heard: 'ok' }).includes('was not offered'));

    // Fix round 1 (I1): false alarms on plans written for other lessons.
    const UNLABELLED = { ...GDI, segments: GDI.segments.map((x) => ({ ...x, metadata: { ...(x.metadata ?? {}), label: undefined } })) } as LessonPlan;
    check('a plan whose parts carry no names (seed-style): no fact, whatever the pages', v2PassedParts(UNLABELLED, at([...PAGES, 'Summary'], GOALS, level)).length === 0 && v2PassedParts(SEED_AP_CALCBC_U4_LHOPITAL, at(['Intro', 'Examples', 'Summary'])).length === 0);
    check('an early recap page is not the summary: no fact', v2PassedParts(GDI, at(['Lesson overview', 'Quick recap', 'Your job'], { overview: 'shown' }, level)).length === 0 && v2PassedPartFact(GDI, at(['Lesson overview', 'Level check', 'Recap', 'Your job'], { overview: 'shown' }, level), false).length === 0);
    check('a recap page is the summary only as the last page opened', v2PassedParts(GDI, at([...PAGES, 'Recap'], GOALS, level)).map((x) => x.id).join() === 'pronunciation' && v2PassedParts(GDI, at([...PAGES, 'Recap', 'Conversation 2'], GOALS, level)).length === 0);
    check('pages match the part\'s name only, not its id or aim: "Open conversation practice"-style aim words name nothing', v2PassedParts(GDI, at(['Lesson overview', 'Talking about your work', 'Summary'], {}, level)).map((x) => x.id).includes('topic-intro') && v2PassedParts(GDI, at(['Lesson overview', 'Your job', 'Summary'], {}, level)).map((x) => x.id)[0] === 'present-perfect');
    check('a GDI-style named plan: the fact names the part by its name, never its id', v2PassedPartFact(GDI, summary, false)[0]!.startsWith('The Pronunciation part') && !/pronunciation part/.test(v2PassedPartFact(GDI, summary, false)[0]!) && !/open-conversation|level-check/.test(v2PassedPartFact(GDI, at(['Lesson overview', 'Your job', 'Summary']), false).join()));

    const map = renderPlanMap(GDI, true);
    check('a plan with an optional part: optional is the student\'s choice, not the tutor\'s', map.includes(' A part marked optional is still offered: the student decides whether to do it, not you.'), map.slice(0, 900));
    const NOT_OPTIONAL = { ...WRITTEN, segments: WRITTEN.segments.map((x) => (x.id === 'pronunciation' ? { ...x, metadata: { ...(x.metadata ?? {}), optional: undefined } } : x.id === 'open-conversation' ? { ...x, teacherNote: 'This is a core part of the lesson, not optional.' } : x)) } as LessonPlan;
    check('the word "optional" elsewhere in a plan does not set the line off (fix round 1)', !renderPlanMap(NOT_OPTIONAL, true).includes('A part marked optional'));
    check('a part marked optional: by metadata, by its name, or by an aim or note that opens with the word', v2PartIsOptional(seg('pronunciation')) && v2PartIsOptional({ ...seg('summary'), metadata: { label: 'Optional extension' } } as never) && v2PartIsOptional({ ...seg('summary'), teacherNote: 'Optional pronunciation practice. Offer it.' } as never) && !v2PartIsOptional({ ...seg('summary'), teacherNote: 'Not optional: always do it.' } as never) && v2PartIsOptional(GDI.segments.find((x) => x.id === 'pronunciation')!) && !v2PartIsOptional(GDI.segments.find((x) => x.id === 'open-conversation')!));
    check('metadata.optional counts too; the line is off with the kill switch; a plan without one has none', renderPlanMap(WRITTEN, true).includes('A part marked optional') && !renderPlanMap(GDI, true, false).includes('A part marked optional') && !renderPlanMap(SEED_AP_CALCBC_U4_LHOPITAL).includes('A part marked optional'));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main();
