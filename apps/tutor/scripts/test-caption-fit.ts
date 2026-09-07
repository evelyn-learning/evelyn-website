/** Caption fitter helpers — live check 7 (portal-8ed0fb65). Run: npm run test:caption-fit */
import { strict as assert } from 'node:assert';
import { scanMathSpans, tokenizeCaptionMathAtomic, captionMeasureProxy, holdBackUnbalancedMathTail, isCurrencyDollarAt } from '../src/lib/tutor/whiteboard/caption-fit';
let n = 0;
const LIVE = '"$3 off *each* shirt" — that discount applies to every shirt, not just the first one. So with that fixed, what does the left side simplify to once you combine $-6$ and $4$';
assert.equal(isCurrencyDollarAt('"$3 off each', 1), true); n++;
assert.equal(isCurrencyDollarAt('$3(x-2)$', 0), false); n++;
assert.equal(isCurrencyDollarAt('costs $3.60, and', 6), true); n++;
assert.equal(isCurrencyDollarAt('$-6$', 0), false); n++;
{
  const { spans, unbalancedAt } = scanMathSpans(LIVE);
  assert.equal(spans.length, 2); assert.equal(unbalancedAt, null); n += 2;
  assert.equal(LIVE.slice(spans[0].start, spans[0].end + 1), '$-6$'); n++;
  assert.equal(LIVE.slice(spans[1].start, spans[1].end + 1), '$4$'); n++;
}
assert.ok(captionMeasureProxy(LIVE).length > LIVE.length - 6, 'proxy must not collapse prose into a fake span'); n++;
assert.equal(captionMeasureProxy('so $\\frac{x}{2}$ here'), 'so x2 here'); n++;
{
  const toks = tokenizeCaptionMathAtomic(LIVE);
  assert.ok(toks.includes('"$3'), JSON.stringify(toks.slice(0, 4))); n++;
  assert.ok(toks.includes('$-6$')); n++;
  assert.deepEqual(tokenizeCaptionMathAtomic('so $y = 3$ here'), ['so', '$y = 3$', 'here']); n++;
  assert.deepEqual(tokenizeCaptionMathAtomic('costs $3.60, and $6.00.'), ['costs', '$3.60,', 'and', '$6.00.']); n++;
}
assert.equal(holdBackUnbalancedMathTail('so $\\frac{x}{2'), 'so '); n++;
assert.equal(holdBackUnbalancedMathTail('costs $3.60, and'), 'costs $3.60, and'); n++;
assert.equal(holdBackUnbalancedMathTail('combine $-6$ and $4'), 'combine $-6$ and '); n++;
assert.equal(holdBackUnbalancedMathTail('combine $-6$ and $4$'), 'combine $-6$ and $4$'); n++;
assert.equal(holdBackUnbalancedMathTail(LIVE), LIVE); n++;
console.log(`caption-fit: ${n} assertions passed`);
