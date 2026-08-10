/**
 * E6 — LO-ordering enforcement for runtime-generated lesson plans.
 *
 * Pure/deterministic tests against resolveAdvanceTarget + the E6 helpers
 * in src/lib/tutor/lesson-plan/context.ts. No DB, no LLM calls — builds
 * fake LessonPlan object literals in-process. Mirrors the root-cause prod
 * session: a generated plan (metadata.generatedFromText === true) whose
 * segments follow the "<loId>-hook/-concept/-worked/-try" convention plus
 * a leading "intro" and a trailing "recap" (see generate-from-text.ts).
 *
 * Usage: npx tsx scripts/test-advance-ordering.ts  (npm run test:advance-ordering)
 */
import {
  resolveAdvanceTarget,
  checkGeneratedPlanAdvance,
  loGroupOf,
  firstLoGroup,
  isGeneratedPlan,
  filterRecapMustRemember,
  buildLessonPlanContext,
} from '../src/lib/tutor/lesson-plan/context';
import { loBoundaryBeat, buildAdvanceBeatNote } from '../src/lib/tutor/lesson-plan/rail-labels';
import type { LessonPlan, Segment, SegmentRecap } from '../src/lib/tutor/lesson-plan/types';
import { LESSON_PLAN_SCHEMA_VERSION } from '../src/lib/tutor/lesson-plan/types';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

/** Two-LO generated plan: intro, lo-1-{hook,concept,worked,try},
 *  lo-2-{hook,concept,worked,try}, recap. Mirrors generatePlanFromText's
 *  real segment shape (generate-from-text.ts lines ~200-213, 465-481). */
function buildSegments(): Segment[] {
  return [
    { id: 'intro', kind: 'hook', goal: 'Acknowledge the material.' },
    { id: 'lo-1-hook', kind: 'hook', goal: 'Hook for LO1.' },
    { id: 'lo-1-concept', kind: 'concept', goal: 'Teach LO1.', keyIdeas: ['idea'] },
    { id: 'lo-1-worked', kind: 'worked_example', problem: '2+2', steps: ['add'], answer: '4' },
    { id: 'lo-1-try', kind: 'try_yourself', problem: '3+3', expectedAnswer: '6' },
    { id: 'lo-2-hook', kind: 'hook', goal: 'Hook for LO2.' },
    { id: 'lo-2-concept', kind: 'concept', goal: 'Teach LO2.', keyIdeas: ['idea'] },
    { id: 'lo-2-worked', kind: 'worked_example', problem: '5+5', steps: ['add'], answer: '10' },
    { id: 'lo-2-try', kind: 'try_yourself', problem: '6+6', expectedAnswer: '12' },
    { id: 'recap', kind: 'recap', mustRemember: ['LO1', 'LO2'] },
  ];
}

function buildPlan(opts: { generated: boolean }): LessonPlan {
  return {
    id: `test-plan-${opts.generated ? 'generated' : 'curated'}`,
    title: 'Test plan',
    curriculum: opts.generated ? 'freestyle' : 'CCSS',
    grade: '8',
    subject: 'math',
    los: [
      { id: 'lo-1', description: 'LO one' },
      { id: 'lo-2', description: 'LO two' },
    ],
    estimatedMinutes: 30,
    segments: buildSegments(),
    prerequisites: [],
    followUps: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: opts.generated ? { generatedFromText: true } : { generatedFromText: false },
  };
}

const genPlan = buildPlan({ generated: true });
const curatedPlan = buildPlan({ generated: false });
const curatedPlanNoMeta: LessonPlan = { ...buildPlan({ generated: false }), metadata: undefined };

// Task 5 correction: a generated plan whose target LO carries an
// authored `shortTitle` that DIFFERS from what the description-capped
// fallback (capWords(description, 4)) would produce — since gen-v3,
// every runtime-generated LO carries one (stage-1 generates it;
// parseStage1Los derives a fallback when the model omits it). Kept as
// a SEPARATE fixture from genPlan (rather than adding shortTitle to
// genPlan.los directly) so the existing "beat title == 'LO two'"
// checks against genPlan stay unperturbed.
const genPlanWithShortTitle: LessonPlan = {
  ...buildPlan({ generated: true }),
  los: [
    { id: 'lo-1', description: 'LO one' },
    {
      id: 'lo-2',
      description: 'Trace the light reactions of photosynthesis step by step',
      shortTitle: 'Trace the light',
    },
  ],
};

/* ------------------------------------------------------------------ */
/* loGroupOf / firstLoGroup / isGeneratedPlan — unit sanity            */
/* ------------------------------------------------------------------ */

check('loGroupOf strips -hook/-concept/-worked/-try', [
  loGroupOf('lo-1-hook') === 'lo-1',
  loGroupOf('lo-1-concept') === 'lo-1',
  loGroupOf('lo-1-worked') === 'lo-1',
  loGroupOf('lo-1-try') === 'lo-1',
].every(Boolean));
check('loGroupOf: intro/recap are singleton groups', loGroupOf('intro') === 'intro' && loGroupOf('recap') === 'recap');
check('loGroupOf: non-suffixed id is its own group', loGroupOf('pick-los') === 'pick-los');
check('firstLoGroup(genPlan) === "lo-1"', firstLoGroup(genPlan) === 'lo-1');
check('isGeneratedPlan true/false', isGeneratedPlan(genPlan) === true && isGeneratedPlan(curatedPlan) === false);

/* ------------------------------------------------------------------ */
/* resolveAdvanceTarget — generated plan                              */
/* ------------------------------------------------------------------ */

check(
  'within-LO explicit jump allowed (lo-1-hook -> lo-1-try, skipping concept/worked)',
  resolveAdvanceTarget(genPlan, 'lo-1-hook', 'lo-1-try') === 'lo-1-try',
);
check(
  'within-LO explicit BACKWARD jump allowed (lo-1-try -> lo-1-hook, re-visit)',
  resolveAdvanceTarget(genPlan, 'lo-1-try', 'lo-1-hook') === 'lo-1-hook',
);
check(
  'intro -> first-LO segment allowed (any of lo-1-*)',
  resolveAdvanceTarget(genPlan, 'intro', 'lo-1-hook') === 'lo-1-hook'
  && resolveAdvanceTarget(genPlan, 'intro', 'lo-1-try') === 'lo-1-try',
);
check(
  'intro -> second-LO BLOCKED',
  resolveAdvanceTarget(genPlan, 'intro', 'lo-2-hook') === null,
);
check(
  'cross-LO BLOCKED when current LO\'s -try incomplete (lo-1-hook -> lo-2-hook, no completions)',
  resolveAdvanceTarget(genPlan, 'lo-1-hook', 'lo-2-hook', { completedSegmentIds: new Set() }) === null,
);
check(
  'cross-LO BLOCKED even from lo-1-try itself when not marked complete',
  resolveAdvanceTarget(genPlan, 'lo-1-try', 'lo-2-hook', { completedSegmentIds: new Set() }) === null,
);
check(
  'cross-LO ALLOWED once lo-1-try is in completedSegmentIds',
  resolveAdvanceTarget(genPlan, 'lo-1-worked', 'lo-2-hook', { completedSegmentIds: new Set(['lo-1-try']) }) === 'lo-2-hook',
);

/* ------------------------------------------------------------------ */
/* loBoundaryBeat + buildAdvanceBeatNote — deterministic LO-boundary   */
/* spoken beat wired into the advance_lesson tool-result text (Task 5) */
/* ------------------------------------------------------------------ */

check(
  'loBoundaryBeat fires on a generated-plan LO crossing (lo-1-try -> lo-2-hook)',
  (() => {
    const beat = loBoundaryBeat(genPlan, 'lo-1-try', 'lo-2-hook');
    return beat !== null && beat.loId === 'lo-2' && beat.index === 2 && beat.total === 2;
  })(),
);
check(
  'loBoundaryBeat: advance tool-result text for a generated-plan LO crossing contains "agenda item" and the LO title',
  (() => {
    const beat = loBoundaryBeat(genPlan, 'lo-1-try', 'lo-2-hook');
    if (!beat) return false;
    const note = buildAdvanceBeatNote(beat);
    return note.includes('agenda item') && note.includes(beat.title);
  })(),
);
check(
  'loBoundaryBeat: no beat within the same LO group (lo-1-hook -> lo-1-try)',
  loBoundaryBeat(genPlan, 'lo-1-hook', 'lo-1-try') === null,
);
check(
  'loBoundaryBeat: curated plans never get a beat',
  loBoundaryBeat(curatedPlan, 'lo-1-hook', 'lo-2-hook') === null,
);
// recap-wrapup-fix (root cause: prod session portal-db21d8f2 — student
// wrapped up early from lo-10-concept ("I'm done, can you recap the
// whole thing?"); recap was gated behind every LO's "-try" being
// complete, so the explicit jump was refused, 'next' would have forced
// more worked/try content on a departing student, and the brain never
// reached the recap segment at all. Early wrap-up is the NORMAL case
// for these variable-length sessions, not an edge case — recap must be
// reachable from anywhere, in any completion state.
check(
  'recap ALLOWED from any segment with NOTHING complete (early wrap-up, the prod failure mode)',
  resolveAdvanceTarget(genPlan, 'lo-1-concept', 'recap', { completedSegmentIds: new Set() }) === 'recap',
);
check(
  'recap ALLOWED from intro itself (student ends before any LO content)',
  resolveAdvanceTarget(genPlan, 'intro', 'recap', { completedSegmentIds: new Set() }) === 'recap',
);
check(
  'recap ALLOWED with only ONE of two LOs\' -try complete',
  resolveAdvanceTarget(genPlan, 'lo-2-worked', 'recap', { completedSegmentIds: new Set(['lo-1-try']) }) === 'recap',
);
check(
  'recap ALLOWED once every LO\'s -try is complete (unaffected — was already allowed)',
  resolveAdvanceTarget(genPlan, 'lo-2-worked', 'recap', { completedSegmentIds: new Set(['lo-1-try', 'lo-2-try']) }) === 'recap',
);
check(
  'recap ALLOWED with completedSegmentIds entirely omitted (no opts passed at all)',
  resolveAdvanceTarget(genPlan, 'lo-1-hook', 'recap') === 'recap',
);
check(
  'backward-to-intro from an LO group is allowed (harmless revisit)',
  resolveAdvanceTarget(genPlan, 'lo-1-concept', 'intro') === 'intro',
);
check(
  'outbound from recap is unrestricted (e.g. remediation back into an LO)',
  resolveAdvanceTarget(genPlan, 'recap', 'lo-1-hook') === 'lo-1-hook',
);

/* ------------------------------------------------------------------ */
/* checkGeneratedPlanAdvance — reason shape for the rejection message  */
/* ------------------------------------------------------------------ */

{
  const d = checkGeneratedPlanAdvance(genPlan, 'intro', 'lo-2-hook');
  check(
    'checkGeneratedPlanAdvance reason kind=intro-skip, remaining lists lo-1 segments',
    !d.allowed && d.reason.kind === 'intro-skip' && d.reason.remainingSegmentIds.includes('lo-1-hook'),
    JSON.stringify(d),
  );
}
{
  const d = checkGeneratedPlanAdvance(genPlan, 'lo-1-worked', 'lo-2-hook', new Set());
  check(
    'checkGeneratedPlanAdvance reason kind=lo-incomplete, remaining includes lo-1-try',
    !d.allowed && d.reason.kind === 'lo-incomplete' && d.reason.remainingSegmentIds.includes('lo-1-try'),
    JSON.stringify(d),
  );
}
{
  // recap-wrapup-fix: there is no 'recap-incomplete' reason kind any
  // more — checkGeneratedPlanAdvance's targetGroup === 'recap' branch
  // always returns { allowed: true }, from any current segment, at any
  // completion state (including none at all).
  const cases: Array<[string, ReadonlySet<string> | undefined]> = [
    ['lo-2-worked', new Set(['lo-1-try'])],
    ['intro', new Set()],
    ['lo-1-hook', undefined],
    ['lo-1-try', new Set(['lo-1-try', 'lo-2-try'])],
  ];
  check(
    'checkGeneratedPlanAdvance always allows target=recap regardless of current segment / completion state',
    cases.every(([from, completed]) => checkGeneratedPlanAdvance(genPlan, from, 'recap', completed).allowed === true),
    JSON.stringify(cases.map(([from, completed]) => [from, checkGeneratedPlanAdvance(genPlan, from, 'recap', completed)])),
  );
}

/* ------------------------------------------------------------------ */
/* Curated plan (no generatedFromText) — regression guard              */
/* ------------------------------------------------------------------ */

check(
  'curated plan (generatedFromText:false), identical shape: intro -> second-LO STILL allowed',
  resolveAdvanceTarget(curatedPlan, 'intro', 'lo-2-hook') === 'lo-2-hook',
);
check(
  'curated plan: cross-LO jump with nothing complete STILL allowed',
  resolveAdvanceTarget(curatedPlan, 'lo-1-hook', 'lo-2-try', { completedSegmentIds: new Set() }) === 'lo-2-try',
);
check(
  'curated plan: recap reachable with nothing complete',
  resolveAdvanceTarget(curatedPlan, 'lo-1-hook', 'recap') === 'recap',
);
check(
  'curated plan with metadata undefined (no generatedFromText key at all): still fully permissive',
  resolveAdvanceTarget(curatedPlanNoMeta, 'intro', 'lo-2-try') === 'lo-2-try',
);

/* ------------------------------------------------------------------ */
/* 'next' resolution — untouched by E6, on BOTH plan types             */
/* ------------------------------------------------------------------ */

check(
  '"next" walks in order on a generated plan regardless of LO/completion state (unaffected by E6)',
  resolveAdvanceTarget(genPlan, 'intro', 'next') === 'lo-1-hook'
  && resolveAdvanceTarget(genPlan, 'lo-1-hook', 'next') === 'lo-1-concept'
  && resolveAdvanceTarget(genPlan, 'lo-1-try', 'next') === 'lo-2-hook'
  && resolveAdvanceTarget(genPlan, 'lo-2-try', 'next') === 'recap',
);
check(
  '"next" walks in order on a curated plan too',
  resolveAdvanceTarget(curatedPlan, 'intro', 'next') === 'lo-1-hook',
);
check(
  '"previous" is likewise unaffected by E6 on a generated plan',
  resolveAdvanceTarget(genPlan, 'lo-2-hook', 'previous') === 'lo-1-try',
);

/* ------------------------------------------------------------------ */
/* Off-topic + unknown-id refusals unchanged                          */
/* ------------------------------------------------------------------ */

{
  const offTopicSegments: Segment[] = buildSegments().map((s): Segment => (
    s.id === 'lo-1-try' ? ({ ...s, offTopic: true } as Segment) : s
  ));
  const withOffTopic: LessonPlan = { ...genPlan, segments: offTopicSegments };
  check(
    'explicit id to an off-topic segment still refused (pre-existing behavior)',
    resolveAdvanceTarget(withOffTopic, 'lo-1-hook', 'lo-1-try') === null,
  );
}
check('unknown explicit id still refused', resolveAdvanceTarget(genPlan, 'lo-1-hook', 'no-such-segment') === null);

/* ------------------------------------------------------------------ */
/* Round-1 review fix: off-topic vs. LO-ordering attribution           */
/* ------------------------------------------------------------------ */
// resolveAdvanceTarget's off-topic check (context.ts) runs BEFORE the
// generated-plan LO-ordering branch, so an off-topic target that ALSO
// crosses an LO boundary is refused for being off-topic, not for LO
// order. checkGeneratedPlanAdvance itself has no offTopic awareness (it
// only sees ids/completion state), so calling it directly on such a
// target — which is what VoiceTutorRealtime.tsx's rejection-message
// builder used to do unconditionally — misreports 'lo-incomplete'. The
// fix excludes off-topic targets at the call site in
// VoiceTutorRealtime.tsx (checked via `targetSegForReject.offTopic !==
// true` before trusting checkGeneratedPlanAdvance's reason); that guard
// lives in the React component, not in any pure helper here, so it is
// NOT exercised by this script — verified instead by re-reading the
// call site and by `npx tsc --noEmit`. What IS verified here, at the
// pure-helper level: (a) resolveAdvanceTarget correctly refuses the
// off-topic+cross-LO target (the off-topic check wins), and (b)
// checkGeneratedPlanAdvance, called in isolation without offTopic
// awareness, WOULD misattribute it as 'lo-incomplete' — which is
// exactly the bug the React-site guard exists to prevent.
{
  const offTopicSegments2: Segment[] = buildSegments().map((s): Segment => (
    s.id === 'lo-2-hook' ? ({ ...s, offTopic: true } as Segment) : s
  ));
  const withOffTopic2: LessonPlan = { ...genPlan, segments: offTopicSegments2 };
  check(
    'resolveAdvanceTarget refuses an off-topic cross-LO target outright (off-topic check wins over LO-ordering)',
    resolveAdvanceTarget(withOffTopic2, 'lo-1-hook', 'lo-2-hook') === null,
  );
  check(
    'checkGeneratedPlanAdvance called in isolation (no offTopic awareness) DOES misreport this as lo-incomplete — this is exactly why VoiceTutorRealtime.tsx\'s rejection-message builder must check offTopic before trusting this reason (fixed there; not fixable inside this pure helper since offTopic lives on the Segment, not the ids checkGeneratedPlanAdvance receives)',
    (() => {
      const d = checkGeneratedPlanAdvance(withOffTopic2, 'lo-1-hook', 'lo-2-hook', new Set());
      return !d.allowed && d.reason.kind === 'lo-incomplete';
    })(),
  );
}
{
  // Round-1 review fix, other half: checkGeneratedPlanAdvance has no
  // curated-plan awareness of its own by design — resolveAdvanceTarget's
  // early-return (`if (!isGeneratedPlan(plan)) return target.id;`) is
  // what protects curated plans THERE. The React-site rejection-message
  // builder must independently gate on isGeneratedPlan(planForReject)
  // before calling checkGeneratedPlanAdvance, or a curated plan whose
  // ids happen to look LO-shaped (curatedPlan here has the identical
  // buildSegments() shape) could get a spurious 'lo-incomplete'-style
  // message attributed to a null caused by something else entirely.
  const d = checkGeneratedPlanAdvance(curatedPlan, 'lo-1-worked', 'lo-2-hook', new Set());
  check(
    'checkGeneratedPlanAdvance has no curated-plan awareness on its own — proves the isGeneratedPlan(planForReject) guard at the React call site is load-bearing, not redundant',
    !d.allowed && d.reason.kind === 'lo-incomplete',
  );
}

/* ------------------------------------------------------------------ */
/* filterRecapMustRemember — recap-wrapup-fix CRITICAL review fix      */
/* ------------------------------------------------------------------ */
// buildRecapSegment (generate-from-text.ts) stamps EVERY LO's description
// into mustRemember at generation time. Now that 'recap' is reachable from
// anywhere (above), a student who leaves after LO 2 of 10 would otherwise
// get a card + mandated walkthrough of LOs 3-10 — "must remember" facts
// never taught. filterRecapMustRemember scopes the card to LO groups
// actually covered: a group counts when it has >=1 completed segment id,
// OR it's currentSegmentId's own group (mid-LO when the student wrapped).

/** Four-LO generated plan (mirrors the "LO 2 of 10" review scenario at
 *  smaller scale) — recap's mustRemember built the same way
 *  buildRecapSegment does it: `los.map(lo => lo.description)`, so index i
 *  of `los` lines up with index i of `mustRemember` by construction. */
function buildFourLoPlan(): LessonPlan {
  const los = [
    { id: 'lo-1', description: 'Master LO one' },
    { id: 'lo-2', description: 'Master LO two' },
    { id: 'lo-3', description: 'Master LO three' },
    { id: 'lo-4', description: 'Master LO four' },
  ];
  const segments: Segment[] = [{ id: 'intro', kind: 'hook', goal: 'Acknowledge the material.' }];
  for (const lo of los) {
    segments.push(
      { id: `${lo.id}-hook`, kind: 'hook', goal: `Hook for ${lo.id}.` },
      { id: `${lo.id}-concept`, kind: 'concept', goal: `Teach ${lo.id}.`, keyIdeas: ['idea'] },
      { id: `${lo.id}-worked`, kind: 'worked_example', problem: '1+1', steps: ['add'], answer: '2' },
      { id: `${lo.id}-try`, kind: 'try_yourself', problem: '2+2', expectedAnswer: '4' },
    );
  }
  const recap: SegmentRecap = { id: 'recap', kind: 'recap', mustRemember: los.map((lo) => lo.description) };
  segments.push(recap);
  return {
    id: 'test-plan-four-lo',
    title: 'Four-LO test plan',
    curriculum: 'freestyle',
    grade: '8',
    subject: 'math',
    los,
    estimatedMinutes: 40,
    segments,
    prerequisites: [],
    followUps: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: { generatedFromText: true },
  };
}

const fourLoPlan = buildFourLoPlan();
const fourLoRecap = fourLoPlan.segments.find((s) => s.kind === 'recap') as SegmentRecap;

check(
  'the prod failure shape: wraps up mid-LO-2 of 4 with nothing marked complete — only LO2 (current) qualifies',
  (() => {
    const r = filterRecapMustRemember(fourLoPlan, fourLoRecap, new Set(), 'lo-2-concept');
    return !r.skip && r.items.length === 1 && r.items[0] === 'Master LO two';
  })(),
);

check(
  'completed LO1 + currently mid-LO3: both qualify, in PLAN order (not visitation order)',
  (() => {
    const r = filterRecapMustRemember(fourLoPlan, fourLoRecap, new Set(['lo-1-try']), 'lo-3-hook');
    return !r.skip && r.items.length === 2 && r.items[0] === 'Master LO one' && r.items[1] === 'Master LO three';
  })(),
);

check(
  'wraps up from "intro" (never started an LO) — zero LOs qualify, skip:true, empty items',
  (() => {
    const r = filterRecapMustRemember(fourLoPlan, fourLoRecap, new Set(), 'intro');
    return r.skip === true && r.items.length === 0;
  })(),
);

check(
  'currentSegmentId already moved to "recap" itself (no LO group) — only completed LOs qualify, none here — skip:true',
  (() => {
    const r = filterRecapMustRemember(fourLoPlan, fourLoRecap, new Set(), 'recap');
    return r.skip === true && r.items.length === 0;
  })(),
);

check(
  'currentSegmentId "recap" WITH a genuinely completed LO still surfaces that LO — skip:false',
  (() => {
    const r = filterRecapMustRemember(fourLoPlan, fourLoRecap, new Set(['lo-2-try']), 'recap');
    return !r.skip && r.items.length === 1 && r.items[0] === 'Master LO two';
  })(),
);

check(
  'every LO genuinely complete — full unfiltered mustRemember, matching pre-fix behavior exactly',
  (() => {
    const allTries = new Set(['lo-1-try', 'lo-2-try', 'lo-3-try', 'lo-4-try']);
    const r = filterRecapMustRemember(fourLoPlan, fourLoRecap, allTries, 'lo-4-try');
    return !r.skip && r.items.length === 4
      && r.items.join('|') === fourLoRecap.mustRemember.join('|');
  })(),
);

check(
  'completedSegmentIds omitted entirely (undefined) still resolves via currentSegmentId alone',
  (() => {
    const r = filterRecapMustRemember(fourLoPlan, fourLoRecap, undefined, 'lo-1-worked');
    return !r.skip && r.items.length === 1 && r.items[0] === 'Master LO one';
  })(),
);

// CALLER CONTRACT regression guard: this is exactly the contamination
// scenario the doc comment warns callers about. applyResolvedAdvance
// (VoiceTutorRealtime.tsx) auto-marks every segment a forward jump passes
// OVER as "completed" — so if a caller read completedSegmentIds AFTER
// applying this turn's advance_lesson({to:"recap"}) instead of BEFORE,
// every skipped LO would incorrectly qualify. Simulating that contaminated
// input here proves the filter itself has no defense against it — the
// defense is the caller's snapshot-before-advance discipline, documented
// and exercised (not re-derived) at the VoiceTutorRealtime.tsx call site.
check(
  'contamination sanity check: an already-contaminated completedSegmentIds (as if read post-advance) WOULD wrongly pass every LO — proves the pre-turn-snapshot caller contract is load-bearing, not redundant',
  (() => {
    const contaminatedAsIfPostAdvance = new Set([
      'lo-1-hook', 'lo-1-concept', 'lo-1-worked', 'lo-1-try',
      'lo-2-hook', 'lo-2-concept', // auto-marked "visited" by the SAME turn's forced jump past LO2
      'lo-3-hook', 'lo-3-concept', 'lo-3-worked', 'lo-3-try',
      'lo-4-hook', 'lo-4-concept', 'lo-4-worked', 'lo-4-try',
    ]);
    const r = filterRecapMustRemember(fourLoPlan, fourLoRecap, contaminatedAsIfPostAdvance, 'recap');
    return !r.skip && r.items.length === 4;
  })(),
);

// Curated-plan callers pass mustRemember through UNFILTERED —
// VoiceTutorRealtime.tsx gates the filter on isGeneratedPlan(plan) at the
// call site, so filterRecapMustRemember is never invoked for a curated
// plan's recap card. That gating is a call-site `if`, not a branch inside
// this pure helper, so it isn't exercised here — verified instead by
// re-reading the call site and by `npx tsc --noEmit`.

/* ------------------------------------------------------------------ */
/* Task 5 fix — makeToolResultProvider's advance_lesson branch         */
/* (src/app/api/tutor/brain/stream/route.ts): the REAL intra-          */
/* generation Anthropic tool_result for advance_lesson. The LO-        */
/* boundary beat now rides THIS channel (folded into `instruction`)    */
/* instead of the client-side rejected→retry channel (reverted in      */
/* VoiceTutorRealtime.tsx — that channel forced an extra brain round-  */
/* trip + a spurious "Re-rendering whiteboard…" toast on every LO      */
/* crossing). `makeToolResultProvider` doesn't touch the DB or an LLM  */
/* for the advance_lesson case (only generate_problem does), so it's   */
/* async-but-pure here and safe to exercise directly. Imported lazily  */
/* (async) so a route.ts import failure surfaces as a single failed    */
/* check rather than crashing the whole script before the synchronous  */
/* checks above get a chance to run/report.                            */
/* ------------------------------------------------------------------ */

async function runAdvanceToolResultProviderChecks(): Promise<void> {
  const { makeToolResultProvider } = await import('../src/app/api/tutor/brain/stream/route');

  const crossingCtx = buildLessonPlanContext(genPlan, 'lo-1-try')!;
  const crossingProvider = makeToolResultProvider(crossingCtx, [], []);
  const crossingResult = JSON.parse(await crossingProvider!('advance_lesson', { to: 'lo-2-hook' }));
  check(
    'makeToolResultProvider (route.ts): generated-plan LO-crossing advance_lesson tool_result names the agenda item in `instruction`',
    crossingResult.ok === true
      && typeof crossingResult.instruction === 'string'
      && crossingResult.instruction.includes('agenda item')
      && crossingResult.instruction.includes('LO two'),
    JSON.stringify(crossingResult),
  );

  const withinCtx = buildLessonPlanContext(genPlan, 'lo-1-hook')!;
  const withinProvider = makeToolResultProvider(withinCtx, [], []);
  const withinResult = JSON.parse(await withinProvider!('advance_lesson', { to: 'lo-1-try' }));
  check(
    'makeToolResultProvider (route.ts): within-LO advance_lesson tool_result carries NO beat note',
    withinResult.ok === true && !String(withinResult.instruction).includes('agenda item'),
    JSON.stringify(withinResult),
  );

  const curatedCtx = buildLessonPlanContext(curatedPlan, 'lo-1-try')!;
  const curatedProvider = makeToolResultProvider(curatedCtx, [], []);
  const curatedResult = JSON.parse(await curatedProvider!('advance_lesson', { to: 'lo-2-hook' }));
  check(
    'makeToolResultProvider (route.ts): curated-plan advance_lesson tool_result NEVER carries a beat note, even on an LO-shaped id crossing',
    curatedResult.ok === true && !String(curatedResult.instruction).includes('agenda item'),
    JSON.stringify(curatedResult),
  );

  // Task 5 correction: the los projection reaching route.ts (via
  // buildLessonPlanContext → the brain request body → ctx.plan.los)
  // must carry shortTitle, and the beat must name THAT — not the
  // capWords(description, 4) fallback — so the spoken beat and the
  // rail (which displays shortTitle client-side) agree on the LO's
  // name. capWords('Trace the light reactions of photosynthesis step
  // by step', 4) would yield "Trace the light reactions" (4 words) —
  // a DIFFERENT string from the authored shortTitle "Trace the light"
  // — so this only passes if shortTitle actually made it through.
  const shortTitleCtx = buildLessonPlanContext(genPlanWithShortTitle, 'lo-1-try')!;
  const shortTitleProvider = makeToolResultProvider(shortTitleCtx, [], []);
  const shortTitleResult = JSON.parse(await shortTitleProvider!('advance_lesson', { to: 'lo-2-hook' }));
  check(
    'makeToolResultProvider (route.ts): beat title uses the LO shortTitle end-to-end (los projection carries it), not the description-derived fallback',
    shortTitleResult.ok === true
      && String(shortTitleResult.instruction).includes('"Trace the light".')
      && !String(shortTitleResult.instruction).includes('"Trace the light reactions"'),
    JSON.stringify(shortTitleResult),
  );

  // Code-review fix (2026-08-10): the provider closure is created ONCE
  // per HTTP request, but the agent loop can call advance_lesson
  // multiple times in the SAME turn (MAX_AGENT_ITERATIONS). Prove the
  // SAME provider instance tracks ITS OWN live segment position across
  // repeated calls rather than resolving every call against the frozen
  // turn-start ctx.currentSegmentId. Sequence: intro -> lo-1 (beat 1
  // of 2) -> lo-2 (beat 2 of 2, no leftover LO-1 text) -> a second
  // lo-2 segment (no beat — this third call is the one that actually
  // distinguishes the fix: pre-fix, loBoundaryBeat would compare
  // against the frozen 'intro' turn-start position, see 'intro' !=
  // 'lo-2' groups, and spuriously re-fire the LO-2 beat a second time
  // for content already announced by call 2).
  const multiAdvanceCtx = buildLessonPlanContext(genPlan, 'intro')!;
  const multiAdvanceProvider = makeToolResultProvider(multiAdvanceCtx, [], []);

  const multiAdvance1 = JSON.parse(await multiAdvanceProvider!('advance_lesson', { to: 'lo-1-hook' }));
  check(
    'makeToolResultProvider (route.ts) multi-advance turn, call 1 (intro -> lo-1-hook): beat for LO 1 of 2',
    multiAdvance1.ok === true && String(multiAdvance1.instruction).includes('agenda item 1 of 2: "LO one"'),
    JSON.stringify(multiAdvance1),
  );

  const multiAdvance2 = JSON.parse(await multiAdvanceProvider!('advance_lesson', { to: 'lo-2-hook' }));
  check(
    'makeToolResultProvider (route.ts) multi-advance turn, call 2 (lo-1-hook -> lo-2-hook, SAME provider instance): beat for LO 2 of 2, NOT a duplicate LO-1 beat',
    multiAdvance2.ok === true
      && String(multiAdvance2.instruction).includes('agenda item 2 of 2: "LO two"')
      && !String(multiAdvance2.instruction).includes('agenda item 1 of 2'),
    JSON.stringify(multiAdvance2),
  );

  const multiAdvance3 = JSON.parse(await multiAdvanceProvider!('advance_lesson', { to: 'lo-2-concept' }));
  check(
    'makeToolResultProvider (route.ts) multi-advance turn, call 3 (lo-2-hook -> lo-2-concept, WITHIN lo-2, SAME provider instance): NO beat (proves liveSegmentId, not frozen ctx.currentSegmentId, drives the crossing check)',
    multiAdvance3.ok === true && !String(multiAdvance3.instruction).includes('agenda item'),
    JSON.stringify(multiAdvance3),
  );
}

runAdvanceToolResultProviderChecks()
  .catch((err) => {
    failed++;
    console.log(`  ✗ makeToolResultProvider checks threw: ${(err as Error).message}`);
  })
  .then(() => {
    console.log(`\n${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  });
