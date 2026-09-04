/**
 * portal-704e3e01 @1122.5s: page titled "Try: Solve for x and type your
 * answer as a number: 2(x + 5) − 3 = 4x −" over a card reading
 * "Solve for x: x/2 + 3 = x/5 + 6." — the authored problem's text on the
 * generated substitute's page, cut mid-expression by a fixed slice(0, 70).
 *
 * Usage: npx tsx scripts/test-page-title.ts  (npm run test:page-title)
 */
import { truncatePageTitle, retitleFromBatch } from '../src/lib/tutor/whiteboard/page-title';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── truncation ───
const LIVE = 'Try: Solve for x and type your answer as a number: 2(x + 5) − 3 = 4x − 11';
{
  const t = truncatePageTitle(LIVE, 70);
  check('never ends on a dangling operator', !/[−\-+*/=]\s*$/.test(t.replace(/…$/, '')), JSON.stringify(t));
  check('marks the cut with an ellipsis', t.endsWith('…'), JSON.stringify(t));
  check('stays within the budget', t.length <= 70, `len=${t.length}`);
}
{
  const short = 'Recap';
  check('short titles pass through untouched', truncatePageTitle(short, 70) === short);
}
{
  const exact = 'Try: How many solutions does 3(2x − 4) = 6x − 12 have?';
  check('a title under the budget is unchanged', truncatePageTitle(exact, 70) === exact);
}
{
  check('empty input is safe', truncatePageTitle('', 70) === '');
}
{
  // A single unbroken run longer than the budget still has to be cut.
  const runOn = 'A'.repeat(120);
  const t = truncatePageTitle(runOn, 70);
  check('unbroken run is still bounded', t.length <= 70, `len=${t.length}`);
}

// ─── retitling ───
{
  const r = retitleFromBatch({
    deferredTitle: 'Try: Solve for x and type your answer as a number: 2(x + 5) − 3 = 4x −',
    renderedStatement: 'Solve for x: $\\frac{x}{2} + 3 = \\frac{x}{5} + 6$. Type your answer as a number.',
  });
  check('portal-704e3e01: page is titled from the problem that actually renders',
    r.retitled === true && r.title.includes('frac{x}{2}'), JSON.stringify(r));
  check('the retitled page keeps the stage prefix', r.title.startsWith('Try: '), JSON.stringify(r));
}
{
  const r = retitleFromBatch({ deferredTitle: 'Recap', renderedStatement: undefined });
  check('no rendered problem → deferred title stands',
    r.retitled === false && r.title === 'Recap', JSON.stringify(r));
}
{
  // When the authored card IS what rendered, the title must not churn.
  const r = retitleFromBatch({
    deferredTitle: 'Try: Solve for x: 4x + 7 = 9x − 13',
    renderedStatement: 'Solve for x: 4x + 7 = 9x − 13',
  });
  check('matching statement does not retitle', r.retitled === false, JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
