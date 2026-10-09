/**
 * Text sessions store no tutor audio (2026-10-09, local end-to-end run: an
 * all-zero tutor.pcm16 of ~2.9 MB per minute and hasAudio:true on every text
 * session). src/lib/tutor/voice/tutor-audio-capture.ts + its wiring.
 *
 * Run: npx tsx scripts/test-tutor-audio-capture.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { decideTutorAudioCapture } from '../src/lib/tutor/voice/tutor-audio-capture';
import { resolveTtsProvider } from '../src/lib/tutor/voice/resolve-tts-provider';
import { resolveAudioFinalize } from '../src/lib/tutor/recordings/finalize-audio';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}
const d = (o: Partial<Parameters<typeof decideTutorAudioCapture>[0]>) =>
  decideTutorAudioCapture({ recordEnabled: true, sessionMode: 'voice', ttsProvider: 'cartesia', enabled: true, ...o });

console.log('\ntutor audio capture — a silent tutor has no audio track');

test('recorded: a text session (provider resolves to silent) → the tutor is not recorded', () => {
  const provider = resolveTtsProvider(null, 'cartesia', 'text');
  assert.equal(provider, 'silent');
  assert.deepEqual(d({ sessionMode: 'text', ttsProvider: provider }), { capture: false, reason: 'text-mode' });
});
test('text mode decides on its own, whatever provider it was handed', () => {
  for (const p of ['silent', 'cartesia', 'realtime', 'openai-mini', undefined]) assert.equal(d({ sessionMode: 'text', ttsProvider: p }).capture, false, String(p));
});
test('a voice session run with the silent provider (test mode) → not recorded either', () => {
  assert.deepEqual(d({ ttsProvider: 'silent' }), { capture: false, reason: 'silent-provider' });
});
test('a voice session is unchanged: every audible provider is recorded', () => {
  for (const p of ['cartesia', 'realtime', 'openai-mini', undefined]) assert.deepEqual(d({ ttsProvider: p }), { capture: true, reason: 'audible' }, String(p));
});
test('recording off → nothing, as before', () => {
  assert.deepEqual(d({ recordEnabled: false }), { capture: false, reason: 'recording-off' });
  assert.deepEqual(d({ recordEnabled: false, sessionMode: 'text', ttsProvider: 'silent' }), { capture: false, reason: 'recording-off' });
});
test('switch off ⇒ a silent tutor is recorded again, as before', () => {
  assert.deepEqual(d({ sessionMode: 'text', ttsProvider: 'silent', enabled: false }), { capture: true, reason: 'flag-off' });
  assert.equal(d({ recordEnabled: false, enabled: false }).capture, false);
});
test('no bytes on disk ⇒ finalize writes no sidecar and never sets hasAudio (the rule the fix relies on)', () => {
  assert.deepEqual(resolveAudioFinalize({ pcmBytes: null }), { writeMeta: false, markHasAudio: false });
  assert.deepEqual(resolveAudioFinalize({ pcmBytes: 0 }), { writeMeta: false, markHasAudio: false });
});

const root = join(__dirname, '..', 'src');
const vtr = readFileSync(join(root, 'app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
const hook = readFileSync(join(root, 'app/tutor/hooks/useOpenAIRealtime.ts'), 'utf8');
const recorder = readFileSync(join(root, 'app/tutor/hooks/useAudioRecorder.ts'), 'utf8');
const route = readFileSync(join(root, 'app/api/tutor/session-audio/route.ts'), 'utf8');

test('wiring: the tap is attached only when the decision says so; the student tap is untouched', () => {
  assert.ok(vtr.includes('const tutorAudioCapture = decideTutorAudioCapture({ recordEnabled: !!audioRecordEnabled, sessionMode, ttsProvider });'));
  assert.ok(vtr.includes('onTutorAudioChunk: tutorAudioCapture.capture ? audioRecorder.pushTutorChunk : undefined,'));
  assert.ok(vtr.includes('onStudentAudioChunk: audioRecordEnabled ? audioRecorder.pushStudentChunk : undefined,'));
  assert.equal(vtr.split('audioRecorder.pushTutorChunk').length - 1, 1, 'one tap site');
});
test('wiring: the hook has ONE tutor tap, at playback dequeue, and it is optional', () => {
  assert.equal(hook.split('onTutorAudioChunkRef.current?.(chunk)').length - 1, 1);
  assert.ok(hook.includes('onTutorAudioChunk?: (float32: Float32Array) => void;'));
});
test('wiring: a track with nothing pushed uploads nothing, and the route flags audio only for stored bytes', () => {
  // The recorder flushes a track only when its buffer has chunks…
  assert.ok(recorder.includes('if (tutorBufferRef.current.length > 0) {'));
  // …the route skips an empty body before any write or flag…
  assert.ok(route.indexOf('if (arrayBuffer.byteLength === 0) {') < route.indexOf('await fs.appendFile(filePath, buffer);'));
  // …and finalize decides from what is on disk.
  assert.ok(route.includes('const decision = resolveAudioFinalize({ pcmBytes });'));
  assert.equal(route.split('{ $set: { hasAudio: true } }').length - 1, 2, 'chunk branch + finalize branch — both behind stored bytes');
});
test('kill switch defaults ON', () => {
  const flags = readFileSync(join(root, 'lib/tutor/orchestrator/turn-round-flags.ts'), 'utf8');
  assert.ok(flags.includes("process.env.NEXT_PUBLIC_TUTOR_NO_SILENT_AUDIO_CAPTURE !== 'off'"));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
