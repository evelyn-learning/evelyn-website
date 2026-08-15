/**
 * resolveSegmentEvidence — pure tests against
 * src/lib/tutor/orchestrator/segment-evidence.ts. No DB, no LLM calls,
 * no React: the module is pure data-in/data-out, so this script just
 * calls it with hand-built signals.
 *
 * Usage: npx tsx scripts/test-segment-evidence.ts  (npm run test:segment-evidence)
 */
import {
  resolveSegmentEvidence,
  EVALUATIVE_SEGMENT_KINDS,
  type SegmentEvidenceSignal,
} from '../apps/marketing/src/lib/tutor/orchestrator/segment-evidence';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

function sig(overrides: Partial<SegmentEvidenceSignal>): SegmentEvidenceSignal {
  return {
    segmentId: 'seg-1',
    segmentKind: 'try_yourself',
    planLoIds: ['lo-1'],
    loGroupId: 'lo-1',
    source: 'complete',
    streakAtComplete: undefined,
    demonstrated: false,
    ...overrides,
  };
}

console.log('segment-evidence: EVALUATIVE_SEGMENT_KINDS + resolveSegmentEvidence');

// ---------------------------------------------------------------------------
// EVALUATIVE_SEGMENT_KINDS — single source of truth
// ---------------------------------------------------------------------------
assert(EVALUATIVE_SEGMENT_KINDS.has('try_yourself'), 'EVALUATIVE_SEGMENT_KINDS: try_yourself included');
assert(EVALUATIVE_SEGMENT_KINDS.has('misconception_check'), 'EVALUATIVE_SEGMENT_KINDS: misconception_check included');
assert(!EVALUATIVE_SEGMENT_KINDS.has('concept'), 'EVALUATIVE_SEGMENT_KINDS: concept excluded');
assert(!EVALUATIVE_SEGMENT_KINDS.has('hook'), 'EVALUATIVE_SEGMENT_KINDS: hook excluded');
assert(!EVALUATIVE_SEGMENT_KINDS.has('recap'), 'EVALUATIVE_SEGMENT_KINDS: recap excluded');

// ---------------------------------------------------------------------------
// Evaluative gate — non-evaluative kinds return null even with a strong
// streak / demonstrated / source='complete' signal.
// ---------------------------------------------------------------------------
for (const kind of ['concept', 'hook', 'worked_example', 'recap', 'extension', undefined]) {
  const out = resolveSegmentEvidence(sig({ segmentKind: kind, source: 'complete', streakAtComplete: 5, demonstrated: true }));
  assert(out === null, `gate: kind=${String(kind)} + streak=5 + source=complete -> null`);
}
{
  const out = resolveSegmentEvidence(sig({ segmentKind: 'concept', source: 'advance', streakAtComplete: 3, demonstrated: true }));
  assert(out === null, 'gate: kind=concept + streak=3 + source=advance -> null');
}

// ---------------------------------------------------------------------------
// source='complete' — always emits for an evaluative segment.
// ---------------------------------------------------------------------------
{
  const out = resolveSegmentEvidence(sig({ source: 'complete', streakAtComplete: 2 }));
  assert(out !== null && out.outcome === 1, 'complete: streak=2 -> outcome 1');
  assert(out?.loId === 'lo-1', 'complete: streak=2 -> loId lo-1');
}
{
  const out = resolveSegmentEvidence(sig({ source: 'complete', streakAtComplete: 1 }));
  assert(out !== null && out.outcome === 1, 'complete: streak=1 -> outcome 1');
}
{
  const out = resolveSegmentEvidence(sig({ source: 'complete', streakAtComplete: 0 }));
  assert(out !== null && out.outcome === 0.5, 'complete: streak=0 -> outcome 0.5');
}
{
  const out = resolveSegmentEvidence(sig({ source: 'complete', streakAtComplete: undefined }));
  assert(out !== null && out.outcome === 0.5, 'complete: streak=undefined -> outcome 0.5');
}
{
  // Explicit completion emits even with no demonstrated attempt at all —
  // the tool call itself is the assessed event.
  const out = resolveSegmentEvidence(sig({ source: 'complete', streakAtComplete: undefined, demonstrated: false }));
  assert(out !== null, 'complete: streak=undefined + demonstrated=false still emits (0.5)');
}

// ---------------------------------------------------------------------------
// source='advance' — requires attempt evidence; no fabrication on skip.
// ---------------------------------------------------------------------------
{
  const out = resolveSegmentEvidence(sig({ source: 'advance', streakAtComplete: 1 }));
  assert(out !== null && out.outcome === 1, 'advance: streak=1 -> outcome 1');
}
{
  const out = resolveSegmentEvidence(sig({ source: 'advance', streakAtComplete: 3 }));
  assert(out !== null && out.outcome === 1, 'advance: streak=3 -> outcome 1');
}
{
  const out = resolveSegmentEvidence(sig({ source: 'advance', streakAtComplete: undefined, demonstrated: true }));
  assert(out !== null && out.outcome === 0.5, 'advance: no streak + demonstrated=true -> outcome 0.5');
}
{
  const out = resolveSegmentEvidence(sig({ source: 'advance', streakAtComplete: 0, demonstrated: true }));
  assert(out !== null && out.outcome === 0.5, 'advance: streak=0 + demonstrated=true -> outcome 0.5');
}
{
  const out = resolveSegmentEvidence(sig({ source: 'advance', streakAtComplete: undefined, demonstrated: false }));
  assert(out === null, 'advance: no streak + not demonstrated -> null (never-attempted skip)');
}
{
  const out = resolveSegmentEvidence(sig({ source: 'advance', streakAtComplete: 0, demonstrated: false }));
  assert(out === null, 'advance: streak=0 + not demonstrated -> null');
}

// ---------------------------------------------------------------------------
// LO resolution
// ---------------------------------------------------------------------------
{
  // loGroup match wins over a would-be single-LO fallback when there IS
  // more than one plan LO.
  const out = resolveSegmentEvidence(sig({
    planLoIds: ['lo-1', 'lo-2'],
    loGroupId: 'lo-2',
    source: 'complete',
    streakAtComplete: 1,
  }));
  assert(out?.loId === 'lo-2', 'LO: loGroup match (lo-2 of [lo-1,lo-2]) wins');
}
{
  // Single-LO curated fallback: loGroupId doesn't resolve (no id-convention
  // suffix, e.g. curated segment id "try-histogram"), but the plan has
  // exactly one LO — that's the correct attribution.
  const out = resolveSegmentEvidence(sig({
    planLoIds: ['histogram-basics'],
    loGroupId: 'try-histogram', // caller's loGroupOf() on a non-convention id
    source: 'complete',
    streakAtComplete: 1,
  }));
  assert(out?.loId === 'histogram-basics', 'LO: single-LO plan falls back to its only LO when loGroupId does not match');
}
{
  // Multi-LO plan, unresolvable id -> null (would misattribute).
  const out = resolveSegmentEvidence(sig({
    planLoIds: ['lo-1', 'lo-2'],
    loGroupId: 'intro', // e.g. an intro/recap segment misrouted into this call, or an id outside the convention
    source: 'complete',
    streakAtComplete: 1,
  }));
  assert(out === null, 'LO: multi-LO plan + unresolvable loGroupId -> null');
}
{
  // loGroupId null (e.g. caller couldn't compute one — no plan) with
  // multiple plan LOs -> null.
  const out = resolveSegmentEvidence(sig({
    planLoIds: ['lo-1', 'lo-2'],
    loGroupId: null,
    source: 'complete',
    streakAtComplete: 1,
  }));
  assert(out === null, 'LO: loGroupId=null + multi-LO plan -> null');
}
{
  // loGroupId null but single plan LO -> still resolves via fallback.
  const out = resolveSegmentEvidence(sig({
    planLoIds: ['lo-1'],
    loGroupId: null,
    source: 'complete',
    streakAtComplete: 1,
  }));
  assert(out?.loId === 'lo-1', 'LO: loGroupId=null + single-LO plan -> resolves via fallback');
}

// ---------------------------------------------------------------------------
// Review-plan-shaped ids — the module doesn't parse ids itself; it trusts
// whatever loGroupId the CALLER computed via loGroupOf(). These fixtures
// mirror what loGroupOf() would actually return for the id-convention
// suffixes ("-try", "-try2", "-hook", "-concept", "-worked", "-worked2",
// "-recall") on a REVIEW plan (not "generated", but same id shape).
// ---------------------------------------------------------------------------
{
  // apcalcbc.ftc-try -> loGroupOf strips "-try" -> "apcalcbc.ftc"
  const out = resolveSegmentEvidence(sig({
    segmentId: 'apcalcbc.ftc-try',
    planLoIds: ['apcalcbc.ftc', 'apcalcbc.long-division-completing-square'],
    loGroupId: 'apcalcbc.ftc',
    source: 'complete',
    streakAtComplete: 2,
  }));
  assert(out?.loId === 'apcalcbc.ftc', 'review-plan id: apcalcbc.ftc-try -> apcalcbc.ftc (not los[0] fallback)');
}
{
  // A second review-plan LO's "-try2" segment attributes to ITS OWN LO,
  // not the first LO in plan.los — this is exactly the R44 multi-LO
  // review-plan misattribution this round fixes.
  const out = resolveSegmentEvidence(sig({
    segmentId: 'apcalcbc.long-division-completing-square-try2',
    planLoIds: ['apcalcbc.ftc', 'apcalcbc.long-division-completing-square'],
    loGroupId: 'apcalcbc.long-division-completing-square',
    source: 'advance',
    streakAtComplete: 1,
  }));
  assert(
    out?.loId === 'apcalcbc.long-division-completing-square',
    'review-plan id: ...-try2 attributes to its OWN LO (2nd of 2), not los[0]',
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
