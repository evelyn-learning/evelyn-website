/**
 * Unit test — teacher persona (engine side): wire shape, DEMO_TEACHERS
 * roster, renderTeacherPersonaBlock / renderTeacherIntroDirective, and the
 * buildSystemPrompt gating (absent teacherPersona ⇒ byte-identical prompt).
 * See src/lib/tutor/ai/teacher-persona.ts.
 *
 * Run: npx tsx scripts/test-teacher-persona.ts  (npm run test:pedagogy-teacher)
 * No framework — matches the test:opening-behavior / test:pedagogy-b4 pattern.
 */

import { strict as assert } from 'node:assert';
import {
  DEMO_TEACHERS,
  TEACHER_IDENTITY_BOUNDS_CLAUSE,
  renderTeacherPersonaBlock,
  renderTeacherIntroDirective,
  type TeacherPersonaWire,
} from '../src/lib/tutor/ai/teacher-persona';
import { buildSystemPrompt, type SystemPromptContext } from '../src/lib/tutor/ai/system-prompt-builder';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

/** The full OpenAIVoice union from src/app/tutor/hooks/useOpenAIRealtime.ts.
 *  Mirrored (not imported — that module is 'use client' React) so a voice
 *  drift in DEMO_TEACHERS fails HERE. */
const VALID_OPENAI_VOICES = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse'];

const FULL_PERSONA: TeacherPersonaWire = {
  id: 'test-full',
  name: 'Dr. Test Teacher',
  intro: 'A teacher with every field set, for render coverage.',
  bio: 'BIO-SENTINEL-MUST-NOT-RENDER — long portal-display profile text.',
  subjects: ['math'],
  levels: ['high-school'],
  style: {
    teaching: 'TEACHING-PROSE',
    pace: 'brisk',
    questioning: 'QUESTIONING-PROSE',
    encouragement: 'ENCOURAGEMENT-PROSE',
    humor: 'medium',
    catchphrases: ['CATCH-ONE', 'CATCH-TWO'],
    analogyDomains: ['DOMAIN-A', 'DOMAIN-B'],
    errorResponse: 'ERROR-RESPONSE-PROSE',
    formality: 'formal',
    boardHabits: 'BOARD-HABITS-PROSE',
  },
  voice: { provider: 'openai', voiceId: 'echo' },
  boundaries: 'BOUNDARIES-PROSE',
};

const MINIMAL_PERSONA: TeacherPersonaWire = {
  id: 'test-min',
  name: 'Mx. Minimal',
  intro: 'Only the required fields.',
};

function main() {
  console.log('Teacher persona — engine side\n');

  // ── renderTeacherPersonaBlock: full persona ─────────────────────────────
  test('full persona: renders <teacher_identity> with name, intro, and every present style field', () => {
    const block = renderTeacherPersonaBlock(FULL_PERSONA);
    assert.ok(block.startsWith('<teacher_identity>'), 'opens the tag');
    assert.ok(block.endsWith('</teacher_identity>'), 'closes the tag');
    assert.match(block, /Name: Dr\. Test Teacher/);
    assert.match(block, /A teacher with every field set/);
    assert.match(block, /Teaching style: TEACHING-PROSE/);
    assert.match(block, /Pace: brisk/);
    assert.match(block, /Questioning: QUESTIONING-PROSE/);
    assert.match(block, /Encouragement: ENCOURAGEMENT-PROSE/);
    assert.match(block, /Humor level: medium/);
    assert.match(block, /CATCH-ONE \/ CATCH-TWO/);
    assert.match(block, /DOMAIN-A \/ DOMAIN-B/);
    assert.match(block, /When the student makes an error: ERROR-RESPONSE-PROSE/);
    assert.match(block, /Formality: formal/);
    assert.match(block, /Board habits: BOARD-HABITS-PROSE/);
    assert.match(block, /Extra boundaries for you specifically: BOUNDARIES-PROSE/);
  });

  test('full persona: bio is NEVER rendered (portal display only)', () => {
    const block = renderTeacherPersonaBlock(FULL_PERSONA);
    assert.doesNotMatch(block, /BIO-SENTINEL/);
  });

  test('full persona: ends with the identity-bounds clause, name substituted', () => {
    const block = renderTeacherPersonaBlock(FULL_PERSONA);
    const expected = TEACHER_IDENTITY_BOUNDS_CLAUSE.replace('{name}', 'Dr. Test Teacher');
    assert.ok(block.includes(expected), 'bounds clause present with name substituted');
    assert.doesNotMatch(block, /\{name\}/, 'no raw placeholder leaks');
  });

  // ── renderTeacherPersonaBlock: minimal persona ──────────────────────────
  test('minimal persona: renders name + intro + bounds clause and SKIPS every absent field', () => {
    const block = renderTeacherPersonaBlock(MINIMAL_PERSONA);
    assert.match(block, /Name: Mx\. Minimal/);
    assert.match(block, /Only the required fields\./);
    assert.ok(block.includes(TEACHER_IDENTITY_BOUNDS_CLAUSE.replace('{name}', 'Mx. Minimal')));
    for (const label of [
      'Teaching style:', 'Pace:', 'Questioning:', 'Encouragement:', 'Humor level:',
      'Catchphrases', 'Analogy domains', 'When the student makes an error:',
      'Formality:', 'Board habits:', 'Extra boundaries',
    ]) {
      assert.ok(!block.includes(label), `absent field "${label}" must not render`);
    }
  });

  test('partial style: only the present fields render (empty arrays skipped too)', () => {
    const block = renderTeacherPersonaBlock({
      ...MINIMAL_PERSONA,
      style: { pace: 'gentle', catchphrases: [] },
    });
    assert.match(block, /Pace: gentle/);
    assert.ok(!block.includes('Catchphrases'), 'empty catchphrases array skipped');
    assert.ok(!block.includes('Teaching style:'), 'absent teaching prose skipped');
  });

  // ── identity-bounds clause content ──────────────────────────────────────
  test('bounds clause: carries every load-bearing element of the identity contract', () => {
    const c = TEACHER_IDENTITY_BOUNDS_CLAUSE;
    assert.match(c, /stay this one person for the whole session/);
    assert.match(c, /nothing about the academy's other teachers, staffing, hiring, or pricing/);
    assert.match(c, /respond warmly and briefly/);
    assert.match(c, /site\/portal lists all available teachers/);
    assert.match(c, /without inventing ANY facts/);
    assert.match(c, /Never break character/);
    assert.match(c, /never\s+mention being configured or having a 'persona'/);
    assert.match(c, /demo session shows what great\s+teaching feels like/);
    assert.match(c, /enrolled session teaches the course as well as it can be taught/);
  });

  // ── renderTeacherIntroDirective ─────────────────────────────────────────
  test('intro directive: one sentence naming the teacher, weaving the intro, banning resume recitation', () => {
    const d = renderTeacherIntroDirective(FULL_PERSONA);
    assert.match(d, /Introduce yourself naturally as Dr\. Test Teacher in your first turn/);
    assert.ok(d.includes(FULL_PERSONA.intro), 'compressed identity source = the intro text');
    assert.match(d, /never a resume recitation/);
    assert.match(d, /then get into the opener\.$/);
  });

  // ── buildSystemPrompt gating ────────────────────────────────────────────
  test('buildSystemPrompt: absent teacherPersona ⇒ byte-identical to a context with no new field at all', () => {
    const legacyCtx: SystemPromptContext = { module: null, studentName: 'Ravi', sessionGoal: 'general' };
    const withUnset: SystemPromptContext = { ...legacyCtx, teacherPersona: undefined };
    const a = buildSystemPrompt(legacyCtx);
    const b = buildSystemPrompt(withUnset);
    assert.equal(a, b, 'prompt must be byte-identical when teacherPersona is absent/undefined');
    assert.doesNotMatch(a, /<teacher_identity>/);
    assert.doesNotMatch(a, /## Teacher Identity/);
  });

  test('buildSystemPrompt: present teacherPersona ⇒ appends the ## Teacher Identity block with the rendered persona', () => {
    const ctx: SystemPromptContext = {
      module: null,
      studentName: 'Ravi',
      sessionGoal: 'general',
      teacherPersona: FULL_PERSONA,
    };
    const prompt = buildSystemPrompt(ctx);
    assert.match(prompt, /## Teacher Identity/);
    assert.ok(prompt.includes(renderTeacherPersonaBlock(FULL_PERSONA)), 'block rendered verbatim');
    // And it composes additively with the base prompt (base content intact).
    const base = buildSystemPrompt({ module: null, studentName: 'Ravi', sessionGoal: 'general' });
    assert.ok(prompt.startsWith(base), 'teacher block is appended AFTER the unchanged base prompt');
  });

  test('buildSystemPrompt: teacher block composes with the opener/self-report clauses (all three present)', () => {
    const prompt = buildSystemPrompt({
      module: null,
      studentName: 'Ravi',
      sessionGoal: 'general',
      sessionMode: 'demo',
      openingPhase: true,
      entryMode: 'button',
      selfReportRouting: true,
      teacherPersona: MINIMAL_PERSONA,
    });
    assert.match(prompt, /This Turn: Session Opener/);
    assert.match(prompt, /## Self-Report Routing/);
    assert.match(prompt, /## Teacher Identity/);
  });

  // ── DEMO_TEACHERS roster ────────────────────────────────────────────────
  test('DEMO_TEACHERS: exactly 4 entries', () => {
    assert.equal(DEMO_TEACHERS.length, 4);
  });

  test('DEMO_TEACHERS: unique ids, unique names, unique voices', () => {
    const ids = DEMO_TEACHERS.map((t) => t.id);
    const names = DEMO_TEACHERS.map((t) => t.name);
    const voices = DEMO_TEACHERS.map((t) => t.voice?.voiceId);
    assert.equal(new Set(ids).size, 4, `ids unique: ${ids.join(', ')}`);
    assert.equal(new Set(names).size, 4, `names unique: ${names.join(', ')}`);
    assert.equal(new Set(voices).size, 4, `voices unique: ${voices.join(', ')}`);
  });

  test('DEMO_TEACHERS: every voice is a valid OpenAI Realtime voice id (provider openai)', () => {
    for (const t of DEMO_TEACHERS) {
      assert.ok(t.voice, `${t.id} has a voice`);
      assert.equal(t.voice!.provider, 'openai', `${t.id} uses the openai provider`);
      assert.ok(
        VALID_OPENAI_VOICES.includes(t.voice!.voiceId),
        `${t.id} voice "${t.voice!.voiceId}" ∈ [${VALID_OPENAI_VOICES.join(', ')}]`,
      );
    }
  });

  test('DEMO_TEACHERS: every intro is non-empty and ≤ 200 chars', () => {
    for (const t of DEMO_TEACHERS) {
      assert.ok(t.intro.trim().length > 0, `${t.id} intro non-empty`);
      assert.ok(t.intro.length <= 200, `${t.id} intro is ${t.intro.length} chars (max 200)`);
    }
  });

  test('DEMO_TEACHERS: names carry varied address forms (Ms./Mr./Dr. + one first-name-casual)', () => {
    const names = DEMO_TEACHERS.map((t) => t.name);
    assert.ok(names.some((n) => n.startsWith('Ms. ')), 'a Ms.');
    assert.ok(names.some((n) => n.startsWith('Mr. ')), 'a Mr.');
    assert.ok(names.some((n) => n.startsWith('Dr. ')), 'a Dr.');
    assert.ok(names.some((n) => !/^(Ms|Mr|Dr|Mrs|Mx)\./.test(n)), 'one first-name-casual (no honorific)');
  });

  test('DEMO_TEACHERS: four distinct style archetypes (pace/humor spread) and broad subjects', () => {
    const paces = DEMO_TEACHERS.map((t) => t.style?.pace);
    assert.ok(paces.includes('gentle'), 'a gentle-paced teacher');
    assert.ok(paces.includes('brisk'), 'a brisk-paced teacher');
    assert.ok(paces.includes('moderate'), 'a moderate-paced teacher');
    const humors = DEMO_TEACHERS.map((t) => t.style?.humor);
    assert.ok(humors.includes('off') && humors.includes('medium'), 'humor spans off → medium');
    for (const t of DEMO_TEACHERS) {
      assert.ok((t.subjects ?? []).includes('math') || (t.subjects ?? []).includes('science'),
        `${t.id} covers math and/or science (any demo topic must work)`);
      assert.ok(t.style?.teaching && t.style.teaching.length > 0, `${t.id} has teaching prose`);
    }
  });

  test('DEMO_TEACHERS: intros stay generic about curricula (no specific-course claims)', () => {
    for (const t of DEMO_TEACHERS) {
      assert.doesNotMatch(t.intro, /\b(AP|IB|SAT|GCSE|JEE|NEET|Common Core)\b/,
        `${t.id} intro must not claim a specific curriculum`);
    }
  });

  test('DEMO_TEACHERS: every persona renders cleanly (block + directive, bounds clause present)', () => {
    for (const t of DEMO_TEACHERS) {
      const block = renderTeacherPersonaBlock(t);
      assert.ok(block.includes(TEACHER_IDENTITY_BOUNDS_CLAUSE.replace('{name}', t.name)), `${t.id} bounds clause`);
      assert.ok(renderTeacherIntroDirective(t).includes(t.name), `${t.id} directive names the teacher`);
    }
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
