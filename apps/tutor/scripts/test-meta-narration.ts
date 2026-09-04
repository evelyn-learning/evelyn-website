/**
 * The meta-narration filter drops brain sentences that leak internal
 * reasoning. portal-704e3e01 @1027.9s spoke a whole <result>…</result>
 * block aloud because the filter matched content phrases only.
 *
 * Usage: npx tsx scripts/test-meta-narration.ts  (npm run test:meta-narration)
 */
import { isMetaNarration } from '../src/lib/tutor/voice/meta-narration';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── the pre-existing phrase behaviour, pinned before it moved ───
check('"The student already solved this one."', isMetaNarration('The student already solved this one.'));
check('"Let me check — the active problem is …"', isMetaNarration('Let me check — the active problem is the dataset.'));
check('"Let me mark this segment complete."', isMetaNarration('Let me mark this segment complete.'));
check('"Since the student answered, …"', isMetaNarration('Since the student answered, we advance.'));
check('"that\'s a greenlight to advance"', isMetaNarration("That's a greenlight to advance."));
check('tool_result leak', isMetaNarration('The tool_result came back empty.'));

// ─── structural leaks: the portal-704e3e01 class ───
check('portal-704e3e01 @1027.9s <result> block',
  isMetaNarration('<result>0=0, same as before — infinitely many again, so this is actually the true-statement twin, not the false one.</result>'));
check('closing tag alone', isMetaNarration('different one for variety.</result>'));
check('<span style="opacity:0"> variant (443.2s)',
  isMetaNarration('<span style="opacity:0">verdict: request, not an answer — no praise</span>'));
check('<thinking> leak', isMetaNarration('<thinking>she is stuck on denominators</thinking>'));

// ─── real teaching speech must survive ───
check('plain math sentence survives',
  !isMetaNarration('Distribute the $4$ across both terms inside those parentheses.'));
check('inequality is not markup', !isMetaNarration('So $x < 5$ and $y > 2$ together.'));
check('spoken comparison is not markup', !isMetaNarration('That means 3 < 10, which is true.'));
check('a verdict survives', !isMetaNarration('Exactly. $x = 10$ — nice work.'));
check('LaTeX survives', !isMetaNarration('Look at $\\frac{x}{2} + 3 = \\frac{x}{5} + 6$ on the board.'));

// ─── the structural rule is separable (kill switch behaviour) ───
check('structural:false leaves <result> alone',
  !isMetaNarration('<result>0=0, same as before.</result>', { structural: false }));
check('structural:false still drops phrase leaks',
  isMetaNarration('The student already solved this one.', { structural: false }));

// Regex 3 — the self-reference / non-answer classifier leak class. This is
// very likely what caught the live 1254.7s leak ("No verdict word … not an
// answer at…"), so it must survive the extraction.
check('"No verdict word" leak', isMetaNarration('No verdict word — this is a give-up and an explicit request.'));
check('"not an answer" leak', isMetaNarration('That is not an answer, so classify silently.'));
check('"automated review" leak', isMetaNarration('This came from an automated review of the turn.'));
check('"give her room" leak', isMetaNarration('Give her room to think before pushing again.'));

// Regex 4 — spoken self-audit collocations (2026-08-31 Haiku round).
check('"I need to check" leak', isMetaNarration('I need to check my prior turn before answering.'));
check('"let me compute:" leak', isMetaNarration('Let me compute: 8+8+5+5 and see.'));
check('"my prior turn" leak', isMetaNarration('So my prior turn was already correct.'));
check('"my Not quite was" leak', isMetaNarration('So my "Not quite" was right after all.'));

// The load-bearing colon: legitimate teaching must SURVIVE.
check('"let me compute the area" survives', !isMetaNarration('Let me compute the area together with you.'));

// A prose run between angle brackets is structurally tag-shaped
// ("<n and n>"), so the attribute section must contain '=' before the
// sentence is treated as markup. Without that, ordinary algebra with two
// unspaced comparisons was silently dropped from TTS and the transcript.
check('unspaced variable comparison survives 1',
  !isMetaNarration('Since 3<n and n>10 does not hold together, let us solve it directly.'));
check('unspaced variable comparison survives 2',
  !isMetaNarration('x<y is bigger, so y>2 too.'));
check('unspaced variable comparison survives 3',
  !isMetaNarration('We need a<b and later on c>d to hold.'));

// All four phrase regexes must fire regardless of the structural option.
check('regex 3 fires with structural:false',
  isMetaNarration('That is not an answer, so classify silently.', { structural: false }));
check('regex 4 fires with structural:false',
  isMetaNarration('I need to check my prior turn before answering.', { structural: false }));

// Curly quotes are the common case in generated speech, and the character
// class carrying them was lost once already in an extraction. Escapes, not
// literals: the curly characters have been mangled twice in transit already,
// and a literal here would silently become ASCII again.
check('ASCII straight quotes are matched',
  isMetaNarration('So my "Not quite" was right after all.'));
check('typographic curly quotes are matched',
  isMetaNarration(`So my “Not quite” was right after all.`));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
