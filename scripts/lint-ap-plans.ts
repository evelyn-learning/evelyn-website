/**
 * AP Plan Lint — schema-aware validation of every AP plan in the seed catalog.
 *
 * Walks src/lib/tutor/lesson-plan/seeds/, requires each .ts file, finds
 * exported SEED_* constants whose id starts with `evelyn.ap.`, and
 * validates each per the AP Plans Initiative (Q8b in the
 * project_ap_plans_initiative.md memory):
 *   - id matches evelyn.ap.<course>.<slug>.v1
 *   - curriculum === 'AP'
 *   - pacingThresholds present (AP plans must apply AP_PACING_THRESHOLDS)
 *   - source attribution present
 *   - metadata.cedUnit / metadata.cedTopic / metadata.cedTitle present
 *   - segments array non-empty, each segment has required fields
 *   - no duplicate segment ids within a plan
 *   - no duplicate plan ids across the catalog
 *
 * Run:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/lint-ap-plans.ts
 *
 * Exits 0 if all AP plans pass; 1 if any errors. We import seed files
 * directly (not via store.ts) because store.ts pulls in `@/lib/db` which
 * needs Next.js path-alias resolution.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';

const AP_COURSE_SLUGS = ['macro', 'calcbc', 'stats', 'envsci', 'psych', 'research', 'englang'] as const;
const idPattern = new RegExp(`^evelyn\\.ap\\.(${AP_COURSE_SLUGS.join('|')})\\.[a-z0-9-]+\\.v\\d+$`);

interface LintError {
  planId: string;
  message: string;
}
const errors: LintError[] = [];
const warn = (planId: string, message: string) => errors.push({ planId, message });

function isLessonPlan(x: unknown): x is LessonPlan {
  if (!x || typeof x !== 'object') return false;
  const p = x as Record<string, unknown>;
  return typeof p.id === 'string' && Array.isArray(p.segments) && typeof p.curriculum === 'string';
}

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
    } catch (err) {
      console.error(`⚠️  failed to require ${file}: ${err instanceof Error ? err.message.slice(0, 200) : err}`);
      continue;
    }
    for (const [key, val] of Object.entries(mod)) {
      if (key.startsWith('SEED_') && isLessonPlan(val)) {
        plans.push(val);
      }
    }
  }
  return plans;
}

function validateSegment(planId: string, seg: Segment, idx: number): void {
  if (!seg.id) warn(planId, `segment[${idx}] missing id`);
  if (!('kind' in seg) || !seg.kind) warn(planId, `segment[${idx}] missing kind`);

  switch (seg.kind) {
    case 'hook':
      if (!seg.goal) warn(planId, `hook "${seg.id}" missing goal`);
      break;
    case 'concept':
      if (!seg.goal) warn(planId, `concept "${seg.id}" missing goal`);
      if (!Array.isArray(seg.keyIdeas) || seg.keyIdeas.length === 0)
        warn(planId, `concept "${seg.id}" missing keyIdeas`);
      break;
    case 'worked_example':
      if (!seg.problem) warn(planId, `worked_example "${seg.id}" missing problem`);
      if (!Array.isArray(seg.steps) || seg.steps.length === 0)
        warn(planId, `worked_example "${seg.id}" missing steps`);
      break;
    case 'try_yourself':
      if (!seg.problem) warn(planId, `try_yourself "${seg.id}" missing problem`);
      break;
    case 'misconception_check':
      if (!seg.question) warn(planId, `misconception_check "${seg.id}" missing question`);
      if (!Array.isArray(seg.commonErrors) || seg.commonErrors.length === 0)
        warn(planId, `misconception_check "${seg.id}" missing commonErrors`);
      break;
    case 'recap':
      if (!Array.isArray(seg.mustRemember) || seg.mustRemember.length === 0)
        warn(planId, `recap "${seg.id}" missing mustRemember`);
      break;
    case 'extension':
      if (!seg.advancedQuestion) warn(planId, `extension "${seg.id}" missing advancedQuestion`);
      break;
    default: {
      const k = (seg as { kind?: string }).kind;
      warn(planId, `segment "${(seg as { id?: string }).id ?? '?'}" has unknown kind "${k}"`);
    }
  }
}

function validatePlan(plan: LessonPlan): void {
  const id = plan.id;

  if (!idPattern.test(id)) {
    warn(id, `id does not match evelyn.ap.<${AP_COURSE_SLUGS.join('|')}>.<slug>.v<N>`);
  }

  if (plan.curriculum !== 'AP') {
    warn(id, `curriculum must be 'AP' (got '${plan.curriculum}')`);
  }

  if (!plan.pacingThresholds) {
    warn(id, `pacingThresholds missing — AP plans must apply AP_PACING_THRESHOLDS`);
  } else {
    const t = plan.pacingThresholds;
    const required: (keyof typeof t)[] = [
      'silentRampStreak',
      'explicitOfferStreak',
      'inverseStreak',
      'checkInMinTurns',
      'checkInCooldown',
    ];
    for (const k of required) {
      if (typeof t[k] !== 'number') warn(id, `pacingThresholds.${k} must be a number`);
    }
  }

  if (!plan.source || !plan.source.author) {
    warn(id, `source attribution missing or incomplete`);
  }

  const md = (plan.metadata ?? {}) as Record<string, unknown>;
  if (typeof md.cedUnit !== 'string' || !md.cedUnit) warn(id, `metadata.cedUnit missing`);
  if (typeof md.cedTopic !== 'string' || !md.cedTopic) warn(id, `metadata.cedTopic missing`);
  if (typeof md.cedTitle !== 'string' || !md.cedTitle) warn(id, `metadata.cedTitle missing`);

  if (!Array.isArray(plan.segments) || plan.segments.length === 0) {
    warn(id, `segments array empty`);
  } else {
    const segIds = new Set<string>();
    plan.segments.forEach((seg, i) => {
      validateSegment(id, seg, i);
      if (seg.id) {
        if (segIds.has(seg.id)) warn(id, `duplicate segment id "${seg.id}"`);
        segIds.add(seg.id);
      }
    });
  }

  if (!Array.isArray(plan.los) || plan.los.length === 0) {
    warn(id, `los array empty`);
  }
  if (typeof plan.estimatedMinutes !== 'number' || plan.estimatedMinutes <= 0) {
    warn(id, `estimatedMinutes must be a positive number`);
  }
}

function main(): void {
  const allPlans = loadAllPlans();

  // In-scope = id matches new convention (evelyn.ap.<one of the AP_COURSE_SLUGS>.<slug>.v<N>).
  // Out-of-scope ap-* plans (ap-world, ap-bio, ap-gov, etc.) are NOT linted —
  // they are guard-railed in Q10d.
  const inScope = allPlans.filter((p) => idPattern.test(p.id));

  // Among in-scope plans, "new-format" = uses AP Plans Initiative conventions
  // (pacingThresholds present + metadata.cedUnit set). Old-format are the 37
  // existing plans scheduled for deletion as the initiative ships unit-by-unit.
  const newFormat = inScope.filter((p) => {
    const md = (p.metadata ?? {}) as Record<string, unknown>;
    return p.pacingThresholds != null && typeof md.cedUnit === 'string';
  });
  const oldFormat = inScope.filter((p) => !newFormat.includes(p));

  console.log(`Loaded ${allPlans.length} seed plans.`);
  console.log(`  In-scope (${AP_COURSE_SLUGS.length} AP courses, new id pattern): ${inScope.length}`);
  console.log(`  New-format (will be lint-validated):     ${newFormat.length}`);
  console.log(`  Old-format (queued for deletion):        ${oldFormat.length}`);
  console.log('');

  if (oldFormat.length > 0) {
    console.log(`⏳ ${oldFormat.length} old-format plan(s) — superseded as initiative ships:`);
    for (const p of oldFormat) console.log(`     • ${p.id}`);
    console.log('');
  }

  // Duplicate-id check across new-format only (old-format are slated for delete).
  const seen = new Map<string, number>();
  for (const p of newFormat) seen.set(p.id, (seen.get(p.id) ?? 0) + 1);
  for (const [planId, count] of seen) {
    if (count > 1) warn(planId, `duplicate plan id (${count} occurrences)`);
  }

  for (const plan of newFormat) validatePlan(plan);

  if (errors.length === 0) {
    console.log(`✅ all ${newFormat.length} new-format AP plan(s) pass lint`);
    process.exit(0);
  }

  console.log(`❌ ${errors.length} error(s) across ${new Set(errors.map((e) => e.planId)).size} new-format plan(s):\n`);
  const grouped = new Map<string, string[]>();
  for (const e of errors) {
    const list = grouped.get(e.planId) ?? [];
    list.push(e.message);
    grouped.set(e.planId, list);
  }
  for (const [planId, msgs] of grouped) {
    console.log(`  ${planId}`);
    for (const m of msgs) console.log(`    • ${m}`);
  }
  process.exit(1);
}

main();
