/**
 * Unit tests for the resume-seed whiteboard batch guard.
 * Run: npm run test:resume-seed
 *
 * Bug this gates (2026-07-06, repro session-1783123067235): the VTR resume
 * seed replays the restored board into parent accumulation buffers
 * (page.tsx whiteboardEventsRef + whiteboardCommands state, TutorSession
 * state, embed state). The replay's once-guard used to live in a
 * VTR-instance ref, but the buffers OUTLIVE VTR instances — any remount
 * with resumeState still set appended a full duplicate board (items 0–12
 * repeated exactly as 13–25, on screen and in the persisted session).
 * The guard must live with the buffer it protects: a seed batch is
 * accepted exactly once per guard lifetime; live batches always pass.
 */
import { acceptWhiteboardBatch, createSeedGuard } from '../apps/marketing/src/lib/tutor/whiteboard/resume-seed';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}`);
  }
}

console.log('resume-seed guard');

// 1. Live batches (no meta) always apply.
{
  const g = createSeedGuard();
  check('live batch applies (no meta)', acceptWhiteboardBatch(g, undefined) === true);
  check('live batch applies again', acceptWhiteboardBatch(g, undefined) === true);
  check('live batch applies (meta without resumeSeed)', acceptWhiteboardBatch(g, {}) === true);
}

// 2. First seed applies; the remount replay of the SAME seed is dropped.
{
  const g = createSeedGuard();
  check('first resume seed applies', acceptWhiteboardBatch(g, { resumeSeed: true }) === true);
  check('second resume seed dropped (VTR remount replay)', acceptWhiteboardBatch(g, { resumeSeed: true }) === false);
  check('third resume seed dropped', acceptWhiteboardBatch(g, { resumeSeed: true }) === false);
}

// 3. Live batches still apply after a seed was accepted AND after one was dropped.
{
  const g = createSeedGuard();
  acceptWhiteboardBatch(g, { resumeSeed: true });
  acceptWhiteboardBatch(g, { resumeSeed: true });
  check('live batch applies after seed accepted + duplicate dropped', acceptWhiteboardBatch(g, undefined) === true);
}

// 4. Reset (new session / buffers cleared) re-arms the guard so the NEXT
//    session's seed applies. Pairs with the boot-effect buffer clear and
//    handleStartSession reset.
{
  const g = createSeedGuard();
  acceptWhiteboardBatch(g, { resumeSeed: true });
  g.seedApplied = false; // reset alongside the buffer clear
  check('seed applies again after reset', acceptWhiteboardBatch(g, { resumeSeed: true }) === true);
  check('and its remount replay is dropped again', acceptWhiteboardBatch(g, { resumeSeed: true }) === false);
}

// 5. Simulated buffer semantics: seed → remount seed → live turn must yield
//    seed-once + live (the exact session-1783123067235 shape, fixed).
{
  const g = createSeedGuard();
  const buffer: string[] = [];
  const seed = ['newPage', 'showEquation', 'showEquation', 'newPage', 'showDiagram'];
  const apply = (cmds: string[], meta?: { resumeSeed?: boolean }) => {
    if (!acceptWhiteboardBatch(g, meta)) return;
    buffer.push(...cmds);
  };
  apply(seed, { resumeSeed: true }); // mount replay
  apply(seed, { resumeSeed: true }); // remount replay (the bug)
  apply(['showProblem']); // live turn after resume
  check('buffer holds seed exactly once + live commands', buffer.length === seed.length + 1);
  check('buffer order preserved', buffer[buffer.length - 1] === 'showProblem');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
