/**
 * usableStudentName — the one rule for "is this a name a tutor may say?".
 *
 * Defect this pins (GreenApple app walk 2026-10-05, M1): a launch-link
 * student's display name is the partner's pseudonymous id, so the tutor said
 * "-walk-20261005-8! Exactly right." An id, an e-mail, or a placeholder
 * ("Student") must behave exactly like NO name on every surface that speaks
 * or prompts with one: the system prompt, the three opener clauses, the fixed
 * bridge line and the TTS name rules. Real names are untouched.
 *
 * Run: npx tsx scripts/test-usable-student-name.ts  (npm run test:usable-student-name)
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { usableStudentName, studentFirstName } from '../src/lib/tutor/student-name';
import {
  buildSystemPrompt,
  buildOpenerClause,
  buildHomeworkOpenerClause,
  buildInFlowOpenerClause,
  type SystemPromptContext,
} from '../src/lib/tutor/ai/system-prompt-builder';
import { bridgeLineFor } from '../src/lib/tutor/voice/bridge-line';
import { rewriteForTTS } from '../src/lib/tutor/voice/tts-pronunciation';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

/** Names a tutor may say. Returned trimmed, otherwise unchanged. */
const REAL: Array<[raw: string, expected?: string]> = [
  ['Maya'], ['Ayaan'], ['Li'], ['Bo'], ['Ng'], ['Na'], ['José'], ['Zoë'], ['Søren'], ['Łukasz'], ['Nguyễn'],
  ['Anne-Marie'], ['Jean-Pierre'], ["O'Neil"], ['D’Angelo'], ['Maya Chen'], ['Mary Jane'], ['María José'],
  ['Juan Carlos de la Cruz'], ['J.R.'], ['Martin Jr.'], ['MAYA'], ['maya'], ['baby'], ['Will'], ['Stu'], ['Guest Smith'],
  ['Stuart'], ['Deb'], ['Ada'], ['Abe'], ['Fae'], ['Bea'], ['Dee'], ['Ed'], ['Test Teacher'],
  ['李'], ['李雷'], ['Олег'], ['محمد'], ['प्रिया'], ['Αλέξης'],
  ['  Maya  ', 'Maya'], ['Maya   Chen', 'Maya Chen'],
];

/** Not names: absent, placeholders, ids, e-mails, anything with digits or id punctuation. */
const NOT_NAMES: unknown[] = [
  undefined, null, '', '   ', 42, {}, [],
  // placeholders
  'Student', 'student', 'STUDENT', 'Unknown', 'unknown', 'Anonymous', 'Guest', 'User', 'Learner', 'Trial student',
  'Demo Student', 'Test user', 'Test', 'N/A', 'n/a', 'none', 'null', 'undefined', 'Name', 'Your name', 'First name',
  'New student', 'The student',
  // partner ids (the reported ones first)
  'gac-walk-20261005-8', 'stu-4471', 'stu-001', 'gac-test-003', 'gac-tutor-20261005-algebra', 'student_17', 'user42',
  'S12345', '4471', 'a1b2c3', 'Maya2', 'maya_chen', 'maya.chen@example.com', 'maya@school', 'id:maya', 'maya/chen',
  '550e8400-e29b-41d4-a716-446655440000', 'deadbeefcafe', 'abcdefab', 'portal-abc-def', 'gac-walk-abc', 'stu-abc',
  'user-maya', 'id-x', '-walk', '-Maya', "'Maya", '...', '---', '!!', '#1', 'Maya!', 'Maya (period 3)', 'Maya, Chen',
  'x'.repeat(41),
];

function main() {
  console.log('usableStudentName');

  test('real names pass, trimmed and otherwise unchanged', () => {
    for (const [raw, expected] of REAL) {
      assert.equal(usableStudentName(raw), expected ?? raw, `expected ${JSON.stringify(raw)} to be usable`);
    }
  });

  test('absent, placeholder and id-shaped values are not names', () => {
    for (const raw of NOT_NAMES) {
      assert.equal(usableStudentName(raw as string), undefined, `expected ${JSON.stringify(raw)} to be rejected`);
    }
  });

  test('studentFirstName is the first word of a usable name', () => {
    assert.equal(studentFirstName('Maya Chen'), 'Maya');
    assert.equal(studentFirstName('Anne-Marie Dupont'), 'Anne-Marie');
    assert.equal(studentFirstName('stu-4471'), undefined);
    assert.equal(studentFirstName(undefined), undefined);
  });

  // ── every consumer: an unusable name behaves EXACTLY like no name ─────────
  const IDS = ['gac-walk-20261005-8', 'stu-4471', 'Student', 'Unknown', 'maya@example.com'];
  const base: SystemPromptContext = { module: null, sessionGoal: 'general', subject: 'math', topic: 'linear equations', level: 'grade 8' };

  test('system prompt: an id-shaped name yields the no-name prompt, byte for byte', () => {
    const none = buildSystemPrompt({ ...base });
    for (const id of IDS) {
      const p = buildSystemPrompt({ ...base, studentName: id });
      assert.equal(p, none, `prompt for ${id} must equal the no-name prompt`);
      assert.ok(!p.includes(`Student Name: ${id}`), `prompt must not name the student ${id}`);
      assert.match(p, /Student Name: \(not provided/);
    }
    for (const id of IDS) {
      const opening = buildSystemPrompt({ ...base, openingPhase: true, studentName: id });
      assert.equal(opening, buildSystemPrompt({ ...base, openingPhase: true }));
    }
  });

  test('system prompt: a real name is still given to the tutor', () => {
    for (const [raw, expected] of REAL) {
      const p = buildSystemPrompt({ ...base, studentName: raw });
      assert.ok(p.includes(`Student Name: ${expected ?? raw}\n`), `prompt must carry the name ${raw}`);
    }
  });

  test('opener clauses: an id-shaped name yields the no-name clause; a real name keeps "by name"', () => {
    for (const id of IDS) {
      assert.equal(
        buildOpenerClause({ ...base, openingPhase: true, studentName: id }),
        buildOpenerClause({ ...base, openingPhase: true }),
      );
      assert.equal(
        buildHomeworkOpenerClause({ openingPhase: true, studentName: id }),
        buildHomeworkOpenerClause({ openingPhase: true }),
      );
      assert.equal(
        buildInFlowOpenerClause({ openingPhase: true, studentName: id, inputMode: 'voice' }),
        buildInFlowOpenerClause({ openingPhase: true, inputMode: 'voice' }),
      );
    }
    assert.match(buildOpenerClause({ ...base, openingPhase: true })!, /No student name is available/);
    assert.match(buildHomeworkOpenerClause({ openingPhase: true })!, /no student name is available/);
    assert.match(buildInFlowOpenerClause({ openingPhase: true, inputMode: 'voice' })!, /no name is available/);
    assert.doesNotMatch(buildOpenerClause({ ...base, openingPhase: true, studentName: 'Maya' })!, /No student name is available/);
    assert.match(buildHomeworkOpenerClause({ openingPhase: true, studentName: 'Maya' })!, /greeting the student by name/);
    assert.match(buildInFlowOpenerClause({ openingPhase: true, studentName: 'Maya', inputMode: 'voice' })!, /Greet the student by name/);
  });

  test('bridge line: never interpolates an id; real first name unchanged', () => {
    const v = { inFlow: false, inputMode: 'voice' as const, resume: false };
    for (const id of IDS) {
      assert.equal(bridgeLineFor({ ...v, studentName: id }), 'Hey. Let’s get started.');
      assert.equal(bridgeLineFor({ ...v, inFlow: true, title: 'Slope', studentName: id }), 'Hey. Slope — let’s look at it.');
    }
    assert.equal(bridgeLineFor({ ...v, studentName: 'Maya Chen' }), 'Hey Maya. Let’s get started.');
    assert.equal(bridgeLineFor({ ...v, studentName: 'Anne-Marie' }), 'Hey Anne-Marie. Let’s get started.');
    assert.equal(bridgeLineFor({ ...v, studentName: "O'Neil" }), "Hey O'Neil. Let’s get started.");
  });

  test('TTS rewrite: an id-shaped name is treated as no name; a real name keeps its vocative rule', () => {
    const line = 'Exactly right, stu-4471! Keep going.';
    assert.equal(rewriteForTTS(line, { studentName: 'stu-4471' }), rewriteForTTS(line));
    const real = 'Exactly right, maya! Keep going.';
    assert.notEqual(rewriteForTTS(real, { studentName: 'Maya' }), rewriteForTTS(real), 'known-name vocative comma rule still fires');
  });

  // ── the live runtime derives its name once, through the helper ────────────
  test('VoiceTutorRealtime takes the raw prop and uses only the usable name', () => {
    const src = readFileSync(join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
    assert.match(src, /studentName: rawStudentName,/, 'the prop is destructured under a raw name');
    assert.match(src, /const studentName = useMemo\(\(\) => usableStudentName\(rawStudentName\), \[rawStudentName\]\);/);
    assert.equal(src.split('rawStudentName').length - 1, 3, 'the raw value is read in exactly one place');
  });

  console.log(`\n${passed}/${passed + failed} passed`);
  process.exit(failed ? 1 : 0);
}
main();
