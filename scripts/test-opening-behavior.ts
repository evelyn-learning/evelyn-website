/**
 * Unit test for Task B6 — resolveOpeningBehavior session-mode & journey gating
 * (src/lib/tutor/ai/opening-behavior.ts). See
 * project_tutor_pedagogy_opener_calibration + .superpowers/sdd/task-B6-brief.md.
 *
 * Run: npx tsx scripts/test-opening-behavior.ts
 * No framework — matches the test:conic / test:pedagogy-b4 / test:pedagogy-b5 pattern.
 */

import { strict as assert } from 'node:assert';
import {
  resolveOpeningBehavior,
  type OpeningInput,
  type OpeningBehavior,
} from '../src/lib/tutor/ai/opening-behavior';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

// ── Baseline input — every field explicit so each test only overrides what it
//    needs to exercise. Represents a plain subscribed-new student with no
//    special journey signals (falls through to rule 10 untouched). ─────────
const base: OpeningInput = {
  targetKind: 'lessonNode',
  isTrial: false,
  hasPortalContext: true,
  hasPriorSessions: false,
  diagnosticTaken: false,
  resume: { hasLiveCheckpoint: false, checkpointStale: false },
  nodeCompleted: false,
  courseComplete: false,
};

function assertBehavior(
  actual: OpeningBehavior,
  expected: OpeningBehavior,
) {
  assert.deepEqual(actual, expected);
}

function main() {
  console.log('resolveOpeningBehavior — Task B6\n');

  // ── Rule 1: diagnostic session (Diego's diagnostic variant) ────────────
  test('Rule 1: targetKind diagnostic -> journey diagnostic, opener none, calibration none', () => {
    const input: OpeningInput = { ...base, targetKind: 'diagnostic' };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'diagnostic',
      journey: 'diagnostic',
      opener: 'none',
      calibration: 'none',
    });
  });

  // ── Rule 2: live (fresh) checkpoint — Ravi picking back up mid-lesson ───
  test('Rule 2: live checkpoint (not stale) -> resume-live, opener pickup, calibration none', () => {
    const input: OpeningInput = {
      ...base,
      hasPriorSessions: true,
      resume: { hasLiveCheckpoint: true, checkpointStale: false },
    };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'resume-live',
      opener: 'pickup',
      calibration: 'none',
    });
  });

  // ── Rule 3: stale checkpoint — Ravi returning weeks later ───────────────
  test('Rule 3: stale checkpoint -> resume-stale, opener proactive, calibration light', () => {
    const input: OpeningInput = {
      ...base,
      hasPriorSessions: true,
      resume: { hasLiveCheckpoint: true, checkpointStale: true },
    };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'resume-stale',
      opener: 'proactive',
      calibration: 'light',
    });
  });

  // ── Rule 4: course complete ──────────────────────────────────────────────
  test('Rule 4: courseComplete -> course-complete, opener warm-resume, calibration none', () => {
    const input: OpeningInput = { ...base, hasPriorSessions: true, courseComplete: true };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'course-complete',
      opener: 'warm-resume',
      calibration: 'none',
    });
  });

  // ── Rule 5: node revisit ─────────────────────────────────────────────────
  test('Rule 5: nodeCompleted -> node-revisit, opener warm-resume, calibration none', () => {
    const input: OpeningInput = { ...base, hasPriorSessions: true, nodeCompleted: true };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'node-revisit',
      opener: 'warm-resume',
      calibration: 'none',
    });
  });

  // ── Rule 6: trial demo (Sam) ─────────────────────────────────────────────
  test('Rule 6: isTrial -> demo-trial, opener proactive, calibration full', () => {
    const input: OpeningInput = { ...base, isTrial: true, hasPortalContext: true };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'demo-trial',
      opener: 'proactive',
      calibration: 'full',
    });
  });

  // ── Rule 7: logged-out showcase demo (Maya / anon — no StudentContext) ──
  test('Rule 7: !hasPortalContext -> demo-logged-out, opener proactive, calibration full', () => {
    const input: OpeningInput = { ...base, isTrial: false, hasPortalContext: false };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'demo-logged-out',
      opener: 'proactive',
      calibration: 'full',
    });
  });

  // ── Rule 8: subscribed returning (Priya) ─────────────────────────────────
  test('Rule 8: hasPriorSessions -> subscribed-returning, opener warm-resume, calibration none', () => {
    const input: OpeningInput = { ...base, hasPriorSessions: true };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'subscribed-returning',
      opener: 'warm-resume',
      calibration: 'none',
    });
  });

  // ── Rule 9: subscribed new, diagnostic already taken (Diego, lessonNode) ─
  test('Rule 9: subscribed new + diagnosticTaken -> subscribed-new-diagnosed, opener proactive, calibration none', () => {
    const input: OpeningInput = { ...base, diagnosticTaken: true };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'subscribed-new-diagnosed',
      opener: 'proactive',
      calibration: 'none',
    });
  });

  // ── Rule 10: subscribed new, no diagnostic (Noah — catch-all) ───────────
  test('Rule 10: subscribed new, no diagnostic -> subscribed-new, opener proactive, calibration light', () => {
    const input: OpeningInput = { ...base };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'subscribed-new',
      opener: 'proactive',
      calibration: 'light',
    });
  });

  // ── Precedence tests ──────────────────────────────────────────────────────
  test('Precedence: diagnostic + live checkpoint still -> diagnostic (rule 1 beats rule 2)', () => {
    const input: OpeningInput = {
      ...base,
      targetKind: 'diagnostic',
      hasPriorSessions: true,
      resume: { hasLiveCheckpoint: true, checkpointStale: false },
    };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'diagnostic',
      journey: 'diagnostic',
      opener: 'none',
      calibration: 'none',
    });
  });

  test('Precedence: live checkpoint on returning subscribed -> resume-live (rule 2 beats rule 8)', () => {
    const input: OpeningInput = {
      ...base,
      hasPriorSessions: true,
      resume: { hasLiveCheckpoint: true, checkpointStale: false },
    };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'resume-live',
      opener: 'pickup',
      calibration: 'none',
    });
  });

  test('Precedence: trial + hasPriorSessions -> demo-trial (rule 6 beats rule 8)', () => {
    const input: OpeningInput = {
      ...base,
      isTrial: true,
      hasPriorSessions: true,
    };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'lessonNode',
      journey: 'demo-trial',
      opener: 'proactive',
      calibration: 'full',
    });
  });

  // ── freestyle passthrough — mode does not change opener/calibration logic ─
  test('freestyle targetKind passes through as mode but does not alter journey rules', () => {
    const input: OpeningInput = { ...base, targetKind: 'freestyle', hasPriorSessions: true };
    assertBehavior(resolveOpeningBehavior(input), {
      mode: 'freestyle',
      journey: 'subscribed-returning',
      opener: 'warm-resume',
      calibration: 'none',
    });
  });

  // ── Exhaustiveness: every branch returns a defined OpeningBehavior ───────
  test('exhaustiveness: all 10 rule branches return a fully-defined OpeningBehavior', () => {
    const inputs: OpeningInput[] = [
      { ...base, targetKind: 'diagnostic' },
      { ...base, resume: { hasLiveCheckpoint: true, checkpointStale: false } },
      { ...base, resume: { hasLiveCheckpoint: true, checkpointStale: true } },
      { ...base, courseComplete: true },
      { ...base, nodeCompleted: true },
      { ...base, isTrial: true },
      { ...base, hasPortalContext: false },
      { ...base, hasPriorSessions: true },
      { ...base, diagnosticTaken: true },
      { ...base },
    ];
    for (const input of inputs) {
      const result = resolveOpeningBehavior(input);
      assert.ok(result, 'result must be defined');
      assert.ok(result.mode, 'mode must be defined');
      assert.ok(result.journey, 'journey must be defined');
      assert.ok(result.opener, 'opener must be defined');
      assert.ok(result.calibration, 'calibration must be defined');
    }
  });

  // ── Summary ────────────────────────────────────────────────────────────
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
