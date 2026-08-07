/**
 * SVG text-extent audit harness (2026-08-07) — headless verification of the
 * label-clipping bug class found by the whiteboard renderer audit (the
 * FractionBar "anted square out" disease, commit 009dc645).
 *
 * Renders real components via renderToStaticMarkup with the audit's
 * worst-case payloads, then geometrically checks every <text>/<tspan>
 * against the svg's viewBox using the same 0.55em char-width heuristic the
 * fixed layout uses. No brain, no browser, no e2e.
 *
 * This is an AUDIT tool, not a regression test: violations are EXPECTED for
 * the renderers listed until their fixes land (each then moves to the
 * negative-control list). FractionBarRenderer is the negative control — it
 * must report zero violations.
 *
 * Run: npx tsx scripts/audit-svg-text-extents.ts
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import FractionBarRenderer from '../src/app/tutor/components/whiteboard/FractionBarRenderer';
import { TapeDiagramRenderer } from '../src/app/tutor/components/whiteboard/TapeDiagramRenderer';
import FoodWebRenderer from '../src/app/tutor/components/whiteboard/FoodWebRenderer';
import { PieChartRenderer } from '../src/app/tutor/components/whiteboard/PieChartRenderer';
import { FractionComparisonRenderer } from '../src/app/tutor/components/whiteboard/FractionComparisonRenderer';
import CoordinatePlaneRenderer from '../src/app/tutor/components/whiteboard/CoordinatePlaneRenderer';
import { TreeRenderer } from '../src/app/tutor/components/whiteboard/TreeRenderer';
import { VennDiagramRenderer } from '../src/app/tutor/components/whiteboard/VennDiagramRenderer';
import { BarChartRenderer } from '../src/app/tutor/components/whiteboard/BarChartRenderer';

const CHAR_FACTOR = 0.55;

interface Violation { text: string; anchor: string; x: number; est: [number, number]; view: [number, number] }

/** Parse every <text> (and its <tspan>s) in the markup and return the ones
 *  whose estimated horizontal extent escapes the viewBox. Texts carrying a
 *  transform (rotated axis labels etc.) are skipped — their x is not in
 *  viewport space. */
function findViolations(svgMarkup: string): Violation[] {
  const vbMatch = svgMarkup.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/);
  if (!vbMatch) return [];
  const vbX = Number(vbMatch[1]);
  const vbW = Number(vbMatch[3]);
  const out: Violation[] = [];
  const textRe = /<text([^>]*)>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = textRe.exec(svgMarkup)) !== null) {
    const attrs: Record<string, string> = {};
    const attrRe = /([\w-]+)="([^"]*)"/g;
    let a: RegExpExecArray | null;
    while ((a = attrRe.exec(m[1])) !== null) attrs[a[1]] = a[2];
    if (attrs.transform) continue; // rotated/translated — x not comparable
    const anchor = attrs['text-anchor'] ?? 'start';
    const fs = Number(attrs['font-size'] ?? 12);
    const baseX = Number(attrs.x ?? 0);
    // Lines: tspans with their own x, else the whole content as one line.
    const lines: Array<{ x: number; content: string }> = [];
    const tspanRe = /<tspan([^>]*)>([\s\S]*?)<\/tspan>/g;
    let t: RegExpExecArray | null;
    while ((t = tspanRe.exec(m[2])) !== null) {
      const tx = t[1].match(/\bx="([-\d.]+)"/);
      lines.push({ x: tx ? Number(tx[1]) : baseX, content: t[2] });
    }
    if (lines.length === 0) lines.push({ x: baseX, content: m[2] });
    for (const line of lines) {
      const content = line.content.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, 'x').trim();
      if (!content) continue;
      if (!Number.isFinite(line.x) || !Number.isFinite(fs)) continue;
      const w = content.length * fs * CHAR_FACTOR;
      const left = anchor === 'middle' ? line.x - w / 2 : anchor === 'end' ? line.x - w : line.x;
      const right = left + w;
      if (left < vbX - 1 || right > vbX + vbW + 1) {
        out.push({ text: content.slice(0, 50), anchor, x: line.x, est: [Math.round(left), Math.round(right)], view: [vbX, vbX + vbW] });
      }
    }
  }
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CASES: Array<{ name: string; expectViolation: boolean; el: React.ReactElement<any> }> = [
  {
    // Negative control — the fixed renderer must be clean.
    name: 'FractionBarRenderer (FIXED — control)',
    expectViolation: false,
    el: React.createElement(FractionBarRenderer, {
      items: [{ numerator: 1, denominator: 4, label: 'One planted square out of four', style: 'grid' }],
    }),
  },
  {
    name: 'TapeDiagramRenderer bars[].name',
    expectViolation: true,
    el: React.createElement(TapeDiagramRenderer, {
      figure: { bars: [{ name: "Marcus's savings", segments: [{ length: 4, label: 'x' }, { length: 8, label: '8' }] }], sharedScale: true },
    }),
  },
  {
    name: 'FoodWebRenderer level labels (deterministic)',
    expectViolation: true,
    el: React.createElement(FoodWebRenderer, {
      species: [
        { id: 'grass', label: 'Grass', level: 1 },
        { id: 'rabbit', label: 'Rabbit', level: 2 },
        { id: 'fox', label: 'Fox', level: 3 },
      ],
      edges: [{ from: 'grass', to: 'rabbit' }, { from: 'rabbit', to: 'fox' }],
    }),
  },
  {
    name: 'PieChartRenderer legend slices[].label',
    expectViolation: true,
    el: React.createElement(PieChartRenderer, {
      figure: {
        slices: [
          { label: 'Students who bike to school', value: 30, proportion: 0.3 },
          { label: 'Walk', value: 70, proportion: 0.7 },
        ],
        total: 100,
      },
    }),
  },
  {
    name: 'FractionComparisonRenderer bar label',
    expectViolation: true,
    el: React.createElement(FractionComparisonRenderer, {
      figure: { fractions: [{ numerator: 2, denominator: 3, label: 'two-thirds of the pizza' }], style: 'bar' },
    }),
  },
  {
    name: 'CoordinatePlaneRenderer points[].label at xMax',
    expectViolation: true,
    el: React.createElement(CoordinatePlaneRenderer, {
      xRange: [-10, 10], yRange: [-10, 10],
      points: [{ x: 10, y: 5, label: '(10, 5) maximum' }],
    }),
  },
  {
    name: 'TreeRenderer in-SVG title over node-only viewBox',
    expectViolation: true,
    el: React.createElement(TreeRenderer, {
      title: 'Probability of drawing two red cards without replacement',
      type: 'probability',
      root: {
        label: 'Start',
        children: [
          { label: 'Red', probability: '1/2', node: { label: 'R' } },
          { label: 'Black', probability: '1/2', node: { label: 'B' } },
        ],
      },
    }),
  },
  {
    name: 'VennDiagramRenderer title + set labels',
    expectViolation: true,
    el: React.createElement(VennDiagramRenderer, {
      title: 'Students who play a sport and students who play an instrument',
      sets: [{ label: 'Plays a school sport' }, { label: 'Plays an instrument' }],
      regions: { a: { items: ['Ravi'] }, b: { items: ['Chloe'] }, ab: { items: ['Sam'] } },
    }),
  },
  {
    name: 'BarChartRenderer last category label',
    expectViolation: true,
    el: React.createElement(BarChartRenderer, {
      figure: {
        categories: ['Coal', 'Gas', 'Nuclear', 'Hydro', 'Wind', 'Solar', 'Biomass', 'Renewable electricity sources'],
        values: [30, 25, 15, 10, 12, 8, 6, 4],
        yMin: 0, yMax: 35, yStep: 5,
      },
    }),
  },
];

let pass = 0, fail = 0;
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
  console.log(`  ${ok ? '✓' : '✗'} ${c.name} — ${has ? `${violations.length} violation(s)` : 'clean'}${c.expectViolation ? ' (expected violation)' : ' (expected clean)'}`);
  for (const v of violations.slice(0, 3)) {
    console.log(`      "${v.text}" anchor=${v.anchor} x=${v.x} est=[${v.est}] view=[${v.view}]`);
  }
}

console.log(`\naudit-svg-text-extents: ${pass} as-expected, ${fail} unexpected`);
if (fail > 0) process.exit(1);
