/**
 * Smoke test for extractFirstJsonObject in /api/tutor/judge. Pure
 * regex/string check — verifies the brace-counting scanner handles
 * every observed Haiku response shape:
 *   - bare JSON
 *   - prose before JSON
 *   - prose after JSON
 *   - fenced code blocks
 *   - fenced JSON followed by explanation prose (2026-04-29 geometry
 *     session failure mode)
 *   - nested braces inside the JSON
 *   - braces inside string literals
 *
 * Run: npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' --transpile-only scripts/test-judge-json-extractor.ts
 */

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

// Mirror of the helper in src/app/api/tutor/judge/route.ts. Keep in sync.
function extractFirstJsonObject(s: string): string | null {
  let depth = 0;
  let start = -1;
  let inStr = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (inStr) {
      if (c === '\\') escape = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && start >= 0) return s.slice(start, i + 1);
    }
  }
  return null;
}

function checkJson(name: string, raw: string, expected: object) {
  const extracted = extractFirstJsonObject(raw);
  if (!extracted) {
    check(name, false, 'extractor returned null');
    return;
  }
  try {
    const parsed = JSON.parse(extracted);
    const ok = JSON.stringify(parsed) === JSON.stringify(expected);
    check(name, ok, ok ? `parsed=${JSON.stringify(parsed)}` : `expected=${JSON.stringify(expected)} got=${JSON.stringify(parsed)}`);
  } catch (e) {
    check(name, false, `parse error: ${(e as Error).message}`);
  }
}

console.log('\n=== Bare JSON ===');
checkJson('bare grounded:true',
  '{"grounded": true, "issues": []}',
  { grounded: true, issues: [] });
checkJson('bare grounded:false with issues',
  '{"grounded": false, "issues": [{"claim": "x = 5", "why": "board has 6"}]}',
  { grounded: false, issues: [{ claim: 'x = 5', why: 'board has 6' }] });

console.log('\n=== Fenced JSON (the legacy case my regex handled) ===');
checkJson('fenced ```json',
  '```json\n{"grounded": true, "issues": []}\n```',
  { grounded: true, issues: [] });
checkJson('fenced bare ```',
  '```\n{"grounded": true, "issues": []}\n```',
  { grounded: true, issues: [] });

console.log('\n=== Fenced JSON + trailing prose (the 2026-04-29 failure) ===');
{
  // The exact shape from the geometry session log
  const raw = '```json\n{"grounded": true, "issues": []}\n```\n\nThe tutor\'s statement is a procedural/pedagogical question about how to apply the Pythagorean theorem to a new problem. It doesn\'t make any concrete factual claims about board content.';
  checkJson('fenced JSON followed by explanation prose', raw, { grounded: true, issues: [] });
}

console.log('\n=== Prose before JSON ===');
checkJson('leading prose',
  'Here is my analysis:\n\n{"grounded": true, "issues": []}',
  { grounded: true, issues: [] });

console.log('\n=== Nested braces in claim text ===');
checkJson('claim with object literal in string',
  '{"grounded": false, "issues": [{"claim": "set is {1, 2, 3}", "why": "board has {4, 5, 6}"}]}',
  { grounded: false, issues: [{ claim: 'set is {1, 2, 3}', why: 'board has {4, 5, 6}' }] });

console.log('\n=== Escaped quotes in claim text ===');
checkJson('claim with escaped quotes',
  '{"grounded": false, "issues": [{"claim": "tutor said \\"twelve\\"", "why": "board says 16"}]}',
  { grounded: false, issues: [{ claim: 'tutor said "twelve"', why: 'board says 16' }] });

console.log('\n=== Multiple JSON objects (we want the FIRST) ===');
checkJson('multiple objects, first wins',
  '{"grounded": true, "issues": []}\n\nAnother thought: {"different": "object"}',
  { grounded: true, issues: [] });

console.log('\n=== Negative — no JSON at all ===');
{
  const raw = 'I cannot determine groundedness from this input.';
  const extracted = extractFirstJsonObject(raw);
  check('no JSON returns null', extracted === null, `got: ${extracted}`);
}

console.log(`\n=== Result: ${pass} pass, ${fail} fail ===`);
process.exit(fail > 0 ? 1 : 0);
