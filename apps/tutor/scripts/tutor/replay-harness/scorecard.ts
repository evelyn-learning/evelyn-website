/**
 * Replay harness — the deterministic half of the scorecard.
 *
 * Works on a run bundle (./run-replay.ts): the turns as the student saw them,
 * the student's tags, and the session's stored debug events. Everything here is
 * counted, not judged; the judged measures (wrong verdicts, re-asked questions
 * the student did not complain about) are scored separately over the same
 * bundle by a reviewer.
 */
import { COMPLAINT_TAGS, type ReplayTurn, type StudentTag } from './scripted-student';

export interface RunBundle {
  fixture: string;
  arm: string;
  sessionId?: string;
  startedAt: string;
  minutes: number;
  turns: ReplayTurn[];
  /** Stored debug events of the session row: `type` and `message`. */
  events: Array<{ type: string; message: string }>;
  estimatedCost?: number;
  endedBy: 'student_end' | 'tutor_close' | 'cap' | 'stall' | 'error';
}

export interface Scorecard {
  fixture: string;
  arm: string;
  minutes: number;
  tutorTurns: number;
  studentTurns: number;
  /** Complaints the scripted student made, by tag. Lower is better. */
  complaints: Record<string, number>;
  complaintsTotal: number;
  /** Share of tutor turns that end with a question. */
  questionEndingShare: number;
  /** Tutor turns ending with a question straight after a student `answer` turn. */
  questionAfterAnswerShare: number;
  /** Words in the tutor turn that follows a verdict-only request (median). */
  wordsAfterVerdictOnly: number | null;
  /** Tutor turns after the first recap/end request until the session closed or the recap card painted. */
  tutorTurnsAfterRecapRequest: number | null;
  tutorWordsMedian: number;
  tutorWordsP90: number;
  /** Turns cut and continued mid-speech, and whole-turn retries. */
  verdictCuts: number;
  validatorRetries: number;
  narrationDrops: number;
  rendersDropped: number;
  firstSentenceMsP50: number | null;
  firstSentenceMsP95: number | null;
  inputTokens: number;
  outputTokens: number;
  costPerMinute: number | null;
  endedBy: RunBundle['endedBy'];
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const endsWithQuestion = (s: string) => /[?？]["')\]]*\s*$/.test(s.trim());
const pct = (xs: number[], p: number): number | null => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

export function scoreRun(b: RunBundle): Scorecard {
  const tutor = b.turns.filter((t) => t.role === 'tutor');
  const student = b.turns.filter((t) => t.role === 'student');
  const complaints: Record<string, number> = {};
  for (const tag of COMPLAINT_TAGS) complaints[tag] = student.filter((t) => t.tag === tag).length;

  let afterAnswer = 0; let afterAnswerQ = 0;
  const afterVerdictOnly: number[] = [];
  let recapAt = -1;
  b.turns.forEach((t, i) => {
    const next = b.turns.slice(i + 1).find((x) => x.role === 'tutor');
    if (t.role !== 'student') return;
    if (t.tag === 'answer' && next) { afterAnswer += 1; if (endsWithQuestion(next.text)) afterAnswerQ += 1; }
    if (t.tag === 'verdict_only' && next) afterVerdictOnly.push(words(next.text));
    if (recapAt < 0 && (t.tag === 'recap_request' || t.tag === 'end_request')) recapAt = i;
  });
  // After the first recap/end request: tutor turns up to and including the one that delivers a recap or a goodbye.
  let tutorTurnsAfterRecapRequest: number | null = null;
  if (recapAt >= 0) {
    const after = b.turns.slice(recapAt + 1).filter((t) => t.role === 'tutor');
    const hit = after.findIndex((t) => /\brecap\b[^?]*$|takeaway|hold onto|see you next time|wrap up here/i.test(t.text) && !/before the recap/i.test(t.text));
    tutorTurnsAfterRecapRequest = hit >= 0 ? hit + 1 : after.length;
  }

  const tw = tutor.map((t) => words(t.text));
  const count = (type: string) => b.events.filter((e) => e.type === type).length;
  const firstMs: number[] = []; let inTok = 0; let outTok = 0;
  for (const e of b.events) {
    if (e.type !== 'brain_turn') continue;
    const fs = e.message.match(/first_sentence=(\d+)ms/); if (fs) firstMs.push(Number(fs[1]));
    const io = e.message.match(/in=(\d+) out=(\d+)(?: cr=(\d+))?(?: cc=(\d+))?/);
    if (io) { inTok += Number(io[1]) + Number(io[3] ?? 0) + Number(io[4] ?? 0); outTok += Number(io[2]); }
  }
  const tagCounts = (tags: StudentTag[]) => student.filter((t) => t.tag && tags.includes(t.tag)).length;
  return {
    fixture: b.fixture, arm: b.arm, minutes: round(b.minutes, 1),
    tutorTurns: tutor.length, studentTurns: student.length,
    complaints, complaintsTotal: tagCounts([...COMPLAINT_TAGS]),
    questionEndingShare: tutor.length ? round(tutor.filter((t) => endsWithQuestion(t.text)).length / tutor.length) : 0,
    questionAfterAnswerShare: afterAnswer ? round(afterAnswerQ / afterAnswer) : 0,
    wordsAfterVerdictOnly: pct(afterVerdictOnly, 50),
    tutorTurnsAfterRecapRequest,
    tutorWordsMedian: pct(tw, 50) ?? 0, tutorWordsP90: pct(tw, 90) ?? 0,
    verdictCuts: count('voice_verdict_cut'), validatorRetries: count('brain_validator_retry'),
    narrationDrops: count('meta_narration_dropped'), rendersDropped: count('render_dropped'),
    firstSentenceMsP50: pct(firstMs, 50), firstSentenceMsP95: pct(firstMs, 95),
    inputTokens: inTok, outputTokens: outTok,
    costPerMinute: b.estimatedCost != null && b.minutes > 0 ? round(b.estimatedCost / b.minutes, 3) : null,
    endedBy: b.endedBy,
  };
}

/** Mean of each numeric measure over several runs of one arm. */
export function averageScorecards(cards: Scorecard[]): Record<string, number | string | null> {
  if (!cards.length) return {};
  const out: Record<string, number | string | null> = { fixture: cards[0].fixture, arm: cards[0].arm, runs: cards.length };
  const keys = Object.keys(cards[0]).filter((k) => typeof (cards[0] as unknown as Record<string, unknown>)[k] === 'number' || (cards[0] as unknown as Record<string, unknown>)[k] === null);
  for (const k of keys) {
    const vals = cards.map((c) => (c as unknown as Record<string, number | null>)[k]).filter((v): v is number => typeof v === 'number');
    out[k] = vals.length ? round(vals.reduce((a, v) => a + v, 0) / vals.length) : null;
  }
  for (const tag of COMPLAINT_TAGS) out[`complaints.${tag}`] = round(cards.reduce((a, c) => a + (c.complaints[tag] ?? 0), 0) / cards.length);
  return out;
}
