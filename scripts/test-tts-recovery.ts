/**
 * Round-28b: TTS recovery helpers — the "say less" fallback path.
 *
 * When Cartesia exhausts its retries mid-turn, the fallback voice should
 * speak a SHORT recovery line, not the whole tail. The route first tries a
 * Haiku compression; these pure helpers are the deterministic net under it
 * (pickRecoveryLine) plus the shortening gate and the s16le→f32le PCM
 * conversion the ElevenLabs route needs (Cartesia returns pcm_f32le; the
 * client does `new Float32Array(buf)` on whatever the route returns).
 *
 * Run: npx tsx scripts/test-tts-recovery.ts
 */
import {
  needsShortening,
  pickRecoveryLine,
  pcm16ToFloat32,
  RECOVERY_MAX_WORDS,
} from '../apps/marketing/src/lib/tutor/voice/tts-recovery';

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'} — ${name}${!cond && detail ? ` (${detail})` : ''}`);
}

// ── needsShortening ────────────────────────────────────────────────────
check('short sentence passes through', !needsShortening('So what is the limit here?'));
check('long tail needs shortening', needsShortening(
  'Right, so the left-hand limit gives us six plus c while the right-hand side evaluates to three, ' +
  'which means the only way to patch the hole is to force those two to agree. So what value of c does that?'));
check(`threshold constant exported (${RECOVERY_MAX_WORDS})`, RECOVERY_MAX_WORDS > 8 && RECOVERY_MAX_WORDS < 40);

// ── pickRecoveryLine ───────────────────────────────────────────────────
check('trailing question wins',
  pickRecoveryLine('The left side gives $6 + c$. The right side gives 3. So what value of $c$ makes them equal?')
    === 'So what value of $c$ makes them equal?');
check('last question wins even with a statement after it',
  pickRecoveryLine('First simplify. What do you get for the numerator? Take your time.')
    === 'What do you get for the numerator?');
check('no question → first sentence',
  pickRecoveryLine('The limit evaluates to seven. That matches the factored form. Nice work on that one.')
    === 'The limit evaluates to seven.');
check('single sentence returns itself',
  pickRecoveryLine('So the answer is $c = -3$.') === 'So the answer is $c = -3$.');

// ── pcm16ToFloat32 ─────────────────────────────────────────────────────
const f32 = pcm16ToFloat32(new Int16Array([0, 16384, -16384, 32767, -32768]));
check('length preserved', f32.length === 5);
check('zero maps to zero', f32[0] === 0);
check('half-scale positive ~0.5', Math.abs(f32[1] - 0.5) < 0.001, String(f32[1]));
check('half-scale negative ~-0.5', Math.abs(f32[2] + 0.5) < 0.001, String(f32[2]));
check('peak positive ≤ 1', f32[3] > 0.999 && f32[3] <= 1.0, String(f32[3]));
check('peak negative ≥ -1', f32[4] >= -1.0 && f32[4] < -0.999, String(f32[4]));

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll tts-recovery checks passed.');
