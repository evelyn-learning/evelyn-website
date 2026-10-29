/**
 * Working level (GDI trial, 2026-10-28): the tutor checks the learner's level
 * ONCE, adapts the lesson to it, and remembers it for the learner's next
 * lesson. This suite pins:
 *   - the pure module (lib/tutor/level/working-level.ts): parsing, the
 *     once-only decision, the per-level prompt clause, the profile update;
 *   - the tool: defined OUTSIDE the shared catalogue (so a session without
 *     `levelCheck` has a byte-identical tools array), mapped to a command,
 *     evidence kept in any script;
 *   - the wiring: offered only when the partner has `levelCheck` AND the
 *     TUTOR_WORKING_LEVEL kill switch is on; the clause lands right after
 *     the bilingual clause; the profile route persists the level.
 *
 * Run: npx tsx scripts/test-working-level.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  WORKING_LEVELS, parseWorkingLevel, buildWorkingLevelClause, applyWorkingLevel, decideSetWorkingLevel,
} from '../src/lib/tutor/level/working-level';
import { emptyProfile } from '../src/lib/tutor/student-profile/store';
import { WHITEBOARD_TOOLS, SET_WORKING_LEVEL_TOOL, mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';
import { buildSystemPromptParts } from '../src/lib/tutor/ai/system-prompt-builder';
import { NON_RENDER_TOOL_NAMES } from '../src/lib/tutor/voice/rule8-client';
import { isBoardContentTool } from '../src/lib/tutor/voice/question-anchor';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
/** Source pin without dumping the whole file on a miss. */
const pin = (src: string, re: RegExp) => assert.ok(re.test(src), `missing ${re}`);

// ── parseWorkingLevel ────────────────────────────────────────────────────
test('levels are exactly beginner / intermediate / advanced', () => {
  assert.deepEqual([...WORKING_LEVELS], ['beginner', 'intermediate', 'advanced']);
});
test('parseWorkingLevel trims and lower-cases a valid level', () => {
  assert.equal(parseWorkingLevel('Intermediate '), 'intermediate');
  assert.equal(parseWorkingLevel('ADVANCED'), 'advanced');
  assert.equal(parseWorkingLevel('beginner'), 'beginner');
});
test('parseWorkingLevel rejects anything else (CEFR codes, non-strings)', () => {
  assert.equal(parseWorkingLevel('B1'), null);
  assert.equal(parseWorkingLevel(''), null);
  assert.equal(parseWorkingLevel(undefined), null);
  assert.equal(parseWorkingLevel(2), null);
  assert.equal(parseWorkingLevel({ level: 'beginner' }), null);
});

// ── decideSetWorkingLevel (the handler's pure part) ──────────────────────
test('first valid call sets the level and asks for one soft line', () => {
  const d = decideSetWorkingLevel(null, 'Intermediate');
  assert.equal(d.ok, true);
  assert.equal(d.level, 'intermediate');
  assert.match(d.note ?? '', /one line/i);
});
test('a second call is refused and the level is not changed', () => {
  const d = decideSetWorkingLevel('beginner', 'advanced');
  assert.equal(d.ok, false);
  assert.equal(d.level, undefined);
  assert.equal(d.note, 'Level already set this session; do not re-test.');
});
test('a level known from a previous lesson counts as already set', () => {
  // The session starts from the stored level, so `current` is non-null.
  const d = decideSetWorkingLevel('advanced', 'advanced');
  assert.equal(d.ok, false);
  assert.equal(d.note, 'Level already set this session; do not re-test.');
});
test('a bad value is refused with a note naming the three levels', () => {
  const d = decideSetWorkingLevel(null, 'B2');
  assert.equal(d.ok, false);
  assert.equal(d.level, undefined);
  assert.match(d.note ?? '', /beginner.*intermediate.*advanced/);
});

// ── buildWorkingLevelClause ──────────────────────────────────────────────
const jaNew = (l: 'beginner' | 'intermediate' | 'advanced') => buildWorkingLevelClause(l, { secondLanguage: 'Japanese', known: false });
test('beginner: explanations AND corrections in the second language; English for target phrases', () => {
  const c = jaNew('beginner');
  assert.match(c, /explanations[^.]*corrections[^.]*in Japanese/i);
  assert.match(c, /English only for the (target )?phrases/i);
});
test('just set: announce softly once, never re-test, no score or CEFR', () => {
  const c = jaNew('beginner');
  assert.match(c, /only once/i);
  assert.match(c, /one (short )?line/i);
  assert.match(c, /never check the level again/i);
  assert.match(c, /CEFR/);
});
test('intermediate: conversation in English, corrections explained in the second language', () => {
  const c = jaNew('intermediate');
  assert.match(c, /conversation in English/i);
  assert.match(c, /correct[^.]*explain[^.]*in Japanese/i);
});
test('advanced: English throughout, the second language only on request', () => {
  const c = jaNew('advanced');
  assert.match(c, /English throughout/i);
  assert.match(c, /Japanese only when the learner asks/i);
});
test('each level teaches only its own marked variant', () => {
  for (const l of WORKING_LEVELS) {
    const c = jaNew(l);
    assert.ok(c.includes(`teach only the one marked [${l}]`), l);
  }
});
test('the three levels set different difficulty and support', () => {
  const [b, i, a] = WORKING_LEVELS.map(jaNew);
  assert.notEqual(b, i); assert.notEqual(i, a); assert.notEqual(b, a);
  for (const c of [b, i, a]) { assert.match(c, /Questions:/); assert.match(c, /Support:/); }
});
test('known from a previous lesson: one continuation line, the check is skipped', () => {
  const c = buildWorkingLevelClause('intermediate', { secondLanguage: 'Japanese', known: true });
  assert.match(c, /continue/i);
  assert.match(c, /previous lesson/i);
  assert.match(c, /no level check/i);
  assert.match(c, /never check the level again/i);
  assert.ok(!/only once, softly/i.test(c), 'no fresh announcement');
});
test('no second language: difficulty and support only, no other language named', () => {
  for (const l of WORKING_LEVELS) {
    const c = buildWorkingLevelClause(l, { known: false });
    assert.ok(!/Japanese|second language|undefined/i.test(c), c);
    assert.match(c, /Questions:/);
    assert.match(c, /Support:/);
  }
});
test('the clause is generic: no lesson, sound or partner names', () => {
  for (const l of WORKING_LEVELS) for (const known of [true, false]) {
    const c = buildWorkingLevelClause(l, { secondLanguage: 'Japanese', known });
    assert.ok(!/present perfect|past simple|\bth\b|b\/v|katakana|GDI|tool|segment/i.test(c), c);
  }
});

// ── applyWorkingLevel ────────────────────────────────────────────────────
test('applyWorkingLevel stores {level, planId, setAt} without mutating the input', () => {
  const p = emptyProfile('p1');
  const next = applyWorkingLevel(p, { level: 'beginner', planId: 'plan.a', at: 1000 });
  assert.deepEqual(next.workingLevel, { level: 'beginner', planId: 'plan.a', setAt: 1000 });
  assert.equal(p.workingLevel, undefined);
  assert.deepEqual(next.mastery, p.mastery);
});
test('applyWorkingLevel is idempotent on the same level (keeps the first setAt)', () => {
  const once = applyWorkingLevel(emptyProfile('p1'), { level: 'intermediate', planId: 'plan.a', at: 1000 });
  const twice = applyWorkingLevel(once, { level: 'intermediate', planId: 'plan.a', at: 5000 });
  assert.equal(twice, once);
});
test('applyWorkingLevel replaces a different level', () => {
  const once = applyWorkingLevel(emptyProfile('p1'), { level: 'intermediate', planId: 'plan.a', at: 1000 });
  const next = applyWorkingLevel(once, { level: 'advanced', planId: 'plan.a', at: 5000 });
  assert.deepEqual(next.workingLevel, { level: 'advanced', planId: 'plan.a', setAt: 5000 });
});

// ── tool ─────────────────────────────────────────────────────────────────
test('set_working_level is defined outside the shared catalogue', () => {
  assert.equal(SET_WORKING_LEVEL_TOOL.name, 'set_working_level');
  assert.ok(!WHITEBOARD_TOOLS.some((t) => t.name === 'set_working_level'));
  const props = SET_WORKING_LEVEL_TOOL.parameters.properties as Record<string, { enum?: string[] }>;
  assert.deepEqual(props.level.enum, ['beginner', 'intermediate', 'advanced']);
  assert.deepEqual([...(SET_WORKING_LEVEL_TOOL.parameters.required ?? [])].sort(), ['evidence', 'level']);
});
test('the call maps to a setWorkingLevel command; evidence in Japanese is kept', () => {
  const cmd = mapFunctionCallToCommand('set_working_level', { level: 'beginner', evidence: '三つの質問に日本語で答えました。' }) as unknown as { action: string; level: unknown; evidence: string };
  assert.equal(cmd.action, 'setWorkingLevel');
  assert.equal(cmd.level, 'beginner');
  assert.equal(cmd.evidence, '三つの質問に日本語で答えました。');
});
test('the tool never paints: no Rule 8 repair, not a board-content tool', () => {
  assert.ok(NON_RENDER_TOOL_NAMES.has('set_working_level'));
  assert.equal(isBoardContentTool('set_working_level'), false);
});

// ── prompt builder ───────────────────────────────────────────────────────
const baseCtx = { subject: 'English', topic: 'Work', tutorLanguages: ['en', 'ja'] };
test('prompt: clause sits right after the bilingual clause, with the second language named', () => {
  const { session } = buildSystemPromptParts({ ...baseCtx, workingLevel: { level: 'beginner', known: false } });
  const bi = session.indexOf('## Session languages');
  const wl = session.indexOf('## Working level');
  assert.ok(bi >= 0 && wl > bi, 'after bilingual');
  assert.ok(session.includes(buildWorkingLevelClause('beginner', { secondLanguage: 'Japanese', known: false })));
});
test('prompt: no workingLevel ⇒ byte-identical session block', () => {
  const a = buildSystemPromptParts(baseCtx);
  const b = buildSystemPromptParts({ ...baseCtx, workingLevel: undefined });
  assert.equal(a.session, b.session);
  assert.ok(!a.session.includes('## Working level'));
});
test('prompt: English-only session gets the clause without another language', () => {
  const { session } = buildSystemPromptParts({ subject: 'English', workingLevel: { level: 'advanced', known: true } });
  assert.ok(session.includes(buildWorkingLevelClause('advanced', { known: true })));
});

// ── wiring (source pins) ─────────────────────────────────────────────────
const route = read('src/app/api/tutor/brain/stream/route.ts');
const vtr = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
const embed = read('src/app/tutor-portal/embed/page.tsx');
const session = read('src/app/tutor/components/session/TutorSession.tsx');
const profileRoute = read('src/app/api/tutor/student-profile/[id]/route.ts');
const model = read('src/models/StudentProfile.ts');
test('route: tool appended only for body.levelCheck under TUTOR_WORKING_LEVEL, after Lever A', () => {
  pin(route, /body\.levelCheck === true && TUTOR_WORKING_LEVEL/);
  pin(route, /SET_WORKING_LEVEL_TOOL\]/);
  assert.ok(route.indexOf('SET_WORKING_LEVEL_TOOL]') > route.indexOf('filterToolsForSubject('));
});
test('runtime: levelCheck gated by the kill switch; body, prompt and RT-2 tools use the gate', () => {
  pin(vtr, /const levelCheckActive = TUTOR_WORKING_LEVEL && levelCheck;/);
  pin(vtr, /levelCheck: levelCheckActive \? true : undefined/);
  pin(vtr, /levelCheckActive && workingLevelForPrompt \? \{ workingLevel: workingLevelForPrompt \}/);
  pin(vtr, /levelCheckActive \? \[\.\.\.rt2Filtered, SET_WORKING_LEVEL_TOOL\]/);
});
test('runtime: handler uses decideSetWorkingLevel and the stored level starts known', () => {
  pin(vtr, /decideSetWorkingLevel\(workingLevelRef\.current\?\.level \?\? null/);
  pin(vtr, /parseWorkingLevel\(data\?\.profile\?\.workingLevel\?\.level\)/);
  pin(vtr, /known: true/);
  assert.ok(vtr.includes("'setWorkingLevel'"), 'consumed as a meta action');
});
test('surfaces: embed resolves levelCheck from the partner row and TutorSession forwards it', () => {
  pin(embed, /levelCheck=\{sessionOptions\.levelCheck\}/);
  pin(session, /levelCheck=\{levelCheck\}/);
});
test('persistence: profile route applies the level; model keeps the field', () => {
  pin(profileRoute, /applyWorkingLevel\(profile/);
  pin(profileRoute, /parseWorkingLevel\(body\.workingLevel/);
  pin(model, /workingLevel: \{ type: Schema\.Types\.Mixed/);
  pin(model, /workingLevel: obj\.workingLevel/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
