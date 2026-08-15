/**
 * Tests for the FractionBar width-aware layout (2026-08-07,
 * embed-1786139818867): a single grid-style item (2×2, 56 SVG units wide)
 * with label "One planted square out of four" produced a ~104-unit viewBox
 * while the 13px centered label needs ~190 — the SVG viewport clipped it on
 * both sides to "anted square out". Same disease the R38 title fix removed
 * for the <h3> title, but per-item labels still lived inside the SVG.
 *
 * Run: npx tsx scripts/test-fraction-bar-layout.ts
 */
import {
  estimateLabelWidth,
  wrapLabel,
  computeFractionLayout,
  LABEL_LINE_HEIGHT,
} from '../src/app/tutor/components/whiteboard/fraction-bar-layout';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ── The live repro: single grid item, long label ──
{
  const { positions, viewWidth } = computeFractionLayout(
    [{ numerator: 1, denominator: 4, label: 'One planted square out of four', style: 'grid' }],
    'horizontal',
  );
  const p = positions[0];
  const longestLine = Math.max(...p.labelLines.map((l) => estimateLabelWidth(l)));
  check('viewBox is wide enough for the longest label line', viewWidth >= longestLine, `view=${viewWidth} label=${longestLine}`);
  check('label is centered inside the viewBox (no left clip)', p.labelX - longestLine / 2 >= 0, `labelX=${p.labelX}`);
  check('label is centered inside the viewBox (no right clip)', p.labelX + longestLine / 2 <= viewWidth, `labelX=${p.labelX} view=${viewWidth}`);
  check('shape stays centered under the label', Math.abs((p.shapeX + p.shapeW / 2) - p.labelX) < 0.01);
  check('grid shape keeps its true size (2×2 of 28)', p.shapeW === 56 && p.shapeH === 56, `${p.shapeW}x${p.shapeH}`);
}

// ── Short label: layout identical to the shape-only baseline ──
{
  const { positions, viewWidth } = computeFractionLayout(
    [{ numerator: 1, denominator: 4, label: '1/4', style: 'grid' }],
    'horizontal',
  );
  const p = positions[0];
  check('short label: item width stays the shape width', p.w === 56, `w=${p.w}`);
  check('short label: shape not offset', p.shapeX === p.x);
  check('short label: baseline viewWidth preserved (>=100 floor)', viewWidth >= 100);
}

// ── Very long label wraps instead of growing the view unboundedly ──
{
  const long = 'The one shaded square that we planted with tomatoes out of the four equal garden squares';
  const { positions, viewHeight } = computeFractionLayout(
    [{ numerator: 1, denominator: 4, label: long, style: 'grid' }],
    'horizontal',
  );
  const p = positions[0];
  check('very long label wraps to multiple lines', p.labelLines.length >= 2, `lines=${p.labelLines.length}`);
  check('wrapped lines keep every word', p.labelLines.join(' ') === long);
  check('no wrapped line exceeds the wrap cap width', p.labelLines.every((l) => estimateLabelWidth(l) <= 240), JSON.stringify(p.labelLines));
  check('viewHeight grows for the extra lines', viewHeight >= p.shapeY + p.shapeH + 18 + (p.labelLines.length - 1) * LABEL_LINE_HEIGHT);
}

// ── Multi-item horizontal: items don't overlap and both labels fit ──
{
  const { positions, viewWidth } = computeFractionLayout(
    [
      { numerator: 1, denominator: 2, label: 'Your share of the chocolate bar', style: 'bar' },
      { numerator: 1, denominator: 4, label: 'One planted square out of four', style: 'grid' },
    ],
    'horizontal',
  );
  const [a, b] = positions;
  check('second item starts after the first item box', b.x >= a.x + a.w, `a=[${a.x},${a.w}] b.x=${b.x}`);
  check('both labels fit inside the view', positions.every((p) => {
    const w = Math.max(...p.labelLines.map((l) => estimateLabelWidth(l)));
    return p.labelX - w / 2 >= 0 && p.labelX + w / 2 <= viewWidth;
  }));
}

// ── Vertical layout still stacks ──
{
  const { positions } = computeFractionLayout(
    [
      { numerator: 1, denominator: 2, label: 'top', style: 'bar' },
      { numerator: 1, denominator: 3, label: 'bottom', style: 'bar' },
    ],
    'vertical',
  );
  check('vertical: second item below first', positions[1].y > positions[0].y);
}

// ── Default label (no label prop) behaves like a short label ──
{
  const { positions } = computeFractionLayout(
    [{ numerator: 3, denominator: 4 }],
    'horizontal',
  );
  check('default label renders one line', positions[0].labelLines.length === 1 && positions[0].labelLines[0] === '3/4');
}

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} fraction-bar-layout tests passed.`);
