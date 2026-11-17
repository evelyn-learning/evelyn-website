/**
 * Tutor brain v2 — Task 7h: the microphone through the closing words.
 *
 * end_lesson closed the session as soon as the reply had streamed, which switched the microphone off for the rest of a
 * closing reply that ran about 55 s; the learner said "Can you please—" and "What are you doing?" into a dead
 * microphone (mic test 2, embed-1794941004529, flags 9 and 10). In a spoken lesson the session now counts as closed
 * only once the closing words have been said. Words over them call the close off, as on the close work of commit
 * 9efef789 (close-heard.ts reopensClose: thanks and a goodbye do not), and the lesson goes on from what they said; the
 * Task 7d close then runs as usual. The time box's hard stop is not this: it stays uninterruptible.
 */
import { reopensClose } from './close-heard';
import { TUTOR_V2_CLOSE_HEARS } from '../orchestrator/flags';

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
/** Japanese thanks and goodbyes (and a bare yes): the learner closing too. */
const JA_PARTING = /(?:どうも)?ありがとう(?:ございます|ございました)?|さようなら|さよなら|またね|また(?:来週|今度|次回|明日)?|お疲れ様(?:でした|です)?|おつかれさま(?:でした|です)?|失礼します|じゃあね|バイバイ|よろしくお願いします|はい|ええ|うん|先生/g;

/** Whether words heard over the closing words call the close off. reopensClose (English: anything but thanks and a
 *  goodbye, any question); and Japanese, which reopensClose reads as one word: anything left once the thanks and
 *  goodbyes are taken out, or a full-width question mark. */
export function v2CloseCalledOff(said: string): boolean {
  if (/？/.test(said)) return true;
  if (!CJK.test(said)) return reopensClose(said);
  const rest = said.replace(JA_PARTING, ' ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  if (!rest) return false;
  // Latin words left among the Japanese are read as English.
  const latin = rest.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]+/gu, ' ').trim();
  return (rest.match(new RegExp(CJK.source, 'gu')) ?? []).length >= 2 || (!!latin && reopensClose(latin));
}

/** A spoken close keeps the microphone open until its words have been said. Voice only, and only where the client can
 *  wait for the speech (closeDelayMs a function). `enabled`: TUTOR_V2_CLOSE_HEARS. */
export function v2CloseHears(mode: 'text' | 'voice', waitsForSpeech: boolean, enabled: boolean = TUTOR_V2_CLOSE_HEARS): boolean {
  return enabled && mode === 'voice' && waitsForSpeech;
}

/** The closing words being said. begin() as end_lesson is accepted; heard() for words over them; said() once they have
 *  been said; stop() when the box or the host ends the session first. */
export class V2ClosingWords {
  private on = false;
  private round = 0;
  get active(): boolean { return this.on; }
  /** Returns this close's number: a close called off and begun again is a new one. */
  begin(): number { this.on = true; return ++this.round; }
  /** 'reopen': the close is called off and these words are the student's turn. 'let-end': thanks or a goodbye, or no
   *  words (a silence check): nothing to answer, the close goes on. 'not-closing': no close under way. */
  heard(said: string | null): 'not-closing' | 'reopen' | 'let-end' {
    if (!this.on) return 'not-closing';
    if (!said || !v2CloseCalledOff(said)) return 'let-end';
    this.on = false;
    return 'reopen';
  }
  /** The closing words of close `round` (begin's number) have been said: true when the session closes now (that close
   *  not called off or ended meanwhile). */
  said(round: number = this.round): boolean { if (!this.on || round !== this.round) return false; this.on = false; return true; }
  stop(): void { this.on = false; }
}
