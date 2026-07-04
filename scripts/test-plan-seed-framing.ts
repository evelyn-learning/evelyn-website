/**
 * Unit test — Task C1: plan-as-seed framing by session mode.
 *
 * formatLessonPlanContext gained an OPTIONAL LessonPlanContext.sessionMode
 * ('demo' | 'subscribed'). When present it appends a mode-specific framing
 * clause after the advance/mark trailer:
 *   - subscribed: seed-not-script + LO coverage contract + prerequisite hint
 *   - demo: raw-material-only + prerequisite hint (NO coverage contract)
 * When ABSENT the rendered block must be byte-identical to the pre-C1
 * output (the flag-off guarantee — the client only sets the field when
 * NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER is on). This suite pins:
 *   1. absence ⇒ none of the new framing strings + all legacy markers,
 *   2. subscribed framing strings + PROBLEM-LOCK intact,
 *   3. demo framing strings, no coverage contract, PROBLEM-LOCK intact,
 *   4. off-topic redaction + COMPLETED-note behavior unaffected by mode.
 *
 * Run: npx tsx scripts/test-plan-seed-framing.ts   (npm run test:pedagogy-c1)
 * No framework — matches the test:pedagogy-b4 / board-truth pattern.
 */

import { strict as assert } from 'node:assert';
import { formatLessonPlanContext, type LessonPlanContext } from '../src/lib/tutor/voice/claude-brain';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

// ---------------------------------------------------------------------------
// Fixture: 2 LOs, try_yourself current segment WITH authored problem text
// (so PROBLEM-LOCK renders), one off-topic segment (redaction spot-check),
// one completed segment (COMPLETED-note spot-check).
// ---------------------------------------------------------------------------
function makeCtx(sessionMode?: 'demo' | 'subscribed'): LessonPlanContext {
  return {
    plan: {
      id: 'plan-quadratics-1',
      title: 'Introducing Quadratic Expressions',
      grade: '9',
      subject: 'math',
      los: [
        { id: 'lo-1', description: 'Expand a product of two linear factors' },
        { id: 'lo-2', description: 'Identify a quadratic expression in standard form' },
      ],
      estimatedMinutes: 25,
    },
    currentSegmentId: 'seg-try-1',
    currentSegment: {
      id: 'seg-try-1',
      kind: 'try_yourself',
      goal: 'Student expands a binomial product unaided',
      problem: 'Expand (x + 3)(x + 5) and write the result in standard form.',
      expectedAnswer: 'x^2 + 8x + 15',
    },
    segmentIndex: [
      { id: 'seg-concept-1', kind: 'concept' },
      { id: 'seg-try-1', kind: 'try_yourself' },
      { id: 'seg-bait-1', kind: 'try_yourself', offTopic: true },
      { id: 'seg-recap-1', kind: 'recap' },
    ],
    completedSegmentIds: ['seg-concept-1'],
    ...(sessionMode ? { sessionMode } : {}),
  };
}

// New-framing marker strings (must appear ONLY when the matching mode is set).
const SUBSCRIBED_MARKERS = [
  'seed, not a script',
  'coverage contract',
  'Freedom over the *path*',
];
const DEMO_MARKER = 'raw material only — no obligation';
const PREREQ_HINT =
  'To meet a student below the topic, step down to the nearest prerequisite';

// Legacy markers that must survive in EVERY mode (and unchanged with mode absent).
const LEGACY_MARKERS = [
  'Stay within the current segment until its goal is met. Move on with',
  'advance_lesson({ to: "next" }). Branch with advance_lesson({ to: "<id>" }).',
  'Mark progress with mark_segment_complete({ segmentId, masteryDelta? }).',
  'PROBLEM-LOCK for this segment: render the EXACT problem / question text',
];

function main() {
  console.log('Task C1 — plan-as-seed framing by session mode\n');

  const offOutput = formatLessonPlanContext(makeCtx());
  const subOutput = formatLessonPlanContext(makeCtx('subscribed'));
  const demoOutput = formatLessonPlanContext(makeCtx('demo'));

  // -- 1. sessionMode absent: byte-identical / flag-off guarantee ----------
  test('absent mode: contains NO new framing strings', () => {
    for (const m of [...SUBSCRIBED_MARKERS, DEMO_MARKER, PREREQ_HINT]) {
      assert.ok(!offOutput.includes(m), `unexpected new marker in mode-absent output: "${m}"`);
    }
  });

  test('absent mode: all legacy trailer lines + PROBLEM-LOCK still present', () => {
    for (const m of LEGACY_MARKERS) {
      assert.ok(offOutput.includes(m), `missing legacy marker: "${m}"`);
    }
  });

  test('absent mode: output equals the pre-C1 snapshot shape (framing removal is a pure no-op)', () => {
    // The framing block is inserted between the mark_segment_complete
    // trailer and the COMPLETED note. With mode absent, those two must be
    // directly adjacent — exactly the pre-C1 layout (one '\n' from the
    // array join + the completedNote's own leading '\n\n').
    assert.ok(
      offOutput.includes(
        'Mark progress with mark_segment_complete({ segmentId, masteryDelta? }).\n\n\nCOMPLETED segments this session:',
      ),
      'expected trailer to be immediately followed by the COMPLETED note (no inserted framing)',
    );
  });

  // -- 2. subscribed framing ------------------------------------------------
  test('subscribed: seed-not-script + coverage contract + path/destination present', () => {
    for (const m of SUBSCRIBED_MARKERS) {
      assert.ok(subOutput.includes(m), `missing subscribed marker: "${m}"`);
    }
  });

  test('subscribed: prerequisite-seeding hint present', () => {
    assert.ok(subOutput.includes(PREREQ_HINT));
    assert.ok(subOutput.includes('multiply two linear factors before naming it a quadratic'));
  });

  test('subscribed: PROBLEM-LOCK + legacy trailer unchanged', () => {
    for (const m of LEGACY_MARKERS) {
      assert.ok(subOutput.includes(m), `missing legacy marker: "${m}"`);
    }
  });

  test('subscribed: demo framing NOT present', () => {
    assert.ok(!subOutput.includes(DEMO_MARKER));
  });

  // -- 3. demo framing ------------------------------------------------------
  test('demo: raw-material framing present', () => {
    assert.ok(demoOutput.includes(DEMO_MARKER));
    assert.ok(demoOutput.includes('shows what great teaching feels like'));
  });

  test('demo: prerequisite-seeding hint present', () => {
    assert.ok(demoOutput.includes(PREREQ_HINT));
  });

  test('demo: does NOT contain the coverage contract (or any subscribed framing)', () => {
    for (const m of SUBSCRIBED_MARKERS) {
      assert.ok(!demoOutput.includes(m), `unexpected subscribed marker in demo output: "${m}"`);
    }
  });

  test('demo: PROBLEM-LOCK + legacy trailer unchanged', () => {
    for (const m of LEGACY_MARKERS) {
      assert.ok(demoOutput.includes(m), `missing legacy marker: "${m}"`);
    }
  });

  // -- 4. mode does not disturb redaction / COMPLETED-note behavior ---------
  test('off-topic redaction unaffected by mode (all three outputs redact seg-bait-1)', () => {
    for (const out of [offOutput, subOutput, demoOutput]) {
      assert.ok(out.includes('⚠ OFF-TOPIC (do not advance into; do not narrate; content redacted)'));
    }
  });

  test('COMPLETED-note unaffected by mode (all three outputs list seg-concept-1)', () => {
    for (const out of [offOutput, subOutput, demoOutput]) {
      assert.ok(out.includes('COMPLETED segments this session: seg-concept-1.'));
      assert.ok(out.includes('NEVER call show_segment_card'));
    }
  });

  test('mode-present outputs differ from mode-absent ONLY by the framing insertion', () => {
    // Removing the framing lines from the subscribed output must restore the
    // mode-absent output exactly — proves the change is purely additive.
    const stripFraming = (out: string, markers: string[]) => {
      const lines = out.split('\n');
      const kept: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        const isFraming = markers.some((m) => lines[i].includes(m));
        if (isFraming) {
          // Also drop the blank spacer line inserted just before the framing.
          if (kept.length > 0 && kept[kept.length - 1] === '') kept.pop();
          continue;
        }
        kept.push(lines[i]);
      }
      return kept.join('\n');
    };
    assert.equal(
      stripFraming(subOutput, ['seed, not a script', PREREQ_HINT]),
      offOutput,
      'subscribed output minus framing should equal mode-absent output',
    );
    assert.equal(
      stripFraming(demoOutput, [DEMO_MARKER, PREREQ_HINT]),
      offOutput,
      'demo output minus framing should equal mode-absent output',
    );
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
