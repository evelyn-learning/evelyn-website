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
/** In a room known to be noisy the tutor is not paused until the words are judged, so they are judged sooner. */
export const ROOM_PARTIAL_WORDS_NOISY = 3;

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Said to the tutor beyond doubt: a call to stop, wait or say it again, or a brief answer. These are never
 *  held for the check, in a quiet room or a noisy one: "stop" must stop the tutor at once. */
const COMMAND = /^\s*(?:(?:oh|um|uh|hey|so|okay|ok|sorry|please|excuse me)[, ]+)*(?:stop|wait|hold on|hang on|pause|one (?:moment|second|sec|minute)|just a (?:moment|second|sec|minute)|excuse me|sorry|pardon|what|what was that|what did you say|(?:can|could|would) you (?:please )?(?:repeat|say|stop|wait|slow|go|pause|hold)\b.*|say (?:that|it) again|(?:please )?repeat (?:that|it)?|(?:once|one more) (?:more|time)|again|slower|slow down|too fast|go on|go ahead|carry on|continue|i (?:can'?t|cannot|didn'?t|did not|couldn'?t) (?:hear|catch|follow|get) .*|i(?:'m| am) (?:lost|confused|not sure|here|back|ready)\b.*|i (?:don'?t|do not) (?:know|understand|get it)\b.*)[\s.,!?…]*$/i;
const BRIEF = /^\s*(?:(?:oh|um|uh|well|so)[, ]+)*(?:yes|yeah|yep|yup|ya|ok|okay|sure|alright|all right|right|mhm|uh[- ]?huh|no|nope|nah|not yet|not really|maybe|i think so|i guess|got it|makes sense|i do|i don'?t|thanks|thank you)\b[\s\w',.!?]*$/i;

export function plainlyTheStudent(text: string): boolean {
  const n = wordCount(text);
  if (!n) return false;
  if (n <= 12 && COMMAND.test(text)) return true;
  return n <= 4 && BRIEF.test(text);
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

export const ROOM_CHECK_SYSTEM = `A tutor and one student are in a spoken lesson. The student's microphone also picks up other voices in the room: a television or radio, a video playing, other people talking to each other. You are given what the tutor has just been saying and a stretch of speech the microphone picked up. Decide who the speech belongs to.

STUDENT: one person speaking to the tutor, about anything at all.
- An answer or an attempt at one, however short, wrong or hesitant. A question about the lesson.
- The recogniser mishears. Speech that picks up the tutor's own words or numbers, even turned into soundalikes that make no sense as written, is the student answering.
- Anything a person says to whoever they are talking with: a request (stop, wait, repeat, slower, something else), a remark about themselves or what is happening around them ("I need a minute", "my dog just got sick", "the TV is on"), small talk or a question on another subject ("do you know who won last night?"), saying they are distracted, tired or done.
- Speech in any language.
Being off the lesson's topic never makes speech BACKGROUND by itself: students change the subject, and the tutor must hear them when they do.

BACKGROUND: speech that is not a person talking to their tutor.
- Broadcast or recorded speech: an advertisement, a list of warnings or side effects, news, weather, sports commentary, a narrator, a programme's dialogue, an announcement.
- People in the room talking to each other, or the student plainly talking to someone else ("Mom, close the door").
- A stray fragment in the manner of the above: it answers nothing the tutor said, and it is not something a person would say to the one they are talking with.

When you cannot tell, answer STUDENT.

Reply with one word: STUDENT or BACKGROUND.`;

export function roomCheckMessage(i: { tutorSaid: string; heard: string; earlier?: string[] }): string {
  const earlier = (i.earlier ?? []).filter(Boolean).slice(-2);
  return [
    `The tutor has just been saying:\n${i.tutorSaid.trim().slice(-700) || '(nothing yet)'}`,
    ...(earlier.length ? [`Earlier in this session the microphone picked up these, which were not the student:\n${earlier.map((x) => `- ${x.slice(0, 160)}`).join('\n')}`] : []),
    `The microphone picked up:\n${i.heard.trim().slice(0, 600)}`,
  ].join('\n\n');
}

/** The line in the turn's facts, once, when the room has become noisy (facts.ts). */
export function roomVoicesFact(times: number): string {
  return `the room: other voices near the student (a television, a radio or people talking to each other) have been picked up ${times} times and were left out; the student has not been told. Tell them now, once, in one short sentence at the start of this reply: you can hear other voices near them, headphones or a quieter place will help, and they can type if they prefer. Then go on from where the lesson is, and do not bring it up again`;
}
