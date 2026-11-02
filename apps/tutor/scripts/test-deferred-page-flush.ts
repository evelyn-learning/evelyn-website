// scripts/test-deferred-page-flush.ts
// Run: npx tsx scripts/test-deferred-page-flush.ts
//
// Two newPage commands back to back left an empty page titled
// "Hook: Graph linear inequalities on a coordinate plane using boundary…"
// in front of the page for the student's problem.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  decideDeferredPageFlush,
  emptyPageIndexes,
  isPageContentAction,
  flushDeferredPageAtTurnEnd,
  orderStudentCardsBeforePageBreak,
  advancePageFlushTiming,
  orderTurnEndDispatches,
  previousPageTarget,
  segmentCardForFlush,
  rearmAfterKill,
  batchHasSegmentCard,
} from '../src/lib/tutor/whiteboard/deferred-page-flush';
import { keepBatchOnEmptySegmentPage, keepTopicShiftOnSegmentPage, type PageDecision } from '../src/lib/tutor/whiteboard/page-grouping';
import { isStudentSentenceCard } from '../src/lib/tutor/voice/sentence-board';

let n = 0;
const ok = (name: string, cond: boolean) => { assert.ok(cond, name); n++; };
const d = (batch: Array<{ action: string; title?: string }>, enabled = true) => decideDeferredPageFlush({ enabled, batch });

// The live batch at the flush: page-grouping already prepended its own page.
const LIVE = [
  { action: 'newPage', title: 'x > 5 or x < 3' },
  { action: 'showProblem' },
];
{
  const r = d(LIVE);
  ok('live: batch opens its own page ⇒ deferred dropped', r.action === 'drop-deferred' && r.reason === 'batch-opens-own-page');
  ok('live: reports the surviving page title', r.ownPageTitle === 'x > 5 or x < 3');
  // What the pre-fix flush emitted, and what the fix emits:
  const before = [{ action: 'newPage', title: 'Hook: Graph linear inequalities…' }, ...LIVE];
  ok('pre-fix stream has an empty page at index 0', JSON.stringify(emptyPageIndexes(before)) === '[0]');
  ok('post-fix stream has none', emptyPageIndexes(LIVE).length === 0);
}
// Review item 5a: the batch's own page is a page-grouping CONTINUATION of the
// previous page ("… (cont.)"). Dropping the deferred segment page there put
// the NEW segment's content on a continuation page of the PREVIOUS segment.
{
  const CONT = [{ action: 'newPage', title: 'Boundary lines (cont.)' }, { action: 'showProblem' }];
  const r = decideDeferredPageFlush({ enabled: true, batch: CONT, ownPageIsContinuation: true });
  ok('continuation own page ⇒ keep the deferred page, drop the continuation one',
    r.action === 'drop-own-page' && r.reason === 'own-page-is-continuation' && r.ownPageIndex === 0 && r.ownPageTitle === 'Boundary lines (cont.)');
  // The stream the caller emits: deferred page, then the content — no "(cont.)" page, nothing empty.
  const emitted = [{ action: 'newPage', title: 'Try it: shade the region' }, ...CONT.filter((_, i) => i !== r.ownPageIndex)];
  ok('continuation case: one page, no empty page', emitted.filter((c) => c.action === 'newPage').length === 1 && emptyPageIndexes(emitted).length === 0);
  const r2 = decideDeferredPageFlush({ enabled: true, batch: [{ action: 'scrollTo' }, ...CONT], ownPageIsContinuation: true });
  ok('continuation own page after meta commands: index points at the newPage', r2.action === 'drop-own-page' && r2.ownPageIndex === 1);
  const own = decideDeferredPageFlush({ enabled: true, batch: LIVE, ownPageIsContinuation: false });
  ok('own page that is NOT a continuation ⇒ deferred dropped (unchanged)', own.action === 'drop-deferred' && own.reason === 'batch-opens-own-page');
  ok('continuation flag with content before the newPage ⇒ prepend (unchanged)',
    decideDeferredPageFlush({ enabled: true, batch: [{ action: 'showEquation' }, ...CONT], ownPageIsContinuation: true }).reason === 'content-before-own-page');
  ok('continuation flag but no own page ⇒ prepend', decideDeferredPageFlush({ enabled: true, batch: [{ action: 'showEquation' }], ownPageIsContinuation: true }).reason === 'no-own-page');
  ok('kill switch ⇒ prepend even for a continuation page', decideDeferredPageFlush({ enabled: false, batch: CONT, ownPageIsContinuation: true }).reason === 'flag-off');
}
ok('no own page ⇒ prepend (unchanged)', d([{ action: 'showEquation' }]).action === 'prepend' && d([{ action: 'showEquation' }]).reason === 'no-own-page');
ok('content BEFORE the batch newPage ⇒ prepend (deferred page receives it)',
  d([{ action: 'showEquation' }, { action: 'newPage', title: 'B' }, { action: 'showGraph' }]).reason === 'content-before-own-page');
ok('prepending there leaves no empty page',
  emptyPageIndexes([{ action: 'newPage' }, { action: 'showEquation' }, { action: 'newPage' }, { action: 'showGraph' }]).length === 0);
ok('meta commands before the own newPage do not count as content',
  d([{ action: 'scrollTo' }, { action: 'advanceLesson' }, { action: 'newPage', title: 'B' }, { action: 'showProblem' }]).action === 'drop-deferred');
ok('own newPage without a title still wins', d([{ action: 'newPage' }, { action: 'showProblem' }]).ownPageTitle === '');
ok('empty batch ⇒ prepend', d([]).action === 'prepend');
ok('kill switch ⇒ prepend', d(LIVE, false).action === 'prepend' && d(LIVE, false).reason === 'flag-off');
ok('content actions', isPageContentAction('showProblem') && isPageContentAction('showSegmentCard') && isPageContentAction('handwrite'));
ok('non-content actions', !isPageContentAction('newPage') && !isPageContentAction('scribble') && !isPageContentAction('scrollTo') && !isPageContentAction('shown'));
ok('emptyPageIndexes: trailing newPage is not counted', emptyPageIndexes([{ action: 'showEquation' }, { action: 'newPage' }]).length === 0);
ok('emptyPageIndexes: pointer-only page is empty',
  JSON.stringify(emptyPageIndexes([{ action: 'newPage' }, { action: 'scribble' }, { action: 'newPage' }, { action: 'showGraph' }])) === '[0]');

// Task 14 §K (GDI run 4): the level-check and summary part pages were dropped
// because the batch that flushed them carried a page-grouping break. An
// authored fixed-script part page is never dropped — the batch's page is.
{
  const BATCH = [{ action: 'newPage', title: 'I have sold 300 machines' }, { action: 'showSegmentCard' }, { action: 'showSentence' }];
  const r = decideDeferredPageFlush({ enabled: true, batch: BATCH, deferredIsAuthored: true });
  ok('authored deferred page ⇒ the batch page is dropped, the part page kept',
    r.action === 'drop-own-page' && r.reason === 'deferred-page-is-authored' && r.ownPageIndex === 0);
  const emitted = [{ action: 'newPage', title: 'Part 3 · Level check' }, ...BATCH.filter((_, i) => i !== r.ownPageIndex)];
  ok('authored case: one page carrying the card + sentence, nothing empty', emitted.filter((c) => c.action === 'newPage').length === 1 && emptyPageIndexes(emitted).length === 0);
  ok('authored, content first ⇒ prepend (unchanged)', decideDeferredPageFlush({ enabled: true, batch: [{ action: 'showSentence' }], deferredIsAuthored: true }).action === 'prepend');
  ok('not authored ⇒ deferred dropped (unchanged)', decideDeferredPageFlush({ enabled: true, batch: BATCH, deferredIsAuthored: false }).action === 'drop-deferred');
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('VTR passes deferredIsAuthored from the pending page', /deferredIsAuthored: pendingAdvanceNewPageRef\.current\.authored === true/.test(VTR));
  ok('VTR: a post-turn auto card never flushes the part page', /const autoCardOfLeftPart = opts\?\.sentenceBoardAuto === true && pendingAdvanceNewPageRef\.current\.afterTurn === true;/.test(VTR)
    && /const hasFreshTeaching = !autoCardOfLeftPart && /.test(VTR));
  ok('VTR: the auto-advance marks its pending page afterTurn', /applyResolvedAdvance\(autoPlan, segIdNow, autoNext\);\s*if \(pendingAdvanceNewPageRef\.current\?\.segmentId === autoNext\) \{\s*pendingAdvanceNewPageRef\.current\.afterTurn = true;/.test(VTR));
  // Fix round 1 (review I-1): afterTurn is scoped to the advancing turn —
  // cleared at the next brain turn's start, so the new part's own auto
  // cards open the part page.
  const turnStart = VTR.indexOf('turnNarrationRef.current = [];');
  ok('VTR: afterTurn cleared at the next brain turn start', turnStart > 0
    && /\} else if \(pendingAdvanceNewPageRef\.current\?\.afterTurn\) \{\s*pendingAdvanceNewPageRef\.current\.afterTurn = false;/.test(VTR.slice(turnStart, turnStart + 1400)));
  ok('VTR: afterTurn is set only right after the client advances (auto-advance, spoken opener)', (VTR.match(/\.afterTurn = true;/g) ?? []).length === 2);
  ok('VTR: the flushed part page clears a held topic-shift mark', VTR.includes("onDebugEvent?.('topic_shift_cleared_by_segment_page'"));
}

// ── Task 20 §D2 (GDI run 8, 144 s): the part page opens at the advancing turn's end ──
{
  const base = { pending: { authored: true }, brainBusy: false, speaking: false, bufferedRenders: 0 };
  ok('D2: authored part page, turn over, renders painted ⇒ flush now', flushDeferredPageAtTurnEnd(base));
  ok('D2: brain still composing ⇒ wait', !flushDeferredPageAtTurnEnd({ ...base, brainBusy: true }));
  ok('D2: audio still playing ⇒ wait', !flushDeferredPageAtTurnEnd({ ...base, speaking: true }));
  ok('D2: a held auto card still buffered ⇒ wait (it paints on the page being left)', !flushDeferredPageAtTurnEnd({ ...base, bufferedRenders: 1 }));
  ok('D2: a non-authored deferred page keeps waiting for content', !flushDeferredPageAtTurnEnd({ ...base, pending: {} }));
  ok('D2: nothing pending ⇒ nothing', !flushDeferredPageAtTurnEnd({ ...base, pending: null }));
  const VTR2 = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('D2: VTR flushes on the audio drain, the speech end and the brain going idle',
    VTR2.includes("flushDeferredPageAtTurnEndRef.current('audio drained')")
    && VTR2.includes("flushDeferredPageAtTurnEndRef.current('speech ended')")
    && VTR2.includes("flushDeferredPageAtTurnEndRef.current('brain idle')"));
  // Fix round 1 (I5): the turn-end page goes into the command record, so the
  // duplicate-title guard (which walks whiteboardCommandsRef for the latest
  // newPage) strips a brain new_page with the same title, and the
  // on-current-page checks read the NEW page.
  const flushAt = VTR2.indexOf('const flushDeferredPageAtTurnEndNow = useCallback(');
  const flushBody = VTR2.slice(flushAt, flushAt + 2500);
  ok('D2/I5: the flush paints AND records the newPage', /onWhiteboardCommand\(pageCmds\);\s*recordDispatchedCommandsRef\.current\(pageCmds\);/.test(flushBody));
  ok('D2/I5: the batch path records through the same helper', VTR2.includes('recordDispatchedCommandsRef.current(processed);'));
  const recAt = VTR2.indexOf('recordDispatchedCommandsRef.current = (processed: WhiteboardCommand[]) => {');
  ok('D2/I5: the record = the session mirror + count + transcript entry', recAt > 0
    && /whiteboardCommandsRef\.current = \[\.\.\.whiteboardCommandsRef\.current, \.\.\.processed\];/.test(VTR2.slice(recAt, recAt + 1500))
    && /whiteboardCommands: \[\.\.\.existing, \.\.\.processed\]/.test(VTR2.slice(recAt, recAt + 1500)));
  ok('D2/I5: the duplicate-title guard reads the mirror for the latest newPage', /for \(let i = whiteboardCommandsRef\.current\.length - 1; i >= 0; i--\) \{\s*const c = whiteboardCommandsRef\.current\[i\];\s*if \(c\.action === 'newPage'\) \{\s*mostRecentTitle/.test(VTR2));
  {
    // The guard's rule on the recorded mirror: same title as the latest page ⇒ stripped.
    const mirror = [{ action: 'newPage', title: 'Part 3 · Your job · 仕事について' }, { action: 'showSentence' }, { action: 'newPage', title: 'Part 4 · Present perfect · 現在完了' }];
    const latest = [...mirror].reverse().find((c) => c.action === 'newPage')?.title;
    ok('D2/I5: a brain new_page "Part 4 · Present perfect · 現在完了" after the flush is a duplicate', latest?.trim().toLowerCase() === 'part 4 · present perfect · 現在完了');
  }
  ok('D2: same event name, "at turn end"', VTR2.includes("onDebugEvent?.('auto_newpage_on_advance_flushed', `${deferred.segmentId}: ${deferred.title} at turn end`)"));
}

// Task 23 §A (GDI run 11, 143 s / 271 s / 1017 s): the student's sentence card
// of the advancing turn paints BEFORE the new part's page break.
{
  type C = { action: string; title?: string; sentence?: string; student?: boolean };
  const page: C = { action: 'newPage', title: 'Part 4 · Present perfect · 現在完了' };
  const card: C = { action: 'showProblem' };
  const student: C = { action: 'showSentence', sentence: 'I work as a sales manager, and I help customers buy washing machines.', student: true };
  const model: C = { action: 'showSentence', sentence: 'I have worked here for five years.' };
  const r = orderStudentCardsBeforePageBreak([page, card, student, model], (c) => c.student === true);
  ok('23A: [newPage, showProblem, showSentence(student), showSentence(model)] → [student, newPage, showProblem, model]',
    r.cmds[0] === student && r.cmds[1] === page && r.cmds[2] === card && r.cmds[3] === model && r.cmds.length === 4);
  ok('23A: moved = the student card', r.moved.length === 1 && r.moved[0] === student);
  const lone = orderStudentCardsBeforePageBreak([page, student], (c) => c.student === true);
  ok('23A: the 143 s auto-card batch [newPage, student] → [student, newPage]', lone.cmds[0] === student && lone.cmds[1] === page);
  const none = orderStudentCardsBeforePageBreak([page, card, model], (c) => c.student === true);
  ok('23A: no student card ⇒ unchanged', none.moved.length === 0 && none.cmds[0] === page && none.cmds[2] === model);
  const noPage = orderStudentCardsBeforePageBreak([card, student], (c) => c.student === true);
  ok('23A: no page break ⇒ unchanged', noPage.moved.length === 0 && noPage.cmds[0] === card);
  const before = orderStudentCardsBeforePageBreak([student, page, card], (c) => c.student === true);
  ok('23A: a student card already before the break stays', before.moved.length === 0 && before.cmds[0] === student);
  // The classifier a brain show_sentence goes through.
  ok('23A: the 271 s correction is the student\'s sentence', isStudentSentenceCard('I work as a sales manager, and I help customers buy washing machines.', 'I work as sales manager and help customer buy washing machine.'));
  ok('23A: an echo of the student is the student\'s sentence', isStudentSentenceCard('I gave everyone sweets to get them to come to the seminar.', 'I gave everyone sweets to get them to come to the seminar.'));
  ok('23A: a new model sentence is not', !isStudentSentenceCard('I have worked here for five years.', 'Yes, I have worked with an international customer before.'));
  ok('23A: no student turn ⇒ not the student\'s', !isStudentSentenceCard('I have worked here for five years.', null));
  const VTR3 = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('23A: the batch flush orders the student cards in front of the break', /processed = flushCard \? \[segmentBreakCmd, flushCard as unknown as WhiteboardCommand, \.\.\.processed\] : \[segmentBreakCmd, \.\.\.processed\];[\s\S]{0,300}?\/\/ Task 23 §A[^\n]*\n\s*const orderedForBreak = orderStudentCardsBeforePageBreak\(processed, isStudentCardCmd\);/.test(VTR3));
  ok('23A: event "after N student card(s)"', VTR3.includes("` after ${orderedForBreak.moved.length} student card(s)`") && VTR3.includes('after ${n} student card(s) (buffered)'));
  ok('23A: moved cards are catalogued on the page being left', VTR3.includes('pageId: killRecoveryPinPageId ?? (movedBeforeBreak.has(cmd) && movedBeforeBreakPageId ? movedBeforeBreakPageId : undefined),'));
  ok('23A: a buffered break takes the later student card in front of it', /renderBufferRef\.current\.splice\(breakAt, 0, \{ processed: cards,/.test(VTR3));
  ok('23A: the auto card says whether it is the student\'s sentence', VTR3.includes("const studentSentenceCard = card.kind === 'correction' || !!card.source;"));
  ok('23A: the break is per turn', /segmentPageBreakRef\.current = null;\s*(?:levelAdvanceThisTurnRef\.current = '';\s*)?(?:levelAdvanceFromThisTurnRef\.current = '';\s*)?(?:cardedStudentSentenceRef\.current = new Set\(\);\s*)?rendersDispatchedThisTurnRef\.current = 0;/.test(VTR3));
}

// Task 23 §A2 (GDI run 11, 690 → 713 s): an empty segment page takes the next batch.
{
  const topic: PageDecision = { action: 'newPage', title: 'Extension', reason: 'topic shift (dist=0.511) (H4)', event: 'auto_new_page', anchorKey: null };
  const keep = keepBatchOnEmptySegmentPage(topic, { isSegmentPage: true, itemCount: 0 });
  ok('23A2: topic-shift page on an empty segment page ⇒ none', keep.action === 'none');
  ok('23A2: a segment page with items ⇒ the topic page opens', keepBatchOnEmptySegmentPage(topic, { isSegmentPage: true, itemCount: 1 }) === topic);
  ok('23A2: a non-segment empty page ⇒ the topic page opens', keepBatchOnEmptySegmentPage(topic, { isSegmentPage: false, itemCount: 0 }) === topic);
  ok('23A2: no page info ⇒ unchanged', keepBatchOnEmptySegmentPage(topic, null) === topic);
  const cont: PageDecision = { action: 'continuation', title: 'x (cont.)', reason: 'overflow', event: 'auto_new_page_overflow', anchorKey: null };
  ok('23A2: a continuation is skipped too', keepBatchOnEmptySegmentPage(cont, { isSegmentPage: true, itemCount: 0 }).action === 'none');
  const reset: PageDecision = { action: 'newPage', title: 'New', reason: 'explicit student reset', event: 'auto_new_page_reset', anchorKey: null };
  ok('23A2: the student\'s explicit reset still opens a page', keepBatchOnEmptySegmentPage(reset, { isSegmentPage: true, itemCount: 0 }) === reset);
  const VTR4 = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('23A2: VTR logs auto_new_page_skipped_empty_segment_page', VTR4.includes("onDebugEvent?.('auto_new_page_skipped_empty_segment_page',"));
  ok('23A2: both segment-page openings record the page id', (VTR4.match(/segmentPageIdRef\.current = catalogRef\.current\.openPage\(\{ title: /g) ?? []).length === 2);
}

// Task 23 fix round 1 (m5): a brain show_sentence of the NEW part's model is not the student's.
{
  ok('23 r1 m5: a new model sentence sharing words is not the student\'s', !isStudentSentenceCard('I have worked with international customers for several years.', 'Yes, I have worked with an international customer before.'));
  ok('23 r1 m5: a reworded sentence with new content is not', !isStudentSentenceCard('I talked to customers from China last year.', 'I talk to customers from China.'));
  ok('23 r1 m5: the 271 s correction still is', isStudentSentenceCard('I work as a sales manager, and I help customers buy washing machines.', 'I work as sales manager and help customer buy washing machine.'));
  ok('23 r1 m5: a one-word fix in the student\'s person shift still is', isStudentSentenceCard('You sell washing machines to hospitals.', 'I sell washing machine to hospitals.'));
  const page = { action: 'newPage' };
  const model = { action: 'showSentence', sentence: 'I have worked with international customers for several years.' };
  const r = orderStudentCardsBeforePageBreak([page, model], (c) => typeof (c as { sentence?: string }).sentence === 'string' && isStudentSentenceCard((c as { sentence: string }).sentence, 'Yes, I have worked with an international customer before.'));
  ok('23 r1 m5: that model stays after the page break', r.moved.length === 0 && r.cmds[0] === page);
}

// Task 24 §C3 (GDI run 12, 962 s): an advance on an ask turn with the hold spent flushes after the NEXT turn.
{
  ok('24C3: ask pending + hold spent ⇒ next-turn', advancePageFlushTiming({ askPending: true, holdSpent: true }) === 'next-turn');
  ok('24C3: no ask ⇒ turn-end', advancePageFlushTiming({ askPending: false, holdSpent: false }) === 'turn-end');
  ok('24C3: ask pending, hold not spent ⇒ turn-end', advancePageFlushTiming({ askPending: true, holdSpent: false }) === 'turn-end');
  ok('24C3: the turn-end flush waits while flushAfterNextTurn is set',
    !flushDeferredPageAtTurnEnd({ pending: { authored: true, flushAfterNextTurn: true }, brainBusy: false, speaking: false, bufferedRenders: 0 })
    && flushDeferredPageAtTurnEnd({ pending: { authored: true, flushAfterNextTurn: false }, brainBusy: false, speaking: false, bufferedRenders: 0 }));
  const V = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('24C3: VTR marks the carry at the advance', V.includes("if (advancePageFlushTiming({ askPending, holdSpent: askHoldSpent }) === 'next-turn') {") && V.includes("onDebugEvent?.('auto_newpage_on_advance_deferred_next_turn', autoNext);"));
  ok('24C3: VTR keeps afterTurn through one turn start', V.includes('if (pendingAdvanceNewPageRef.current?.flushAfterNextTurn && !pendingAdvanceNewPageRef.current.carriedTurnStarted) {'));
  ok('24C3: VTR clears the carry at the carried turn\'s end', V.includes('if (!opts?.prefetchOnly && pendingAdvanceNewPageRef.current?.flushAfterNextTurn && pendingAdvanceNewPageRef.current.carriedTurnStarted) {'));
}

// Task 27 §B (GDI run 14, 493 s): the turn-end part card flushed the pending part page before the
// sentence board planned the student's correction card — the card landed on the next part's page.
{
  type P = { kind: 'segment' | 'student' | 'other'; cmd: { action: string; title?: string; student?: boolean } };
  // A model of the board at turn end: a pending part page opens with the first batch that is not a
  // card of the student's sentence (the held auto card of the part being left); a student card that
  // does flush it goes in front of its break (Task 23 §A).
  const board = (dispatches: P[]): string[] => {
    let pending = true;
    const out: string[] = [];
    for (const p of dispatches) {
      if (pending && p.kind !== 'student') { out.push('newPage'); pending = false; }
      out.push(`${p.cmd.action}${p.kind === 'student' ? '(student)' : ''}`);
    }
    return out;
  };
  const showProblem: P = { kind: 'segment', cmd: { action: 'showProblem' } };
  const studentCard: P = { kind: 'student', cmd: { action: 'showSentence', student: true } };
  const modelCard: P = { kind: 'other', cmd: { action: 'showSentence' } };
  // before: stream order [showProblem (opens the deferred page), showSentence(student, planned later)]
  ok('27B: before — the student card lands after the page break', board([showProblem, studentCard]).join(',') === 'newPage,showProblem,showSentence(student)');
  const ordered = orderTurnEndDispatches([showProblem, studentCard], true);
  ok('27B: [showProblem, newPage(deferred), showSentence(student)] → [showSentence(student), newPage, showProblem]', board(ordered).join(',') === 'showSentence(student),newPage,showProblem');
  ok('27B: a new model sentence of the new part follows the part card', orderTurnEndDispatches([showProblem, modelCard, studentCard], true).map((p) => p.kind).join(',') === 'student,segment,other');
  ok('27B: no page pending ⇒ the part card first, stream order otherwise', orderTurnEndDispatches([studentCard, showProblem, modelCard], false).map((p) => p.kind).join(',') === 'segment,student,other');
  ok('27B: nothing planned ⇒ nothing', orderTurnEndDispatches([], true).length === 0);
  // fallback: the part page already painted — the student card targets the page before the break
  const brk = { action: 'newPage', title: 'Part 5 · Past simple' };
  const cmds = [
    { action: 'newPage', title: 'Part 3 · Your job' }, { action: 'showProblem', id: 'p1' },
    { action: 'newPage', title: 'Part 4 · Present perfect' }, { action: 'showProblem', id: 'p2' }, { action: 'showSentence', id: 's1' },
    brk, { action: 'showProblem', id: 'p3' },
  ];
  const tgt = previousPageTarget(cmds, brk);
  ok('27B: previous page = "Part 4 · Present perfect", index 1', tgt?.targetPageTitle === 'Part 4 · Present perfect' && tgt?.targetPageIndex === 1);
  ok('27B: an empty page is no page (the canvas skips it)', previousPageTarget([{ action: 'newPage', title: 'A' }, { action: 'showProblem' }, { action: 'newPage', title: 'Empty' }, brk], brk)?.targetPageTitle === 'A');
  ok('27B: removed items do not count', previousPageTarget([{ action: 'newPage', title: 'A' }, { action: 'showProblem' }, { action: 'newPage', title: 'B' }, { action: 'showSentence', id: 'x' }, { action: 'removeItems', ids: ['x'] }, brk], brk)?.targetPageTitle === 'A');
  ok('27B: no break in the log / nothing before it ⇒ null', previousPageTarget(cmds, { action: 'newPage' }) === null && previousPageTarget([brk], brk) === null);
  const V = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('27B: VTR defers the turn-end part card while a part page is pending', V.includes('if (pendingAdvanceNewPageRef.current && TUTOR_STUDENT_CARDS_BEFORE_PART_PAGE) deferredSegmentCardRun = runSegmentCard;'));
  ok('27B: VTR orders the turn-end dispatches and runs them in order', /const turnEndPlanned = orderTurnEndDispatches\(\[[\s\S]{0,400}\], !!deferredSegmentCardRun\);[\s\S]{0,600}for \(const planned of turnEndPlanned\) await planned\.run\(\);/.test(V));
  ok('27B: VTR runs a waiting part card when no sentence board ran', V.includes('if (deferredSegmentCardRun) await (deferredSegmentCardRun as () => Promise<void>)();'));
  ok('27B: VTR fallback — painted break ⇒ previous page target + event', V.includes("const paintedSegmentBreak = !bufferedSegmentBreak && !pendingAdvanceNewPageRef.current ? segmentPageBreakRef.current : null;") && V.includes("onDebugEvent?.('student_card_on_previous_page', "));
  const C = readFileSync(join(__dirname, '..', 'src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx'), 'utf8');
  ok('27B: the canvas relocates a page-targeted showSentence like a scribble', C.includes("if (cmd.action !== 'scribble' && !pageTargeted) { keep.push(cmd); continue; }"));
}

// Task 29 §D3 (GDI run 16, 1056 s): a fixed-script part page takes a topic-shift batch.
{
  const topic: PageDecision = { action: 'newPage', title: 'Question', reason: 'topic shift (dist=0.768) (H4)', event: 'auto_new_page', anchorKey: null };
  ok('29D3: fixed script on the current part page ⇒ none', keepTopicShiftOnSegmentPage(topic, { fixedScript: true, onCurrentSegmentPage: true }).action === 'none');
  ok('29D3: not a fixed script ⇒ unchanged', keepTopicShiftOnSegmentPage(topic, { fixedScript: false, onCurrentSegmentPage: true }) === topic);
  ok('29D3: off the part page ⇒ unchanged', keepTopicShiftOnSegmentPage(topic, { fixedScript: true, onCurrentSegmentPage: false }) === topic);
  const reset: PageDecision = { action: 'newPage', title: 'New', reason: 'explicit student reset', event: 'auto_new_page_reset', anchorKey: null };
  ok('29D3: the student reset still opens a page', keepTopicShiftOnSegmentPage(reset, { fixedScript: true, onCurrentSegmentPage: true }) === reset);
  const cont: PageDecision = { action: 'continuation', title: 'x (cont.)', reason: 'overflow', event: 'auto_new_page_overflow', anchorKey: null };
  ok('29D3: an overflow continuation is unchanged', keepTopicShiftOnSegmentPage(cont, { fixedScript: true, onCurrentSegmentPage: true }) === cont);
  const V5 = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('29D3: VTR logs auto_new_page_skipped_segment_page', V5.includes("onDebugEvent?.('auto_new_page_skipped_segment_page',"));
  ok('29D2: VTR skips spoken-problem boarding on a measured pronunciation turn', /if \(TUTOR_SPOKEN_PROBLEM_BOARD && out\.length === 0 && pronunciationMeasuredThisTurn\) \{\s*onDebugEvent\?\.\('spoken_problem_skipped_pronunciation'/.test(V5));
}

// Task 29 §L (GDI run 16, 0–1 s): the spoken opener's advance flushes its page with the first question.
{
  ok("29L: reason 'spoken_opener' ⇒ next-turn", advancePageFlushTiming({ askPending: false, holdSpent: false, reason: 'spoken_opener' }) === 'next-turn');
  ok('29L: other reasons unchanged', advancePageFlushTiming({ askPending: false, holdSpent: false, reason: 'turns' }) === 'turn-end' && advancePageFlushTiming({ askPending: true, holdSpent: true, reason: 'announced' }) === 'next-turn');
  const V6 = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('29L: VTR defers the spoken-opener page to the end of the first brain turn', /applyResolvedAdvance\(spokenOpenerPlan, spokenOpener\.segmentId, next\);\s*if \(pendingAdvanceNewPageRef\.current\?\.segmentId === next\) \{\s*pendingAdvanceNewPageRef\.current\.afterTurn = true;[\s\S]{0,300}?advancePageFlushTiming\(\{ askPending: false, holdSpent: false, reason: 'spoken_opener' \}\) === 'next-turn'\) \{\s*pendingAdvanceNewPageRef\.current\.flushAfterNextTurn = true;\s*pendingAdvanceNewPageRef\.current\.carriedTurnStarted = false;\s*onDebugEvent\?\.\('auto_newpage_on_advance_deferred_next_turn'/.test(V6));
}

// Task 30 §B2 (GDI run 17, 510 s): an auto-advanced part page carries its authored card.
{
  const authored = { statement: 'Did you attend any business events last year?', kind: 'try_yourself' };
  const card = segmentCardForFlush({ segmentId: 'past-simple', batchHasSegmentCard: false, authored });
  ok('30B2: batch without a card ⇒ the authored card', !!card && card.action === 'showProblem' && card.problem.statement === authored.statement && card.problem.title === 'Try Yourself' && card.problem.format === 'free-response');
  ok('30B2: batch with the segment\'s card ⇒ null', segmentCardForFlush({ segmentId: 'past-simple', batchHasSegmentCard: true, authored }) === null);
  ok('30B2: a segment with no authored card ⇒ null', segmentCardForFlush({ segmentId: 'overview', batchHasSegmentCard: false, authored: null }) === null
    && segmentCardForFlush({ segmentId: 'overview', batchHasSegmentCard: false, authored: { statement: '  ', kind: null } }) === null);
  const V7 = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('30B2 r1: an authored title (concept "Key ideas") is kept', segmentCardForFlush({ segmentId: 'topic-intro', batchHasSegmentCard: false, authored: { statement: '1. We use simple sentences.', kind: 'concept', title: 'Key ideas' } })?.problem.title === 'Key ideas');
  ok('30B2: VTR arms cardOnFlush on a budget advance', V7.includes("if (advanceReason !== 'announced') pendingAdvanceNewPageRef.current.cardOnFlush = true;"));
  ok('30B2: VTR adds the card at the in-batch flush after the break', V7.includes('processed = flushCard ? [segmentBreakCmd, flushCard as unknown as WhiteboardCommand, ...processed] : [segmentBreakCmd, ...processed];'));
  ok('30B2: VTR adds the card at the turn-end flush through the board path', /if \(deferred\.cardOnFlush \|\| deferred\.authored === true\) \{[\s\S]{0,700}?void handleWhiteboardCommandRef\.current\?\.\(\[card as unknown as WhiteboardCommand\]\);\s*onDebugEvent\?\.\('auto_newpage_on_advance_card_added'/.test(V7));
}

// Task 30 §C (GDI run 17, 1112 s): a kill retraction re-arms the segment page; retracted ids are never revised.
{
  const r = rearmAfterKill({ droppedIds: ['showProblem-5'], segmentBreak: true, segmentCardId: 'showProblem-5', pendingRevisionIds: ['showProblem-5', 'showSentence-9'] });
  ok('30C: the dropped break ⇒ rearm, card queued', r.rearm === true && r.requeueCard === true);
  ok('30C: a retracted id is never kept for reviseItems', r.keepIds.length === 1 && r.keepIds[0] === 'showSentence-9');
  const none = rearmAfterKill({ droppedIds: ['showSentence-3'], segmentBreak: false, segmentCardId: null, pendingRevisionIds: ['showSentence-3'] });
  ok('30C: no break in the dropped buffer ⇒ no rearm', none.rearm === false && none.requeueCard === false && none.keepIds.length === 0);
  const V8 = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('30C: VTR dropRenderBuffer re-arms the page as deferred with its card', V8.includes("pendingAdvanceNewPageRef.current = { title: killBreak.title, segmentId: killBreak.segmentId, authored: true, afterTurn: true, cardOnFlush: true };")
    && V8.includes("onDebugEvent?.('advance_page_rearmed_after_kill',"));
  ok('30C: VTR prunes the retracted ids from the pending revisions', V8.includes('if (pendingRevisionRef.current.size !== rearm.keepIds.length) pendingRevisionRef.current = new Set(rearm.keepIds);'));
  ok('30C: VTR never re-defers a retracted id at the retry (so reviseItems never names it)', V8.includes('for (const id of ids) retractedRenderIdsRef.current.add(id);')
    && V8.includes('const deferIds = retryRollbackTargets.filter((id) => !!id && !retractedRenderIdsRef.current.has(id));'));
  // ordering: the rearm runs before the buffer is cleared (it reads the dropped entries)
  ok('30C: VTR rearm reads the buffer before clearing it', V8.indexOf('const killBreakDropped = ') > 0 && V8.indexOf('const killBreakDropped = ') < V8.indexOf("onDebugEvent?.('render_sync_drop',"));
}

// Task 30 fix round 1 S4 (smoke run 167–197 s): "has the card" = the NEW segment's authored statement, nothing else.
{
  const st = 'Have you worked for your current company for a long time?';
  ok('S4: the segment\'s own card in the batch ⇒ has it', batchHasSegmentCard([{ action: 'showProblem', problem: { statement: st } }], st));
  ok('S4: spacing / case / article differences still match', batchHasSegmentCard([{ action: 'showProblem', problem: { statement: 'have you worked for your current company for a long time' } }], st));
  ok('S4: another problem card (the stale old-part card) ⇒ does NOT count', !batchHasSegmentCard([{ action: 'showProblem', problem: { statement: 'Did you attend any business events last year?' } }], st));
  ok('S4: an empty batch / a sentence card ⇒ no card', !batchHasSegmentCard([], st) && !batchHasSegmentCard([{ action: 'showSentence', sentence: st }], st));
  ok('S4: no authored statement ⇒ false', !batchHasSegmentCard([{ action: 'showProblem', problem: { statement: st } }], ''));
  const V9 = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  ok('S4: VTR resolves concept / hook text cards for the flush', V9.includes("return { statement: stripWbEmphasisText(ideas.map((k: string, i: number) => `${i + 1}. ${k}`).join('\\n')), kind: 'concept', title: 'Key ideas' };"));
  ok('S4: VTR in-batch flush uses batchHasSegmentCard on every authored part page', V9.includes('const flushAuthored = deferred.cardOnFlush || deferred.authored === true ? authoredSegmentCard(lessonPlanRef.current, deferred.segmentId, workingLevelRef.current?.level ?? null) : null;')
    && V9.includes('batchHasSegmentCard: batchHasSegmentCard(processed as unknown as Array<{ action: string } & Record<string, unknown>>, flushAuthored.statement),'));
}

console.log(`deferred-page-flush: ${n} cases passed`);
