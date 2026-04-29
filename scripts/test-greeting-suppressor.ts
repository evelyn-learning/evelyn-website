/**
 * Smoke test for the mid-session re-greet suppressor logic. Pure regex —
 * no React, no Anthropic. Verifies both shapes the suppressor must
 * handle: greeting-only standalone sentences (drop entirely) and
 * greeting prefixes on longer sentences (strip prefix, voice rest).
 *
 * Motivation: 2026-04-29 trig session showed the brain emit "Hey
 * Praveen!" as a complete first sentence after the student's first
 * content reply. The pre-fix suppressor only handled the prefix case
 * and let the greeting-only sentence through; student replied "hello"
 * thinking the session had restarted.
 *
 * Run: npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' --transpile-only scripts/test-greeting-suppressor.ts
 */

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

// Same regex as VoiceTutorRealtime.tsx greeting suppressor. Kept in
// sync — if either changes, both should move together.
const greetingRe = /^\s*(?:hey|hi|hello|howdy)\b(?:\s+[A-Z][a-z]+)?[!.,]*\s*/i;

// Reproduce the full suppressor decision (just the relevant branch).
type Outcome = 'pass' | 'drop' | 'strip';
function classify(sentence: string): { outcome: Outcome; voiced: string } {
  if (!greetingRe.test(sentence)) return { outcome: 'pass', voiced: sentence };
  const stripped = sentence.replace(greetingRe, '').trim();
  if (!stripped || stripped.length < 4) {
    return { outcome: 'drop', voiced: '' };
  }
  if (stripped !== sentence.trim()) {
    return { outcome: 'strip', voiced: stripped };
  }
  return { outcome: 'pass', voiced: sentence };
}

console.log('\n=== Drop: greeting-only sentences ===');
{
  // The exact case from the 2026-04-29 trig session
  const c = classify('Hey Praveen!');
  check('"Hey Praveen!" → drop', c.outcome === 'drop', `outcome=${c.outcome}`);
}
{
  const c = classify('Hi!');
  check('"Hi!" → drop', c.outcome === 'drop', `outcome=${c.outcome}`);
}
{
  const c = classify('Hello there!');
  // The /i flag makes [A-Z] also match lowercase, so "there" gets
  // pulled into the name slot. "Hello there!" then strips entirely
  // → drop. Reasonable behavior for a salutation that happens to use
  // a non-name greeting word.
  check('"Hello there!" → drop (case-insensitive name match)', c.outcome === 'drop', `outcome=${c.outcome}, voiced="${c.voiced}"`);
}
{
  const c = classify('Hi Praveen.');
  check('"Hi Praveen." (period instead of !) → drop', c.outcome === 'drop', `outcome=${c.outcome}`);
}
{
  const c = classify('Howdy Sam!');
  check('"Howdy Sam!" → drop', c.outcome === 'drop', `outcome=${c.outcome}`);
}

console.log('\n=== Strip: greeting prefix on longer sentence ===');
{
  const c = classify('Hey Praveen! No worries — let me put the problem on the board.');
  check('"Hey Praveen! No worries…" → strip', c.outcome === 'strip', `voiced="${c.voiced.slice(0, 50)}…"`);
  check('voiced text starts with "No worries"', c.voiced.startsWith('No worries'), c.voiced);
}
{
  const c = classify('Hi! How would you like to start?');
  check('"Hi! How would you…" → strip', c.outcome === 'strip', `voiced="${c.voiced}"`);
}
{
  const c = classify('Hello Praveen! Welcome back to trig.');
  check('"Hello Praveen! Welcome back…" → strip', c.outcome === 'strip', `voiced="${c.voiced}"`);
}

console.log('\n=== Pass: non-greeting sentences ===');
{
  // Negatives — sentences that should NOT be touched by the suppressor.
  const cases = [
    'So what do you think — how would you redefine sine?',
    'Notice how the angle is in the third quadrant.',
    'Let me know if that makes sense.',
    'Try this one: 1/4 + 2/3.',
    "I'll show you the next step.",
  ];
  for (const s of cases) {
    const c = classify(s);
    check(`pass: "${s.slice(0, 40)}…"`, c.outcome === 'pass', `outcome=${c.outcome}`);
  }
}

console.log('\n=== Edge cases ===');
{
  // "Hey" alone (no punctuation) — regex still matches the word boundary.
  // The base regex requires no name + optional punctuation, so "Hey" → ""
  // (length 0) → drop. Reasonable behavior for a fragmentary greeting.
  const c = classify('Hey');
  check('"Hey" alone → drop', c.outcome === 'drop', `outcome=${c.outcome}`);
}
{
  // "Heyo" — not in the alternation (only hey/hi/hello/howdy) → pass.
  const c = classify('Heyo, what is up?');
  check('"Heyo…" → pass (not in alternation)', c.outcome === 'pass', `outcome=${c.outcome}`);
}
{
  // The /i flag also makes the name group match lowercase, so this
  // strips entirely → drop. Same path as "Hello there!" above.
  const c = classify('Hey praveen!');
  check('"Hey praveen!" (lowercase name, /i flag matches) → drop', c.outcome === 'drop',
    `outcome=${c.outcome}`);
}

console.log(`\n=== Result: ${pass} pass, ${fail} fail ===`);
process.exit(fail > 0 ? 1 : 0);
