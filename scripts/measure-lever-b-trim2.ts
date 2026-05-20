/**
 * Lever B trim #2 redux — measure per-subject savings from subject-trimming
 * the manual structured-tools block at system-prompt-builder.ts ~664-702.
 * Pure measurement, $0 (anthropic.messages.countTokens, no inference).
 *
 * Run: npx tsx scripts/measure-lever-b-trim2.ts
 */
import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import Anthropic from '@anthropic-ai/sdk';
import { resolveToolSubjects } from '@/lib/tutor/ai/tool-subject-taxonomy';
import { renderStructuredToolsBlock } from '@/lib/tutor/ai/system-prompt-builder';

const MODEL = 'claude-sonnet-4-6';
const PROBE: Anthropic.MessageParam[] = [{ role: 'user', content: 'x' }];
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function tok(s: string): Promise<number> {
  const base = await anthropic.messages.countTokens({ model: MODEL, messages: PROBE });
  const withSys = await anthropic.messages.countTokens({ model: MODEL, system: s, messages: PROBE });
  return withSys.input_tokens - base.input_tokens;
}

async function main() {
  console.log(`\n=== Lever B trim #2 redux: per-subject manual-list cost (${MODEL}, count_tokens=$0) ===\n`);

  // Use the SHIPPING renderer so the measurement matches what the brain sees,
  // including empty-category drops.
  const fullProse = renderStructuredToolsBlock(null);
  const fullTok = await tok(fullProse);
  console.log(`FULL block (renderer, null=failopen): ${fullTok} tok, ${fullProse.length} chars`);

  // Byte-identity sanity: full prose must contain all 29 tool entries and the
  // 6 category headers, and start/end with the right lines.
  const entryCount = (fullProse.match(/·\s*show_/g) || []).length;
  const categoryCount = (fullProse.match(/^   - /gm) || []).length;
  const startsRight = fullProse.startsWith('**Structured diagram tools**');
  const endsRight = fullProse.trimEnd().endsWith('show_food_web — species arranged by trophic level with prey→predator arrows');
  console.log(`  entries=${entryCount}/29, categories=${categoryCount}/6, starts=${startsRight}, ends=${endsRight}`);
  if (entryCount !== 29 || categoryCount !== 6 || !startsRight || !endsRight) {
    console.error('BYTE-IDENTITY SANITY FAILED — block does not match expected shape');
    process.exit(1);
  }
  console.log();

  const subjects = ['math', 'physics', 'chemistry', 'biology', 'ela', 'social-studies', 'cs', 'science', 'test-prep'];
  for (const ui of subjects) {
    const allowed = resolveToolSubjects(ui);
    const rendered = renderStructuredToolsBlock(allowed);
    const t = await tok(rendered);
    const saved = fullTok - t;
    const pct = ((saved / fullTok) * 100).toFixed(1);
    console.log(
      `${ui.padEnd(15)} ${allowed === null ? 'FAILOPEN' : 'filter  '}  block=${t} tok  saved=${saved} (${pct}% of full block)`,
    );
  }
  console.log('\n=== done ===');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
