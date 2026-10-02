/**
 * Token sizes of the shared-cache parts on the live brain model. Uses
 * messages.countTokens (no generation, no charge). Run from apps/tutor:
 *   npx tsx scripts/measure-prompt-cache-parts.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { getModelClient } from '@/lib/tutor/ai/model-registry';
import { buildSystemPromptParts } from '@/lib/tutor/ai/system-prompt-builder';
import { WHITEBOARD_TOOLS, toAnthropicTools } from '@/app/tutor/hooks/toolDefinitions';
import { filterToolsForSubject, resolveToolSubjects } from '@/lib/tutor/ai/tool-subject-taxonomy';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';
import { unsetServerOnlyPromptFlags } from './fixtures/browser-env';

async function main() {
  unsetServerOnlyPromptFlags(); // .env.local sets them; the browser never sees them
  const { client } = getModelClient('brain');
  const model = process.env.MEASURE_MODEL || 'claude-sonnet-5'; // the prod brain (TUTOR_BRAIN_MODEL)
  const msg = [{ role: 'user' as const, content: 'hi' }];
  const count = async (p: { system?: string; tools?: ReturnType<typeof toAnthropicTools> }) =>
    (await client.messages.countTokens({ model, messages: msg, ...(p.system ? { system: p.system } : {}), ...(p.tools ? { tools: p.tools } : {}) })).input_tokens;

  const floor = await count({});
  const parts = buildSystemPromptParts(PROMPT_MATRIX.math_g8);
  console.log(`model=${model}  floor(messages only)=${floor}`);
  console.log(`core            ${(await count({ system: parts.core })) - floor} tok  (${parts.core.length} chars)`);
  for (const [name, ctx] of Object.entries(PROMPT_MATRIX)) {
    const s = buildSystemPromptParts(ctx).session;
    console.log(`session ${name.padEnd(18)} ${(await count({ system: s })) - floor} tok  (${s.length} chars)`);
  }
  const buckets: Array<[string, string | undefined]> = [
    ['full', undefined], ['math', 'math'], ['physics', 'physics'], ['chemistry', 'chemistry'], ['biology', 'biology'],
    ['earth', 'earth'], ['cs', 'cs'], ['ela', 'ela'], ['social', 'social'], ['science', 'science'],
  ];
  for (const [name, subject] of buckets) {
    const f = filterToolsForSubject(WHITEBOARD_TOOLS, subject ? resolveToolSubjects(subject) : null);
    console.log(`tools ${name.padEnd(10)} ${(await count({ tools: toAnthropicTools(f.tools) })) - floor} tok  (${f.sent}/${f.total} tools)`);
  }
}
main().catch((e) => { console.error('MEASURE FAILED:', e?.status ?? '', e?.message ?? e); process.exit(1); });
