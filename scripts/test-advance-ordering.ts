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
} from '../src/lib/tutor/lesson-plan/context';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';
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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
