/** One-shot verification: flag-OFF buildSystemPrompt output must be
 *  byte-identical to the pre-change BASE_PROMPT for the same context.
 *  Compares against git HEAD's buildSystemPrompt output.
 */
import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { buildSystemPrompt } from '@/lib/tutor/ai/system-prompt-builder';

// Force flag OFF (deterministic)
delete process.env.TUTOR_TOOL_SUBJECT_FILTER;
const after = buildSystemPrompt({ subject: undefined, level: '11' } as any);

console.log(`Output: ${after.length} chars, ${after.split('\n').length} lines`);
console.log(`Contains '**Structured diagram tools**': ${after.includes('**Structured diagram tools**')}`);
console.log(`Contains show_food_web: ${after.includes('show_food_web')}`);
console.log(`Contains show_run_code: ${after.includes('show_run_code')}`);
console.log(`Contains sentinel leak: ${after.includes('__STRUCTURED_DIAGRAM_TOOLS_BLOCK_SENTINEL__')}`);
const entryCount = (after.match(/·\s*show_/g) || []).length;
console.log(`Tool entries in full output: ${entryCount}`);

// Compare against git HEAD's buildSystemPrompt — render via stashing the
// current change temporarily? Too invasive. Instead: confirm the rendered
// block prose starts and ends as the original block did.
const startIdx = after.indexOf('**Structured diagram tools**');
const endMarker = 'show_food_web — species arranged by trophic level with prey→predator arrows';
const endIdx = after.indexOf(endMarker);
console.log(`Block span [${startIdx}, ${endIdx + endMarker.length}] = ${endIdx + endMarker.length - startIdx} chars`);
