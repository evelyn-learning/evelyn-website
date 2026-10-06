/**
 * Teacher persona whose name is a ROLE, not a personal name.
 *
 * Defect this pins (GreenApple app walk 2026-10-05, M2): the persona
 * "Homework Helper" was reduced to a first name by `teacherFirstName`, so
 * every session opened "I'm Homework, and today we're tackling…". A role
 * name is spoken whole, as a role ("I'm your Homework Helper"); the tutor
 * never claims a personal name for it. Personal-name personas — the engine's
 * house roster and the academy's seeded teachers — are introduced exactly as
 * before.
 *
 * Run: npx tsx scripts/test-teacher-role-name.ts  (npm run test:teacher-role-name)
 */
import { strict as assert } from 'node:assert';
import {
  DEMO_TEACHERS,
  TEACHER_IDENTITY_BOUNDS_CLAUSE,
  isRoleStyleTeacherName,
  renderTeacherPersonaBlock,
  renderTeacherIntroDirective,
  renderTeacherStyleReminder,
  teacherFirstName,
  type TeacherPersonaWire,
} from '@core/ai/teacher-persona';
import { buildSystemPrompt } from '../src/lib/tutor/ai/system-prompt-builder';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

/** Exactly what the academy sends today for the GreenApple persona. */
const HOMEWORK_HELPER: TeacherPersonaWire = {
  id: 'homework-helper',
  name: 'Homework Helper',
  intro: "Hi, I'm your Homework Helper. Bring me the problem you're stuck on and we'll work through it together — I'll ask questions, you do the thinking.",
};

/** The academy's seeded teachers (apps/api/src/scripts/seed-teachers.ts) —
 *  mirrored, not imported: a different repo. */
const ACADEMY_TEACHER_NAMES = [
  'Mr. Praveen', 'Mr. Sameer', 'Ms. Kiara', 'Mr. Joseph', 'Mr. Cole', 'Ms. Cathy', 'Ms. Michelle', 'Coach Riley',
  'Mr. Ravi', 'Ms. Robin',
];
const ACADEMY_TEACHERS: TeacherPersonaWire[] = ACADEMY_TEACHER_NAMES.map((name, i) => ({
  id: `academy-${i}`, name, intro: 'I like to draw things out.',
}));
const PERSONAL = [...DEMO_TEACHERS, ...ACADEMY_TEACHERS];

/** The pre-change strings, rebuilt here from the first name — the contract
 *  every personal-name persona must keep byte for byte. */
function legacyDirective(t: TeacherPersonaWire, firstTurnV2: boolean): string {
  const first = teacherFirstName(t.name);
  const openingSpec = firstTurnV2
    ? `Introduce yourself simply as ${first} in your first turn — your first name AND, in the same ` +
      `breath, what today is about (one warm sentence; no honorific, no surname). Your first sentence ` +
      `must never be a bare greeting: "${first} here." or "I'm ${first}." on its own is too thin to ` +
      `land — the student has just sat through several seconds of silence, and a two-word opener reads ` +
      `as a glitch rather than a teacher. Give them the name and the subject together. `
    : `Introduce yourself simply as ${first} in your first turn — one warm greeting sentence, just your ` +
      `first name (no honorific, no surname). `;
  return (
    openingSpec +
    `NO biography of any kind: no credentials, years of ` +
    `experience, subject lists, personal props, anecdotes, or history — it's a hello, not a resume. ` +
    `Your personality shows through HOW you teach, not through facts about yourself. Then get into the opener.`
  );
}

function main() {
  console.log('teacher persona — role-style names');

  test('heuristic: role-style names are detected', () => {
    for (const name of [
      'Homework Helper', 'homework helper', 'Math Tutor', 'Study Buddy', 'Writing Coach', 'Your Homework Helper',
      'The Homework Helper', 'AI Tutor', 'Learning Assistant', 'Reading Guide', 'Science Mentor', 'Tutor', 'Helper',
      'Study Companion', 'Homework Help',
    ]) {
      assert.equal(isRoleStyleTeacherName({ name }), true, `${name} is a role`);
    }
  });

  test('heuristic: personal names are not roles (house roster, academy teachers, edge cases)', () => {
    for (const t of PERSONAL) assert.equal(isRoleStyleTeacherName(t), false, `${t.name} is a personal name`);
    for (const name of [
      'Coach Riley', 'Coach Sam Carter', 'Sofia', 'Ms. Kiara', 'Mrs Kiara', 'Dr. Amara Osei', 'Prof. Lin', 'Riley',
      'Mr. Jon Trainer', 'Ms. Amy Guide', 'Mx. Minimal', 'Dr. Test Teacher', 'Anneliese de Vries', 'Kai', 'Theo', 'Myra',
      'An Nguyen', 'My Linh', 'Thea Park', 'Yoursa Ali',
    ]) {
      assert.equal(isRoleStyleTeacherName({ name }), false, `${name} is a personal name`);
    }
  });

  test('wire field nameIsRole overrides the heuristic in both directions', () => {
    assert.equal(isRoleStyleTeacherName({ name: 'Sunny', nameIsRole: true }), true);
    assert.equal(isRoleStyleTeacherName({ name: 'Homework Helper', nameIsRole: false }), false);
    assert.equal(isRoleStyleTeacherName({ name: 'Homework Helper', nameIsRole: undefined }), true);
  });

  // ── the reported defect ───────────────────────────────────────────────────
  test('"Homework Helper" is never reduced to "Homework" — intro directive (v1 and v2)', () => {
    for (const firstTurnV2 of [false, true]) {
      const d = renderTeacherIntroDirective(HOMEWORK_HELPER, { firstTurnV2 });
      assert.ok(d.includes(`"I'm your Homework Helper"`), 'gives the spoken form');
      assert.match(d, /role, not a personal name/);
      assert.match(d, /never shorten it/i);
      assert.doesNotMatch(d, /as Homework in/, 'must not introduce as the bare first word');
      assert.doesNotMatch(d, /"Homework here\."|I'm Homework\./);
      assert.doesNotMatch(d, /first name/i, 'a role has no first name');
      assert.match(d, /NO biography of any kind/, 'the biography ban is kept');
      assert.ok(d.endsWith('Then get into the opener.'));
    }
    assert.match(renderTeacherIntroDirective(HOMEWORK_HELPER, { firstTurnV2: true }), /must never be a bare greeting/);
  });

  test('"Homework Helper" persona block: role wording, no go-by-first-name line', () => {
    const block = renderTeacherPersonaBlock(HOMEWORK_HELPER);
    assert.doesNotMatch(block, /Go by "/);
    assert.doesNotMatch(block, /"Homework"/);
    assert.ok(block.includes('Role: Homework Helper'));
    assert.ok(block.includes(`"I'm your Homework Helper"`));
    assert.match(block, /never claim or invent a personal name/);
    assert.ok(block.includes(`About you (context if a student ASKS about you`), 'the ask-only intro line is kept');
    assert.ok(block.startsWith('<teacher_identity>') && block.endsWith('</teacher_identity>'));
    assert.ok(block.includes(TEACHER_IDENTITY_BOUNDS_CLAUSE.replace('{name}', "the student's Homework Helper")));
  });

  test('a leading article is not doubled ("Your Homework Helper" → "your Homework Helper")', () => {
    const t = { ...HOMEWORK_HELPER, name: 'Your Homework Helper' };
    const d = renderTeacherIntroDirective(t, { firstTurnV2: true });
    assert.ok(d.includes(`"I'm your Homework Helper"`));
    assert.doesNotMatch(d + renderTeacherPersonaBlock(t), /your Your/i);
  });

  test('the whole system prompt for a role persona never tells the tutor to go by "Homework"', () => {
    const prompt = buildSystemPrompt({ module: null, sessionGoal: 'homework-help', teacherPersona: HOMEWORK_HELPER });
    assert.match(prompt, /## Teacher Identity/);
    assert.doesNotMatch(prompt, /Go by "Homework"/);
    assert.ok(prompt.includes('Role: Homework Helper'));
  });

  test('explicit nameIsRole: true gives a personal-looking name the role treatment', () => {
    const t: TeacherPersonaWire = { id: 'x', name: 'Sunny', intro: 'Hi.', nameIsRole: true };
    assert.ok(renderTeacherIntroDirective(t, { firstTurnV2: true }).includes(`"I'm your Sunny"`));
    assert.doesNotMatch(renderTeacherPersonaBlock(t), /Go by "/);
  });

  // ── neutrality: personal-name personas are byte-identical to before ───────
  test('every house and academy persona keeps the first-name directive byte for byte (v1 and v2)', () => {
    for (const t of PERSONAL) {
      assert.equal(renderTeacherIntroDirective(t), legacyDirective(t, false), `${t.name} v1`);
      assert.equal(renderTeacherIntroDirective(t, { firstTurnV2: false }), legacyDirective(t, false), `${t.name} v1 explicit`);
      assert.equal(renderTeacherIntroDirective(t, { firstTurnV2: true }), legacyDirective(t, true), `${t.name} v2`);
    }
  });

  test('every house and academy persona keeps the Name / Go-by lines and the bounds clause', () => {
    for (const t of PERSONAL) {
      const lines = renderTeacherPersonaBlock(t).split('\n');
      assert.equal(lines[2], `Name: ${t.name}`, t.name);
      assert.equal(lines[3], `Go by "${teacherFirstName(t.name)}" when saying your own name — never use an honorific with it.`, t.name);
      assert.equal(lines[lines.length - 2], TEACHER_IDENTITY_BOUNDS_CLAUSE.replace('{name}', t.name), t.name);
      assert.doesNotMatch(lines.join('\n'), /role, not a personal name/, t.name);
    }
  });

  test('spot checks: the names the students hear today', () => {
    assert.match(renderTeacherIntroDirective(ACADEMY_TEACHERS[2], { firstTurnV2: true }), /^Introduce yourself simply as Kiara in your first turn/);
    assert.match(renderTeacherIntroDirective(DEMO_TEACHERS[0], { firstTurnV2: true }), /^Introduce yourself simply as Elena in your first turn/);
    // "Coach Riley" is introduced as before this change (unchanged on purpose).
    assert.equal(
      renderTeacherIntroDirective(ACADEMY_TEACHERS[7], { firstTurnV2: true }),
      legacyDirective(ACADEMY_TEACHERS[7], true),
    );
  });

  test('style reminder is unaffected by the role treatment', () => {
    const styled: TeacherPersonaWire = { ...HOMEWORK_HELPER, style: { pace: 'gentle', catchphrases: ['One step at a time'] } };
    const personal: TeacherPersonaWire = { ...styled, name: 'Ms. Kiara' };
    assert.equal(
      renderTeacherStyleReminder(styled, { brainTurnIndex: 0 }),
      renderTeacherStyleReminder(personal, { brainTurnIndex: 0 })!.replace('Ms. Kiara', 'Homework Helper'),
    );
  });

  console.log(`\n${passed}/${passed + failed} passed`);
  process.exit(failed ? 1 : 0);
}
main();
