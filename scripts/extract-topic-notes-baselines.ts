/**
 * Extract a topic-notes baseline from an existing AP lesson plan.
 *
 * Maps plan segments to baseline buckets:
 *   concept.keyIdeas[]      → theory entries (per-LO)
 *   concept.vocabulary[]    → theory entries (kind='definition')
 *   worked_example          → method entry (title humanized from segment id;
 *                             steps + example carried through)
 *   recap.mustRemember[]    → pointer entries (kind='tip')
 *   hook + try_yourself     → skipped (not notes content)
 *
 * Produces a draft TS file at src/lib/tutor/topic-notes/seeds/<filename>.ts
 * mirroring the plan's filename. The output compiles; hand-edit freely
 * after extraction. Bump `baselineVersion` when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) is a separate
 * step that enriches the pointers section via Opus.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' \
 *     scripts/extract-topic-notes-baselines.ts <planId>
 *
 * Example:
 *   ... scripts/extract-topic-notes-baselines.ts evelyn.ap.macro.loanable-funds-market.v1
 */

import * as fs from 'fs';
import * as path from 'path';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';

// HS course slug (from `evelyn.hs.<slug>.`) → exact portal course-title
// string. Must byte-match the portal's course title or the Notes tab
// silently resolves nothing for that course. Extend as new HS courses
// are backfilled.
const HS_COURSE_NAMES: Record<string, string> = {
  chem: 'Chemistry',
  alg1: 'Algebra 1',
  geom: 'Geometry',
  bio: 'Biology',
};

interface BaselineDraft {
  baselineId: string;
  course: string;
  cedUnit: number;
  cedTopic: string;
  cedTitle: string;
  planId: string;
  theory: Array<{ loId: string | null; kind?: string; title?: string; content: string }>;
  methods: Array<{
    title: string;
    when_to_use?: string;
    steps: string[];
    example?: { problem: string; solution: string };
    relatedLoIds?: string[];
  }>;
  pointers: Array<{ content: string; kind?: string }>;
  baselineVersion: number;
  lastUpdatedAt: string;
}

// ---------------------------------------------------------------------------
// Plan loading (same require-direct pattern as lint-ap-plans.ts — bypasses
// store.ts so we don't need Next.js path-alias resolution).
// ---------------------------------------------------------------------------

function loadAllPlans(): LessonPlan[] {
  const seedsDir = path.join(__dirname, '..', 'src', 'lib', 'tutor', 'lesson-plan', 'seeds');
  const files = fs.readdirSync(seedsDir).filter((f) => f.endsWith('.ts') && !f.startsWith('_'));
  const plans: LessonPlan[] = [];
  for (const file of files) {
    const fullPath = path.join(seedsDir, file);
    let mod: Record<string, unknown>;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require(fullPath);
    } catch {
      continue;
    }
    for (const [key, val] of Object.entries(mod)) {
      if (
        key.startsWith('SEED_') &&
        val &&
        typeof val === 'object' &&
        'id' in val &&
        'segments' in val
      ) {
        plans.push(val as LessonPlan);
      }
    }
  }
  return plans;
}

let cachedPlans: LessonPlan[] | null = null;
function findPlan(planId: string): LessonPlan | null {
  if (!cachedPlans) cachedPlans = loadAllPlans();
  return cachedPlans.find((p) => p.id === planId) ?? null;
}

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

interface PlanMetadata {
  cedUnit?: string | number;
  cedTopic?: string;
  cedTitle?: string;
}

function extract(plan: LessonPlan): BaselineDraft {
  const metadata = (plan.metadata ?? {}) as PlanMetadata;
  const cedUnit =
    typeof metadata.cedUnit === 'number'
      ? metadata.cedUnit
      : typeof metadata.cedUnit === 'string'
        ? parseInt(metadata.cedUnit, 10) || 0
        : 0;
  const cedTopic = typeof metadata.cedTopic === 'string' ? metadata.cedTopic : '';
  const cedTitle = typeof metadata.cedTitle === 'string' ? metadata.cedTitle : plan.title;

  // Default LO for theory entries: first LO. Multi-LO plans should be re-tagged in review.
  const defaultLoId = plan.los[0]?.id ?? null;

  const theory: BaselineDraft['theory'] = [];
  const methods: BaselineDraft['methods'] = [];
  const pointers: BaselineDraft['pointers'] = [];

  for (const seg of plan.segments) {
    if (seg.kind === 'concept') {
      const c = seg as Segment & {
        keyIdeas?: string[];
        vocabulary?: Array<{ term: string; definition: string }>;
      };
      for (const idea of c.keyIdeas ?? []) {
        // Authoring convention across plans: many keyIdeas lead with an
        // ALL-CAPS label ("THE ORDER — ...", "NESTED GROUPING — ...").
        // When present, lift it into `title` (sentence-cased) so the
        // renderer gets a headline; content stays the full original
        // bullet (title is redundant-but-helpful, not a replacement).
        const m = idea.match(/^([A-Z][A-Z0-9 ,'/\-→]{2,70}) — ([\s\S]+)$/);
        if (m) {
          theory.push({
            loId: defaultLoId,
            kind: 'framework',
            title: sentenceCase(m[1]),
            content: idea,
          });
        } else {
          theory.push({ loId: defaultLoId, content: idea });
        }
      }
      for (const v of c.vocabulary ?? []) {
        theory.push({
          loId: defaultLoId,
          kind: 'definition',
          title: v.term,
          content: v.definition,
        });
      }
    } else if (seg.kind === 'worked_example') {
      const w = seg as Segment & { problem?: string; steps?: string[]; answer?: string };
      methods.push({
        title: humanizeSegmentId(seg.id),
        steps: w.steps ?? [],
        example: w.problem && w.answer ? { problem: w.problem, solution: w.answer } : undefined,
        relatedLoIds: defaultLoId ? [defaultLoId] : undefined,
      });
    } else if (seg.kind === 'misconception_check') {
      // "Watch out for" distractor + correction — excellent pointer
      // material (common-error kind) that was previously dropped.
      const mc = seg as Segment & {
        commonErrors?: Array<{ answer: string; misconception: string; correctsTo: string }>;
      };
      for (const ce of mc.commonErrors ?? []) {
        pointers.push({ content: ce.correctsTo, kind: 'common-error' });
      }
    } else if (seg.kind === 'recap') {
      const r = seg as Segment & { mustRemember?: string[] };
      for (const item of r.mustRemember ?? []) {
        pointers.push({ content: item, kind: 'tip' });
      }
    }
    // hook + try_yourself: skipped
  }

  return {
    baselineId: plan.id,
    course: courseFor(plan),
    cedUnit,
    cedTopic,
    cedTitle,
    planId: plan.id,
    theory,
    methods,
    pointers,
    baselineVersion: 1,
    lastUpdatedAt: new Date().toISOString().slice(0, 10),
  };
}

function courseFor(plan: LessonPlan): string {
  if (plan.id.startsWith('evelyn.ap.macro.')) return 'AP Macroeconomics';
  if (plan.id.startsWith('evelyn.ap.calcbc.')) return 'AP Calculus BC';
  if (plan.id.startsWith('evelyn.ap.stats.')) return 'AP Statistics';
  if (plan.id.startsWith('evelyn.ap.envsci.')) return 'AP Environmental Science';
  if (plan.id.startsWith('evelyn.ap.psych.')) return 'AP Psychology';
  if (plan.id.startsWith('evelyn.ap.research.')) return 'AP Research';
  const hsMatch = plan.id.match(/^evelyn\.hs\.([a-z0-9]+)\./);
  if (hsMatch && HS_COURSE_NAMES[hsMatch[1]]) return HS_COURSE_NAMES[hsMatch[1]];
  return plan.title;
}

function humanizeSegmentId(id: string): string {
  // 'worked-deficit-crowding' → 'Worked: deficit crowding'
  // 'worked-curve-shifters'   → 'Worked: curve shifters'
  return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ').replace(/^Worked /, 'Worked: ');
}

/** 'THE FRACTION BAR' → 'The fraction bar'. Used to turn an ALL-CAPS
 *  authoring label into a headline-cased title. */
function sentenceCase(label: string): string {
  const trimmed = label.trim();
  return trimmed.charAt(0) + trimmed.slice(1).toLowerCase();
}

// ---------------------------------------------------------------------------
// TS source emission
// ---------------------------------------------------------------------------

function tsString(s: string): string {
  // Use template literal for multiline/long/single-quote-laden strings;
  // single quotes for short clean strings. Escape backticks + ${ in
  // template-literal mode.
  if (s.includes('\n') || s.includes("'") || s.length > 80) {
    return '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
  }
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function constNameFor(planId: string, cedUnit: number): string {
  const apMatch = planId.match(/^evelyn\.ap\.([a-z]+)\./);
  if (apMatch) {
    // 'evelyn.ap.macro.loanable-funds-market.v1' → 'BASELINE_AP_MACRO_LOANABLE_FUNDS_MARKET'
    const stripped = planId.replace(/^evelyn\./, '').replace(/\.v\d+$/, '');
    return 'BASELINE_' + stripped.toUpperCase().replace(/[.-]/g, '_');
  }
  const hsMatch = planId.match(/^evelyn\.hs\.([a-z0-9]+)\./);
  if (hsMatch) {
    // 'evelyn.hs.chem.classifying-matter.v1' + unit 1 →
    // 'BASELINE_CHEM_U1_CLASSIFYING_MATTER' — mirrors the lesson-plan
    // seed's own const naming (SEED_CHEM_U1_CLASSIFYING_MATTER), which
    // encodes the unit number the plan id itself doesn't carry.
    const courseSlug = hsMatch[1];
    const slug = planId.replace(/^evelyn\.hs\.[a-z0-9]+\./, '').replace(/\.v\d+$/, '');
    return `BASELINE_${courseSlug.toUpperCase()}_U${cedUnit}_${slug.toUpperCase().replace(/-/g, '_')}`;
  }
  const stripped = planId.replace(/^evelyn\./, '').replace(/\.v\d+$/, '');
  return 'BASELINE_' + stripped.toUpperCase().replace(/[.-]/g, '_');
}

function fileNameFor(plan: LessonPlan): string {
  const cedUnitRaw = (plan.metadata as { cedUnit?: string | number } | undefined)?.cedUnit;
  const cedUnit =
    typeof cedUnitRaw === 'number'
      ? cedUnitRaw
      : typeof cedUnitRaw === 'string'
        ? parseInt(cedUnitRaw, 10) || 0
        : 0;
  const apMatch = plan.id.match(/^evelyn\.ap\.([a-z]+)\./);
  if (apMatch) {
    // 'ap-<course>-u<N>-<slug>.ts'
    const slugFromId = plan.id.replace(/^evelyn\.ap\.[a-z]+\./, '').replace(/\.v\d+$/, '');
    return `ap-${apMatch[1]}-u${cedUnit}-${slugFromId}.ts`;
  }
  const hsMatch = plan.id.match(/^evelyn\.hs\.([a-z0-9]+)\./);
  if (hsMatch) {
    // '<course>-u<N>-<slug>.ts' — mirrors the source lesson-plan
    // filename exactly (e.g. 'alg1-u1-order-of-operations.ts').
    const slugFromId = plan.id.replace(/^evelyn\.hs\.[a-z0-9]+\./, '').replace(/\.v\d+$/, '');
    return `${hsMatch[1]}-u${cedUnit}-${slugFromId}.ts`;
  }
  const fallbackSlug = plan.id.replace(/^evelyn\./, '').replace(/\.v\d+$/, '').replace(/\./g, '-');
  return `${fallbackSlug}.ts`;
}

function emitConst(draft: BaselineDraft): string {
  const constName = constNameFor(draft.baselineId, draft.cedUnit);

  const theoryBlock = draft.theory
    .map((e) => {
      const parts: string[] = [];
      parts.push(`loId: ${e.loId ? tsString(e.loId) : 'null'}`);
      if (e.kind) parts.push(`kind: ${tsString(e.kind)}`);
      if (e.title) parts.push(`title: ${tsString(e.title)}`);
      parts.push(`content: ${tsString(e.content)}`);
      return `    { ${parts.join(', ')} }`;
    })
    .join(',\n');

  const methodsBlock = draft.methods
    .map((m) => {
      // Step lines indented 8 spaces (one nest deeper than the
      // 6-space `steps:` line); closing `]` at 6 to align with `steps:`.
      const stepsLines = m.steps.map((s) => `        ${tsString(s)}`).join(',\n');
      const parts: string[] = [];
      parts.push(`title: ${tsString(m.title)}`);
      if (m.when_to_use) parts.push(`when_to_use: ${tsString(m.when_to_use)}`);
      parts.push(`steps: [\n${stepsLines},\n      ]`);
      if (m.example) {
        parts.push(
          `example: { problem: ${tsString(m.example.problem)}, solution: ${tsString(m.example.solution)} }`,
        );
      }
      if (m.relatedLoIds?.length) {
        parts.push(`relatedLoIds: [${m.relatedLoIds.map((x) => tsString(x)).join(', ')}]`);
      }
      return `    {\n      ${parts.join(',\n      ')},\n    }`;
    })
    .join(',\n');

  const pointersBlock = draft.pointers
    .map((p) => {
      const parts: string[] = [];
      parts.push(`content: ${tsString(p.content)}`);
      if (p.kind) parts.push(`kind: ${tsString(p.kind)}`);
      return `    { ${parts.join(', ')} }`;
    })
    .join(',\n');

  const sourcesBlock = `[{ type: 'plan', planId: ${tsString(draft.planId)} }]`;

  return `/**
 * ${draft.course} — Unit ${draft.cedUnit} CED ${draft.cedTopic}: ${draft.cedTitle}.
 *
 * Auto-extracted from the corresponding lesson plan
 * (${draft.planId}). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const ${constName}: TopicNotesBaseline = {
  baselineId: ${tsString(draft.baselineId)},
  course: ${tsString(draft.course)},
  cedUnit: ${draft.cedUnit},
  cedTopic: ${tsString(draft.cedTopic)},
  cedTitle: ${tsString(draft.cedTitle)},
  planId: ${tsString(draft.planId)},
  baselineVersion: ${draft.baselineVersion},
  lastUpdatedAt: ${tsString(draft.lastUpdatedAt)},
  sources: ${sourcesBlock},
  theory: [
${theoryBlock},
  ],
  methods: [
${methodsBlock},
  ],
  pointers: [
${pointersBlock},
  ],
};
`;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function extractOne(planId: string): boolean {
  const plan = findPlan(planId);
  if (!plan) {
    console.error(`✗ plan not found: ${planId}`);
    return false;
  }
  const draft = extract(plan);
  const source = emitConst(draft);

  const outDir = path.join(__dirname, '..', 'src', 'lib', 'tutor', 'topic-notes', 'seeds');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, fileNameFor(plan));

  if (fs.existsSync(outFile)) {
    console.error(`✗ output file already exists: ${outFile}`);
    console.error('  delete it first if you want to re-extract — baseline edits should be hand-made after extraction');
    return false;
  }

  fs.writeFileSync(outFile, source, 'utf-8');
  console.log(`✓ wrote ${outFile}`);
  console.log(`  theory entries: ${draft.theory.length}`);
  console.log(`  method entries: ${draft.methods.length}`);
  console.log(`  pointer seeds:  ${draft.pointers.length}`);
  return true;
}

function main(): void {
  // Accepts either a single planId (original behavior) or multiple
  // space-separated planIds in one process invocation — the latter
  // amortizes the ~40s loadAllPlans() cost across the whole batch
  // instead of paying it once per plan (relevant for backfilling an
  // entire course's worth of plans in one run).
  const planIds = process.argv.slice(2);
  if (planIds.length === 0) {
    console.error('Usage: scripts/extract-topic-notes-baselines.ts <planId> [<planId2> ...]');
    console.error('Example: ... evelyn.ap.macro.loanable-funds-market.v1');
    process.exit(2);
  }

  let okCount = 0;
  for (const planId of planIds) {
    const ok = extractOne(planId);
    if (ok) okCount++;
    console.log('');
  }

  console.log(`Done: ${okCount}/${planIds.length} extracted.`);
  console.log('Next:');
  console.log('  1. review and hand-edit each file (re-tag theory entries with kind, split LOs etc.)');
  console.log('  2. enrich pointers via Opus: scripts/gen-topic-notes-pointers.ts <planId>');
  if (okCount < planIds.length) process.exit(1);
}

main();
