// scripts/test-deferred-page-flush.ts
// Run: npx tsx scripts/test-deferred-page-flush.ts
//
// Two newPage commands back to back left an empty page titled
// "Hook: Graph linear inequalities on a coordinate plane using boundary…"
// in front of the page for the student's problem.
import { strict as assert } from 'node:assert';
import {
  decideDeferredPageFlush,
  emptyPageIndexes,
  isPageContentAction,
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

console.log(`deferred-page-flush: ${n} cases passed`);
