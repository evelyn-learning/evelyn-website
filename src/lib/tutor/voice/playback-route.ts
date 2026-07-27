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
}

const routes = new WeakMap<AudioContext, RouteState>();
/** Contexts whose media-element route failed — never retried, avoids thrash. */
const failed = new WeakSet<AudioContext>();

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
  if (existing) return existing.node;

  try {
    const node = ctx.createMediaStreamDestination();
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
      played.catch((err: unknown) => {
        console.warn('[playback-route] media-element play() rejected — falling back to ctx.destination', err);
        markFailed(ctx);
      });
    }

    routes.set(ctx, { node, el });
    console.warn('[playback-route] TTS routed via MediaStreamDestination (AEC reference path)');
    return node;
  } catch (err) {
    console.warn('[playback-route] route setup failed — using ctx.destination', err);
    failed.add(ctx);
    return ctx.destination;
  }
}

/**
 * Demote a context to direct output and re-point already-connected sources.
 * Sources connected to the dead node keep playing into nothing, so we also
 * bridge the node's output to the real destination — cheaper and less
 * disruptive than tearing down in-flight playback.
 */
function markFailed(ctx: AudioContext): void {
  if (failed.has(ctx)) return;
  failed.add(ctx);
  const route = routes.get(ctx);
  if (!route) return;
  try { route.node.connect(ctx.destination); } catch {}
}

/** Tear down the element/node for a context (session end). Safe to call twice. */
export function releasePlaybackRoute(ctx: AudioContext): void {
  const route = routes.get(ctx);
  if (!route) return;
  try { route.el.pause(); } catch {}
  try { route.el.srcObject = null; } catch {}
  try { route.el.remove(); } catch {}
  try { route.node.disconnect(); } catch {}
  routes.delete(ctx);
}
