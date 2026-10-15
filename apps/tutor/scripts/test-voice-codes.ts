/**
 * Partner voice codes + persona shorthands in the embed token
 * (packages/core/src/voice/voice-codes.ts, lib/tutor/portal/embed-persona.ts),
 * the embed page wiring, and the real-people rule in the lesson context.
 *
 * Run: npm run test:voice-codes
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { VOICE_CODES, codeForVoiceId, isVoiceCode, voiceIdForCode } from '../../../packages/core/src/voice/voice-codes';
import { DEMO_TEACHERS } from '../../../packages/core/src/ai/teacher-persona';
import { resolveEmbedPersona } from '../src/lib/tutor/portal/embed-persona';
import { REAL_PEOPLE_CLAUSE, renderLessonContextBlock } from '../src/lib/tutor/embed/lesson-context';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

const REALTIME_NAMES = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse', 'marin', 'cedar'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

test('codes: unique, lowercase words, never a realtime voice name', () => {
  const codes = VOICE_CODES.map((v) => v.code);
  assert.equal(new Set(codes).size, codes.length, 'duplicate code');
  for (const c of codes) {
    assert.match(c, /^[a-z]+$/, c);
    assert.ok(!REALTIME_NAMES.includes(c), `${c} collides with a realtime voice name`);
  }
});

test('codes: every voice id is a full id, used once', () => {
  const ids = VOICE_CODES.map((v) => v.voiceId);
  for (const id of ids) assert.match(id, UUID, id);
  assert.equal(new Set(ids).size, ids.length, 'two codes share a voice');
});

test('codes: every house persona voice has a teacher code', () => {
  for (const t of DEMO_TEACHERS) {
    const code = codeForVoiceId(t.voice!.voiceId);
    assert.ok(code, `${t.id} has no code`);
    assert.equal(VOICE_CODES.find((v) => v.code === code)!.group, 'teacher', t.id);
  }
});

test('codes: lookups are case/space tolerant; unknown → null', () => {
  assert.equal(voiceIdForCode('  Maple '), VOICE_CODES.find((v) => v.code === 'maple')!.voiceId);
  assert.equal(isVoiceCode('MAPLE'), true);
  assert.equal(isVoiceCode('coral'), false);
  assert.equal(isVoiceCode(42), false);
  assert.equal(voiceIdForCode('nope'), null);
});

test('codes: the gallery text never names the provider', () => {
  for (const v of VOICE_CODES) assert.ok(!/cartesia|sonic/i.test(`${v.description} ${v.tags.join(' ')}`), v.code);
});

test('persona: a catalogue id resolves to the house persona', () => {
  const r = resolveEmbedPersona({ teacher: 'ms-priya-nair' });
  assert.equal(r.teacher?.id, 'ms-priya-nair');
  assert.equal(r.teacher?.voice?.voiceId, DEMO_TEACHERS.find((t) => t.id === 'ms-priya-nair')!.voice!.voiceId);
  assert.equal(resolveEmbedPersona({ teacher: ' MS-PRIYA-NAIR ' }).teacher?.id, 'ms-priya-nair');
});

test('persona: an unknown id is no persona, noted (never a throw)', () => {
  const r = resolveEmbedPersona({ teacher: 'coach-nobody' });
  assert.equal(r.teacher, undefined);
  assert.ok(r.notes.some((n) => n.startsWith('teacher_unknown=')));
});

test('persona: a custom persona with a voice code gets that voice', () => {
  const r = resolveEmbedPersona({ teacher: { id: 'coach-blaze', name: 'Coach Blaze', intro: 'Pit lane is open.', voice: 'turbo' } });
  assert.equal(r.teacher?.name, 'Coach Blaze');
  assert.deepEqual(r.teacher?.voice, { provider: 'cartesia', voiceId: voiceIdForCode('turbo') });
});

test('persona: a custom persona with an unknown voice code keeps the persona, drops the voice', () => {
  const r = resolveEmbedPersona({ teacher: { id: 'c', name: 'C', intro: 'i', voice: 'nope' } });
  assert.equal(r.teacher?.name, 'C');
  assert.equal(r.teacher?.voice, undefined);
  assert.ok(r.notes.some((n) => n.startsWith('teacher_voice_unknown=')));
});

test('persona: the old {provider, voiceId} shape is untouched', () => {
  const t = { id: 'x', name: 'X', intro: 'i', voice: { provider: 'cartesia' as const, voiceId: 'bf0a246a-8642-498a-9950-80c35e9276b5' } };
  assert.deepEqual(resolveEmbedPersona({ teacher: t }).teacher, t);
});

test('voice: a top-level code overrides the persona voice; a realtime name does not', () => {
  const r = resolveEmbedPersona({ teacher: 'ms-priya-nair', voice: 'stadium' });
  assert.equal(r.teacher?.id, 'ms-priya-nair');
  assert.equal(r.voiceOverrideId, voiceIdForCode('stadium'));
  assert.equal(resolveEmbedPersona({ voice: 'coral' }).voiceOverrideId, undefined);
  assert.equal(resolveEmbedPersona({ voice: 'pixel' }).voiceOverrideId, voiceIdForCode('pixel'), 'a voice without a persona');
});

const embed = readFileSync(join(__dirname, '../src/app/tutor-portal/embed/page.tsx'), 'utf8');
test('embed: the resolved persona is used everywhere, never the raw token field', () => {
  assert.match(embed, /resolveEmbedPersona\(\{ teacher: config\.teacher, voice: config\.voice \}\)/);
  assert.ok(!/config\.teacher\?\.|config\.teacher\.|teacherPersona=\{config\.teacher\}/.test(embed), 'raw config.teacher read');
  assert.match(embed, /teacherPersona=\{teacher\}/);
  assert.match(embed, /\? \(voiceOverrideId \?\? teacherVoice\?\.voiceId\)/);
  assert.match(embed, /!teacherVoice && !voiceOverrideId/);
  assert.match(embed, /isVoiceCode\(config\.voice\) \? undefined : \(config\.voice as OpenAIVoice \| undefined\)/, 'a code is never sent as a realtime voice');
  assert.match(embed, /addDebugEvent\('persona_resolved'/);
  assert.match(embed, /'persona_',/);
});

test('real people: the lesson-context block carries the rule, generically', () => {
  const blk = renderLessonContextBlock({ title: 'A deal', characters: ['Someone'] });
  assert.ok(blk.includes(REAL_PEOPLE_CLAUSE));
  assert.match(REAL_PEOPLE_CLAUSE, /never one of them/);
  assert.match(REAL_PEOPLE_CLAUSE, /do not invent anything they said/);
  assert.ok(!/scrub|shark|sonic|mario|gameclass/i.test(REAL_PEOPLE_CLAUSE));
  assert.equal(renderLessonContextBlock({}), '', 'no context, no rule');
});

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
