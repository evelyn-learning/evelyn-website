/**
 * show_energy_bars is a MECHANICS tool — its renderer hardcodes a
 * "KE (kinetic)" / "PE (gravitational)" legend.
 *
 * Regression under test (session-1783680636885, 2026-07-10): in a
 * photosynthesis lesson the brain called show_energy_bars with
 * ke:100 ("Sunlight hitting a leaf") and pe:100 ("Stored as sugar").
 * The board rendered a kinetic/gravitational legend for light and
 * chemical energy; the student asked "what does red mean?" twice and
 * the tutor — which cannot see the legend — bluffed an answer.
 * Nothing in the tool description said it was mechanics-only.
 *
 * Run: npx tsx scripts/test-energy-bars-scope.ts
 */
import { strict as assert } from 'node:assert';
import { WHITEBOARD_TOOLS } from '../src/app/tutor/hooks/toolDefinitions';
import { LEGEND_ENTRIES } from '../src/app/tutor/components/whiteboard/EnergyBarsRenderer';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const tool = WHITEBOARD_TOOLS.find((t) => t.name === 'show_energy_bars');

function main() {
  console.log('show_energy_bars — mechanics-only scoping\n');

  test('tool exists', () => {
    assert.ok(tool, 'show_energy_bars must be registered');
  });

  test('description declares the mechanics-only scope', () => {
    const d = tool!.description;
    assert.match(d, /MECHANICS ONLY/, 'must state mechanics-only up front');
    assert.match(d, /kinetic\/gravitational/i, 'must say the legend is fixed to kinetic/gravitational');
  });

  test('description names the non-mechanical energies it must NOT be used for', () => {
    const d = tool!.description;
    for (const word of ['light', 'chemical', 'photosynthesis']) {
      assert.ok(d.toLowerCase().includes(word), `must warn about ${word} energy`);
    }
  });

  test('description points at the right alternative for energy-flow narratives', () => {
    assert.match(tool!.description, /show_diagram/, 'must redirect to show_diagram');
  });

  test('the legend the brain cannot see is still kinetic/gravitational (scope claim is true)', () => {
    const labels = LEGEND_ENTRIES.map((e) => e.label);
    assert.ok(labels.includes('KE (kinetic)'), 'renderer legend still hardcodes KE (kinetic)');
    assert.ok(labels.includes('PE (gravitational)'), 'renderer legend still hardcodes PE (gravitational)');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
