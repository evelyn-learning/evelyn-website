/**
 * Tests for formatVerdictGuardBlock (claude-brain.ts) — the per-turn
 * short-answer verdict guard from the Phase-3 live rounds (2026-07-23):
 * "5" → "Right. 6 m/s²." class of false-praise openers.
 *
 * Run: npx tsx scripts/test-verdict-guard.ts
 */
import { formatVerdictGuardBlock } from '../src/lib/tutor/voice/claude-brain';

let passed = 0, failed = 0;
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const fires = (t: string) => formatVerdictGuardBlock(t).includes('<verdict_guard>');

// Short answers → guard attaches.
check('bare number', fires('5.'));
check('decimal', fires('13.2'));
check('number + unit', fires('15 newtons'));
check('option letter', fires('B'));
check('option letter punct', fires('c.'));
check('two words', fires('common denominator'));
check('yes/no', fires('No.'));
check('short with number', fires('it is 6 right'));

// Conversational turns → no guard (must not dilute normal dialogue).
check('full sentence', !fires('Okay so the circle would be the one without denominators, so B.'));
check('question', !fires('But why does the minus sign make it a hyperbola exactly?'));
check('five words no number', !fires('I am not really sure'));
check('bracketed injection', !fires('[The student pointed at the equation ("Concept…")]'));
check('validator feedback', !fires('[validator feedback — not from the student] Your last turn…'));
check('empty', !fires(''));

// Block content sanity — the three verdict branches are present.
const block = formatVerdictGuardBlock('5.');
check('praise branch', block.includes('ONLY if it is correct'));
check('wrong branch', block.includes('do NOT state the correct value'));
check('non-answer branch', block.includes('NO verdict word'));
check('closes tag', block.trimEnd().endsWith('</verdict_guard>'));

// ─── Continuation guard (live round 6, 2026-07-23, session-1784782504324):
// "Yes." to "Ready for the next one?" drew "Exactly." + a re-summary + the
// SAME question again — two turns stalled. A bare affirmative after a
// continuation offer is consent, not an answer to grade.
const OFFER = "That's the pattern. Ready for a fresh problem?";
const contFires = (t: string, tutor: string) => formatVerdictGuardBlock(t, tutor).includes('<continuation_guard>');

check('cont: "Yes." after offer → continuation guard', contFires('Yes.', OFFER));
check('cont: "Uh, yes." (leading filler) → continuation guard', contFires('Uh, yes.', OFFER));
check('cont: "Let\'s go!" after "Want to…?" → continuation guard', contFires("Let's go!", 'Want to try one on your own?'));
check('cont: continuation guard replaces verdict guard', !formatVerdictGuardBlock('Yes.', OFFER).includes('<verdict_guard>'));
check('cont: guard forbids verdict opener', formatVerdictGuardBlock('Yes.', OFFER).includes('do NOT open with a verdict word'));

// "Yes." answering a CONTENT question keeps the ordinary verdict guard.
check('cont: "Yes." after content question → verdict guard', !contFires('Yes.', 'Is the net force bigger than before?')
  && formatVerdictGuardBlock('Yes.', 'Is the net force bigger than before?').includes('<verdict_guard>'));
// Compound replies carry content — no continuation guard.
check('cont: "yes but why…" → no continuation guard', !contFires('yes but why does mass matter?', OFFER));
// No tutor context → unchanged behavior.
check('cont: no prior tutor msg → verdict guard as before', formatVerdictGuardBlock('Yes.').includes('<verdict_guard>'));
check('cont: bracketed injection → nothing', formatVerdictGuardBlock('[Skip-button-clicked]', OFFER) === '');

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} verdict-guard tests passed.`);
