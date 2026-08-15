/**
 * SVG text-extent audit/regression harness (2026-08-07) — headless
 * verification of the label-clipping bug class
 * (docs/svg-renderer-clip-audit-2026-08-07.md, FractionBar disease 009dc645).
 *
 * Renders real components via renderToStaticMarkup with worst-case payloads,
 * then geometrically checks every <text>/<tspan> against the svg's viewBox
 * (checker: scripts/lib/svg-text-extents.ts). No brain, no browser, no e2e.
 *
 * Cases live in scripts/audit-cases/batch*.ts (one file per fix batch, so
 * parallel fixes never conflict). A case with expectViolation:true documents
 * a known-unfixed clip; flipping it to false as the fix lands turns it into
 * a permanent regression test. The FractionBarRenderer control below must
 * always be clean.
 *
 * Run: npx tsx scripts/audit-svg-text-extents.ts
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { findViolations, type AuditCase } from './lib/svg-text-extents';
import FractionBarRenderer from '../src/app/tutor/components/whiteboard/FractionBarRenderer';
import { CASES as BATCH1 } from './audit-cases/batch1';
import { CASES as BATCH2 } from './audit-cases/batch2';
import { CASES as BATCH3 } from './audit-cases/batch3';
import { CASES as BATCH4 } from './audit-cases/batch4';
import { CASES as BATCH5 } from './audit-cases/batch5';
import { CASES as BATCH6 } from './audit-cases/batch6';

const CONTROL: AuditCase = {
  name: 'FractionBarRenderer (FIXED — control)',
  expectViolation: false,
  el: React.createElement(FractionBarRenderer, {
    items: [{ numerator: 1, denominator: 4, label: 'One planted square out of four', style: 'grid' }],
  }),
};

const CASES: AuditCase[] = [CONTROL, ...BATCH1, ...BATCH2, ...BATCH3, ...BATCH4, ...BATCH5, ...BATCH6];

let pass = 0, fail = 0, openViolations = 0;
for (const c of CASES) {
  let markup = '';
  try {
    markup = renderToStaticMarkup(c.el);
  } catch (err) {
    console.error(`  ✗ ${c.name} — render threw: ${(err as Error).message}`);
    fail++;
    continue;
  }
  const violations = findViolations(markup);
  const has = violations.length > 0;
  const ok = has === c.expectViolation;
  if (ok) pass++; else fail++;
  if (has && c.expectViolation) openViolations++;
  console.log(`  ${ok ? '✓' : '✗'} ${c.name} — ${has ? `${violations.length} violation(s)` : 'clean'}${c.expectViolation ? ' (known-unfixed)' : ' (expected clean)'}`);
  if (!ok || c.expectViolation) {
    for (const v of violations.slice(0, 3)) {
      console.log(`      "${v.text}" anchor=${v.anchor} x=${v.x} est=[${v.est}] view=[${v.view}]`);
    }
  }
}

console.log(`\naudit-svg-text-extents: ${pass} as-expected, ${fail} unexpected, ${openViolations} known-unfixed`);
if (fail > 0) process.exit(1);
