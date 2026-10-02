/**
 * The core/session split must not change a single byte of the prompt, and
 * `core` must be identical for every session (it is the shared cache entry).
 * Run: npx tsx scripts/test-system-prompt-parts.ts
 */
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as builder from '@/lib/tutor/ai/system-prompt-builder';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';

const golden: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'fixtures', 'system-prompt-hashes.json'), 'utf8'),
);
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const checks: Array<[string, boolean]> = [];
const parts = (builder as unknown as {
  buildSystemPromptParts?: (c: builder.SystemPromptContext) => { core: string; session: string };
}).buildSystemPromptParts;

checks.push(['buildSystemPromptParts is exported', typeof parts === 'function']);
const cores = new Set<string>();
for (const [name, ctx] of Object.entries(PROMPT_MATRIX)) {
  checks.push([`${name}: buildSystemPrompt bytes unchanged`, sha(builder.buildSystemPrompt(ctx)) === golden[name]]);
  if (!parts) continue;
  const p = parts(ctx);
  cores.add(p.core);
  checks.push([`${name}: core + session === full prompt`, sha(p.core + p.session) === golden[name]]);
  checks.push([`${name}: session is non-empty`, p.session.trim().length > 0]);
  checks.push([`${name}: session starts at the pedagogy spine`, p.session.startsWith('\n\n## Pedagogy spine')]);
}
checks.push(['core is identical across the whole matrix', cores.size === 1]);
checks.push(['core is the bulk of the prompt (> 150K chars)', [...cores][0]?.length > 150_000]);

let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
