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

function findPlan(planId: string): LessonPlan | null {
  return loadAllPlans().find((p) => p.id === planId) ?? null;
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
        theory.push({ loId: defaultLoId, content: idea });
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
  return plan.title;
}

function humanizeSegmentId(id: string): string {
  // 'worked-deficit-crowding' → 'Worked: deficit crowding'
  // 'worked-curve-shifters'   → 'Worked: curve shifters'
  return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ').replace(/^Worked /, 'Worked: ');
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

function constNameFor(planId: string): string {
  // 'evelyn.ap.macro.loanable-funds-market.v1' → 'BASELINE_AP_MACRO_LOANABLE_FUNDS_MARKET'
  const stripped = planId.replace(/^evelyn\./, '').replace(/\.v\d+$/, '');
  return 'BASELINE_' + stripped.toUpperCase().replace(/[.-]/g, '_');
}

function fileNameFor(plan: LessonPlan): string {
  // Mirror the source plan's filename: 'ap-<course>-u<N>-<slug>.ts'
  const cedUnitRaw = (plan.metadata as { cedUnit?: string | number } | undefined)?.cedUnit;
  const cedUnit =
    typeof cedUnitRaw === 'number'
      ? cedUnitRaw
      : typeof cedUnitRaw === 'string'
        ? parseInt(cedUnitRaw, 10) || 0
        : 0;
  const slugFromId = plan.id.replace(/^evelyn\.ap\.[a-z]+\./, '').replace(/\.v\d+$/, '');
  const courseSlug = plan.id.match(/^evelyn\.ap\.([a-z]+)\./)?.[1] ?? 'unknown';
  return `ap-${courseSlug}-u${cedUnit}-${slugFromId}.ts`;
}

function emitConst(draft: BaselineDraft): string {
  const constName = constNameFor(draft.baselineId);

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

function main(): void {
  const planId = process.argv[2];
  if (!planId) {
    console.error('Usage: scripts/extract-topic-notes-baselines.ts <planId>');
    console.error('Example: ... evelyn.ap.macro.loanable-funds-market.v1');
    process.exit(2);
  }
  const plan = findPlan(planId);
  if (!plan) {
    console.error(`✗ plan not found: ${planId}`);
    process.exit(1);
  }
  const draft = extract(plan);
  const source = emitConst(draft);

  const outDir = path.join(__dirname, '..', 'src', 'lib', 'tutor', 'topic-notes', 'seeds');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, fileNameFor(plan));

  if (fs.existsSync(outFile)) {
    console.error(`✗ output file already exists: ${outFile}`);
    console.error('  delete it first if you want to re-extract — baseline edits should be hand-made after extraction');
    process.exit(1);
  }

  fs.writeFileSync(outFile, source, 'utf-8');
  console.log(`✓ wrote ${outFile}`);
  console.log(`  theory entries: ${draft.theory.length}`);
  console.log(`  method entries: ${draft.methods.length}`);
  console.log(`  pointer seeds:  ${draft.pointers.length}`);
  console.log('');
  console.log('Next:');
  console.log('  1. review and hand-edit the file (re-tag theory entries with kind, split LOs etc.)');
  console.log(`  2. enrich pointers via Opus: scripts/gen-topic-notes-pointers.ts ${planId}`);
}

main();
