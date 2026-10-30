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
} from '../src/lib/tutor/whiteboard/deferred-page-flush';

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
  ok('VTR: the auto-advance marks its pending page afterTurn', /applyResolvedAdvance\(autoPlan, segIdNow, autoNext\);\s*if \(pendingAdvanceNewPageRef\.current\?\.segmentId === autoNext\) pendingAdvanceNewPageRef\.current\.afterTurn = true;/.test(VTR));
  // Fix round 1 (review I-1): afterTurn is scoped to the advancing turn —
  // cleared at the next brain turn's start, so the new part's own auto
  // cards open the part page.
  const turnStart = VTR.indexOf('turnNarrationRef.current = [];');
  ok('VTR: afterTurn cleared at the next brain turn start', turnStart > 0
    && /if \(pendingAdvanceNewPageRef\.current\?\.afterTurn\) pendingAdvanceNewPageRef\.current\.afterTurn = false;/.test(VTR.slice(turnStart, turnStart + 800)));
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
  ok('D2: same event name, "at turn end"', VTR2.includes("onDebugEvent?.('auto_newpage_on_advance_flushed', `${deferred.segmentId}: ${deferred.title} at turn end`)"));
}

console.log(`deferred-page-flush: ${n} cases passed`);
