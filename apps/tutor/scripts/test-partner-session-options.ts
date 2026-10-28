/**
 * Partner session options + the bilingual gate's INVARIANCE promise.
 *
 * 2026-10-27 GDI → main merge: the bilingual branch changed turn-taking for
 * every tenant. Praveen's decisions keep most of it global, but three
 * mechanisms are gated, and this suite pins the gate so a session WITHOUT a
 * non-Latin tutor language behaves exactly as main did before the merge:
 *   - Ink 2 turn-end timeout: 5600 ms (main) unless the session is bilingual
 *     (3000 ms) — lib/tutor/voice/ink-turn-end.ts.
 *   - Opener prefetch (a brain call per page load): per partner, default on
 *     for bilingual sessions only — lib/tutor/portal/partner-session-options.ts.
 *   - Post-close auto-end: per partner, default on (global decision), a
 *     partner row can turn it off.
 * It also pins the wiring: the runtime honours the two props, the hook's
 * default is the English-only timeout, the embed page resolves the options
 * from the token's partner_id, and the retail surfaces pass neither prop
 * (so they get the defaults).
 *
 * Run: npx tsx scripts/test-partner-session-options.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  PARTNER_SESSION_DEFAULTS, defaultPartnerSessionOptions, resolvePartnerSessionOptions,
} from '../src/lib/tutor/portal/partner-session-options';
import {
  INK_TURN_END_TIMEOUT_MS, INK_TURN_END_TIMEOUT_MS_BILINGUAL, inkTurnEndTimeoutMs,
} from '../src/lib/tutor/voice/ink-turn-end';
import { sessionAllowsNonLatin } from '../src/lib/tutor/voice/transcript-filters';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}
const src = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');

console.log('Invariance: a session without a non-Latin language = main behaviour');

test('the gate keys on languages, not subject or partner', () => {
  assert.equal(sessionAllowsNonLatin(undefined), false);
  assert.equal(sessionAllowsNonLatin([]), false);
  assert.equal(sessionAllowsNonLatin(['en']), false);
  assert.equal(sessionAllowsNonLatin(['en', 'es']), false, 'a Latin-script second language is not the bilingual gate');
  assert.equal(sessionAllowsNonLatin(['en', 'ja']), true);
  assert.equal(sessionAllowsNonLatin(['ja']), true);
});

test('Ink turn-end timeout: 5600 ms without languages (main), 3000 ms bilingual', () => {
  assert.equal(INK_TURN_END_TIMEOUT_MS, 5600, 'the Phase-1-verified value main shipped with');
  assert.equal(INK_TURN_END_TIMEOUT_MS_BILINGUAL, 3000);
  assert.equal(inkTurnEndTimeoutMs(undefined, undefined), 5600);
  assert.equal(inkTurnEndTimeoutMs(['en'], undefined), 5600);
  assert.equal(inkTurnEndTimeoutMs(['en', 'es'], undefined), 5600);
  assert.equal(inkTurnEndTimeoutMs(['en', 'ja'], undefined), 3000);
});

test('NEXT_PUBLIC_TUTOR_INK_TURN_END_TIMEOUT_MS overrides both; junk is ignored', () => {
  assert.equal(inkTurnEndTimeoutMs(undefined, '4200'), 4200);
  assert.equal(inkTurnEndTimeoutMs(['en', 'ja'], '4200'), 4200);
  assert.equal(inkTurnEndTimeoutMs(undefined, ''), 5600);
  assert.equal(inkTurnEndTimeoutMs(['en', 'ja'], 'abc'), 3000);
  assert.equal(inkTurnEndTimeoutMs(undefined, '0'), 5600, 'zero is not a timeout');
  assert.equal(inkTurnEndTimeoutMs(undefined, '-5'), 5600);
});

test('engine defaults: no prefetch and auto-end on for an English-only session', () => {
  assert.deepEqual(defaultPartnerSessionOptions(undefined), { openerPrefetch: false, lessonCloseAutoEnd: true });
  assert.deepEqual(defaultPartnerSessionOptions(['en']), { openerPrefetch: false, lessonCloseAutoEnd: true });
  assert.deepEqual(defaultPartnerSessionOptions(['en', 'ja']), { openerPrefetch: true, lessonCloseAutoEnd: true });
});

test('no partner id (retail, showcase without a token) resolves to the engine defaults', () => {
  assert.deepEqual(resolvePartnerSessionOptions(undefined), { openerPrefetch: false, lessonCloseAutoEnd: true });
  assert.deepEqual(resolvePartnerSessionOptions(null), { openerPrefetch: false, lessonCloseAutoEnd: true });
  assert.deepEqual(resolvePartnerSessionOptions({}), { openerPrefetch: false, lessonCloseAutoEnd: true });
  assert.deepEqual(resolvePartnerSessionOptions({ partnerId: '', tutorLanguages: ['en', 'ja'] }),
    { openerPrefetch: true, lessonCloseAutoEnd: true }, 'a bilingual session with no partner row prefetches');
});

test('an unlisted English-only partner gets no prefetch and auto-end on', () => {
  for (const partnerId of ['kanzoo', 'crimsora', 'evelyntutor', 'academy', 'some-future-partner']) {
    assert.deepEqual(resolvePartnerSessionOptions({ partnerId }), { openerPrefetch: false, lessonCloseAutoEnd: true }, partnerId);
  }
});

test('an unlisted FUTURE bilingual partner prefetches by default (decision 2026-10-27)', () => {
  assert.equal(resolvePartnerSessionOptions({ partnerId: 'some-future-partner', tutorLanguages: ['en', 'ja'] }).openerPrefetch, true);
  assert.equal(resolvePartnerSessionOptions({ partnerId: 'some-future-partner', tutorLanguages: ['en', 'ar'] }).openerPrefetch, true);
});

test('partner rows: GDI demo prefetches even without the languages claim; GreenApple and GameClass never do', () => {
  assert.equal(resolvePartnerSessionOptions({ partnerId: 'gdi-demo' }).openerPrefetch, true);
  assert.equal(resolvePartnerSessionOptions({ partnerId: 'gdi-demo', tutorLanguages: ['en', 'ja'] }).openerPrefetch, true);
  assert.equal(resolvePartnerSessionOptions({ partnerId: 'greenapple' }).openerPrefetch, false);
  assert.equal(resolvePartnerSessionOptions({ partnerId: 'greenapple', tutorLanguages: ['en', 'ja'] }).openerPrefetch, false, 'the row wins over the language default');
  assert.equal(resolvePartnerSessionOptions({ partnerId: 'gameclass' }).openerPrefetch, false);
});

test('a partner row can turn the post-close auto-end off; nothing else does', () => {
  for (const partnerId of Object.keys(PARTNER_SESSION_DEFAULTS)) {
    assert.equal(resolvePartnerSessionOptions({ partnerId }).lessonCloseAutoEnd, true, `${partnerId}: on until Praveen says otherwise`);
  }
  assert.equal(resolvePartnerSessionOptions({ partnerId: 'anyone' }).lessonCloseAutoEnd, true);
});

test('prototype keys are not partner rows', () => {
  assert.deepEqual(resolvePartnerSessionOptions({ partnerId: 'constructor' }), { openerPrefetch: false, lessonCloseAutoEnd: true });
  assert.deepEqual(resolvePartnerSessionOptions({ partnerId: '__proto__' }), { openerPrefetch: false, lessonCloseAutoEnd: true });
});

console.log('\nWiring pins (source)');

const vtr = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
const ink = src('src/app/tutor/hooks/useCartesiaInkWS.ts');
const embed = src('src/app/tutor-portal/embed/page.tsx');
const session = src('src/app/tutor/components/session/TutorSession.tsx');

test('the runtime declares both props with the decided defaults (prefetch off, auto-end on)', () => {
  assert.ok(/^\s*openerPrefetch\?: boolean;/m.test(vtr), 'openerPrefetch prop');
  assert.ok(/^\s*lessonCloseAutoEnd\?: boolean;/m.test(vtr), 'lessonCloseAutoEnd prop');
  assert.ok(/^\s*openerPrefetch = false,/m.test(vtr), 'openerPrefetch defaults to false');
  assert.ok(/^\s*lessonCloseAutoEnd = true,/m.test(vtr), 'lessonCloseAutoEnd defaults to true');
});

test('the prefetch effect and the auto-end arm both honour their prop beside the build-time flag', () => {
  assert.ok(/if \(!TUTOR_OPENER_PREFETCH \|\| !openerPrefetch \|\| !claudeBrainMode/.test(vtr), 'prefetch effect gate');
  assert.ok(/if \(!TUTOR_LESSON_CLOSE_AUTO_END \|\| !lessonCloseAutoEnd \|\| sessionMode === 'text'\) return;/.test(vtr), 'auto-end arm gate');
});

test('the Ink hook is handed the language-keyed timeout; its own default is the English-only value', () => {
  assert.ok(/turnEndTimeoutMs: inkTurnEndTimeoutMs\(tutorLanguages\),/.test(vtr), 'runtime passes inkTurnEndTimeoutMs(tutorLanguages)');
  assert.ok(/const ENV_TURN_END_TIMEOUT_MS = inkTurnEndTimeoutMs\(undefined\);/.test(ink), 'hook default = inkTurnEndTimeoutMs(undefined)');
  assert.ok(!/NEXT_PUBLIC_TUTOR_INK_TURN_END_TIMEOUT_MS, 3000\)/.test(ink), 'the hook no longer hardcodes 3000 for everyone');
});

test('the embed page resolves the options from the token partner_id and forwards them; TutorSession forwards', () => {
  assert.ok(/resolvePartnerSessionOptions\(\{ partnerId: config\.partner_id, tutorLanguages \}\)/.test(embed), 'embed resolves');
  assert.ok(/openerPrefetch=\{sessionOptions\.openerPrefetch\}/.test(embed), 'embed passes openerPrefetch');
  assert.ok(/lessonCloseAutoEnd=\{sessionOptions\.lessonCloseAutoEnd\}/.test(embed), 'embed passes lessonCloseAutoEnd');
  assert.ok(/openerPrefetch=\{openerPrefetch\}/.test(session) && /lessonCloseAutoEnd=\{lessonCloseAutoEnd\}/.test(session), 'TutorSession forwards both');
});

test('the retail /tutor surfaces pass neither prop, so they get the engine defaults', () => {
  for (const rel of ['src/app/tutor/page.tsx', 'src/app/tutor/components/session/SessionStage.tsx']) {
    const s = src(rel);
    assert.ok(!/openerPrefetch=/.test(s) && !/lessonCloseAutoEnd=/.test(s), `${rel} passes neither`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
