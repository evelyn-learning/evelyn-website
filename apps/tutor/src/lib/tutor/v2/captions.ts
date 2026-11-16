/**
 * Tutor brain v2 — the caption in step with the voice (v1's caption sync, voice/caption-sync.ts).
 *
 * Without it the host's caption typed each reply out at its own pace, ahead of or behind the voice, and in full when
 * the student cut the tutor short, showing words the student never heard. Each reply is a new caption; each sentence
 * is registered with the parts the voice speaks it in (v2/languages.ts v2SpeechParts: a Japanese sentence quoting
 * English is spoken in parts, and the voice reports each part as it plays). A reply cut short keeps what was heard.
 */
import { CaptionSyncTracker, type SpokenCaption, type SpokenProgress } from '../voice/caption-sync';

export class V2Captions {
  private tracker = new CaptionSyncTracker();
  private turn = 0;
  private last: SpokenCaption = { turnKey: '', text: '', live: false };
  private frozen = false;

  /** A reply begins. */
  begin(): void { this.turn += 1; this.frozen = false; this.tracker.beginAttempt(`v2-turn-${this.turn}`); }

  /** One sentence of the reply, and the parts the voice is given for it. */
  sentence(sentence: string, parts: readonly string[]): void {
    this.tracker.registerSentence(parts.length === 1 ? parts[0]! : sentence, sentence, parts);
  }

  /** The reply's text is complete. */
  streamEnd(): void { this.tracker.markStreamEnd(); }

  /** The voice has played everything queued. */
  drain(): void { this.tracker.notifyDrain(); }

  /** The student came in: the caption stays at what was heard until the next reply. */
  cut(): void { this.frozen = true; }

  poll(progress: SpokenProgress | null): SpokenCaption {
    if (this.frozen) return { turnKey: this.last.turnKey, text: this.last.text, live: true };
    this.last = this.tracker.poll(progress);
    return this.last;
  }
}
