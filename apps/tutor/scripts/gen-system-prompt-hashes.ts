/**
 * Golden hashes of buildSystemPrompt over a context matrix. Generated ONCE
 * against the pre-split builder; test-system-prompt-parts.ts asserts the split
 * builder still produces the same bytes. Run: npx tsx scripts/gen-system-prompt-hashes.ts
 */
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { buildSystemPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';
import { unsetServerOnlyPromptFlags } from './fixtures/browser-env';

unsetServerOnlyPromptFlags(); // hash the prompt the browser builds

const out: Record<string, string> = {};
for (const [name, ctx] of Object.entries(PROMPT_MATRIX)) {
  out[name] = createHash('sha256').update(buildSystemPrompt(ctx)).digest('hex');
}
fs.writeFileSync(path.join(__dirname, 'fixtures', 'system-prompt-hashes.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${Object.keys(out).length} hashes`);
