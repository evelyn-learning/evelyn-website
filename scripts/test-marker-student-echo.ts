/**
 * Tests for extractStudentEcho (2026-08-07 triage, session-1786064015703):
 * bracketed dispatch markers that QUOTE genuine student content ([try-yourself
 * submission…], [The student wrote…], [The student drew/uploaded…]) were
 * `silent`-gated out of the transcript while still reaching the brain — so the
 * replay showed the tutor affirming out of nowhere, and later brain turns had
 * no record the student ever answered. The extractor recovers the student's
 * own words so the orchestrator can append them as a historyOnly entry.
 *
 * Run: npx tsx scripts/test-marker-student-echo.ts
 */
import { extractStudentEcho } from '../apps/marketing/src/lib/tutor/voice/marker-student-echo';

let passed = 0, failed = 0;
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// The live marker (bare "a" submission, no expected answer).
check('try-yourself, no expected answer',
  extractStudentEcho('[try-yourself submission. The student submitted: "a". No expected answer set — judge correctness yourself. If wrong, stay on this same try-yourself; do NOT advance to a new problem.]') === 'a');

// With-expected variant.
check('try-yourself, with expected',
  extractStudentEcho('[try-yourself submission. The student submitted: "(x+3)^2 + (y-2)^2 = 25". Expected: (x-3)^2+(y+2)^2=25. Verdict: does NOT match. If "does NOT match", stay on this same try-yourself — give a hint, do NOT call new_page or show a different problem. If undecidable, judge algebraic equivalence yourself.]') === '(x+3)^2 + (y-2)^2 = 25');

// Whiteboard-written content.
check('student wrote on whiteboard',
  extractStudentEcho('[The student wrote on the whiteboard: "y = 2x + 1". Respond to what they wrote.]') === 'y = 2x + 1');

// Drawing / upload OCR marker ("drew on" / "uploaded to" nouns vary).
check('student drew — OCR contents',
  extractStudentEcho('[The student drew on the whiteboard. It contains: "3/4 + 1/4 = ?". Respond to what they shared.]') === '3/4 + 1/4 = ?');
check('student uploaded — OCR contents',
  extractStudentEcho('[The student uploaded an image to the whiteboard. It contains: "F = ma". Respond to what they shared.]') === 'F = ma');

// Content containing quote characters must not truncate at the inner quote.
check('inner quotes survive',
  extractStudentEcho('[try-yourself submission. The student submitted: "the "unit" fraction". No expected answer set — judge correctness yourself. If wrong, stay on this same try-yourself; do NOT advance to a new problem.]') === 'the "unit" fraction');

// Directive-only markers carry NO student content → null.
check('[start lesson] → null', extractStudentEcho('[start lesson]') === null);
check('idle nudge → null', extractStudentEcho('[The student has been quiet for a while. Gently check in.]') === null);
check('cadence note → null', extractStudentEcho('[cadence note — not from the student] Your last turn ran long.') === null);
check('skip marker → null', extractStudentEcho('[Skip-button-clicked: advance the lesson]') === null);
check('validator feedback → null', extractStudentEcho('[validator feedback — not from the student] Your last turn emitted tool call(s)…') === null);
check('non-bracketed speech → null', extractStudentEcho('an ellipse') === null);
check('empty → null', extractStudentEcho('') === null);

// Whitespace-only quoted content → null (nothing worth appending).
check('empty submission → null',
  extractStudentEcho('[try-yourself submission. The student submitted: "  ". No expected answer set — judge correctness yourself. If wrong, stay on this same try-yourself; do NOT advance to a new problem.]') === null);

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} marker-student-echo tests passed.`);
