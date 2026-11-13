/**
 * Replay harness — the scripted student.
 *
 * Plays a real student from a recorded session against a tutor that may answer
 * differently than it did on the day. The fixture describes who the student is,
 * the things they do in order ("beats") and how they react when the tutor
 * misbehaves ("reactions"). Each reply carries a tag; the complaint tags are
 * the harness's main measure — the student complains only when provoked, so a
 * better tutor earns fewer of them (./scorecard.ts).
 *
 * The model call is injectable: tests pass a stub, so the unit suite makes no
 * network call. The default is one Haiku call per student turn.
 */
import Anthropic from '@anthropic-ai/sdk';
import { loadApiKey } from '../../tutor-e2e/llm';

export type StudentTag =
  | 'answer' | 'question' | 'request' | 'ack'
  | 'complaint_reask' | 'complaint_ignored' | 'complaint_lost' | 'move_on' | 'verdict_only'
  | 'recap_request' | 'end_request' | 'end';

export const COMPLAINT_TAGS: ReadonlyArray<StudentTag> = ['complaint_reask', 'complaint_ignored', 'complaint_lost', 'move_on', 'verdict_only'];

export interface FixtureStudent {
  who: string;
  voice: string;
  beats: Array<{ id: string; when: string; do: string; once?: boolean }>;
  reactions: Array<{ tag: StudentTag; when: string; do: string; once?: boolean }>;
  /** Things the real student said, for tone and firmness. */
  sampleLines?: string[];
  /** How this student carries themselves, when it matters for the script. */
  manner?: string;
}

export interface Fixture {
  name: string;
  sourceSessions: string[];
  partner: string;
  claims: Record<string, unknown>;
  maxMinutes: number;
  maxStudentTurns: number;
  student: FixtureStudent;
}

export type ReplayTurn = { role: 'tutor' | 'student'; text: string; tag?: StudentTag };

export type CompleteFn = (system: string, messages: { role: 'user' | 'assistant'; content: string }[]) => Promise<string>;

export const SCRIPTED_STUDENT_MODEL_ID = 'claude-haiku-4-5-20251001';

const TAGS: StudentTag[] = ['answer', 'question', 'request', 'ack', 'complaint_reask', 'complaint_ignored', 'complaint_lost', 'move_on', 'verdict_only', 'recap_request', 'end_request', 'end'];

export function buildStudentSystemPrompt(student: FixtureStudent): string {
  const beats = student.beats.map((b) => `- [${b.id}${b.once ? ', once only' : ''}] WHEN ${b.when} DO ${b.do}`).join('\n');
  const reactions = student.reactions.map((r) => `- [tag ${r.tag}${r.once ? ', once only' : ''}] WHEN ${r.when} DO ${r.do}`).join('\n');
  return [
    'You are playing a real student in a live one-to-one tutoring session. You are only ever the student: never the tutor, never a narrator.',
    `Who you are: ${student.who}`,
    `How you talk: ${student.voice}`,
    ...(student.sampleLines?.length ? ['Things you actually said in the real session (match this tone and firmness; do not reuse them word for word):', ...student.sampleLines.map((l) => `  "${l}"`)] : []),
    ...(student.manner ? [student.manner] : []),
    'Each tutor turn arrives with an [observer] line of plain facts about it (how long it was, whether it ends with a question, what you did just before). Use those facts to decide whether a reaction applies. Yardsticks: a reply of more than about 40 words to an answer you gave WITH working is a re-derivation; a question that asks about something you have just shown you can do is going back over known material — let the first one pass, react from the second.',
    'The tutor teaches on a whiteboard you can see. You receive the session as text, so assume the board shows what the tutor describes; never say you cannot see it.',
    '',
    'What you do during the session, roughly in this order (skip one whose moment never comes):',
    beats,
    '',
    'How you react. A reaction takes priority over a beat whenever its WHEN is true for the tutor\'s latest turn. React only when it really is true: a tutor who does what you asked gets a plain, cooperative reply.',
    reactions,
    '',
    'Tags: answer (you answer a question or solve a problem), question (you ask about the material), request (you ask for something for the first time), ack (a short acknowledgement), the reaction tags above, and end (the tutor has said goodbye and there is nothing left to say).',
    'Your mathematics is exactly as good as the description of you says: get right what that student would get right, and get wrong what they would get wrong.',
    'Reply with ONE line of JSON and nothing else: {"tag":"<one tag>","say":"<your spoken words>"}. For tag end, "say" may be empty.',
  ].join('\n');
}

export function parseStudentReply(raw: string): { tag: StudentTag; say: string } {
  const m = raw.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const o = JSON.parse(m[0]) as { tag?: unknown; say?: unknown };
      const tag = TAGS.includes(o.tag as StudentTag) ? (o.tag as StudentTag) : 'answer';
      return { tag, say: typeof o.say === 'string' ? o.say.trim() : '' };
    } catch { /* fall through */ }
  }
  // Not JSON: treat the whole text as the spoken words.
  return { tag: 'answer', say: raw.replace(/^["'\s]+|["'\s]+$/g, '') };
}

let client: Anthropic | null = null;
const haikuComplete: CompleteFn = async (system, messages) => {
  if (!client) client = new Anthropic({ apiKey: loadApiKey() });
  const msg = await client.messages.create({ model: SCRIPTED_STUDENT_MODEL_ID, max_tokens: 500, temperature: 0.2, system, messages });
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim();
};

/** Plain facts about the tutor's turn, given to the student with it (never sent to the tutor). */
export function observerLine(tutorSaid: string, history: ReplayTurn[]): string {
  // The driver appends "[board now shows] …" after the spoken words; judge only what was said.
  const said = tutorSaid.split('\n[board now shows]')[0];
  const n = said.split(/\s+/).filter(Boolean).length;
  const q = /[?？]["')\]]*\s*$/.test(said.trim());
  const prev = [...history].reverse().find((t) => t.role === 'student');
  const made = (tags: StudentTag[]) => history.filter((t) => t.role === 'student' && t.tag && tags.includes(t.tag)).length;
  return `[observer] this tutor turn: ${n} words, ${q ? 'ends with a question' : 'does not end with a question'}. Your previous turn was: ${prev ? prev.tag ?? 'answer' : 'none yet'}. So far you have asked to move on ${made(['move_on'])} time(s), asked for a verdict only ${made(['verdict_only'])} time(s), and repeated an ignored request ${made(['complaint_ignored', 'complaint_reask'])} time(s).`;
}

/** One student turn in reply to the tutor's latest words. `history` excludes them. */
export async function scriptedStudentTurn(
  student: FixtureStudent,
  tutorSaid: string,
  history: ReplayTurn[],
  opts?: { complete?: CompleteFn },
): Promise<{ tag: StudentTag; say: string }> {
  const complete = opts?.complete ?? haikuComplete;
  // The student is the model being completed, so its own turns are "assistant".
  const messages = [
    ...history.map((t) => ({
      role: (t.role === 'tutor' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: t.role === 'tutor' ? t.text : JSON.stringify({ tag: t.tag ?? 'answer', say: t.text }),
    })),
    { role: 'user' as const, content: `${tutorSaid}\n${observerLine(tutorSaid, history)}` },
  ];
  // The API needs the first message to be a user turn and roles to alternate.
  const merged: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const m of messages) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.content += `\n${m.content}`;
    else merged.push({ ...m });
  }
  if (merged[0]?.role === 'assistant') merged.unshift({ role: 'user', content: '(the session begins)' });
  return parseStudentReply(await complete(buildStudentSystemPrompt(student), merged));
}
