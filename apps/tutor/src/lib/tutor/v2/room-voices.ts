/**
 * Tutor brain v2 — other voices in the room.
 *
 * The recogniser writes down any voice the microphone picks up, and the only speech the voice client set aside
 * was the tutor's own (own-voice.ts). A television in the room was therefore the student: a drug advert cut
 * the tutor off four times in 38 seconds, each time one sentence into the same case, and the teacher left
 * without having said a word (ECS, embed-1795049380206; the same room on embed-1794708025170).
 *
 * The browser's noise suppression removes hum, not speech, so the test is on the words: before recognised
 * speech takes the floor, a small model is asked whether it was said to the tutor (api/tutor/heard-addressed).
 * Speech that was not is left out: the tutor goes on from where it paused, and nothing is sent as a turn.
 * After ROOM_NOISY_AFTER such stretches the room is known to be noisy: the tutor no longer pauses for a sound
 * or for words until they are judged the student's, and it tells the student once (facts.ts).
 *
 * Every doubt is settled in the student's favour: a failed or slow check, a short command, a brief answer and
 * anything typed are the student's without being asked about.
 *
 * Kill switch: NEXT_PUBLIC_TUTOR_ROOM_VOICES=off.
 */
export const ROOM_VOICES_ON = process.env.NEXT_PUBLIC_TUTOR_ROOM_VOICES !== 'off';

/** Stretches of other people's speech before the room counts as noisy. */
export const ROOM_NOISY_AFTER = 2;
/** The check is not waited for longer than this: past it the words are the student's. */
export const ROOM_CHECK_TIMEOUT_MS = 1500;
/** Words of a stretch still being spoken before it is judged early, so a pause on a television lasts a second
 *  or two and not the length of the advert (the first pause on embed-1795049380206 ran 14.6 s). */
export const ROOM_PARTIAL_WORDS = 5;
/** Five words are thin grounds for talking over someone. In a room where no other voice has yet been found, a
 *  stretch judged another voice at five words is judged again at this many before the tutor goes on: "So the
 *  center here would" and "But my teacher told" were the student answering, were read as background, and the
 *  tutor went on speaking over them four times in one lesson (ACT Math, portal-3d431436). */
export const ROOM_PARTIAL_CONFIRM_WORDS = 10;
export function partialIsConfirmed(text: string): boolean { return wordCount(text) >= ROOM_PARTIAL_CONFIRM_WORDS; }
/** In a room known to be noisy the tutor is not paused until the words are judged, so they are judged sooner. */
export const ROOM_PARTIAL_WORDS_NOISY = 3;

/** Words in a stretch of speech. Chinese and Japanese are written with no spaces: a whole sentence was one "word", so the
 *  thresholds above never came, and a long answer counted as a brief one. Two characters of those scripts count as a word. */
const CJK_CHARS = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;
const wordCount = (s: string) => { const cjk = (s.match(CJK_CHARS) ?? []).length; return s.replace(CJK_CHARS, ' ').trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length + Math.ceil(cjk / 2); };
/** A call to stop, wait or say it again, or a brief answer, in Chinese or Japanese: said to the tutor beyond doubt. */
const COMMAND_CJK = /^\s*(?:(?:老師|老师|先生|嗯|喔|哦|啊|那個|那个|すみません|あの|えっと)[，,、\s]*)*(?:等一下|等等|稍等|停|暫停|暂停|慢一點|慢一点|再說一(?:次|遍)|再说一(?:次|遍)|再講一(?:次|遍)|再讲一(?:次|遍)|什麼|什么|我(?:聽|听)不懂|不好意思|對不起|对不起|ちょっと待って|待って|止めて|ストップ|もう一度|もう一回|ゆっくり|何ですか|すみません)/u;
const BRIEF_CJK = /^\s*(?:(?:嗯|喔|哦|啊|えっと|あの)[，,、\s]*)*(?:好的?|好啊|對|对|是的?|嗯|可以|不是|不對|不对|沒有|没有|還沒|还没|懂了?|知道了?|明白了?|謝謝|谢谢|はい|ええ|うん|いいえ|いえ|大丈夫(?:です)?|わかりました|ありがとう(?:ございます)?)[\s\p{P}]*$/u;

/** Said to the tutor beyond doubt: a call to stop, wait or say it again, or a brief answer. These are never
 *  held for the check, in a quiet room or a noisy one: "stop" must stop the tutor at once. */
const COMMAND = /^\s*(?:(?:oh|um|uh|hey|so|okay|ok|sorry|please|excuse me)[, ]+)*(?:stop|wait|hold on|hang on|pause|one (?:moment|second|sec|minute)|just a (?:moment|second|sec|minute)|excuse me|sorry|pardon|what|what was that|what did you say|(?:can|could|would) you (?:please )?(?:repeat|say|stop|wait|slow|go|pause|hold)\b.*|say (?:that|it) again|(?:please )?repeat (?:that|it)?|(?:once|one more) (?:more|time)|again|slower|slow down|too fast|go on|go ahead|carry on|continue|i (?:can'?t|cannot|didn'?t|did not|couldn'?t) (?:hear|catch|follow|get) .*|i(?:'m| am) (?:lost|confused|not sure|here|back|ready)\b.*|i (?:don'?t|do not) (?:know|understand|get it)\b.*)[\s.,!?…]*$/i;
const BRIEF = /^\s*(?:(?:oh|um|uh|well|so)[, ]+)*(?:yes|yeah|yep|yup|ya|ok|okay|sure|alright|all right|right|mhm|uh[- ]?huh|no|nope|nah|not yet|not really|maybe|i think so|i guess|got it|makes sense|i do|i don'?t|thanks|thank you)\b[\s\w',.!?]*$/i;

export function plainlyTheStudent(text: string): boolean {
  const n = wordCount(text);
  if (!n) return false;
  if (n <= 12 && (COMMAND.test(text) || COMMAND_CJK.test(text))) return true;
  return n <= 4 && (BRIEF.test(text) || BRIEF_CJK.test(text));
}

/** Does this recognised speech wait for the check before it takes the floor?
 *  `speaking`: the tutor has speech playing or queued, so taking the words as a turn would cut it off.
 *  `suspect`: other voices have already been heard in this room.
 *  With the tutor silent and no sign of other voices the words go straight through: the check would add its
 *  wait to every answer of every lesson for the sake of the few rooms that need it. */
export function waitsForCheck(i: { text: string; typed?: boolean; speaking: boolean; suspect: boolean }): boolean {
  if (!ROOM_VOICES_ON || i.typed) return false;
  if (!i.text.trim() || plainlyTheStudent(i.text)) return false;
  return i.speaking || i.suspect;
}

/** A stretch still being spoken is judged early, once, when it is long enough to judge. */
export function partialIsJudged(text: string, noisy: boolean): boolean {
  return wordCount(text) >= (noisy ? ROOM_PARTIAL_WORDS_NOISY : ROOM_PARTIAL_WORDS);
}

/** The check's reply. It is the student unless the reply opens with BACKGROUND (the model sometimes goes on to
 *  say why, and a right verdict with a reason after it was read as the student). */
export function repliedBackground(raw: string): boolean {
  return /^\W*background\b/i.test(raw.trim());
}

/** How the check is asked of a given model. The older small models take a temperature; the newer ones reject it
 *  and think by default, which spends the few tokens of a one-word verdict on thinking and returns no text. */
export function roomModelParams(model: string): Record<string, unknown> {
  if (/(?:haiku|sonnet|opus)-4/.test(model)) return { temperature: 0 };
  if (/sonnet-5-5/.test(model)) return { thinking: { type: 'between_tools' }, output_config: { effort: 'low' } };
  return { thinking: { type: 'disabled' }, output_config: { effort: 'low' } };
}
/** The words of a reply, wherever its text block sits. */
export function roomReplyText(msg: { content: Array<{ type: string; text?: string }> }): string {
  return msg.content.find((b) => b.type === 'text')?.text ?? '';
}

const WHO = `STUDENT: one person speaking to the tutor, about anything at all.
- An answer or an attempt at one, however short, wrong or hesitant. A question about the lesson.
- The recogniser mishears. Speech that picks up the tutor's own words or numbers, even turned into soundalikes that make no sense as written, is the student answering.
- Anything a person says to whoever they are talking with: a request (stop, wait, repeat, slower, something else), a remark about themselves or what is happening around them ("I need a minute", "my dog just got sick", "the TV is on"), small talk or a question on another subject ("do you know who won last night?"), saying they are distracted, tired or done.
- Speech in any language.
Being off the lesson's topic never makes speech BACKGROUND by itself: students change the subject, and the tutor must hear them when they do. A short question put straight to a listener ("do you…", "can you…", "have you…", "what do you think…") is the student whatever it is about, sport and the news included: a broadcast reports, it does not stop to ask the listener.

BACKGROUND: speech that is not a person talking to their tutor.
- Broadcast or recorded speech: an advertisement, a list of warnings or side effects, news, weather, sports commentary, a narrator, a programme's dialogue, an announcement.
- People in the room talking to each other, or the student plainly talking to someone else ("Mom, close the door").
- A stray fragment in the manner of the above: it answers nothing the tutor said, and it is not something a person would say to the one they are talking with.`;

export const ROOM_CHECK_SYSTEM = `A tutor and one student are in a spoken lesson. The student's microphone also picks up other voices in the room: a television or radio, a video playing, other people talking to each other. You are given what the tutor has just been saying and a stretch of speech the microphone picked up. Decide who the speech belongs to.

${WHO}

When you cannot tell, answer STUDENT.

Reply with one word: STUDENT or BACKGROUND.`;

/** The student's words out of a stretch that may hold other voices too. A television does not stop for the
 *  student, so the recogniser hands over their answer and the news in one run of words; judged whole, the run
 *  was another voice and the student was never heard (local test, embed-1795054401972: 90 seconds without a
 *  reply). */
export const ROOM_EXTRACT_SYSTEM = `A tutor and one student are in a spoken lesson. The student's microphone also picks up other voices in the room: a television or radio, a video playing, other people talking to each other. The recogniser writes everything it hears as one run of words, so the student's words may sit in among the others'. You are given what the tutor has just been saying and the run of words. Give back the student's words, and nothing else.

${WHO}

Reply in one of three ways:
- ALL, when the whole run is the student.
- NONE, when none of it is.
- Otherwise the student's words only: copied exactly as they appear in the run, in the same order, with the rest left out. Never add, correct or complete a word. No quotation marks and no comment.

A part you cannot place is kept as the student's.`;

export function roomCheckMessage(i: { tutorSaid: string; heard: string; earlier?: string[] }): string {
  const earlier = (i.earlier ?? []).filter(Boolean).slice(-2);
  return [
    `The tutor has just been saying:\n${i.tutorSaid.trim().slice(-700) || '(nothing yet)'}`,
    ...(earlier.length ? [`Earlier in this session the microphone picked up these, which were not the student:\n${earlier.map((x) => `- ${x.slice(0, 160)}`).join('\n')}`] : []),
    `The microphone picked up:\n${i.heard.trim().slice(0, 600)}`,
  ].join('\n\n');
}

const norm = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

/** The run with its first `n` words gone: what has not been looked at yet. */
export function afterWords(text: string, n: number): string {
  return n > 0 ? text.trim().split(/\s+/).slice(n).join(' ') : text.trim();
}
export const sameWords = (a: string, b: string) => norm(a).join(' ') === norm(b).join(' ');

/** What the extraction returned, as the student's words. Null: none of the run was the student's.
 *  The run is handed back whole when the reply says ALL, when it kept nearly all of it, and when it is not made
 *  of the run's own words (the model wrote something of its own): the doubt goes to the student. */
export function studentWordsIn(raw: string, run: string): string | null {
  const reply = raw.trim().replace(/^["'“]+|["'”]+$/g, '').trim();
  if (!reply || /^\W*all\W*$/i.test(reply)) return run.trim();
  if (/^\W*none\b/i.test(reply)) return null;
  const have = new Set(norm(run)); const got = norm(reply); const all = norm(run);
  if (!got.length) return run.trim();
  if (got.filter((w) => have.has(w)).length / got.length < 0.8) return run.trim();
  if (all.length && got.length / all.length >= 0.8) return run.trim();
  return reply;
}

/** The two readings of a stretch put together: whose it is as a whole, and which of its words are the student's.
 *  Either alone lost a student now and then (an off-topic question read as a broadcast by one, kept by the
 *  other), so the student is left out only when both say so:
 *  - read as the student's: their words as picked out, or all of it when nothing was picked out;
 *  - read as another voice: only words picked out from among the rest. The whole stretch handed back, against
 *    that reading, is another voice. */
export function studentPart(background: boolean, words: string | null, run: string): string | null {
  if (!background) return words ?? run.trim();
  if (words === null || sameWords(words, run)) return null;
  return words;
}

/** In a noisy room a stretch still being spoken is looked at this often for words of the student's. */
export const ROOM_LOOK_EVERY_MS = 2500;
export const ROOM_LOOK_MIN_WORDS = 3;
/** Unmuting, speaking and muting again within this long is the student taking a turn by hand: what was heard
 *  in between is theirs without being asked about. */
export const ROOM_HAND_TURN_MS = 60000;

/** The line in the turn's facts, until it has been said, when the room has become noisy (facts.ts). */
export function roomVoicesFact(times: number): string {
  return `the room: other voices near the student (a television, a radio or people talking to each other) have been picked up ${times} times and were left out; the student has not been told. Tell them now, once, in one or two short sentences at the start of this reply: you can hear other voices near them, so you may miss some of what they say; headphones or a quieter place will help, and they can turn their microphone off with the mic button while they listen and on again to speak, or type. Then go on from where the lesson is (a question you had asked and they have not answered is asked again, in a few words), and do not bring it up again`;
}
