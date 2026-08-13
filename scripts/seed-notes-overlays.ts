/**
 * seed-notes-overlays.ts — write realistic, session-flavored topic-notes
 * overlays for a demo student against one or more (usually generated,
 * `gen-<uuid>`) lesson plans.
 *
 * Why this bypasses `apply-overlay.ts`'s `expandTheoryOverlay` /
 * `addMethodOverlay` / `addPointerOverlay`: those three mutators gate
 * every write on `getTopicNotesBaseline(baselineId)` — the SYNCHRONOUS
 * TS-seed registry lookup in `store.ts`. Generated/white-label plans are
 * never in that registry (see `topic-notes/derive-baseline.ts`, which
 * teaches the READ path — `resolveTopicNotes` — to derive a baseline
 * in-memory from the stored plan on a registry miss). The mutators were
 * not extended to the same derive-fallback here, so calling them against
 * a generated plan's id would just return `status: 'baseline-not-found'`
 * and write nothing.
 *
 * What this script does instead: call the exact same PERSISTENCE
 * primitives the mutators call once validation passes —
 * `loadStudentTopicNotes` / `saveStudentTopicNotes` (apply-overlay.ts) —
 * and hand-build overlay objects that satisfy the real `TheoryOverlay` /
 * `MethodOverlay` / `PointerOverlay` shapes (types.ts) directly, with the
 * same required-field checks the mutators apply (non-empty content,
 * >=2 non-empty method steps, conceptLabel for prereq-refreshers, etc.)
 * run inline below. This is the "validate through apply-overlay's
 * validator if importable, else hand-roll matching its exact shape"
 * fallback the brief called for — there's no standalone exported
 * validator to import (validation lives inline in the three mutators,
 * fused with the baseline-registry gate we need to skip).
 *
 * FOLLOW-UP (flagged, not fixed here — out of this task's scope): a real
 * LIVE session teaching a generated-plan topic hits the exact same
 * baseline-not-found wall through `expand_topic_notes_theory` /
 * `add_topic_notes_method` / `add_topic_notes_pointer` — the brain's
 * overlay tools call the three gated mutators, not this script's direct
 * persistence path. Making THAT path derive-aware (swap
 * `getTopicNotesBaseline` for `getOrDeriveTopicNotesBaseline` in
 * apply-overlay.ts, async-ifying the three mutators' baseline lookup) is
 * a natural Part 3, not attempted here.
 *
 * Idempotency: every overlay this script writes gets an id prefixed
 * `seed:` (mirrors `scripts/seed-test-student.ts`'s `seed:` idempotency-
 * key convention) — deterministic per (planId, loId, kind, index), so
 * re-running the script inserts nothing new. `--unseed` removes ONLY
 * `seed:`-prefixed overlays from the targeted plans' overlay docs,
 * leaving any real/live overlays untouched.
 *
 * Usage:
 *   MONGODB_URI=... npx tsx scripts/seed-notes-overlays.ts \
 *     --student <esid> --plans <planId1,planId2,...> \
 *     [--unseed] [--dry-run]
 *
 * DO NOT run this against production without the controller's go-ahead —
 * see the task brief. Always sanity-check with --dry-run first.
 */
import connectDB from '@/lib/db';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { loadStudentTopicNotes, saveStudentTopicNotes } from '@/lib/tutor/topic-notes/apply-overlay';
import type { LearningObjective } from '@/lib/tutor/lesson-plan/types';
import type {
  StudentTopicNotes,
  TheoryOverlay,
  MethodOverlay,
  PointerOverlay,
} from '@/lib/tutor/topic-notes/types';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const has = (name: string) => process.argv.includes(`--${name}`);

// ---------------------------------------------------------------------------
// Domain-flavored content — keyed by keyword match against the plan's
// title/topic so the overlays read like they came from an actual CPHQ
// (healthcare-quality) tutoring session rather than a generic template.
// Falls back to a subject-neutral flavor for any plan whose title doesn't
// match a known keyword, so the tool stays usable beyond the 4 demo plans
// named in the brief.
// ---------------------------------------------------------------------------

interface Flavor {
  match: (haystack: string) => boolean;
  theoryInsight: string;
  methodTitle: string;
  methodSteps: string[];
  pointer: string;
}

const FLAVORS: Flavor[] = [
  {
    match: (h) => /governance|structure/.test(h),
    theoryInsight:
      'the quality council isn\'t just an advisory group — it\'s where accountability actually lives. Department leads report findings up through it, and the council itself answers to the governing board for anything that touches patient safety or accreditation risk.',
    methodTitle: 'Trace a governance reporting line',
    methodSteps: [
      'Start at the point of care — the unit or department that generated the finding.',
      'Identify who that department reports quality data to.',
      'Follow the chain up to the quality council.',
      'Confirm the council\'s own accountability runs to the governing board.',
    ],
    pointer:
      'CPHQ items like to test whether you can tell a "quality council" (a standing governance body) apart from a one-off task force — councils are permanent and structural, task forces are not.',
  },
  {
    match: (h) => /integrat/.test(h),
    theoryInsight:
      'integration means the same quality data feeds risk management, patient safety, AND accreditation prep at once — not three departments separately re-collecting the same audit.',
    methodTitle: 'Spot a silo vs. an integrated quality function',
    methodSteps: [
      'Ask who owns the data: one department, or a shared quality function?',
      'Check whether findings flow across departments automatically or only on request.',
      'Confirm there\'s a single point of accountability for cross-department follow-up.',
    ],
    pointer:
      'Watch for exam stems that describe two departments duplicating the same audit — that\'s the tell for a non-integrated function, even when the word "integration" never appears in the stem.',
  },
  {
    match: (h) => /strategic/.test(h),
    theoryInsight:
      'a quality strategic plan only holds up when every priority traces back to the organization\'s mission — priorities that don\'t map to a strategic goal are usually the first thing cut when budget season hits.',
    methodTitle: 'Check a quality initiative\'s strategic alignment',
    methodSteps: [
      'State the organizational strategic goal the initiative supports.',
      'Confirm the initiative has a measurable target tied to that goal.',
      'Verify there\'s a named owner accountable for its progress.',
      'Check it actually appears in the quality plan\'s resource allocation, not just its goals list.',
    ],
    pointer:
      'If a practice question describes an initiative with no measurable target, that\'s usually the wrong-answer trap — strategic initiatives need a metric attached, not just good intentions.',
  },
  {
    match: (h) => /ethic|code of conduct|conduct/.test(h),
    theoryInsight:
      'a code of conduct sets the floor — what\'s required. The ethics program is what makes that floor livable day to day: training, a reporting channel, and non-retaliation protection for whoever uses it.',
    methodTitle: 'Work through an ethics-conflict scenario',
    methodSteps: [
      'Identify the competing obligations (e.g., patient welfare vs. cost or productivity pressure).',
      'Check the code of conduct for a rule that applies directly.',
      'If no rule applies directly, escalate through the ethics/compliance reporting channel.',
      'Document the decision AND the reasoning, not just the outcome.',
    ],
    pointer:
      'Non-retaliation protection for good-faith reporting is a favorite CPHQ distractor-buster — any answer choice that penalizes the reporter is wrong, even when it sounds procedurally tidy.',
  },
];

const DEFAULT_FLAVOR: Flavor = {
  match: () => true,
  theoryInsight:
    'connecting this back to how it actually plays out day-to-day in a quality department is what made it stick, more than the definition on its own.',
  methodTitle: 'Work an unfamiliar quality-practice scenario',
  methodSteps: [
    'Restate the scenario in your own words.',
    'Identify which quality function or process it\'s really testing.',
    'Match it to the closest concept you\'ve already studied.',
    'Check your answer against that concept\'s core definition.',
  ],
  pointer:
    'When a CPHQ item feels unfamiliar, it\'s almost always a familiar concept wearing new scenario clothing — look for the underlying process, not the surface story.',
};

function flavorFor(planTitle: string, planTopic?: string): Flavor {
  const haystack = `${planTitle} ${planTopic ?? ''}`.toLowerCase();
  return FLAVORS.find((f) => f.match(haystack)) ?? DEFAULT_FLAVOR;
}

// ---------------------------------------------------------------------------
// Overlay construction
// ---------------------------------------------------------------------------

const SEED_SESSION_ID = 'seed:demo-session-1';

function buildOverlaysForPlan(args: {
  planId: string;
  planTitle: string;
  planTopic: string | undefined;
  los: LearningObjective[];
}): { theory: TheoryOverlay[]; methods: MethodOverlay[]; pointers: PointerOverlay[] } {
  const { planId, planTitle, planTopic, los } = args;
  if (los.length === 0) return { theory: [], methods: [], pointers: [] };

  const flavor = flavorFor(planTitle, planTopic);
  const anchorLo = los[0];
  const now = new Date().toISOString();

  const theoryContent = `From my session: thinking through "${anchorLo.shortTitle ?? anchorLo.description}" — ${flavor.theoryInsight}`;
  const theory: TheoryOverlay = {
    overlayId: `seed:${planId}:theory-1`,
    loId: anchorLo.id,
    kind: 'expansion',
    title: 'From my session',
    content: theoryContent,
    addedInSessionId: SEED_SESSION_ID,
    addedAt: now,
    rationale: 'seeded demo overlay — session-flavored refinement in the student\'s own words',
  };

  const method: MethodOverlay = {
    overlayId: `seed:${planId}:method-1`,
    title: flavor.methodTitle,
    steps: flavor.methodSteps,
    relatedLoIds: [anchorLo.id],
    addedInSessionId: SEED_SESSION_ID,
    addedAt: now,
    rationale: 'seeded demo overlay — checklist built during a session try-yourself',
  };

  const pointer: PointerOverlay = {
    overlayId: `seed:${planId}:pointer-1`,
    content: flavor.pointer,
    kind: 'tip',
    relatedLoIds: [anchorLo.id],
    addedInSessionId: SEED_SESSION_ID,
    addedAt: now,
    rationale: 'seeded demo overlay — exam-vocabulary tip surfaced during a session',
  };

  return { theory: [theory], methods: [method], pointers: [pointer] };
}

// ---------------------------------------------------------------------------
// Validation mirroring apply-overlay.ts's inline checks (non-empty
// content, >=2 non-empty method steps) — the "hand-roll matching its
// exact shape" fallback documented at the top of this file.
// ---------------------------------------------------------------------------

function validateTheory(o: TheoryOverlay): string | null {
  if (!o.content?.trim()) return 'theory overlay content is empty';
  if (o.kind === 'expansion' && o.loId == null) return 'expansion overlay missing loId';
  if (o.kind === 'prereq-refresher' && !o.conceptLabel?.trim()) return 'prereq-refresher missing conceptLabel';
  return null;
}
function validateMethod(o: MethodOverlay): string | null {
  if (!o.title?.trim()) return 'method overlay title is empty';
  const steps = o.steps.filter((s) => s.trim());
  if (steps.length < 2) return 'method overlay needs >=2 non-empty steps';
  return null;
}
function validatePointer(o: PointerOverlay): string | null {
  if (!o.content?.trim()) return 'pointer overlay content is empty';
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const studentId = arg('student');
  const plansCsv = arg('plans');
  const dryRun = has('dry-run');
  const unseed = has('unseed');

  if (!studentId) throw new Error('--student <esid> is required');
  if (!plansCsv) throw new Error('--plans <csv of planIds> is required');
  const planIds = [...new Set(plansCsv.split(',').map((s) => s.trim()).filter(Boolean))];
  if (planIds.length === 0) throw new Error('--plans list is empty after parsing');

  await connectDB();

  for (const planId of planIds) {
    const existing = await loadStudentTopicNotes(studentId, planId);

    if (unseed) {
      const before =
        existing.theoryOverlays.length + existing.methodsAdds.length + existing.pointersAdds.length;
      const next: StudentTopicNotes = {
        ...existing,
        theoryOverlays: existing.theoryOverlays.filter((o) => !o.overlayId.startsWith('seed:')),
        methodsAdds: existing.methodsAdds.filter((o) => !o.overlayId.startsWith('seed:')),
        pointersAdds: existing.pointersAdds.filter((o) => !o.overlayId.startsWith('seed:')),
      };
      const after = next.theoryOverlays.length + next.methodsAdds.length + next.pointersAdds.length;
      console.log(
        `[seed-notes-overlays] UNSEED ${planId}: removing ${before - after} seed:-prefixed overlay(s)` +
          (dryRun ? ' [DRY RUN — nothing written]' : ''),
      );
      if (!dryRun) await saveStudentTopicNotes(next);
      continue;
    }

    const plan = await getLessonPlan(planId);
    if (!plan) {
      console.warn(`[seed-notes-overlays] SKIP ${planId}: no stored/seed plan found for this id`);
      continue;
    }
    if (!plan.los || plan.los.length === 0) {
      console.warn(`[seed-notes-overlays] SKIP ${planId}: plan has no LOs to anchor overlays to`);
      continue;
    }

    const built = buildOverlaysForPlan({
      planId,
      planTitle: plan.title,
      planTopic: plan.topic,
      los: plan.los,
    });

    const errors: string[] = [];
    for (const o of built.theory) { const e = validateTheory(o); if (e) errors.push(`theory ${o.overlayId}: ${e}`); }
    for (const o of built.methods) { const e = validateMethod(o); if (e) errors.push(`method ${o.overlayId}: ${e}`); }
    for (const o of built.pointers) { const e = validatePointer(o); if (e) errors.push(`pointer ${o.overlayId}: ${e}`); }
    if (errors.length > 0) {
      console.error(`[seed-notes-overlays] SKIP ${planId}: validation failed:\n  ${errors.join('\n  ')}`);
      continue;
    }

    // Idempotent merge: only append an overlay whose seed:-prefixed id
    // isn't already present. Re-running the script is then a no-op.
    const addTheory = built.theory.filter((o) => !existing.theoryOverlays.some((e) => e.overlayId === o.overlayId));
    const addMethods = built.methods.filter((o) => !existing.methodsAdds.some((e) => e.overlayId === o.overlayId));
    const addPointers = built.pointers.filter((o) => !existing.pointersAdds.some((e) => e.overlayId === o.overlayId));

    const next: StudentTopicNotes = {
      ...existing,
      theoryOverlays: [...existing.theoryOverlays, ...addTheory],
      methodsAdds: [...existing.methodsAdds, ...addMethods],
      pointersAdds: [...existing.pointersAdds, ...addPointers],
    };

    const added = addTheory.length + addMethods.length + addPointers.length;
    const skippedExisting = built.theory.length + built.methods.length + built.pointers.length - added;
    console.log(
      `[seed-notes-overlays] ${planId} ("${plan.title}"): +${added} overlay(s)` +
        (skippedExisting > 0 ? `, ${skippedExisting} already seeded (idempotent skip)` : '') +
        (dryRun ? ' [DRY RUN — nothing written]' : ''),
    );
    for (const o of addTheory) console.log(`    theory  [${o.overlayId}] loId=${o.loId}: ${o.content}`);
    for (const o of addMethods) console.log(`    method  [${o.overlayId}] "${o.title}": ${o.steps.length} steps`);
    for (const o of addPointers) console.log(`    pointer [${o.overlayId}]: ${o.content}`);

    if (!dryRun && added > 0) await saveStudentTopicNotes(next);
  }

  console.log(`[seed-notes-overlays] done${dryRun ? ' (dry run — no writes)' : ''}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
