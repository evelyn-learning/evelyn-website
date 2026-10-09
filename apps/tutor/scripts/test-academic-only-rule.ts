/**
 * Academic-only rule — pins that every prompt producing a STORED record
 * about a student (session summary, gap observation, stored student quotes,
 * next-session intent, homework reason) carries the rule, and that the rule
 * itself names every category it has to exclude.
 *
 * Text-presence only — no model call. A dummy key is set because importing
 * session-summary.ts constructs (but never uses) a model client.
 *
 * Usage: npx tsx scripts/test-academic-only-rule.ts   (npm run test:academic-only-rule)
 */
import assert from 'node:assert';

process.env.ANTHROPIC_API_KEY ||= 'test-key-never-used';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.log(`  ✗ ${name} — ${(err as Error).message}`); }
}

(async () => {
  const { ACADEMIC_ONLY_RULE, ACADEMIC_ONLY_FIELD_RULE, ACADEMIC_ONLY_QUOTE_RULE } = await import('../src/lib/tutor/student-profile/academic-only');
  const { SESSION_SUMMARY_SYSTEM, SESSION_FILLINGS_SYSTEM } = await import('../src/lib/tutor/student-profile/session-summary');
  const { WHITEBOARD_TOOLS } = await import('../src/app/tutor/hooks/toolDefinitions');

  const CATEGORIES = ['family', 'health', 'location', 'relationships', 'mood', 'hobbies or interests', 'contact details', 'outside the subject matter'];

  console.log('\nAcademic-only rule — wording:\n');
  test('the full rule says what TO record', () => {
    for (const phrase of ['ONLY academic content', 'what was studied', 'could and could not do', 'misconceptions', 'next academic step']) {
      assert.ok(ACADEMIC_ONLY_RULE.includes(phrase), `missing "${phrase}"`);
    }
  });
  test('the full rule and the field rule each name every excluded category', () => {
    for (const rule of [ACADEMIC_ONLY_RULE, ACADEMIC_ONLY_FIELD_RULE]) {
      for (const c of CATEGORIES) assert.ok(rule.includes(c), `missing "${c}" in: ${rule}`);
    }
  });
  test('the rule covers details the student volunteers', () => {
    assert.ok(ACADEMIC_ONLY_RULE.includes('even when the student volunteers them'));
  });
  test('the quote rule is the field rule plus "omit the quote"', () => {
    assert.ok(ACADEMIC_ONLY_QUOTE_RULE.startsWith(ACADEMIC_ONLY_FIELD_RULE));
    assert.ok(ACADEMIC_ONLY_QUOTE_RULE.includes('Omit any quote that contains one'));
  });

  console.log('\nAcademic-only rule — where it is applied:\n');
  test('the stored session summary prompt carries the full rule (and still the transcript limit)', () => {
    assert.ok(SESSION_SUMMARY_SYSTEM.includes(ACADEMIC_ONLY_RULE));
    assert.ok(SESSION_SUMMARY_SYSTEM.includes('Stay within what the transcript shows'));
  });
  test('the summary+fillings prompt carries the full rule for both fields', () => {
    assert.ok(SESSION_FILLINGS_SYSTEM.includes(`In BOTH fields: ${ACADEMIC_ONLY_RULE}`));
  });

  const param = (tool: string, name: string): string => {
    const def = WHITEBOARD_TOOLS.find((t) => t.name === tool);
    assert.ok(def, `tool ${tool} not found`);
    const p = (def.parameters.properties as Record<string, { description?: string }>)[name];
    assert.ok(p?.description, `${tool}.${name} has no description`);
    return p.description;
  };
  for (const tool of ['record_gap', 'flag_prerequisite_gap']) {
    test(`${tool}.observation carries the field rule`, () => {
      assert.ok(param(tool, 'observation').includes(ACADEMIC_ONLY_FIELD_RULE));
    });
    test(`${tool}.studentQuotes carries the quote rule`, () => {
      assert.ok(param(tool, 'studentQuotes').includes(ACADEMIC_ONLY_QUOTE_RULE));
    });
  }
  for (const name of ['nextTimeIntent', 'reason']) {
    test(`close_session_notes.${name} carries the field rule`, () => {
      assert.ok(param('close_session_notes', name).includes(ACADEMIC_ONLY_FIELD_RULE));
    });
  }

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
