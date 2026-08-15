/**
 * Lever A before/after — honest tools-array token delta per UI subject,
 * plus correctness assertions. Pure measurement, $0
 * (anthropic.messages.countTokens, no inference).
 *
 * Run: npx tsx scripts/measure-lever-a.ts
 */
import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import Anthropic from '@anthropic-ai/sdk';
import { WHITEBOARD_TOOLS, toAnthropicTools } from '@/app/tutor/hooks/toolDefinitions';
import {
  resolveToolSubjects,
  filterToolsForSubject,
} from '@/lib/tutor/ai/tool-subject-taxonomy';

const MODEL = 'claude-sonnet-4-6';
const PROBE: Anthropic.MessageParam[] = [{ role: 'user', content: 'x' }];
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SYSTEM_TOK = 28750; // re-measured this session (post trim #1)

async function countTokens(p: Anthropic.MessageCountTokensParams): Promise<number> {
  const r = await anthropic.messages.countTokens(p);
  return r.input_tokens;
}

async function main() {
  console.log(`\n=== Lever A before/after (${MODEL}, count_tokens=$0) ===\n`);

  const baseline = await countTokens({ model: MODEL, messages: PROBE });
  const allA = toAnthropicTools(WHITEBOARD_TOOLS) as Anthropic.MessageCountTokensParams['tools'];
  const fullTok = (await countTokens({ model: MODEL, tools: allA, messages: PROBE })) - baseline;
  const fullPrefix = SYSTEM_TOK + fullTok;
  console.log(`full tools: ${WHITEBOARD_TOOLS.length} tools, ${fullTok} tok`);
  console.log(`full cached prefix ≈ system ${SYSTEM_TOK} + tools ${fullTok} = ${fullPrefix} tok\n`);

  // Correctness: flag-OFF / fail-open returns the SAME array reference.
  const failopen = filterToolsForSubject(WHITEBOARD_TOOLS, null);
  console.assert(failopen.tools === WHITEBOARD_TOOLS, 'FAIL: fail-open must return same reference');
  console.log(`fail-open identity: ${failopen.tools === WHITEBOARD_TOOLS ? 'OK (same ref, byte-identical)' : 'BROKEN'}\n`);

  const subjects = ['math', 'physics', 'chemistry', 'biology', 'ela', 'social-studies', 'cs', 'science', 'test-prep'];
  for (const ui of subjects) {
    const allowed = resolveToolSubjects(ui);
    const r = filterToolsForSubject(WHITEBOARD_TOOLS, allowed);
    if (r.mode === 'failopen') {
      console.log(`${ui.padEnd(15)} → FAIL OPEN (${r.sent}/${r.total}, no cut)`);
      continue;
    }
    const fa = toAnthropicTools(r.tools) as Anthropic.MessageCountTokensParams['tools'];
    const tok = (await countTokens({ model: MODEL, tools: fa, messages: PROBE })) - baseline;
    const saved = fullTok - tok;
    const newPrefix = SYSTEM_TOK + tok;
    const pct = ((saved / fullPrefix) * 100).toFixed(1);
    // Hard invariants
    const hasDiagram = r.tools.some((t) => t.name === 'show_diagram');
    const hasGen = r.tools.some((t) => t.name === 'generate_problem');
    console.log(
      `${ui.padEnd(15)} sent=${r.sent}/${r.total}  tools ${tok} tok  ` +
        `saved ${saved} (${pct}% of ${fullPrefix} prefix)  prefix→${newPrefix}` +
        `  [show_diagram:${hasDiagram ? 'kept' : 'MISSING!'} generate_problem:${hasGen ? 'kept' : 'MISSING!'}]`,
    );
    console.log(`  excluded(${r.excluded.length}): ${r.excluded.join(', ')}\n`);
  }
  console.log('=== done ===');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
