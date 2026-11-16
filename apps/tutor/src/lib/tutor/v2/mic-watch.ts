/**
 * Tutor brain v2 — the microphone opened again when the device changes (v1's re-acquire, VoiceTutorRealtime Task 27 §G:
 * a learner's AirPods went to the laptop microphone mid-lesson and the recogniser never heard them again, GDI run 14).
 *
 * Triggers, as v1: `devicechange` when the system's default input is no longer the device being captured; the shared
 * track ending; the track muted at the source for more than three seconds. The decision is v1's
 * (voice/mic-reacquire.ts); the shared capture is opened again and every capture graph follows it without
 * reconnecting (voice/shared-mic.ts). The student is told the microphone changed until the first sound from it.
 * The browser and the shared capture come in as `deps`, so this runs and is tested without a device.
 */
import { defaultInputChanged, micReacquireDecision, micReacquireReason, MIC_TRACK_MUTED_REACQUIRE_MS, type MicReacquireTrigger } from '../voice/mic-reacquire';

export interface V2MicWatchDeps {
  captureOpen: () => boolean;
  inFlight: () => boolean;
  trackMuted: () => boolean;
  /** The label of the device being captured. */
  label: () => string;
  /** navigator.mediaDevices.enumerateDevices, when there is one. */
  listDevices?: () => Promise<ReadonlyArray<{ kind: string; deviceId: string; label: string }>>;
  reacquire: (reason: string) => Promise<{ label: string }>;
  log: (type: string, message: string) => void;
  /** Show (true) or take down (false) the "microphone changed" notice. */
  notice: (on: boolean) => void;
  now: () => number;
  setTimer: (fn: () => void, ms: number) => unknown;
  clearTimer: (handle: unknown) => void;
}

/** How long the notice stays up when no sound arrives from the new microphone (v1). */
const NOTICE_MAX_MS = 15_000;

export class V2MicWatch {
  private lastReacquireAt: number | null = null;
  private mutedSince: number | null = null;
  private muteTimer: unknown = null;
  private noticeTimer: unknown = null;
  private noticeUp = false;
  private disposed = false;

  constructor(private readonly d: V2MicWatchDeps) {}

  /** navigator.mediaDevices 'devicechange'. Only a change of the default input re-acquires (it also fires for outputs). */
  deviceChange(): void {
    const live = this.d.captureOpen() && !!this.d.label();
    if (!live || !this.d.listDevices) { this.run({ kind: 'devicechange' }); return; }
    this.d.listDevices()
      .then((list) => {
        if (defaultInputChanged(list, this.d.label())) this.run({ kind: 'devicechange' });
        else this.d.log('mic_device_change_ignored', `default input unchanged ("${this.d.label().slice(0, 40)}")`);
      })
      .catch(() => this.run({ kind: 'devicechange' }));
  }

  /** The shared track's events ('evelyn:shared-mic-track'). */
  trackEvent(kind: string | undefined): void {
    if (kind === 'ended') this.run({ kind: 'track-ended' });
    else if (kind === 'mute') { this.mutedSince = this.d.now(); this.run({ kind: 'track-muted', mutedForMs: 0 }); }
    else if (kind === 'unmute') { this.mutedSince = null; this.clearMuteTimer(); }
  }

  /** The first sound from a new microphone ('evelyn:shared-mic-frame'). */
  frame(): void { this.clearNotice(); }

  dispose(): void { this.disposed = true; this.clearMuteTimer(); this.clearNotice(); }

  private run(trigger: MicReacquireTrigger): void {
    if (this.disposed) return;
    const decision = micReacquireDecision(trigger, {
      enabled: true,
      captureOpen: this.d.captureOpen(),
      inFlight: this.d.inFlight(),
      sinceLastReacquireMs: this.lastReacquireAt == null ? null : this.d.now() - this.lastReacquireAt,
    });
    if (decision === 'wait' && trigger.kind === 'track-muted') {
      this.clearMuteTimer();
      this.muteTimer = this.d.setTimer(() => {
        this.muteTimer = null;
        if (this.mutedSince != null && this.d.trackMuted()) this.run({ kind: 'track-muted', mutedForMs: this.d.now() - this.mutedSince });
      }, Math.max(0, MIC_TRACK_MUTED_REACQUIRE_MS - trigger.mutedForMs) + 50);
      return;
    }
    if (decision !== 'reacquire') return;
    this.lastReacquireAt = this.d.now();
    const reason = micReacquireReason(trigger);
    this.d.log('mic_device_changed', reason);
    this.showNotice();
    this.d.reacquire(reason)
      .then((r) => { this.mutedSince = null; this.d.log('mic_reacquired', r.label.slice(0, 60) || 'default input'); })
      .catch((err) => { this.clearNotice(); this.d.log('mic_reacquire_failed', (err instanceof Error ? `${err.name}: ${err.message}` : String(err)).slice(0, 120)); });
  }

  private showNotice(): void {
    this.noticeUp = true;
    this.d.notice(true);
    if (this.noticeTimer) this.d.clearTimer(this.noticeTimer);
    this.noticeTimer = this.d.setTimer(() => this.clearNotice(), NOTICE_MAX_MS);
  }

  private clearNotice(): void {
    if (this.noticeTimer) { this.d.clearTimer(this.noticeTimer); this.noticeTimer = null; }
    if (this.noticeUp) { this.noticeUp = false; this.d.notice(false); }
  }

  private clearMuteTimer(): void {
    if (this.muteTimer) { this.d.clearTimer(this.muteTimer); this.muteTimer = null; }
  }
}
