/**
 * Turn-shape facts for the brain — TEXT mode (2026-10-06).
 *
 * Why. With text-mode thinking on (./text-thinking.ts) the replay of 23
 * scripted sessions still showed two classes unchanged: a bare "yes" to an
 * open wh-question praised (3 of 11), and a correct hedged answer denied or
 * not credited (5 of 12). In each, the model had to work out for itself what
 * kind of thing the student had typed and which question was open — and got
 * that sorting wrong before it ever reached the mathematics. The runtime
 * already does this sorting deterministically for the counting path
 * (orchestrator/student-turn-shape.ts, answer-attempt.ts,
 * voice/nonanswer-praise.ts); this module hands the same facts to the brain
 * in the uncached per-turn content, next to <verdict_guard>, with the rule
 * that follows from each.
 *
 * What it is NOT: a judgement of correctness. It says "a bare value", never
 * "a wrong value". The verdict pre-check (./verdict-precheck.ts) is the part
 * that checks.
 *
 * Wording is generic — no subject content, no example values (repo rule).
 *
 *   TUTOR_TEXT_TURN_SHAPE   unset/anything ⇒ ON for text sessions · 'off' ⇒
 *                           no block (user content as before). Voice: never.
 *
 * Pure — no SDK import, no I/O. `npm run test:turn-shape-signal`.
 */
import { isAnswerAttempt, isBareShortAnswer } from '@/lib/tutor/orchestrator/answer-attempt';
import { isHedgedProposal, isSelfReport, isStudentQuestion } from '@/lib/tutor/orchestrator/student-turn-shape';
import {
  classifyNonAnswer,
  isBareAssent,
  isPureAcknowledgment,
  readOpenQuestion,
  type OpenQuestionRead,
} from '@/lib/tutor/voice/nonanswer-praise';

export type StudentMessageShape =
  | 'bare_assent'       // only yes / yeah / ok
  | 'bare_dissent'      // only no / nope
  | 'acknowledgment'    // "got it", "makes sense" — nothing proposed
  | 'hedged_proposal'   // "I don't know, maybe X?"
  | 'check_request'     // "can you check my answer X"
  | 'request'           // asks for something
  | 'question'          // asks something
  | 'no_answer'         // says they do not know, nothing proposed
  | 'bare_token'        // a bare value / one to three words
  | 'answer'            // a fuller answer or statement
  | 'other';

export interface TurnShape {
  shape: StudentMessageShape;
  /** The value / claim proposed, for hedged proposals, bare tokens and check
   *  requests. */
  proposed?: string;
  /** The tutor's last question, when one is open. */
  open: OpenQuestionRead | null;
  /** The message proposes a value or claim that can be checked (the verdict
   *  pre-check runs on these and on nothing else). */
  answerShaped: boolean;
}

/** Text thinking's sibling switch: text session and flag not 'off'. */
export function textTurnShapeEnabled(
  inputMode: unknown,
  flag: string | undefined = process.env.TUTOR_TEXT_TURN_SHAPE,
): boolean {
  return inputMode === 'text' && flag !== 'off';
}

const LEAD_IN_RE = /^(?:(?:um+|uh+|er+|hmm+|so|well|okay|ok|oh|wait|and|but|sorry|honestly|actually|like)[,.\s]+)+/i;
const NOT_KNOWING_LEAD_RE =
  /^(?:i\s+(?:do\s+not|don'?t|dont|really\s+don'?t)\s+(?:really\s+)?know|idk|dunno|no\s+idea|(?:i'?m|i\s+am)\s+not\s+(?:really\s+|so\s+|too\s+)?sure|not\s+sure|i\s+forgot|i\s+forget)\b[\s,.;:!?…—–-]*/i;
const HEDGE_WORD_RE =
  /^(?:(?:but|so|um+|uh+)[\s,]+)*(?:(?:maybe|perhaps|probably|possibly|i\s+think|i\s+guess|i'?d\s+say|i\s+suppose|is\s+it|could\s+it\s+be|would\s+it\s+be|might\s+(?:it\s+)?be|i\s+got)\s+)+(?:(?:it'?s|it\s+is|that'?s|that|like)\s+)?/i;

const PROPOSED_MAX_CHARS = 200;
const LONG_STATEMENT_MIN_WORDS = 8;

/** The value a hedged message proposes: the message without its statement of
 *  not knowing and its hedge words. Never empty for a real proposal. */
export function hedgedProposedValue(studentText: string): string {
  let t = (studentText ?? '').trim().replace(LEAD_IN_RE, '');
  t = t.replace(NOT_KNOWING_LEAD_RE, '').replace(HEDGE_WORD_RE, '');
  t = t.replace(/[\s?.!]+$/, '').trim();
  return (t || (studentText ?? '').trim()).slice(0, PROPOSED_MAX_CHARS);
}

/** A statement of not knowing followed by a hedge word and something proposed
 *  ("I don't know, maybe <a phrase>?"), or a message that opens on a plain
 *  hedge word ("maybe <a phrase>?"). `isHedgedProposal` reads a trailing "?"
 *  on a longer phrase as a question; with this lead it is a proposal. */
const PLAIN_HEDGE_LEAD_RE = /^(?:maybe|perhaps|probably|possibly|i\s+think|i\s+guess|i'?d\s+say|i\s+suppose)\s+\S/i;
function isHedgedProse(text: string): boolean {
  const t = text.trim().replace(LEAD_IN_RE, '');
  const afterLead = t.replace(NOT_KNOWING_LEAD_RE, '');
  if (afterLead !== t) return HEDGE_WORD_RE.test(afterLead) && afterLead.replace(HEDGE_WORD_RE, '').trim().length > 0;
  return PLAIN_HEDGE_LEAD_RE.test(t);
}

/** "can you check my answer X", "check this: X", "is my answer X right?" */
const CHECK_REQUEST_RE =
  /^(?:(?:please|hey|ok(?:ay)?|so)[,\s]+)*(?:(?:can|could|would|will)\s+(?:you|u)\s+(?:please\s+)?(?:check|verify|confirm|look\s+at|grade|mark)\b|(?:please\s+)?(?:check|verify|confirm)\s+(?:my|this|that|the|if|whether)\b|is\s+(?:my|this)\s+(?:answer|work|solution|step)\b)/i;
const CHECK_VALUE_RE =
  /\b(?:my|this|that|the)\s+(?:final\s+)?(?:answer|work|solution|step|result|working)\b\s*(?:(?:is|was|of|for|to)\b\s*)?[:=,—–-]?\s*(.+)$/i;

function checkRequestValue(text: string): string | null {
  const t = text.trim();
  if (!CHECK_REQUEST_RE.test(t)) return null;
  const m = CHECK_VALUE_RE.exec(t);
  const v = (m?.[1] ?? '').replace(/\b(?:right|correct|ok(?:ay)?)\s*\??\s*$/i, '').replace(/[\s?.!]+$/, '').trim();
  return v.length > 0 ? v.slice(0, PROPOSED_MAX_CHARS) : '';
}

/** The shape of what the student typed, and the tutor question it meets.
 *  Null for an empty or synthetic ("[…]") turn. Never throws. */
export function classifyTurnShape(studentText: string, priorTutorTurn: string): TurnShape | null {
  const t = (studentText ?? '').trim();
  if (!t || t.startsWith('[')) return null;
  const open = readOpenQuestion(priorTutorTurn ?? '');
  const done = (shape: StudentMessageShape, proposed?: string): TurnShape => ({
    shape,
    ...(proposed ? { proposed } : {}),
    open,
    answerShaped: shape === 'hedged_proposal' || shape === 'bare_token' || shape === 'answer'
      || (shape === 'check_request' && !!proposed),
  });
  if (isBareAssent(t)) return done(/^(?:\W|um+|uh+|oh|well|so|hmm+)*n/i.test(t) ? 'bare_dissent' : 'bare_assent');
  if (isPureAcknowledgment(t)) return done('acknowledgment');
  if (isHedgedProposal(t) || isHedgedProse(t)) return done('hedged_proposal', hedgedProposedValue(t));
  const checked = checkRequestValue(t);
  if (checked !== null) return checked ? done('check_request', checked) : done('request');
  const non = classifyNonAnswer(t);
  if (non === 'idk') return done('no_answer');
  if (non === 'request') return done('request');
  if (isSelfReport(t)) return done('no_answer');
  if (isStudentQuestion(t)) return done('question');
  if (isBareShortAnswer(t)) return done('bare_token', t.replace(/[\s?.!]+$/, '').slice(0, PROPOSED_MAX_CHARS));
  if (isAnswerAttempt(t)) return done('answer');
  // A longer statement that is none of the above (not a question, a request
  // or a self-report) is an answer in prose — the usual shape outside maths.
  if (t.split(/\s+/).length > LONG_STATEMENT_MIN_WORDS) return done('answer');
  return done('other');
}

// ── a calculation written out in the message, checked by calculator ────────
//
// 2026-10-06: a student wrote a division with the wrong quotient inside an
// otherwise tidy line of working. The recorded tutor accepted it, and so —
// with high confidence — did the verdict pre-check on its first bench run
// (it answered in about a second and had plainly not recomputed). A written
// "a ∘ b ∘ c = d" between plain numbers needs no model.
//
// Strict on purpose (student text is messy): operands are plain numbers not
// glued to a letter or a percent sign; "x" counts as times only with a space
// on each side; the run must not be the tail of a longer expression; and the
// two sides must differ by more than rounding. Anything else is not judged.

const ARITH_NUM = '\\d+(?:\\.\\d+)?';
const ARITH_OP = '(?:\\s*[+\\-−*/×÷]\\s*|\\s+x\\s+)';
const ARITH_RE = new RegExp(
  `(?<![\\w.%^)}\\]]|[+\\-−*/×÷^]\\s{0,2}|\\sx\\s|\\b(?:of|times|plus|minus|by|over|from)\\s+)(${ARITH_NUM}(?:${ARITH_OP}${ARITH_NUM})+)\\s*=\\s*(${ARITH_NUM})(?![\\d.]*[%^]|[\\d.]*[a-wyz]\\w*\\s*[+\\-−*/×÷^]|${ARITH_OP}${ARITH_NUM})`,
  'gi',
);

function evalArithmetic(expr: string): number | null {
  const tokens = expr.replace(/\s+x\s+/gi, '*').replace(/[×]/g, '*').replace(/[÷]/g, '/').replace(/−/g, '-').match(/\d+(?:\.\d+)?|[+\-*/]/g);
  if (!tokens || tokens.length % 2 === 0) return null;
  // × and ÷ first, left to right; then + and −.
  const terms: number[] = [Number(tokens[0])];
  const signs: number[] = [1];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const n = Number(tokens[i + 1]);
    if (!Number.isFinite(n)) return null;
    if (op === '*') terms[terms.length - 1] *= n;
    else if (op === '/') { if (n === 0) return null; terms[terms.length - 1] /= n; }
    else { terms.push(n); signs.push(op === '+' ? 1 : -1); }
  }
  const v = terms.reduce((sum, t, i) => sum + signs[i] * t, 0);
  return Number.isFinite(v) ? v : null;
}

function fmtNumber(v: number): string {
  return String(Math.round(v * 1e6) / 1e6);
}

/** The first written calculation in the message whose stated result is wrong.
 *  Null when there is none (or none that can be judged with certainty). */
export function falseArithmeticIn(studentText: string): { claim: string; correct: string } | null {
  const t = (studentText ?? '');
  if (/≈|~|\b(?:about|roughly|approximately|around)\b/i.test(t)) return null;
  ARITH_RE.lastIndex = 0;
  for (let m = ARITH_RE.exec(t); m; m = ARITH_RE.exec(t)) {
    const value = evalArithmetic(m[1]);
    const stated = Number(m[2]);
    if (value === null || !Number.isFinite(stated)) continue;
    const tolerance = Math.max(0.0051, Math.abs(value) * 0.011);
    if (Math.abs(value - stated) > tolerance) {
      const lhs = m[1].replace(/\s+/g, ' ').trim();
      return { claim: `${lhs} = ${m[2]}`, correct: `${lhs} = ${fmtNumber(value)}` };
    }
  }
  return null;
}

/** A bare assent / dissent / acknowledgment that does not settle the open
 *  question: it cannot answer it (wh-) or does not say which (either/or). */
export function assentSettlesNothing(ts: TurnShape | null): boolean {
  if (!ts?.open) return false;
  if (ts.shape !== 'bare_assent' && ts.shape !== 'bare_dissent' && ts.shape !== 'acknowledgment') return false;
  return ts.open.kind === 'wh' || ts.open.kind === 'either_or';
}

const KIND_FACT: Record<OpenQuestionRead['kind'], string> = {
  wh: 'an open question — it asks for a value, a step, a reason or a statement; a yes or no cannot answer it',
  either_or: 'an either/or question — it offers alternatives; a bare yes or no does not say which one',
  yes_no: 'a yes/no question',
  readiness: 'a readiness or comprehension check, or an offer — a yes or no answers it',
  unclear: 'not classified',
};

function quote(s: string): string {
  return `"${s.replace(/\s+/g, ' ').replace(/"/g, "'").trim()}"`;
}

function shapeFact(ts: TurnShape): string {
  switch (ts.shape) {
    case 'bare_assent': return 'a bare assent — nothing but a yes / ok';
    case 'bare_dissent': return 'a bare dissent — nothing but a no';
    case 'acknowledgment': return 'an acknowledgment — it proposes nothing';
    case 'hedged_proposal': return `a hedged proposal — they say they are unsure and then propose ${quote(ts.proposed ?? '')}`;
    case 'check_request': return `a request to check a value they give: ${quote(ts.proposed ?? '')}`;
    case 'request': return 'a request — it asks you for something and proposes no answer';
    case 'question': return 'a question of their own — it proposes no answer';
    case 'no_answer': return 'a statement of not knowing — nothing is proposed';
    case 'bare_token': return `a bare value with nothing around it: ${quote(ts.proposed ?? '')}`;
    case 'answer': return 'a fuller answer or statement';
    default: return 'not classified';
  }
}

/** The rules for a reply that opens with the working ("work it, then match",
 *  ./work-then-match.ts). Same facts, same sorting; only what the reply does
 *  with an answer differs. Null ⇒ the ordinary rule applies unchanged. */
function rulesForWorkThenMatch(ts: TurnShape): string[] | null {
  const kind = ts.open?.kind;
  if (ts.shape === 'bare_assent' || ts.shape === 'bare_dissent') {
    if (kind === 'wh' || kind === 'either_or') return null;
    return [
      'It answers the question as asked. If that question was an offer or a check on readiness, it is consent, not an answer to grade: no verdict word — do what was agreed.',
      'If the question had a right answer: work it in a sentence, state the result, and then say whether that agrees with their yes or no — no verdict word first.',
    ];
  }
  switch (ts.shape) {
    case 'bare_token':
      return [
        'Check this value against the OPEN question above — not against an earlier question, and not against the final answer of the problem unless that is what the open question asks for.',
        'If it is a possible answer to the open question: work that step, state its result, and then say whether it is the value they gave.',
        'If it is not a possible answer to the open question (it is the wrong kind of thing for it, or it repeats the answer to an earlier question), it is not an answer to it: no verdict of any kind, do not answer the open question for them — ask what it refers to, or ask the open question again.',
      ];
    case 'hedged_proposal':
      return [
        'It IS an answer: treat the proposed value exactly as if it had been stated plainly. Uncertainty is not wrongness.',
        'First decide which question the proposed value answers — the open question above, or the problem being worked as a whole (its final answer, or another part of it). Work THAT, state the result, and say whether it is the value they proposed.',
        'If the value is the final answer of the problem while your question was about a smaller step: show the remaining step briefly, reach the result, and say that it is the value they gave and that it is the final answer. Never send them back to the smaller step as though the value were wrong.',
      ];
    case 'check_request':
      return [
        'Work the question the value actually answers, state the result, and then say whether it is the value they gave. It is not an answer to the open question unless it fits that question.',
        'If it cannot be an answer to anything on the table, say so and ask which problem or step it belongs to — no verdict of any kind.',
      ];
    case 'answer':
      return [
        'Decide which question it answers — the open question above, or another part of the problem — and work THAT from the student\'s own problem; check every value in their message against your working before you say whether it matches.',
      ];
    default:
      return null;
  }
}

function rulesFor(ts: TurnShape): string[] {
  const kind = ts.open?.kind;
  const assentLike = ts.shape === 'bare_assent' || ts.shape === 'bare_dissent' || ts.shape === 'acknowledgment';
  if (assentLike) {
    if (kind === 'wh') {
      return [
        'This message is NOT an answer to the open question. Do not open with a verdict or praise word, and do not answer the question yourself.',
        ts.open?.earlierYesNo
          ? 'At most it agrees to an earlier yes/no question in your last message. Take that as agreement to go on and go straight to the open question: ask it again briefly, or offer a smaller first step.'
          : 'Ask the open question again briefly, or offer a smaller first step.',
        'Never end or wrap up the session on this message.',
      ];
    }
    if (kind === 'either_or') {
      return [
        'This message is AMBIGUOUS: it does not say which alternative they mean. Do not pick one for them and do not open with a verdict or praise word.',
        'Ask which one they mean, in a few words, and wait.',
        'Never end or wrap up the session on an ambiguous message.',
      ];
    }
    if (ts.shape === 'acknowledgment') {
      return ['It is not an answer to grade: no verdict or praise word. Carry on from where you were.'];
    }
    return [
      'It answers the question as asked. If that question was an offer or a check on readiness, it is consent, not an answer to grade: no verdict word — do what was agreed.',
      'If the question had a right answer, check their yes or no against it before any verdict word.',
    ];
  }
  switch (ts.shape) {
    case 'bare_token':
      return [
        'Before any verdict word, check this value against the OPEN question above — not against an earlier question, and not against the final answer of the problem unless that is what the open question asks for.',
        'If it is not a possible answer to the open question (it is the wrong kind of thing for it, or it repeats the answer to an earlier question), it is not an answer to it: no verdict or praise word, do not answer the open question for them — ask what it refers to, or ask the open question again.',
      ];
    case 'hedged_proposal':
      return [
        'It IS an answer: judge the proposed value on its merits, exactly as if it had been stated plainly. Uncertainty is not wrongness.',
        'First decide which question the proposed value answers — the open question above, or the problem being worked as a whole (its final answer, or another part of it). Check it against THAT question.',
        'A value that is right for the problem is never "not quite" because the question you had just asked was about a smaller step: say it is right, then decide whether the step is still worth doing.',
      ];
    case 'check_request':
      return [
        'Check the value against the question it actually answers and tell them plainly what you found. It is not an answer to the open question unless it fits that question.',
        'If it cannot be an answer to anything on the table, say so and ask which problem or step it belongs to — no verdict or praise word.',
      ];
    case 'answer':
      return [
        'Decide which question it answers — the open question above, or another part of the problem — before you judge it, and check every value in it against the student\'s own problem.',
      ];
    case 'request':
    case 'question':
    case 'no_answer':
      return [
        'It is not an answer: no verdict or praise word anywhere in the reply, and do not answer your own open question as though they had. Respond to what they wrote.',
      ];
    default:
      return [];
  }
}

/**
 * The per-turn <turn_shape> block: the open question verbatim, its kind, the
 * shape of the student's message, and the rules that follow from that pair.
 * '' when nothing is open or the turn is synthetic — nothing to sort.
 */
export function formatTurnShapeBlock(
  ts: TurnShape | null,
  studentText?: string,
  opts?: {
    /** "Work it, then match" (./work-then-match.ts). Unset/false ⇒ as before. */
    workThenMatch?: boolean;
  },
): string {
  if (!ts) return '';
  const wtm = opts?.workThenMatch === true;
  const wrongSum = ts.answerShaped ? falseArithmeticIn(studentText ?? '') : null;
  const rules = ts.open ? ((wtm ? rulesForWorkThenMatch(ts) : null) ?? rulesFor(ts)) : [];
  if (wrongSum) {
    rules.push(wtm
      ? 'The calculation named above is wrong as written, so whatever the student built on it cannot stand: that calculation is the step your working states. Say what they wrote for it and what it actually gives, and have them carry the corrected value forward themselves.'
      : 'The calculation named above is wrong as written, so whatever the student built on it cannot be accepted as it stands: do not open with praise or a confirmation. Have them redo that one calculation — do not state its result for them.');
  }
  if (!rules.length) return '';
  return '<turn_shape>\n'
    + 'Facts about this turn, read from the text by the runtime. They describe what the message IS, not whether it is right'
    + (wrongSum ? ' — except the calculator line, which is exact' : '') + '.\n'
    + (ts.open
      ? `- The last question you asked, still open: ${quote(ts.open.question)}\n`
        + `- Kind of question: ${KIND_FACT[ts.open.kind]}.\n`
      : '')
    + `- The student's message is: ${shapeFact(ts)}.\n`
    + (wrongSum ? `- Checked by calculator: the message states ${quote(wrongSum.claim)}; in fact ${wrongSum.correct}.\n` : '')
    + 'What follows from these facts:\n'
    + rules.map((r) => `- ${r}`).join('\n') + '\n'
    + 'Never mention these facts or this sorting to the student, and never tell them that their message "is not an answer" or "does not answer" something — just respond naturally: ask what it refers to, or ask your question again.\n'
    + '</turn_shape>\n\n';
}
