/**
 * Whole-lesson timeline (partner spec v1.2 §4): clamp-never-reject parsing
 * and the per-turn window the model sees.
 *
 * Run: npm run test:host-lesson-timeline
 */
import { strict as assert } from 'node:assert';
import {
  LESSON_NOW_LIMITS,
  LESSON_NOW_MAX_CHARS,
  LESSON_NEAR_END_S,
  LESSON_TIMELINE_LIMITS,
  lessonEndSeconds,
  lessonCacheKey,
  LESSON_CACHE_MAX_CHARS,
  parseLessonTimeline,
  renderLessonNow,
  timelineStats,
  type TimelineEntry,
} from '../src/lib/tutor/portal/host-lesson-timeline';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

const msg = (timeline: unknown) => ({ type: 'evelyn:lesson', timeline });

test('limits are the spec values', () => {
  assert.deepEqual(LESSON_TIMELINE_LIMITS, { entries: 5000, entryChars: 500, visualEntryChars: 1500, totalChars: 150_000 });
});

test('parse: the host transcript format passes through; kind defaults to speech', () => {
  const p = parseLessonTimeline(msg([
    { start: 0, end: 4.2, text: 'Welcome back' },
    { start: 148, kind: 'visual', text: 'Chart 3: A 45%, B 30%' },
    { start: 131.4, end: 134, text: 'Watch what happens' },
  ]));
  assert.ok(p);
  assert.deepEqual(p.entries, [
    { start: 0, end: 4.2, text: 'Welcome back', kind: 'speech' },
    { start: 131.4, end: 134, text: 'Watch what happens', kind: 'speech' },
    { start: 148, text: 'Chart 3: A 45%, B 30%', kind: 'visual' },
  ]);
  assert.equal(p.received, 3);
  assert.equal(p.cut, false);
});

test('parse: wrong type or a non-array timeline is not a lesson', () => {
  for (const d of [null, 'x', {}, { type: 'evelyn:lesson' }, { type: 'evelyn:lesson', timeline: 'abc' }, { type: 'evelyn:lesson', timeline: { 0: {} } }, { type: 'evelyn:lessons', timeline: [] }]) {
    assert.equal(parseLessonTimeline(d), null, JSON.stringify(d));
  }
  assert.deepEqual(parseLessonTimeline(msg([]))?.entries, []);
});

test('parse: malformed entries are skipped, never thrown on (Review Focus 4)', () => {
  const p = parseLessonTimeline(msg([
    null, 7, 'x', [], {}, { start: NaN, text: 'a' }, { start: -1, text: 'a' }, { start: '3', text: 'a' },
    { start: 1 }, { start: 1, text: '   ' }, { start: 1, text: 42 },
    { start: 2, end: 1, text: 'end before start' }, { start: 3, end: 'x', text: 'bad end' }, { start: 4, kind: 'banana', text: 'odd kind' },
  ]));
  assert.ok(p);
  assert.deepEqual(p.entries, [
    { start: 2, text: 'end before start', kind: 'speech' },
    { start: 3, text: 'bad end', kind: 'speech' },
    // An unknown kind is a new host item type: on-screen content, never narration.
    { start: 4, text: 'odd kind', kind: 'visual' },
  ]);
  assert.equal(p.received, 14);
});

test('parse: entry text over 500 characters is cut', () => {
  const p = parseLessonTimeline(msg([{ start: 0, text: 'x'.repeat(1_000_000) }]));
  assert.equal(p?.entries[0].text.length, 500);
  assert.equal(p?.cut, true);
});

test('parse: a visual entry may run to 1,500 characters; speech stays at 500', () => {
  const p = parseLessonTimeline(msg([{ start: 0, kind: 'visual', text: 'v'.repeat(4000) }, { start: 1, text: 's'.repeat(4000) }]));
  assert.equal(p?.entries[0].text.length, 1500);
  assert.equal(p?.entries[1].text.length, 500);
  assert.deepEqual(timelineStats(p!.entries), { speech: 1, visual: 1, slide: 0, quiz: 0, question: 0, chars: 2000 });
});

test('render: a full-length visual on screen now fits the per-turn block', () => {
  const tl = [0, 60, 120, 180].map((start) => ({ start, kind: 'visual' as const, text: `at${start} ` + 'n'.repeat(1490) }));
  const r = renderLessonNow({ timeline: tl, video: 'paused', positionSeconds: 181, resumeTool: true }) ?? '';
  assert.ok(r.includes('at180 ') && r.includes('at120 '), 'the newest visuals are whole');
  assert.ok(r.length <= LESSON_NOW_MAX_CHARS);
});

test('parse: more than 5,000 entries keeps the first 5,000', () => {
  const p = parseLessonTimeline(msg(Array.from({ length: 50_000 }, (_, i) => ({ start: i, text: 'w' }))));
  assert.equal(p?.entries.length, 5000);
  assert.equal(p?.entries[4999].start, 4999);
  assert.equal(p?.cut, true);
});

test('parse: total text over 150,000 characters is cut at the limit', () => {
  const p = parseLessonTimeline(msg(Array.from({ length: 400 }, (_, i) => ({ start: i, text: 'y'.repeat(500) }))));
  assert.ok(p);
  assert.equal(p.entries.reduce((n, e) => n + e.text.length, 0), 150_000);
  assert.equal(p.entries.length, 300);
  assert.equal(p.cut, true);
});

const TL: TimelineEntry[] = [
  { start: 0, end: 4, text: 'Welcome back.', kind: 'speech' },
  { start: 20, kind: 'visual', text: 'Chart 1: the track map.' },
  { start: 131, end: 134, text: 'Watch what happens', kind: 'speech' },
  { start: 134, end: 137, text: 'when the box opens.', kind: 'speech' },
  { start: 148, kind: 'visual', text: 'Chart 3: A 45%, B 30%, C 20%, D 5%.' },
  { start: 163, end: 166, text: 'The least likely one came up.', kind: 'speech' },
  { start: 400, kind: 'visual', text: 'Chart 9: the final table.' },
  { start: 401, end: 404, text: 'Far in the future.', kind: 'speech' },
];

test('render: nothing until the host has reported a video state', () => {
  assert.equal(renderLessonNow({ timeline: TL, video: null, positionSeconds: null, resumeTool: true }), undefined);
});

test('render: state line, visuals so far, speech around the position', () => {
  const r = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: 150, resumeTool: true });
  assert.ok(r);
  assert.match(r, /The video is paused at 2:30\./);
  assert.match(r, /\[0:20\] Chart 1: the track map\./);
  assert.match(r, /\[2:28\] Chart 3: A 45%, B 30%, C 20%, D 5%\./);
  assert.ok(!r.includes('Chart 9'), 'a visual that has not appeared yet is not shown');
  assert.match(r, /\[2:11\] Watch what happens when the box opens\./);
  assert.match(r, /\[2:43\] The least likely one came up\./);
  assert.ok(!r.includes('Welcome back'), 'speech far before the position is outside the window');
  assert.ok(!r.includes('Far in the future'));
  assert.ok(r.indexOf('Chart 1') < r.indexOf('Chart 3'), 'visuals in time order');
});

test('render: resume instructions only when the tool is offered and the video can resume', () => {
  const on = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: 150, resumeTool: true }) ?? '';
  assert.match(on, /`resume_lesson`/);
  const off = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: 150, resumeTool: false }) ?? '';
  assert.ok(!off.includes('resume_lesson'));
  const ended = renderLessonNow({ timeline: TL, video: 'ended', positionSeconds: 500, resumeTool: true }) ?? '';
  assert.match(ended, /The video has finished/);
  assert.ok(!/call `resume_lesson`/.test(ended));
});

test('render: no timeline still gives the state and the rules', () => {
  const r = renderLessonNow({ timeline: null, video: 'paused', positionSeconds: 12, resumeTool: true }) ?? '';
  assert.match(r, /The video is paused at 0:12\./);
  assert.ok(!r.includes('On screen so far'));
  assert.match(r, /`resume_lesson`/);
});

test('render: unknown position shows the visuals but no speech window', () => {
  const r = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: null, resumeTool: false }) ?? '';
  assert.match(r, /The video is paused\./);
  assert.ok(!r.includes('What is said around this point'));
});

test('render: budgets hold on the largest timeline; the newest visuals and nearest speech survive', () => {
  const big: TimelineEntry[] = [];
  for (let i = 0; i < 2500; i++) big.push({ start: i, text: `s${i} ` + 'w'.repeat(400), kind: 'speech' });
  for (let i = 0; i < 2500; i++) big.push({ start: i, text: `v${i} ` + 'z'.repeat(400), kind: 'visual' });
  big.sort((a, b) => a.start - b.start);
  const r = renderLessonNow({ timeline: big, video: 'paused', positionSeconds: 2000, resumeTool: true }) ?? '';
  assert.ok(r.length <= LESSON_NOW_MAX_CHARS, `block is ${r.length} chars`);
  assert.ok(r.includes('v2000 '), 'the visual on screen now is kept');
  assert.ok(!r.includes('v100 '), 'old visuals are dropped first');
  assert.ok(r.includes('s2000 '), 'speech at the position is kept');
  assert.ok(LESSON_NOW_LIMITS.speechChars + LESSON_NOW_LIMITS.visualChars < LESSON_NOW_MAX_CHARS);
});

test('render: generic wording — no partner or game names', () => {
  const r = renderLessonNow({ timeline: [], video: 'playing', positionSeconds: 1, resumeTool: true }) ?? '';
  assert.ok(!/gameclass|mario|sonic/i.test(r));
});


test('lesson window: video length shown; "nearly over" in the last minute only', () => {
  const tl: TimelineEntry[] = [{ start: 0, kind: 'speech', text: 'Hello' }];
  const mid = renderLessonNow({ timeline: tl, video: 'paused', positionSeconds: 100, resumeTool: false, durationSeconds: 245 })!;
  assert.match(mid, /The video is paused at 1:40 of 4:05\./);
  assert.ok(!/nearly over/.test(mid));
  const end = renderLessonNow({ timeline: tl, video: 'paused', positionSeconds: 245 - LESSON_NEAR_END_S, resumeTool: false, durationSeconds: 245 })!;
  assert.match(end, /The lesson is nearly over\./);
  const none = renderLessonNow({ timeline: tl, video: 'paused', positionSeconds: 240, resumeTool: false })!;
  assert.ok(!/ of \d|nearly over/.test(none));
});

test('lesson window: recap carries the lesson from its start, evenly thinned, within the route bound', () => {
  const tl: TimelineEntry[] = Array.from({ length: 400 }, (_, i) => ({ start: i * 2, kind: 'speech' as const, text: `line ${i} ${'w'.repeat(60)}` }));
  for (let i = 0; i < 40; i++) tl.push({ start: i * 20, kind: 'visual', text: 'v'.repeat(1400) });
  tl.sort((a, b) => a.start - b.start);
  const normal = renderLessonNow({ timeline: tl, video: 'paused', positionSeconds: 790, resumeTool: true })!;
  assert.ok(!/line 0 /.test(normal), 'the normal window is the stretch around the position');
  const recap = renderLessonNow({ timeline: tl, video: 'paused', positionSeconds: 790, resumeTool: true, recap: true })!;
  assert.match(recap, /What the lesson has said so far, from the start:/);
  assert.match(recap, /line 0 /);
  assert.ok(/line 39\d /.test(recap), 'the end is still represented');
  assert.ok(recap.length <= LESSON_NOW_MAX_CHARS, `recap ${recap.length} within ${LESSON_NOW_MAX_CHARS}`);
  assert.ok(!/line 399 /.test(renderLessonNow({ timeline: tl, video: 'paused', positionSeconds: 100, resumeTool: true, recap: true })!), 'nothing past the position');
});

test('parse: quizzes, questions and slides are kept as their own kinds, never as speech', () => {
  const p = parseLessonTimeline(msg([
    { start: 10, end: 12, text: 'Today: two offers' },
    { start: 30, kind: 'slide', title: 'Equity vs debt', summary: 'Equity = ownership; debt = repay with interest' },
    { start: 60, kind: 'quiz', title: 'Check-in', questions: [
      { question: 'Who owns part of the company?', options: ['lender', { text: 'investor' }], correct_answer: 'investor' },
      { question: 'Which must be repaid?', options: ['equity', 'debt'], answer: 'debt' },
    ] },
    { start: 90, kind: 'question', question: 'Is a bond equity?', options: ['yes', 'no'], correct_answer: 'no' },
    { start: 120, kind: 'teaching_moment', text: 'Coupon = 5% of $1,000' },
    { start: 130, kind: 'Transcript', text: 'And that is the coupon.' },
  ]))!;
  assert.deepEqual(p.entries.map((e) => e.kind), ['speech', 'slide', 'quiz', 'question', 'visual', 'speech']);
  assert.match(p.entries[1].text, /^Equity vs debt Equity = ownership/);
  assert.match(p.entries[2].text, /Q1: Who owns part of the company\? Options: lender \| investor\. \(Answer, for you only: investor\.\)/);
  assert.match(p.entries[2].text, /Q2: Which must be repaid\?/);
  assert.match(p.entries[3].text, /^Is a bond equity\? Options: yes \| no\. \(Answer, for you only: no\.\)$/);
  assert.deepEqual(p.rawKinds, { '-': 1, slide: 1, quiz: 1, question: 1, teaching_moment: 1, Transcript: 1 });
  const st = timelineStats(p.entries);
  assert.deepEqual([st.speech, st.visual, st.slide, st.quiz, st.question], [2, 1, 1, 1, 1]);
});

test('parse: an exit ticket tagged in the timeline is marked', () => {
  const p = parseLessonTimeline(msg([{ start: 200, kind: 'exit_ticket', text: 'Exit: one difference' }]))!;
  assert.equal(p.entries[0].kind, 'visual');
  assert.equal(p.entries[0].exitTicket, true);
});

test('render: on screen, then quizzes/questions, then speech — with the priority rule', () => {
  const tl = parseLessonTimeline(msg([
    { start: 5, end: 8, text: 'The pitcher winds up' },
    { start: 20, kind: 'visual', text: 'F = m × a' },
    { start: 25, kind: 'slide', text: 'Newton 2' },
    { start: 40, kind: 'quiz', question: 'Double the force?', options: ['double a', 'half a'], correct_answer: 'double a' },
    { start: 300, kind: 'quiz', question: 'LATER QUIZ' },
  ]))!.entries;
  const r = renderLessonNow({ timeline: tl, video: 'paused', positionSeconds: 50, resumeTool: false })!;
  const iScreen = r.indexOf('On screen so far');
  const iQuiz = r.indexOf('Quizzes and questions so far');
  const iSpeech = r.indexOf('What is said around');
  assert.ok(iScreen >= 0 && iScreen < iQuiz && iQuiz < iSpeech, 'order');
  assert.match(r, /\[0:25\] Slide: Newton 2/);
  assert.match(r, /\[0:40\] Quiz: Double the force\?/);
  assert.ok(!r.includes('LATER QUIZ'), 'nothing ahead of the position');
  assert.match(r, /title and description, then what is on screen, then its quizzes and questions; what the video says matters least/);
  const plain = renderLessonNow({ timeline: [{ start: 1, kind: 'speech', text: 'hi' }], video: 'paused', positionSeconds: 2, resumeTool: false })!;
  assert.ok(!/matters least/.test(plain), 'no rule when there is nothing but speech');
});

test('lesson end: the duration, else the end of the timeline', () => {
  const tl: TimelineEntry[] = [{ start: 0, end: 4, kind: 'speech', text: 'a' }, { start: 219.7, kind: 'visual', text: 'b' }, { start: 210, end: 216, kind: 'speech', text: 'c' }];
  assert.equal(lessonEndSeconds(tl, 240), 240);
  assert.equal(lessonEndSeconds(tl, null), 219.7);
  assert.equal(lessonEndSeconds(null, null), null);
});

test('parse: question types — a free response has no key, true/false implies its options; the type may sit on the entry, the item or the kind', () => {
  const p = parseLessonTimeline(msg([
    { start: 10, kind: 'question', type: 'mcq', question: 'Which law?', options: ['First', 'Second'], correct_answer: 'Second' },
    { start: 20, kind: 'question', type: 'truefalse', question: 'Force needs mass.', correct_answer: 'True' },
    { start: 30, kind: 'question', question_type: 'shortanswer', question: 'Name the unit of force.', correct_answer: 'newton' },
    { start: 40, kind: 'question', type: 'freeresponse', question: 'Describe a time you felt inertia.', correct_answer: 'Describe a time you felt inertia.' },
    { start: 50, kind: 'quiz_question', questions: [
      { type: 'free_response', question: 'Explain in your words.', correct_answer: 'n/a' },
      { type: 'true_false', question: 'Mass is weight.', correct_answer: 'False' },
    ] },
    { start: 60, kind: 'mcq', question: 'Kind is the type', options: ['a', 'b'], correct_answer: 'a' },
    { start: 70, kind: 'freeresponse', question: 'Kind is free response', correct_answer: 'SECRET' },
    { start: 80, kind: 'question', type: 'riddle', question: 'Unknown type keeps the answer', correct_answer: 'kept' },
  ]))!;
  const t = p.entries.map((e) => e.text);
  assert.match(t[0], /^Which law\? Options: First \| Second\. \(Answer, for you only: Second\.\)$/);
  assert.match(t[1], /^Force needs mass\. Options: True \| False\. \(Answer, for you only: True\.\)$/);
  assert.match(t[2], /^Name the unit of force\. \(Answer, for you only: newton\.\)$/);
  assert.equal(t[3], 'Describe a time you felt inertia. (Open-ended: no set answer.)');
  assert.equal(p.entries[4].kind, 'quiz');
  assert.match(t[4], /Q1: Explain in your words\. \(Open-ended: no set answer\.\) Q2: Mass is weight\. Options: True \| False\. \(Answer, for you only: False\.\)/);
  assert.equal(p.entries[5].kind, 'question');
  assert.match(t[5], /Answer, for you only: a\./);
  assert.equal(p.entries[6].kind, 'question');
  assert.ok(!t[6].includes('SECRET'), 'a free response never carries the host\'s placeholder answer');
  assert.match(t[7], /Answer, for you only: kept\./);
  assert.deepEqual(p.questionTypes, { mcq: 2, truefalse: 2, shortanswer: 1, freeresponse: 3 });
});

test('parse: a slide\'s own fields are rendered as key: value; structural, media and layout keys are not', () => {
  const p = parseLessonTimeline(msg([
    { start: 5, kind: 'slide', slide_type: 'two_column', title: 'Newton 1', heading: 'Inertia', left_text: 'A body at rest stays at rest.', rightText: 'A body in motion stays in motion.',
      bullets: ['stays', 'moves'], image_url: 'https://cdn.example/x.png', caption: 'https://cdn.example/y.png', id: 'abc123', order: 3, x: 10, width: 400, style: { color: 'red' },
      notes: { speaker: 'say it slowly', font: 'Arial' }, visible: true, empty: '   ' },
    { start: 9, kind: 'visual', text: 'Court diagram', alt: 'The ball leaves the hand' },
    { start: 12, text: 'Narration keeps only its text', mood: 'calm' },
  ]))!;
  const slide = p.entries[0].text;
  assert.match(slide, /^Newton 1; /, 'title first');
  assert.match(slide, /slide type: two_column/);
  assert.match(slide, /heading: Inertia/);
  assert.match(slide, /left text: A body at rest stays at rest\./);
  assert.match(slide, /right text: A body in motion stays in motion\./);
  assert.match(slide, /bullets: stays, moves/);
  assert.match(slide, /notes speaker: say it slowly/);
  assert.ok(!/https|abc123|order|width|color|font|visible|empty|x: 10/.test(slide), slide);
  assert.ok(slide.indexOf('slide type') < slide.indexOf('heading'), 'host field order is kept');
  assert.equal(p.entries[1].text, 'Court diagram; alt: The ball leaves the hand');
  assert.equal(p.entries[2].text, 'Narration keeps only its text');
});

test('parse: unknown kinds, notes and text are on-screen; the shape of each kind is kept for telemetry (keys, never content)', () => {
  const p = parseLessonTimeline(msg([
    { start: 1, kind: 'notes', text: 'teacher note' },
    { start: 2, kind: 'text', text: 'on-screen text' },
    { start: 3, kind: 'visual', text: 'v', end: 5 },
    { start: 4, kind: 'visual', text: 'w', end: 6, extra: 'e' },
    { start: 5, text: 'speech' },
  ]))!;
  assert.deepEqual(p.entries.map((e) => e.kind), ['visual', 'visual', 'visual', 'visual', 'speech']);
  assert.deepEqual(p.shapes, { notes: 'start,kind,text', text: 'start,kind,text', visual: 'start,kind,text,end', '-': 'start,text' });
  assert.ok(!JSON.stringify(p.shapes).includes('teacher note'));
});

test('cache key: one per token, stable, none without a token; the token itself never appears in it', () => {
  const a = lessonCacheKey('eyJhbGciOi.payload.sig-aaaa');
  const b = lessonCacheKey('eyJhbGciOi.payload.sig-bbbb');
  assert.ok(a && b && a !== b);
  assert.equal(lessonCacheKey('eyJhbGciOi.payload.sig-aaaa'), a);
  assert.equal(lessonCacheKey(null), null);
  assert.equal(lessonCacheKey(''), null);
  assert.ok(!a!.includes('payload'));
  assert.match(a!, /^evelyn:lesson:/);
  assert.ok(LESSON_CACHE_MAX_CHARS >= LESSON_TIMELINE_LIMITS.totalChars);
});

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
