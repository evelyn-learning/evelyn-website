/**
 * TTS playback routing for echo cancellation (round-5 echo fix, 2026-07-27).
 *
 * ROOT CAUSE this addresses: the tutor's voice is rendered with the Web Audio
 * API — `ctx.createBufferSource() → ctx.destination`. A browser's acoustic echo
 * canceller can only subtract audio it has a REFERENCE copy of, and on mobile
 * Safari the reference tap sits on the media pipeline, not on the Web Audio
 * render graph. Audio that reaches the speaker straight off `ctx.destination`
 * can therefore be inaudible to the canceller, which is consistent with what we
 * measured on two real mobile prod sessions: ~20-30 dB of coupling at a fixed
 * ~140 ms offset, i.e. close to the raw speaker → mic path, despite every
 * capture asking for `echoCancellation: true`.
 *
 * The fix routes playback through a `MediaStreamAudioDestinationNode` and plays
 * THAT stream from an `<audio>` element. Same samples, same timing, but now the
 * audio travels the media path the canceller can see.
 *
 * HONEST STATUS: the WebKit-internal claim above is inferred from our own
 * measurements plus the widely-used community workaround, not from an Apple
 * spec — which is exactly why this is behind a flag and falls back to the old
 * direct-to-destination path on any failure. If a live mobile test shows no
 * improvement, set NEXT_PUBLIC_TUTOR_AEC_PLAYBACK_ROUTE=off and rebuild; the
 * adaptive barge-in gate (bargein-gate.ts) defends the session either way.
 *
 * Everything else about playback is unchanged: callers still connect their
 * BufferSource to whatever node `getPlaybackTarget()` returns, and `source
 * .onended`, `ctx.currentTime` scheduling, and the caption word-clock all keep
 * working because the graph upstream of the destination is identical.
 */

/** Opt-out lever. Default ON — this is the fix, not an experiment toggle. */
export const AEC_PLAYBACK_ROUTE =
  process.env.NEXT_PUBLIC_TUTOR_AEC_PLAYBACK_ROUTE !== 'off';

interface RouteState {
  node: MediaStreamAudioDestinationNode;
  el: HTMLAudioElement;
  /** Sources connect HERE, not to `node`. Zeroing this gain silences the media
   *  path within one render quantum, which is the only way a barge-in can cut
   *  audio that has already been handed to a MediaStream — the stream and the
   *  element have no flush API. See `silencePlaybackRoute`. */
  gain: GainNode;
  /** Round-6e: foreground health check — removed on markFailed/release. */
  onVisibility?: () => void;
  /** Round-7c: last `el.currentTime`/wall-clock pair taken when the tab went
   *  hidden. Compared against the same pair on return to foreground to
   *  measure how far the element's playback position drifted from real time
   *  while backgrounded — the reverb-item-2 instrumentation. Cleared once
   *  consumed so a hidden→hidden transition (no visible in between) can't
   *  reuse a stale snapshot. */
  hiddenSnapshot?: { atMs: number; ct: number; ctxT: number; ctxState: string } | null;
}

const routes = new WeakMap<AudioContext, RouteState>();
/** Contexts whose media-element route failed — never retried, avoids thrash. */
const failed = new WeakSet<AudioContext>();

/** Round-6: surface route lifecycle to the session's persisted debug events.
 *  This module has no access to onDebugEvent, and console lines never leave
 *  the device — round-6's live test was blind on whether play() succeeded on
 *  the user's phone. VoiceTutorRealtime listens for this window event and
 *  forwards it. */
function emitRouteEvent(kind: string, detail: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('evelyn:playback-route', { detail: { kind, detail } }));
  } catch {}
}

/**
 * The node TTS sources should connect to.
 *
 * Returns the media-stream destination when routing is enabled and working;
 * otherwise `ctx.destination`, which is the pre-fix behaviour. Never throws —
 * a broken route degrades to audible-but-unreferenced playback rather than a
 * silent tutor, because silence is by far the worse failure.
 */
export function getPlaybackTarget(ctx: AudioContext): AudioNode {
  if (!AEC_PLAYBACK_ROUTE) return ctx.destination;
  if (failed.has(ctx)) return ctx.destination;
  if (typeof document === 'undefined') return ctx.destination;

  const existing = routes.get(ctx);
  if (existing) return existing.gain;

  try {
    const node = ctx.createMediaStreamDestination();
    const gain = ctx.createGain();
    gain.connect(node);
    const el = document.createElement('audio');
    el.autoplay = true;
    // Never surface controls or take layout space; this element exists purely
    // to move samples onto the media path.
    el.setAttribute('aria-hidden', 'true');
    el.style.display = 'none';
    // iOS refuses to route a stream to the earpiece/loudspeaker correctly if
    // the element is treated as a candidate for Picture-in-Picture or AirPlay
    // remote playback mid-session.
    el.setAttribute('playsinline', 'true');
    el.disableRemotePlayback = true;
    el.srcObject = node.stream;
    document.body.appendChild(el);

    // play() is called from within the same user-gesture-initiated chain that
    // opens the mic (Tap to start), so it is allowed. If it is ever rejected we
    // would be left with a silent tutor, so fall back immediately.
    const played = el.play();
    if (played && typeof played.catch === 'function') {
      played
        .then(() => emitRouteEvent('play_ok', `ctx=${ctx.state}`))
        .catch((err: unknown) => {
          console.warn('[playback-route] media-element play() rejected — falling back to ctx.destination', err);
          emitRouteEvent('play_rejected', String(err).slice(0, 120));
          markFailed(ctx);
        });
    }

    const state: RouteState = { node, el, gain };
    // Round-6e (portal-386d96cb: "reverb when I switch apps", with NO
    // barge-in kills in the window — so not the kill→replay loop; the route
    // itself is the suspect). App-switching interrupts the audio session:
    // the element can come back paused, and WebKit may tear the
    // MediaStreamDestination's track. On return to foreground, snapshot the
    // route's health into the persisted debug events (this was completely
    // unobserved on-device until now) and re-play a merely-paused element —
    // safe, idempotent, and the only self-repair available without a
    // gesture.
    state.onVisibility = () => {
      // Round-7c drift instrumentation: snapshot currentTime + wall clock the
      // moment we go hidden, with no event emitted (this fires on every tab
      // switch — noise, not signal, until paired with the return).
      if (document.visibilityState === 'hidden') {
        state.hiddenSnapshot = { atMs: Date.now(), ct: el.currentTime, ctxT: ctx.currentTime, ctxState: ctx.state };
        return;
      }
      if (document.visibilityState !== 'visible') return;
      const track = node.stream.getAudioTracks()[0];
      // Round-7c live-test result: `audioEls` counts every <audio> in the DOM.
      // Routes are never torn down (releasePlaybackRoute has no callers), so
      // each End→Resume that mints a new AudioContext leaves the previous
      // element behind — with the buffer-rebase hypothesis DISPROVEN
      // (drift≈0.000 across 14 measured switches, portal-3d1dd943), a stale
      // sibling element replaying the same feed is the leading remaining
      // suspect for the app-switch reverb.
      let snapshot = `el.paused=${el.paused} el.ended=${el.ended} track=${track?.readyState ?? 'none'} muted=${track?.muted ?? 'n/a'} ctx=${ctx.state} audioEls=${document.querySelectorAll('audio').length}`;
      // Round-7c: how far did the element's playback position advance versus
      // real wall-clock time while backgrounded? Measured live 2026-07-28
      // (portal-3d1dd943): elAdv tracked hiddenWall to the millisecond on
      // every switch — iOS keeps the element playing in true real time in
      // the background; there is no stale buffered tail. Kept because it is
      // cheap and it is the evidence that retires bad hypotheses.
      const hidden = state.hiddenSnapshot;
      if (hidden) {
        const wallS = (Date.now() - hidden.atMs) / 1000;
        const elS = el.currentTime - hidden.ct;
        const drift = wallS - elS;
        // Round-7d: ctxAdv is the DISCRIMINATOR the reverb hunt needs. The
        // element clock advances at wall rate whether or not the graph
        // renders (drift≈0 in BOTH of 2026-07-28's live sessions), but the
        // sessions behaved differently: portal-3d1dd943 played content
        // through the background (reverb on 1/14 switches), portal-55c31b0e
        // froze content and resumed from the pause point (reverb on EVERY
        // switch). Only the AudioContext clock tells those modes apart:
        // ctxAdv≈wall ⇒ graph rendered through background; ctxAdv≈0 ⇒ iOS
        // interrupted the context and the resume replays the in-flight
        // render tail — the current prime suspect for the double-audio.
        const ctxAdvS = ctx.currentTime - hidden.ctxT;
        snapshot += ` ct=${el.currentTime.toFixed(3)} hiddenWall=${wallS.toFixed(3)}s elAdv=${elS.toFixed(3)}s drift=${drift.toFixed(3)}s ctxAdv=${ctxAdvS.toFixed(3)}s hiddenCtx=${hidden.ctxState}`;
        state.hiddenSnapshot = null;
      }
      emitRouteEvent('foreground_check', snapshot);
      if (el.paused) {
        const p = el.play();
        if (p && typeof p.catch === 'function') {
          p.then(() => emitRouteEvent('foreground_replay_ok', snapshot))
            .catch((err: unknown) => emitRouteEvent('foreground_replay_rejected', String(err).slice(0, 100)));
        }
      }
      // Round-7c REVERTED the iOS srcObject re-attach experiment that lived
      // here. Live test portal-3d1dd943 (2026-07-28): drift≈0.000 on every
      // switch (no stale buffer to drop), and the re-attach itself
      // intermittently rendered the element inaudible with play() still
      // resolving — silent tutor turns at 413s and 595.7s each directly
      // followed a re-attach, needing End+Resume to recover. Do not re-add
      // a mid-session srcObject swap on iOS.
    };
    document.addEventListener('visibilitychange', state.onVisibility);
    // Round-7d: WebKit surfaces audio-session interruptions as a
    // (non-standard) 'interrupted' context state, and nothing in the app
    // listened for it — both 2026-07-28 reverb sessions looked identical in
    // every visibility-time probe. This timestamps interrupt/resume
    // transitions independently of visibility, right where a resume-replay
    // overlap would sit.
    ctx.addEventListener('statechange', () => emitRouteEvent('ctx_statechange', ctx.state));
    routes.set(ctx, state);
    console.warn('[playback-route] TTS routed via MediaStreamDestination (AEC reference path)');
    emitRouteEvent('routed', `ctx=${ctx.state}`);
    return gain;
  } catch (err) {
    console.warn('[playback-route] route setup failed — using ctx.destination', err);
    emitRouteEvent('setup_failed', String(err).slice(0, 120));
    failed.add(ctx);
    return ctx.destination;
  }
}

/**
 * Establish the AEC reference path AHEAD of the first TTS chunk (round-6
 * opener-echo fix, 2026-07-28, portal-b3838f70).
 *
 * ROOT CAUSE this closes: the route used to be created lazily by the first
 * `getPlaybackTarget()` call — i.e. at the first opener TTS chunk, seconds
 * AFTER the mic capture opened. Measured on the incident session's PCM
 * (xcorr, same method as round-5): the opener windows carried tutor-
 * correlated mic signal at a constant ~220-250ms lag / ~-21dB (raw
 * speaker→mic path), and the mic only went clean ~10s after the first
 * chunk — the canceller needs the media-element reference path to exist
 * (and converge) BEFORE the audio it must cancel. Creating the route at
 * session-start gesture time gives it that head start, and calling
 * `el.play()` synchronously inside the gesture chain also removes the
 * play()-rejected → permanent `markFailed` demotion risk that a lazy,
 * activation-expired first call carries.
 *
 * Idempotent (same WeakMap as `getPlaybackTarget`); a no-op when the route
 * flag is off or the context already failed.
 */
export function primePlaybackRoute(ctx: AudioContext): void {
  getPlaybackTarget(ctx);
}

/**
 * Demote a context to direct output.
 *
 * BUG THIS FIXES (round-5 live test, 2026-07-27): the first version bridged
 * `node → ctx.destination` and left the <audio> element attached and
 * `autoplay`-armed. So when play() was rejected (no gesture yet — the enrolled
 * session's opening turn) and the element later became eligible and started on
 * its own, the SAME audio reached the speaker twice: once through the bridge,
 * once through the element, offset by the element's own buffering. Two nearly
 * coincident copies is textbook comb filtering, which is exactly what got
 * reported — the tutor's voice "shaking / reverberating". It also explains the
 * echo returning on that opening turn: while the bridge carried playback, audio
 * was going direct to `ctx.destination` again, i.e. off the AEC reference path.
 *
 * So the element is now TORN DOWN before the bridge is made. Exactly one path
 * to the speaker is live at any moment, always.
 */
function markFailed(ctx: AudioContext): void {
  if (failed.has(ctx)) return;
  failed.add(ctx);
  const route = routes.get(ctx);
  if (!route) return;
  if (route.onVisibility) {
    try { document.removeEventListener('visibilitychange', route.onVisibility); } catch {}
  }
  // Kill the media-element path FIRST — order matters, an autoplay-armed
  // element left attached is precisely the double-playback bug above.
  try { route.el.pause(); } catch {}
  try { route.el.srcObject = null; } catch {}
  try { route.el.remove(); } catch {}
  // Now re-point in-flight sources at the real destination. They are connected
  // to `gain`, so bridging gain (not node) keeps already-playing audio audible
  // rather than cutting the tutor off mid-sentence.
  try { route.node.disconnect(); } catch {}
  try { route.gain.connect(ctx.destination); } catch {}
}

/**
 * Instantly silence whatever is already in the media path. Barge-in stops the
 * BufferSources, but samples already handed to the MediaStream keep playing —
 * there is no flush API on either the stream or the element — so the tail of a
 * killed sentence bled over the start of the next one. Zeroing the gain stops
 * new samples entering the stream within one render quantum.
 *
 * A 10ms ramp rather than a hard set: an instantaneous gain step is a
 * discontinuity in the waveform, which clicks.
 */
export function silencePlaybackRoute(ctx: AudioContext): void {
  const route = routes.get(ctx);
  if (!route) return;
  try {
    const now = ctx.currentTime;
    route.gain.gain.cancelScheduledValues(now);
    route.gain.gain.setValueAtTime(route.gain.gain.value, now);
    route.gain.gain.linearRampToValueAtTime(0, now + 0.01);
  } catch {}
}

/** Re-open the media path for the next sentence (mirror of the above). */
export function unsilencePlaybackRoute(ctx: AudioContext): void {
  const route = routes.get(ctx);
  if (!route) return;
  try {
    const now = ctx.currentTime;
    route.gain.gain.cancelScheduledValues(now);
    route.gain.gain.setValueAtTime(route.gain.gain.value, now);
    route.gain.gain.linearRampToValueAtTime(1, now + 0.01);
  } catch {}
}

/** Tear down the element/node for a context (session end). Safe to call twice. */
export function releasePlaybackRoute(ctx: AudioContext): void {
  const route = routes.get(ctx);
  if (!route) return;
  if (route.onVisibility) {
    try { document.removeEventListener('visibilitychange', route.onVisibility); } catch {}
  }
  try { route.el.pause(); } catch {}
  try { route.el.srcObject = null; } catch {}
  try { route.el.remove(); } catch {}
  try { route.gain.disconnect(); } catch {}
  try { route.node.disconnect(); } catch {}
  routes.delete(ctx);
}
