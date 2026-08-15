/**
 * Caption ↔ TTS word-sync tracker.
 *
 * Pairs each brain sentence's DISPLAY form (chat/caption text) with its
 * SPEECH form (TTS-normalized, what the audio layer reports), and converts
 * live playback progress into a word-boundary-clamped reveal of the display
 * text. Pure and framework-free so it unit-tests without audio.
 *
 * The reveal is MONOTONIC within an attempt: audio pauses (noise barge-in,
 * student interruption, TTS latency gap) freeze it; kills freeze it at the
 * voiced content; a retry attempt resets it via beginAttempt.
 *
 * Word-level timing is PROPORTIONAL (elapsed ÷ duration mapped onto chars) —
 * OpenAI TTS exposes no word timestamps. If a word-timestamp provider lands
 * (e.g. Cartesia sonic-3 add_timestamps), feed exact boundaries through the
 * same SpokenProgress shape.
 *
 * Design: docs/superpowers/specs/2026-07-04-caption-tts-word-sync-design.md
 */

export interface SpokenProgress {
  /** Speech-form text of the sentence playing NOW (null = nothing playing). */
  sentence: string | null;
  /** Seconds of that sentence already played. */
  elapsedSec: number;
  /** elapsed + queued-but-unplayed seconds of the SAME sentence (grows as
   *  chunks stream in on the Realtime path; exact on the openai-mini path). */
  arrivedTotalSec: number;
  playing: boolean;
}

export interface SpokenCaption {
  turnKey: string;
  text: string;
  live: boolean;
}

/** Seed ≈ the legacy 85 ms/char caption typewriter. Calibrated live via EMA. */
const DEFAULT_CHARS_PER_SEC = 11.8;
const EMA_ALPHA = 0.3;
/** Ignore absurd calibration samples (silence-trimmed stubs, stalls). */
const CPS_MIN = 3;
const CPS_MAX = 40;

export function stripMarkdownEmphasis(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
}

/** Longest whole-word prefix of `s` with length ≤ chars. */
function wordClamp(s: string, chars: number): string {
  if (chars >= s.length) return s;
  if (chars <= 0) return '';
  const cut = s.slice(0, chars);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > 0 ? cut.slice(0, lastSpace) : '';
}

interface SentencePair {
  speech: string;
  display: string;
}

export class CaptionSyncTracker {
  private pairs: SentencePair[] = [];
  private turnKey = '';
  /** Index of the pair currently (or most recently) playing. */
  private cursor = 0;
  /** Monotonic reveal boundary, as a char index into the joined display text. */
  private revealedChars = 0;
  private streamEnded = false;
  private drainSeen = false;
  private everBegan = false;
  private charsPerSec = DEFAULT_CHARS_PER_SEC;
  /** Calibration bookkeeping: last-seen sentence + its latest known duration. */
  private lastSentence: string | null = null;
  private lastSentenceDur = 0;
  private lastSentenceSpeechLen = 0;
  /** Consecutive silent polls after streamEnd — fallback finalizer for turns
   *  whose audio drained BEFORE the stream ended (no post-stream 'drain'). */
  private silentPolls = 0;

  beginAttempt(turnKey: string): void {
    this.turnKey = turnKey;
    this.pairs = [];
    this.cursor = 0;
    this.revealedChars = 0;
    this.streamEnded = false;
    this.drainSeen = false;
    this.everBegan = true;
    this.lastSentence = null;
    this.lastSentenceDur = 0;
    this.lastSentenceSpeechLen = 0;
    this.silentPolls = 0;
  }

  registerSentence(speech: string, display: string): void {
    // The audio layer reports the TRIMMED dispatch string when labeling
    // chunks, but TTS normalization (e.g. em-dash → ', ') can leave a
    // trailing space on `speech` — trim so poll()'s exact match still hits.
    this.pairs.push({ speech: speech.trim(), display: stripMarkdownEmphasis(display).trim() });
  }

  markStreamEnd(): void {
    this.streamEnded = true;
  }

  /** Only a drain AFTER the brain stream ended is a true turn-end — the
   *  Realtime path can starve the audio queue mid-turn between sentences. */
  notifyDrain(): void {
    if (this.streamEnded) this.drainSeen = true;
  }

  private fullText(): string {
    return this.pairs.map((p) => p.display).join(' ');
  }

  private joinedDisplayLen(upTo: number): number {
    let len = 0;
    for (let i = 0; i < upTo; i++) {
      len += this.pairs[i].display.length + (i > 0 ? 1 : 0);
    }
    return len;
  }

  poll(progress: SpokenProgress | null): SpokenCaption {
    if (!this.everBegan || (this.streamEnded && this.drainSeen)) {
      return { turnKey: this.turnKey, text: this.fullText(), live: false };
    }
    const full = this.fullText();
    const s = progress?.sentence ?? null;
    if (!s && this.streamEnded && !progress?.playing) {
      // Stream over, nothing playing. The primary finalizer is a post-stream
      // 'drain', but audio that fully drained BEFORE the stream ended (e.g. a
      // tool-heavy turn with calls trailing the last sentence) never gets one
      // — finalize after ~500ms of confirmed silence instead. Inter-sentence
      // gaps reset via the s branch below, and the count restarts each poll
      // cycle, so a genuine pending sentence isn't cut off.
      this.silentPolls++;
      if (this.silentPolls >= 5) {
        this.drainSeen = true;
        return { turnKey: this.turnKey, text: full, live: false };
      }
    }
    if (s) {
      this.silentPolls = 0;
      // Exact match scanning forward from the cursor (duplicates resolve in
      // order); suffix fallback for resume-from-cut clause tails.
      let idx = -1;
      let tailOffset = 0;
      for (let i = this.cursor; i < this.pairs.length; i++) {
        if (this.pairs[i].speech === s) { idx = i; break; }
      }
      if (idx < 0) {
        for (let i = this.cursor; i < this.pairs.length; i++) {
          const sp = this.pairs[i].speech;
          if (s.length < sp.length && sp.endsWith(s)) {
            idx = i;
            tailOffset = 1 - s.length / sp.length;
            break;
          }
        }
      }
      if (idx >= 0) {
        // EMA speaking-rate calibration on sentence transitions: the previous
        // sentence's last-known arrivedTotal ≈ its true duration.
        if (this.lastSentence !== null && this.lastSentence !== s
          && this.lastSentenceDur > 0.3 && this.lastSentenceSpeechLen > 0) {
          const cps = this.lastSentenceSpeechLen / this.lastSentenceDur;
          if (cps > CPS_MIN && cps < CPS_MAX) {
            this.charsPerSec = this.charsPerSec * (1 - EMA_ALPHA) + cps * EMA_ALPHA;
          }
        }
        this.lastSentence = s;
        this.lastSentenceDur = progress!.arrivedTotalSec;
        this.lastSentenceSpeechLen = this.pairs[idx].speech.length;
        this.cursor = idx;
        const pair = this.pairs[idx];
        // Conservative denominator: arrived audio may undercount a sentence
        // still streaming in (Realtime path) — floor it with a char estimate
        // so the caption can trail and catch up, never race ahead.
        const estimate = pair.speech.length / this.charsPerSec;
        const total = Math.max(progress!.arrivedTotalSec, estimate);
        let frac = total > 0 ? Math.min(1, progress!.elapsedSec / total) : 0;
        frac = tailOffset + frac * (1 - tailOffset);
        const within = wordClamp(pair.display, Math.round(pair.display.length * frac));
        const before = this.joinedDisplayLen(idx);
        const candidate = idx > 0
          ? before + (within ? 1 + within.length : 0)
          : within.length;
        if (candidate > this.revealedChars) this.revealedChars = candidate;
      }
      // Unmatched sentence (kill-bridge, diverged resume): hold.
    }
    // No sentence playing (pause / gap / cancel): hold the monotonic boundary.
    return { turnKey: this.turnKey, text: full.slice(0, this.revealedChars), live: true };
  }
}
