/**
 * Rail labels — pure segment/LO label parsing and rail item building.
 *
 * Pure/deterministic tests for buildRailModel, buildLabelPrompt,
 * parseLabelResponse, and railStageLabel in src/lib/tutor/lesson-plan/rail-labels.ts.
 * No DB, no LLM calls — builds fake LessonPlan object literals in-process,
 * mirroring scripts/test-agenda.ts's pattern.
 *
 * Usage: npx tsx scripts/test-rail-labels.ts
 */
import {
  buildRailModel,
  buildLabelPrompt,
  parseLabelResponse,
  railStageLabel,
  loBoundaryBeat,
  buildAdvanceBeatNote,
  railJumpCandidates,
} from '../apps/marketing/src/lib/tutor/lesson-plan/rail-labels';
import type { LessonPlan, LearningObjective, Segment, SegmentRecap } from '../apps/marketing/src/lib/tutor/lesson-plan/types';
import { LESSON_PLAN_SCHEMA_VERSION } from '../apps/marketing/src/lib/tutor/lesson-plan/types';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

/** Build a minimal Segment for a given id. Kind defaults to 'concept'
 *  except ids containing hook/try/recap, per the task pattern. */
function segmentFor(id: string): Segment {
  if (id === 'intro' || id.includes('hook')) return { id, kind: 'hook', goal: 'test hook' };
  if (id.includes('try')) return { id, kind: 'try_yourself', problem: 'test problem', expectedAnswer: 'test answer' };
  if (id === 'recap' || id.includes('recap')) return { id, kind: 'recap', mustRemember: [] };
  // Default segment types for other cases
  if (id.includes('worked') || id.includes('letter')) return { id, kind: 'worked_example', problem: 'test problem', steps: ['step 1'] };
  if (id.includes('misconception')) return { id, kind: 'misconception_check', question: 'test question', commonErrors: [] };
  return { id, kind: 'concept', goal: 'test concept', keyIdeas: ['idea'] };
}

/** Local helper building a minimal LessonPlan from just the bits each
 *  case cares about (segmentIds, los, title, metadata). */
function mkPlan(opts: {
  segmentIds: string[];
  los?: LearningObjective[];
  title?: string;
  metadata?: Record<string, unknown>;
}): LessonPlan {
  const segments = opts.segmentIds.map(segmentFor);
  return {
    id: 'test-plan-rail',
    title: opts.title ?? 'Test plan',
    curriculum: 'freestyle',
    grade: '8',
    subject: 'science',
    los: opts.los ?? [],
    estimatedMinutes: 30,
    segments,
    prerequisites: [],
    followUps: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: opts.metadata,
  };
}

/* ------------------------------------------------------------------ */
/* buildRailModel — rail item creation                                */
/* ------------------------------------------------------------------ */

// Case 1: generated plan → one item per LO group, shortTitle labels, intro/recap standalone
{
  const gen = mkPlan({
    metadata: { generatedFromText: true },
    los: [
      { id: 'lo-a', description: 'Explain photosynthesis inputs and outputs', shortTitle: 'Photosynthesis inputs' },
      { id: 'lo-b', description: 'Trace the light reactions step by step' },
    ],
    segmentIds: ['intro', 'lo-a-hook', 'lo-a-concept', 'lo-a-try', 'lo-b-hook', 'lo-b-concept', 'recap'],
  });
  const m1 = buildRailModel(gen, 'lo-a-concept', new Set(['intro', 'lo-a-hook']), null)!.items;
  assert(m1.map(i => i.key).join(',') === 'intro,lo-a,lo-b,recap', 'gen grouping order');
  assert(m1[1].label === 'Photosynthesis inputs', 'gen shortTitle label');
  assert(m1[1].current === true && m1[0].done === true && m1[1].done === false, 'gen flags');
  assert(m1[2].label.split(' ').length <= 4, 'gen derived label bounded');
  assert(m1[0].label === 'Intro' && m1[3].label === 'Recap', 'standalone fixed labels');
}

// Case 2: curated plan, 2 DISTINCT LOs (boundary — 2 is NOT single-LO) +
// content labels → one item per segment, labeled; hook/recap fixed.
// (Task 1: this fixture used to carry only 1 LO, which — post-fix — IS
// the single-LO signal and would now correctly get stage labels instead;
// bumped to 2 LOs here so this pin keeps testing genuine multi-LO curated
// content-label behavior, unchanged from before Task 1.)
{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [
      { id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' },
      { id: 'apush.columbian-exchange.disease', description: 'Explain the disease vector…' },
    ],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const labels = { 'concept-cx': 'Two-way exchange', 'worked-letter': "Columbus's letter",
    'try-saq': 'Practice: SAQ', 'misconception-one-way': 'One-way myth' };
  const m2 = buildRailModel(curated, 'worked-letter', new Set(['hook', 'concept-cx']), labels)!.items;
  assert(m2.length === 6 && m2[0].label === 'Hook' && m2[5].label === 'Recap', 'curated fixed ends');
  assert(m2[1].label === 'Two-way exchange' && m2[2].current === true, 'curated content labels (2-LO, not single-LO)');
}

// Case 3: curated, NO labels (atomic / labeler failed) → stage-label fallback with occurrence numbering.
// `curated` (m3) also bumped 1 LO → 2 LOs (R48 review Finding 2 disclosure,
// same reason as Case 2/6/lo-c below): at 1 LO this fixture would now hit
// the loCount<=1 BYPASS branch instead of the >1-LO curated-no-labels
// fallback branch it originally meant to test. Kept at 2 LOs so m3
// specifically covers the >1-LO branch's stage-fallback path; `twoTries`
// (m4, 0 LO, unchanged) covers the SAME stage-fallback machinery via the
// bypass branch — together this one block exercises stage-fallback
// labeling on both branches without relying on Case 8/9's coverage alone.
{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [
      { id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' },
      { id: 'apush.columbian-exchange.disease', description: 'Explain the disease vector…' },
    ],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const m3 = buildRailModel(curated, 'hook', new Set(), null)!.items;
  assert(m3.map(i => i.label).join('|') === 'Hook|Concept|Example|Try|Misconception|Recap', 'stage fallback (>1-LO curated branch)');
  const twoTries = mkPlan({ los: [], segmentIds: ['hook', 'try-1', 'try-2', 'recap'] });
  const m4 = buildRailModel(twoTries, 'try-2', new Set(['hook', 'try-1']), null)!.items;
  assert(m4[1].label === 'Try 1' && m4[2].label === 'Try 2', 'occurrence numbering (bypass branch, 0-LO)');
}

/* ------------------------------------------------------------------ */
/* Task 1 — single-LO curated plans get stage-style rail labels        */
/* Live failure (session portal-1349716e, evelyn.ap.macro.scarcity.v1):*/
/* a curated plan with exactly ONE LO in `los` and segment ids that do */
/* NOT follow the generated-plan "<loId>-hook" suffix convention (they */
/* carry NO lo id at all — SegmentBase has no such field) rendered     */
/* per-question CONTENT labels ("Wealth and scarcity", "Scarcity vs.   */
/* poverty") on every try_yourself pill. Praveen's call: topic/stage-  */
/* level names only. Fix: ≤1 distinct LO → every rail item uses the    */
/* kind-derived stage machinery (STAGE_WORD + sameKind numbering),     */
/* even when a `labels` cache/derivation exists — content labels are   */
/* ignored entirely for single-LO plans.                               */
/* ------------------------------------------------------------------ */

// Case 8: the live plan's exact 8-segment shape, single LO, WITH a
// (fake) content-labels map supplied — proves the labels are IGNORED,
// not merely absent, for a single-LO curated plan.
{
  const scarcity = mkPlan({
    title: 'U1.1 Scarcity, Choice, and Trade-offs',
    los: [{ id: 'apmacro.scarcity', description: 'Define scarcity and identify trade-offs and opportunity cost.' }],
    segmentIds: [
      'hook', 'concept-scarcity', 'worked-budget', 'try-define', 'try-textbook',
      'try-billionaire', 'misconception-poverty', 'recap',
    ],
  });
  const contentLabels = {
    'concept-scarcity': 'Wealth and scarcity',
    'worked-budget': 'Budgeting trade-offs',
    'try-define': 'Define scarcity',
    'try-textbook': 'Town budget',
    'try-billionaire': 'Billionaire claim',
    'misconception-poverty': 'Scarcity vs. poverty',
  };
  const m8 = buildRailModel(scarcity, 'concept-scarcity', new Set(['hook']), contentLabels)!.items;
  assert(
    m8.map(i => i.label).join(',') === 'Hook,Concept,Example,Try 1,Try 2,Try 3,Misconception,Recap',
    'single-LO curated plan: stage labels for every segment, content labels ignored',
  );
}

// Case 9: 1-LO curated plan, NO labels — same stage-label outcome
// (belt-and-suspenders: single-LO must win whether or not a labels
// cache exists, not just as a fallback for a missing one).
{
  const scarcity = mkPlan({
    los: [{ id: 'apmacro.scarcity', description: 'Define scarcity.' }],
    segmentIds: ['hook', 'concept-scarcity', 'try-define', 'recap'],
  });
  const m9 = buildRailModel(scarcity, 'hook', new Set(), null)!.items;
  assert(m9.map(i => i.label).join(',') === 'Hook,Concept,Try,Recap', 'single-LO curated plan, no labels: stage fallback');
}

// Case 10: 0-LO curated plan (los: []) — "no lo ids at all" also counts
// as the single-LO signal (0 distinct LOs is <= 1).
{
  const noLo = mkPlan({ los: [], segmentIds: ['hook', 'concept-x', 'recap'] });
  const labels = { 'concept-x': 'Some content label' };
  const m10 = buildRailModel(noLo, 'hook', new Set(), labels)!.items;
  assert(m10.map(i => i.label).join(',') === 'Hook,Concept,Recap', '0-LO curated plan: stage labels, content label ignored');
}

// Case 11 (R48 review Finding 1): a GENERATED single-LO plan carries an
// 'intro' segment (kind 'hook') AND the LO's own '<loId>-hook' segment —
// both kind 'hook'. Reachable: generate-from-text has no minimum-LO
// enforcement, and every generated LO mints its own -hook. Without the
// railStageLabel intro special-case, the loCount<=1 bypass branch would
// number them 'Hook 1, Hook 2', colliding the plan's intro with the
// lesson's actual hook.
{
  const genSingle = mkPlan({
    metadata: { generatedFromText: true },
    los: [{ id: 'lo-a', description: 'Explain photosynthesis inputs and outputs', shortTitle: 'Photosynthesis inputs' }],
    segmentIds: ['intro', 'lo-a-hook', 'lo-a-concept', 'lo-a-try', 'recap'],
  });
  const m11 = buildRailModel(genSingle, 'intro', new Set(), null)!.items;
  assert(m11.map(i => i.label).join(',') === 'Intro,Hook,Concept,Try,Recap', 'generated single-LO plan: Intro/Hook do not collide under sameKind numbering');
}

// Case 4: suppression — pendingPicker → null
{
  assert(buildRailModel(mkPlan({ metadata: { pendingPicker: true }, segmentIds: ['hook'] }), 'hook', new Set(), null) === null, 'picker suppressed');
}

/* ------------------------------------------------------------------ */
/* buildRailModel — offPlan flag (Task 3, rail-bargein): the client   */
/* releases the cursor to '' when the tutor goes off-plan (barge-in)  */
/* ------------------------------------------------------------------ */
{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  assert(buildRailModel(curated, '', new Set(), null)!.offPlan === true, 'empty cursor → offPlan flag set');
  assert(buildRailModel(curated, '', new Set(), null)!.items.every((i) => !i.current), 'empty cursor → no item current');
  assert(buildRailModel(curated, 'hook', new Set(), null)!.offPlan === false, 'normal cursor → offPlan false');
}

/* ------------------------------------------------------------------ */
/* railJumpCandidates — Task 2 (rail-bargein): student-jump-intent    */
/* candidate list, reusing buildRailModel's exact grouping            */
/* ------------------------------------------------------------------ */

// Case 5: generated plan — one candidate per LO group (matches Case 1's grouping)
{
  const gen = mkPlan({
    metadata: { generatedFromText: true },
    los: [
      { id: 'lo-a', description: 'Explain photosynthesis inputs and outputs', shortTitle: 'Photosynthesis inputs' },
      { id: 'lo-b', description: 'Trace the light reactions step by step' },
    ],
    segmentIds: ['intro', 'lo-a-hook', 'lo-a-concept', 'lo-a-try', 'lo-b-hook', 'lo-b-concept', 'recap'],
  });
  const jc1 = railJumpCandidates(gen, null);
  assert(jc1.length === 4, 'gen: 4 candidates (intro, lo-a, lo-b, recap)');
  assert(jc1[1].label === 'Photosynthesis inputs' && jc1[1].segmentIds.join(',') === 'lo-a-hook,lo-a-concept,lo-a-try', 'gen: lo-a candidate groups its segments under the shortTitle label');
  assert(jc1[0].label === 'Intro' && jc1[0].segmentIds.join(',') === 'intro', 'gen: intro candidate standalone');
  assert(jc1[3].label === 'Recap' && jc1[3].segmentIds.join(',') === 'recap', 'gen: recap candidate standalone');
}

// Case 6: curated plan (2 LOs, matching Case 2's boundary fixture) + labels
// — one candidate per segment (matches Case 2's grouping)
{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [
      { id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' },
      { id: 'apush.columbian-exchange.disease', description: 'Explain the disease vector…' },
    ],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const labels = { 'concept-cx': 'Two-way exchange', 'worked-letter': "Columbus's letter",
    'try-saq': 'Practice: SAQ', 'misconception-one-way': 'One-way myth' };
  const jc2 = railJumpCandidates(curated, labels);
  assert(jc2.length === 6, 'curated: one candidate per segment');
  assert(jc2[1].label === 'Two-way exchange' && jc2[1].segmentIds.join(',') === 'concept-cx', 'curated: content label + single-segment group');
  assert(jc2[0].label === 'Hook' && jc2[5].label === 'Recap', 'curated: fixed-label ends carried through');
}

// Case 7: suppression — pendingPicker → [] (matcher no-ops on empty candidates)
{
  const jc3 = railJumpCandidates(mkPlan({ metadata: { pendingPicker: true }, segmentIds: ['hook'] }), null);
  assert(Array.isArray(jc3) && jc3.length === 0, 'picker suppressed → []');
}

/* ------------------------------------------------------------------ */
/* loBoundaryBeat — deterministic LO-boundary spoken beat (Task 5)    */
/* ------------------------------------------------------------------ */

{
  const gen = mkPlan({
    metadata: { generatedFromText: true },
    los: [
      { id: 'lo-a', description: 'Explain photosynthesis inputs and outputs', shortTitle: 'Photosynthesis inputs' },
      { id: 'lo-b', description: 'Trace the light reactions step by step', shortTitle: 'Trace the light' },
    ],
    segmentIds: ['intro', 'lo-a-hook', 'lo-a-concept', 'lo-a-try', 'lo-b-hook', 'lo-b-concept', 'recap'],
  });
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  assert(loBoundaryBeat(gen, 'lo-a-try', 'lo-b-hook')!.title === 'Trace the light', 'beat on crossing (derived title)');
  assert(loBoundaryBeat(gen, 'lo-a-hook', 'lo-a-concept') === null, 'no beat within group');
  assert(loBoundaryBeat(gen, 'intro', 'lo-a-hook')!.index === 1, 'intro→first LO counts as crossing, index 1-based');
  assert(loBoundaryBeat(gen, 'lo-b-concept', 'recap') === null, 'crossing into recap: no beat (recap has its own card flow)');
  assert(loBoundaryBeat(curated, 'hook', 'concept-cx') === null, 'curated: never');
}

/* ------------------------------------------------------------------ */
/* buildAdvanceBeatNote — tool-result text wording                    */
/* ------------------------------------------------------------------ */

{
  const note = buildAdvanceBeatNote({ title: 'Trace the light', index: 2, total: 2 });
  assert(note.includes('agenda item 2 of 2'), 'buildAdvanceBeatNote includes agenda item index/total');
  assert(note.includes('Trace the light'), 'buildAdvanceBeatNote includes the LO title');
  assert(/ONE short spoken transition sentence/.test(note), 'buildAdvanceBeatNote instructs ONE short spoken transition sentence');
}

/* ------------------------------------------------------------------ */
/* parseLabelResponse — JSON parsing + word cap                       */
/* ------------------------------------------------------------------ */

{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const p = (raw: string) => parseLabelResponse(raw, curated);
  assert(p('{"labels":[{"id":"concept-cx","label":"Two-way exchange"}]}')!['concept-cx'] === 'Two-way exchange', 'parse ok');
  assert(p('{"labels":[{"id":"concept-cx","label":"one two three four five"}]}')!['concept-cx'].split(' ').length <= 3, 'word cap 3');
  assert(p('{"atomic": true}') === null, 'atomic → null');
  assert(p('```json\n{"labels":[{"id":"concept-cx","label":"Fenced"}]}\n```')!['concept-cx'] === 'Fenced', 'fence tolerant');
  assert(p('not json') === null && p('{"labels":[{"id":"nope","label":"X"}]}') === null, 'junk + unknown ids → null');
  assert(p('{"labels":[{"id":"concept-cx","label":"Same"},{"id":"worked-letter","label":"Same"}]}') === null, 'all-duplicate labels → null (atomic)');
  assert(p('{"labels":[null]}') === null, 'null array entry → null');
  assert(p('{"labels":[42]}') === null, 'non-object array entry → null');
}

/* ------------------------------------------------------------------ */
/* R46 (a) — trailing-stopword strip after capWords' hard word cut    */
/* Live bug (session portal-0c48edbb): "Cover the limit laws and      */
/* direct substitution" capped at MAX_LABEL_WORDS=3 left "Limit laws  */
/* and" — a dangling conjunction. capLabel strips it post-cap.        */
/* ------------------------------------------------------------------ */

{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const p = (raw: string) => parseLabelResponse(raw, curated);
  assert(
    p('{"labels":[{"id":"concept-cx","label":"Limit laws and direct substitution"}]}')!['concept-cx'] === 'Limit laws',
    'live shape: dangling trailing "and" stripped after the 3-word cap',
  );
  assert(
    p('{"labels":[{"id":"concept-cx","label":"River delta formation"}]}')!['concept-cx'] === 'River delta formation',
    'no dangling stopword after cap: 3-word cap unaffected by the strip',
  );
  assert(
    p('{"labels":[{"id":"concept-cx","label":"River delta"}]}')!['concept-cx'] === 'River delta',
    '2-word label with no trailing stopword: unchanged',
  );
}

// loDisplay's 4-word LO-description fallback (no shortTitle) hits the same
// capWords→dangling-stopword failure mode — verify the strip applies there
// too (generated-plan rail item + railLoTitle both route through loDisplay).
// 2 LOs (not 1) — Task 1 made single-LO plans bypass loDisplay entirely in
// favor of stage labels, so this needs a genuinely multi-LO plan to still
// exercise the loDisplay grouped-label path.
{
  const gen = mkPlan({
    metadata: { generatedFromText: true },
    los: [
      { id: 'lo-c', description: 'Explain the process and results in detail' }, // no shortTitle
      { id: 'lo-d', description: 'Summarize the outcome', shortTitle: 'Summarize outcome' },
    ],
    segmentIds: ['intro', 'lo-c-hook', 'lo-c-concept', 'lo-d-hook', 'recap'],
  });
  const m5 = buildRailModel(gen, 'lo-c-concept', new Set(), null)!.items;
  assert(m5[1].label === 'Explain the process', 'LO 4-word fallback: dangling "and" stripped');
}

/* ------------------------------------------------------------------ */
/* buildLabelPrompt — segment list + field inclusion                  */
/* ------------------------------------------------------------------ */

{
  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  const prompt = buildLabelPrompt(curated);
  assert(prompt.includes('concept-cx') && prompt.includes('try-saq'), 'prompt lists labelable segments');
  assert(!prompt.includes('"hook"') && !prompt.includes('"recap"'), 'hook/recap not sent for labeling');
}

/* ------------------------------------------------------------------ */
/* deriveSegmentLabels — cache-through Haiku derivation (Mongo)       */
/* ------------------------------------------------------------------ */

async function runMongoCases() {
  if (!process.env.MONGODB_URI) {
    console.log('skip mongo cases');
    return;
  }

  const { deriveSegmentLabels } = await import('../apps/marketing/src/lib/tutor/lesson-plan/derive-rail-labels');
  const { LessonPlanRailLabelsModel, buildRailLabelsId } = await import('../apps/marketing/src/models/LessonPlanRailLabels');
  const { RAIL_LABELS_VERSION } = await import('../apps/marketing/src/lib/tutor/lesson-plan/rail-labels');
  const { default: connectDB } = await import('@core/db');
  const { upsertLessonPlan, deleteLessonPlan } = await import('../apps/marketing/src/lib/tutor/lesson-plan/store');
  const { GET: railLabelsGET } = await import('../apps/marketing/src/app/api/tutor/lesson-plans/[id]/rail-labels/route');

  await connectDB();

  /** Minimal forged NextRequest + params-promise ctx, mirroring
   *  test-plan-generate.ts's `new Request(...) as unknown as NextRequest`
   *  pattern for calling a route handler in-process. */
  async function callRailLabelsRoute(id: string) {
    const req = new Request(`https://engine.test/api/tutor/lesson-plans/${id}/rail-labels`) as unknown as Parameters<typeof railLabelsGET>[0];
    const res = await railLabelsGET(req, { params: Promise.resolve({ id }) });
    return { status: res.status, json: await res.json() };
  }

  const curated = mkPlan({
    title: 'U1.4 The Columbian Exchange',
    los: [{ id: 'apush.columbian-exchange', description: 'Explain the causes and effects…' }],
    segmentIds: ['hook', 'concept-cx', 'worked-letter', 'try-saq', 'misconception-one-way', 'recap'],
  });
  curated.id = 'test-plan-rail-mongo-1';
  const rowId = buildRailLabelsId(curated.id, RAIL_LABELS_VERSION);

  try {
    // Case: first call — no cache row, calls fn, parses + persists.
    let calls = 0;
    const fakeComplete = async (_prompt: string) => {
      calls++;
      return '{"labels":[{"id":"concept-cx","label":"Two-way exchange"},{"id":"worked-letter","label":"Columbus letter"},{"id":"try-saq","label":"SAQ practice"},{"id":"misconception-one-way","label":"One-way myth"}]}';
    };
    const first = await deriveSegmentLabels(curated, fakeComplete);
    assert(first !== null && first['concept-cx'] === 'Two-way exchange', 'mongo: first call returns parsed labels');
    assert(calls === 1, 'mongo: first call invokes complete once');
    const row = await LessonPlanRailLabelsModel.findById(rowId).lean();
    assert(!!row && row.planId === curated.id, 'mongo: row persisted under planId::version id');

    // Case: second call — cache hit, does NOT re-invoke fn.
    const second = await deriveSegmentLabels(curated, fakeComplete);
    assert(second !== null && second['concept-cx'] === 'Two-way exchange', 'mongo: second call returns same labels');
    assert(calls === 1, 'mongo: second call is a cache hit (calls still 1)');

    // Case: atomic plan — fn returns {"atomic":true}, marker row written, no re-invoke.
    const atomicPlan = mkPlan({
      title: 'Atomic lesson',
      segmentIds: ['hook', 'concept-only', 'recap'],
    });
    atomicPlan.id = 'test-plan-rail-mongo-atomic-1';
    const atomicRowId = buildRailLabelsId(atomicPlan.id, RAIL_LABELS_VERSION);
    try {
      let atomicCalls = 0;
      const atomicComplete = async (_prompt: string) => { atomicCalls++; return '{"atomic": true}'; };
      const atomicFirst = await deriveSegmentLabels(atomicPlan, atomicComplete);
      assert(atomicFirst === null, 'mongo: atomic first call returns null');
      assert(atomicCalls === 1, 'mongo: atomic first call invokes complete once');
      const atomicRow = await LessonPlanRailLabelsModel.findById(atomicRowId).lean();
      assert(!!atomicRow && atomicRow.atomic === true, 'mongo: atomic marker row written');
      const atomicSecond = await deriveSegmentLabels(atomicPlan, atomicComplete);
      assert(atomicSecond === null, 'mongo: atomic second call returns null');
      assert(atomicCalls === 1, 'mongo: atomic second call does NOT re-invoke fn');
    } finally {
      await LessonPlanRailLabelsModel.deleteOne({ _id: atomicRowId });
    }

    // Case: complete() throws (transient transport error) → null, and
    // crucially NO cache row is written — a throw must not get blackholed
    // as a permanent "atomic" verdict. The throw happens before create().
    const throwPlan = mkPlan({ title: 'Throw plan', segmentIds: ['hook', 'concept-t', 'recap'] });
    throwPlan.id = 'test-plan-rail-mongo-throw-1';
    const throwRowId = buildRailLabelsId(throwPlan.id, RAIL_LABELS_VERSION);
    try {
      const throwingComplete = async (_prompt: string) => { throw new Error('simulated transport failure'); };
      const throwResult = await deriveSegmentLabels(throwPlan, throwingComplete);
      assert(throwResult === null, 'mongo: throwing complete() returns null');
      const throwRow = await LessonPlanRailLabelsModel.findById(throwRowId).lean();
      assert(throwRow === null, 'mongo: throwing complete() writes NO cache row (not blackholed as atomic)');
    } finally {
      await LessonPlanRailLabelsModel.deleteOne({ _id: throwRowId });
    }

    // Case: complete() returns malformed JSON → parseLabelResponse returns
    // null → per current design this DOES write the atomic marker row
    // (a parse failure is treated the same as an explicit atomic verdict).
    const malformedPlan = mkPlan({ title: 'Malformed plan', segmentIds: ['hook', 'concept-m', 'recap'] });
    malformedPlan.id = 'test-plan-rail-mongo-malformed-1';
    const malformedRowId = buildRailLabelsId(malformedPlan.id, RAIL_LABELS_VERSION);
    try {
      const malformedComplete = async (_prompt: string) => 'not json at all {{{';
      const malformedResult = await deriveSegmentLabels(malformedPlan, malformedComplete);
      assert(malformedResult === null, 'mongo: malformed JSON complete() returns null');
      const malformedRow = await LessonPlanRailLabelsModel.findById(malformedRowId).lean();
      assert(!!malformedRow && malformedRow.atomic === true, 'mongo: malformed JSON writes atomic marker row');
    } finally {
      await LessonPlanRailLabelsModel.deleteOne({ _id: malformedRowId });
    }

    // ---------------------------------------------------------------
    // Route handler — GET /api/tutor/lesson-plans/:id/rail-labels
    // ---------------------------------------------------------------

    // (a) unknown plan id → 404.
    {
      const { status, json } = await callRailLabelsRoute('test-plan-rail-mongo-does-not-exist');
      assert(status === 404, `route: unknown plan id → 404 (got ${status})`);
      assert(json.error !== undefined, 'route: 404 body carries an error field');
    }

    // (b) generated plan → 200 { labels: null }, and derivation was never
    // invoked for it (no cache row was created for this plan id).
    {
      const generatedPlan = await upsertLessonPlan({
        id: 'test-plan-rail-mongo-generated-1',
        title: 'Test Generated Plan',
        curriculum: 'freestyle',
        grade: '9-12',
        subject: 'math',
        los: [{ id: 'lo1', description: 'test lo' }],
        estimatedMinutes: 12,
        segments: [{ id: 'seg1', kind: 'hook', goal: 'g' }],
        schemaVersion: 1,
        metadata: { generatedFromText: true },
      });
      const generatedRowId = buildRailLabelsId(generatedPlan.id, RAIL_LABELS_VERSION);
      try {
        const { status, json } = await callRailLabelsRoute(generatedPlan.id);
        assert(status === 200 && json.labels === null, `route: generated plan → 200 { labels: null } (got ${status}, ${JSON.stringify(json)})`);
        const generatedRow = await LessonPlanRailLabelsModel.findById(generatedRowId).lean();
        assert(generatedRow === null, 'route: generated plan never reaches derivation — no cache row created');
      } finally {
        await deleteLessonPlan(generatedPlan.id);
        await LessonPlanRailLabelsModel.deleteOne({ _id: generatedRowId });
      }
    }

    // (c) curated (real seed) plan id — pre-seed the cache row so the route
    // exercises ONLY the cache-hit read path (no live Anthropic call). The
    // real GET handler calls deriveSegmentLabels with the REAL CompleteFn,
    // so this is the one way to test it offline.
    {
      const seedPlanId = 'evelyn.hs.whist.columbian-exchange.v1';
      const seedRowId = buildRailLabelsId(seedPlanId, RAIL_LABELS_VERSION);
      const seededLabels = { 'concept-cx': 'Two-way exchange', 'worked-letter': 'Columbus letter' };
      await LessonPlanRailLabelsModel.create({
        _id: seedRowId,
        planId: seedPlanId,
        labels: seededLabels,
        atomic: false,
      });
      try {
        const { status, json } = await callRailLabelsRoute(seedPlanId);
        assert(status === 200, `route: curated plan → 200 (got ${status})`);
        assert(
          JSON.stringify(json.labels) === JSON.stringify(seededLabels),
          `route: curated plan returns the seeded cache row's labels, got ${JSON.stringify(json.labels)}`,
        );
      } finally {
        await LessonPlanRailLabelsModel.deleteOne({ _id: seedRowId });
      }
    }
  } finally {
    await LessonPlanRailLabelsModel.deleteOne({ _id: rowId });
  }
}

runMongoCases()
  .then(() => {
    console.log(`\n${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('Fatal error running test-rail-labels:', err);
    process.exit(1);
  });
