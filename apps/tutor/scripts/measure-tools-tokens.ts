/**
 * STAGE 2 measurement — per-tool token cost of the cached tools array,
 * plus the system-prompt static/dynamic split needed to ROI-rank trims.
 *
 * Pure measurement, $0 (anthropic.messages.countTokens, no inference).
 * Stage 0 established the 62.5K cached prefix = 29K system + 33K tools;
 * the tools array is the single biggest component and was never broken
 * down. This ranks every WHITEBOARD_TOOLS entry by marginal token cost
 * so Stage 2 trimming is ROI-ranked, not blind.
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/measure-tools-tokens.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import Anthropic from '@anthropic-ai/sdk';
import { WHITEBOARD_TOOLS, toAnthropicTools } from '@/app/tutor/hooks/toolDefinitions';
import { buildSystemPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { renderCatalogForPrompt } from '@/lib/tutor/diagrams/catalog/manifest';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-6';
const PROBE: Anthropic.MessageParam[] = [{ role: 'user', content: 'x' }];

async function countTokens(p: Anthropic.MessageCountTokensParams): Promise<number> {
  const r = await anthropic.messages.countTokens(p);
  return r.input_tokens;
}

async function main() {
  console.log(`\n=== STAGE 2: tools-array + system breakdown (${MODEL}, count_tokens=$0) ===\n`);

  const baseline = await countTokens({ model: MODEL, messages: PROBE });
  const allTools = toAnthropicTools(WHITEBOARD_TOOLS) as Anthropic.MessageCountTokensParams['tools'];
  const totalTools = (await countTokens({ model: MODEL, tools: allTools, messages: PROBE })) - baseline;

  console.log(`tools array: ${WHITEBOARD_TOOLS.length} tools, ${totalTools} tok total (Stage 0 saw ~33,367)\n`);

  // Per-tool marginal cost = tokens({tools:[t]}) - baseline. Small fixed
  // framing overhead per call is constant across tools, so the RANKING
  // is robust even though count_tokens isn't perfectly additive.
  const rows: { name: string; tok: number }[] = [];
  for (const t of WHITEBOARD_TOOLS) {
    const one = toAnthropicTools([t]) as Anthropic.MessageCountTokensParams['tools'];
    const tok = (await countTokens({ model: MODEL, tools: one, messages: PROBE })) - baseline;
    rows.push({ name: t.name, tok });
  }
  rows.sort((a, b) => b.tok - a.tok);

  const sum = rows.reduce((s, r) => s + r.tok, 0);
  console.log('--- per-tool marginal token cost (desc) ---');
  let cum = 0;
  rows.forEach((r, i) => {
    cum += r.tok;
    const pct = ((r.tok / sum) * 100).toFixed(1);
    const cumPct = ((cum / sum) * 100).toFixed(0);
    console.log(
      `  ${String(i + 1).padStart(2)}. ${r.name.padEnd(34)} ${String(r.tok).padStart(6)} tok  ${pct.padStart(5)}%  (cum ${cumPct}%)`,
    );
  });

  const top10 = rows.slice(0, 10).reduce((s, r) => s + r.tok, 0);
  console.log(`\n  → top 5 tools = ${rows.slice(0, 5).reduce((s, r) => s + r.tok, 0)} tok (${((rows.slice(0,5).reduce((s,r)=>s+r.tok,0)/sum)*100).toFixed(0)}% of tools)`);
  console.log(`  → top 10 tools = ${top10} tok (${((top10 / sum) * 100).toFixed(0)}% of tools)`);

  // System-side context for ROI-ranking the prompt-audit memo's trims.
  console.log('\n--- system-prompt split (for ROI context) ---');
  const sys = await countTokens({
    model: MODEL,
    system: buildSystemPrompt({
      module: null, studentName: 'Alex', sessionGoal: 'concept-review',
      timeRemainingMinutes: 30, currentState: 'greeting',
      subject: 'math', topic: 'slope of a line', level: '8',
      studentPreferences: undefined,
    }),
    messages: PROBE,
  }) - baseline;
  const catalog = await countTokens({
    model: MODEL,
    messages: [{ role: 'user', content: '## ' + renderCatalogForPrompt({ subject: 'math', grade: 8 }) }],
  });
  console.log(`  buildSystemPrompt total           ${String(sys).padStart(6)} tok`);
  console.log(`  diagram catalog block (math/g8)   ${String(catalog).padStart(6)} tok  (~${((catalog/sys)*100).toFixed(0)}% of system; subject/grade-dependent)`);
  console.log(`  system minus catalog (BASE+rules+pedagogy+branding+session) ≈ ${sys - catalog} tok`);

  console.log(`\n  CACHED PREFIX ≈ system ${sys} + tools ${totalTools} = ${sys + totalTools} tok`);
  console.log(`  (Stage 0: 62,487. Difference = catalog/tools drift since 2026-05-18.)`);
  console.log('\n=== done ===\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
