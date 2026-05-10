/**
 * Pointer-enrichment pass for a topic-notes baseline.
 *
 * Reads an existing baseline TS file (produced by
 * scripts/extract-topic-notes-baselines.ts) plus the corresponding
 * lesson plan, calls Claude Opus 4.7 with a structured-output prompt,
 * and writes the proposed pointers to a sibling JSON draft file for
 * human merge into the baseline.
 *
 * NOT auto-merged — the human reviews the draft, picks the keepers,
 * and pastes them into the `pointers: [...]` block of the baseline.
 * Auto-merge is Phase-2 work once we trust the prompt's output quality.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... npx ts-node --compiler-options '{"module":"commonjs"}' \
 *     scripts/gen-topic-notes-pointers.ts <planId>
 *
 * Example:
 *   ... scripts/gen-topic-notes-pointers.ts evelyn.ap.macro.loanable-funds-market.v1
 *
 * Outputs:
 *   src/lib/tutor/topic-notes/seeds/<filename>.pointers.draft.json
 */

import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';

const MODEL = process.env.POINTER_GEN_MODEL || 'claude-opus-4-7';

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('✗ ANTHROPIC_API_KEY not set');
  process.exit(2);
}
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface PointerProposal {
  content: string;
  kind: 'gotcha' | 'frq-vocab' | 'edge-case' | 'common-error' | 'tip';
  rationale: string;
}

const SYSTEM = `You are an AP exam preparation expert producing study-notes "pointers" for a single CED topic.

Pointers are tactical reminders for exam revision — gotchas, FRQ rubric vocabulary, edge cases, common errors, and exam-strategy tips. They are NOT theory (definitions/formulas/laws) and NOT methods (procedural recipes). They sit alongside theory + methods in the student's revision notes; they're the things the student needs to remember the night before the exam.

Given a CED topic + the lesson plan content (theory key ideas, worked examples, recap takeaways), produce 4-8 pointers as a JSON array. Each pointer has:
  - "content":   the pointer text. Markdown allowed. ≤300 chars. Imperative voice preferred ("Don't confuse X with Y", "When the FRQ says 'shift', say 'shift' back").
  - "kind":      one of "gotcha" | "frq-vocab" | "edge-case" | "common-error" | "tip".
  - "rationale": 1-2 sentences explaining why this pointer is worth remembering. (Not persisted — for human review only.)

Cover a mix of kinds. Prioritize:
  - FRQ rubric vocabulary that students get wrong (CED-specific phrasings the rubric gives credit for).
  - Common errors documented in CB Chief Reader notes when you know them.
  - Edge cases the lesson plan touches but doesn't emphasize.
  - Conceptual confusions with adjacent topics in the same unit.

Avoid:
  - Restating theory that's already in the lesson plan.
  - Generic study advice ("review before the exam"). Pointers must be CONTENT-specific.
  - Anything > 300 chars. Tighten.

Return ONLY the JSON array. No prose, no code fences, no preamble.`;

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

function fileNameFor(plan: LessonPlan): string {
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

function buildUserMessage(plan: LessonPlan): string {
  const metadata = (plan.metadata ?? {}) as { cedUnit?: string | number; cedTopic?: string; cedTitle?: string };
  const lines: string[] = [];
  lines.push(`Course: ${plan.id.startsWith('evelyn.ap.macro.') ? 'AP Macroeconomics' : plan.title}`);
  lines.push(`CED Unit: ${metadata.cedUnit ?? '?'}`);
  lines.push(`CED Topic: ${metadata.cedTopic ?? '?'}`);
  lines.push(`CED Title: ${metadata.cedTitle ?? plan.title}`);
  lines.push('');

  lines.push('Learning objectives:');
  for (const lo of plan.los) {
    lines.push(`  - [${lo.id}] ${lo.description}`);
  }
  lines.push('');

  for (const seg of plan.segments) {
    if (seg.kind === 'concept') {
      const c = seg as Segment & {
        keyIdeas?: string[];
        vocabulary?: Array<{ term: string; definition: string }>;
      };
      lines.push(`--- Concept segment "${seg.id}" — key ideas:`);
      for (const idea of c.keyIdeas ?? []) lines.push(`  • ${idea}`);
      if ((c.vocabulary ?? []).length > 0) {
        lines.push(`  Vocabulary:`);
        for (const v of c.vocabulary ?? []) lines.push(`    - ${v.term}: ${v.definition}`);
      }
      lines.push('');
    } else if (seg.kind === 'worked_example') {
      const w = seg as Segment & { problem?: string; steps?: string[]; answer?: string };
      lines.push(`--- Worked example "${seg.id}":`);
      if (w.problem) lines.push(`  Problem: ${w.problem}`);
      lines.push(`  Steps:`);
      for (const s of w.steps ?? []) lines.push(`    - ${s}`);
      if (w.answer) lines.push(`  Answer: ${w.answer}`);
      lines.push('');
    } else if (seg.kind === 'try_yourself') {
      const t = seg as Segment & { problem?: string; expectedAnswer?: string };
      lines.push(`--- Try-yourself "${seg.id}":`);
      if (t.problem) lines.push(`  Problem: ${t.problem}`);
      if (t.expectedAnswer) lines.push(`  Expected: ${t.expectedAnswer}`);
      lines.push('');
    } else if (seg.kind === 'recap') {
      const r = seg as Segment & { mustRemember?: string[] };
      lines.push(`--- Recap takeaways:`);
      for (const item of r.mustRemember ?? []) lines.push(`  • ${item}`);
      lines.push('');
    }
  }

  lines.push('Produce 4-8 pointers as a JSON array. Return JSON only, no prose.');
  return lines.join('\n');
}

async function genPointers(plan: LessonPlan): Promise<PointerProposal[]> {
  const userMessage = buildUserMessage(plan);
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    messages: [{ role: 'user', content: userMessage }],
  });
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('');
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `pointer-gen returned non-JSON: ${(err as Error).message}\n--- output ---\n${text.slice(0, 600)}`,
    );
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`pointer-gen returned non-array: ${typeof parsed}`);
  }
  return parsed as PointerProposal[];
}

async function main(): Promise<void> {
  const planId = process.argv[2];
  if (!planId) {
    console.error('Usage: scripts/gen-topic-notes-pointers.ts <planId>');
    process.exit(2);
  }
  const plan = findPlan(planId);
  if (!plan) {
    console.error(`✗ plan not found: ${planId}`);
    process.exit(1);
  }
  const baselineFile = path.join(
    __dirname,
    '..',
    'src',
    'lib',
    'tutor',
    'topic-notes',
    'seeds',
    fileNameFor(plan),
  );
  if (!fs.existsSync(baselineFile)) {
    console.error(`✗ baseline file not found: ${baselineFile}`);
    console.error(`  run extractor first: scripts/extract-topic-notes-baselines.ts ${planId}`);
    process.exit(1);
  }

  console.log(`→ generating pointers for ${planId} via ${MODEL}...`);
  const pointers = await genPointers(plan);
  console.log(`✓ got ${pointers.length} pointer proposals`);

  const draftFile = baselineFile.replace(/\.ts$/, '.pointers.draft.json');
  fs.writeFileSync(draftFile, JSON.stringify(pointers, null, 2), 'utf-8');
  console.log(`✓ wrote draft to ${draftFile}`);
  console.log('');
  console.log('Next:');
  console.log('  1. review the JSON draft — keep the strong pointers, drop the weak ones');
  console.log(`  2. paste keepers into the pointers: [...] block of ${path.basename(baselineFile)}`);
  console.log('  3. drop the rationale field when pasting (not persisted)');
  console.log('  4. delete the .pointers.draft.json file once merged (gitignored optional)');
}

main().catch((err) => {
  console.error('✗ pointer-gen failed:', err);
  process.exit(1);
});
