/**
 * Unit tests for the shared-mic per-consumer mute-intent resolution
 * (round-6 fix, 2026-07-28 — the mute-grace regression from round-5a).
 *
 * The bug: `muteInput()` hardware-disabled the shared capture for every
 * consumer, and Ink2's software `setMuted(false)` could not undo it — so the
 * mute-grace window ("perception listens briefly to capture the in-flight
 * utterance, then mutes") heard nothing. The track must go hardware-off only
 * once EVERY consumer with an expressed intent is muted.
 *
 * Run: npm run test:shared-mic
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveSharedMicEnabled, submitDespiteMute, SUBMIT_AFTER_MUTE_MS } from '../src/lib/tutor/voice/shared-mic';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

// Fresh capture, nobody has expressed an intent yet → live (pre-fix default).
check('no expressed intents → enabled', resolveSharedMicEnabled([]) === true);

// THE mute-grace window (the regression this fix closes): the student hit
// mute mid-utterance — production WS registers muted, but the start-gate is
// holding Ink2 unmuted for the grace period so the VAD can commit the tail.
check('grace window: prod muted + ink2 listening → enabled',
  resolveSharedMicEnabled([true, false]) === true);

// Grace expired: the start-gate applied Ink2's mute → now truly silent.
check('post-grace: both muted → disabled',
  resolveSharedMicEnabled([true, true]) === false);

// Pre-start: Ink2 is start-gate-muted and the production WS hasn't
// startListening()'d yet (no intent) → the mic must not be hot.
check('pre-start: only ink2 intent, muted → disabled',
  resolveSharedMicEnabled([true]) === false);

// Normal listening: both consumers live.
check('mid-session: both unmuted → enabled',
  resolveSharedMicEnabled([false, false]) === true);

// Unmute round-trip: startListening withdraws the production mute first;
// the track must come back even before the start-gate unmutes Ink2.
check('unmute: prod unmuted + ink2 still muted → enabled',
  resolveSharedMicEnabled([false, true]) === true);

// Task 20 §H (GDI run 8): unmute 77.8 s, speech, mute 81.4 s, transcript 81.5 s.
check('H: speech began before the mute ⇒ submitted',
  submitDespiteMute({ mutedAt: 81_400, speechStartedAt: 78_200, now: 81_500 }) === true);
check('H: speech began after the mute (ambient) ⇒ dropped',
  submitDespiteMute({ mutedAt: 81_400, speechStartedAt: 82_000, now: 84_000 }) === false);
check('H: start unknown, transcript ≤ 1500 ms after the mute ⇒ submitted',
  submitDespiteMute({ mutedAt: 81_400, speechStartedAt: undefined, now: 81_400 + SUBMIT_AFTER_MUTE_MS }) === true);
check('H: start unknown, transcript later than that ⇒ dropped',
  submitDespiteMute({ mutedAt: 81_400, speechStartedAt: undefined, now: 81_400 + SUBMIT_AFTER_MUTE_MS + 1 }) === false);
check('H: not muted by the student (null) ⇒ never',
  submitDespiteMute({ mutedAt: null, speechStartedAt: 1, now: 2 }) === false);
{
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('H: VTR stamps the mute and clears it on unmute',
    vtr.includes('micMutedAtRef.current = Date.now();') && vtr.includes('micMutedAtRef.current = null;'));
  check('H: VTR submits by timing through the perception_submit_on_mute branch',
    /submitDespiteMute\(\{ mutedAt: micMutedAtRef\.current[\s\S]{0,200}if \(submitPendingUtteranceRef\.current \|\| submitByTiming\)[\s\S]{0,600}'perception_submit_on_mute'/.test(vtr));
}

// Task 27 §G (GDI run 14, 1141 s): re-acquire swaps every consumer's source; the WebSockets are untouched.
void (async () => {
  const sm = await import('../src/lib/tutor/voice/shared-mic');
  type FakeTrack = { label: string; readyState: string; enabled: boolean; muted: boolean; stopped: boolean; stop: () => void; getSettings: () => object; addEventListener: (k: string, fn: () => void) => void; fire: (k: string) => void };
  const mkStream = (label: string) => {
    const handlers: Record<string, Array<() => void>> = {};
    const track: FakeTrack = { label, readyState: 'live', enabled: true, muted: false, stopped: false,
      stop() { this.stopped = true; this.readyState = 'ended'; }, getSettings: () => ({}),
      addEventListener: (k, fn) => { (handlers[k] ??= []).push(fn); }, fire: (k) => (handlers[k] ?? []).forEach((f) => f()) };
    return { track, stream: { getAudioTracks: () => [track], getTracks: () => [track] } as unknown as MediaStream };
  };
  const devices = [mkStream('AirPods'), mkStream('MacBook Air Microphone')];
  let opened = 0;
  const g = globalThis as unknown as { window?: EventTarget; navigator?: { mediaDevices?: unknown } };
  g.window = new EventTarget();
  Object.defineProperty(globalThis, 'navigator', { value: { mediaDevices: { getUserMedia: async () => devices[Math.min(opened++, devices.length - 1)]!.stream } }, configurable: true, writable: true });
  const events: string[] = [];
  g.window.addEventListener('evelyn:shared-mic-track', (e) => events.push(`track:${(e as CustomEvent).detail.kind}`));
  g.window.addEventListener('evelyn:shared-mic-frame', () => events.push('frame'));
  const first = await sm.acquireSharedMicStream('ink');
  await sm.acquireSharedMicStream('realtime');
  check('G: one capture shared by two consumers', first === devices[0]!.stream && opened === 1);
  // two consumers' graphs: a fake ctx whose sources record their stream
  const connected: string[] = [];
  const mkCtx = (name: string) => ({ createMediaStreamSource: (s: MediaStream) => ({ s, connect: () => connected.push(`${name}:${(s.getAudioTracks()[0] as unknown as FakeTrack).label}`), disconnect: () => connected.push(`${name}:-`) }) });
  let inkLive = true;
  const inkCtx = mkCtx('ink');
  const inkSrc = inkCtx.createMediaStreamSource(first);
  const proc = {} as AudioNode;
  let inkStream: MediaStream = first;
  sm.followSharedMicSwaps(inkCtx as unknown as AudioContext, inkSrc as unknown as MediaStreamAudioSourceNode, proc, () => inkLive, (s) => { inkStream = s; });
  const recCtx = mkCtx('rec');
  sm.followSharedMicSwaps(recCtx as unknown as AudioContext, recCtx.createMediaStreamSource(first) as unknown as MediaStreamAudioSourceNode, proc, () => true);
  devices[0]!.track.fire('ended');
  check('G: the shared track\'s ended is surfaced', events.includes('track:ended'));
  check('G: a capture is open, nothing in flight', sm.sharedMicCaptureOpen() && !sm.sharedMicReacquireInFlight());
  const p1 = sm.reacquireSharedMicStream('track-ended');
  const p2 = sm.reacquireSharedMicStream('devicechange');
  check('G: a re-acquire in flight is joined, not repeated', p1 === p2 && sm.sharedMicReacquireInFlight());
  const fresh = await p1;
  check('G: re-acquired on the new default input', fresh === devices[1]!.stream && opened === 2);
  check('G: both graphs swapped their source (old disconnected, new connected)', connected.join(',') === 'ink:-,ink:MacBook Air Microphone,rec:-,rec:MacBook Air Microphone', connected.join(','));
  check('G: the consumer sees the new stream; the old tracks stopped', inkStream === fresh && devices[0]!.track.stopped);
  sm.noteSharedMicFrame(); sm.noteSharedMicFrame();
  check('G: the first frame after the swap is announced once', events.filter((e) => e === 'frame').length === 1);
  // a torn-down consumer drops out at the next swap
  inkLive = false;
  connected.length = 0;
  devices.push(mkStream('USB Mic'));
  await sm.reacquireSharedMicStream('devicechange');
  check('G: a torn-down graph is not re-pointed', connected.join(',') === 'rec:-,rec:USB Mic', connected.join(','));
  // the student mute intent survives the swap
  sm.setSharedMicConsumerMuted('ink', true); sm.setSharedMicConsumerMuted('realtime', true);
  devices.push(mkStream('Headset'));
  const h = await sm.reacquireSharedMicStream('devicechange');
  check('G: the student\'s mute survives a swap (track disabled)', (h.getAudioTracks()[0] as unknown as FakeTrack).enabled === false);
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('G: VTR listens for devicechange + the track events, events named', vtr.includes("md?.addEventListener?.('devicechange', onDeviceChange);") && vtr.includes("window.addEventListener('evelyn:shared-mic-track', onTrack);")
    && vtr.includes("onDebugEventRef.current?.('mic_device_changed', reason);") && vtr.includes("onDebugEventRef.current?.('mic_reacquired', ") && vtr.includes("onDebugEventRef.current?.('mic_reacquire_failed', ")
    && vtr.includes('if (defaultInputChanged(list, getSharedMicLabel())) run({ kind: \'devicechange\' });'));
  for (const hook of ['useCartesiaInkWS', 'useOpenAIRealtime']) {
    const src = readFileSync(join(__dirname, '..', `src/app/tutor/hooks/${hook}.ts`), 'utf8');
    check(`G: ${hook} follows swaps without touching its WebSocket`, src.includes('followSharedMicSwaps(ctx, source, processor, ') && src.includes('noteSharedMicFrame();'));
  }
  const perc = readFileSync(join(__dirname, '..', 'src/app/tutor/hooks/usePerceptionWS.ts'), 'utf8');
  check('G: usePerceptionWS re-opens its own capture on a swap', perc.includes('micSwapUnsubRef.current = onSharedMicStreamSwapped(() => {'));
  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
})();

