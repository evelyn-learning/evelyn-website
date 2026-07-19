/**
 * Deterministic unit tests for the pedagogy harness driver's PURE helpers
 * (Task H4) — `personaToPickerStart` and `assembleBundle`. No framework —
 * matches student-simulator.test.ts / fixtures/personas/personas.test.ts:
 * node:assert + a tiny test() harness, PASS/FAIL counters, non-zero exit on
 * failure.
 *
 * NO network, NO browser, NO dev server — these two functions are pure data
 * transforms. `runScenario` itself (the Playwright driver) is exercised by
 * the gated smoke instead (run-harness.smoke.ts, npm run test:pedagogy-driver).
 *
 * Run: npm run test:pedagogy-driver-unit
 */
import { strict as assert } from 'node:assert';
import { loadPersona, PERSONA_IDS } from './fixtures/personas';
import {
  personaToPickerStart,
  assembleBundle,
  openerRecordFromBundle,
  runReplayScenario,
  nextTutorTurnText,
  DEMO_PICKER_START,
  SUBSCRIBED_PICKER_START,
  refreshThreadRecency,
  type RawCapturedTurn,
  type Bundle,
  type RunScenarioOpts,
  type TranscriptEntryLite,
} from './run-harness';
import type { Persona } from './fixtures/personas';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
    failed++;
  }
}

const DEMO_IDS = ['maya', 'leo', 'aria', 'anon', 'sam', 'nina', 'tara'];
const SUBSCRIBED_IDS = ['priya', 'noah', 'zoe', 'kai', 'diego', 'ravi'];

// ── personaToPickerStart: DEMO personas ─────────────────────────────────
for (const id of DEMO_IDS) {
  test(`personaToPickerStart(${id}): returns a real (subject, level, topic, lessonPlanId) from DEMO_PICKER_START`, () => {
    const persona = loadPersona(id);
    const cfg = personaToPickerStart(persona);
    assert.equal(cfg.subject, DEMO_PICKER_START[id].subject);
    assert.equal(cfg.level, DEMO_PICKER_START[id].level);
    assert.equal(cfg.topic, DEMO_PICKER_START[id].topic);
    assert.equal(cfg.lessonPlanId, DEMO_PICKER_START[id].lessonPlanId);
    assert.ok(cfg.lessonPlanId.startsWith('evelyn.'), 'lessonPlanId looks like a real catalog id');
  });
}

test('personaToPickerStart(anon): studentName is omitted (logged-out/anonymous fixture)', () => {
  const anon = loadPersona('anon');
  const cfg = personaToPickerStart(anon);
  assert.equal(cfg.studentName, undefined);
});

for (const id of ['maya', 'leo', 'aria', 'sam']) {
  test(`personaToPickerStart(${id}): studentName is a non-empty capitalized string`, () => {
    const persona = loadPersona(id);
    const cfg = personaToPickerStart(persona);
    assert.ok(cfg.studentName && cfg.studentName.length > 0);
    assert.equal(cfg.studentName![0], cfg.studentName![0].toUpperCase());
  });
}

// ── personaToPickerStart: SUBSCRIBED personas (Task H2) ─────────────────
for (const id of SUBSCRIBED_IDS) {
  test(`personaToPickerStart(${id}): no throw; returns a real plan + namespaced studentId pedagogy-${id}`, () => {
    const persona = loadPersona(id);
    assert.equal(persona.mode, 'subscribed', 'fixture sanity: this persona really is subscribed');
    const cfg = personaToPickerStart(persona);
    assert.equal(cfg.subject, SUBSCRIBED_PICKER_START[id].subject);
    assert.equal(cfg.level, SUBSCRIBED_PICKER_START[id].level);
    assert.equal(cfg.topic, SUBSCRIBED_PICKER_START[id].topic);
    assert.equal(cfg.lessonPlanId, SUBSCRIBED_PICKER_START[id].lessonPlanId);
    assert.ok(cfg.lessonPlanId.startsWith('evelyn.'), 'lessonPlanId looks like a real catalog id');
    assert.equal(cfg.studentId, `pedagogy-${id}`, 'studentId is the namespaced seed id');
  });

  test(`personaToPickerStart(${id}): studentName comes from the fixture's studentContext profile`, () => {
    const persona = loadPersona(id);
    const ctx = persona.studentContext as { profile?: { name?: string } };
    const cfg = personaToPickerStart(persona);
    assert.equal(cfg.studentName, ctx.profile?.name, 'name passthrough (e.g. "Priya", not "priya")');
  });
}

test('personaToPickerStart(priya): socialMemory threads pass through, with lastReferencedAt refreshed recent', () => {
  const priya = loadPersona('priya');
  const cfg = personaToPickerStart(priya);
  assert.ok(cfg.socialMemory && cfg.socialMemory.length === 3, 'all 3 fixture threads forwarded');
  const spiderman = cfg.socialMemory!.find((t) => t.id === 'thread-priya-spiderman');
  assert.ok(spiderman, 'Spider-Man thread present');
  assert.ok(spiderman!.lastReferencedAt, 'recently-used marker preserved');
  const ageMs = Date.now() - new Date(spiderman!.lastReferencedAt!).getTime();
  assert.ok(ageMs > 0 && ageMs < 3 * 24 * 60 * 60 * 1000, 'lastReferencedAt refreshed to near-now (≈yesterday), not the aging fixture date');
  const football = cfg.socialMemory!.find((t) => t.id === 'thread-priya-football');
  assert.equal(football?.lastReferencedAt, undefined, 'threads without lastReferencedAt stay untouched');
});

test('personaToPickerStart(priya): progressDigest passes through from the fixture', () => {
  const priya = loadPersona('priya');
  const cfg = personaToPickerStart(priya);
  assert.equal(cfg.progressDigest?.unitsCompleted, 6);
  assert.equal(cfg.progressDigest?.unitsTotal, 9);
  assert.equal(cfg.progressDigest?.paceNote, 'ahead of pace');
});

test('personaToPickerStart(zoe): opt-out fixture forwards NO socialMemory but keeps the digest', () => {
  const zoe = loadPersona('zoe');
  const cfg = personaToPickerStart(zoe);
  assert.equal(cfg.socialMemory, undefined, "zoe's fixture has no threads (portal resolves 'off' to absent)");
  assert.equal(cfg.progressDigest?.unitsCompleted, 3);
});

test('personaToPickerStart(ravi, fresh — the default): injects a position-only resume checkpoint, no stale marker', () => {
  const ravi = loadPersona('ravi');
  const cfg = personaToPickerStart(ravi); // default variant = 'fresh'
  assert.ok(cfg.resume, 'fresh checkpoint injected');
  assert.equal(cfg.resume!.currentSegmentId, 'concept-2');
  assert.deepEqual(cfg.resume!.completedSegmentIds, ['hook', 'concept-1']);
  assert.deepEqual(cfg.resume!.transcript, [], 'fixtures carry no transcript — position-only seed');
  assert.deepEqual(cfg.resume!.whiteboardCommands, []);
  assert.equal(cfg.checkpointStale, undefined, 'fresh checkpoint is not stale');
});

test('personaToPickerStart(ravi, stale): NO resume seed + checkpointStale marker (resolveResumeOutcome-faithful)', () => {
  const ravi = loadPersona('ravi');
  assert.ok(ravi.staleResumeState, 'fixture sanity: stale checkpoint exists');
  const cfg = personaToPickerStart(ravi, { resumeVariant: 'stale' });
  assert.equal(cfg.resume, undefined, 'stale checkpoint filtered exactly like buildResumeState would');
  assert.equal(cfg.checkpointStale, true, 'stale marker set — the resume-stale journey signal');
  assert.equal(cfg.studentId, 'pedagogy-ravi', 'everything else still flows');
});

test('personaToPickerStart: non-ravi subscribed personas get no resume and no stale marker', () => {
  for (const id of ['priya', 'noah', 'zoe', 'kai', 'diego']) {
    const cfg = personaToPickerStart(loadPersona(id));
    assert.equal(cfg.resume, undefined, `${id} has no checkpoint fixture`);
    assert.equal(cfg.checkpointStale, undefined, `${id}: no checkpoint ⇒ no stale marker`);
  }
});

// ── Driver overrides (sessionMaxMinutes / targetKind → __tutorTestStart) ─

test('personaToPickerStart(maya, sessionMaxMinutes 5): budget override reaches the start config (demo branch — E2)', () => {
  const cfg = personaToPickerStart(loadPersona('maya'), { sessionMaxMinutes: 5 });
  assert.equal(cfg.sessionMaxMinutes, 5);
  assert.equal(cfg.lessonPlanId, DEMO_PICKER_START.maya.lessonPlanId, 'picker fields untouched');
});

test("personaToPickerStart(diego, targetKind 'diagnostic'): explicit targetKind reaches the start config (S5)", () => {
  const cfg = personaToPickerStart(loadPersona('diego'), { targetKind: 'diagnostic' });
  assert.equal(cfg.targetKind, 'diagnostic');
  assert.equal(cfg.studentId, 'pedagogy-diego', 'subscribed extras untouched');
});

test('personaToPickerStart(maya, teacherId): teacher pin reaches the start config (T1 — same plumbing as sessionMaxMinutes)', () => {
  const cfg = personaToPickerStart(loadPersona('maya'), { teacherId: 'ms-elena-vasquez' });
  assert.equal(cfg.teacherId, 'ms-elena-vasquez');
  assert.equal(cfg.lessonPlanId, DEMO_PICKER_START.maya.lessonPlanId, 'picker fields untouched');
});

test('personaToPickerStart(tara, teacherId): teacher pin works for the parent-probing demo persona (T2)', () => {
  const cfg = personaToPickerStart(loadPersona('tara'), { teacherId: 'ms-elena-vasquez' });
  assert.equal(cfg.teacherId, 'ms-elena-vasquez');
  assert.equal(cfg.studentName, 'Tara', 'demo fallback name derived from the id');
});

test('personaToPickerStart: sessionMaxMinutes/targetKind overrides are absent when not requested; teacherId defaults to ms-elena-vasquez for deterministic runs (geo pre-select landed 2026-07-19)', () => {
  for (const id of ['maya', 'diego', 'ravi']) {
    const cfg = personaToPickerStart(loadPersona(id));
    assert.equal(cfg.sessionMaxMinutes, undefined, `${id}: no budget override`);
    assert.equal(cfg.targetKind, undefined, `${id}: no targetKind override`);
    assert.equal(cfg.teacherId, 'ms-elena-vasquez', `${id}: harness default teacher, deterministic run`);
  }
});

test('personaToPickerStart: DEMO personas carry NO subscribed extras (unchanged pre-H2 shape)', () => {
  for (const id of DEMO_IDS) {
    const cfg = personaToPickerStart(loadPersona(id));
    assert.equal(cfg.studentId, undefined, `${id}: no studentId`);
    assert.equal(cfg.socialMemory, undefined, `${id}: no socialMemory`);
    assert.equal(cfg.progressDigest, undefined, `${id}: no progressDigest`);
    assert.equal(cfg.resume, undefined, `${id}: no resume`);
  }
});

test('refreshThreadRecency: pure w.r.t. its input (does not mutate the given threads)', () => {
  const threads = [{ id: 't1', note: 'x', capturedAt: '2026-01-01T00:00:00.000Z', lastReferencedAt: '2026-01-02T00:00:00.000Z' }];
  const out = refreshThreadRecency(threads, Date.parse('2026-07-03T00:00:00.000Z'));
  assert.equal(threads[0].lastReferencedAt, '2026-01-02T00:00:00.000Z', 'input untouched');
  assert.equal(out[0].lastReferencedAt, '2026-07-02T00:00:00.000Z', 'output refreshed to now - 1 day');
});

test('personaToPickerStart: every DEMO_PICKER_START + SUBSCRIBED_PICKER_START key is a known persona id', () => {
  for (const id of [...Object.keys(DEMO_PICKER_START), ...Object.keys(SUBSCRIBED_PICKER_START)]) {
    assert.ok((PERSONA_IDS as readonly string[]).includes(id), `${id} is a real persona id`);
  }
});

test('SUBSCRIBED_PICKER_START: covers exactly the 6 subscribed personas', () => {
  assert.deepEqual(new Set(Object.keys(SUBSCRIBED_PICKER_START)), new Set(SUBSCRIBED_IDS));
});

// ── assembleBundle ────────────────────────────────────────────────────
test('assembleBundle: stamps sequential 0-based index and carries persona id/mode through', () => {
  const maya = loadPersona('maya');
  const raw: RawCapturedTurn[] = [
    { tutorText: 'Hi! Ready to factor some quadratics?', toolCalls: [], boardState: '00-turn-0.png', studentReply: 'sure', ended: false },
    { tutorText: 'Great — try x^2 - 5x + 6.', toolCalls: [{ message: 'Whiteboard tool: show_equation' }], boardState: '01-turn-1.png', studentReply: '(x-2)(x-3)', ended: false },
  ];
  const bundle = assembleBundle(maya, raw, { baseUrl: 'http://localhost:3006', maxTurns: 3 });
  assert.equal(bundle.persona.id, 'maya');
  assert.equal(bundle.persona.mode, 'demo');
  assert.equal(bundle.turns.length, 2);
  assert.equal(bundle.turns[0].index, 0);
  assert.equal(bundle.turns[1].index, 1);
  assert.equal(bundle.turns[1].toolCalls.length, 1);
  assert.deepEqual(bundle.meta, { baseUrl: 'http://localhost:3006', maxTurns: 3 });
});

test('assembleBundle: omits sessionResult entirely when not provided (never fabricated)', () => {
  const maya = loadPersona('maya');
  const bundle = assembleBundle(maya, [], { baseUrl: 'http://localhost:3006', maxTurns: 1 });
  assert.equal('sessionResult' in bundle, false);
});

test('assembleBundle: includes sessionResult when provided, even falsy-but-defined values', () => {
  const maya = loadPersona('maya');
  const bundle = assembleBundle(maya, [], { baseUrl: 'http://localhost:3006', maxTurns: 1 }, { completed: false });
  assert.equal('sessionResult' in bundle, true);
  assert.deepEqual(bundle.sessionResult, { completed: false });
});

test('assembleBundle: an empty rawTurns array (e.g. immediate student disengage) yields turns: []', () => {
  const anon = loadPersona('anon');
  const bundle = assembleBundle(anon, [], { baseUrl: 'http://localhost:3006', maxTurns: 5 });
  assert.deepEqual(bundle.turns, []);
});

test('assembleBundle: taskId flows through meta when provided', () => {
  const maya = loadPersona('maya');
  const bundle = assembleBundle(maya, [], { baseUrl: 'http://localhost:3006', maxTurns: 1, taskId: 'H4-smoke' });
  assert.equal(bundle.meta.taskId, 'H4-smoke');
});

// ── Opener-recency (part A): openerRecordFromBundle + runReplayScenario ──

async function testAsync(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
    failed++;
  }
}

function makeBundle(overrides: Partial<Bundle> = {}): Bundle {
  return {
    persona: { id: 'priya', mode: 'subscribed' },
    turns: [
      { index: 0, tutorText: 'Good to have you back! Last session you were solid on substitution — cinema tickets today.', toolCalls: [], studentReply: 'hi', ended: false },
      { index: 1, tutorText: 'Try 2x + y = 10.', toolCalls: [], studentReply: 'ok', ended: false },
    ],
    meta: { baseUrl: 'http://localhost:3006', maxTurns: 6 },
    ...overrides,
  };
}

test('openerRecordFromBundle: digest = first 160 chars of turn-0 tutorText', () => {
  const longText = 'A'.repeat(300);
  const bundle = makeBundle({ turns: [{ index: 0, tutorText: longText, toolCalls: [], studentReply: 'x', ended: false }] });
  const rec = openerRecordFromBundle(bundle);
  assert.equal(rec.digest, 'A'.repeat(160));
});

test('openerRecordFromBundle: kind from the captured sessionOpenerRecord when present', () => {
  const bundle = makeBundle({ sessionOpenerRecord: { kind: 'warm-resume', digest: 'captured digest' } });
  const rec = openerRecordFromBundle(bundle);
  assert.equal(rec.kind, 'warm-resume');
  assert.ok(rec.digest.startsWith('Good to have you back!'), 'digest still comes from turn-0 tutorText (always available), not the captured record');
});

test("openerRecordFromBundle: kind defaults to 'proactive' when no capture landed", () => {
  const rec = openerRecordFromBundle(makeBundle());
  assert.equal(rec.kind, 'proactive');
});

test('openerRecordFromBundle: empty-turns bundle yields an empty digest (never throws)', () => {
  const rec = openerRecordFromBundle(makeBundle({ turns: [] }));
  assert.deepEqual(rec, { kind: 'proactive', digest: '' });
});

// tsx compiles this file as CJS (no top-level await) — run the async tests
// inside an IIFE and print the summary after they settle.
void (async () => {
await testAsync('runReplayScenario: runs twice sequentially, passing lastOpener on the SECOND call only (derived from session 1)', async () => {
  const calls: Array<{ opts: RunScenarioOpts }> = [];
  const s1 = makeBundle({ sessionOpenerRecord: { kind: 'warm-resume', digest: 'cap' } });
  const s2 = makeBundle({ turns: [{ index: 0, tutorText: 'Fresh angle today — a quick sketch first.', toolCalls: [], studentReply: 'ok', ended: false }] });
  const fakeRunner = async (_persona: Persona, opts: RunScenarioOpts): Promise<Bundle> => {
    calls.push({ opts });
    return calls.length === 1 ? s1 : s2;
  };
  const persona = loadPersona('priya');
  const out = await runReplayScenario(persona, { maxTurns: 6, taskId: 'S1R' }, fakeRunner);

  assert.equal(calls.length, 2, 'exactly two sessions');
  assert.equal(calls[0].opts.lastOpener, undefined, 'session 1 gets NO lastOpener');
  assert.deepEqual(
    calls[1].opts.lastOpener,
    { kind: 'warm-resume', digest: s1.turns[0].tutorText.slice(0, 160) },
    'session 2 gets the record derived from session 1 (captured kind + turn-0 digest)',
  );
  assert.equal(calls[1].opts.maxTurns, 6, 'other opts flow through to session 2');
  assert.equal(out.session1, s1);
  assert.equal(out.session2, s2);
  assert.deepEqual(out.lastOpener, calls[1].opts.lastOpener);
});

await testAsync('runReplayScenario: a caller-supplied lastOpener in opts is IGNORED for session 1 (explicitly stripped)', async () => {
  const calls: RunScenarioOpts[] = [];
  const fakeRunner = async (_p: Persona, opts: RunScenarioOpts): Promise<Bundle> => {
    calls.push(opts);
    return makeBundle();
  };
  await runReplayScenario(loadPersona('priya'), { maxTurns: 2, lastOpener: { kind: 'x', digest: 'y' } }, fakeRunner);
  assert.equal(calls[0].lastOpener, undefined, 'session 1 never carries a lastOpener');
  assert.notDeepEqual(calls[1].lastOpener, { kind: 'x', digest: 'y' }, 'session 2 uses the derived record, not the stray opts one');
});

// ── nextTutorTurnText: turn-sync capture (T1 duplicate-turn fix) ────────
// Regression for the 2026-07-04 T1 run: the old last-entry read captured
// the SAME long tutor turn twice (streaming partial at turn N, finalized
// text at turn N+1) because nothing required a NEW entry or a FINALIZED
// one. These pin the new semantics.
const tut = (text: string, extra?: Partial<TranscriptEntryLite>): TranscriptEntryLite => ({ role: 'tutor', text, ...extra });
const stu = (text: string): TranscriptEntryLite => ({ role: 'student', text });

test('nextTutorTurnText: null when there is no tutor entry beyond the consumed count', () => {
  assert.equal(nextTutorTurnText([tut('opener'), stu('hi')], 1), null);
  assert.equal(nextTutorTurnText([], 0), null);
  assert.equal(nextTutorTurnText(undefined, 0), null);
});

test('nextTutorTurnText: null while the newest tutor entry is still streaming (no partial capture)', () => {
  const tr = [tut('opener'), stu('hi'), tut('long turn still stre', { streaming: true })];
  assert.equal(nextTutorTurnText(tr, 1), null);
});

test('nextTutorTurnText: captures the entry once it finalizes in place', () => {
  const tr = [tut('opener'), stu('hi'), tut('long turn, complete now.')];
  assert.deepEqual(nextTutorTurnText(tr, 1), { text: 'long turn, complete now.', tutorCount: 2 });
});

test('nextTutorTurnText: REGRESSION — same transcript re-read after consuming returns null, never a duplicate', () => {
  const tr = [tut('opener'), stu('hi'), tut('turn two.')];
  const first = nextTutorTurnText(tr, 1);
  assert.ok(first);
  assert.equal(nextTutorTurnText(tr, first!.tutorCount), null, 're-read must not re-capture the same turn');
});

test('nextTutorTurnText: chained multi-entry turn consumes all and returns the LAST finalized text', () => {
  const tr = [tut('opener'), stu('hi'), tut('render turn.'), tut('scribble follow-up.')];
  assert.deepEqual(nextTutorTurnText(tr, 1), { text: 'scribble follow-up.', tutorCount: 3 });
});

test('nextTutorTurnText: revising (killed, dimmed) bubbles are ignored — not captured, not counted', () => {
  const tr = [tut('opener'), stu('hi'), tut('wrong attempt', { revising: true }), tut('corrected turn.')];
  assert.deepEqual(nextTutorTurnText(tr, 1), { text: 'corrected turn.', tutorCount: 2 });
  // A lone revising bubble with the retry still streaming: nothing to capture.
  const mid = [tut('opener'), stu('hi'), tut('wrong attempt', { revising: true }), tut('retry stre', { streaming: true })];
  assert.equal(nextTutorTurnText(mid, 1), null);
});

test('nextTutorTurnText: empty finalized tutor text is not captured (waits — loud timeout upstream)', () => {
  const tr = [tut('opener'), stu('hi'), tut('   ')];
  assert.equal(nextTutorTurnText(tr, 1), null);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
})();
