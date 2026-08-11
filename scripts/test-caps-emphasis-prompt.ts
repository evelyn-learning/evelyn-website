/**
 * Task R47-3 prompt-pin test (session portal-1349716e): the brain wrote
 * "Whatever ELSE he could've done with that same hour" for emphasis and
 * Cartesia spelled "ELSE" letter-by-letter ("E L S E") instead of stressing
 * it. tts-pronunciation.ts's lowercaseCapsEmphasis is the deterministic
 * backstop that normalizes ALL-CAPS emphasis for speech regardless of what
 * the brain emits, but the correct fix also steers the brain away from
 * writing ALL CAPS for emphasis in the first place — R38 already gave it a
 * working alternative (single-asterisk emphasis, rendered client-side and
 * stripped cleanly before TTS by MD_EMPHASIS_REPLACEMENTS), it just was
 * never told to prefer it. This pins that one new sentence in the
 * Voice-Specific Guidelines section, next to the existing "never use
 * markdown formatting" rule.
 *
 * Limitation: static text-presence check on the BUILT prompt, not a
 * live-model behavioral test — it proves the rule text ships, not that the
 * model obeys it.
 *
 * Run: npx tsx scripts/test-caps-emphasis-prompt.ts
 */

import { strict as assert } from 'node:assert';
import { buildSystemPrompt, type SystemPromptContext } from '../src/lib/tutor/ai/system-prompt-builder';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const baseCtx: SystemPromptContext = { module: null, studentName: 'Ravi' };
const prompt = buildSystemPrompt(baseCtx);

test('prompt tells the brain to use asterisk emphasis, never ALL CAPS, for spoken emphasis', () => {
  assert.ok(
    prompt.includes('For spoken emphasis use *asterisk emphasis*, never ALL CAPS — the voice spells capitalized words letter-by-letter.'),
    'exact rule sentence present',
  );
});

test('rule sits in the Voice-Specific Guidelines section, next to the markdown-formatting rule', () => {
  const idx = prompt.indexOf('For spoken emphasis use *asterisk emphasis*');
  const markdownRuleIdx = prompt.indexOf('Never use markdown formatting (no **, ##, etc.) - this is speech');
  assert.ok(idx > -1 && markdownRuleIdx > -1, 'both rules present');
  assert.ok(idx > markdownRuleIdx && idx - markdownRuleIdx < 400, 'emphasis rule sits immediately after the markdown-formatting rule');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
